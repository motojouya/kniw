import type { Randoms } from "../model/random";
import type { ToModel, ToJson } from "../store_utility/schema";

import { z } from "zod";

export const randomsSchema = z.object({
  times: z.number().int(),
  damage: z.number().int(),
  accuracy: z.number().int(),
});
export type RandomsSchema = typeof randomsSchema;
export type RandomsJson = z.infer<RandomsSchema>;

export const toRandomsJson: ToJson<Randoms, RandomsJson> = (randoms) => ({ ...randoms });
export const toRandoms: ToModel<Randoms, RandomsJson, never> = (randomsJson) => ({ ...randomsJson });
