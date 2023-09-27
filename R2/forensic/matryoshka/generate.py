import os
import zipfile
import tarfile

current_file = "flag.txt"
for i in range(1000):
    choice, = os.urandom(1)
    if choice & 1:
        with zipfile.ZipFile(str(i), 'w') as file:
            file.write(current_file)
    else:
        with tarfile.open(str(i), 'w') as file:
            file.add(current_file)
    if i > 0:
        os.remove(current_file)
    current_file = str(i)
