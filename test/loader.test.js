process.argv = [
  "/path/to/node",
  "/path/to/utils.js",
  "--experimental-loader",
  "./test/sample/loader1.js",
  "--experimental-loader",
  "./test/sample/loader2.js",
  "--experimental-loader",
  "./test/sample/loader3.js",
  "--experimental-loader",
  "./index.js",
];

test("can apply loaders", async () => {
  const { transformSource } = await import("../index.js");

  const source = "foobar";
  const result = await transformSource(source, { url: "/some/path/to/file.js" }, (source) => ({ source }));
  assert.deepEqual(result, {
    source: "foobar\r\n\r\n// loader1\r\n\r\n// loader2\r\n\r\n// loader3",
  });
});
