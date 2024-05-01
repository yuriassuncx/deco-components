import type { App as A, AppContext as AC } from "deco/mod.ts";
import manifest, { Manifest } from "./manifest.gen.ts";

export type Props = Record<string, unknown>;
export type App = ReturnType<typeof MyApp>;
export type AppContext = AC<App>;

export default function MyApp(state: Props): A<
  Manifest,
  Props
> {
  return { state, manifest };
}
