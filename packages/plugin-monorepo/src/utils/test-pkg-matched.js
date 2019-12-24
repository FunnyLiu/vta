function testPkgMatchPattern(pattern, pkg) {
  if (typeof pattern === "string") {
    return new RegExp(pattern).test(pkg);
  }
  if (Object.prototype.toString.call(pattern) === "[object RegExp]") {
    return pattern.test(pkg);
  }
  return false;
}

module.exports = function testPkgMatched(include, exclude, pkg) {
  const included = include ? testPkgMatchPattern(include, pkg) : true;
  return included && !testPkgMatchPattern(exclude, pkg);
};
