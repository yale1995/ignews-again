import { createClient } from "@prismicio/client";

export const prismic = createClient(process.env.PRISMIC_API_ENDPOINT!, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});
