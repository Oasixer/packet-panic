import socket

HOST = '192.168.2.216'
PORT = 8081


def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        print(f"Listening for TCP connections on {HOST}:{PORT}...")

        while True:
            client_socket, addr = s.accept()
            with client_socket:
                print(f"Connected by {addr}")
                while True:
                    data = client_socket.recv(1024)  # buffer size is 1024 bytes
                    if not data:
                        break
                    received_msg = data.decode('utf-8')
                    print(f"Received packet from {addr[0]}:{addr[1]}: {received_msg}")
                    # Prepare the response message
                    response_msg = f"I received <{received_msg}> from <{addr[0]}:{addr[1]}>"
                    # Send the response back to the sender
                    print("Sending response message...")
                    client_socket.send(response_msg.encode('utf-8'))

if __name__ == "__main__":
    main()
