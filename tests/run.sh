#!/bin/sh

cd $(dirname $0)

unit_tests() {
    cat connect.js query.js defineModel.js describe.js create.js find.js all.js count.js update.js delete.js end.js > full.js || return 1
    nodeunit full.js && rm full.js && return 0
    return 1
}

mysql -u root --password=toor < db.sql && unit_tests
