export const API_BASE_URL = 'http://localhost:3001/api';

// Simple helper to get token (in a real app, use HTTP-only cookies or NextAuth)
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const fetchTasks = async () => {
  const token = getToken();
  // Using dummy data if no backend is running yet
  try {
     const res = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
     });
     if (!res.ok) throw new Error('Failed to fetch tasks');
     return res.json();
  } catch (error) {
     console.warn("Backend not reachable, returning dummy tasks", error);
     return [
       {
         id: "1",
         type: "DRAFT_RESPONSE",
         status: "PENDING_APPROVAL",
         payload: { draftText: "Hi Alice,\n\nThanks for reaching out! We'd love to schedule a demo..." },
         createdAt: new Date().toISOString(),
         emailMessage: {
           from: "alice@example.com",
           subject: "Demo Request",
           leads: [{ name: "Alice Freeman", company: "TechCorp" }]
         }
       }
     ];
  }
};

export const approveTask = async (taskId: string, action: string, editedPayload?: any) => {
   const token = getToken();
   try {
     const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, editedPayload })
     });
     return res.json();
   } catch (error) {
     console.warn("Backend not reachable, simulating approval", error);
     return { message: "Task action simulated locally." };
   }
};
