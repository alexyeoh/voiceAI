import { Conversation } from '@11labs/client';
const agentId = import.meta.env.VITE_AGENT_ID;

let conversation: Conversation | null = null;

const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
const statusText = document.getElementById('status')!;
const agentStatusText = document.getElementById('agentStatus')!;

startBtn.addEventListener('click', async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });

    conversation = await Conversation.startSession({
      agentId: agentId, // Replace with your actual agent ID
      onConnect: () => {
        statusText.textContent = 'Status: connected';
        startBtn.disabled = true;
        stopBtn.disabled = false;
      },
      onDisconnect: () => {
        statusText.textContent = 'Status: disconnected';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        agentStatusText.textContent = 'Agent is: idle';
      },
      onMessage: (msg) => {
        console.log('Message:', msg);
        // Optional: try parsing message to infer agent state
      },
      onError: (err) => {
        console.error('Error:', err);
        statusText.textContent = 'Status: error';
      }
    });

  } catch (error) {
    console.error('Failed to start conversation:', error);
    statusText.textContent = 'Status: failed to start';
  }
});

stopBtn.addEventListener('click', async () => {
  if (conversation) {
    await conversation.endSession();
    conversation = null;
  }
});
