#!/bin/bash
# PostgreSQL restore script for ScrapeFlow

set -e

# Configuration
BACKUP_DIR="/backups"
DB_NAME="scraping"
DB_USER="user"
DB_HOST="db"

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    echo "Available backups:"
    ls -la $BACKUP_DIR/scrapeflow_*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "This will restore the database from: $BACKUP_FILE"
echo "WARNING: This will overwrite all current data in the database."
read -p "Are you sure you want to continue? (yes/no): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled."
    exit 1
fi

echo "Restoring database: $DB_NAME"
echo "From backup: $BACKUP_FILE"

# Decompress and restore the backup
gunzip -c $BACKUP_FILE | psql -h $DB_HOST -U $DB_USER -d $DB_NAME

echo "Restore completed successfully."