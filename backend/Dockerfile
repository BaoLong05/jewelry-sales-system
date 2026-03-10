FROM php:8.2-apache

WORKDIR /var/www/html

# cài extension cần cho Laravel
RUN docker-php-ext-install pdo pdo_mysql

# bật rewrite
RUN a2enmod rewrite

# đổi document root sang public
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# copy source
COPY . /var/www/html

# tạo thư mục cần thiết
RUN mkdir -p /var/www/html/storage \
    /var/www/html/bootstrap/cache

# phân quyền
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

EXPOSE 80

CMD ["apache2-foreground"]