set -e

openssl ecparam -genkey -name secp384r1 -out ca.key
openssl req -x509 -new -sha512 -nodes -key ca.key -days 1342 -out ca.crt -config conf/ca.conf

openssl ecparam -genkey -name secp384r1 -out host.key
openssl req -new -sha512 -nodes -key host.key -out host.csr -config conf/host.conf
openssl x509 -req -sha512 -days 1342 -in host.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out host.crt -extfile conf/host-ext.conf

openssl ecparam -genkey -name secp384r1 -out checker.key
openssl req -new -sha512 -nodes -key checker.key -out checker.csr -config conf/checker.conf
openssl x509 -req -sha512 -days 1342 -in checker.csr -CA ca.crt -CAkey ca.key -CAserial ca.srl -out checker.crt -extfile conf/checker-ext.conf

rm host.csr checker.csr
