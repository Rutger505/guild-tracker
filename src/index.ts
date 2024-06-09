import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { addPlayer, playerInfo, removePlayer, wherePlayers } from "./commands";

const client = new Client({
  intents: [GatewayIntentBits.GuildMessages],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "addplayer") {
    await addPlayer(interaction);
  } else if (commandName === "removeplayer") {
    await removePlayer(interaction);
  } else if (commandName === "whereplayers") {
    await wherePlayers(interaction);
  } else if (commandName === "playerinfo") {
    await playerInfo(interaction);
  }
});

const commands = [
  {
    name: "addplayer",
    description: "Add a player by username",
    options: [
      {
        name: "username",
        type: 3, // STRING type
        description: "The username of the player to add",
        required: true,
      },
    ],
  },
  {
    name: "removeplayer",
    description: "Remove a player by username",
    options: [
      {
        name: "username",
        type: 3, // STRING type
        description: "The username of the player to remove",
        required: true,
      },
    ],
  },
  {
    name: "whereplayers",
    description: "Get the current status of all added players",
  },
  {
    name: "playerinfo",
    description: "Get information about a specific player",
    options: [
      {
        name: "username",
        type: 3, // STRING type
        description: "The username of the player to get information about",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.login(process.env.DISCORD_TOKEN);
