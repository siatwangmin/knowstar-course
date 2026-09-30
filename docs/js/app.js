/* ===== 知错星教学网站 - 核心逻辑 ===== */

const COURSE_DATA = [
  { id: 'README',            file: 'course/README.md',          title: '课程介绍',     short: '介绍',     num: '0' },
  { id: '01-环境',           file: 'course/01-环境.md',          title: '准备环境',     short: '环境',     num: '1' },
  { id: '02-工程模板',       file: 'course/02-工程模板.md',      title: '认识工程',     short: '工程',     num: '2' },
  { id: '03-需求与原型',     file: 'course/03-需求与原型.md',    title: '需求与原型',   short: '设计',     num: '3' },
  { id: '04-V1-本地网页',    file: 'course/04-V1-本地网页.md',   title: 'V1 本地网页',  short: 'V1 网页',  num: '4' },
  { id: '05-V2-云端',        file: 'course/05-V2-云端.md',       title: 'V2 云端',      short: 'V2 云端',  num: '5' },
  { id: '06-V3-安卓',        file: 'course/06-V3-安卓.md',       title: 'V3 安卓',      short: 'V3 安卓',  num: '6' },
  { id: '07-V4-AI',          file: 'course/07-V4-AI.md',         title: 'V4 AI',        short: 'V4 AI',    num: '7' },
  { id: '08-词典与求助',     file: 'course/08-词典与求助.md',    title: '词典与求助',   short: '词典',     num: '8' },
  { id: '09-网页上线案例',   file: 'course/09-网页上线案例.md',  title: '网页上线案例', short: '上线',     num: '9' },
  { id: '10-开通CloudBase',  file: 'course/10-开通CloudBase.md', title: '开通CloudBase',short: 'CloudBase',num: '10' },
];

const STORAGE_KEYS = {
  progress: 'knowstar-progress',
  theme: 'knowstar-theme',
};

/* ===== 初始化 ===== */
let currentChapter = COURSE_DATA[0];
let markedInstance = null;

document.addEventListener('DOMContentLoaded', init);

function init() {
  setupMarked();
  buildNav();
  setupSearch();
  setupTheme();
  setupSidebar();
  setupBackToTop();
  setupKeyboard();
  loadChapterFromHash();
  updateProgress();
}

/* ===== Marked 配置 ===== */
function setupMarked() {
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
}

/* ===== 构建侧边栏导航 ===== */
function buildNav() {
  const navList = document.getElementById('navList');
  navList.innerHTML = '';

  const completed = getCompletedChapters();

  COURSE_DATA.forEach((chapter) => {
    const item = document.createElement('button');
    item.className = 'nav-item';
    item.dataset.id = chapter.id;
    if (completed.includes(chapter.id)) {
      item.classList.add('completed');
    }

    item.innerHTML = `
      <span class="nav-num">${chapter.num}</span>
      <span class="nav-label">${chapter.title}</span>
      <span class="nav-check">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
      </span>
    `;

    item.addEventListener('click', () => {
      loadChapter(chapter);
      closeSidebarMobile();
    });

    navList.appendChild(item);
  });
}

/* ===== 加载章节 ===== */
async function loadChapter(chapter) {
  currentChapter = chapter;
  const content = document.getElementById('content');
  const topbarTitle = document.getElementById('topbarTitle');
  const breadcrumb = document.getElementById('breadcrumb');

  topbarTitle.textContent = chapter.title;
  breadcrumb.innerHTML = `<a onclick="loadChapter(COURSE_DATA[0])">首页</a><span class="sep">/</span><span>${chapter.title}</span>`;

  content.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

  try {
    const resp = await fetch(chapter.file);
    if (!resp.ok) throw new Error('文件未找到: ' + chapter.file);
    let md = await resp.text();

    md = rewriteImagePaths(md, chapter);
    md = rewriteInternalLinks(md);
    md = rewriteDownloadLinks(md);

    const html = marked.parse(md);
    content.innerHTML = html;

    highlightCodeBlocks();
    renderPageNav(chapter);
    markChapterComplete(chapter.id);
    updateNavActive(chapter.id);
    updateProgress();
    scrollToTop();
    updateHash(chapter.id);
  } catch (err) {
    content.innerHTML = `
      <div style="text-align:center;padding:40px;">
        <p style="font-size:48px;margin-bottom:16px;">📄</p>
        <h3>无法加载本章内容</h3>
        <p style="color:var(--text-muted);margin-top:8px;">${err.message}</p>
        <p style="color:var(--text-muted);margin-top:12px;font-size:13px;">
          如果你正在本地用 file:// 协议打开此页面，请改用本地 HTTP 服务器（如 VS Code Live Server）或部署到 GitHub Pages。
        </p>
      </div>
    `;
  }
}

/* ===== 重写图片路径 ===== */
function rewriteImagePaths(md, chapter) {
  return md.replace(/!\[([^\]]*)\]\((\.\.\/[^)]+)\)/g, (match, alt, path) => {
    const filename = path.split('/').pop();
    return `![${alt}](assets/${filename})`;
  });
}

