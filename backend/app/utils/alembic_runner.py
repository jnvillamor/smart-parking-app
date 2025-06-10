from alembic import command
from alembic.config import Config
import os

def run_migrations():
  """Run migrations using Alembic."""
  base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
  alembic_cfg = Config(os.path.join(base_dir, 'alembic.ini'))
  alembic_cfg.set_main_option("script_location", os.path.join(base_dir, "migrations"))

  command.upgrade(alembic_cfg, "head")

run_migrations()