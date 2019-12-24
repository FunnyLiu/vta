import packagesSortByDependencies from "../src/utils/packages-sort-by-dependencies";

describe("packages-sort", () => {
  it("common", () => {
    const packages = packagesSortByDependencies([
      { name: "pk1", dependencies: {} },
      {
        name: "pk2",
        dependencies: { pk1: "1.0.0", pk3: "1.0.0", pk6: "1.0.0" },
      },
      {
        name: "pk3",
        dependencies: { pk4: "1.0.0", pk5: "1.0.0", pk6: "1.0.0" },
      },
      { name: "pk4", dependencies: {} },
      { name: "pk5", dependencies: { pk4: "1.0.0" } },
      { name: "pk6" },
    ]);

    expect(JSON.stringify(packages.map(p => p.name))).toBe('["pk1","pk4","pk5","pk6","pk3","pk2"]');
  });

  it("circle-deps", () => {
    const packages = packagesSortByDependencies([
      { name: "pk1", dependencies: {} },
      {
        name: "pk2",
        dependencies: { pk1: "1.0.0", pk3: "1.0.0", pk6: "1.0.0" },
      },
      {
        name: "pk3",
        dependencies: { pk4: "1.0.0", pk5: "1.0.0", pk6: "1.0.0" },
      },
      { name: "pk4", dependencies: {} },
      { name: "pk5", dependencies: { pk4: "1.0.0", pk2: "1.0.0" } },
      { name: "pk6" },
    ]);

    expect(JSON.stringify(packages.map(p => p.name))).toBe('["pk1","pk4","pk5","pk6","pk3","pk2"]');
  });

  it("peer-dependencies", () => {
    const packages = packagesSortByDependencies([
      { name: "@vta/babel-preset", dependencies: {}, peerDependencies: { vta: "1.0.0" } },
      { name: "@vta/config", dependencies: { "@vta/helpers": "1.0.0" }, peerDependencies: {} },
      {
        name: "vta",
        dependencies: { "@vta/config": "1.0.0", "@vta/helpers": "1.0.0" },
        peerDependencies: {},
      },
      { name: "@vta/helpers", dependencies: {}, peerDependencies: {} },
      {
        name: "@vta/plugin-typescript",
        dependencies: { "@vta/config": "^1.0.0", "@vta/helpers": "^1.0.0" },
        peerDependencies: {
          vta: "1.0.0",
        },
      },
    ]);

    expect(JSON.stringify(packages.map(p => p.name))).toBe(
      '["@vta/helpers","@vta/config","vta","@vta/babel-preset","@vta/plugin-typescript"]',
    );
  });
});
