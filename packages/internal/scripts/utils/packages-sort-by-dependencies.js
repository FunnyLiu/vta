function insertIntoSorted(sorted, pkg) {
  if (sorted.filter(p => p.name === pkg.name).length > 0) return;
  let firstDepedIdx = -1;
  for (let i = 0, len = sorted.length; i < len; i += 1) {
    if (sorted[i].deps.filter(dep => dep === pkg.name).length > 0) {
      firstDepedIdx = i;
      break;
    }
  }
  if (firstDepedIdx >= 0) {
    sorted.splice(firstDepedIdx, 0, pkg);
  } else {
    sorted.push(pkg);
  }
  pkg.depPkgs.forEach(p => {
    insertIntoSorted(sorted, p);
  });
}

module.exports = function packagesSortByDependencies(packages) {
  /* eslint-disable no-param-reassign */
  packages.forEach(p => {
    p.deps = Object.keys(p.dependencies || {}).concat(Object.keys(p.peerDependencies || {}));
    p.depPkgs = [];
  });
  packages.forEach(p => {
    packages.forEach(pkg => {
      if (pkg.deps.filter(dep => dep === p.name).length > 0) {
        pkg.depPkgs.push(p);
      }
    });
  });
  const sorted = [];
  packages.forEach(p => {
    insertIntoSorted(sorted, p);
  });
  return sorted;
};
