import axios from 'axios';
import { expect } from 'chai';

describe('Server Tests', () => {
  const baseURL = 'https://localhost:12000';

  it('should return 400 for missing query parameters', async () => {
    try {
      await axios.get(`${baseURL}/memser/idle`);
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.equal('Missing required query parameters');
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
