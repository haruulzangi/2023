import os
import zipfile
import tarfile

for i in range(999, -1, -1):
    current_file = str(i)
    with open(current_file, "rb") as file:
        header = file.read(2)
        if header == b"PK":
            with zipfile.ZipFile(current_file) as archive:
                archive.extractall()
        else:
            with tarfile.open(current_file) as archive:
                archive.extractall()
    os.remove(current_file)
