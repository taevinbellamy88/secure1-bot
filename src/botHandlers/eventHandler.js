// This file will handle the dynamic loading of event files
// & include error handling to ensure only valid event files are executed.
// eventHandler.js

const fs = require("fs");
const path = require("path");

module.exports = {
   loadEvents: function (client) {
      const eventsPath = path.join(__dirname, "..", "events");
      const eventFiles = fs
         .readdirSync(eventsPath)
         .filter((file) => file.endsWith(".js"));

      for (const file of eventFiles) {
         const filePath = path.join(eventsPath, file);
         try {
            const event = require(filePath);
            if (event.once) {
               client.once(event.name, (...args) => event.execute(...args));
            } else {
               client.on(event.name, (...args) => event.execute(...args, client));
            }
         } catch (error) {
            console.error(`Error loading event ${file}:`, error);
         }
      }
   },
};
