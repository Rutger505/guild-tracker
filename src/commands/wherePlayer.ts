import { CommandInteraction } from "discord.js";
import { players } from "../players";
import { getPlayerData } from "../utils";
import type { Command } from "./command.ts";

export class WherePlayer implements Command {
  public readonly data = {
    name: "where_players",
    description: "Get the current status of all added players",
  };

  public async execute(interaction: CommandInteraction) {
    const username = interaction.options.get("username")?.value as string;
    if (!username) {
      await interaction.reply("Please provide a username.");
      return;
    }

    const uuid = players.get(username);

    if (!uuid) {
      await interaction.reply(
        "Player not found in the list. Please add the player first.",
      );
      return;
    }

    try {
      const playerData = await getPlayerData(uuid);
      if (playerData?.success) {
        const status = playerData.session.online
          ? `online in ${playerData.session.gameType} on ${playerData.session.map}`
          : "offline";
        await interaction.reply(`${username} is currently ${status}`);
      } else {
        await interaction.reply(`Failed to get info for ${username}`);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(`Error retrieving info for ${username}`);
    }
  }
}
