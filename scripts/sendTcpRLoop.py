import argparse
import os
import socket
import struct
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# parent_dir = os.path.dirname(current_script_dir)
# sys.path.append(parent_dir)

from scripts.shared import get_private_ip

parser = argparse.ArgumentParser(description='Send a TCP packet with a specific message size.')
parser.add_argument('--no-proxy', dest='use_proxy', action='store_false', help="Don't send to proxy")
parser.set_defaults(use_proxy=True)
args = parser.parse_args()

# SRC_IP = get_private_ip()
SRC_IP = "127.0.0.1"
DST_IP_PROXY = "69.69.69.2"
DST_IP_DEFAULT = "127.0.0.1"

DST_IP = DST_IP_PROXY if args.use_proxy else DST_IP_DEFAULT
HOST_IFACE = "192.168.2.216" if args.use_proxy else "127.0.0.1"
# "127.0.0.1"
# print(f"HOST_IFACE: {HOST_IFACE}")


DST_PORT = 8081
LISTEN_PORT = 7000
BUFFER_SIZE = 1024
TIMEOUT = 5

def calculateChecksum(msg):
    s = 0
    # loop taking 2 characters at a time
    for i in range(0, len(msg), 2):
        a = msg[i]
        b = msg[i+1] if i+1 < len(msg) else 0
        s = s + (a + (b << 8))
    
    # One's complement and wrapping up
    s = (s >> 16) + (s & 0xffff)
    s = s + (s >> 16)
    s = ~s & 0xffff

    return s
# Constants (assuming these are the same as in the original script)

# IP header fields
version = 4
header_len = 5
tos = 0
total_len = 40
id = 54321
flags = 0
frag_off = 0
ttl = 255
protocol = socket.IPPROTO_TCP
checksum = 0
srcIP = socket.inet_aton(SRC_IP)  # Replace with actual source IP
dstIP = socket.inet_aton(DST_IP)

# TCP header fields
srcPort = LISTEN_PORT
dstPort = DST_PORT
seqNum = 0
ackNum = 0
dataOffset = 5  # 5 * 4 = 20 bytes
reserved = 0
flags = 2  # SYN
windowSize = socket.htons(5840)
checksum = 0
urgentPointer = 0

# Assemble the IP header
ip_header = struct.pack('!BBHHHBBH4s4s', version << 4 | header_len, tos, total_len, id, frag_off, ttl, protocol, checksum, srcIP, dstIP)

# Assemble the TCP header
tcp_header = struct.pack('!HHLLBBHHH', srcPort, dstPort, seqNum, ackNum, dataOffset << 4 | reserved, flags, windowSize, checksum, urgentPointer)

# Calculate checksums
pseudo_header = struct.pack('!4s4sBBH', srcIP, dstIP, 0, protocol, len(tcp_header))
checksum = calculateChecksum(pseudo_header + tcp_header)
tcp_header = struct.pack('!HHLLBBH', srcPort, dstPort, seqNum, ackNum, dataOffset << 4 | reserved, flags, windowSize) + struct.pack('H', checksum) + struct.pack('!H', urgentPointer)

# Create a raw socket
sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_TCP)
sock.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)

# HOST_IFACE = "wlp4s0"
# HOST_IFACE = socket.gethostbyname(socket.gethostname())
# HOST_IFACE = "192.168.2.216"
# HOST_IFACE = "192.168.2.216"
# btw 
# sock.bind((HOST_IFACE, LISTEN_PORT))
sock.bind(('', LISTEN_PORT))

# Send the packet
sock.sendto(ip_header + tcp_header, (DST_IP, 0))
 # Listen for response
sock.settimeout(TIMEOUT)

# gets its own msg back because the bind() doesn't listen to the port for some reason
own_msg, _ = sock.recvfrom(BUFFER_SIZE)

data, addr = sock.recvfrom(BUFFER_SIZE)
print("recv data")
packetSrcIP = addr[0]
recvDstIP_bytes = data[16:20]
print(f'recv ip bytes: {recvDstIP_bytes}')
recvDstIP = '.'.join(map(str, recvDstIP_bytes))

# Extract the IP header length
ip_header_len = (data[0] & 0x0F) * 4

# Extract the TCP header length
tcp_header_start = ip_header_len
tcp_header_len = (data[tcp_header_start + 12] >> 4) * 4

# Extract the source and destination port
recvSrcPort, recvDstPort = struct.unpack('!HH', data[tcp_header_start:tcp_header_start + 4])

# Extract flags from the TCP header
flags_offset = tcp_header_start + 13
flags = data[flags_offset]  # The flags are located at the 14th byte of the TCP header

recvSeqNum, recvAckNum = struct.unpack('!LL', data[tcp_header_start + 4:tcp_header_start + 12])

