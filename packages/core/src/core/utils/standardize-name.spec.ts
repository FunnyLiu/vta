import standardizeName from "./standardize-name";

it("standardizeName", () => {
  expect(standardizeName("plugin", "./plugins")).toBe("./plugins");
  expect(standardizeName("plugin", "react")).toBe("vta-plugin-react");
  expect(standardizeName("plugin", "vta-plugin-react")).toBe("vta-plugin-react");
  expect(standardizeName("plugin", "@vta/react")).toBe("@vta/plugin-react");
  expect(standardizeName("plugin", "module:@vta/react")).toBe("@vta/react");
  expect(standardizeName("plugin", "@vta/plugin-react")).toBe("@vta/plugin-react");
  expect(standardizeName("plugin", "@other/react")).toBe("@other/vta-plugin-react");
  expect(standardizeName("plugin", "module:@other/react")).toBe("@other/react");
  expect(standardizeName("plugin", "@other/vta-plugin-react")).toBe("@other/vta-plugin-react");
  expect(standardizeName("preset", "./presets")).toBe("./presets");
  expect(standardizeName("preset", "react")).toBe("vta-preset-react");
  expect(standardizeName("preset", "vta-preset-react")).toBe("vta-preset-react");
  expect(standardizeName("preset", "@vta/react")).toBe("@vta/preset-react");
  expect(standardizeName("preset", "module:@vta/react")).toBe("@vta/react");
  expect(standardizeName("preset", "@vta/preset-react")).toBe("@vta/preset-react");
  expect(standardizeName("preset", "@other/react")).toBe("@other/vta-preset-react");
  expect(standardizeName("preset", "module:@other/react")).toBe("@other/react");
  expect(standardizeName("preset", "@other/vta-preset-react")).toBe("@other/vta-preset-react");
});
