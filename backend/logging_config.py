import logging
import os

def get_log_path():
  log_dir = os.path.join(os.environ["LOCALAPPDATA"], "RemoteDeck")
  os.makedirs(log_dir, exist_ok=True)
  return os.path.join(log_dir, "remote-deck.log")

def setup_logging():
  logging.basicConfig(
    filename=get_log_path(),
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
  )