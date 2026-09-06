from fastapi import APIRouter
from comtypes import CLSCTX_ALL
import comtypes
from ctypes import cast, POINTER
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume

router = APIRouter()

def get_volume_interface():
  comtypes.CoInitialize()
  devices = AudioUtilities.GetSpeakers()
  interface = devices._dev.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None) #type:ignore
  return cast(interface, POINTER(IAudioEndpointVolume))

@router.post("/volume/up")
def volume_up():
  vol = get_volume_interface()
  current = vol.GetMasterVolumeLevelScalar() # type: ignore
  new = min(current + 0.05, 1.0)
  vol.SetMasterVolumeLevelScalar(new, None) #type:ignore
  return {"ok": True}

@router.post("/volume/down")
def volume_down():
  vol = get_volume_interface()
  current = vol.GetMasterVolumeLevelScalar() # type: ignore
  new = max(current - 0.05, 0.0)
  vol.SetMasterVolumeLevelScalar(new, None) #type:ignore
  
  return {"before": current, "after": new}

