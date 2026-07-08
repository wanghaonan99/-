/**
 * 苏州古典园林 — AI 游览指南引擎
 * 数据来源：搜狐旅游、携程攻略、知乎、百度经验、大众点评等真实游记
 */

(function () {
  'use strict';

  // ============ 各园林攻略数据（网络搜索聚合） ============
  var GUIDE_DATA = {

    'zhuozhengyuan': {
      name: '拙政园',
      route: '推荐路线：入口 → 兰雪堂 → 芙蓉榭 → 远香堂（核心，借景北寺塔）→ 小飞虹（唯一廊桥）→ 卅六鸳鸯馆 → 十八曼陀罗花馆 → 留听阁 → 倒影楼 → 出园',
      highlights: '远香堂（借景典范，纳千顷汪洋）、小飞虹（苏州园林唯一廊桥，框架构图拍照）、卅六鸳鸯馆（一厅两殿建筑形式，精美玻璃窗）',
      duration: '建议 2.5–3 小时',
      tips: '务必早到！最好 7:30 开园即入，上午光线柔和人少；提前 3–7 天在微信公众号「苏州园林旅游」预约购票；出口步行 5 分钟即苏州博物馆（贝聿铭设计）和平江路历史街区',
      ticket: '旺季 80 元 / 淡季 70 元',
      transport: '地铁 4 号线「北寺塔站」步行约 10 分钟',
      nearby: '苏州博物馆、平江路、狮子林（步行 10 分钟）',
      source: '搜狐旅游 2026.3 | 网易 2026.3'
    },

    'liuyuan': {
      name: '留园',
      route: '推荐路线：入口长廊（欲扬先抑）→ 曲溪楼 → 西楼 → 五峰仙馆（楠木殿）→ 揖峰轩 → 林泉耆硕之馆 → 冠云峰（镇园之宝）→ 冠云楼 → 又一村 → 出园',
      highlights: '冠云峰（太湖石之冠，瘦皱漏透四绝）、楠木殿（精美室内装饰）、入口长廊空间序列（从狭窄到豁然开朗的魔术）、石林小院（小中见大）',
      duration: '建议 1.5–2 小时',
      tips: '建议下午 3 点后游览以避开旅游团；留园面积不及拙政园但布局更紧凑精巧，一步一景，适合慢下来细品花窗纹样和木雕；冠云峰周边适合拍人像',
      ticket: '旺季 55 元 / 淡季 45 元',
      transport: '地铁 2 号线「石路站」或「山塘街站」步行约 10 分钟',
      nearby: '山塘街、寒山寺、西园寺',
      source: '搜狐旅游 2026.3 | 百度经验 2026.1'
    },

    'shizilin': {
      name: '狮子林',
      route: '推荐路线：门厅 → 燕誉堂（主厅，花窗铺地）→ 小方厅 → 九狮峰 → 假山迷宫（核心体验）→ 真趣亭（乾隆御笔）→ 湖心亭 → 问梅阁 → 扇亭 → 出园',
      highlights: '假山迷宫（太湖石堆砌，9 条路线 21 个洞口，乾隆六下江南必玩）、燕誉堂（精美花窗）、真趣亭（乾隆题名）、湖心亭倒影',
      duration: '建议 1.5–2 小时（亲子家庭可预留 3 小时玩假山）',
      tips: '距拙政园步行仅 10 分钟，可串联游览；玩假山穿运动鞋、注意安全，老人小孩选择性游览；乾隆曾在此题「真有趣」后改为「真趣」，趣味十足',
      ticket: '旺季 40 元 / 淡季 30 元',
      transport: '地铁 4 号线「北寺塔站」步行约 8 分钟',
      nearby: '拙政园、苏州博物馆、平江路',
      source: '知乎 2025.11 | 搜狐 2026.3 | 大众点评'
    },

    'canglangting': {
      name: '沧浪亭',
      route: '推荐路线：入口 → 复廊（108 式花窗）→ 面水轩 → 观鱼处 → 沧浪亭（山顶）→ 明道堂 → 看山楼 → 翠玲珑（竹主题）→ 出园',
      highlights: '复廊漏窗（108 式无一重复，借景园外河水）、沧浪亭（高踞山顶，苏州最古园林标志）、翠玲珑（遍植翠竹，宋代文人气质）、面水轩（临水而坐）',
      duration: '建议 1–1.5 小时',
      tips: '最古老的苏州园林，疏朗古朴，游客密度低；对面可园可顺路一看；建筑不多树木参天，适合安静发呆；门票性价比极高',
      ticket: '旺季 20 元 / 淡季 15 元',
      transport: '地铁 4 号线「三元坊站」步行约 5 分钟',
      nearby: '可园（隔水相望）、网师园（步行 10 分钟）、十全街美食',
      source: '百度经验 2026.1 | 搜狐 2026.3 | 携程攻略'
    },

    'wangshiyuan': {
      name: '网师园',
      route: '推荐路线：大门 → 轿厅 → 万卷堂 → 撷秀楼 → 彩霞池环湖 → 月到风来亭（最佳倒影）→ 濯缨水阁 → 殿春簃（张大千画室）→ 梯云室 → 竹外一枝轩 → 露华馆 → 出园',
      highlights: '彩霞池（以水为中心，以小见大典范）、月到风来亭（亭台倒影绝美）、殿春簃（明代书斋庭院，张大千兄弟画室）、梯云室（二乔玉兰春季盛放）',
      duration: '建议 1.5–2 小时',
      tips: '日间票无需预约但旺季建议提前买；夜花园（4–10 月开放）每晚限 20 场每场 45 人，需提前公众号预约，含评弹昆曲表演，禁用闪光灯；拍摄玉兰建议 7:30 前排队',
      ticket: '日场 30–40 元 / 夜游 100–120 元（含表演）',
      transport: '地铁 5 号线「南园北路站」或地铁 4 号线「三元坊站」步行约 10 分钟',
      nearby: '沧浪亭（步行 10 分钟）、十全街、葑门横街（苏州地道美食）',
      source: '携程攻略 2025.5 | 百度 2026.5 | 大众点评'
    },

    'ouyuan': {
      name: '耦园',
      route: '推荐路线：入口 → 载酒堂 → 东花园 → 黄石假山 → 城曲草堂 → 吾爱亭（佳偶天成）→ 山水间 → 西花园 → 织帘老屋 → 出园',
      highlights: '吾爱亭（夫妇弹琴赏月，苏州唯一爱情主题园林）、东花园黄石假山（堆叠精湛）、山水间（水榭连廊）、西花园小巧精致',
      duration: '建议 1–1.5 小时',
      tips: '位置稍偏但旅行团少，氛围清静；东西两园住宅居中格局独树一帜；适合情侣/夫妻游览，感受「耦」=「偶」的美好寓意；靠近东园和平江路北段',
      ticket: '旺季 25 元 / 淡季 20 元',
      transport: '地铁 1 号线「相门站」步行约 10 分钟',
      nearby: '东园、平江路北段、相门城墙',
      source: '搜狐 2026.3 | 百度经验 2025.2'
    },

    'yipu': {
      name: '艺圃',
      route: '推荐路线：穿过文衙弄菜市场 → 园门 → 世纶堂 → 博雅堂 → 延光阁（水榭茶室）→ 渡香桥 → 乳鱼亭 → 响月廊 → 浴鸥小院 → 出园',
      highlights: '延光阁（苏州园林最大水榭，15 元一杯碧螺春享半日清闲）、乳鱼亭（明代遗构）、浴鸥小院（园中园的极致）、响月廊（框景绝佳）',
      duration: '建议 45 分钟–1 小时（喝茶可无限延）',
      tips: '藏在老城区深巷中，穿过菜市场找到园门的「大隐隐于市」体验独一无二；工作日上午最安静，多为本地老茶客；门票仅 10 元性价比极高',
      ticket: '10 元',
      transport: '地铁 2 号线「石路站」步行约 15 分钟，老城区建议步行或骑行',
      nearby: '环秀山庄（步行约 15 分钟）、阊门、山塘街',
      source: '搜狐 2026.3 | 大众点评'
    },

    'tuisi': {
      name: '退思园',
      route: '推荐路线：同里古镇入口 → 退思园正门 → 轿厅 → 茶厅 → 坐春望月楼 → 退思草堂 → 闹红一舸（石舫）→ 菰雨生凉轩 → 辛台 → 天桥 → 出园',
      highlights: '闹红一舸（石舫船身入水，波荡时有舟行之趣）、退思草堂（全园主体建筑）、天桥（贴水连廊）、菰雨生凉轩（夏日避暑极佳）',
      duration: '建议 1.5–2 小时',
      tips: '不在主城区，在吴江同里古镇内，需地铁 4 号线到同里站后换乘公交/打车；买同里古镇通票（约 100 元）即可入园；上午 9 点前到避开旅行团大军；可顺便逛同里古镇吃水乡菜',
      ticket: '含于同里古镇通票（约 100 元）',
      transport: '地铁 4 号线「同里站」换乘公交或打车约 15 分钟',
      nearby: '同里古镇、周庄、锦溪古镇',
      source: '搜狐 2026.3 | 携程攻略'
    },

    'huanxiu': {
      name: '环秀山庄',
      route: '推荐路线：入口 → 谷棠轩 → 四面厅 → 湖石假山（核心，戈裕良巅峰）→ 问泉亭 → 补秋舫 → 半潭秋水一房山 → 出园',
      highlights: '湖石假山（清代叠石名家戈裕良代表作，苏州湖石假山第一，咫尺之间营造千岩万壑）、问泉亭（假山中的休憩点）、补秋舫（临水建筑）',
      duration: '建议 40 分钟–1 小时',
      tips: '苏州最小世界遗产，几乎无旅游团，来的多是园林研究者和深度爱好者；精髓全在那座假山，需放慢脚步沿山径上下探索；与艺圃步行约 15 分钟，建议串联游览',
      ticket: '15 元',
      transport: '地铁 1 号线「养育巷站」步行约 10 分钟',
      nearby: '艺圃（步行约 15 分钟）、观前街、怡园',
      source: '搜狐 2026.3 | 头条 2025.6'
    }
  };

  GUIDE_DATA.zhuozheng = GUIDE_DATA.zhuozhengyuan;
  GUIDE_DATA.shizi = GUIDE_DATA.shizilin;
  GUIDE_DATA.canglang = GUIDE_DATA.canglangting;
  GUIDE_DATA.wangshi = GUIDE_DATA.wangshiyuan;

  var ZHIPU_API_BASE = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  // ============ LLM 生成游览指南 ============
  async function generateGuideLLM(gardenId, gardenName, model, apiKey, customPrompt) {
    var data = GUIDE_DATA[gardenId];
    if (!data) throw new Error('未找到该园林的攻略数据');

    var context = [
      '## 网络游记精华摘要（以下信息来自真实游客攻略，请在此基础上生成）',
      '推荐路线：' + data.route,
      '精华看点：' + data.highlights,
      '建议游览时长：' + data.duration,
      '实用贴士：' + data.tips,
      '门票信息：' + data.ticket,
      '交通方式：' + data.transport,
      '周边推荐：' + data.nearby,
      '信息来源：' + data.source
    ].join('\n\n');

    var systemPrompt = '你是一位经验丰富的苏州旅游规划师，擅长撰写实用、有温度的古典园林游览指南。';

    var userPrompt = '请根据以下网络游记精华摘要，为苏州园林「' + gardenName + '」撰写一份游览指南。\n\n' +
      '要求：\n' +
      '1. 分为以下几个板块：📋 推荐路线、✨ 精华看点、⏱️ 建议时长、💡 实用贴士、🚇 交通指引、📍 周边推荐\n' +
      '2. 内容基于提供的真实游记信息，可适当润色但不可编造事实\n' +
      '3. 语言亲切有人情味，像朋友分享攻略的语气，不要太正式\n' +
      '4. 每个板块用简洁的自然段落表达，不要使用列表符号';

    // 如果有用户自定义需求，追加到 prompt
    if (customPrompt && customPrompt.trim()) {
      userPrompt += '\n5. 用户有以下特别需求，请在指南中有针对性地回答：' + customPrompt.trim() +
        '\n   例如需求中提到拍照位置，则在精华看点板块标注最佳拍照机位；' +
        '提到带老人则路线建议放慢节奏、注明无障碍情况；' +
        '提到一日游则整合周边景点做串联建议。';
    } else {
      userPrompt += '\n5. 总字数控制在 400–600 字';
    }

    userPrompt += '\n\n' + context;

    var response = await fetch(ZHIPU_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      var errData = await response.json().catch(function () { return {}; });
      var errMsg = errData.error ? errData.error.message : ('HTTP ' + response.status);
      if (response.status === 401) throw new Error('API Key 无效，请检查后重试');
      if (response.status === 429) throw new Error('请求过于频繁，请稍后再试');
      throw new Error('API 调用失败：' + errMsg);
    }

    var data_resp = await response.json();
    var content = data_resp.choices && data_resp.choices[0] && data_resp.choices[0].message
      ? data_resp.choices[0].message.content
      : '';

    if (!content.trim()) throw new Error('AI 未生成有效内容，请重试');

    // 解析为结构化数据
    return parseGuideContent(content, gardenName, data);
  }

  // ============ 本地引擎生成 ============
  function generateGuideLocal(gardenId, gardenName, customPrompt) {
    var data = GUIDE_DATA[gardenId];
    if (!data) throw new Error('未找到该园林的攻略数据');

    // 模拟网络搜索延迟
    return new Promise(function (resolve) {
      setTimeout(function () {
        var result = parseGuideContent(buildLocalGuide(data, gardenName, customPrompt), gardenName, data);
        result.fromLLM = false;
        resolve(result);
      }, 800 + Math.random() * 800);
    });
  }

  function buildLocalGuide(data, gardenName, customPrompt) {
    var prompt = (customPrompt || '').trim();
    var tailored = prompt ? buildTailoredAdvice(data, gardenName, prompt) : null;

    var guide = '📋 推荐路线\n' + data.route + '\n\n' +
      '✨ 精华看点\n' + data.highlights + '\n\n' +
      '⏱️ 建议时长\n' + data.duration;

    if (tailored) {
      guide += '\n\n🎯 针对需求\n' + tailored.focus +
        '\n\n🧭 调整后的走法\n' + tailored.route +
        '\n\n💡 实用贴士\n' + tailored.tips;
    } else {
      guide += '\n\n💡 实用贴士\n' + data.tips;
    }

    guide += '\n\n🚇 交通指引\n门票：' + data.ticket + ' | ' + data.transport + '\n\n' +
      '📍 周边推荐\n' + data.nearby;

    return guide;
  }

  function buildTailoredAdvice(data, gardenName, prompt) {
    var p = prompt.toLowerCase();
    var highlights = data.highlights.split('、');
    var first = highlights[0] || '核心景区';
    var second = highlights[1] || '临水建筑';
    var third = highlights[2] || '主要厅堂';

    function baseFocus(type) {
      return '你提出的是「' + prompt + '」。以下建议会优先围绕' + type + '重排路线，而不是只复述通用攻略。';
    }

    if (/拍|摄影|照片|机位|打卡|窗景|水面|亭榭|倒影/.test(prompt)) {
      return {
        focus: baseFocus('取景、光线和画面层次'),
        route: '建议先看最有辨识度的「' + first + '」，再到「' + second + '」寻找水面或廊桥倒影，最后在「' + third + '」附近拍门洞、花窗、亭榭与树影的层次。若园中有假山或水池，不要只拍全景，可退后一步把粉墙、树影和水面一起纳入画面。',
        tips: '拍摄时间建议选开园后 1 小时内或闭园前 1.5 小时，光线更斜，水面反光和树影更柔。遇到人多时，不要站在主通道正中等待空景，可以沿廊边、池岸转角或门洞侧面取框景；拍水面时把相机压低，倒影会比平视更有园林的“虚实相生”。'
      };
    }

    if (/老人|长者|父母|腿脚|无障碍|少走|不累|休息/.test(prompt)) {
      return {
        focus: baseFocus('少走回头路、减少台阶和保留休息点'),
        route: '建议采用“入口 → 主厅堂 → 临水核心景区 → 就近折返”的轻量路线，把「' + first + '」和「' + second + '」作为重点，假山、洞壑或较窄曲径只远观，不强行穿行。总时长控制在 60–90 分钟更舒适。',
        tips: '尽量避开正午和旅行团高峰，选择上午开园后或下午较晚时段。路线中每看到厅堂、廊下或临水平台就安排短暂停留；若园林以假山著称，老人可在山脚、亭边看整体气势，不建议走湿滑、狭窄或上下起伏明显的石径。'
      };
    }

    if (/2 小时|两小时|一小时|半日|时间不多|精华|不绕路/.test(prompt)) {
      return {
        focus: baseFocus('压缩时间、保留最有代表性的空间体验'),
        route: '把游览压缩为三段：先看「' + first + '」建立第一印象，再看「' + second + '」理解这座园最核心的造园手法，最后用「' + third + '」收束。不要逐个打卡所有景点，宁可在核心区域多停 10 分钟。',
        tips: '2 小时内建议放弃边缘小景和重复路径。进入园林后先确认出口方向，按单向动线走；如果现场人多，就把拍照放到第二优先级，先完成主景观看。'
      };
    }

    if (/孩子|亲子|小朋友|儿童|讲解|学生/.test(prompt)) {
      return {
        focus: baseFocus('让孩子理解“为什么这座园有趣”'),
        route: '可以把路线讲成一个故事：先在「' + first + '」找“园林的主角”，再到「' + second + '」观察水、石、桥或窗如何改变视线，最后到「' + third + '」让孩子说出自己看到的“藏起来的风景”。',
        tips: '讲解时少背年代，多问问题：哪里像山？哪里像画框？为什么路不修成直线？如果是假山园林，要提醒安全；如果是水景园林，可让孩子比较真实建筑和水中倒影的不同。'
      };
    }

    if (/一日游|一天|周边|串联|路线/.test(prompt)) {
      return {
        focus: baseFocus('与周边景点串联'),
        route: '这座园林本身可按通用路线游览，之后优先串联：' + data.nearby + '。建议把园林安排在上午或下午较晚，周边街区、博物馆或古镇放在中午和傍晚。',
        tips: '同一天不要安排过多相似园林。若已看过大园，可把这座园当作“精读”；若还没看过代表性园林，建议与附近最典型的一座互补搭配。交通上参考：' + data.transport + '。'
      };
    }

    return {
      focus: baseFocus('你的个性化关注点'),
      route: '建议仍以「' + first + '」为核心入口，再根据你的需求在「' + second + '」和「' + third + '」之间增加停留。不要平均分配时间，把最符合需求的场景多看、多拍、多停。',
      tips: '你的需求是「' + prompt + '」，因此游览时应主动取舍：与需求无关的小景可以快速经过，真正相关的主景则至少停留 10–15 分钟，观察光线、动线、人流和可休息位置。'
    };
  }

  // ============ 解析指南内容 ============
  function parseGuideContent(text, gardenName, data) {
    var sections = [];
    var sectionNames = ['📋 推荐路线', '✨ 精华看点', '⏱️ 建议时长', '🎯 针对需求', '🧭 调整后的走法', '💡 实用贴士', '🚇 交通指引', '📍 周边推荐', '🎫 门票信息'];
    var sectionIcons = { '推荐路线': '📋', '精华看点': '✨', '建议时长': '⏱️', '针对需求': '🎯', '调整后的走法': '🧭', '实用贴士': '💡', '交通指引': '🚇', '周边推荐': '📍', '门票信息': '🎫' };

    // 尝试按板块分割
    var foundSections = [];
    var remaining = text;

    // 先尝试匹配 emoji 标题
    var emojiPattern = /(?:^|\n)([📋✨⏱🎯🧭💡🚇📍🎫]\s*[^\n]{2,20})(?:\n|$)/g;
    var matches = [];
    var match;
    while ((match = emojiPattern.exec(text)) !== null) {
      matches.push({ title: match[1].trim(), index: match.index });
    }

    if (matches.length >= 2) {
      for (var i = 0; i < matches.length; i++) {
        var startIdx = matches[i].index;
        var endIdx = i + 1 < matches.length ? matches[i + 1].index : text.length;
        var body = text.substring(startIdx, endIdx).replace(matches[i].title, '').trim();
        foundSections.push({ title: matches[i].title, body: body.replace(/^\n+/, '').trim() });
      }
    } else {
      // 按双换行分段落
      var paragraphs = text.split(/\n\n+/).filter(function (p) { return p.trim(); });
      if (paragraphs.length >= 4) {
        var labels = ['推荐路线', '精华看点', '建议时长', '实用贴士', '交通指引', '周边推荐'];
        for (var j = 0; j < paragraphs.length && j < labels.length; j++) {
          var icon = sectionIcons[labels[j]] || '📍';
          foundSections.push({ title: icon + ' ' + labels[j], body: paragraphs[j].replace(/^[📋✨⏱💡🚇📍🎫]\s*\S+\s*/, '').trim() });
        }
      } else {
        // 整段展示
        foundSections = [{ title: '📋 游览指南', body: text }];
      }
    }

    // 添加数据来源
    foundSections.push({
      title: '📚 信息来源',
      body: '本次指南基于以下真实游记帖生成：' + data.source
    });

    return {
      gardenName: gardenName,
      sections: foundSections,
      fromLLM: true,
      source: data.source
    };
  }

  // ============ 导出接口 ============
  window.TravelGuide = {
    generateLocal: generateGuideLocal,
    generateLLM: generateGuideLLM,
    getData: function (id) { return GUIDE_DATA[id]; }
  };

})();
