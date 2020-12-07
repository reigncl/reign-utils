import fs from "fs";
import path from "path";

let once = <T>(fn: () => T, m?: T) => () => ((m = m ?? fn()), m);

const readPkg = () => {
  const paths = require.main?.paths;

  if (!paths) return undefined;

  for (const p of paths) {
    const pathPkg = path.resolve(`${p}/../package.json`);
    if (fs.existsSync(pathPkg)) {
      try {
        return JSON.parse(fs.readFileSync(pathPkg, "utf8"));
      } catch {}
    }
  }
};

const pkg = once(readPkg);
export const pkgName = process.env.npm_package_name ?? pkg().name;
export const pkgVersion = process.env.npm_package_version ?? pkg().version;
