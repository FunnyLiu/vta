function getMin(values) {
  if (Array.isArray(values) && values.length > 0) {
    let min = values[0];
    values.forEach(value => {
      if (min > value) {
        min = value;
      }
    });
    return min;
  }
  return undefined;
}

module.exports = function packagesSortByDependencies(packages) {
  /* eslint-disable no-param-reassign */
  packages.forEach((p, index) => {
    p.order = index + 1;
    p.deps = Object.keys(p.dependencies || {});
  });
  packages.forEach(p => {
    const firstDeped = getMin(
      packages.filter(t => t.deps.filter(dep => dep === p.name).length > 0).map(t => t.order),
    );
    if (firstDeped !== undefined && p.order > firstDeped) {
      packages.forEach(t => {
        if (t.order < firstDeped) {
          t.order -= 1;
        }
      });
      p.order = firstDeped - 1;
    }
  });
  return packages.sort((p1, p2) => {
    if (p1.order < p2.order) {
      return -1;
    }
    if (p1.order === p2.order) {
      return 0;
    }
    return 1;
  });
};
