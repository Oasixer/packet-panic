#!/bin/bash
set -eux # error, unset var, verbose mode

# dd if=/dev/urandom of=test_data bs=1M count=4000
dd if=/dev/urandom of=test_data10 bs=10 count=1
