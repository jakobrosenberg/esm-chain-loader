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
export const resolveLoadersFromPaths = async (paths) =>
  Promise.all(paths.map((path) => import(path)));

/**
 * @param {string[]} argv
 */
export const resolveLoadersFromArgv = (argv) => resolveLoadersFromPaths(resolveLoaderPaths(argv));
