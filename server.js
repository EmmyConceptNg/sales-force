import express from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';
import enforce from 'express-sslify';
import winston from 'winston';

dotenv.config();

// Initialize __filename and __dirname first
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure logger
const logDir = path.join(__dirname, 'logs');
// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
    new winston.transports.Console()
  ]
});

const app = express();
const port = process.env.PORT || 12000;
const host = '10.89.11.230'; // Specific IP address to bind to

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
    logger.error(`Missing required params: ext=${ext}, callerid=${callerid}`);
    return res.status(400).send('Missing required query parameters');
  }

  const filename = `${ext}.dat`;
  const dirPath = 'V:\\s_cti\\connected';
  const filePath = path.join(dirPath, filename);

  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`Created directory: ${dirPath}`);
    } catch (err) {
      logger.error(`Error creating directory ${dirPath}: ${err.message}`);
      return res.status(500).send('Error creating directory');
    }
  }

  logger.info(`Writing file ${filename} with caller ID: ${callerid}`);

  fs.writeFile(filePath, callerid, (err) => {
    if (err) {
      logger.error(`Error writing file ${filename}: ${err.message}`);
      return res.status(500).send('Error writing file');
    }
    logger.info(`File ${filename} created successfully`);
    res.send('File created successfully');
  });
});

// HTTPS server options
// const options = {
//   key: fs.readFileSync(path.join(__dirname, 'path/to/your/private-key.pem')),
//   cert: fs.readFileSync(path.join(__dirname, 'path/to/your/certificate.pem'))
// };

app.listen(port, '0.0.0.0', () => {
  logger.info(`Server running on https://localhost:${port}`);
  console.log(`Server running on https://localhost:${port} (all interfaces)`);
}).on('error', (err) => {
  logger.error(`Error starting server: ${err.message}`);
  
  if (err.code === 'EACCES') {
    logger.error(`Permission denied - you might need to run with administrator privileges or use a port above 1024`);
  } else if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${port} is already in use. Try a different port.`);
  }
  
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  logger.error(error.stack);
});
