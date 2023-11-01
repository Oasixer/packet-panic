import socket

# HOST = '192.168.1.75'  # Loopback address
# HOST = '127.0.0.1'  # Loopback address

HOST = '0.0.0.0'  # Loopback address
PORT = 8081

def main():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.bind((HOST, PORT))
        print(f"Listening for UDP packets on {HOST}:{PORT}...")

        while True:
            data, addr = s.recvfrom(1024)  # buffer size is 1024 bytes
            print(f"Received packet from {addr[0]}:{addr[1]}: {data.decode('utf-8')}")

if __name__ == "__main__":
    main()
# import socket
#
# HOST = '127.0.0.1'  # Loopback address
# PORT = 8081
#
# def main():
#     with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
#         s.bind((HOST, PORT))
#         s.listen()
#
#         print(f"Listening for TCP connections on {HOST}:{PORT}...")
#
#         while True:
#             conn, addr = s.accept()
#             with conn:
#                 print(f"Received connection from {addr[0]}:{addr[1]}")
#
# if __name__ == "__main__":
#     main()
