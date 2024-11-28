FROM php:8.3-fpm-alpine

# Install required system dependencies and PHP extensions
RUN apk --no-cache add \
    bash \
    git \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    redis \
    nodejs \
    npm && \
    pecl install redis && \
    docker-php-ext-enable redis && \
    docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip sodium && \
    rm -rf /var/cache/apk/* /tmp/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . /var/www/

RUN chmod -R u+rwX,g+rwX,o+rwX /var/www/storage && \
    chmod -R u+rwX,g+rwX,o+rwX /var/www/bootstrap/cache && \
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

COPY docker-compose/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
EXPOSE 80

# Default command to run PHP-FPM
CMD ["php-fpm"]
