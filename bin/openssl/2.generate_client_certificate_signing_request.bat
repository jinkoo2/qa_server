openssl req -newkey rsa:4096 -keyout alice.key -out alice.csr -nodes -days 365 -subj "/CN=Alice"
pause