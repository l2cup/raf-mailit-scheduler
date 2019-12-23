const axios = require('axios');
require('dotenv').config();

const { SUBSCRIPTIONS_URL } = process.env;

const adapter = axios.create({ baseURL: SUBSCRIPTIONS_URL });

async function getCryptocurrency(sign) {
  try {
    const serviceResponse = await adapter.get('crypto/symbol/', {
      params: {
        symbol: sign,
      },
    });
    return serviceResponse.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = { getCryptocurrency };
