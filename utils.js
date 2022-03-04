import { createRequire } from "module";
import { pathToFileURL } from "url";

/**
 * @param {string[]} argv
 */
export const resolveLoaderPaths = (argv = process.argv) => {
  const paths = [];
  argv.forEach((arg, index) => {
    if (arg === "--experimental-loader") paths.push(argv[index + 1]);
  });
  return paths;
};

/**
 * @param {string[]} paths
 */
export const getLoadersFromPaths = async (paths) => {
  const require = createRequire(process.cwd());
  return Promise.all(
    paths.map(async (path) => {
      try {
        if (path.startsWith("file:///")) {
          return import(path);
        } else {
          const resolvedPath = require.resolve(path, { paths: [process.cwd()] });
          const url = pathToFileURL(resolvedPath);
          return import(url.href);
        }
      } catch (err) {
        console.error("failed to load loader", path);
        throw err;
      }
    })
  );
};

export const getLoadersFromArgs = (args) => getLoadersFromPaths(resolveLoaderPaths(args));
