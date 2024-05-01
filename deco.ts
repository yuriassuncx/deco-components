import { setupGithooks } from "https://deno.land/x/githooks@0.0.4/githooks.ts";

await setupGithooks();

export default {
  apps: [
    { name: "deco-components", dir: "." },
  ],
};
