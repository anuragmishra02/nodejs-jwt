#### Environment Variables

```
PORT=7050

UserServices_Server=http://127.0.01:7000
UserServices_Version=v1
UserServices_Deprecated=v2

MerchantServices_Server=http://127.0.0.1:7000
MerchantServices_Version=v1
MerchantServices_Deprecated=v2,v3

# Auth
JWT_EXPIRY_TIME=60000
COOKIE_NAME=stk_auth
JWT_SECRET=b62a685c103f2373b131ecc7b179d6bf
```

#### Api documentation

- API Security
    - [CSRF](docs/security/csrf.md)