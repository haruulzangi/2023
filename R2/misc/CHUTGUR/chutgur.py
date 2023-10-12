#!/usr/bin/python3
import socket
import threading
import time
import json
import random
from art import *

PORT = 1337

SPECIAL_FLAG = "HZ2023{z0n_0ln1!G_zovL0ng00s_g3tElG3v!}"

with open('quotes.json', 'r') as json_file:
    data = json.load(json_file)

quotes = data

def handle_client(client_socket):
    try:
        for round_number in range(1, 126):  # Changed the range to 1-125 (inclusive)
            round_banner = text2art(f"CHUTGUR{round_number}", "lcd")

            for _ in range(1):
                random_quote = random.choice(quotes)

                hero_name = random_quote["hero_name"]
                quote = random_quote["voice_line"]["quote"]

                client_socket.send(f"{round_banner}\nЗарлиг: {quote}\nАлдар ? : ".encode())

                client_socket.settimeout(3)

                try:
                    answer = client_socket.recv(1024).decode()
                    print(f"answer: {answer}")

                    if answer.strip() == random_quote["hero_name"]:
                        client_socket.send("Онц!\n".encode())
                    else:
                        client_socket.send(f"Буруу, эс болов. \n".encode())
                        client_socket.close()  # Close the connection for a wrong answer
                        return  # Exit the function

                except socket.timeout:
                    # Zasah (Timeout)
                    client_socket.send("Удаааан байна.\n".encode())
                    client_socket.close()  # Close the connection for a timeout
                    return  # Exit the function

        print("Зон олныг зовлонгоос гэтэлгэв.\n")
        time.sleep(3)
        client_socket.send(SPECIAL_FLAG.encode())

    except Exception as e:
        print(f"Error handling client: {e}")

    finally:
        client_socket.close()

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', PORT))
server.listen(5)

print(f"Listening on port {PORT}")

while True:
    # Accept client connections
    client_socket, addr = server.accept()
    print(f"Accepted connection from {addr}")

    # Create a new thread to handle the client
    client_handler = threading.Thread(target=handle_client, args=(client_socket,))
    client_handler.start()

