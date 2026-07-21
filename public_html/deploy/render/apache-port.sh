#!/bin/sh
# Render assigns the listen port at runtime via $PORT (not known at build
# time), but the Apache image's config hardcodes port 80. Rewrite both the
# Listen directive and the VirtualHost port to match before starting Apache.
set -e

PORT="${PORT:-80}"

sed -ri "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

exec apache2-foreground
