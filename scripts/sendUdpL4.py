import argparse
import socket

# Set up command-line argument parsing
parser = argparse.ArgumentParser(description='Send a UDP packet.')
parser.add_argument('--no-proxy', dest='use_proxy', action='store_false', help="Don't send to proxy")
parser.set_defaults(use_proxy=True)
args = parser.parse_args()
# parser.add_argument('size', type=int, help='The size of the message in bytes.')

# SRC_IP = get_private_ip()
# Configuration
DST_IP_PROXY = "69.69.69.2"
DST_IP_DEFAULT = "127.0.0.1" #get_private_ip()
DST_IP = DST_IP_PROXY if args.use_proxy else DST_IP_DEFAULT
PORT = 8081
LISTEN_PORT = 6000  # Port on which we will listen for the response
BUFFER_SIZE = 1024  # Define a buffer size for receiving data
TIMEOUT = 5  # Timeout in seconds for waiting for a response

DATA_SIZE = 10
# MESSAGE = b'a' * args.size  # Size specified as a command-line argument
# MESSAGE = b'a' * args.size  # Size specified as a command-line argument
MESSAGE = b'a' * 10  # Size specified as a command-line argument

# Display details
print("UDP target IP:", DST_IP)
print("UDP target port:", PORT)
print("Listening on port:", LISTEN_PORT)
print("Message length:", len(MESSAGE))

# Send the message
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # Internet and UDP
# Bind the socket to listen on the specified port

HOST_IFACE = "192.168.2.216"
print(f"HOST_IFACE: {HOST_IFACE}")
# sock.bind((HOST_IFACE, LISTEN_PORT))
sock.bind(('', LISTEN_PORT))

sock.sendto(MESSAGE, (DST_IP, PORT))

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
