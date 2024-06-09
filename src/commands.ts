import axios from "axios";
import { CommandInteraction } from "discord.js";
import { getPlayerData } from "./utils";

const players: Map<string, string> = new Map(); // Key: username, Value: UUID

export async function addPlayer(interaction: CommandInteraction) {
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

export async function removePlayer(interaction: CommandInteraction) {
  const username = interaction.options.get("username")?.value as string;
  if (username) {
    players.delete(username);
    await interaction.reply(`Removed player ${username}`);
  } else {
    await interaction.reply("Please provide a username.");
  }
}

export async function wherePlayers(interaction: CommandInteraction) {
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

export async function playerInfo(interaction: CommandInteraction) {
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
