import express from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';
import enforce from 'express-sslify';

dotenv.config();

const app = express();
const port = process.env.PORT || 12000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enforce HTTPS
app.use(enforce.HTTPS({ trustProtoHeader: true }));

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*.force.com');
  next();
});

app.get('/memser/idle', (req, res) => {
  const { ext, callerid } = req.query;
  if (!ext || !callerid) {
    return res.status(400).send('Missing required query parameters');
  }

  const filename = `${ext}.dat`;
  const filePath = path.join('V:\\s_cti\\connected', filename);

  fs.writeFile(filePath, callerid, (err) => {
    if (err) {
      return res.status(500).send('Error writing file');
    }
    res.send('File created successfully');
  });
});

// HTTPS server options
// const options = {
//   key: fs.readFileSync(path.join(__dirname, 'path/to/your/private-key.pem')),
//   cert: fs.readFileSync(path.join(__dirname, 'path/to/your/certificate.pem'))
// };

https.createServer(options, app).listen(port, () => {
  console.log(`Server running on https://localhost:${port}`);
});
