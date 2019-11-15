import fse from "fs-extra";

/**
 * tests whether or not the given path exists by checking with the file system
 * @param file A path to a file or directory
 */
export default function fileExists(file: string): Promise<boolean> {
  return new Promise(resolve => {
    fse.exists(file, exists => {
      resolve(exists);
    });
  });
}
