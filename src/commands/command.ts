import type { CommandInteraction } from "discord.js";

export interface Command {
  commandData: {
    name: string;
    description: string;
    options: {
      name: string;
      type: number;
      description: string;
      required: boolean;
    }[];
  };
  execute: (interaction: CommandInteraction) => Promise<void>;
}
