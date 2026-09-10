export async function sendCommand(pcUrl: string, path: string) {
  await fetch(`${pcUrl}${path}`, {method: "POST"})
}