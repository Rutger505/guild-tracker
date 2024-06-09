import { Client, GatewayIntentBits } from "discord.js";
import { handleCommand, updateCommandList } from "./commands.ts";

(async () => {
  const client = new Client({
    intents: [GatewayIntentBits.GuildMessages],
  });

  client.once("ready", () => {
    console.log("Bot is ready!");
  });

  client.on("interactionCreate", async (interaction) => {
    await handleCommand(interaction);
  });

  await updateCommandList();

  await client.login(process.env.DISCORD_TOKEN);
})();
