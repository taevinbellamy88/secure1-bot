// commandHandler.js

const fs = require("fs");
const path = require("path");

module.exports = {
   loadCommands: function (client) {
      client.commands = new Map();
      const commandsPath = path.join(__dirname, "..", "commands");
      const commandFiles = fs
         .readdirSync(commandsPath)
         .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
         const filePath = path.join(commandsPath, file);
         try {
            const { name, execute } = require(filePath);
            if (!name || !execute) {
               throw new Error("Command file is missing a name or execute function.");
            }
            client.commands.set(name, { name, execute });
         } catch (error) {
            console.error(`Error loading command ${file}:`, error);
         }
      }
   },
};
