import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

export interface Config {
  directory: string;
  exportName?: string | null;
  include?: RegExp | null;
  exclude?: RegExp | null;
  /** Either throw an error on invalid name and missing export or not */
  strict?: boolean | null;
}

function parseConfig(directoryOrConfig: string | Config): Config & { exportName: NonNullable<Config['exportName']> } {
  let directory: Config['directory'];
  let exportName: Config['exportName'] = 'default';
  let include: Config['include'] = null;
  let exclude: Config['exclude'] = null;
  let strict: Config['strict'] = true;

  if (typeof directoryOrConfig === 'string') {
    directory = directoryOrConfig;
  } else {
    directory = directoryOrConfig.directory;
    exportName = directoryOrConfig.exportName != null ? directoryOrConfig.exportName : exportName;
    include = directoryOrConfig.include != null ? directoryOrConfig.include : include;
    exclude = directoryOrConfig.exclude != null ? directoryOrConfig.exclude : exclude;
    strict = directoryOrConfig.strict != null ? directoryOrConfig.strict : strict;
  }

  return {
    directory,
    exportName,
    include,
    exclude,
    strict,
  };
}

export function loadModuleMapSync<T = any>(
  directoryOrConfig: string | Config,
  moduleMap = new Map<string, T>(),
): Map<string, T> {
  const { directory, exportName, include, exclude, strict } = parseConfig(directoryOrConfig);

  let isDirectory: boolean;
  try {
    isDirectory = fs.statSync(directory).isDirectory();
  } catch (err) {
    isDirectory = false;
  }

  if (isDirectory) {
    const files = fs.readdirSync(directory);
    if (files.length > 0) {
      files.map(file => {
        const fileExtension = path.extname(file);
        if (fileExtension && ['.js', '.jsx', '.ts', '.tsx', '.json'].includes(fileExtension)) {
          const fileBaseName = path.basename(file, fileExtension);

          if ((!include || include.test(fileBaseName)) && !(exclude && exclude.test(fileBaseName))) {
            const module = require(path.join(directory, file));
            if (typeof module[exportName] !== 'undefined') {
              moduleMap.set(fileBaseName, module[exportName]);
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
      });
    }
  }

  return moduleMap;
}

const fsStat = promisify(fs.stat);
const fsReaddir = promisify(fs.readdir);

export async function loadModuleMap<T = any>(
  directoryOrConfig: string | Config,
  moduleMap = new Map<string, T>(),
): Promise<Map<string, T>> {
  const { directory, exportName, include, exclude, strict } = parseConfig(directoryOrConfig);

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
                moduleMap.set(fileBaseName, module[exportName]);
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

export default loadModuleMap;
