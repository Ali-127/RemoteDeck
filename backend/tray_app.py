import threading
import uvicorn
from PIL import Image, ImageDraw
import pystray

from main import app

def create_icon_image():
  image = Image.new("RGB", (64, 64), "black")
  draw = ImageDraw.Draw(image)
  draw.ellipse((16, 16, 48, 48), fill="white")
  return image

def run_server():
  uvicorn.run(app=app, host="0.0.0.0", port=8000, log_level="info")

def quit_app(icon, item):
  icon.stop()

def main():
  server_thread = threading.Thread(target=run_server, daemon=True)
  server_thread.start()

  icon = pystray.Icon(
    "RemoteDeck",
    create_icon_image(),
    "Remote Deck Server",
    menu=pystray.Menu(
      pystray.MenuItem("Status: Running", lambda: None, enabled=False),
      pystray.MenuItem("Quit", quit_app),
    ),
  )
  
  icon.run()

if __name__ == "__main__":
  main()
