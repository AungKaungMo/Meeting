#!/bin/sh

# Can do other necessary command (eg. cache clearing)

php artisan migrate

php artisan db:seed

# Start the main process
exec "$@"