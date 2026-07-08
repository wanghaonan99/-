/**
 * 苏州古典园林网站 — 交互逻辑
 * 单页应用 + hash 路由：首页列表 ↔ 详情视图
 */

(function () {
  'use strict';

  // ============ 元素引用 ============
  const homeView = document.getElementById('home-view');
  const detailView = document.getElementById('detail-view');
  const gardenGrid = document.getElementById('garden-grid');
  const detailContainer = document.getElementById('detail-container');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // ============ 状态 ============
  let currentFilter = 'all';
  let currentGardenId = null;

  const FILTER_LABELS = {
    all: '全部园林',
    water: '水面开合',
    space: '空间折叠',
    rock: '石中迷境',
    quiet: '城市隐逸',
    1997: '1997 首批列入',
    2000: '2000 扩展列入'
  };

  function getFilteredGardens(filter) {
    if (filter === 'all') return GARDENS;
    if (filter === '1997' || filter === '2000') return GARDENS.filter(g => g.heritage === filter);
    return GARDENS.filter(g => g.curatorialKey === filter);
  }

  // ============ SVG 占位图生成 ============
  function createSVGPlaceholder(garden) {
    const pattern = garden.svgPattern || 'water-garden';
    const baseColor = garden.accent || '#5a7a5a';
    const lightColor = garden.accent ? garden.accent + '33' : '#5a7a5a33';

    const patterns = {
      'water-garden': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">
        <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${baseColor}22"/><stop offset="100%" stop-color="${baseColor}08"/></linearGradient></defs>
        <rect width="400" height="250" fill="url(#bg)" rx="8"/>
        <ellipse cx="200" cy="140" rx="120" ry="50" fill="${baseColor}18" stroke="${baseColor}44" stroke-width="1.5"/>
        <ellipse cx="200" cy="128" rx="100" ry="40" fill="${baseColor}12"/>
        <path d="M80 180 Q140 120 200 160 Q260 200 320 140" fill="none" stroke="${baseColor}66" stroke-width="2"/>
        <rect x="140" y="65" width="60" height="35" rx="2" fill="${baseColor}55" opacity="0.8"/>
        <polygon points="140,65 170,45 200,65" fill="${baseColor}66" opacity="0.7"/>
        <line x1="165" y1="100" x2="165" y2="125" stroke="${baseColor}44" stroke-width="3"/>
      </svg>`,
      'rock-garden': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">
        <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${baseColor}22"/><stop offset="100%" stop-color="${baseColor}08"/></linearGradient></defs>
        <rect width="400" height="250" fill="url(#bg)" rx="8"/>
        <path d="M60,220 L80,140 L105,120 L140,150 L130,80 L160,65 L180,90 L210,55 L230,85 L260,70 L280,100 L310,130 L340,160 L370,200 L380,220Z" fill="${baseColor}25" stroke="${baseColor}55" stroke-width="1.5"/>
        <path d="M140,150 L145,120 L160,90 L170,110" fill="${baseColor}35" stroke="${baseColor}55" stroke-width="1"/>
        <circle cx="160" cy="155" r="8" fill="${baseColor}44" opacity="0.6"/>
        <circle cx="230" cy="140" r="6" fill="${baseColor}44" opacity="0.5"/>
        <rect x="300" y="110" width="30" height="22" rx="2" fill="${baseColor}55" opacity="0.7"/>
        <polygon points="300,110 315,95 330,110" fill="${baseColor}66" opacity="0.6"/>
      </svg>`,
      'pavilion-garden': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">
        <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${baseColor}22"/><stop offset="100%" stop-color="${baseColor}08"/></linearGradient></defs>
        <rect width="400" height="250" fill="url(#bg)" rx="8"/>
        <ellipse cx="200" cy="170" rx="150" ry="50" fill="${baseColor}15" stroke="${baseColor}44" stroke-width="1"/>
        <rect x="160" y="70" width="80" height="65" rx="2" fill="${baseColor}35" stroke="${baseColor}55" stroke-width="1.5"/>
        <polygon points="140,75 200,30 260,75" fill="${baseColor}45" stroke="${baseColor}55" stroke-width="1.5"/>
        <rect x="175" y="90" width="50" height="45" fill="${baseColor}08"/>
        <line x1="200" y1="135" x2="200" y2="165" stroke="${baseColor}55" stroke-width="4"/>
        <path d="M60,170 Q130,140 200,160 Q270,180 340,150" fill="none" stroke="${baseColor}55" stroke-width="2"/>
        <circle cx="200" cy="155" r="4" fill="${baseColor}88"/>
      </svg>`
    };
    return patterns[pattern] || patterns['water-garden'];
  }

  // ============ 渲染首页卡片 ============
  function renderHome(filter) {
    const filtered = getFilteredGardens(filter);

    let html = '';
    html += `
      <div class="grid-intro">
        <span class="grid-kicker">${FILTER_LABELS[filter] || '策展视角'}</span>
        <h2>九座园林，九种观看中国山水的方式</h2>
        <p>从水面开合、空间折叠到石中迷境，页面不只罗列名园，而是帮助你理解每座园林的观看方法。</p>
      </div>`;

    filtered.forEach((garden, idx) => {
      html += `
        <article class="garden-card ${idx < 2 && filter === 'all' ? 'garden-card-featured' : ''}" data-id="${garden.id}" style="--card-accent: ${garden.accent}" tabindex="0" role="button" aria-label="查看${garden.name}详情">
          <div class="card-visual">
            ${garden.image
              ? `<img src="${garden.image}" alt="${garden.imageAlt || garden.name}" loading="${idx < 2 ? 'eager' : 'lazy'}" onerror="var g=GARDENS.find(function(x){return x.id==='${garden.id}'});if(g)this.outerHTML=createSVGPlaceholder(g);" onload="this.closest('.card-visual')&&this.closest('.card-visual').classList.add('loaded');this.style.opacity='1'" style="opacity:0;transition:opacity .4s">`
              : createSVGPlaceholder(garden)
            }
            <div class="card-tag">${garden.heritage} 年列入</div>
          </div>
          <div class="card-body">
            <p class="card-archetype">${garden.archetype || garden.feature}</p>
            <h2 class="card-name">${garden.name}</h2>
            <p class="card-pinyin">${garden.enName}</p>
            <p class="card-era"><span class="era-dot" style="background:${garden.accent}"></span>${garden.dynasty} · ${garden.builtYear}</p>
            <p class="card-feature">「${garden.oneLine || garden.feature}」</p>
            <div class="card-meta-row">
              <span>${garden.mood || '古典园林'}</span>
              <span>${garden.scenario || '深度游览'}</span>
            </div>
            <span class="card-more">入园细看 →</span>
          </div>
        </article>`;
    });

    gardenGrid.innerHTML = html;

    // 绑定卡片点击事件
    gardenGrid.querySelectorAll('.garden-card').forEach(card => {
      card.addEventListener('click', function (e) {
        // 如果点击的是图片错误处理后的 SVG，正常导航
        const id = this.dataset.id;
        if (id) {
          window.location.hash = '#' + id;
        }
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = this.dataset.id;
          if (id) window.location.hash = '#' + id;
        }
      });
    });

    // 处理图片加载
    gardenGrid.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function () {
        const card = this.closest('.garden-card');
        const gid = card ? card.dataset.id : null;
        const garden = GARDENS.find(g => g.id === gid);
        if (garden) this.outerHTML = createSVGPlaceholder(garden);
      });
    });
  }

  // ============ 渲染详情视图 ============
  function renderDetail(id) {
    const garden = GARDENS.find(g => g.id === id);
    if (!garden) {
      renderHome('all');
      return;
    }

    currentGardenId = id;
    const idx = GARDENS.findIndex(g => g.id === id);
    const prev = GARDENS[(idx - 1 + GARDENS.length) % GARDENS.length];
    const next = GARDENS[(idx + 1) % GARDENS.length];

    let imageHTML = garden.image
      ? `<img src="${garden.image}" alt="${garden.imageAlt || garden.name}" onerror="this.outerHTML=document.getElementById('detail-image-fb')?.innerHTML||''" onload="this.closest('.detail-image-wrap')&&this.closest('.detail-image-wrap').classList.add('loaded');this.style.opacity='1'" style="opacity:0;transition:opacity .5s">`
      : createSVGPlaceholder(garden);

    let html = `
      <div class="detail-header">
        <a href="#/" class="back-btn" aria-label="返回列表">← 返回园林列表</a>
        <div class="detail-nav-top">
          <a href="#/${prev.id}" class="nav-link prev-link" title="${prev.name}">← ${prev.name}</a>
          <a href="#/${next.id}" class="nav-link next-link" title="${next.name}">${next.name} →</a>
        </div>
      </div>

      <article class="detail-content" style="--detail-accent: ${garden.accent}">
        <header class="detail-hero">
          <div class="detail-image-wrap">
            ${imageHTML}
            <div id="detail-image-fb" style="display:none">${createSVGPlaceholder(garden)}</div>
          </div>
          <div class="detail-hero-text">
            <span class="detail-badge">${garden.heritage} 年列入 UNESCO 世界遗产</span>
            <h1 class="detail-name">${garden.name}</h1>
            <p class="detail-en">${garden.enName}</p>
            <p class="detail-tagline">${garden.tagline}</p>
            <blockquote class="detail-verdict">${garden.oneLine || garden.feature}</blockquote>
            <div class="detail-chips" aria-label="园林气质">
              <span>${garden.archetype || garden.feature}</span>
              <span>${garden.mood || garden.dynasty + '代园林'}</span>
              <span>${garden.scenario || '深度游览'}</span>
            </div>
          </div>
        </header>

        <section class="curation-strip" aria-label="看懂这座园林">
          <div>
            <span class="curation-label">如何看懂</span>
            <p>${garden.readClue || garden.features}</p>
          </div>
          <div>
            <span class="curation-label">适合谁</span>
            <p>${garden.audience || '对中国古典园林感兴趣的游客'}</p>
          </div>
          <div>
            <span class="curation-label">游览提示</span>
            <p>${garden.routeHint || '建议放慢脚步，留意水面、廊窗与建筑之间的视线关系。'}</p>
          </div>
        </section>

        <div class="detail-info-grid">
          <div class="info-item">
            <span class="info-label">朝代</span>
            <span class="info-value">${garden.dynasty}</span>
          </div>
          <div class="info-item">
            <span class="info-label">始建年代</span>
            <span class="info-value">${garden.builtYear}</span>
          </div>
          <div class="info-item">
            <span class="info-label">始建者</span>
            <span class="info-value">${garden.founder}</span>
          </div>
          <div class="info-item">
            <span class="info-label">占地面积</span>
            <span class="info-value">${garden.area}</span>
          </div>
          <div class="info-item info-full">
            <span class="info-label">地址</span>
            <span class="info-value">${garden.location}</span>
          </div>
        </div>

        <div class="detail-section">
          <h2 class="section-title"><span class="section-num">壹</span> 入园印象</h2>
          <div class="section-body">
            <p>${garden.visualMotif || garden.tagline}。${garden.oneLine || garden.features}</p>
          </div>
        </div>

        <div class="detail-section">
          <h2 class="section-title"><span class="section-num">贰</span> 如何看懂</h2>
          <div class="section-body">
            <p>${garden.features}</p>
            <p class="read-note">${garden.readClue || ''}</p>
          </div>
        </div>

        <div class="detail-section">
          <h2 class="section-title"><span class="section-num">叁</span> 主要景点</h2>
          <div class="section-body">
            <ul class="highlight-list">
              ${garden.highlights.map((h, i) => `<li><span class="hl-num">${String(i + 1).padStart(2, '0')}</span>${h}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="detail-section">
          <h2 class="section-title"><span class="section-num">肆</span> 历史与价值</h2>
          <div class="section-body dual-text">
            <p>${garden.history}</p>
            <p>${garden.art}</p>
          </div>
        </div>

        <div class="detail-section guide-section">
          <h2 class="section-title"><span class="section-num">伍</span> 场景化游览指南</h2>
          <div class="section-body guide-body">
            <p class="guide-intro">围绕「${garden.scenario || '深度游览'}」生成路线、看点和停留建议。内容基于内置攻略资料，可按你的同行人群和时间再细化。</p>
            <div class="guide-scenarios">
              <button type="button" data-prompt="我只有 2 小时，请给我一条不绕路的精华路线">2 小时精华</button>
              <button type="button" data-prompt="适合拍照的机位和时间，尤其想拍水面、亭榭、窗景">摄影机位</button>
              <button type="button" data-prompt="带老人游览，路线要平缓，注明休息点和需要避开的路段">长者友好</button>
              <button type="button" data-prompt="请用容易理解的方式给孩子讲这座园林的看点">亲子讲解</button>
            </div>
            <div class="guide-prompt-wrap">
              <label class="guide-prompt-label" for="guide-prompt-input">自定义需求（选填）</label>
              <input type="text" class="guide-prompt-input" id="guide-prompt-input"
                placeholder="例如：带老人去，想拍照在哪个位置拍，推荐一日游路线…">
            </div>
            <button class="guide-gen-btn" id="guide-gen-btn" data-garden="${garden.id}">
              <span class="guide-gen-icon">游</span> 生成游览指南
            </button>
            <div class="guide-result" id="guide-result" style="display:none">
              <div class="guide-loading" id="guide-loading">
                <span class="guide-loading-step" id="guide-loading-step">🔍 正在搜索「${garden.name}」真实游记攻略……</span>
              </div>
              <div class="guide-error" id="guide-error" style="display:none"></div>
              <div class="guide-display" id="guide-display" style="display:none"></div>
            </div>
          </div>
        </div>

        <div class="detail-section poetry-section">
          <h2 class="section-title"><span class="section-num">陆</span> AI 诗词雅集</h2>
          <div class="section-body poetry-body">
            <p class="poetry-intro">把游览体验收束为一首小诗。默认使用本地词库，如需更高质量，可在高级设置中切换引擎。</p>

            <!-- 自定义主题 -->
            <div class="poetry-prompt-wrap">
              <label class="poetry-prompt-label" for="poetry-prompt-input">自定义主题（选填）</label>
              <input type="text" class="poetry-prompt-input" id="poetry-prompt-input"
                placeholder="例如：咏荷、雨后访园、秋日游园、借景之妙…">
            </div>

            <!-- 引擎设置 -->
            <details class="poetry-settings" id="poetry-settings">
              <summary class="poetry-settings-summary">
                <span>高级设置</span>
                <span class="poetry-settings-badge" id="poetry-engine-badge">本地引擎</span>
              </summary>
              <div class="poetry-settings-body">
                <div class="poetry-model-selector" id="poetry-models">
                  ${PoetryEngine.LLM_MODELS.map((m, i) =>
                    `<button class="poetry-model-btn${i === 0 ? ' active' : ''}" data-model="${m.id}" title="${m.desc}">
                      <span class="poetry-model-icon">${m.icon}</span>
                      <span class="poetry-model-name">${m.name}</span>
                      <span class="poetry-model-desc">${m.desc}</span>
                    </button>`
                  ).join('')}
                </div>
                <div class="poetry-apikey-wrap" id="poetry-apikey-wrap" style="display:none">
                  <label class="poetry-apikey-label" for="poetry-apikey-input">
                    🔑 智谱 AI API Key
                  </label>
                  <div class="poetry-apikey-row">
                    <input type="password" class="poetry-apikey-input" id="poetry-apikey-input"
                      placeholder="粘贴你的智谱 AI API Key…" autocomplete="off">
                    <button type="button" class="poetry-apikey-toggle" id="poetry-apikey-toggle" title="显示/隐藏">👁️</button>
                  </div>
                  <p class="poetry-apikey-hint">Key 仅保存在浏览器本地，直接调用智谱官方 API，不会经过第三方服务器。</p>
                </div>
              </div>
            </details>

            <!-- 诗体选择 -->
            <div class="poetry-style-selector" id="poetry-styles">
              ${PoetryEngine.styles.map((s, i) =>
                `<button class="poetry-style-btn${i === 1 ? ' active' : ''}" data-style="${s.id}" title="${s.desc}">
                  <span class="poetry-style-icon">${s.icon}</span>
                  <span class="poetry-style-name">${s.name}</span>
                </button>`
              ).join('')}
            </div>
            <button class="poetry-gen-btn" id="poetry-gen-btn" data-garden="${garden.id}">
              <span class="poetry-gen-icon">✨</span> 生成诗词
            </button>
            <div class="poetry-result" id="poetry-result" style="display:none">
              <div class="poetry-loading" id="poetry-loading">
                <span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span>
                <span class="loading-text">AI 正在推敲诗句……</span>
              </div>
              <div class="poetry-error" id="poetry-error" style="display:none"></div>
              <div class="poetry-display" id="poetry-display" style="display:none"></div>
            </div>
          </div>
        </div>

        <nav class="detail-nav-bottom">
          <a href="#/${prev.id}" class="nav-card prev-card">
            <span class="nav-card-label">← 上一座</span>
            <span class="nav-card-name">${prev.name}</span>
            <span class="nav-card-feature">${prev.feature}</span>
          </a>
          <a href="#/" class="nav-card back-card">
            <span class="nav-card-label">返回</span>
            <span class="nav-card-name">全部园林</span>
            <span class="nav-card-feature">共 ${GARDENS.length} 座</span>
          </a>
          <a href="#/${next.id}" class="nav-card next-card">
            <span class="nav-card-label">下一座 →</span>
            <span class="nav-card-name">${next.name}</span>
            <span class="nav-card-feature">${next.feature}</span>
          </a>
        </nav>
      </article>`;

    detailContainer.innerHTML = html;

    // 处理详情页图片
    detailContainer.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function () {
        const fb = document.getElementById('detail-image-fb');
        if (fb) this.outerHTML = fb.innerHTML;
      });
    });

    // ============ AI 游览指南交互 ============
    const guideBtn = detailContainer.querySelector('#guide-gen-btn');
    const guideResult = detailContainer.querySelector('#guide-result');
    const guideLoading = detailContainer.querySelector('#guide-loading');
    const guideLoadingStep = detailContainer.querySelector('#guide-loading-step');
    const guideError = detailContainer.querySelector('#guide-error');
    const guideDisplay = detailContainer.querySelector('#guide-display');
    const guidePromptInput = detailContainer.querySelector('#guide-prompt-input');
    const guideScenarioBtns = detailContainer.querySelectorAll('.guide-scenarios button');

    guideScenarioBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        guideScenarioBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        if (guidePromptInput) {
          guidePromptInput.value = this.dataset.prompt || '';
          guidePromptInput.focus();
        }
      });
    });

    guideBtn.addEventListener('click', function () {
      triggerGuideGen(garden);
    });

    function triggerGuideGen(garden) {
      if (!guideResult || !guideLoadingStep || !guideDisplay) return;

      // 读取自定义需求
      var promptInput = detailContainer.querySelector('#guide-prompt-input');
      var customPrompt = promptInput ? promptInput.value.trim() : '';

      guideResult.style.display = 'block';
      guideLoading.style.display = 'block';
      if (guideError) guideError.style.display = 'none';
      guideDisplay.style.display = 'none';
      guideBtn.disabled = true;
      guideBtn.innerHTML = '<span class="guide-gen-icon">⏳</span> 生成中...';

      // 模拟搜索阶段
      var searchPhrases = [
        '🔍 正在搜索「' + garden.name + '」真实游记攻略……',
        '📖 已找到 ' + (3 + Math.floor(Math.random() * 5)) + ' 篇相关游记，正在提取精华……',
        '🧠 正在结合游记内容，为「' + garden.name + '」生成个性化游览指南……'
      ];
      var stepIdx = 0;

      guideLoadingStep.textContent = searchPhrases[stepIdx];
      var stepTimer = setInterval(function () {
        stepIdx++;
        if (stepIdx < searchPhrases.length) {
          guideLoadingStep.textContent = searchPhrases[stepIdx];
        }
      }, 1200);

      // 判断引擎模式
      var useLLM = false;
      var apiKey = '';
      var model = 'local';

      if (typeof currentModel !== 'undefined' && currentModel !== 'local') {
        apiKey = typeof currentApiKey !== 'undefined' ? currentApiKey : '';
        if (apiKey) {
          useLLM = true;
          model = currentModel;
        }
      } else if (typeof currentApiKey !== 'undefined' && currentApiKey) {
        // 从 poetry 引擎获取设置
        apiKey = currentApiKey;
        if (typeof currentModel !== 'undefined' && currentModel !== 'local') {
          useLLM = true;
          model = currentModel;
        }
      }

      function finishGeneration(result) {
        clearInterval(stepTimer);
        guideLoading.style.display = 'none';
        guideLoadingStep.textContent = '✅ 指南生成完毕！';
        guideBtn.disabled = false;
        guideBtn.innerHTML = '<span class="guide-gen-icon">🧭</span> 重新生成';
        renderGuideResult(result);
      }

      function handleError(error) {
        clearInterval(stepTimer);
        guideLoading.style.display = 'none';
        if (guideError) {
          guideError.style.display = 'block';
          guideError.innerHTML = '⚠️ ' + (error.message || '生成失败，请重试');
        }
        guideBtn.disabled = false;
        guideBtn.innerHTML = '<span class="guide-gen-icon">🧭</span> 重试';
      }

      if (useLLM && typeof TravelGuide !== 'undefined' && TravelGuide.generateLLM) {
        // LLM 引擎
        TravelGuide.generateLLM(garden.id, garden.name, model, apiKey, customPrompt)
          .then(function (result) { finishGeneration(result); })
          .catch(function (error) { handleError(error); });
      } else if (typeof TravelGuide !== 'undefined' && TravelGuide.generateLocal) {
        // 本地引擎
        TravelGuide.generateLocal(garden.id, garden.name, customPrompt)
          .then(function (result) { finishGeneration(result); })
          .catch(function (error) { handleError(error); });
      } else {
        handleError(new Error('游览指南引擎未加载，请刷新页面重试'));
      }
    }

    function renderGuideResult(result) {
      if (!guideDisplay) return;
      guideDisplay.style.display = 'block';

      var sourceLabel = result.fromLLM
        ? (PoetryEngine.LLM_MODELS.find(function (m) { return m.id === result.model; }) || {}).name || 'LLM'
        : '本地引擎';

      var sectionsHTML = result.sections.map(function (s) {
        return '<div class="guide-card-section">' +
          '<h3 class="guide-card-heading">' + s.title + '</h3>' +
          '<p class="guide-card-text">' + s.body.replace(/\n/g, '<br>') + '</p>' +
          '</div>';
      }).join('');

      guideDisplay.innerHTML =
        '<div class="guide-card">' +
        '  <div class="guide-card-header">' +
        '    <span class="guide-card-icon">🧭</span>' +
        '    <span class="guide-card-title">' + result.gardenName + ' · 游览指南</span>' +
        '  </div>' +
        '  <div class="guide-card-body">' +
        sectionsHTML +
        '  </div>' +
        '  <div class="guide-card-footer">' +
        '    <span class="guide-source-dot' + (result.fromLLM ? ' llm' : '') + '"></span>' +
        '    由 <strong>' + sourceLabel + '</strong> 生成' +
        '    <button class="guide-action-btn" onclick="navigator.clipboard.writeText(this.dataset.text)" data-text="' +
        result.sections.map(function (s) { return s.title + '\n' + s.body; }).join('\n\n').replace(/"/g, '&quot;') +
        '" title="复制指南">📋 复制</button>' +
        '  </div>' +
        '  <div class="guide-card-seal" aria-hidden="true">游</div>' +
        '</div>';
    }

    // ============ AI 写诗交互 ============
    const styleBtns = detailContainer.querySelectorAll('.poetry-style-btn');
    const genBtn = detailContainer.querySelector('#poetry-gen-btn');
    const poetryResult = detailContainer.querySelector('#poetry-result');
    const poetryLoading = detailContainer.querySelector('#poetry-loading');
    const poetryError = detailContainer.querySelector('#poetry-error');
    const poetryDisplay = detailContainer.querySelector('#poetry-display');
    const modelBtns = detailContainer.querySelectorAll('.poetry-model-btn');
    const apiKeyWrap = detailContainer.querySelector('#poetry-apikey-wrap');
    const apiKeyInput = detailContainer.querySelector('#poetry-apikey-input');
    const apiKeyToggle = detailContainer.querySelector('#poetry-apikey-toggle');
    const engineBadge = detailContainer.querySelector('#poetry-engine-badge');

    let currentStyle = PoetryEngine.styles[1].id; // 默认七言绝句
    let currentModel = 'local';
    let currentApiKey = localStorage.getItem('zhipu_api_key') || '';

    // 恢复保存的 API Key
    if (currentApiKey && apiKeyInput) {
      apiKeyInput.value = currentApiKey;
    }

    // ============ 模型选择 ============
    modelBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        modelBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentModel = this.dataset.model;

        // 更新引擎标签
        if (engineBadge) {
          const selectedModel = PoetryEngine.LLM_MODELS.find(m => m.id === currentModel);
          engineBadge.textContent = selectedModel ? selectedModel.name : '本地引擎';
        }

        // 显示/隐藏 API Key 输入
        if (apiKeyWrap) {
          apiKeyWrap.style.display = currentModel === 'local' ? 'none' : 'block';
        }

        // 切换后若已有结果，重新生成
        if (poetryResult && poetryResult.style.display !== 'none') {
          triggerPoetryGen(garden);
        }
      });
    });

    // ============ API Key 显示/隐藏 ============
    if (apiKeyToggle && apiKeyInput) {
      apiKeyToggle.addEventListener('click', function () {
        const isPassword = apiKeyInput.type === 'password';
        apiKeyInput.type = isPassword ? 'text' : 'password';
        this.textContent = isPassword ? '🙈' : '👁️';
      });
    }

    // ============ API Key 自动保存 ============
    if (apiKeyInput) {
      apiKeyInput.addEventListener('input', function () {
        currentApiKey = this.value.trim();
        if (currentApiKey) {
          localStorage.setItem('zhipu_api_key', currentApiKey);
        } else {
          localStorage.removeItem('zhipu_api_key');
        }
      });
    }

    // ============ 诗体选择 ============
    styleBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        styleBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentStyle = this.dataset.style;
        // 如果已有结果，切换诗体后重新生成
        if (poetryResult && poetryResult.style.display !== 'none') {
          triggerPoetryGen(garden);
        }
      });
    });

    // ============ 生成按钮 ============
    genBtn.addEventListener('click', function () {
      triggerPoetryGen(garden);
    });

    function triggerPoetryGen(garden) {
      if (!poetryResult || !poetryLoading || !poetryDisplay) return;

      // 读取自定义提示词
      var promptInput = detailContainer.querySelector('#poetry-prompt-input');
      var customPrompt = promptInput ? promptInput.value.trim() : '';

      poetryResult.style.display = 'block';
      poetryLoading.style.display = 'flex';
      if (poetryError) poetryError.style.display = 'none';
      poetryDisplay.style.display = 'none';
      genBtn.disabled = true;
      genBtn.innerHTML = '<span class="poetry-gen-icon">⏳</span> 推敲中...';

      // 本地引擎
      if (currentModel === 'local') {
        const delay = 600 + Math.random() * 1000;
        setTimeout(function () {
          const result = PoetryEngine.generate(garden.name, garden.id, currentStyle, customPrompt);
          renderPoetryResult(result);
          genBtn.disabled = false;
          genBtn.innerHTML = '<span class="poetry-gen-icon">✨</span> 再写一首';
        }, delay);
        return;
      }

      // LLM 引擎
      if (!currentApiKey) {
        poetryLoading.style.display = 'none';
        if (poetryError) {
          poetryError.style.display = 'block';
          poetryError.innerHTML = '⚠️ 请先在引擎设置中输入智谱 AI API Key';
        }
        genBtn.disabled = false;
        genBtn.innerHTML = '<span class="poetry-gen-icon">✨</span> 生成诗词';
        return;
      }

      const modelName = PoetryEngine.LLM_MODELS.find(m => m.id === currentModel);
      poetryLoading.querySelector('.loading-text').textContent = '正在调用' + (modelName ? modelName.name : currentModel) + '……';

      PoetryEngine.generateWithLLM(garden.name, garden.id, currentStyle, currentModel, currentApiKey, customPrompt)
        .then(function (result) {
          renderPoetryResult(result);
          genBtn.disabled = false;
          genBtn.innerHTML = '<span class="poetry-gen-icon">✨</span> 再写一首';
        })
        .catch(function (error) {
          poetryLoading.style.display = 'none';
          if (poetryError) {
            poetryError.style.display = 'block';
            poetryError.innerHTML = '⚠️ ' + (error.message || '生成失败，请重试');
          }
          genBtn.disabled = false;
          genBtn.innerHTML = '<span class="poetry-gen-icon">✨</span> 重试';
        });
    }

    function renderPoetryResult(result) {
      poetryLoading.style.display = 'none';
      poetryDisplay.style.display = 'block';

      function escapeHTML(text) {
        return String(text || '').replace(/[&<>"']/g, function (ch) {
          return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
        });
      }

      // 为每行诗添加序号和装饰
      let linesHTML = result.lines.map((line, i) => {
        return `<span class="poetry-line">${escapeHTML(line)}</span>`;
      }).join('');

      // 模型来源标识
      const modelLabel = result.fromLLM
        ? (PoetryEngine.LLM_MODELS.find(m => m.id === result.model) || {}).name || result.model
        : '本地引擎';

      const poemTitle = result.theme ? result.theme : '咏' + result.gardenName + '之境';
      const copyText = [poemTitle].concat(result.lines).join('\n');

      poetryDisplay.innerHTML = `
        <div class="poetry-card">
          <div class="poetry-card-header">
            <span class="poetry-card-style">${escapeHTML(result.styleName)}</span>
            <span class="poetry-card-theme">诗题：${escapeHTML(poemTitle)}</span>
          </div>
          <div class="poetry-card-lines">
            ${linesHTML}
          </div>
          <div class="poetry-card-actions">
            <button class="poetry-action-btn" data-text="${escapeHTML(copyText)}" title="复制诗词">
              📋 复制
            </button>
          </div>
          <div class="poetry-card-source">
            <span class="poetry-source-dot${result.fromLLM ? ' llm' : ''}"></span>
            由 <strong>${modelLabel}</strong> 生成
          </div>
          <div class="poetry-card-seal" aria-hidden="true">诗</div>
        </div>
      `;

      // 监听复制按钮
      const copyBtn = poetryDisplay.querySelector('.poetry-action-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          const text = this.dataset.text;
          navigator.clipboard.writeText(text).then(() => {
            const orig = this.innerHTML;
            this.innerHTML = '✅ 已复制';
            setTimeout(() => { this.innerHTML = orig; }, 2000);
          }).catch(() => {
            this.innerHTML = '❌ 复制失败';
            setTimeout(() => { this.innerHTML = '📋 复制'; }, 2000);
          });
        });
      }
    }
  }

  // ============ 路由 ============
  function router() {
    const hash = window.location.hash.replace('#', '');

    if (!hash || hash === '/') {
      // 首页
      homeView.classList.add('active');
      detailView.classList.remove('active');
      document.title = '苏州古典园林 — UNESCO 世界文化遗产';
      currentGardenId = null;
      if (!gardenGrid.children.length) {
        renderHome(currentFilter);
      }
    } else {
      // 详情页
      const id = hash.startsWith('/') ? hash.slice(1) : hash;
      homeView.classList.remove('active');
      detailView.classList.add('active');
      renderDetail(id);
      const garden = GARDENS.find(g => g.id === id);
      if (garden) {
        document.title = garden.name + ' — 苏州古典园林';
      }
      window.scrollTo(0, 0);
    }
  }

  // ============ 筛选 ============
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');
      currentFilter = this.dataset.filter;
      renderHome(currentFilter);
    });
  });

  // ============ 初始化 ============
  // data.js 和 app.js 均使用 defer，在 DOM 解析完毕后按序执行
  // 此时 GARDENS 已定义，DOM 已就绪
  window.addEventListener('hashchange', router);

  renderHome('all');
  router();
})();
