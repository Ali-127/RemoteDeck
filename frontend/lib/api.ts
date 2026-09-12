export async function sendCommand(pcUrl: string, path: string) {
  const response = await fetch(`${pcUrl}${path}`, { method: "POST" });
  if (!response.ok) throw new Error(`Command failed with status ${response.status}`);
}
