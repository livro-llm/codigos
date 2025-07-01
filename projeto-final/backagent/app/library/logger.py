import logging
import sys


class LogManager:
    def __init__(self, name: str = "app"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.DEBUG)

        if not self.logger.hasHandlers():
            console_handler = logging.StreamHandler(sys.stdout)
            console_handler.setLevel(logging.DEBUG)

            formatter = logging.Formatter(
                "[%(asctime)s] [%(levelname)s] %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S"
            )
            console_handler.setFormatter(formatter)
            self.logger.addHandler(console_handler)

    def get_logger(self):
        return self.logger


logger = LogManager().get_logger()
