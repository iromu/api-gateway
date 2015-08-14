#!/usr/bin/env bash
cd dist

NODE_ENV=production \
PORT=8088 \
APP_UID="api-gateway-01" \
forever start --uid "api-gateway-01" -w -a server/app.js