# TCP flags
FIN = flags & 0x01
SYN = (flags & 0x02) >> 1
RST = (flags & 0x04) >> 2
PSH = (flags & 0x08) >> 3
ACK = (flags & 0x10) >> 4
URG = (flags & 0x20) >> 5
ECE = (flags & 0x40) >> 6
CWR = (flags & 0x80) >> 7

print(f"Received flags: FIN={FIN}, SYN={SYN}, RST={RST}, PSH={PSH}, ACK={ACK}, URG={URG}, ECE={ECE}, CWR={CWR}")
print(f"Source IP: {packetSrcIP}, Destination IP: {recvDstIP}")
print(f"Source Port: {recvSrcPort}, Destination Port: {recvDstPort}")
print(f"Sequence Number: {recvSeqNum}, Acknowledgment Number: {recvAckNum}")

# Acknowledge when receiving a SYN-ACK
if not (SYN and ACK):
    print("Recived wrong flags ( not SYN-ACK !). returning.")
    sys.exit()

print("SYN-ACK received. Sending ACK.")

# Increment the acknowledgment number by 1
ackNum = recvSeqNum + 1

# The sequence number for the ACK will be the acknowledgment number received
seqNum = recvAckNum

# Assemble the ACK TCP header
# ack_tcp_header = struct.pack('!HHLLBBHHH', srcPort, dstPort, seqNum, ackNumber, dataOffset << 4 | reserved, ackFlag, windowSize, 0, urgentPointer)

data = "bbbbbbbbbb".encode()
psh_ack_flag = 0x18
psh_ack_tcp_header = struct.pack('!HHLLBBHHH', srcPort, dstPort, seqNum, ackNum, dataOffset << 4 | reserved, psh_ack_flag, windowSize, 0, urgentPointer)

total_len = len(ip_header) + len(psh_ack_tcp_header) + len(data)
ip_header = struct.pack('!BBHHHBBH4s4s', version << 4 | header_len, tos, total_len, id, frag_off, ttl, protocol, 0, srcIP, dstIP)
pseudo_header = struct.pack('!4s4sBBH', srcIP, dstIP, 0, protocol, len(psh_ack_tcp_header) + len(data))
checksum = calculateChecksum(pseudo_header + psh_ack_tcp_header + data)
print('bruh im sending: ' + str(seqNum))
psh_ack_tcp_header = struct.pack('!HHLLBBH', srcPort, dstPort, seqNum, ackNum, dataOffset << 4 | reserved, psh_ack_flag, windowSize) + struct.pack('H', checksum) + struct.pack('!H', urgentPointer)

# Send the ACK packet
sock.sendto(ip_header + psh_ack_tcp_header + data, (DST_IP, 0))
print("ACK sent.")

while True:
    try:
        data, addr = sock.recvfrom(BUFFER_SIZE)
        print("recv final data")
        recvSrcIP = addr[0]
        recvDstIP_bytes = data[16:20]
        # print(f'recv ip bytes: {recvDstIP_bytes}')
        recvDstIP = '.'.join(map(str, recvDstIP_bytes))

# Extract the IP header length
        ip_header_len = (data[0] & 0x0F) * 4

# Extract the TCP header length
        tcp_header_start = ip_header_len
        tcp_header_len = (data[tcp_header_start + 12] >> 4) * 4

# Extract the source and destination port
        recvSrcPort, recvDstPort = struct.unpack('!HH', data[tcp_header_start:tcp_header_start + 4])

# Extract flags from the TCP header
        flags_offset = tcp_header_start + 13
        flags = data[flags_offset]  # The flags are located at the 14th byte of the TCP header

        seqNum, ackNum = struct.unpack('!LL', data[tcp_header_start + 4:tcp_header_start + 12])

# TCP flags
        FIN = flags & 0x01
        SYN = (flags & 0x02) >> 1
        RST = (flags & 0x04) >> 2
        PSH = (flags & 0x08) >> 3
        ACK = (flags & 0x10) >> 4
        URG = (flags & 0x20) >> 5
        ECE = (flags & 0x40) >> 6
        CWR = (flags & 0x80) >> 7

        print(f"Received flags: FIN={FIN}, SYN={SYN}, RST={RST}, PSH={PSH}, ACK={ACK}, URG={URG}, ECE={ECE}, CWR={CWR}")
        print(f"Source IP: {recvSrcIP}, Destination IP: {recvDstIP}")
        print(f"Source Port: {recvSrcPort}, Destination Port: {recvDstPort}")
        print(f"Sequence Number: {seqNum}, Acknowledgment Number: {ackNum}")
    except Exception as e:
        print(f'Error: {e}')
    finally:
        sock.close()
