const path = require("path");
const CopiedFileStore = require("../../plugin-monorepo/src/utils/copied-files-store");

const savePath = path.resolve(
  process.cwd(),
  `./node_modules/.cache/@vta/plugin-monorepo/copied-files-349ef87c-2f51-4714-8ede-1126352b0969.json`,
);

new CopiedFileStore(process.cwd(), savePath).wipe();
