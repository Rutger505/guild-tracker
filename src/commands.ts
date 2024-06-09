import {
  type CacheType,
  type CommandInteraction,
  type Interaction,
  REST,
  Routes,
} from "discord.js";
import addPlayer from "./commands/addPlayer.ts";
import removePlayer from "./commands/removePlayer.ts";
import wherePlayers from "./commands/wherePlayers.ts";
import wherePlayer from "./commands/wherePlayer.ts";

export async function updateCommandList() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {});

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

const commandMap: Record<
  string,
  (interaction: CommandInteraction) => Promise<void>
> = {
  "add player": addPlayer,
  "remove player": removePlayer,
  "where players": wherePlayers,
  "where player": wherePlayer,
};

export function handleCommand(interaction: Interaction<CacheType>) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const command = commandMap[commandName];
  if (command) {
    command(interaction);
  }
}
