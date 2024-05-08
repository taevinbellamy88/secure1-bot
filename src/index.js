require("dotenv").config();
const fs = require("fs");
const { Client, GatewayIntentBits } = require("discord.js");
const eventHandler = require("./botHandlers/eventHandler.js");
const commandHandler = require("./botHandlers/commandHandler.js");
const cron = require("node-cron");
const {
   promoteRandomHoodie,
} = require("./services/product-promo/hoodiesPromoService.js");
const { promoteRandomTee } = require("./services/product-promo/teePromoService.js");
const { promoteRandomGear } = require("./services/product-promo/gearPromoService.js");

const client = new Client({
   intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
   ],
});

const job = cron.schedule(
   "0 0 14 */3 * *", // Run at 14:00 (2 PM) every 3 days
   () => {
      console.log("Running the scheduled task at 2 PM PST every 3 days.");
      promoteRandomHoodie(client);
   },
   {
      scheduled: false,
      timezone: "America/Los_Angeles",
   }
);

const job2 = cron.schedule(
   "0 0 14 */2 * *", // Run at 14:00 (2 PM) every 3 days
   () => {
      console.log("Running the scheduled task at 2 PM PST every 3 days.");
      promoteRandomTee(client);
   },
   {
      scheduled: false,
      timezone: "America/Los_Angeles",
   }
);

const job3 = cron.schedule(
   "0 0 19 */2 * *", // Run at 14:00 (7 PM) every 2 days
   () => {
      console.log("Running the scheduled task at 7 PM PST every 2 days.");
      promoteRandomGear(client);
   },
   {
      scheduled: false,
      timezone: "America/Los_Angeles",
   }
);

job.start();

eventHandler.loadEvents(client);
commandHandler.loadCommands(client);

client.login(process.env.BOT_TOKEN);
