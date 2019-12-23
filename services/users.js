const axios = require('axios');
require('dotenv').config();

const { USERS_URL } = process.env;

const adapter = axios.create({ baseURL: USERS_URL });

async function getUsersByHour(hour) {
  try {
    const serviceResponse = await adapter.get(`/private/${hour}`);
    if (!serviceResponse.data) {
      throw new Error('No data.');
    }
    return {
      users: serviceResponse.data,
      error: null,
    };
  } catch (err) {
    return {
      users: [],
      error: err,
    };
  }
}

module.exports = { getUsersByHour };
