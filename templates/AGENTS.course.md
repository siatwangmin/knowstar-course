# 知错星学员工程约束

本工程从统一镜像生成的空白 Ionic React + TypeScript + Vite 模板起步。学员自己与 Gemini 完成 `docs/design/PRD.md` 和 Canvas 导出的 HTML 原型；这是设计阶段的全部必交输入。PRD 给出产品规则，HTML 是 V1 页面视觉与交互依据，技术路线由本文件和课程 Skill 给出。先完成上一阶段验收，再进入下一阶段。

## 固定技术路线

- V1 本地网页：Ionic React、TypeScript、Vite、Tailwind 3 本地编译、IndexedDB；业务数据通过 Repository 接口读写，后续可接云实现。保持单页 Monster Deck、Weekend Trial、Add Monster Modal；不加五 Tab 外壳。实际 Canvas HTML 是视觉与交互基准，移植其样式和状态，不只照着文字描述重做。
- V2 云端：GitHub Pages 只托管静态网页；腾讯云 CloudBase 负责 PostgreSQL 演示题目、图片存储与权限。先读取 `https://docs.cloudbase.net/skill.md` 按官方 Skill/MCP 接入学员自己的环境；创建一个课程演示用户，以最小登录表单和真实会话访问云端。保持 V1 页面与规则。
- V3 安卓：Capacitor 6 打包同一 Web 工程；使用 V2 的课程演示用户登录并同步，不另建用户系统或重写页面。
- V4 AI：网页和 APK 只用 CloudBase SDK `callFunction()` 调 `vision-question`、`learning-ai`；云函数服务端通过硅基流动 API 调用默认模型 `Qwen/Qwen3.8-27B`（识题）和 `deepseek-ai/DeepSeek-V4-Flash`（错因、引导、变式、报告）。`SILICONFLOW_API_KEY` 仅在服务端；模型 ID 在各自函数环境中配置。模型不可用时报告错误，等待教师确认替代。图文识别形成可编辑草稿，人工确认后保存；模型错误可手工继续；AI 不直接修改掌握等级。

## 工作与验收

每次任务先读取本工程现状、`PRD.md`、Canvas HTML 和前阶段记录；不因缺少 spec 或交接文档而阻断开发。给学员一个可见的小成果，实际执行构建/测试并报告结果。V1 先确认 Tailwind/PostCSS 已从镜像本地编译，构建 CSS 中有页面实际使用的工具类，再按相同视口和数据状态对照原型与实现截图。不要只检查构建成功，也不要用 Tailwind CDN 补样式。学员不在宿主机装 npm、Java 或 Android SDK；统一容器提供工具链。不要把公开网页地址能打开误认为云同步完成。不要把 API Key、管理密钥、个人错题图片写进 Git、`VITE_*`、APK 或输出日志。真实设备、云端同步和公网发布未执行时明确写“未验证”。

V1 IndexedDB 本地版独立保留。V2–V4 只提供最小登录、会话恢复和退出，不做注册或账号切换；同一学员的网页和 APK 登录其自己的课程演示用户，共享示例数据。账号密码由学员手输，不写进代码、Git、`VITE_*` 或 APK。PG 与图片桶只允许已登录用户访问；V4 的两个 AI 函数只允许非匿名已登录用户调用，并限制用量。云端模式仅在线访问 PostgreSQL，不做本地双写或离线队列。只录虚构例题；原有私有表的 RLS 不得放宽。
