import z from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const registerSchema = z.object({
  email: z.email("Invalid Email"),
  password: z.string().min(8, "The password should be at least 8 characters"),
  username: z
    .string()
    .min(3, "Gym name must have at least 3 characters")
    .max(63, "Gym name can't have more than 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "The username must start and end with a letter or number and may only contain lowercase letters, numbers, and hyphens."
    )
    .refine((val) => !val.includes("--"), {
      message: "The username cannot contain consecutive hyphens.",
    })
    .transform((val) => val.toLowerCase()),
});