/* ===== 重写内部链接 ===== */
function rewriteInternalLinks(md) {
  return md.replace(/\[([^\]]+)\]\((\.\.\/)?(\d[^)]*\.md|README\.md)\)/g, (match, text, prefix, filename) => {
    const target = COURSE_DATA.find(c => c.file.includes(filename));
    if (target) {
      return `<a onclick="loadChapter(COURSE_DATA[${COURSE_DATA.indexOf(target)}])">${text}</a>`;
    }
    return match;
  });
}

/* ===== 重写下载链接（../xxx.zip → downloads/xxx.zip） ===== */
function rewriteDownloadLinks(md) {
  return md.replace(/\]\(\.\.\/([^)]+\.zip)\)/g, '](downloads/$1)');
}

/* ===== 代码高亮 ===== */
function highlightCodeBlocks() {
  if (typeof hljs === 'undefined') return;
  document.querySelectorAll('.content pre code').forEach((block) => {
    try {
      hljs.highlightElement(block);
    } catch (e) {}
  });
}

/* ===== 上一页/下一页 ===== */
function renderPageNav(chapter) {
  const pageNav = document.getElementById('pageNav');
  const index = COURSE_DATA.findIndex(c => c.id === chapter.id);
  const prev = index > 0 ? COURSE_DATA[index - 1] : null;
  const next = index < COURSE_DATA.length - 1 ? COURSE_DATA[index + 1] : null;

  let html = '';
  if (prev) {
    html += `<a onclick="loadChapter(COURSE_DATA[${index - 1}])">
      <span class="nav-direction">← 上一章</span>
      <span class="nav-title">${prev.title}</span>
    </a>`;
  } else {
    html += '<span></span>';
  }
  if (next) {
    html += `<a class="next" onclick="loadChapter(COURSE_DATA[${index + 1}])">
      <span class="nav-direction">下一章 →</span>
      <span class="nav-title">${next.title}</span>
    </a>`;
  }
  pageNav.innerHTML = html;
}

/* ===== 导航高亮 ===== */
function updateNavActive(id) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.id === id);
  });
}

/* ===== 进度管理 ===== */
function getCompletedChapters() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.progress) || '[]');
  } catch (e) {
    return [];
  }
}

function markChapterComplete(id) {
  const completed = getCompletedChapters();
  if (!completed.includes(id) && id !== 'README') {
    completed.push(id);
    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(completed));
    buildNav();
  }
}

function updateProgress() {
  const completed = getCompletedChapters().filter(id => id !== 'README');
  const total = COURSE_DATA.length - 1;
  const percent = total > 0 ? (completed.length / total) * 100 : 0;
  document.getElementById('progressFill').style.width = percent + '%';
  document.getElementById('progressText').textContent = `学习进度 ${completed.length} / ${total}`;
}

/* ===== 搜索 ===== */
function setupSearch() {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.nav-item').forEach(item => {
      const id = item.dataset.id;
      const chapter = COURSE_DATA.find(c => c.id === id);
      const text = (chapter.title + ' ' + chapter.short).toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

/* ===== 主题切换 ===== */
function setupTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEYS.theme, next);
  });
}

/* ===== 侧边栏（移动端） ===== */
function setupSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuBtn = document.getElementById('menuBtn');
  const toggle = document.getElementById('sidebarToggle');

  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  overlay.addEventListener('click', closeSidebarMobile);

  if (toggle) {
    toggle.addEventListener('click', closeSidebarMobile);
  }
}

function closeSidebarMobile() {
  document.getElementById('sidebar').classList.remove('open');
}

/* ===== 回到顶部 ===== */
function setupBackToTop() {
  const btn = document.getElementById('backToTop');
  const main = document.querySelector('.main');

  main.addEventListener('scroll', () => {
    btn.classList.toggle('show', main.scrollTop > 300);
  });

  btn.addEventListener('click', () => {
    main.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function scrollToTop() {
  document.querySelector('.main').scrollTo({ top: 0, behavior: 'auto' });
}

/* ===== 键盘导航 ===== */
function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const index = COURSE_DATA.findIndex(c => c.id === currentChapter.id);

    if (e.key === 'ArrowLeft' && index > 0) {
      loadChapter(COURSE_DATA[index - 1]);
    } else if (e.key === 'ArrowRight' && index < COURSE_DATA.length - 1) {
      loadChapter(COURSE_DATA[index + 1]);
    }
  });
}

/* ===== Hash 路由 ===== */
function loadChapterFromHash() {
  const hash = window.location.hash.slice(1);
  const chapter = COURSE_DATA.find(c => c.id === hash);
  loadChapter(chapter || COURSE_DATA[0]);
}

function updateHash(id) {
  history.replaceState(null, '', '#' + id);
}

window.addEventListener('hashchange', loadChapterFromHash);

window.loadChapter = loadChapter;
window.COURSE_DATA = COURSE_DATA;
