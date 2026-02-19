#!/bin/bash
# PostgreSQL backup script for ScrapeFlow

set -e

# Configuration
BACKUP_DIR="/backups"
DB_NAME="scraping"
DB_USER="user"
DB_HOST="db"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/scrapeflow_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "Starting backup of database: $DB_NAME"
echo "Backup file: $BACKUP_FILE"

# Perform the backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Compress the backup
gzip $BACKUP_FILE

echo "Backup completed: $BACKUP_FILE.gz"

# Keep only the last 7 days of backups
find $BACKUP_DIR -name "scrapeflow_*.sql.gz" -mtime +7 -delete

echo "Old backups cleaned up. Backup process completed successfully."