import logging
from fastapi import APIRouter, HTTPException
import keyboard


router = APIRouter()
logger = logging.getLogger(__name__)

# Main function for sending keyboards
def send_key(key: str, label: str):
  try:
    keyboard.send(key)
    logger.info(f"{label} sent successfully")
    return {'ok': True}
  except Exception as e:
    logger.error(f"{label} failed: {e}")
    raise HTTPException(status_code=500, detail=f"Failed to send {label}")

# media keys
@router.post("/play-pause")
def play_pause():
  return send_key("play/pause media", "play/pause")

@router.post("/seek/forward")
def seek_forward():
  return send_key("right", "seek forward")

@router.post("/seek/backward")
def seek_backward():
  return send_key("left", "seek backward")

# subtitle keys
@router.post("/subtitle/sync-plus")
def subtitle_sync_plus():
  return send_key(",", "subtitle sync plus")

@router.post("/subtitle/sync-minus")
def subtitle_sync_minus():
  return send_key(".", "subtitle sync minus")

# Volume keys
@router.post("/volume/up")
def volume_up():
  return send_key("volume up", "volume up")

@router.post("/volume/down")
def volume_down():
  return send_key("volume down", "volume down")


@router.post("/volume/mute")
def volume_mute():
  return send_key("volume mute", "volume mute")

