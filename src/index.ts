import { Client, GatewayIntentBits } from "discord.js";
import { handleCommand, updateCommandList } from "./commands.ts";

(async () => {
  await updateCommandList();

  const client = new Client({
    intents: [GatewayIntentBits.GuildMessages],
  });

  client.once("ready", () => {
    console.log("Bot is ready!");
  });

  client.on("interactionCreate", async (interaction) => {
    handleCommand(interaction);
  });

  await client.login(process.env.DISCORD_TOKEN);
})();
