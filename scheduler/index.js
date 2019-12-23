const schedule = require('node-schedule');
const mailService = require('../services');

let hour = 1;

function startScheduler() {
  schedule.scheduleJob('00 * * * *', async () => {
    hour = (hour + 1) % 25;
    try {
      await mailService.sendMailMaterial(hour);
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = { startScheduler };
