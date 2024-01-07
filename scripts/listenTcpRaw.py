import socket
import struct
import sys

HOST = '192.168.2.216'
PORT = 9081

def checksum(msg):
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

def main():
    # Create a raw socket
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_TCP)
    except socket.error as msg:
        print('Socket could not be created. Error Code : ' + str(msg[0]) + ' Message ' + msg[1])
        sys.exit()

    # Bind the socket to the host and port
    try:
        s.bind((HOST, PORT))
    except socket.error as msg:
        print('Bind failed. Error Code : ' + str(msg[0]) + ' Message ' + msg[1])
        sys.exit()

    print(f"Listening for TCP connections on {HOST}:{PORT}...")

    while True:
        packet, addr = s.recvfrom(65565)  # buffer size is 65565 bytes
        # print(f'len: {len(packet)}')

        # Take and unpack first 20 characters for the IP header
        ip_header = packet[:20]
        iph = struct.unpack('!BBHHHBBH4s4s', ip_header)

        # Calculate IP header length
        ip_header_length = (iph[0] & 0x0F) * 4

        # Extract the TCP header (minimum size)
        tcp_header = packet[ip_header_length:ip_header_length+20]
        tcph = struct.unpack('!HHLLBBHHH', tcp_header)

        src_port, dest_port = tcph[0], tcph[1]

        if dest_port != 9081:
            # print(f'skipped dest_port: {dest_port}')
            continue


        print(f"Source Port: {src_port}, Destination Port: {dest_port}")
        # Calculate TCP header length
        tcp_header_length = ((tcph[4] >> 4) & 0x0F) * 4

        # Check for SYN flag in the TCP header
        if tcph[5] & 0x02:
            print(f"SYN packet received from {addr}")

            # Construct syn-ack response msg and calculate checksum
            seq_number = tcph[2]
            ack_number = tcph[3] + 1
            doff = 5  # Data offset (5 means no options)
            tcp_flags = 0x012  # SYN+ACK flags
            window = socket.htons(5840)  # Maximum allowed window size
            urg_pointer = 0

            # Creating the TCP header without checksum
            tcp_header_without_checksum = struct.pack('!HHLLBBHHH', src_port, dest_port, ack_number, seq_number, doff << 4, tcp_flags, window, 0, urg_pointer)
            
            # Creating the pseudo header fields
            source_ip = socket.inet_aton(HOST)
            dest_ip = socket.inet_aton(addr[0])
            placeholder = 0
            protocol = socket.IPPROTO_TCP
            tcp_length = len(tcp_header_without_checksum)

            psh = struct.pack('!4s4sBBH', source_ip, dest_ip, placeholder, protocol, tcp_length)
            psh = psh + tcp_header_without_checksum

            # Calculate checksum
            tcp_checksum = checksum(psh)

            # Building the final TCP header with checksum
            tcp_header = struct.pack('!HHLLBBH', src_port, dest_port, ack_number, seq_number, doff << 4, tcp_flags, window) + struct.pack('H', tcp_checksum) + struct.pack('!H', urg_pointer)

            response_msg = tcp_header

            s.sendto(response_msg, addr)

if __name__ == "__main__":
    main()
