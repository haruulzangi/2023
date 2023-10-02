set -e

openssl ecparam -genkey -name secp384r1 -out certs/ca.key
openssl req -x509 -new -sha512 -nodes -key certs/ca.key -days 1342 -out certs/ca.crt -config conf/ca.conf

openssl ecparam -genkey -name secp384r1 -out certs/host.key
openssl req -new -sha512 -nodes -key certs/host.key -out certs/host.csr -config conf/host.conf
openssl x509 -req -sha512 -days 1342 -in certs/host.csr -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial -out certs/host.crt -extfile conf/host-ext.conf

openssl ecparam -genkey -name secp384r1 -out certs/checker.key
openssl req -new -sha512 -nodes -key certs/checker.key -out certs/checker.csr -config conf/checker.conf
openssl x509 -req -sha512 -days 1342 -in certs/checker.csr -CA certs/ca.crt -CAkey certs/ca.key -CAserial certs/ca.srl -out certs/checker.crt -extfile conf/checker-ext.conf

rm certs/*.csr
