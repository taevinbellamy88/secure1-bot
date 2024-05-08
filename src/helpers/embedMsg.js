// src/models/embedMsg.js
const { EmbedBuilder } = require("discord.js");
/**
 * Creates a Discord embed message template.
 * @param {string} title - The title of the embed.
 * @param {string} description - The main text content of the embed.
 * @param {string} imageUrl - The URL of the image to include in the embed.
 * @returns {EmbedBuilder} - The configured embed message.
 */
function createEmbedWithImage(title, description, imageUrl) {
   // Create the embed and set its properties
   const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(0xff0000)
      .setImage(imageUrl); // Reference the image in the embed using "attachment://"

   return { embeds: [embed] };
}

module.exports = { createEmbedWithImage };
