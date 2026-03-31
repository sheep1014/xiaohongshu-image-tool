const $ = (selector) => document.querySelector(selector);

const refs = {
  captureRoot: $('#captureRoot'),
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
  previewTitle: $('#previewTitle'),
  previewSubtitle: $('#previewSubtitle'),
  previewDescription: $('#previewDescription'),
  previewTags: $('#previewTags'),
  previewImage: $('#previewImage'),
  imagePlaceholder: $('#imagePlaceholder'),
  previewNoteTitle: $('#previewNoteTitle'),
  previewNoteAccent: $('#previewNoteAccent'),
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
};

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

function applyTheme(theme) {
  refs.captureRoot.classList.toggle('theme-dark', theme === 'dark');
  refs.captureRoot.classList.toggle('theme-light', theme === 'light');
}

function applyRatio(ratio) {
  refs.captureRoot.classList.remove('ratio-3-4', 'ratio-4-5', 'ratio-1-1');
  refs.captureRoot.classList.add(`ratio-${ratio.replace(':', '-')}`);
}

function setPreviewImage(src) {
  if (!src) {
    refs.previewImage.removeAttribute('src');
    refs.previewImage.parentElement.classList.remove('has-image');
    return;
  }

  refs.previewImage.src = src;
  refs.previewImage.parentElement.classList.add('has-image');
}

function sync() {
  refs.previewTitle.textContent = refs.title.value.trim() || defaultState.title;
  refs.previewSubtitle.textContent = refs.subtitle.value.trim() || '';
  refs.previewDescription.textContent = refs.description.value.trim() || '';
  refs.previewNoteTitle.textContent = refs.noteTitle.value.trim() || '一图看懂';
  refs.previewNoteAccent.textContent = refs.noteAccent.value.trim() || '直接套用';
  renderTags(refs.tags.value);
  applyTheme(refs.theme.value);
  applyRatio(refs.ratio.value);
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

Object.entries(defaultState).forEach(([key, value]) => {
  if (refs[key]) refs[key].value = value;
});

[
  refs.title,
  refs.subtitle,
  refs.description,
  refs.tags,
  refs.theme,
  refs.ratio,
  refs.noteTitle,
  refs.noteAccent,
].forEach((el) => el.addEventListener('input', sync));

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
  Object.entries(defaultState).forEach(([key, value]) => {
    if (refs[key]) refs[key].value = value;
  });
  refs.imageUpload.value = '';
  setPreviewImage('');
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

sync();
setPreviewImage('./assets/reference.png');
