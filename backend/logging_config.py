import logging

def setup_logging():
  logging.basicConfig(
    filename="remote-deck.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
  )