#### CSRF Protection

Conside the following form is hidden in a different website(e.g https://netflix.com).

```html
<form action="https://api.stacker.nets.eu/payment" method="POST">
    <input type="text" name="destination"/>
</form>
```

The cookies will be appended every time a request is placed to **api.stacker.nets.eu**. There is no way we can determine that the user has agreed to purchase a content and he/she clicked pay button from the **stacker.nets.eu**.

Inorder to prevent this attack, the user has to manually append a **csrf token**(csrf prevention token) in each and every request. So when a attacker tricks the user to execute the payment request, the request will fail as **csrf token** is missing from the request.

#### CSURF Module

To secure stacker apis from csrf attacks, we use csurf module which

- Generate tokens
- Check tokens in each request.

CSURF works as follows:

- The client will place a get request to get the token from server(/register and /login).
- CSURF will generate a token with a secret and sends the token in the response object.
- In the express server, 
    - if cookie option is false(default) the secret is saved as **req[sessionKey].csrfSecret**.
    - If cookie option is true, the secret will be saved in browser cookies

#### Stacker CSRF

- As csurf does not provide expiry, stacker attaches expiry time with the generated token.    

```javascript
    const csrfToken = "abcdefghijklmno";
    const stacker_csrf = {
        token: csrfToken,
        issued_at: Date.now()            
    };
```
- As csurf does not validate whether a csrf token is issued for the given user, stacker attaches is with the token.

```javascript
    const csrfToken = "abcdefghijklmno";
    const stacker_csrf = {
        token: csrfToken,
        issued_at: Date.now(),
        id: userId
    };    
```

- After the object is composed, the data is encrypted.

```js
algorithm= "aes-192-cbc";
password= "env_csrfSecret";
key= "hash_of_password"; // => Password Based Key Derivation Function
```

- Stacker sends this encrypted data as token to the client.

- When the subsequent request are received, we will decrypt and,
    - If expired don't process the request.
    - If userId don't match the jwt token userId, don't process the request.

> This implementation assumes that the user is already validated by jwt.
> JWT attaches userId in the request object i.e **req.userId**.
> stacker_csrf compares the userId with the decrypted id. The request will be processed only if the ids match.
> We can change the implementation later by attaching the decoded id in the request object, **req.csrfId**. This will allows to interchange the middlewares.