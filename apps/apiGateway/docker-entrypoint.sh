#!/usr/bin/env sh
set -eu

envsubst '${account_service_url_internal} ${orders_service_url_internal} ${notes_service_url_internal} ${api_gateway_key}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
