FROM redis:latest

WORKDIR /usr/local/etc/redis

COPY redis.conf ./

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]