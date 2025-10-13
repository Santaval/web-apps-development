import { z } from "zod";

// Zod schema for validating student data
export const studentSchema = z
  .object({
    carnet: z
      .number({
        message: "Carnet must be a number",
      })
      .min(1, "Carnet must be a positive number"),
    name: z
      .string({
        message: "Name must be a string",
      })
      .min(1, "Name is required"),
  })
  .strict(); // strict mode to disallow unknown fields
