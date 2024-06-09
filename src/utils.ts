import axios from "axios";

const HYPIXEL_API_KEY = process.env.HYPIXEL_API_KEY;

export async function getPlayerData(uuid: string) {
  try {
    const response = await axios.get("https://api.hypixel.net/v2/status", {
      params: { uuid },
      headers: { "API-Key": HYPIXEL_API_KEY },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching player data for UUID ${uuid}:`, error);
    throw new Error("Error fetching player data");
  }
}
