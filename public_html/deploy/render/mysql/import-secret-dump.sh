#!/bin/bash
# Runs once, automatically, only while the MySQL data directory is being
# initialized for the first time (official mysql image behavior - safe to
# re-deploy without re-importing on every restart once the Render Disk has
# data on it). Imports the real dump uploaded via Render's Secret Files UI,
# never a file that came from git.
set -e

SECRET_DUMP="/etc/secrets/dms2025.sql"

if [ -f "$SECRET_DUMP" ]; then
  echo "Importing real data from $SECRET_DUMP into ${MYSQL_DATABASE}..."
  mysql -u root --password="${MYSQL_ROOT_PASSWORD}" "${MYSQL_DATABASE}" < "$SECRET_DUMP"
  echo "Import complete."
else
  echo "No secret dump found at $SECRET_DUMP - starting with an empty database."
fi
