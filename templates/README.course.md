# 知错星学员工程

这是统一镜像生成的空白技术底座。业务功能由学员按自己的 `docs/design/PRD.md` 和 Gemini Canvas 导出的 HTML 逐阶段完成。Tailwind 3、PostCSS、Autoprefixer 已在镜像中，`tailwind.config.js`、`postcss.config.js` 与 `src/style.css` 的 `@tailwind` 指令已配置；将 Canvas HTML 的工具类移植进 React 后，Vite 会在本地生成样式，不需 CDN 或 `npm install`。课程主线见随学员包提供的 `course/README.md`，固定技术约束见本工程 `AGENTS.md`。

从包含 `compose.yaml` 的课程目录执行：

```powershell
docker compose up -d --wait app
docker compose exec app npm run build
docker compose run --rm app knowstar-android-build
```

浏览器打开 `http://localhost:5187/`。这三个命令依次用于启动、检查网页构建、编译安卓 APK；V1 不需要运行第三个命令来验收产品。学员电脑不需要单独安装 npm、JDK 或 Android SDK，也不执行 `npm install`。新增依赖由教师更新统一镜像后分发。

V2 静态网页使用 GitHub Pages；演示数据使用 CloudBase PostgreSQL。学员在自己的环境创建一个课程演示用户，网页手动登录并保存会话。V3 用 Capacitor 复用同一网页，APK 手动登录同一用户后同步。V4 仅允许非匿名已登录用户调用 CloudBase 云函数；云函数默认请求硅基流动的 `Qwen/Qwen3.8-27B` 识题和 `deepseek-ai/DeepSeek-V4-Flash` 做错因、引导、变式与报告；API Key 仅在服务端。演示用户密码不写入网页或 APK。
