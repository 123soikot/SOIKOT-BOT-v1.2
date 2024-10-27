const axios = require('axios');

module.exports.config = {
  name: "AI",
  version: "1.0",
  permission: 0,
  credits: "SOIKOT",
  prefix: true,
  description: "gpt",
  category: "General",
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const question = args.join(' ');

    if (!question) {
      return api.sendMessage("আপনার প্রশ্ন টি AI লিখে অ্যাড করুন:📌 📝", event.threadID);
    }

    const response = await axios.get(`https://mostakim-api.onrender.com/gpt4?ask=${question}&id=25527373`);

    if (response.data.error) {
      return api.sendMessage("Oops! The AI encountered an error. Please try again later.", event.threadID);
    }

    const answer = response.data.Mostakim;

    if (answer) {
      api.sendMessage(`${global.config.BOTNAME}\n𝐓𝐡𝐢𝐬 𝐢𝐬 𝐦𝐲 𝐀𝐧𝐬𝐰𝐞𝐫🙆‍♂️😌\n\n${answer}`, event.threadID);
    } else {
      api.sendMessage("There's something wrong. Please try again...", event.threadID);
    }
  } catch (error) {
    console.error('Error fetching response:', error);
    api.sendMessage("Error fetching response.", event.threadID);
  }
};
