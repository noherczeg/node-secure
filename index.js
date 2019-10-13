const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const uuidv4 = require("uuid/v4");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const { topLevelErrorHandler } = require("./server/top-level-error-handler");

require("dotenv").config();

const privateKey = fs.readFileSync("certs/server.key");
const certificate = fs.readFileSync("certs/server.crt");
const credentials = { key: privateKey, cert: certificate };
const publicPath = path.join(__dirname, "public");
const port = process.env.PORT || 3000;
const publicOptions = {
  extensions: ["html", "js", "css"],
  index: false,
  maxAge: "1d",
};

const app = express();

app.use(topLevelErrorHandler);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: "strict-origin" }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "stackpath.bootstrapcdn.com",
        "cdnjs.cloudflare.com",
      ],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
      fontSrc: ["'self'", "cdnjs.cloudflare.com"],
    },
  })
);
app.use(
  helmet.featurePolicy({
    features: {
      fullscreen: ["'self'"],
      vibrate: ["'none'"],
      payment: ["example.com"],
      syncXhr: ["'none'"],
      autoplay: ["'none'"],
      camera: ["'none'"],
      geolocation: ["'none'"],
      microphone: ["'none'"],
      usb: ["'none'"],
      vr: ["'none'"],
      wakeLock: ["'none'"],
    },
  })
);
app.use(morgan("combined"));
app.use((req, res, next) => {
  res.locals.nonce = uuidv4();
  next();
});
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.text({ type: "text/html" }));
app.use(express.static(publicPath, publicOptions));

app.get("/error", () => {
  throw new Error("BROKEN");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
