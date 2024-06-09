import axios from "axios";
import { type CommandInteraction } from "discord.js";
import { players } from "../players";
import type { Command } from "./command.ts";

export class AddPlayer implements Command {
  public readonly data = {
    name: "add_player",
    description: "Add a player by username",
    options: [
      {
        name: "username",
        type: 3, // STRING type
        description: "The username of the player to add",
        required: true,
      },
    ],
  };

  public async execute(interaction: CommandInteraction) {
    const username = interaction.options.get("username")?.value as string;
    if (!username) {
      await interaction.reply("Please provide a username.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.mojang.com/users/profiles/minecraft/${username}`,
      );
      if (response.data?.id) {
        const uuid = response.data.id;
        players.set(username, uuid);
        await interaction.reply(`Added player ${username} with UUID ${uuid}`);
      } else {
        await interaction.reply(`Could not find UUID for player ${username}`);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(`Error fetching UUID for player ${username}`);
    }
  }
}
