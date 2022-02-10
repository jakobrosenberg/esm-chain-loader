import { resolveLoaderPaths, resolveLoadersFromArgv, resolveLoadersFromPaths } from "./utils.js";
let insideLoaderImport = false;

export async function transformSource(source, context, defaultTransformSource) {
  const paths = [];
  if (!process.env.ESM_CHAIN_LOADER_NO_ARGV) paths.push(...resolveLoaderPaths(process.argv));
  if (!process.env.ESM_CHAIN_LOADER_NO_EXECARGV) paths.push(...resolveLoaderPaths(process.execArgv));

  // don't apply transforms to imports by loaders
  if (insideLoaderImport) return defaultTransformSource(source, context, defaultTransformSource);

  try {
    paths.pop(); // we don't want an infinite loop

    const resolveLoadersPromise = resolveLoadersFromPaths(paths);

    insideLoaderImport = true;
    const allLoaders = await resolveLoadersPromise;
    insideLoaderImport = false;

    const loaders = allLoaders.filter((loader) => loader.transformSource || loader.load);

    for (const loader of loaders) {
      if (loader.transformSource)
        source = (await loader.transformSource(source, context, defaultTransformSource)).source;
    }

    return defaultTransformSource(source, context, defaultTransformSource);
  } catch (err) {
    console.log("got error", err);
  }
}

export const LOADER_ID = "esm-chain-loader";
