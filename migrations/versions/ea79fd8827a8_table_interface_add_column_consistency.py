"""table_interface_add_column_consistency

Revision ID: ea79fd8827a8
Revises: d9ff08ff27e2
Create Date: 2021-12-17 13:28:08.889512

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ea79fd8827a8'
down_revision = 'd9ff08ff27e2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('interface', sa.Column('consistency', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('interface', 'consistency')
    # ### end Alembic commands ###
