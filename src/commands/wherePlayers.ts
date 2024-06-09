import { CommandInteraction } from "discord.js";
import { players } from "../players";
import { getPlayerData } from "../utils";
import type { Command } from "./command.ts";

export class WherePlayers implements Command {
  public readonly data = {
    name: "where_player",
    description: "Get information about a specific player",
    options: [
      {
        name: "username",
        type: 3, // STRING type
        description: "The username of the player to get information about",
        required: true,
      },
    ],
  };

  public async execute(interaction: CommandInteraction) {
    const playerStatuses = await Promise.all(
      Array.from(players.entries()).map(async ([username, uuid]) => {
        try {
          const playerData = await getPlayerData(uuid);
          if (playerData?.success) {
            const status = playerData.session.online
              ? `online in ${playerData.session.gameType} on ${playerData.session.map}`
              : "offline";
            return `${username} is currently ${status}`;
          } else {
            return `Failed to get status for ${username}`;
          }
        } catch (error) {
          console.error(error);
          return `Error retrieving status for ${username}`;
        }
      }),
    );

    console.log(playerStatuses);
    await interaction.reply(playerStatuses.join("\n"));
  }
}
