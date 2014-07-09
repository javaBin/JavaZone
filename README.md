JavaZone
========

The web pages of JavaZone: javazone.no

Consists of a frontend built with pacbot and served statically with Apache/Nginx etc., and a backend written in Java...


How to get started
-------------

1. Check out this repo

2. Build the backend using maven: `cd backend && mvn clean install`

3. Create dummy property-file `cd backend && cp mal.properties awazone.properties` (you don't need to change anything for "basic development")

3. Set up node dependencies: `./setup.sh` (will ask for your sudo password. Also requires you to have npm installed, but who hasn't? :P)

4. Run the whole shebang: `./startalt`/ (will start a screen session with the frontend, the backend, a proxy to connect them, and mongodb if it is installed – not required for basic operations)

5. Access it in your web browser of choice: `http://localhost:9090`


Ports
------------

- Backend: port 12345
- Frontend: port 3000
- Proxy: port 9090 (maps frontend to `http://localhost/*`, backend to `http://localhost/api/*`)