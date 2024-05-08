const axios = require("axios");
const {
   createEmbedWithImageWithDiscount,
} = require("../helpers/embedMsgDiscounted.js");
require("dotenv").config();

async function processDiscountCommand(message) {
   const { numericUserId, discountCode } = ExtractUserAndCode(message);
   if (!numericUserId || !discountCode) {
      return;
   }

   let siteKey = null;
   if (discountCode.startsWith("gold")) {
      siteKey = process.env.SITE_KEY;
   }

   try {
      const result = await handleCreateDiscountCode10(numericUserId, discountCode);
      await SendDiscountCodeMsgsToUser(
         message,
         result,
         message.client,
         numericUserId,
         siteKey
      );
   } catch (error) {
      console.error("Error handling promo:", error);
      message.channel.send("Failed to create discount code.");
   }
}

function ExtractUserAndCode(message) {
   const args = message.content.split(" ");
   if (args.length < 3) {
      message.reply("Please provide both a user mention and a discount code.");
      return null;
   }

   const userId = args[1];
   const numericUserId = userId.replace(/[<@!>]/g, "");
   const code = args[2];
   const generator = require("../helpers/generator.js");
   const discountCode = `${code}-${generator.generateRandomSuffix()}`;

   if (!numericUserId || !userId) {
      message.reply("Please mention a valid user to send the discount code.");
      return null;
   }

   return { numericUserId, discountCode };
}

async function handleCreateDiscountCode10(userId, code) {
   const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
   const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
   const priceRuleId10 = process.env.PRICE_RULE_10;

   try {
      const response = await axios.post(
         `https://${shopDomain}/admin/api/2022-01/price_rules/${priceRuleId10}/discount_codes.json`,
         { discount_code: { code } },
         {
            headers: {
               "Content-Type": "application/json",
               "X-Shopify-Access-Token": accessToken,
            },
         }
      );
      return handleDiscountResponse(response);
   } catch (error) {
      console.error(
         "Error creating discount code:",
         error.response ? error.response.data : error.message
      );
      throw error;
   }
}

function handleDiscountResponse(response) {
   const dCodeData = response.data.discount_code;
   console.log("Discount code created✅", dCodeData);

   const discountDetails = {
      id: dCodeData.id,
      price_rule_id: dCodeData.price_rule_id,
      code: dCodeData.code,
      usage_count: dCodeData.usage_count,
      created_at: dCodeData.created_at,
      updated_at: dCodeData.updated_at,
   };

   const title = "You Earned 10% Off Your Next Order!!";
   const description = `Congratulations! You've received an order discount. Code: ${discountDetails.code}. Head to https://secure1skate.com, enter the code at checkout, and then celebrate the W🏆🥇🍷`;
   const imageUrl =
      "https://cdn.shopify.com/s/files/1/0327/5263/1939/files/Untitled_video_-_Made_with_Clipchamp_8.gif?v=1708767984";
   const discountCode = discountDetails.code;

   const { embeds } = createEmbedWithImageWithDiscount(
      title,
      description,
      imageUrl,
      discountCode
   );

   const systemMessageContent = `Discount code Created. Details: ${discountDetails.id}, ${discountDetails.code}, ${discountDetails.price_rule_id}, ${discountDetails.message}, ${discountDetails.created_at}`;

   const result = { embeds, systemMessageContent };
   return result;
}

async function SendDiscountCodeMsgsToUser(
   message,
   result,
   client,
   numericUserId,
   siteKey = ""
) {
   try {
      await message.channel.send(result.systemMessageContent);
      const user = await client.users.fetch(numericUserId);
      await user.send({ embeds: result.embeds });
      if (siteKey) {
         await user.send(
            "Welcome to VIP! Slide over to check out your season favorites! 👉 SITE: https://secure1sk8.com | PASSWORD: Keepkickin88 👈"
         );
      }
   } catch (error) {
      console.error("Failed to send discount code embed:", error);
   }
}

async function getPriceRuleList(shopDomain, accessToken) {
   axios
      .get(`https://${shopDomain}/admin/api/2021-04/price_rules.json`, {
         headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
         },
      })
      .then((response) => {
         console.log(response.data.price_rules);
      })
      .catch((error) => console.error(error));
}

module.exports = {
   handleCreateDiscountCode10,
   ExtractUserAndCode,
   SendDiscountCodeMsgsToUser,
   processDiscountCommand,
};
