import argparse
import socket

from scripts.shared import get_private_ip

parser = argparse.ArgumentParser(description='Send a TCP packet with a specific message size.')
parser.add_argument('--no-proxy', dest='use_proxy', action='store_false', help="Don't send to proxy")
parser.set_defaults(use_proxy=True)
args = parser.parse_args()

SRC_IP = get_private_ip()
DST_IP_PROXY = "69.69.69.2"
DST_IP_DEFAULT = "127.0.0.1"  #get_private_ip()
DST_IP = DST_IP_PROXY if args.use_proxy else DST_IP_DEFAULT
PORT = 8081
LISTEN_PORT = 7000  # Port on which we will listen for the response
BUFFER_SIZE = 1024  # Define a buffer size for receiving data
TIMEOUT = 5  # Timeout in seconds for waiting for a response

# MESSAGE = b'a' * args.size  # Size specified as a command-line argument
MESSAGE = b'a' * args.size  # Size specified as a command-line argument

# Display details
print("TCP target IP:", DST_IP)
print("TCP target port:", PORT)
print("Listening on port:", LISTEN_PORT)
print("Message length:", len(MESSAGE))

# Create a socket for TCP
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # Internet and TCP

# Bind the socket to listen on the specified port
sock.bind(('', LISTEN_PORT))

# Establish a TCP connection
sock.connect((DST_IP, PORT))

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
