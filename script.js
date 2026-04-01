const $ = (selector) => document.querySelector(selector);

const STORAGE_KEY = 'xiaohongshu-image-tool-state-v2';

const themePresets = {
  dark: {
    bg: '#0f1014',
    panel: 'rgba(255, 255, 255, 0.08)',
    panelBorder: 'rgba(255, 255, 255, 0.12)',
    text: '#f8f8fb',
    muted: 'rgba(248, 248, 251, 0.7)',
    accent: '#9eff00',
    accent2: '#62e7ff',
    titleColor: '#f8f8fb',
    subtitleColor: 'rgba(248, 248, 251, 0.78)',
    firstCharColor: '#62e7ff',
    tagBg: 'rgba(255, 255, 255, 0.08)',
    tagBorder: 'rgba(255, 255, 255, 0.1)',
    tagText: '#f6f7fb',
    placeholderColor: 'rgba(255, 255, 255, 0.45)',
    placeholderBorder: 'rgba(255, 255, 255, 0.12)',
    controlAccent: '#8ea0ff',
    bodyBg: '#090a0d',
  },
  light: {
    bg: '#f4f2ea',
    panel: 'rgba(255, 255, 255, 0.72)',
    panelBorder: 'rgba(20, 23, 32, 0.08)',
    text: '#15171c',
    muted: 'rgba(21, 23, 28, 0.7)',
    accent: '#ff5f1f',
    accent2: '#5d55ff',
    titleColor: '#15171c',
    subtitleColor: 'rgba(21, 23, 28, 0.75)',
    firstCharColor: '#5d55ff',
    tagBg: 'rgba(17, 22, 34, 0.05)',
    tagBorder: 'rgba(17, 22, 34, 0.08)',
    tagText: '#16181d',
    placeholderColor: 'rgba(21, 23, 28, 0.4)',
    placeholderBorder: 'rgba(21, 23, 28, 0.12)',
    controlAccent: '#5d55ff',
    bodyBg: '#efece3',
  },
  berry: {
    bg: '#1b1024',
    panel: 'rgba(255, 255, 255, 0.08)',
    panelBorder: 'rgba(255, 255, 255, 0.14)',
    text: '#fff7fd',
    muted: 'rgba(255, 247, 253, 0.72)',
    accent: '#ff8fd8',
    accent2: '#8a7dff',
    titleColor: '#fff7fd',
    subtitleColor: 'rgba(255, 247, 253, 0.78)',
    firstCharColor: '#ff8fd8',
    tagBg: 'rgba(255, 255, 255, 0.1)',
    tagBorder: 'rgba(255, 255, 255, 0.12)',
    tagText: '#fff7fd',
    placeholderColor: 'rgba(255, 247, 253, 0.46)',
    placeholderBorder: 'rgba(255, 247, 253, 0.16)',
    controlAccent: '#ff8fd8',
    bodyBg: '#120a19',
  },
  mint: {
    bg: '#0d1715',
    panel: 'rgba(255, 255, 255, 0.08)',
    panelBorder: 'rgba(167, 255, 220, 0.14)',
    text: '#f2fff9',
    muted: 'rgba(242, 255, 249, 0.74)',
    accent: '#a7ffdc',
    accent2: '#52d6ff',
    titleColor: '#f2fff9',
    subtitleColor: 'rgba(242, 255, 249, 0.8)',
    firstCharColor: '#52d6ff',
    tagBg: 'rgba(255, 255, 255, 0.08)',
    tagBorder: 'rgba(167, 255, 220, 0.14)',
    tagText: '#f2fff9',
    placeholderColor: 'rgba(242, 255, 249, 0.46)',
    placeholderBorder: 'rgba(167, 255, 220, 0.18)',
    controlAccent: '#52d6ff',
    bodyBg: '#081210',
  },
};

const defaultState = {
  title: '学技能',
  subtitle: '3个超猛 Deep Research 工具',
  description: '建议收藏。把复杂问题拆成搜索、推理、整合三步，效率会高很多。这个模板适合做技能分享、工具推荐、方法论总结。',
  tags: 'Deep Research, AI工具, 效率神器, 技能分享, 小红书封面',
  theme: 'dark',
  ratio: '3:4',
  noteTitle: '一图看懂',
  noteAccent: '直接套用',
  titleSize: '72',
  titleWeight: '800',
  firstCharMode: 'custom',
  bgColor: themePresets.dark.bg,
  accentColor: themePresets.dark.accent,
  accent2Color: themePresets.dark.accent2,
  titleColor: themePresets.dark.titleColor,
  subtitleColor: '#f8f8fb',
  firstCharColor: themePresets.dark.firstCharColor,
};

