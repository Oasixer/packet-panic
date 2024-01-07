import argparse
import socket

# Set up command-line argument parsing
parser = argparse.ArgumentParser(description='Send a TCP packet with a specific message size.')
parser.add_argument('size', type=int, help='The size of the message in bytes.')
args = parser.parse_args()

# Configuration
# IP = "69.69.69.2"
IP = "192.168.2.216"
PORT = 9081
LISTEN_PORT = 7000  # Port on which we will listen for the response
BUFFER_SIZE = 1024  # Define a buffer size for receiving data
TIMEOUT = 5  # Timeout in seconds for waiting for a response

# MESSAGE = b'a' * args.size  # Size specified as a command-line argument
MESSAGE = b'a' * args.size  # Size specified as a command-line argument

# Display details
print("TCP target IP:", IP)
print("TCP target port:", PORT)
print("Listening on port:", LISTEN_PORT)
print("Message length:", len(MESSAGE))

# Create a socket for TCP
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # Internet and TCP

# Bind the socket to listen on the specified port
sock.bind(('', LISTEN_PORT))

# Establish a TCP connection
sock.connect((IP, PORT))

# Send the message
sock.send(MESSAGE)

try:
    # Set a timeout for the response
    sock.settimeout(TIMEOUT)
    print(f"Waiting for a response for up to {TIMEOUT} seconds...")

    # Receive response
    data = sock.recv(BUFFER_SIZE)  # buffer size is 1024 bytes
    print(f"Received reply: {data.decode('utf-8')}")

except socket.timeout:
    print("No response received within the timeout period.")

finally:
    # Close the socket
    sock.close()
