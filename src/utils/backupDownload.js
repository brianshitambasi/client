import api from '../services/api';

export async function downloadBackup() {
  try {
    const token = localStorage.getItem('tnt_token');
    const res = await api.get('/admin/backup/download', {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });

    const blob = new Blob([res.data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yobbytech-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('Backup failed. Check the server logs and try again.');
    console.error('Backup error:', err);
  }
}
