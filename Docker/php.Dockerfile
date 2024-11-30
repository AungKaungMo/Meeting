FROM php:8.3-fpm-alpine

WORKDIR /var/www/meeting

COPY . .

RUN apk update && apk add --no-cache \
    unzip \
    libpq \
    libpq-dev \
    curl \
    curl-dev \
    libcurl \
    build-base \
    autoconf \
    make \
    gcc \
    g++ \
    libc-dev \
    nodejs \
    npm

RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN pecl install redis \
    && docker-php-ext-enable redis

COPY --from=composer:2.3.5 /usr/bin/composer /usr/bin/composer

ENV PORT=8000

RUN chown -R www-data:www-data /var/www/meeting/storage /var/www/meeting/bootstrap/cache

EXPOSE 9000
CMD [ "php-fpm" ]

# COPY Docker/entrypoint.sh /var/www/meeting/Docker/entrypoint.sh
# RUN chmod +x /var/www/meeting/Docker/entrypoint.sh

# ENTRYPOINT [ "/var/www/meeting/Docker/entrypoint.sh" ]