from fastapi import APIRouter
import keyboard


router = APIRouter()

@router.post("/volume/up")
def volume_up():
  keyboard.send("volume up")  
  return {"ok": True}

@router.post("/volume/down")
def volume_down():
  keyboard.send("volume down")  

  return {"ok": True}

@router.post("/volume/mute")
def volume_mute():
  keyboard.send("volume mute")  

  return {"ok": True}

