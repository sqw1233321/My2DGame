import fs from "fs-extra";
import path from "path";

//symlink同步
export const symlinkCommon = async () => {
  const paths = ["Common", "Enum"]
  paths.forEach(async p => {
    symlink(p);
  })

};

const symlink = async (p: string) => {
  const src = path.resolve(__dirname, `../${p}`);
  const dst = path.resolve(__dirname, `../../../client/assets/Scripts/${p}`);

  if (
    (await fs
      .lstat(dst)
      .then((v) => v.isSymbolicLink())
      .catch(() => false)) &&
    (await fs.readlink(dst)) === src
  ) {
    console.log("同步成功！");
  } else {
    fs.symlink(src, dst)
      .then(() => {
        console.log("同步成功！");
      })
      .catch((e) => {
        console.log("同步失败！", e);
      });
  }
}

symlinkCommon();
