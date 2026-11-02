from pathlib import Path
import pytest
import yaml

from utils.driver_factory import get_driver


PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONFIG_DIR = PROJECT_ROOT / "config"


@pytest.fixture(scope="function")
def driver():
    drv = get_driver()
    yield drv
    drv.quit()


@pytest.fixture(scope="function")
def load_config():
    def _load(filename):
        with open(CONFIG_DIR / filename, encoding="utf-8") as f:
            return yaml.safe_load(f)
    return _load