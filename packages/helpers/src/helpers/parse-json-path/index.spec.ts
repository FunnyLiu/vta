import parseJsonPath, { getMatches } from "./index";

it("getMatches", () => {
  expect(JSON.stringify(getMatches("uid"))).toBe('[".","uid",""]');
  expect(JSON.stringify(getMatches("config.lang"))).toBe('[".","config",".lang"]');
  expect(JSON.stringify(getMatches(".config.lang.locale"))).toBe('[".","config",".lang.locale"]');
  expect(JSON.stringify(getMatches("[0]"))).toBe('["[","0",""]');
  expect(JSON.stringify(getMatches("[0][2][4]"))).toBe('["[","0","[2][4]"]');
  expect(JSON.stringify(getMatches("presets[0]"))).toBe('[".","presets","[0]"]');
  expect(JSON.stringify(getMatches("[lang=zh-CN]"))).toBe('["[","lang=zh-CN",""]');
  expect(JSON.stringify(getMatches("[lang=zh-CN][5]"))).toBe('["[","lang=zh-CN","[5]"]');
  expect(JSON.stringify(getMatches("[[0]=zh-CN].name"))).toBe('["[","[0]=zh-CN",".name"]');
  expect(JSON.stringify(getMatches("[[[0].pro=view].lang=zh-CN][3]"))).toBe(
    '["[","[[0].pro=view].lang=zh-CN","[3]"]',
  );
  expect(JSON.stringify(getMatches("[[lang=zh-CN][0]=0,[fram=react][0]=1].name"))).toBe(
    '["[","[lang=zh-CN][0]=0,[fram=react][0]=1",".name"]',
  );
  expect(JSON.stringify(getMatches("+uid.name"))).toBe('[".","+uid",".name"]');
  expect(JSON.stringify(getMatches("."))).toBe("null");

  expect(JSON.stringify(getMatches('[[[0]!="import"][1].name>="ui"][1].dir'))).toBe(
    '["[","[[0]!=\\"import\\"][1].name>=\\"ui\\"","[1].dir"]',
  );
});

it("parse-json-path-key", () => {
  const path = parseJsonPath("uid");
  expect(path.type).toBe("key");
  expect(path.value).toBe("uid");
  expect(path.children).toBe(null);
});
it("parse-json-path", () => {
  const path1 = parseJsonPath("presets[age=32]");
  expect(path1.children.type).toBe("filter");
  expect(path1.children.value[0].target.type).toBe("key");
  expect(path1.children.value[0].target.value).toBe("age");
  expect(path1.children.value[0].operator).toBe("=");
  expect(path1.children.value[0].comparor).toBe(32);

  const path2 = parseJsonPath('plugins[[0]!="import",[1].age>=30.25][1].dir');
  expect(path2.children.type).toBe("filter");
  expect(path2.children.value[0].target.type).toBe("index");
  expect(path2.children.value[0].target.value).toBe(0);
  expect(path2.children.value[0].operator).toBe("!=");
  expect(path2.children.value[0].comparor).toBe("import");
  expect(path2.children.value[1].target.type).toBe("index");
  expect(path2.children.value[1].target.value).toBe(1);
  expect(path2.children.value[1].target.children.type).toBe("key");
  expect(path2.children.value[1].target.children.value).toBe("age");
  expect(path2.children.value[1].operator).toBe(">=");
  expect(path2.children.value[1].comparor).toBe(30.25);
  expect(path2.children.children.type).toBe("index");
  expect(path2.children.children.value).toBe(1);

  const path3 = parseJsonPath('plugins[[[88]!="import"][16].name>="ui"][18].dir');
  expect(path3.children.type).toBe("filter");
  expect(path3.children.value[0].target.type).toBe("filter");
  expect(path3.children.value[0].target.value[0].target.type).toBe("index");
  expect(path3.children.value[0].target.value[0].target.value).toBe(88);
  expect(path3.children.value[0].target.value[0].operator).toBe("!=");
  expect(path3.children.value[0].target.value[0].comparor).toBe("import");
  expect(path3.children.value[0].target.children.type).toBe("index");
  expect(path3.children.value[0].target.children.value).toBe(16);
  expect(path3.children.value[0].target.children.children.type).toBe("key");
  expect(path3.children.value[0].target.children.children.value).toBe("name");
  expect(path3.children.value[0].operator).toBe(">=");
  expect(path3.children.value[0].comparor).toBe("ui");
  expect(path3.children.children.type).toBe("index");
  expect(path3.children.children.value).toBe(18);

  const path4 = parseJsonPath("plugins[name]");
  expect(path4.children.type).toBe("filter");
  expect(path4.children.value[0]).toBe(null);

  const path5 = parseJsonPath(`plugins[name=${JSON.stringify('byh,"wy')},city="zz,py"]`);
  expect(path5.children.type).toBe("filter");
  expect(path5.children.value[0].comparor).toBe('byh,"wy');
  expect(path5.children.value[1].comparor).toBe("zz,py");
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
