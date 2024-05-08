// src/models/embedMsg.js
const { EmbedBuilder } = require("discord.js");
/**
 * Creates a Discord embed message template.
 * @param {string} title - The title of the embed.
 * @param {string} description - The main text content of the embed.
 * @param {string} imageUrl - The URL of the image to include in the embed.
 * @param {string} discountCode - The discount code to display.
 * @returns {EmbedBuilder} - The configured embed message.
 */
function createEmbedWithImageWithDiscount(title, description, imageUrl, discountCode) {
   // Create the embed and set its properties
   const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(0xff0000)
      .setImage(imageUrl) // Reference the image in the embed using "attachment://"
      .addFields({ name: "10% Discount Code", value: discountCode, inline: true });

   return { embeds: [embed] };
}

module.exports = { createEmbedWithImageWithDiscount };
