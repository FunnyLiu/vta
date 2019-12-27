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
  publish?: boolean;
  version?: string;
  changelog?: boolean;
  release?: "github" | "gitlab";
  registry?: string;
}

export declare interface Pkg {
  cwd: string;
  pkg: string;
  name: string;
}

export declare type Builder<T = { [key: string]: any }> = (pkg: Pkg, options?: T) => Promise<Error>;

export declare interface BuilderOptions<T = { [key: string]: any }> {
  include?: RegExp | string;
  exclude?: RegExp | string;
  options?: T;
}

export declare interface FeatureOptions {
  registBuilder<T = { [key: string]: any }>(builder: Builder<T>, options?: BuilderOptions<T>): void;
}
