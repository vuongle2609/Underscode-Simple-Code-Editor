import chokidar from "chokidar";

const initChokidar = (path: string) => {
  return chokidar
    .watch(path, {
      ignorePermissionErrors: true,
      persistent: true,
      ignoreInitial: true,
    })
    .on("all", () => {
      self.postMessage("reload");
    });
};

let watcher = initChokidar(".");

self.onmessage = async (e) => {
  await watcher.close();
  watcher = initChokidar(e.data.path);
};
