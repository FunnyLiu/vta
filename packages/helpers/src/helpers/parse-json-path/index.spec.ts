import parseJsonPath from "./index";

it("parse-json-path-key", () => {
  const path = parseJsonPath("uid");
  expect(path.type).toBe("key");
  expect(path.value).toBe("uid");
  expect(path.children).toBe(null);
});

it("parse-json-path-key-multi", () => {
  const path = parseJsonPath("names.images.js");
  expect(path.children.type).toBe("key");
  expect(path.children.value).toBe("images");
  expect(path.children.children.type).toBe("key");
  expect(path.children.children.value).toBe("js");
});

it("parse-json-path-index", () => {
  const path = parseJsonPath("[3]");
  expect(path.type).toBe("index");
  expect(path.value).toBe(3);
  expect(path.children).toBe(null);
});

it("parse-json-path-index-multi", () => {
  const path = parseJsonPath("[3][4][5]");
  expect(path.children.type).toBe("index");
  expect(path.children.value).toBe(4);
  expect(path.children.children.type).toBe("index");
  expect(path.children.children.value).toBe(5);
});

it("parse-json-path-key-mix", () => {
  const path = parseJsonPath("names.images[3][2].type");
  expect(path.children.type).toBe("key");
  expect(path.children.value).toBe("images");
  expect(path.children.children.type).toBe("index");
  expect(path.children.children.value).toBe(3);
  expect(path.children.children.children.type).toBe("index");
  expect(path.children.children.children.value).toBe(2);
  expect(path.children.children.children.children.type).toBe("key");
  expect(path.children.children.children.children.value).toBe("type");
});