const refs = {
  captureRoot: $('#captureRoot'),
  appShell: $('.app-shell'),
  title: $('#title'),
  subtitle: $('#subtitle'),
  description: $('#description'),
  tags: $('#tags'),
  theme: $('#theme'),
  ratio: $('#ratio'),
  scale: $('#scale'),
  imageUpload: $('#imageUpload'),
  useReference: $('#useReference'),
  resetBtn: $('#resetBtn'),
  downloadBtn: $('#downloadBtn'),
  noteTitle: $('#noteTitle'),
  noteAccent: $('#noteAccent'),
  titleSize: $('#titleSize'),
  titleWeight: $('#titleWeight'),
  firstCharMode: $('#firstCharMode'),
  bgColor: $('#bgColor'),
  accentColor: $('#accentColor'),
  accent2Color: $('#accent2Color'),
  titleColor: $('#titleColor'),
  subtitleColor: $('#subtitleColor'),
  firstCharColor: $('#firstCharColor'),
  previewTitle: $('#previewTitle'),
  previewSubtitle: $('#previewSubtitle'),
  previewDescription: $('#previewDescription'),
  previewTags: $('#previewTags'),
  previewImage: $('#previewImage'),
  imagePlaceholder: $('#imagePlaceholder'),
  previewNoteTitle: $('#previewNoteTitle'),
  previewNoteAccent: $('#previewNoteAccent'),
};

let currentImageSrc = './assets/reference.png';

function escapeHTML(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  const state = collectState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function collectState() {
  return {
    title: refs.title.value,
    subtitle: refs.subtitle.value,
    description: refs.description.value,
    tags: refs.tags.value,
    theme: refs.theme.value,
    ratio: refs.ratio.value,
    noteTitle: refs.noteTitle.value,
    noteAccent: refs.noteAccent.value,
    titleSize: refs.titleSize.value,
    titleWeight: refs.titleWeight.value,
    firstCharMode: refs.firstCharMode.value,
    bgColor: refs.bgColor.value,
    accentColor: refs.accentColor.value,
    accent2Color: refs.accent2Color.value,
    titleColor: refs.titleColor.value,
    subtitleColor: refs.subtitleColor.value,
    firstCharColor: refs.firstCharColor.value,
  };
}

function hydrateState(state) {
  Object.entries(state).forEach(([key, value]) => {
    if (refs[key]) refs[key].value = value;
  });
}

function applyPreset(themeName) {
  const preset = themePresets[themeName] || themePresets.dark;
  refs.bgColor.value = toHexColor(preset.bg, defaultState.bgColor);
  refs.accentColor.value = toHexColor(preset.accent, defaultState.accentColor);
  refs.accent2Color.value = toHexColor(preset.accent2, defaultState.accent2Color);
  refs.titleColor.value = toHexColor(preset.titleColor, defaultState.titleColor);
  refs.subtitleColor.value = toHexColor(preset.subtitleColor, '#f8f8fb');
  refs.firstCharColor.value = toHexColor(preset.firstCharColor, defaultState.firstCharColor);
}

function toHexColor(value, fallback = '#ffffff') {
  if (!value) return fallback;
  if (value.startsWith('#')) return value;
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return fallback;
  return `#${match
    .slice(1, 4)
    .map((part) => Number(part).toString(16).padStart(2, '0'))
    .join('')}`;
}

function renderTitle(title) {
  const safeTitle = escapeHTML(title || defaultState.title);
  if (!safeTitle) return '';

  if (refs.firstCharMode.value === 'none') {
    return safeTitle;
  }

  const chars = [...(title || defaultState.title)];
  if (!chars.length) return '';

  const first = escapeHTML(chars[0]);
  const rest = escapeHTML(chars.slice(1).join(''));
  return `<span class="title-first-char">${first}</span>${rest}`;
}

function renderTags(raw) {
  const list = raw
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10);

  refs.previewTags.innerHTML = '';

  list.forEach((tag) => {
    const el = document.createElement('span');
    el.className = 'tag';
    el.textContent = `#${tag.replace(/^#/, '')}`;
    refs.previewTags.appendChild(el);
  });
}

function applyRatio(ratio) {
  refs.captureRoot.classList.remove('ratio-3-4', 'ratio-4-5', 'ratio-1-1');
  refs.captureRoot.classList.add(`ratio-${ratio.replace(':', '-')}`);
}

