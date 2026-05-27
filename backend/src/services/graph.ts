import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';
import { prisma } from '../index';
import { decrypt, encrypt } from '../utils/crypto';
import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || 'common'}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET || '',
  }
};
const pca = new ConfidentialClientApplication(msalConfig);

/**
 * Ensures we have a valid access token. If expired, refreshes it.
 */
export const getValidAccessToken = async (accountId: string): Promise<string> => {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account || !account.accessToken) throw new Error("Account not found or not connected");

  const now = Math.floor(Date.now() / 1000);
  if (account.expiresAt && account.expiresAt > now + 300) {
    // Token is still valid (more than 5 mins remaining)
    return decrypt(account.accessToken);
  }

  // Token expired or close to expiring, need to refresh
  if (!account.refreshToken) throw new Error("No refresh token available");

  const refreshToken = decrypt(account.refreshToken);
  try {
    const response = await pca.acquireTokenByRefreshToken({
      refreshToken,
      scopes: ['user.read', 'mail.read', 'mail.send', 'offline_access']
    });

    if (!response || !response.accessToken) throw new Error("Failed to refresh token");

    // Save new tokens
    await prisma.account.update({
      where: { id: accountId },
      data: {
        accessToken: encrypt(response.accessToken),
        refreshToken: (response as any).refreshToken ? encrypt((response as any).refreshToken) : undefined,
        expiresAt: response.expiresOn ? Math.floor(response.expiresOn.getTime() / 1000) : null
      }
    });

    return response.accessToken;
  } catch (error) {
    console.error("Token refresh failed", error);
    throw error;
  }
};

/**
 * Initializes a Microsoft Graph Client for a specific account.
 */
export const getGraphClient = async (accountId: string): Promise<Client> => {
  const accessToken = await getValidAccessToken(accountId);
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
};

/**
 * Fetches recent unread emails from the inbox.
 */
export const fetchNewEmails = async (accountId: string) => {
  const client = await getGraphClient(accountId);
  
  // Get unread messages from Inbox
  const messages = await client.api('/me/mailFolders/inbox/messages')
    .filter('isRead eq false')
    .select('id,subject,bodyPreview,body,from,toRecipients,receivedDateTime,conversationId')
    .top(10)
    .get();

  return messages.value;
};

/**
 * Sends an email using Microsoft Graph.
 * If threadId (internetMessageId) is provided, it replies to the thread.
 */
export const sendEmail = async (accountId: string, to: string, subject: string, body: string, conversationId?: string) => {
  const client = await getGraphClient(accountId);

  const message: any = {
    subject: subject,
    body: {
      contentType: 'Text',
      content: body
    },
    toRecipients: [
      { emailAddress: { address: to } }
    ]
  };

  // Note: Microsoft Graph /reply endpoint handles threading automatically if we know the message ID.
  // For standard send, we just use /sendMail
  await client.api('/me/sendMail').post({ message, saveToSentItems: true });
};
