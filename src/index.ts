import fs from 'fs';
import path from 'path';

export interface ModuleMap<T> {
  [moduleName: string]: T;
}

export interface Config {
  directory: string;
  fileBaseNameRegex?: RegExp;
  strict?: boolean;
}

const moduleLoader = <T = any>(directoryOrConfig: string | Config): ModuleMap<T> => {
  let directory: string;
  let fileBaseNameRegex: RegExp = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
  let strict: boolean = true;

  if (typeof directoryOrConfig === 'string') {
    directory = directoryOrConfig;
  } else {
    directory = directoryOrConfig.directory;
    fileBaseNameRegex = directoryOrConfig.fileBaseNameRegex || fileBaseNameRegex;
    strict = typeof directoryOrConfig.strict !== 'undefined' ? directoryOrConfig.strict : strict;
  }

  return fs.readdirSync(directory).reduce((moduleMap: ModuleMap<T>, file) => {
    const fileExtension = path.extname(file);
    if (fileExtension && ['.js', '.ts', '.json'].includes(fileExtension)) {
      const fileBaseName = path.basename(file, fileExtension);

      if (fileBaseNameRegex.test(fileBaseName)) {
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
  }, {});
};

export default moduleLoader;
