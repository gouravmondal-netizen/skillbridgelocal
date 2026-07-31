import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { translateStrings } from "./translate.server";

const schema = z.object({
  texts: z.array(z.string().min(1).max(2000)).min(1).max(120),
  target: z.string().min(2).max(5),
});

export const translateBatch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const items = await translateStrings(data.texts, data.target);
    return { items };
  });
