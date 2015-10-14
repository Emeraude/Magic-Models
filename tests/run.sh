#!/usr/bin/env bash

cd `dirname $0`

nodeunit full.js validationRules.js || return 1
