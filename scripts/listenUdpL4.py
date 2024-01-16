import socket


# HOST = '192.168.1.75'
# HOST = '127.0.0.1'  # Loopback address
# HOST = '0.0.0.0'
# Get the computer's private IP address
def get_private_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

# if this IP is wrong it will crash with address unavailable to bind
# HOST = '192.168.2.216'
HOST = '127.0.0.1'
# HOST = '192.168.2.207'
PORT = 8081

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
    s.bind(('', PORT))
    print(f"Listening for UDP packets on {HOST}:{PORT}...")

    try:
        while True:
            data, addr = s.recvfrom(1024)  # buffer size is 1024 bytes
            received_msg = data.decode('utf-8')
            print(f"Received packet from {addr[0]}:{addr[1]}: {received_msg}")
            # Prepare the response message
            response_msg = f"I received <{received_msg}> from <{addr[0]}:{addr[1]}>"
            # Send the response back to the sender
            # print("temp disabled response msg!")
            print(f'replying to addr: {addr}')
            addr2 = ('69.69.69.1',addr[1])
            # print(f'but actually: {addr2}')
            s.sendto(response_msg.encode('utf-8'), addr)
    except Exception as e:
        print(f'Error: {e}')
    finally:
        s.close()
