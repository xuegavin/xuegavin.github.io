(function () {
  'use strict';
  const user = 'xuegavin';
  function selectProjects(repos) {
    return repos.filter(r => r && r.private === false && r.fork === false &&
      typeof r.name === 'string' && r.name.toLowerCase() !== user + '.github.io' &&
      Array.isArray(r.topics) && r.topics.includes('portfolio'))
      .sort((a, b) => (Date.parse(b.updated_at) || 0) - (Date.parse(a.updated_at) || 0));
  }
  async function fetchRepositories(request = fetch) {
    const repos = [];
    for (let page = 1; ; page++) {
      const response = await request(`https://api.github.com/users/${user}/repos?type=owner&sort=updated&direction=desc&per_page=100&page=${page}`, {
        headers: { Accept: 'application/vnd.github+json' },
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error(`GitHub HTTP ${response.status}`);
      const batch = await response.json();
      if (!Array.isArray(batch)) throw new Error('仓库数据格式异常');
      repos.push(...batch);
      if (batch.length < 100) return repos;
    }
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { selectProjects, fetchRepositories };
  }
  if (typeof document === 'undefined') return;
  const list = document.getElementById('project-list');
  const status = document.getElementById('project-status');
  const refresh = document.getElementById('refresh-projects');
  const cacheKey = 'xuegavin-portfolio-v1';
  const ttl = 5 * 60 * 1000;
  function render(repos) {
    list.replaceChildren();
    for (const repo of selectProjects(repos)) {
      const article = document.createElement('article');
      article.className = 'project';
      const body = document.createElement('div');
      body.className = 'project-body';
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = repo.language || '项目';
      const title = document.createElement('h3');
      const link = document.createElement('a');
      link.href = `https://github.com/${user}/${encodeURIComponent(repo.name)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = repo.name + ' ↗';
      title.append(link);
      const description = document.createElement('p');
      description.textContent = repo.description || '这个项目暂时还没有添加简介。';
      const note = document.createElement('span');
      note.className = 'project-note';
      const date = new Date(repo.updated_at);
      note.textContent = Number.isNaN(date.getTime()) ? '' : `更新于 ${date.toLocaleDateString('zh-CN')}`;
      body.append(tag, title, description, note);
      article.append(body);
      list.append(article);
    }
    status.textContent = list.childElementCount ? `已展示 ${list.childElementCount} 个项目` : '暂时没有公开展示的项目，敬请期待。';
  }
  async function load(force = false) {
    refresh.disabled = true;
    status.textContent = '正在读取项目…';
    try {
      let cached;
      try { cached = JSON.parse(localStorage.getItem(cacheKey)); } catch (_) { /* 缓存不可用时直接联网 */ }
      if (!force && cached && Array.isArray(cached.repos) && Number.isFinite(cached.time) &&
          Date.now() >= cached.time && Date.now() - cached.time < ttl) {
        render(cached.repos);
        return;
      }
      const repos = await fetchRepositories();
      render(repos);
      try { localStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), repos })); } catch (_) { /* 存储失败不影响展示 */ }
    } catch (_) {
      list.replaceChildren();
      status.textContent = '暂时无法读取项目，可能是网络异常或 GitHub 请求限流。请稍后重试，或点击上方链接浏览 GitHub 仓库。';
    } finally {
      refresh.disabled = false;
    }
  }
  refresh.addEventListener('click', () => load(true));
  load();
})();
