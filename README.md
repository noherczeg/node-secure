# Node Secure

A sample Express application with all sorts of security functionality built in.

## Startup
- `npm install`
- `gen-cert.sh`: On windows the `-subj` part needs double "//"-es, but in *nix-based systems it has
to be a single "/"!
- `npm start`

> Site should be available at [https://localhost:3000](https://localhost:3000)

## Covered topics

### Development

#### ESLint plugins
- plugin:node/recommended
- plugin:security/recommended

### Server level
 
#### Logging
Proper log messages with Morgan.

#### Default error handler
Never expose system information in responses. Utilize custom error response:
[server/top-level-error-handler.js](server/top-level-error-handler.js)

#### DDOS prevention
Express Rate Limit

#### Secret management
Never use keys/secure information in project sources. Utilize dotenv.

#### Do not expose referer headers
`helmet.referrerPolicy()`

#### Do not trust scripts, iframes
`helmet.contentSecurityPolicy()`

#### Prevent unnecessary Browser features
`helmet.featurePolicy()`

## Sources
- https://git.io/security
- https://github.com/goldbergyoni/nodebestpractices
- https://helmetjs.github.io

## License
MIT
