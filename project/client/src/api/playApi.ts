import axios from "axios";
import { musicApi } from "./musicClient";

export async function addPlay(songId: string, msPlayed: number) {
  await musicApi.post("/plays", { songId, msPlayed });
}