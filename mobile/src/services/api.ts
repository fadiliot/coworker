const API_BASE = 'http://localhost:3001/api'; // Change to your server IP for physical device

// --- DUMMY DATA (used as fallback when backend is not running) ---
const DUMMY_TASKS = [
  {
    id: '1',
    type: 'DRAFT_RESPONSE',
    status: 'PENDING_APPROVAL',
    payload: { draftText: "Hi Alice,\n\nThank you for reaching out! We'd love to schedule a demo for you.\n\nAre you available for a 30-minute call this week?\n\nBest regards" },
    createdAt: new Date().toISOString(),
    emailMessage: { from: 'alice@techcorp.io', subject: 'Demo Request', leads: [{ name: 'Alice Freeman', company: 'TechCorp' }] },
  },
  {
    id: '2',
    type: 'SCHEDULE_FOLLOW_UP',
    status: 'PENDING_APPROVAL',
    payload: { draftText: "Hi Bob,\n\nJust following up on your pricing inquiry. Happy to put together a customized plan for Acme Inc.\n\nLet me know!" },
    createdAt: new Date().toISOString(),
    emailMessage: { from: 'bob@acme.com', subject: 'Pricing Inquiry', leads: [{ name: 'Bob Smith', company: 'Acme Inc' }] },
  },
];

const DUMMY_LEADS = [
  { id: '1', name: 'Alice Freeman', email: 'alice@techcorp.io', company: 'TechCorp', intent: 'Demo Request', status: 'CONTACTED', tasks: 2, createdAt: '2026-05-11' },
  { id: '2', name: 'Bob Smith', email: 'bob@acme.com', company: 'Acme Inc', intent: 'Pricing Inquiry', status: 'NEW', tasks: 1, createdAt: '2026-05-11' },
  { id: '3', name: 'Charlie Davis', email: 'cdavis@startup.co', company: 'Startup.co', intent: 'API Integration', status: 'QUALIFIED', tasks: 3, createdAt: '2026-05-10' },
  { id: '4', name: 'Diana Prince', email: 'diana@enterprise.io', company: 'Enterprise IO', intent: 'Enterprise Plan', status: 'QUALIFIED', tasks: 2, createdAt: '2026-05-09' },
  { id: '5', name: 'Ethan Grey', email: 'ethan@pixelworks.io', company: 'PixelWorks', intent: 'Trial Request', status: 'LOST', tasks: 0, createdAt: '2026-05-08' },
];

export const fetchPendingTasks = async () => {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) throw new Error('failed');
    return res.json();
  } catch {
    return DUMMY_TASKS;
  }
};

export const performTaskAction = async (taskId: string, action: string, editedPayload?: any) => {
  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, editedPayload }),
    });
    return res.json();
  } catch {
    return { message: 'Simulated locally' };
  }
};

export const fetchLeads = async () => {
  return DUMMY_LEADS; // Leads use dummy data for mobile MVP
};

export const getLeadById = (id: string) => {
  return DUMMY_LEADS.find((l) => l.id === id) || null;
};
