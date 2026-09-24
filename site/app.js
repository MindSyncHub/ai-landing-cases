/* 墨予镜 · 企业 AI 落地案例库 —— 单页应用（hash 路由，无构建依赖） */
(function () {
  'use strict';

  var app = document.getElementById('app');
  var state = { cases: [], patterns: [], painPoints: [], loaded: false };
  var filter = { q: '', tier: '', field: '', pattern: '', d1: '', d2: '', d3: '', d4: '', d5: '' };

  /* ---------- 维度取值中文名 ---------- */
  var DIM_LABELS = {
    entry: { 'field-diagnosis': '现场诊断切入', 'pilot-cut': '小切口试点', 'foundation-first': '底座先行', 'product-embed': '产品嵌入' },
    human_ai: { 'ai-screen-human-decide': 'AI 初筛·人决策', 'ai-execute-human-supervise': 'AI 执行·人监督', 'human-led-ai-assist': '人主导·AI 辅助', 'auto-with-fallback': '自动+人工兜底' },
    knowledge: { tacit: '隐性经验', documents: '文档知识', 'process-data': '流程数据', rules: '业务规则', synthetic: '合成数据' },
    validation: { 'eval-first': '评测先行', 'pilot-ab': '试点 A/B', 'baseline-compare': '基线对比', unverified: '未验证' },
    diffusion: { 'top-down': '自上而下', 'bottom-up': '自下而上', 'catalyst-network': '催化者网络', productization: '产品化扩散' }
  };
  var DIM_NAMES = { entry: '切入逻辑', human_ai: '人机分工', knowledge: '知识来源', validation: '验证方式', diffusion: '扩散方式' };
  var TIER_LABEL = { 'S': 'S 级·深度', '标准': '标准级', '概览': '概览级' };
  var TIER_CLASS = { 'S': 'tier-S', '标准': 'tier-std', '概览': 'tier-brief' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fieldOf(c) { return (c.industry || '').split('/')[0]; }
  function painMap() {
    var m = {};
    state.painPoints.forEach(function (t) { m[t.id] = t.name; });
    return m;
  }
  function patternMap() {
    var m = {};
    state.patterns.forEach(function (p) { m[p.id] = p; });
    return m;
  }

  /* ---------- 路由 ---------- */
  function route() {
    if (!state.loaded) return;
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h.split('/').filter(Boolean);
    setNav(parts[0] || '');
    if (parts[0] === 'cases') renderCases();
    else if (parts[0] === 'case' && parts[1]) renderCase(parts[1]);
    else if (parts[0] === 'patterns') renderPatterns();
    else if (parts[0] === 'pattern' && parts[1]) renderPattern(parts[1]);
    else if (parts[0] === 'stats') renderStats();
    else if (parts[0] === 'about') renderAbout();
    else renderHome();
    window.scrollTo(0, 0);
  }
  function setNav(key) {
    var map = { case: 'cases', pattern: 'patterns' };
    var active = map[key] || key;
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === active);
    });
  }

  /* ---------- 首页 ---------- */
  function renderHome() {
    var s = state.cases;
    var sTier = s.filter(function (c) { return c.detail_tier === 'S'; }).length;
    var unverified = s.filter(function (c) { return c.dimensions && c.dimensions.validation === 'unverified'; }).length;
    app.innerHTML =
      '<div class="hero">' +
        '<h1>别人落地 AI 踩过的坑，<br>不用再付一遍学费。</h1>' +
        '<p>从公开来源一手提取的企业 AI 落地案例库。按业务痛点检索，用决策五问读案例：投入多大、周期多长、前提是什么、会死在哪儿、同类企业能不能复制。</p>' +
        '<div class="stat-row">' +
          statBox(s.length, '收录案例') +
          statBox(sTier, 'S 级深度分析') +
          statBox(state.patterns.length, 'FDE 落地模式') +
          statBox('34', '痛点标签') +
          statBox(unverified, '未验证·已标注') +
        '</div>' +
      '</div>' +
      '<h2 class="section-title">决策五问：读案例的固定姿势</h2>' +
      '<div class="five-q">' +
        q('① 投入多大', '人力、预算、FDE 投入时长') +
        q('② 周期多长', '从启动到上线的完整时间线') +
        q('③ 前提是什么', '数据、系统、组织上必须先有的条件') +
        q('④ 会死在哪儿', '公开报道过的失败模式与坑') +
        q('⑤ 能不能复制', '方法对同类企业的可迁移性判断') +
      '</div>' +
      '<h2 class="section-title">证据口径（每条案例强制标注）</h2>' +
      '<div class="tier-legend">' +
        '<span class="item"><b>公开事实</b>——多方可核对的流程与事件</span>' +
        '<span class="item"><b>来源方披露</b>——客户/供应商自述，未经独立审计</span>' +
        '<span class="item"><b>编辑分析</b>——库维护者基于事实的推断</span>' +
      '</div>' +
      '<h2 class="section-title">三档收录标准</h2>' +
      '<div class="tier-legend">' +
        '<span class="item"><b>S 级</b>——细节足以回答决策五问，做完整分析</span>' +
        '<span class="item"><b>标准级</b>——方法与场景可理解，五问有缺项</span>' +
        '<span class="item"><b>概览级</b>——线索卡，页面明确标注「细节不足」</span>' +
      '</div>';
    function statBox(n, l) { return '<div class="stat-box"><div class="num">' + n + '</div><div class="lbl">' + l + '</div></div>'; }
    function q(b, s2) { return '<div class="q"><b>' + b + '</b><span>' + s2 + '</span></div>'; }
  }

  /* ---------- 案例列表 ---------- */
  function renderCases() {
    var pm = patternMap();
    var fields = {};
    state.cases.forEach(function (c) { fields[fieldOf(c)] = true; });
    var fieldOpts = Object.keys(fields).sort();

    var html = '<h1 class="section-title" style="margin-top:8px">案例库</h1>' +
      '<div class="filterbar">' +
        '<div class="filter-row">' +
          '<input type="search" id="f-q" placeholder="搜索公司 / 场景 / 方案关键词…" value="' + esc(filter.q) + '">' +
        '</div>' +
        '<div class="filter-row">' +
          '<label>档位</label>' + sel('f-tier', { '': '全部', 'S': 'S 级', '标准': '标准级', '概览': '概览级' }, filter.tier) +
          '<label>领域</label>' + sel('f-field', optList(fieldOpts), filter.field) +
          '<label>模式</label>' + sel('f-pattern', optList(state.patterns.map(function (p) { return p.id; }), function (id) { return pm[id] ? pm[id].name : id; }), filter.pattern) +
        '</div>' +
        '<div class="filter-row">' +
          '<label>切入</label>' + sel('f-d1', optList(Object.keys(DIM_LABELS.entry), function (k) { return DIM_LABELS.entry[k]; }), filter.d1) +
          '<label>人机</label>' + sel('f-d2', optList(Object.keys(DIM_LABELS.human_ai), function (k) { return DIM_LABELS.human_ai[k]; }), filter.d2) +
          '<label>知识</label>' + sel('f-d3', optList(Object.keys(DIM_LABELS.knowledge), function (k) { return DIM_LABELS.knowledge[k]; }), filter.d3) +
          '<label>验证</label>' + sel('f-d4', optList(Object.keys(DIM_LABELS.validation), function (k) { return DIM_LABELS.validation[k]; }), filter.d4) +
          '<label>扩散</label>' + sel('f-d5', optList(Object.keys(DIM_LABELS.diffusion), function (k) { return DIM_LABELS.diffusion[k]; }), filter.d5) +
          '<button id="f-reset" style="font-size:13px;padding:5px 12px;border:1px solid var(--line);border-radius:7px;background:#fff;cursor:pointer;color:var(--ink-2)">清空筛选</button>' +
        '</div>' +
      '</div>' +
      '<div class="count-line" id="count-line"></div>' +
      '<div class="case-list" id="case-list" style="margin-top:12px"></div>';

    app.innerHTML = html;

    bind('f-q', 'input', function (v) { filter.q = v; drawList(); });
    ['tier', 'field', 'pattern', 'd1', 'd2', 'd3', 'd4', 'd5'].forEach(function (k) {
      bind('f-' + k, 'change', function (v) { filter[k] = v; drawList(); });
    });
    document.getElementById('f-reset').addEventListener('click', function () {
      filter = { q: '', tier: '', field: '', pattern: '', d1: '', d2: '', d3: '', d4: '', d5: '' };
      renderCases();
    });
    drawList();

    function bind(id, ev, fn) {
      document.getElementById(id).addEventListener(ev, function (e) { fn(e.target.value); });
    }
    function sel(id, opts, val) {
      var s = '<select id="' + id + '">';
      Object.keys(opts).forEach(function (k) {
        s += '<option value="' + esc(k) + '"' + (k === val ? ' selected' : '') + '>' + esc(opts[k]) + '</option>';
      });
      return s + '</select>';
    }
    function optList(arr, nameFn) {
      var o = { '': '全部' };
      arr.forEach(function (k) { o[k] = nameFn ? nameFn(k) : k; });
      return o;
    }

    function drawList() {
      var list = state.cases.filter(match);
      document.getElementById('count-line').innerHTML = '命中 <b>' + list.length + '</b> / ' + state.cases.length + ' 条';
      document.getElementById('case-list').innerHTML = list.map(card).join('') ||
        '<div class="block" style="color:var(--ink-3)">没有符合筛选条件的案例。</div>';
    }
    function match(c) {
      if (filter.tier && c.detail_tier !== filter.tier) return false;
      if (filter.field && fieldOf(c) !== filter.field) return false;
      if (filter.pattern && (c.pattern_links || []).indexOf(filter.pattern) < 0) return false;
      for (var i = 1; i <= 5; i++) {
        var key = 'd' + i;
        if (filter[key] && (!c.dimensions || c.dimensions[key === 'd1' ? 'entry' : key === 'd2' ? 'human_ai' : key === 'd3' ? 'knowledge' : key === 'd4' ? 'validation' : 'diffusion'] !== filter[key])) return false;
      }
      if (filter.q) {
        var q = filter.q.toLowerCase();
        var hay = [c.company, c.industry, c.scenario, c.problem, c.solution, c.result].join(' ').toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    }
    function card(c) {
      var pm2 = patternMap();
      var unv = c.dimensions && c.dimensions.validation === 'unverified';
      return '<a class="case-card" href="#/case/' + esc(c.id) + '">' +
        '<div class="head"><span class="co">' + esc(c.company) + '</span>' +
        '<span class="sc">' + esc(c.scenario) + '</span>' +
        '<span class="badge ' + TIER_CLASS[c.detail_tier] + '">' + TIER_LABEL[c.detail_tier] + '</span>' +
        (unv ? '<span class="badge unverified">效果未验证</span>' : '') + '</div>' +
        '<div class="tagrow">' +
        '<span class="tag">' + esc(c.industry) + '</span>' +
        (c.pattern_links || []).map(function (p) { return pm2[p] ? '<span class="tag pattern">' + esc(pm2[p].name) + '</span>' : ''; }).join('') +
        '</div>' +
        '<div class="result-line">' + esc((c.result || '').slice(0, 90)) + (c.result && c.result.length > 90 ? '…' : '') + '</div>' +
      '</a>';
    }
  }

  /* ---------- 案例详情 ---------- */
  function renderCase(id) {
    var c = state.cases.find(function (x) { return x.id === id; });
    if (!c) { app.innerHTML = '<div class="block">案例不存在：<code>' + esc(id) + '</code></div>'; return; }
    var pm = patternMap();
    var pains = painMap();
    var dims = c.dimensions || {};
    var dimKey = { d1: 'entry', d2: 'human_ai', d3: 'knowledge', d4: 'validation', d5: 'diffusion' };

    var html = '<a class="backlink" href="#/cases">← 返回案例库</a>' +
      '<div class="detail-head"><h1>' + esc(c.company) + '</h1>' +
      '<span class="badge ' + TIER_CLASS[c.detail_tier] + '">' + TIER_LABEL[c.detail_tier] + '</span>' +
      (dims.validation === 'unverified' ? '<span class="badge unverified">效果未验证</span>' : '') + '</div>' +
      '<div class="detail-meta">' + esc(c.industry) + ' · 场景：' + esc(c.scenario) + ' · <code style="font-size:12px">' + esc(c.id) + '</code></div>';

    if (c.detail_tier === '概览') {
      html += '<div class="evidence">概览级线索卡：公开细节不足以支撑完整分析，以下信息仅供参考。</div>';
    }

    html += block('痛点', '<p>' + esc(c.problem) + '</p>' +
      '<div class="tagrow">' + (c.pain_points || []).map(function (p) { return '<span class="tag">' + esc(pains[p] || p) + '</span>'; }).join('') + '</div>');

    html += block('方案', '<p>' + esc(c.solution) + '</p>');
    html += block('人机分工', '<p>' + esc(c.human) + '</p>');
    html += block('结果与效果', '<p>' + esc(c.result) + '</p>');

    if (c.detail_tier === 'S' && c.decision_info) {
      var d = c.decision_info;
      html += block('决策五问', '<div class="five-grid">' +
        cell('① 投入多大', d.effort) + cell('② 周期多长', d.duration) +
        cell('③ 前提条件', d.prerequisites) + cell('④ 失败点', d.failure_modes) +
        cell('⑤ 可复制性', d.transferability) + '</div>');
    }

    if (c.fde_actions && c.fde_actions.length) {
      html += block('FDE 关键动作', '<ul class="plain">' + c.fde_actions.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>');
    }

    if (c.dimensions) {
      html += block('五维分析', '<table class="dimtable">' +
        [1, 2, 3, 4, 5].map(function (i) {
          var k = dimKey['d' + i], name = DIM_NAMES[k], v = dims[k];
          return '<tr><td>' + name + '</td><td>' + (v ? esc(DIM_LABELS[k][v] || v) : '—') + '</td></tr>';
        }).join('') + '</table>');
    }

    if (c.pattern_links && c.pattern_links.length) {
      html += block('关联模式', '<div class="tagrow">' + c.pattern_links.map(function (p) {
        return pm[p] ? '<a class="tag pattern" href="#/pattern/' + esc(p) + '">' + esc(pm[p].name) + '</a>' : '';
      }).join('') + '</div>');
    }

    html += '<div class="evidence">证据口径：' + esc(c.evidence_note || '未标注') + '</div>';
    html += '<div class="block"><div class="srcline"><b>来源</b>：' + esc(c.source || '—') + '</div>' +
      '<div class="srcline" style="margin-top:6px"><a href="' + esc(c.url) + '" target="_blank" rel="noopener">查看原始来源 ↗</a></div></div>';

    app.innerHTML = html;

    function block(title, inner) { return '<div class="block"><h2>' + title + '</h2>' + inner + '</div>'; }
    function cell(b, v) { return '<div class="cell"><b>' + b + '</b><div>' + esc(v || '—') + '</div></div>'; }
  }

  /* ---------- 模式库 ---------- */
  function renderPatterns() {
    app.innerHTML = '<h1 class="section-title" style="margin-top:8px">FDE 落地模式库</h1>' +
      '<p style="color:var(--ink-2);margin-bottom:18px;max-width:680px">从 63 个案例的交付动作中抽象出的 5 个模式。模式回答「这类落地怎么做成」，案例回答「具体谁做、花了多大代价」。每个模式附适用信号、落地动作与反模式。</p>' +
      '<div class="pattern-grid">' + state.patterns.map(function (p) {
        return '<a class="pattern-card" href="#/pattern/' + esc(p.id) + '">' +
          '<div class="pid">' + esc(p.id) + '</div><h3>' + esc(p.name) + '</h3>' +
          '<p>' + esc(p.summary) + '</p>' +
          '<div class="refcount">' + (p.case_refs || []).length + ' 条佐证案例 →</div></a>';
      }).join('') + '</div>';
  }

  function renderPattern(id) {
    var p = state.patterns.find(function (x) { return x.id === id; });
    if (!p) { app.innerHTML = '<div class="block">模式不存在：<code>' + esc(id) + '</code></div>'; return; }
    var list = (p.case_refs || []).map(function (rid) {
      return state.cases.find(function (c) { return c.id === rid; });
    }).filter(Boolean);
    app.innerHTML = '<a class="backlink" href="#/patterns">← 返回模式库</a>' +
      '<div class="detail-head"><h1>' + esc(p.name) + '</h1><span class="detail-meta" style="margin:0"><code>' + esc(p.id) + '</code></span></div>' +
      block2('定义', '<p>' + esc(p.definition || p.summary) + '</p>') +
      block2('适用信号', '<ul class="plain">' + p.signals.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>') +
      block2('落地动作', '<ul class="plain">' + p.actions.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>') +
      block2('反模式（什么情况会失败）', '<ul class="plain anti">' + p.anti_patterns.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>') +
      block2('佐证案例（' + list.length + '）', '<div class="case-list">' + list.map(function (c) {
        return '<a class="case-card" href="#/case/' + esc(c.id) + '"><div class="head"><span class="co">' + esc(c.company) + '</span>' +
          '<span class="badge ' + TIER_CLASS[c.detail_tier] + '">' + TIER_LABEL[c.detail_tier] + '</span></div>' +
          '<div class="result-line">' + esc(c.scenario) + '</div></a>';
      }).join('') + '</div>');
    function block2(t, inner) { return '<div class="block"><h2>' + t + '</h2>' + inner + '</div>'; }
  }

  /* ---------- 数据洞察 ---------- */
  function renderStats() {
    var charts = [
      { key: 'knowledge', title: 'D3 知识来源：AI 靠什么知识干活' },
      { key: 'human_ai', title: 'D2 人机分工' },
      { key: 'entry', title: 'D1 切入逻辑' },
      { key: 'validation', title: 'D4 验证方式' },
      { key: 'diffusion', title: 'D5 扩散方式' }
    ];
    var html = '<h1 class="section-title" style="margin-top:8px">数据洞察</h1>' +
      '<p style="color:var(--ink-2);margin-bottom:22px;max-width:680px">63 条案例的五维分布。样本不是随机抽样，是按「对决策有参考价值」选取的，分布反映的是行业现状而非统计规律。</p>';
    charts.forEach(function (ch) {
      var counts = {};
      state.cases.forEach(function (c) {
        var v = c.dimensions ? c.dimensions[ch.key] : null;
        if (v) counts[v] = (counts[v] || 0) + 1;
      });
      var entries = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
      var max = entries.length ? counts[entries[0]] : 1;
      html += '<div class="chart-block block"><h3>' + esc(ch.title) + '</h3>' +
        entries.map(function (k) {
          return '<div class="bar-row"><span class="lbl">' + esc(DIM_LABELS[ch.key][k] || k) + '</span>' +
            '<span class="bar" style="width:' + Math.round(counts[k] / max * 320) + 'px"></span>' +
            '<span class="val">' + counts[k] + ' 条</span></div>';
        }).join('') + '</div>';
    });
    html += '<div class="note">「未验证」指效果数字仅有来源方自述、无可核对基线的案例——数字本身已计入，不回避。</div>';
    app.innerHTML = html;
  }

  /* ---------- 关于 ---------- */
  function renderAbout() {
    app.innerHTML = '<h1 class="section-title" style="margin-top:8px">关于这个库</h1><div class="block about">' +
      '<p><b>定位</b>：企业 AI 落地案例库 + FDE（Forward Deployed Engineer，驻场交付工程师）模式库。服务对象是考虑引入 AI 的中小企业决策者，和做 AI 交付的人。</p>' +
      '<p><b>数据原则</b>：全部案例从公开来源一手提取，逐条留存原文存档（data/raw/），逐条标注证据口径（公开事实 / 来源方披露 / 编辑分析）。国内案例的效果数字绝大多数为来源方自述，本库不回避这一点，用「未验证」标记明示。</p>' +
      '<p><b>收录标准</b>：S 级（细节足以回答决策五问）/ 标准级（五问有缺项）/ 概览级（线索卡）。后两档同样收录，因为对检索和模式抽象仍有价值。</p>' +
      '<p><b>分析方法</b>：每条案例打标五个维度（切入逻辑 / 人机分工 / 知识来源 / 验证方式 / 扩散方式），再从中抽象 5 个可复用的落地模式。维度回答「怎么分析」，模式回答「怎么做成」。</p>' +
      '<p><b>维护者</b>：墨予镜。仓库与数据开源在 <a href="https://github.com/MindSyncHub/ai-landing-cases" target="_blank" rel="noopener">GitHub</a>，欢迎提 Issue 补充案例或勘误。</p>' +
      '</div>';
  }

  /* ---------- 启动 ---------- */
  Promise.all([
    fetch('data/cases.json').then(function (r) { return r.json(); }),
    fetch('data/patterns.json').then(function (r) { return r.json(); }),
    fetch('data/pain-points.json').then(function (r) { return r.json(); })
  ]).then(function (arr) {
    state.cases = arr[0];
    state.patterns = arr[1];
    state.painPoints = arr[2].tags || [];
    state.loaded = true;
    route();
  }).catch(function (e) {
    app.innerHTML = '<div class="block">数据加载失败（需要通过 HTTP 访问，不能直接打开文件）：' + esc(e.message) + '</div>';
  });

  window.addEventListener('hashchange', route);
})();
