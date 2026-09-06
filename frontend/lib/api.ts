const PC_IP = process.env.NEXT_PUBLIC_PC_IP

export async function sendCommand(path: string) {
  console.log(PC_IP, path, '----------------')
  await fetch(`${PC_IP}${path}`, {method: "POST"})
}