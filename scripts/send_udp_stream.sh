#!/bin/bash
set -eux # error, unset var, verbose mode

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <test_data_suffix>"
    exit 1
fi

DESTINATION_IP="69.69.69.3"
# DESTINATION_IP="127.0.0.1"
DESTINATION_PORT="8081"
DURATION=10     # Kill the stream after this timeout
TEST_DATA_SUFFIX="$1"

# Send data without rate limiting using netcat
( cat "test_data$TEST_DATA_SUFFIX" | nc -u "$DESTINATION_IP" "$DESTINATION_PORT" ) &
PID=$!

sleep "$DURATION"

# Terminate the data transfer process
kill "$PID"
