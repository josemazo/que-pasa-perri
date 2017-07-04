#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
docker run --rm --name='que-pasa-perri' -v $DIR:/usr/src/app node:7.3.0 bash -c 'cd /usr/src/app && exec node server/app.js' >&1

