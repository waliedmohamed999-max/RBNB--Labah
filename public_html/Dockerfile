# Laravel (public_html) - Render deployment.
# Render should create this service with Root Directory: public_html
# so this Dockerfile and .dockerignore are found relative to that folder,
# and the build context excludes the rest of this monorepo.

FROM composer:2 AS vendor
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction --ignore-platform-reqs

FROM php:8.2-apache AS runner

RUN apt-get update && apt-get install -y --no-install-recommends \
    libzip-dev libpng-dev libjpeg-dev libfreetype6-dev libonig-dev unzip \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql zip gd bcmath \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e "s!/var/www/html!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/sites-available/*.conf \
    && sed -ri -e "s!/var/www/!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# The sed above only retargets the path of the existing <Directory /var/www/>
# block - its AllowOverride None is untouched, so public/.htaccess (which
# does all of Laravel's URL rewriting to index.php) was silently never read.
# Add an explicit override for the real document root.
RUN { \
    echo '<Directory /var/www/html/public>'; \
    echo '    AllowOverride All'; \
    echo '    Require all granted'; \
    echo '</Directory>'; \
    } > /etc/apache2/conf-available/laravel-docroot.conf \
    && a2enconf laravel-docroot

WORKDIR /var/www/html

COPY . .
COPY --from=vendor /app/vendor ./vendor

RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# .dockerignore excludes the committed bootstrap/cache/*.php manifests -
# those were generated locally with dev dependencies installed (e.g. list
# laravel/ui's provider, which --no-dev deliberately excludes) and would
# make the app try to load a class that was never installed here. Regenerate
# them fresh against this image's actual --no-dev vendor tree instead.
RUN php artisan package:discover --ansi

COPY deploy/render/apache-port.sh /usr/local/bin/apache-port.sh
RUN chmod +x /usr/local/bin/apache-port.sh

EXPOSE 80
CMD ["/usr/local/bin/apache-port.sh"]
