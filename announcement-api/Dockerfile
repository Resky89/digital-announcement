# syntax=docker/dockerfile:1

FROM php:8.2-fpm

# Install system dependencies and PHP extensions
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libzip-dev \
        libicu-dev \
        libonig-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install \
        pdo_mysql \
        zip \
        intl \
        mbstring \
    && rm -rf /var/lib/apt/lists/*

# Working directory
WORKDIR /var/www/html

# Install Composer (available for container usage)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# PHP upload limits (10MB)
COPY php/uploads.ini /usr/local/etc/php/conf.d/uploads.ini

EXPOSE 9000
