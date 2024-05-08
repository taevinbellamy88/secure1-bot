const { processDiscountCommand } = require("../services/discountCodeService.js");
const ADMIN_USER_ID = process.env.ADMIN_ID;

module.exports = {
   name: "messageCreate",
   async execute(message) {
      if (message.author.bot) return;

      if (message.content.toLowerCase() === "!ping") {
         message.reply("Pong!");
         return;
      }

      if (message.content.startsWith("!createDiscount10")) {
         if (message.author.id === ADMIN_USER_ID) {
            processDiscountCommand(message);
         } else {
            message.reply("You do not have permission to use this command.");
            return;
         }
      }

      if (message.content.startsWith("/") || message.interaction) {
         const commandName = message.interaction
            ? message.interaction.commandName
            : message.content.slice(1).trim().split(/ +/)[0].toLowerCase();

         const command = message.client.commands.get(commandName);
         if (!command) return;

         try {
            await command.execute(message.interaction || message);
         } catch (error) {
            console.error(error);
            message.reply("There was an error while executing that command!");
         }
      }
   },
};
