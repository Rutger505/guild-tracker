import { CommandInteraction } from "discord.js";
import { players } from "../players";

export const command = {
  name: "remove player",
  description: "Remove a player by username",
  options: [
    {
      name: "username",
      type: 3, // STRING type
      description: "The username of the player to remove",
      required: true,
    },
  ],
};

export default async function removePlayer(interaction: CommandInteraction) {
  const username = interaction.options.get("username")?.value as string;
  if (username) {
    players.delete(username);
    await interaction.reply(`Removed player ${username}`);
  } else {
    await interaction.reply("Please provide a username.");
  }
}
