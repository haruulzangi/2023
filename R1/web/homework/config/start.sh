#!/bin/bash
node /app/index.js &
/usr/sbin/varnishd -F -a :80 -f /etc/varnish/cache.vcl -s default,256m
