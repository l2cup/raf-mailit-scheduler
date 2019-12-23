const userService = require('./users.js');
const subscriptionService = require('./subscriptions.js');
const messageQueueService = require('./message_queue.js');


async function getMailMaterial(hour) {
  try {
    const userData = await userService.getUsersByHour(hour);
    if (userData.error !== null) {
      throw new Error('Error getting users.');
    }
    const formatted = await Promise.all(
      userData.users.map(async (user) => {
        let values = await Promise.all(user.subscriptions
          .filter((subscription) => subscription.name === 'Cryptocurrencies')
          .map(async (subscription) => subscription.parameters));
        values = values.flat(1);

        const mailValues = await Promise.all(values.map(async (value) => {
          const currency = await subscriptionService.getCryptocurrency(value);
          return currency;
        }));

        return Object.freeze({
          name: user.username,
          email: user.email,
          currencies: mailValues,
        });
      }),
    );
    return formatted.filter((form) => form.currencies.length > 0);
  } catch (err) {
    return {
      data: null,
      error: err,
    };
  }
}

async function sendMailMaterial(hour) {
  try {
    const userData = await getMailMaterial(hour);
    messageQueueService.sendToQueue(userData);
    return { error: null };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
}


module.exports = { sendMailMaterial };
