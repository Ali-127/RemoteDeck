import socket
import os
import qrcode

def get_local_ip() -> str:
  """Find the LAN IP"""
  s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
  try:
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]
  finally:
    s.close()

def build_pairing_url(port: int = 8910) -> str:
  return f"http://{get_local_ip()}:{port}"

def build_remote_url(frontend_port: int = 3000) -> str:
  """Build the clean, phone-facing URL displayed in the tray QR code."""
  scheme = os.getenv("REMOTEDECK_FRONTEND_SCHEME", "https")
  return f"{scheme}://{get_local_ip()}:{frontend_port}"

def make_qr_image(url: str):
  qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=8,
    border=2    
  )
  qr.add_data(url)
  qr.make(fit=True)
  return qr.make_image(fill_color="black", back_color="white")
