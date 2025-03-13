
# Technical Guidelines for Developer - Salesforce Integration

## Overview
This document aims to guide the developer in integrating with Salesforce services, including data reception, file creation, and configuring the appropriate headers to ensure secure and proper communication.

## Workflow

### 1. Receiving Data from Salesforce
- Salesforce sends a request to:
  ```
  https://SERVERIP:PORT/memser/idle?ext=EXT&callerid=CALLERID&recorder=FILENAME
  ```
- Received parameters:
  - `EXT` - Extension number
  - `CALLERID` - Caller ID
  - `FILENAME` - Recording file name

### 2. Creating a Data File
- After receiving the data, a file named `extname.dat` must be created and placed in the following directory:
  ```
  V:\s_cti\connected
  ```
- The filename should be `ext`, and it should contain the `callerid` value.

### 3. Configuring Cross-Origin Resource Sharing (CORS)
- Since the request originates from an internal Salesforce domain, the response header must be configured to allow the request:
  ```
  Access-Control-Allow-Origin: *.force.com
  ```
- Ensure that all requests from domains ending in `force.com` are approved.

## Additional Guidelines

### Transition to HTTPS
- Salesforce requires all communication to be conducted over HTTPS to meet security standards.
- Ensure the service runs on port 12,000.

### Testing and Validation
- Verify data reception and service functionality using the Salesforce Sandbox environment.
- Ensure the system saves the data in the required format on the server.

## Action Items
1. Maor will send the exact data format and required headers.
2. Maor will send a screenshot of the Salesforce button interface.
3. The developer will integrate the configurations and conduct validation tests in the Salesforce Sandbox environment.

For further questions or clarifications, contact Shachar Amar.
