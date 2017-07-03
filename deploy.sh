#!/bin/bash

docker run --rm --name='que-pasa-perri' -v /data/app/que-pasa-perri:/usr/src/app node:7.3.0 bash -c 'cd /usr/src/app && exec node server/app.js' >&1