function applyTheme(themeName) {
  const preset = themePresets[themeName] || themePresets.dark;
  refs.captureRoot.className = `capture-root ratio-${refs.ratio.value.replace(':', '-')}`;

  refs.captureRoot.style.setProperty('--bg', refs.bgColor.value || preset.bg);
  refs.captureRoot.style.setProperty('--panel', preset.panel);
  refs.captureRoot.style.setProperty('--panel-border', preset.panelBorder);
  refs.captureRoot.style.setProperty('--text', preset.text);
  refs.captureRoot.style.setProperty('--muted', preset.muted);
  refs.captureRoot.style.setProperty('--accent', refs.accentColor.value || preset.accent);
  refs.captureRoot.style.setProperty('--accent-2', refs.accent2Color.value || preset.accent2);
  refs.captureRoot.style.setProperty('--title-color', refs.titleColor.value || preset.titleColor);
  refs.captureRoot.style.setProperty('--subtitle-color', refs.subtitleColor.value || preset.subtitleColor);
  refs.captureRoot.style.setProperty('--first-char-color', refs.firstCharColor.value || preset.firstCharColor);
  refs.captureRoot.style.setProperty('--tag-bg', preset.tagBg);
  refs.captureRoot.style.setProperty('--tag-border', preset.tagBorder);
  refs.captureRoot.style.setProperty('--tag-text', preset.tagText);
  refs.captureRoot.style.setProperty('--placeholder-color', preset.placeholderColor);
  refs.captureRoot.style.setProperty('--placeholder-border', preset.placeholderBorder);
  refs.appShell.style.setProperty('--control-accent', preset.controlAccent);
  document.body.style.background = preset.bodyBg;
}

function setPreviewImage(src) {
  currentImageSrc = src || '';

  if (!src) {
    refs.previewImage.removeAttribute('src');
    refs.previewImage.parentElement.classList.remove('has-image');
    return;
  }

  refs.previewImage.src = src;
  refs.previewImage.parentElement.classList.add('has-image');
}

function sync() {
  const title = refs.title.value.trim() || defaultState.title;

  refs.previewTitle.innerHTML = renderTitle(title);
  refs.previewSubtitle.textContent = refs.subtitle.value.trim() || '';
  refs.previewDescription.textContent = refs.description.value.trim() || '';
  refs.previewNoteTitle.textContent = refs.noteTitle.value.trim() || '一图看懂';
  refs.previewNoteAccent.textContent = refs.noteAccent.value.trim() || '直接套用';
  refs.previewTitle.style.fontSize = `${Number(refs.titleSize.value || 72)}px`;
  refs.previewTitle.style.fontWeight = refs.titleWeight.value || '800';

  renderTags(refs.tags.value);
  applyTheme(refs.theme.value);
  applyRatio(refs.ratio.value);
  saveState();
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function exportPNG() {
  refs.downloadBtn.disabled = true;
  refs.downloadBtn.textContent = '导出中...';

  try {
    const scale = Number(refs.scale.value || 2);
    const canvas = await html2canvas(refs.captureRoot, {
      backgroundColor: null,
      scale,
      useCORS: true,
    });

    const link = document.createElement('a');
    const safeTitle = (refs.title.value.trim() || 'xiaohongshu-poster').replace(/[\\/:*?"<>|]/g, '-');
    link.download = `${safeTitle}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error(error);
    alert('导出失败了，离谱。你打开控制台看看，或者换张图再试。');
  } finally {
    refs.downloadBtn.disabled = false;
    refs.downloadBtn.textContent = '导出 PNG';
  }
}

const storedState = loadState();
hydrateState(storedState);

if (!storedState || !storedState.theme) {
  applyPreset(defaultState.theme);
} else if (storedState.theme in themePresets) {
  if (!localStorage.getItem(STORAGE_KEY)) {
    applyPreset(storedState.theme);
  }
}

[
  refs.title,
  refs.subtitle,
  refs.description,
  refs.tags,
  refs.theme,
  refs.ratio,
  refs.noteTitle,
  refs.noteAccent,
  refs.titleSize,
  refs.titleWeight,
  refs.firstCharMode,
  refs.bgColor,
  refs.accentColor,
  refs.accent2Color,
  refs.titleColor,
  refs.subtitleColor,
  refs.firstCharColor,
].forEach((el) => {
  const eventName = el.tagName === 'SELECT' || el.type === 'color' || el.type === 'range' ? 'input' : 'input';
  el.addEventListener(eventName, () => {
    if (el === refs.theme) {
      applyPreset(refs.theme.value);
    }
    sync();
  });
});

refs.imageUpload.addEventListener('change', async (event) => {
  const [file] = event.target.files || [];
  if (!file) return;
  const result = await readFile(file);
  setPreviewImage(result);
});

refs.useReference.addEventListener('click', () => {
  setPreviewImage('./assets/reference.png');
});

refs.resetBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  hydrateState(defaultState);
  applyPreset(defaultState.theme);
  refs.imageUpload.value = '';
  setPreviewImage('./assets/reference.png');
  sync();
});

refs.downloadBtn.addEventListener('click', exportPNG);

document.addEventListener('dragover', (event) => {
  event.preventDefault();
});

document.addEventListener('drop', async (event) => {
  event.preventDefault();
  const file = [...(event.dataTransfer?.files || [])].find((item) => item.type.startsWith('image/'));
  if (!file) return;
  const result = await readFile(file);
  setPreviewImage(result);
});

if (!(storedState.theme in themePresets)) {
  refs.theme.value = defaultState.theme;
  applyPreset(defaultState.theme);
}

sync();
setPreviewImage(currentImageSrc);
