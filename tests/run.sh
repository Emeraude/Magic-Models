#!/usr/bin/env bash

cd `dirname $0`

nodeunit escape.js where.js queryBuilder.js queries.js validationRules.js || exit 1
