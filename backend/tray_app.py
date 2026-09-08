import logging
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
  try:
    uvicorn.run(app=app, host="0.0.0.0", port=8910, log_level="info", log_config=None)
  except Exception as e:
    logging.error(f"Server thread crashed: {e}", exc_info=True)

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
