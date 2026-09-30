# 知错星教学案例

**学员从空目录开始，不领取教师业务工程。** 只看[学员入口](course/README.md)，依次完成环境、工程模板、Gemini 需求与原型、V1 本地网页、V2 云端、V3 安卓、V4 AI。每一章都有能复制给 Gemini/TraeWork 的话，以及亲眼可验收的结果。V2 的[网页上线案例](course/09-网页上线案例.md)专门演示：先用 `github.io` 展示静态网页，再用 CloudBase 管课程演示用户的数据。

## 目录分工

| 位置 | 谁使用 | 内容 |
| --- | --- | --- |
| [course/](course/README.md) | 学员 | 唯一主线，按 1→7 完成，遇问题看词典 |
| [环境 Skill](knowstar-env-skill.zip) | 学员在 TraeWork 导入 | 拉取统一镜像、创建空工程、验收工具链 |
| [课程 Skill](knowstar-course-skill.zip) | 学员在 TraeWork 导入 | 听懂“本地网页/云端/安卓/AI”，自动套用固定技术路线 |
| [starter/](starter/) | 教师维护 | 空白工程生成器与镜像构建材料；不含产品实现 |
| [teacher/](teacher/) | 教师备课 | 扩展提示词、旧版详细工作簿与技术讨论，不作为学员操作入口 |
| [releases/](releases/manifest.md) | 教师发布 | 镜像摘要、离线包与已验证的参考 APK |

学员拿到的是[学员资料包](knowstar-student-kit.zip)，不包含教师 PRD、技术规格、Canvas 原型、业务代码或可用 API Key。CloudBase 环境、课程演示用户和硅基流动 API Key 由学员自己准备；[第 1 章环境配置](course/01-环境.md)说明每项的填写位置。统一镜像固定使用阿里云 ACR `aipractice/knowstar-classroom:all-v4` 对应的[发布 digest](releases/manifest.md)。

## 固定路线

V1 是 Ionic React + TypeScript + Vite + Tailwind 3 本地编译 + IndexedDB；V2 的**静态网页**在 GitHub Pages，**课程演示用户的 PostgreSQL 题目和图片**在 CloudBase；V3 沿用 V2 的同一用户登录与同步，用 Capacitor 编 APK；V4 仅允许非匿名已登录用户调用 CloudBase 云函数，再由函数调用硅基流动 API。学员只选阶段，不选这些技术平台。

教师参考资料和实际工程只用于校对课程，不给学员复制。学员只需与 Gemini 完成自己的 `PRD.md` 和 Canvas HTML；无需另交 spec 或原型交接文档。[课程逐项验证记录](teacher/course-verification.md)列出本地构建、V1–V4 在线/离线测试及未验证项；镜像和 APK 摘要见[发布清单](releases/manifest.md)。按本轮要求，`github.io` 公网发布暂缓测试；学员的 TraeWork 导入、个人账号与真机仍需各自验收。
