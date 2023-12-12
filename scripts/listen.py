import socket

# HOST = '192.168.1.75'
# HOST = '127.0.0.1'  # Loopback address
# HOST = '0.0.0.0'

# if this IP is wrong it will crash with address unavailable to bind
HOST = '192.168.2.213'

# HOST = '192.168.2.207'
PORT = 8081

def main():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.bind((HOST, PORT))
        print(f"Listening for UDP packets on {HOST}:{PORT}...")

        while True:
            data, addr = s.recvfrom(1024)  # buffer size is 1024 bytes
            received_msg = data.decode('utf-8')
            print(f"Received packet from {addr[0]}:{addr[1]}: {received_msg}")
            # Prepare the response message
            response_msg = f"I received <{received_msg}> from <{addr[0]}:{addr[1]}>"
            # Send the response back to the sender
            s.sendto(response_msg.encode('utf-8'), addr)

if __name__ == "__main__":
    main()
