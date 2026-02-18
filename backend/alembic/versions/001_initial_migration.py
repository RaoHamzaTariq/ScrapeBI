"""Initial migration

Revision ID: 001
Revises:
Create Date: 2026-02-18 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create the UUID extension if it doesn't exist
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    # Create the scraping_jobs table
    op.create_table('scraping_jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('url', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('wait_time', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('render_strategy', sa.String(length=20), nullable=False, server_default='auto'),
        sa.Column('wait_for_selector', sa.Text(), nullable=True),
        sa.Column('extract_text', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('extract_html', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('capture_screenshot', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('screenshot_path', sa.Text(), nullable=True),
        sa.Column('html_path', sa.Text(), nullable=True),
        sa.Column('text_content', sa.Text(), nullable=True),
        sa.Column('page_title', sa.Text(), nullable=True),
        sa.Column('final_url', sa.Text(), nullable=True),
        sa.Column('http_status', sa.Integer(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('retry_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index('idx_scraping_jobs_status', 'scraping_jobs', ['status'])
    op.create_index('idx_scraping_jobs_created_at', 'scraping_jobs', ['created_at'])
    op.create_index('idx_scraping_jobs_url', 'scraping_jobs', ['url'])


def downgrade():
    # Drop indexes
    op.drop_index('idx_scraping_jobs_url', table_name='scraping_jobs')
    op.drop_index('idx_scraping_jobs_created_at', table_name='scraping_jobs')
    op.drop_index('idx_scraping_jobs_status', table_name='scraping_jobs')

    # Drop table
    op.drop_table('scraping_jobs')

    # Drop UUID extension (be careful with this in production)
    # op.execute('DROP EXTENSION IF EXISTS "uuid-ossp"')