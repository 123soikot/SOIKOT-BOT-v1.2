module.exports = async ({ api, event }) => {
  const logger = require('./SOIKOT/catalogs/SOIKOT.js);
  
  const configCustom = {
    autosetbio: {
      status: false,
      bio: `prefix : ${global.config.PREFIX}`,
      note: 'automatically change the bot bio.'
    },
    notification: {
      status: true,
      time: 39, // 39 minutes
      note: 'bot will update you on his informations like all users, all groups, all operators, all admins every 30 minutes'
    },
    greetings: {
      status: true,
      morning: `goodmorning everyone, have a nice day.`,
      afternoon: `goodafternoon everyone, don't forget to eat your lunch.`,
      evening: `goodevening everyone, don't forget to eat.`,
      sleep: `goodnight everyone, time to sleep.`,
      note: 'greetings every morning, afternoon and evening. the timezone is located in Asia/Manila'
    },
    reminder: {
      status: false,
      time: 40, // 40 minutes
      msg: 'reminder test',
      note: 'this is a reminder for 40 minutes, you can disabled it by setting the status to false'
    },
    autoDeleteCache: {
      status: true,
      time: 10, // 10 minutes
      note: 'auto delete caches, kindly set the status to true, if you dont want to delete caches, set the status to false.'
    },
    autoRestart: {
      status: true,
      time: 40, // 40 minutes
      note: 'to avoid problems, enable periodic bot restarts, set the status to false if you want to disable auto restart function.'
    },
    accpetPending: {
      status: false,
      time: 10, // 10 minutes
      note: 'approve waiting messages after a certain time, set the status to false if you want to disable auto accept message request.'
    }
  };
 
  function autosetbio(config) {
    if (config.status) {
      try {
        api.changeBio(config.bio, (err) => {
          if (err) {
            logger(`having some unexpected error : ${err}`, 'setbio');
          } else {
            logger(`changed the bot bio into : ${config.bio}`, 'setbio');
          }
        });
      } catch (error) {
        logger(`having some unexpected error : ${error}`, 'setbio');
      }
    }
  }

  function notification(config) {
    if (config.status) {
      setInterval(async () => {
        const operator = global.config.OPERATOR[0];
        api.sendMessage(`bot information\n\nusers : ${global.data.allUserID.length}\ngroups : ${global.data.allThreadID.length}\noperators : ${global.config.OPERATOR.length}\nadmins : ${global.config.ADMINBOT.length}`, operator);
      }, config.time * 60 * 1000);
    }
  }

  function greetings(config) {
    if (config.status) {
      try {
        const nam = [
          { timer: '5:00:00 AM', message: [config.morning] },
          { timer: '11:00:00 AM', message: [config.afternoon] },
          { timer: '6:00:00 PM', message: [config.evening] },
          { timer: '10:00:00 PM', message: [config.sleep] }
        ];
        
        setInterval(() => {
          const match = nam.find(i => i.timer === new Date(Date.now() + 25200000).toLocaleTimeString('en-US', { hour12: false }));
          if (match) {
            global.data.allThreadID.forEach(i => api.sendMessage(match.message[0], i));
          }
        }, 1000);
      } catch (error) {
        logger(`having some unexpected error : ${error}`, 'greetings');
      }
    }
  }

  function reminder(config) {
    if (config.status) {
      setInterval(async () => {
        let allThread = global.data.allThreadID || [];
        allThread.forEach(each => {
          try {
            api.sendMessage(config.msg, each, (err) => {
              if (err) {
                logger(`having some unexpected error : ${err}`, 'reminder');
              }
            });
          } catch (error) {
            logger(`having some unexpected error : ${error}`, 'reminder');
          }
        });
      }, config.time * 60 * 1000);
    }
  }

  function autoDeleteCache(config) {
    if (config.status) {
      setInterval(() => {
        const { exec } = require('child_process');
        exec('rm -rf ../../scripts/commands/cache && mkdir -p ../../scripts/commands/cache && rm -rf ../../scripts/events/cache && mkdir -p ../../scripts/events/cache', (error, stdout, stderr) => {
          if (error) {
            logger(`error : ${error}`, "cache");
            return;
          }
          if (stderr) {
            logger(`stderr : ${stderr}`, "cache");
            return;
          }
          logger(`successfully deleted caches`, "cache");
        });
      }, config.time * 60 * 1000);
    }
  }

  function autoRestart(config) {
    if (config.status) {
      setInterval(() => {
        logger(`auto restart is processing, please wait.`, "BADOL");
        process.exit(1);
      }, config.time * 60 * 1000);
    }
  }

  function accpetPending(config) {
    if (config.status) {
      setInterval(async () => {
        const list = [
          ...(await api.getThreadList(1, null, ['PENDING'])),
          ...(await api.getThreadList(1, null, ['OTHER']))
        ];
        if (list[0]) {
          api.sendMessage('this thread is automatically approved by our system.', list[0].threadID);
        }
      }, config.time * 60 * 1000);
    }
  }

  autosetbio(configCustom.autosetbio);
  notification(configCustom.notification);
  greetings(configCustom.greetings);
  reminder(configCustom.reminder);
  autoDeleteCache(configCustom.autoDeleteCache);
  autoRestart(configCustom.autoRestart);
  accpetPending(configCustom.accpetPending);
};
