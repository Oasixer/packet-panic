import argparse
import socket

# Set up command-line argument parsing
parser = argparse.ArgumentParser(description='Send a UDP packet with a specific message size.')
parser.add_argument('size', type=int, help='The size of the message in bytes.')
args = parser.parse_args()

# Configuration
UDP_IP = "69.69.69.3"
UDP_PORT = 8081
MESSAGE = b'a' * args.size  # Size specified as a command-line argument

# Display details
print("UDP target IP:", UDP_IP)
print("UDP target port:", UDP_PORT)
print("message length:", len(MESSAGE))

# Send the message
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # Internet and UDP
sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))
