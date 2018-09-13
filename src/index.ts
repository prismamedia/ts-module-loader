import * as fs from 'fs';
import * as path from 'path';

export type ModuleMap<T, K extends string | number | symbol = string> = Record<K, T>;

export interface Config {
  directory: string;
  include?: RegExp;
  exclude?: RegExp;
  strict?: boolean;
}

const moduleLoader = <T = any, K extends string | number | symbol = string, TModuleMap = ModuleMap<T, K>>(
  directoryOrConfig: string | Config,
): TModuleMap => {
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

  return fs.readdirSync(directory).reduce(
    (moduleMap: TModuleMap, file): TModuleMap => {
      const fileExtension = path.extname(file);
      if (fileExtension && ['.js', '.ts', '.json'].includes(fileExtension)) {
        const fileBaseName = path.basename(file, fileExtension);

        if ((!include || include.test(fileBaseName)) && !(exclude && exclude.test(fileBaseName))) {
          Object.assign(moduleMap, {
            [fileBaseName]: require(path.join(directory, file)).default,
          });
        } else {
          if (strict) {
            throw new Error(`The module "${file}" has not a valid name.`);
          }
        }
      }

      return moduleMap;
    },
    {} as TModuleMap,
  );
};

export default moduleLoader;
