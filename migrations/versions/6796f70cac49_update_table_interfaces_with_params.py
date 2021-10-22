"""update table interfaces with params

Revision ID: 6796f70cac49
Revises: 82257594e442
Create Date: 2021-10-22 18:09:40.166413

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6796f70cac49'
down_revision = '82257594e442'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('interface', sa.Column('a_param', sa.Integer(), nullable=True))
    op.add_column('interface', sa.Column('b_param', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('interface', 'b_param')
    op.drop_column('interface', 'a_param')
    # ### end Alembic commands ###
