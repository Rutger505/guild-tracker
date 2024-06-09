import { type CacheType, type Interaction, REST, Routes } from "discord.js";
import type { Command } from "./commands/command.ts";
import { RemovePlayer } from "./commands/removePlayer.ts";
import { WherePlayer } from "./commands/wherePlayer.ts";
import { WherePlayers } from "./commands/wherePlayers.ts";
import { AddPlayer } from "./commands/addPlayer.ts";

const commands: Command[] = [
  new AddPlayer(),
  new RemovePlayer(),
  new WherePlayer(),
  new WherePlayers(),
];

export async function updateCommandList() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

  const commandsDetails = commands.map((command) => command.data);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      headers: {
        "Content-Type": "application/json",
      },
      body: commandsDetails,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

export async function handleCommand(interaction: Interaction<CacheType>) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const command = commands.find((command) => command.data.name === commandName);

  if (!command) {
    return;
  }

  await command.execute(interaction);
}
