from itertools import count, islice


def postponed_sieve():  # See: https://stackoverflow.com/a/10733621
    yield 2
    yield 3
    yield 5
    yield 7
    sieve = {}
    ps = postponed_sieve()
    p = next(ps) and next(ps)
    q = p * p
    for c in count(9, 2):
        if c in sieve:
            s = sieve.pop(c)
        elif c < q:
            yield c
            continue
        else:
            s = count(q + 2 * p, 2 * p)
            p = next(ps)
            q = p * p
        for m in s:
            if m not in sieve:
                break
        sieve[m] = s


primes = list(islice(postponed_sieve(), 256))

ciphertext = 30141769484874079821574470471365328781159116337
chars = {}
for i in range(256):
    while ciphertext % primes[i] == 0 and ciphertext > 1:
        chars[chr(i)] = chars.setdefault(chr(i), 0) + 1
        ciphertext //= primes[i]

for char in "HZ2023{}":
    chars[char] -= 1
plaintext = ""
for char, count in chars.items():
    plaintext += char * count

import binascii
from itertools import permutations

for guess in permutations(plaintext):
    flag_guess = "HZ2023{" + "".join(guess) + "}"
    if binascii.crc32(flag_guess.encode("ascii")) == 0xA53A9899:
        print("Found flag:", flag_guess)
        break
