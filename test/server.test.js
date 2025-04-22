import axios from 'axios';
import { expect } from 'chai';

describe('Server Tests', () => {
  const baseURL = 'http://localhost:12500'; // changed back to https

  it('should return 400 for missing query parameters', async () => {
    try {
      await axios.get(`${baseURL}/memser/idle`);
    } catch (error) {
      if (error.response) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.equal('Missing required query parameters');
      } else {
        throw error;
      }
    }
  });

  it('should create a file successfully', async () => {
    const response = await axios.get(`${baseURL}/memser/idle`, {
      params: { ext: '123', callerid: '456' }
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.equal('File created successfully');
  });
});
