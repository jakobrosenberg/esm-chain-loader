import { resolveLoaderPaths, getLoadersFromPaths } from "./utils.js";
const createLoaders = async () => {
  const argv = (!process.env.ESM_CHAIN_LOADER_NO_ARGV && process.argv) || [];
  const execArgv = (!process.env.ESM_CHAIN_LOADER_NO_EXECARGV && process.execArgv) || [];
  const args = [...argv, ...execArgv];
  const paths = resolveLoaderPaths(args);
  const allLoaders = await getLoadersFromPaths(paths);
  const loaders = allLoaders.filter(loader => loader.LOADER_ID !== 'esm-chain-loader')
  return loaders;
};

const loadersPromise = createLoaders();

export async function transformSource(source, context, defaultTransformSource) {
  try {
    const allLoaders = await loadersPromise;
    const transformers = allLoaders.filter((loader) => loader.transformSource || loader.load);

    for (const loader of transformers) {
      if (loader.transformSource)
        source = (await loader.transformSource(source, context, defaultTransformSource)).source;
    }
    return defaultTransformSource(source, context, defaultTransformSource);
  } catch (err) {
    console.error("failed to transform", context.url, err);
  }
}

export async function getFormat(url, context, defaultGetFormat) {
  const allLoaders = await loadersPromise;
  const loader = allLoaders.find((loader) => loader.getFormat);
  if (loader) return loader.getFormat(url, context, defaultGetFormat);
  else return defaultGetFormat(url, context, defaultGetFormat);
}

export async function getSource(url, context, defaultGetSource) {
  const allLoaders = await loadersPromise;
  const loader = allLoaders.find((loader) => loader.getSource);

  if (loader) return loader.getSource(url, context, defaultGetSource);
  else return defaultGetSource(url, context, defaultGetSource);
}

export const LOADER_ID = "esm-chain-loader";
