export type Status = {
  name: string,
  restWt: number,
  description: string,
}

export const statusSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    restWt: { type: "integer" },
  },
  required: ["name", "restWt"],
} as const;

export type StatusJson = FromSchema<typeof statusSchema>;

// TODO
// createStatusJson
// createStatus

