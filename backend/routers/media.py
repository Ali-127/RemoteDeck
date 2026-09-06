from fastapi import APIRouter
import keyboard


router = APIRouter()

@router.post("/play-pause")
def play_pause():
  keyboard.send("play/pause media")
  return {"ok": True}

@router.post("/seek/forward")
def seek_forward():
  keyboard.send("right")
  return {"ok": True}

@router.post("/seek/backward")
def seek_backward():
  keyboard.send("left")
  return {"ok": True}

@router.post("/subtitle/sync-plus")
def subtitle_sync_plus():
  keyboard.send(".")
  return {"ok": True}

@router.post("/subtitle/sync-minus")
def subtitle_sync_minus():
  keyboard.send(",")
  return {"ok": True}
