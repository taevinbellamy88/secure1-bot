const axios = require("axios");
const { createEmbedWithImage } = require("../../helpers/embedMsg.js");
const { ChannelType } = require("discord.js");

/**
 * Fetches a list of hoodies from a Shopify collection.
 * @param {string} shopDomain - The domain of the Shopify store.
 * @param {string} accessToken - The access token for Shopify API.
 * @param {number} collectionId - The ID of the hoodie collection.
 */
async function fetchTees(shopDomain, accessToken, collectionId) {
   try {
      const url = `https://${shopDomain}/admin/api/2022-01/collections/${collectionId}/products.json`;
      const response = await axios.get(url, {
         headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
         },
      });
      return response.data.products;
   } catch (error) {
      console.error("Failed to fetch hoodies:", error);
      return [];
   }
}

/**
 * Selects a random hoodie from a list of products.
 * @param {Array} products - The products from which to select.
 * @returns {Object} The selected hoodie product.
 */
function selectRandomTee(products) {
   const randomIndex = Math.floor(Math.random() * products.length);
   return products[randomIndex];
}

/**
 * Creates a promotional message for a hoodie.
 * @param {Object} hoodie - The hoodie product to promote.
 * @returns {EmbedBuilder} The configured embed message.
 */
function createTeePromotionMessage(hoodie) {
   const title = hoodie.title;
   const description = hoodie.body_html.replace(/<[^>]+>/g, "");
   const imageUrl = hoodie.image.src;

   return createEmbedWithImage(title, description, imageUrl);
}

/**
 * Sends an embed message to specified channels.
 * @param {Object} embedMessage The embed message object to send.
 * @param {Array<string>} channelIds The IDs of the channels to send the message to.
 */
async function sendMessageToChannels(embedMessage, channelIds, client) {
   for (const channelId of channelIds) {
      try {
         const channel = await client.channels.fetch(channelId);

         if (channel && channel.type === ChannelType.GuildText) {
            await channel.send(embedMessage);
            console.log(
               `Message sent successfully to the channel with ID: ${channelId}`
            );
         } else {
            console.error(
               `The channel with ID: ${channelId} was not found or is not a text channel.`
            );
         }
      } catch (error) {
         console.error(
            `Failed to send message to channel with ID: ${channelId}:`,
            error
         );
      }
   }
}

async function promoteRandomTee(client) {
   const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
   const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
   const collectionId = process.env.TEE_COLLECTION_ID;

   const tees = await fetchTees(shopDomain, accessToken, collectionId);
   if (tees.length > 0) {
      const tee = selectRandomTee(tees);
      const embedMessage = createTeePromotionMessage(tee);

      const channelIds = process.env.PROMO_CHANNEL_IDS.split(",");

      sendMessageToChannels(embedMessage, channelIds, client);
   } else {
      console.log("No hoodies found to promote.");
   }
}

module.exports = { promoteRandomTee };
