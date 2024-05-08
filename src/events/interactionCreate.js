module.exports = {
   name: "interactionCreate",
   async execute(interaction) {
      if (interaction.isCommand() && interaction.commandName === "ping") {
         await interaction.reply("Pong!");
         return;
      }

      if (!interaction.isCommand()) return;

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
         console.log(`No command matching ${interaction.commandName} was found.`);
         return;
      }

      try {
         await command.execute(interaction);
      } catch (error) {
         console.error(error);
         await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
         });
      }
   },
};
