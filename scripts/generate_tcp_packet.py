import struct

# TCP Header fields
srcPort = 7000           # Source port
dstPort = 8081           # Destination port
sequenceNumber = 1234       # Sequence number
ackNumber = 43210            # Acknowledgment number
headerLen = 5            # Header length (5x4 = 20 bytes, no options)
reserved = 0             # Reserved bits

# TCP Flags
FIN = 0                  # Finish flag
SYN = 1                  # Synchronize sequence numbers
RST = 0                  # Reset the connection
PSH = 0                  # Push function
ACK = 0                  # Acknowledgment field significant
URG = 0                  # Urgent pointer field significant

# Construct the flags field
flags = (FIN | (SYN << 1) | (RST << 2) | (PSH << 3) | (ACK << 4) | (URG << 5))
print(flags)

windowSize = 1024            # Window size
checksum = 1010             # Checksum (set to 0 for this example)
urgentPointer = 0        # Urgent pointer

# Function to create a TCP header
def create_tcp_header():
    # Assemble the first 16 bits of the header
    b1 = (srcPort >> 8) & 0xFF
    b2 = srcPort & 0xFF
    b3 = (dstPort >> 8) & 0xFF
    b4 = dstPort & 0xFF

    # Sequence number (4 bytes)
    seq_bytes = struct.pack('!L', sequenceNumber)

    # Acknowledgment number (4 bytes)
    ack_bytes = struct.pack('!L', ackNumber)

    # Flags and header length
    header_len_flags = (headerLen << 12) | (reserved << 9) | flags

    # Remaining fields
    window_bytes = struct.pack('!H', windowSize)
    checksum_bytes = struct.pack('!H', checksum)
    urgent_pointer_bytes = struct.pack('!H', urgentPointer)

    # Combine all parts
    header = bytes([b1, b2, b3, b4]) + seq_bytes + ack_bytes + struct.pack('!H', header_len_flags) + window_bytes + checksum_bytes + urgent_pointer_bytes
    return header

# Function to convert header to hex string
def tcp_header_to_hex(header):
    return header.hex()

# Create TCP header and convert to hex string
tcp_header = create_tcp_header()
tcp_header_hex = tcp_header_to_hex(tcp_header)

print(tcp_header_hex)
