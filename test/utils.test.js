import { resolveLoaderPaths, resolveLoadersFromPaths } from "../utils.js";

const argv = [
  "/path/to/node",
  "/path/to/utils.js",
  "--experimental-loader",
  "./test/sample/loader1.js",
  "--experimental-loader",
  "./test/sample/loader2.js",
  "--experimental-loader",
  "./test/sample/loader3.js",
];

test("can get loader paths", () => {
  const paths = resolveLoaderPaths(argv);
  assert.deepEqual(paths, ["./test/sample/loader1.js", "./test/sample/loader2.js", "./test/sample/loader3.js"]);
});

test("can resolve loaders", async () => {
  const paths = resolveLoaderPaths(argv);
  const loaders = await resolveLoadersFromPaths(paths);
  assert.equal(loaders.length, 3);
  assert(loaders[0].transformSource);
});
