const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Base URL dinamis: default = origin halaman ini
const metaApiBase = document.querySelector('meta[name="api-base"]');
const API_BASE = (metaApiBase?.content || window.location.origin).replace(/\/+$/, ''); // trim trailing slash

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Tampilkan indikator "typing"
  const thinkingEl = appendMessage('bot', 'Thinking...');

  try {
    // Kirim ke /chat dengan body { prompt: "..." }
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // kalau perlu kirim cookie/session ke origin lain, gunakan: credentials: 'include'
      body: JSON.stringify({ prompt: userMessage })
    });

    if (!res.ok) {
      // Ambil error text kalau ada
      const errText = await res.text().catch(() => '');
      throw new Error(errText || `Request failed with ${res.status}`);
    }

    // Server kamu mengembalikan plain text (res.status(200).send(response.text))
    const botReply = await res.text();

    // Ganti indikator dengan balasan nyata
    thinkingEl.textContent = botReply || '(no response text)';
  } catch (err) {
    thinkingEl.textContent = `Error: ${err.message}`;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // supaya bisa diupdate (untuk indikator)
}
