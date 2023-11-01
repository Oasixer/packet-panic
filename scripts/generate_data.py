import random
import string
import sys


def parse_size(size_str):
    """
    Parses the size string with optional K, M, G suffixes.
    Returns size in bytes.
    """
    size_str = size_str.upper()
    if size_str[-1] == "K":
        return int(size_str[:-1]) * 1024
    elif size_str[-1] == "M":
        return int(size_str[:-1]) * 1024 * 1024
    elif size_str[-1] == "G":
        return int(size_str[:-1]) * 1024 * 1024 * 1024
    else:
        return int(size_str)

def generate_data(use_random, num_bytes):
    if use_random:
        return ''.join(random.choice(string.ascii_letters) for _ in range(num_bytes))
    else:
        return 'a' * num_bytes

def main():
    if len(sys.argv) != 2:
        print("Usage: python script_name.py <size>")
        sys.exit(1)

    try:
        num_bytes = parse_size(sys.argv[1])
    except ValueError:
        print("Please provide a valid size. Examples: 100, 100K, 5M, 1G.")
        sys.exit(1)

    # Change this variable to True if you want random alphabetical characters
    # and to False if you want all 'a's
    use_random_data = True

    data = generate_data(use_random_data, num_bytes)

    with open(f"test_data{sys.argv[1]}", "w") as f:
        f.write(data)

    print(f"File 'test_data{sys.argv[1]}' with {num_bytes} bytes created successfully!")

if __name__ == "__main__":
    main()
