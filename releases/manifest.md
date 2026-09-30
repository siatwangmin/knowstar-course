# 知错星统一教学镜像 all-v4

| 项目 | 验证值 |
| --- | --- |
| 本地镜像标签 | `knowstar-classroom:all-v4` |
| ACR 标签 | `crpi-iqktgpu6dyytuxiu.cn-hangzhou.personal.cr.aliyuncs.com/aipractice/knowstar-classroom:all-v4` |
| 固定拉取引用 | `crpi-iqktgpu6dyytuxiu.cn-hangzhou.personal.cr.aliyuncs.com/aipractice/knowstar-classroom@sha256:874c72192fff872157598d86869c56dae38edc406b5705d232271fd998ad3409` |
| 镜像 ID | `sha256:80e90904b301d7b1cd19b17da35ec6952ac5280cfae241b1852acaf467a99fd1` |
| 架构 | `linux/amd64` |
| 离线镜像包 | `knowstar-classroom-all-v4.tar`，3,787,446,272 字节 |
| 镜像包 SHA-256 | `fc14b18ed636221c27255a17998fdc2db302cf2124735db9385192130e5289e9` |
| starter package-lock SHA-256 | `f9c8a424b4442aff9811b1c89539e0ded0f78e6152c10643d55e2617ce237e49` |
| Node/npm | `22.12.0` / `10.9.0` |
| V1 样式工具 | Tailwind CSS `3.4.14`、PostCSS `8.5.28`、Autoprefixer `10.6.1` |
| JDK/Android | JDK 17、Platform 34、Build Tools 34.0.0、Gradle 8.2.1、Capacitor 6 |

all-v4 在 all-v3 统一镜像基础上加入 Tailwind 本地编译链路，仍为 V1–V4 使用的**同一个学员镜像**。镜像模板含 `tailwind.config.js`、`postcss.config.js` 和 `src/style.css` 的三条 `@tailwind` 指令。学员无需执行 `npm install`，也不依赖 Tailwind CDN。旧 `node_modules` 卷升级时，入口脚本按模板锁文件摘要重新复制镜像中的包。

验证：ACR 推送返回上述 digest；无登录配置的 Docker 客户端按 digest 读取 manifest、拉取镜像，并核对镜像 ID。全新空目录、全新依赖卷与 `--network none` 的容器中，`npm ls --depth=0 tailwindcss postcss autoprefixer` 和 `npm run build` 成功；加入 `flex gap-6 bg-yellow-400 rounded-xl` 后，再次构建的 CSS 含实际工具类规则；`knowstar-android-build` 从空目录生成 Android 工程并成功离线编译 APK（4,032,291 字节，SHA-256 `6aeb7e67987a9fe6a9d82edb4635c414933f76e9cae449ad07c810338257e92a`）。旧 all-v3 依赖卷在断网启动新镜像后，也确认获得 Tailwind 包。完整 Gradle 根任务及当前教师参考工程 APK 的断网验收记录保存在教师的 `manifest-v3.md`；V2/V4 在线业务验收沿用参考工程验证，学员仍需在自己账号和真机上验收。

学员优先按固定 digest 拉取；无法访问 ACR 时用 tar 导入，并将课程目录 `.env` 设为 `KNOWSTAR_IMAGE=knowstar-classroom:all-v4`。离线依赖保证覆盖课程锁文件与固定 Android 依赖；新增插件或变更版本需要教师重建镜像。
