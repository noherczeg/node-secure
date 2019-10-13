#!/bin/sh
mkdir certs
openssl req -x509 -newkey rsa:2048 -keyout ./certs/server.key -out ./certs/server.crt -nodes -days 365 -subj '//CN=localhost'
openssl dhparam -out ./certs/dhparam.pem 1024
