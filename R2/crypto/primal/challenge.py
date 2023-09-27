from itertools import count, islice
import binascii

def postponed_sieve(): # See: https://stackoverflow.com/a/10733621
    yield 2
    yield 3
    yield 5
    yield 7
    sieve = {}
    ps = postponed_sieve()
    p = next(ps) and next(ps)
    q = p*p
    for c in count(9, 2):
        if c in sieve:
            s = sieve.pop(c)
        elif c < q:
            yield c
            continue
        else:
            s = count(q+2*p, 2*p)
            p = next(ps)
            q = p*p
        for m in s:
            if m not in sieve:
                break
        sieve[m] = s
primes = list(islice(postponed_sieve(), 256))

def encrypt(data: str) -> tuple[int, str]:
    result = 1
    plaintext = data.encode('ascii')
    for c in plaintext:
        result *= primes[c]
    return (result, hex(binascii.crc32(plaintext)))

flag = '<REDACTED>'
print(encrypt(flag)) # (30141769484874079821574470471365328781159116337, '0xa53a9899')
