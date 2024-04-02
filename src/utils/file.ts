import { getClassWithColor } from "file-icons-js";
import fs from "fs";
import path from "path";
import { fileSearch } from "search-in-file";
import { SearchOptions } from "search-in-file/dist/types";
import isCompressed from "is-compressed";
import * as pkg from "istextorbinary";
import { isExecutableSync } from "is-executable";
import { useFolderStore } from "@/stores/folder";

type DirItemGeneric<T> = {
  name: string;
  path: string;
  isFolder: boolean;
  childs: T;
};

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

      const isFileCompressed =
        isCompressed(item.name) || path.parse(item.name).ext === ".asar";

      return [
        ...prev,
        ...(nameCondition && !isFileCompressed
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
}): string[] => {
  const result = fs
    .readdirSync(dir, {
      withFileTypes: true,
      recursive: true,
    })
    .reduce((prev, item) => {
      const isDirectory = item.isDirectory();
      const newPath = path.join(dir, item.name);

      let nameCondition = !excludeDir.some((path) => item.name.includes(path));

      const isFileBinary = pkg.isBinary(item.name);

      const isFileExec = isExecutableSync(item.name);

      const isFileCompressed =
        isCompressed(item.name) || path.parse(item.name).ext === ".asar";

      const returnCondition =
        nameCondition && !isFileBinary && !isFileCompressed && !isFileExec;

      return [
        ...prev,
        ...(returnCondition
          ? isDirectory
            ? [
                ...readDirRecursiveFlat({
                  dir: newPath,
                  excludeDir,
                }),
              ]
            : [newPath]
          : []),
      ];
    }, [] as string[]);

  return result;
};

export const searchInFiles = async (paths: string[], value: string) => {
  const result = await fileSearch(paths, value, {
    searchResults: "lineNo",
    recursive: false,
  } as SearchOptions);

  return result;
};

export const streamToString = (stream: fs.ReadStream) => {
  const chunks: Buffer[] = [];
  return new Promise<string>((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};

export const getFileIconClass = (fileName: string) => {
  const defaultIcon = "foo.txt";

  return getClassWithColor(fileName) || getClassWithColor(defaultIcon);
};

export const getAbsolutePath = (
  pathString: string,
  replaceWithPosix?: boolean
) => {
  const { openFolder } = useFolderStore();

  let pathAbs = pathString.replace(openFolder || "", "");

  if (pathAbs[0] === path.sep) {
    pathAbs = pathAbs.substring(1);
  }

  if (replaceWithPosix) {
    pathAbs = pathAbs.replaceAll(path.sep, path.posix.sep);
  }
  
  return pathAbs;
};
