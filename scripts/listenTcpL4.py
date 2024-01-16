import signal
import socket
import sys

# HOST = '192.168.2.216'
HOST = '127.0.0.1'
PORT = 8081



s_global = None

def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        # def sigint_handler(signal, frame):
        #     s.close()
        #     print('Interrupted')
        #     sys.exit(0)
        # signal.signal(signal.SIGINT, sigint_handler)
        # s.bind((HOST, PORT))
        # s.bind(('', PORT))
        s.bind(('', PORT))
        s.listen()
        print(f"Listening for TCP connections on {HOST}:{PORT}...")

        global s_global
        s_global = s
        while True:
            client_socket, addr = s.accept()
            with client_socket:
                print(f"Connected by {addr}")
                while True:
                    try:
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
                    except KeyboardInterrupt:
                        print("interrupted69")
                    finally:
                        print("interrupted69_finally")
                        s.close()
                        sys.exit()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt: # this works btw!
        s_global.close()
        print("interrupted2")
