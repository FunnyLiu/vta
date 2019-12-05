import packagesSortByDependencies from "../scripts/utils/packages-sort-by-dependencies";

describe("packages-sort", () => {
  it("common", () => {
    const packages = packagesSortByDependencies([
      { name: "pk1", dependencies: {} }, // -3
      {
        name: "pk2",
        dependencies: { pk1: "1.0.0", pk3: "1.0.0", pk6: "1.0.0" },
      }, // 2
      {
        name: "pk3",
        dependencies: { pk4: "1.0.0", pk5: "1.0.0", pk6: "1.0.0" },
      }, // 1
      { name: "pk4", dependencies: {} }, // -2
      { name: "pk5", dependencies: { pk4: "1.0.0" } }, // -1
      { name: "pk6" }, // 0
    ]);

    expect(JSON.stringify(packages.map(p => p.name))).toBe('["pk1","pk4","pk5","pk6","pk3","pk2"]');
  });

  it("circle-deps", () => {
    const packages = packagesSortByDependencies([
      { name: "pk1", dependencies: {} }, // -3
      {
        name: "pk2",
        dependencies: { pk1: "1.0.0", pk3: "1.0.0", pk6: "1.0.0" },
      }, // 4
      {
        name: "pk3",
        dependencies: { pk4: "1.0.0", pk5: "1.0.0", pk6: "1.0.0" },
      }, // 3
      { name: "pk4", dependencies: {} }, // 0
      { name: "pk5", dependencies: { pk4: "1.0.0", pk2: "1.0.0" } }, // 1
      { name: "pk6" }, // 2
    ]);

    expect(JSON.stringify(packages.map(p => p.name))).toBe('["pk1","pk4","pk5","pk6","pk3","pk2"]');
  });
});
