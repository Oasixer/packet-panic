#!/bin/bash
set -eux # error, unset var, verbose mode

# Replace these variables with your actual values
DESTINATION_IP="69.69.69.3"
# DESTINATION_IP="127.0.0.1"
DESTINATION_PORT="8081"
DURATION=10     # Kill the stream after this timeout

# Send data without rate limiting using netcat
( cat test_data | nc -u "$DESTINATION_IP" "$DESTINATION_PORT" ) &
PID=$!

# Sleep for the specified duration
sleep "$DURATION"

# Terminate the data transfer process
kill "$PID"

