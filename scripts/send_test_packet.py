import argparse
import socket

# Set up command-line argument parsing
parser = argparse.ArgumentParser(description='Send a UDP packet with a specific message size.')
parser.add_argument('size', type=int, help='The size of the message in bytes.')
args = parser.parse_args()

# Configuration
UDP_IP = "69.69.69.2"
UDP_PORT = 8081
LISTEN_PORT = 6000  # Port on which we will listen for the response
BUFFER_SIZE = 1024  # Define a buffer size for receiving data
TIMEOUT = 5  # Timeout in seconds for waiting for a response

# MESSAGE = b'a' * args.size  # Size specified as a command-line argument
MESSAGE = b'a' * args.size  # Size specified as a command-line argument

# Display details
print("UDP target IP:", UDP_IP)
print("UDP target port:", UDP_PORT)
print("Listening on port:", LISTEN_PORT)
print("Message length:", len(MESSAGE))

# Send the message
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # Internet and UDP

# Bind the socket to listen on the specified port
sock.bind(('', LISTEN_PORT))

sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))

try:
    # Set a timeout for the response
    sock.settimeout(TIMEOUT)
    print(f"Waiting for a response for up to {TIMEOUT} seconds...")

    # Receive response
    data, addr = sock.recvfrom(BUFFER_SIZE)  # buffer size is 1024 bytes
    print(f"Received reply from {addr[0]}:{addr[1]}: {data.decode('utf-8')}")

except socket.timeout:
    print("No response received within the timeout period.")

finally:
    # Close the socket
    sock.close()
