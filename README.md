# VR example from three.js

For building from scratch invoke `start.sh` or `start.bat` script.

For generating new unsigned certificate and key files invoke:
`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`

After you can start http server with enabling SSL:
`http-server -S -C cert.pem -o` or `npx http-server -S -C cert.pem -o`