import fs from "fs";
import path from "path";
import { fileSearch } from "search-in-file";
import { LineResult, SearchOptions } from "search-in-file/dist/types";

type DirItemGeneric<T> = {
  name: string;
  path: string;
  isFolder: boolean;
  childs: T;
};

interface a {
  name: string;
  path: string;
}

export interface DirItemType extends DirItemGeneric<DirItemType[]> {}

export const readDirRecursive = ({
  dir,
  excludeDir = [],
}: {
  dir: string;
  excludeDir?: string[];
}): DirItemType[] => {
  const result = fs
    .readdirSync(dir, {
      withFileTypes: true,
      recursive: true,
    })
    .reduce((prev, item) => {
      const isDirectory = item.isDirectory();
      const newPath = path.join(dir, item.name);

      let nameCondition = !excludeDir.includes(item.name);

      return [
        ...prev,
        ...(nameCondition
          ? [
              {
                name: item.name,
                path: newPath,
                isFolder: isDirectory,
                childs: isDirectory
                  ? readDirRecursive({
                      dir: newPath,
                      excludeDir,
                    })
                  : [],
              },
            ]
          : []),
      ];
    }, [] as DirItemType[]);

  return result;
};

export const readDirRecursiveFlat = ({
  dir,
  excludeDir = [],
}: {
  dir: string;
  excludeDir?: string[];
}): a[] => {
  const result = fs
    .readdirSync(dir, {
      withFileTypes: true,
      recursive: true,
    })
    .reduce((prev, item) => {
      const isDirectory = item.isDirectory();
      const newPath = path.join(dir, item.name);

      let nameCondition = !excludeDir.includes(item.name);

      return [
        ...prev,
        ...(nameCondition
          ? isDirectory
            ? [
                ...readDirRecursiveFlat({
                  dir: newPath,
                  excludeDir,
                }),
              ]
            : [
                {
                  name: item.name,
                  path: newPath,
                },
              ]
          : []),
      ];
    }, [] as a[]);

  return result;
};

export const searchInFiles = async (paths: string[], value: string) => {
  const result = await fileSearch(paths, value, {
    searchResults: "lineNo",
    recursive: false,
  } as SearchOptions);

  return result;
};
