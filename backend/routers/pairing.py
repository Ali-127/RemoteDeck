from fastapi import APIRouter

router = APIRouter()

@router.get('/pair')
def pair_info():
  return {
    "service": "remotedeck",
    "version": "1.0"
  }