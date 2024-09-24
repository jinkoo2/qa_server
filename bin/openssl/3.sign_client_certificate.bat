openssl x509 -req -in alice.csr -CA server.cert -CAkey server.key -out alice.cert -set_serial 01 -days 365
pause