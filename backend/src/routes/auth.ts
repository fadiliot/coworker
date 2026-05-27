import { Router, Request, Response } from 'express';
import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';
import { prisma } from '../index';
import { encrypt } from '../utils/crypto';

const router = Router();

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || 'common'}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET || '',
  }
};

const pca = new ConfidentialClientApplication(msalConfig);

const REDIRECT_URI = process.env.AZURE_REDIRECT_URI || 'http://localhost:3001/api/auth/microsoft/callback';

router.get('/microsoft', (req: Request, res: Response) => {
  // In a real app, you'd associate this flow with a logged-in User
  // For MVP, we'll assume a single admin user or pass userId in state
  const authCodeUrlParameters = {
    scopes: ['user.read', 'mail.read', 'mail.send', 'offline_access'],
    redirectUri: REDIRECT_URI,
    state: req.query.userId as string || 'default-admin-id' 
  };

  pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
    res.redirect(response);
  }).catch((error) => {
    console.error("Error generating auth code url", error);
    res.status(500).send("Error connecting to Microsoft");
  });
});

router.get('/microsoft/callback', async (req: Request, res: Response) => {
  const tokenRequest = {
    code: req.query.code as string,
    scopes: ['user.read', 'mail.read', 'mail.send', 'offline_access'],
    redirectUri: REDIRECT_URI,
  };

  try {
    const response = await pca.acquireTokenByCode(tokenRequest);
    
    if (response && response.account) {
      const email = response.account.username;
      
      // For MVP, find or create the default Admin User
      let user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (!user) {
        user = await prisma.user.create({
          data: { email: 'admin@saleshub.local', password: 'hashed_password', role: 'ADMIN' }
        });
      }

      // Upsert the Account
      await prisma.account.upsert({
        where: { emailAddress: email },
        create: {
          userId: user.id,
          provider: 'microsoft',
          emailAddress: email,
          accessToken: encrypt(response.accessToken),
          refreshToken: (response as any).refreshToken ? encrypt((response as any).refreshToken) : null,
          expiresAt: response.expiresOn ? Math.floor(response.expiresOn.getTime() / 1000) : null
        },
        update: {
          accessToken: encrypt(response.accessToken),
          refreshToken: (response as any).refreshToken ? encrypt((response as any).refreshToken) : undefined,
          expiresAt: response.expiresOn ? Math.floor(response.expiresOn.getTime() / 1000) : null
        }
      });

      res.send('Microsoft Account connected successfully! You can close this window.');
    } else {
      res.status(400).send('Authentication failed');
    }
  } catch (error) {
    console.error("Error acquiring token", error);
    res.status(500).send("Authentication failed");
  }
});

export default router;
