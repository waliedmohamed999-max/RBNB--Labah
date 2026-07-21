# Real-data MySQL for the Laravel (public_html) backend, deployed as a
# separate Render private service. The actual data dump is NEVER committed
# to git (this repo has a history of exactly that mistake) - it is uploaded
# directly through Render's own "Secret Files" feature on this service,
# which never touches GitHub, and only read here at container startup.
FROM mysql:8.0

COPY import-secret-dump.sh /docker-entrypoint-initdb.d/import-secret-dump.sh
RUN chmod +x /docker-entrypoint-initdb.d/import-secret-dump.sh
