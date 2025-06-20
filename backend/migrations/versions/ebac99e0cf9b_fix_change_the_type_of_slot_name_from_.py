"""fix: change the type of slot name from int to string.

Revision ID: ebac99e0cf9b
Revises: a1181cace036
Create Date: 2025-06-11 23:03:43.407773

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ebac99e0cf9b'
down_revision: Union[str, None] = 'a1181cace036'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('slots', 'name',
               existing_type=sa.INTEGER(),
               type_=sa.String(length=100),
               existing_nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('slots', 'name',
               existing_type=sa.String(length=100),
               type_=sa.INTEGER(),
               existing_nullable=False)
    # ### end Alembic commands ###
