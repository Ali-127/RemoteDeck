import logging
import queue
import threading
import uvicorn
from PIL import Image, ImageDraw, ImageTk #type:ignore
import pystray #type:ignore
import tkinter as tk
from pairing import build_remote_url, make_qr_image

from main import app

root: tk.Tk | None = None
ui_commands: queue.SimpleQueue[str] = queue.SimpleQueue()


def show_pairing_window(icon, item):
  """Request that the Tk event loop show the pairing window."""
  ui_commands.put("show_pairing")


def create_pairing_window():
  """Create the QR window on Tkinter's owning thread."""
  url = build_remote_url(frontend_port=3000)
  img = make_qr_image(url=url)

  if root is None:
    return

  win = tk.Toplevel(root)
  win.title("Pair your phone")
  win.resizable(False, False)
  win.protocol("WM_DELETE_WINDOW", win.destroy)

  tk_img = ImageTk.PhotoImage(img)
  label_img = tk.Label(win, image=tk_img)
  label_img.image = tk_img
  label_img.pack(padx=16, pady=(16, 4))

  label_url = tk.Label(win, text=url, font=("Segoe UI", 10))
  label_url.pack(pady=(0, 16))

  tk.Button(
    win,
    text="Close",
    command=win.destroy,
  ).pack(pady=(0, 16))


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
  ui_commands.put("quit")


def process_ui_commands():
  """Run tray-originated UI requests on Tkinter's owning thread."""
  if root is None:
    return

  while True:
    try:
      command = ui_commands.get_nowait()
    except queue.Empty:
      break

    if command == "show_pairing":
      create_pairing_window()
    elif command == "quit":
      root.quit()

  root.after(100, process_ui_commands)

def main():
  global root

  server_thread = threading.Thread(target=run_server, daemon=True)
  server_thread.start()

  # Tkinter must be created and run from one thread.  Keep its root hidden and
  # let the tray callbacks schedule GUI work onto this event loop.
  root = tk.Tk()
  root.withdraw()
  root.after(100, process_ui_commands)

  icon = pystray.Icon(
    "RemoteDeck",
    create_icon_image(),
    "Remote Deck Server",
    menu=pystray.Menu(
      pystray.MenuItem("Status: Running", lambda: None, enabled=False),
      pystray.MenuItem("Show pairing qrcode", show_pairing_window),
      pystray.MenuItem("Quit", quit_app),
    ),
  )

  tray_thread = threading.Thread(target=icon.run, daemon=True)
  tray_thread.start()

  try:
    root.mainloop()
  finally:
    icon.stop()
    root.destroy()

if __name__ == "__main__":
  main()
