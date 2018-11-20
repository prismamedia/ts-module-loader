import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

export type ModuleMap<T, K extends string = string> = Record<K, T>;

export interface Config {
  directory: string;
  exportName?: string;
  include?: RegExp;
  exclude?: RegExp;
  /** Either throw an error on invalid name and missing export or not */
  strict?: boolean;
}

const fsStat = promisify(fs.stat);
const fsReaddir = promisify(fs.readdir);

async function moduleLoader<T = any, K extends string = any, TModuleMap = ModuleMap<T, K>>(
  directoryOrConfig: string | Config,
): Promise<TModuleMap> {
  let directory: Config['directory'];
  let exportName: string = 'default';
  let include: NonNullable<Config['include']> | null = null;
  let exclude: NonNullable<Config['exclude']> | null = null;
  let strict: NonNullable<Config['strict']> = true;

  if (typeof directoryOrConfig === 'string') {
    directory = directoryOrConfig;
  } else {
    directory = directoryOrConfig.directory;
    exportName = typeof directoryOrConfig.exportName !== 'undefined' ? directoryOrConfig.exportName : exportName;
    include = typeof directoryOrConfig.include !== 'undefined' ? directoryOrConfig.include : include;
    exclude = typeof directoryOrConfig.exclude !== 'undefined' ? directoryOrConfig.exclude : exclude;
    strict = typeof directoryOrConfig.strict !== 'undefined' ? directoryOrConfig.strict : strict;
  }

  const moduleMap: TModuleMap = Object.create(null);

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
              const module = await import(path.join(directory, file));
              if (typeof module[exportName] !== 'undefined') {
                Object.assign(moduleMap, { [fileBaseName]: module[exportName] });
              } else {
                if (strict) {
                  throw new Error(
                    `The module "${file}" does not have a ${
                      exportName === 'default' ? 'default export' : `export named "${exportName}"`
                    }.`,
                  );
                }
              }
            } else {
              if (strict) {
                throw new Error(`The module "${file}" does not have a valid name.`);
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
