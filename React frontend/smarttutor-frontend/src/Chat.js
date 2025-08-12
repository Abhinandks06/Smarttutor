

// --- Added delete and clear all frontend logic ---
import axios from 'axios';
function handleDeleteChat(id) {
  axios.delete(`${API_BASE}/api/doubts/${id}/delete/`, { headers: headers() })
    .then(() => fetchHistory())
    .catch(console.error);
}
function handleClearAll() {
  axios.delete(`${API_BASE}/api/doubts/clear-all/`, { headers: headers() })
    .then(() => fetchHistory())
    .catch(console.error);
}
