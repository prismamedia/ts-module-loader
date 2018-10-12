import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

export type ModuleMap<T, K extends string | number | symbol = string> = Record<K, T>;

export interface Config {
  directory: string;
  include?: RegExp;
  exclude?: RegExp;
  /** Either throw an error on invalid name or not */
  strict?: boolean;
}

const fsStat = promisify(fs.stat);
const fsReaddir = promisify(fs.readdir);

async function moduleLoader<T = any, K extends string | number | symbol = string, TModuleMap = ModuleMap<T, K>>(
  directoryOrConfig: string | Config,
): Promise<TModuleMap> {
  let directory: Config['directory'];
  let include: NonNullable<Config['include']> | null = null;
  let exclude: NonNullable<Config['exclude']> | null = null;
  let strict: NonNullable<Config['strict']> = true;

  if (typeof directoryOrConfig === 'string') {
    directory = directoryOrConfig;
  } else {
    directory = directoryOrConfig.directory;
    include = typeof directoryOrConfig.include !== 'undefined' ? directoryOrConfig.include : include;
    exclude = typeof directoryOrConfig.exclude !== 'undefined' ? directoryOrConfig.exclude : exclude;
    strict = typeof directoryOrConfig.strict !== 'undefined' ? directoryOrConfig.strict : strict;
  }

  const moduleMap: TModuleMap = {} as TModuleMap;

  let isDirectory: boolean;
  try {
    isDirectory = (await fsStat(directory)).isDirectory();
  } catch (err) {
    isDirectory = false;
  }

  if (isDirectory) {
    const files = await fsReaddir(directory);
    if (files.length > 0) {
      await Promise.all(
        files.map(async file => {
          const fileExtension = path.extname(file);
          if (fileExtension && ['.js', '.jsx', '.ts', '.tsx', '.json'].includes(fileExtension)) {
            const fileBaseName = path.basename(file, fileExtension);

            if ((!include || include.test(fileBaseName)) && !(exclude && exclude.test(fileBaseName))) {
              Object.assign(moduleMap, {
                [fileBaseName]: (await import(path.join(directory, file))).default,
              });
            } else {
              if (strict) {
                throw new Error(`The module "${file}" has not a valid name.`);
              }
            }
          }
        }),
      );
    }
  }

  return moduleMap;
}

export default moduleLoader;
