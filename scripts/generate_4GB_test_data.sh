#!/bin/bash
set -eux # error, unset var, verbose mode

# Replace these variables with your actual values
DESTINATION_IP="69.69.69.3"
# DESTINATION_IP="127.0.0.1"
DESTINATION_PORT="8081"
# DATA_RATE="1M"  # Comment out the rate limiting
DURATION=10     # Duration of the test in seconds

# Generate test data (e.g., 1MB)
# dd if=/dev/urandom of=test_data bs=1M count=100
# dd if=/dev/urandom of=test_data bs=1M count=1000

# Send data without rate limiting using netcat and measure the time
# cat test_data | nc "$DESTINATION_IP" "$DESTINATION_PORT"
( cat test_data | nc -u "$DESTINATION_IP" "$DESTINATION_PORT" ) &
PID=$!

# Sleep for the specified duration
sleep "$DURATION"

# Terminate the data transfer process
kill "$PID"

# Clean up
# rm test_data
