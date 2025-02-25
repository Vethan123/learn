from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization
import base64

def encrypt_aes_key_with_rsa(aes_key_base64, public_key_pem_base64):
    aes_key = base64.b64decode(aes_key_base64)
    public_key_pem = base64.b64decode(public_key_pem_base64)

    public_key = serialization.load_pem_public_key(public_key_pem)

    encrypted_aes_key = public_key.encrypt(
        aes_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    encrypted_aes_key_base64 = base64.b64encode(encrypted_aes_key).decode('utf-8')

    return encrypted_aes_key_base64

aes_key_base64 = "64bb84e56ee5169ea15bf3c477cd0f704758a0e82bf17e78f2ab998a49fd7a76"
public_key_pem_base64 = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUE0M0VaKzhyOVV1dzNJYkw2ZjVJZgo0NWlIZU1aNkdWVkVNRnpUa0VENUVoc3M3K2pza05HdkY1dUhQY1NuWlNxSXEycW4wamprZkNxNkduOUhkTnFnCmpqR0g3SzVpVGZkMlEzNGZ1RGN5Vm1CbEhwRW9GWGRva1BJY1Z0bzE5WEErTWx2aU8xdlc4U1M1Z1JERjZNeXEKUHNtR1hRaUl2MzNCTy9zMzNwdEt6SHpkbTBSMXVUc3ZhQm9rd0RKTVhpdEFqRloyMk50MS9Oa0ZXYnJLWENOSApFTGwzU2hTS1R0T3lodG9zWVB5OUdjSDdtSGlRb05lY0E4eXVnaE56aStNNmVya1dQc0Vnei9XcDNjWi9yUlRCCjZJZVloQmk0aXF4MG5RLzVUdC8rQ0tMdzhyUUp2RmZCZDRhS2ZSVnRDKzBTYUV1bHdNQWVNaUJFSnhSU3pFR28KVHdJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg=="

encrypted_aes_key_base64 = encrypt_aes_key_with_rsa(aes_key_base64, public_key_pem_base64)

print(encrypted_aes_key_base64)
