/* eslint-disable @typescript-eslint/no-explicit-any */

export declare type FileToCopy =
  | string
  | {
      src: string;
      dest?: string | ((pkg: string) => string);
      include?: RegExp;
      exclude?: RegExp;
    };

export declare interface Options {
  packages?: string;
  filesToCopy?: FileToCopy[];
  noPublish?: boolean;
  changelog?: boolean;
  release?: "github" | "gitlab";
  registry?: string;
}

export declare interface Pkg {
  cwd: string;
  pkg: string;
  name: string;
}

export declare type Builder = (pkg: Pkg, options?: { [key: string]: any }) => Promise<Error>;

export declare interface BuilderOptions {
  include?: RegExp | string;
  exclude?: RegExp | string;
  options?: { [key: string]: any };
}

export declare interface FeatureOptions {
  registBuilder(builder: Builder, options?: BuilderOptions): void;
}
