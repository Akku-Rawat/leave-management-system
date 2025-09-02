const API_URL = import.meta.env.VITE_API_URL;

export async function getLeaves() {
  const res = await fetch(`${API_URL}/leaves`);
  return res.json();
}
