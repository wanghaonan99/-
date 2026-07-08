/**
 * 苏州古典园林 — AI 诗词助手
 * 基于模板+词库的智能诗歌生成引擎，支持多诗体
 */

(function () {
  'use strict';

  // ============ 词库 ============
  const W = {
    // 园林特征词（按园林 id 映射相关意象）
    gardenThemes: {
      zhuozhengyuan: ['远香','荷风','水廊','鸳鸯','玲珑','枇杷','芙蓉','柳荫','玉兰堂','见山'],
      liuyuan:       ['涵碧','奇石','冠云','曲溪','五峰','闻木','荷香','回廊','青枫','竹影'],
      shizilin:      ['怪石','奇峰','湖石','洞壑','玲珑','九曲','问梅','修竹','石舫','幽深'],
      canglangting:  ['沧浪','清风','明月','古木','明道','看山','翠竹','藕花','水轩'],
      wangshiyuan:   ['彩霞','殿春','濯缨','月到','风来','小山','丛桂','引静','云岗','松涛'],
      ouyuan:        ['织帘','山水','城曲','双照','黄石','吾爱','魁星','琴瑟','归隐'],
      yipu:          ['博雅','乳鱼','芹庐','响月','朝爽','浴鸥','渡香','明风','素朴'],
      tuisi:         ['退思','菰雨','眠云','闹红','岁寒','坐春','桂花','水香','同里'],
      huanxiu:       ['环秀','飞雪','半潭','秋水','房山','问泉','补秋','峭壁','峰峦']
    },
    // 名词（景物）
    nouns: ['碧水','青山','翠竹','寒梅','垂柳','白鹭','黄鹂','孤舟','长亭','石径',
            '飞檐','雕栏','荷塘','石桥','回廊','曲径','轩窗','高阁','远峰','烟岚',
            '松涛','竹影','花影','月影','云影','波光','霞光','晨雾','夕照','清风',
            '明月','疏钟','古木','苔痕','落花','流水','寒潭','幽谷','叠石','洞天'],
    // 动词
    verbs: ['拂','照','映','浮','笼','绕','度','倚','望','听',
            '过','入','出','落','起','散','收','转','回','归',
            '横','斜','垂','悬','掩','透','侵','漫','凝','漾'],
    // 形容词
    adjs:  ['翠','碧','清','幽','深','静','远','淡','寒','暖',
            '空','净','闲','雅','古','秀','奇','绝','苍','润',
            '明','暗','浓','薄','冷','香','疏','密','曲','直'],
    // 季节词
    seasons: {
      spring: ['春','暖','花','新','嫩','苏','萌'],
      summer: ['夏','暑','荷','蝉','荫','凉','绿'],
      autumn: ['秋','爽','菊','枫','霜','寒','黄'],
      winter: ['冬','雪','梅','冰','枯','寂','白']
    },
    // 植物
    plants: ['松','竹','梅','柳','荷','菊','兰','桂','枫','桃',
             '杏','梨','海棠','芭蕉','梧桐','紫藤','凌霄','蔷薇','芙蓉','牡丹'],
    // 颜色
    colors: ['翠','碧','青','绿','白','素','丹','朱','赤','金',
             '银','玉','粉','嫩','苍','黛','墨','绛','紫','黄'],
    // 建筑
    buildings: ['亭','台','楼','阁','轩','榭','廊','舫','斋','堂',
                '馆','室','房','厅','院','园','圃','坞','庐','庵']
  };

  // ============ 押韵词典（简化平水韵） ============
  const RHYME_GROUPS = {
    'a':  ['花','家','涯','华','霞','沙','茶','画','下','涯','纱','槎'],
    'an': ['山','天','烟','园','前','边','然','年','弦','间','闲','轩','还','延','连','眠','泉'],
    'ang':['光','长','香','窗','凉','相','双','江','阳','上','旁','堂','廊','苍','茫','墙'],
    'eng':['声','明','清','庭','情','影','行','停','亭','静','平','晴','轻','宁'],
    'ou': ['楼','流','秋','舟','愁','游','久','旧','柳','透','幽','悠','收','浮','柔'],
    'ei': ['回','杯','谁','归','飞','微','对','醉','翠','水','随','垂','辉'],
    'en': ['人','尘','云','深','新','门','林','心','近','尽','临','阴','吟','音'],
    'ong':['空','风','中','红','宫','钟','弄','送','同','重','通','浓']
  };

  function pickRhyme(category) {
    const pool = RHYME_GROUPS[category] || RHYME_GROUPS['an'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function pickN(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  }

  // ============ 诗歌模板库 ============
  // 占位符说明:
  //   {G} = 园林名, {T} = 园林特征词
  //   {N} = 景物名词, {V} = 动词, {A} = 形容词
  //   {C} = 颜色词, {P} = 植物, {B} = 建筑
  //   {R} = 押韵字(由引擎根据韵部填充)

  const TEMPLATES = {
    // ---- 五言绝句 (4句×5字) ----
    wuyan_jueju: [
      // 写景
      ['{A}{N}深{V}{R1}','{G}前{V}{A}。','{V}得{C}{N}处','{A}{B}{V}{R1}。'],
      ['{G}中{C}色新','{P}影{VP}频。','{N}外{C}{N}远','{A}{B}独{V}{R1}。'],
      ['{A}风{V}{R1}','{P}落{N}前。','{G}外{N}{V}{A}','{B}深人{V}{R1}。'],
      ['{C}{N}{V}{A}天','{G}中{A}似烟。','{P}间{C}{N}起','{V}步{A}{B}{R1}。'],
      ['{G}前{A}{P}{N}','{C}影上{N}来。','{A}径通{B}处','{VP}自{VP}{R1}。'],
      ['曲径通幽处','禅房花木深','山光悦鸟性','潭影空人心'],  // 经典引用（常建）
      // 抒情
      ['{G}里{A}如许','{N}前独{V}{R1}。','{A}知{C}{P}意','{VP}{A}自{R1}。'],
      ['{A}{B}临{N}立','{C}{P}映日{R1}。','{G}中多{A}事','都付{V}{N}{R1}。'],
    ],
    // ---- 七言绝句 (4句×7字) ----
    qiyan_jueju: [
      ['{G}山水画图中','{C}{N}{A}{N}{A}风。','{P}影{N}光{VP}处','{B}前{A}客{VP}{R1}。'],
      ['{A}径{VP}入{G}深','{C}{N}{A}处有{N}。','{VP}{N}光{VP}态','{B}前{N}落{VP}{R1}。'],
      ['{G}{A}色{VP}人行','{C}{P}{A}{N}{VP}明。','{A}得{N}间{VP}味','{B}深{VP}听水声。'],
      ['{C}{N}掩映{G}中','{A}{P}{VP}{N}几重。','{B}外{N}来{VP}{A}','{VP}得{N}光{VP}{R1}。'],
      ['{N}光{N}影入{G}','{C}{P}{A}处{VP}香。','{VP}{N}{VP}寻旧迹','{B}前独倚看{N}。'],
      ['{G}烟雨{VP}空濛','{P}影{N}光{VP}不同。','最是{A}{N}{VP}处','{B}深{VP}有{N}。'],
      // 咏园林特色
      ['{G}胜景{VP}收','{C}{N}{A}{N}{VP}流。','{P}径{VP}通{B}处','{N}光{VP}照{N}。'],
      ['{A}{N}{A}{N}绕{G}','{VP}{B}前{N}几行。','{VP}得{N}中{A}味','不辞{VP}作{N}。'],
    ],
    // ---- 五言律诗 (8句×5字) ----
    wuyan_lvshi: [
      ['{G}前{A}{N}新','{P}落{VP}频。','{C}{N}通{B}远','{A}径入{N}。',
       '{VP}{N}光{VP}态','{N}前{N}影真。','{A}知{B}中客','亦是{A}{N}人。'],
      ['{A}{N}临{G}立','{VP}{N}入{N}来。','{C}{P}映{B}色','{A}{N}照{N}。',
       '{VP}步随{N}转','{N}心共{N}开。','{B}深人{VP}至','{A}有{N}相陪。'],
      ['{G}里{A}如许','{VP}来{N}自{R}。','{C}{N}浮{N}影','{A}{P}落{B}前。',
       '{VP}径通{B}处','{N}光映{N}天。','{A}言{A}意足','何必问{N}年。'],
    ],
    // ---- 七言律诗 (8句×7字) ----
    qiyan_lvshi: [
      ['{G}胜境{VP}人知','{C}{N}{A}{N}{VP}时。','{P}影{N}光{VP}态','{B}前{N}色{VP}姿。',
       '{VP}来{N}上{VP}{A}','{VP}得{N}中{VP}奇。','最是{A}{N}{VP}处','{B}深{VP}立多时。'],
      ['{A}{N}{A}{N}绕{G}','{C}{P}{A}处有{N}。','{VP}径{VP}通{B}远','{N}光{VP}入{N}。',
       '{VP}来{N}外{VP}{A}','{VP}得{B}前{VP}新。','{A}道{G}中{N}好','不辞{VP}作{N}人。'],
    ],
    // ---- 词·忆江南 ----
    yijiangnan: [
      ['{G}好','{A}景旧曾谙。','{C}{N}{A}{N}{VP}浪','{A}{P}{C}{P}{VP}烟。','能不忆{G}？'],
      ['{G}忆','最忆是{N}。','{P}影{N}光{VP}处','{B}前{N}落{VP}天。','何日更重游？'],
      ['{G}美','{A}{N}入画图。','{C}{N}掩映{A}{B}','{VP}步{N}间{VP}{N}。','{A}是{N}中客。'],
    ]
  };

  // ============ 模板填充 ============
  function fillWord(placeholder, ctx) {
    switch (placeholder) {
      case 'G':  return ctx.gardenName;
      case 'T':  return pick(ctx.themeWords);
      case 'N':  return pick(W.nouns);
      case 'V':  return pick(W.verbs);
      case 'A':  return pick(W.adjs);
      case 'C':  return pick(W.colors);
      case 'P':  return pick(W.plants);
      case 'B':  return pick(W.buildings);
      case 'VP': return pick([...W.verbs, ...W.adjs]); // 动词/形容词均可
      default:   return placeholder;
    }
  }

  function fillTemplate(line, ctx, rhymeMap) {
    // 先处理押韵占位符 {R1}, {R2}...
    let result = line.replace(/\{R(\d+)\}/g, (m, idx) => {
      return rhymeMap[idx] || '天';
    });
    // 再处理其他占位符
    result = result.replace(/\{([A-Z]+)\}/g, (m, key) => {
      return fillWord(key, ctx);
    });
    // 去除可能的多余字（处理经典引用行）
    return result;
  }

  // 各园林的文化主题描述（用于生成诗句时的语境）
  var GARDEN_CULTURE = {
    zhuozhengyuan: '拙政园以水为中心，取潘岳"拙者之为政"之意，园中远香堂可远借北寺塔之景，荷风四面亭、小飞虹廊桥、卅六鸳鸯馆皆为名景，全园疏朗开阔近乎自然，是明代文人园林的典范',
    liuyuan: '留园以建筑空间处理见长，入口长廊欲扬先抑豁然开朗，冠云峰为太湖石之冠具瘦皱漏透四绝，五峰仙馆为江南楠木厅之最，园中曲溪回廊移步换景，被誉为吴下名园之冠',
    shizilin: '狮子林以湖石假山独步江南，九条路线二十一个洞口宛若迷宫，乾隆六下江南必游此地并题"真趣"，燕誉堂花窗铺地精妙绝伦，园中怪石嶙峋如群狮起舞，是禅意与童趣并存的奇园',
    canglangting: '沧浪亭是苏州最古老的园林，北宋苏舜钦以四万钱购得，取《楚辞》"沧浪之水清兮"之意，园外借水成景，复廊一百零八式漏窗无一重复，翠玲珑遍植修竹，尽显宋代文人疏朗清雅之风',
    wangshiyuan: '网师园以水为中心小巧精雅，彩霞池为全园灵魂，月到风来亭可赏四季月色，殿春簃曾为张大千昆仲画室，引静桥为苏州最小石拱桥，园虽仅八亩却极具以小见大之妙，是苏州园林"小园极则"的代表',
    ouyuan: '耦园取"耦"即"佳偶"之意，为清末安徽巡抚沈秉成夫妇归隐之所，东园以黄石假山为中心雄浑苍劲，西园以湖石假山为特色玲珑精巧，城曲草堂与织帘老屋东西辉映，是中国唯一以爱情为主题的古典园林',
    yipu: '艺圃隐于姑苏深巷，是明代文人文震孟（文徵明曾孙）的私园，博雅堂面阔五间气势不凡，乳鱼亭为明代遗构，园中池水清澈假山绝壁苍古，延光阁为苏州园林中最大的水榭，被誉为"市井隐逸"的典范，游客稀少独享静谧',
    tuisi: '退思园位于同里古镇，园名取《左传》"进思尽忠，退思补过"之意，全园贴水而建为中国唯一一座贴水园建筑，退思草堂倒映水中如漂浮水面，闹红一舸为旱船造型，菰雨生凉轩临水而建清朗幽静',
    huanxiu: '环秀山庄以戈裕良叠山独步江南，半亩之地叠出千岩万壑之势，假山以"钩带法"堆砌自然天成，山中有洞壑有峭壁有飞梁有幽谷，陈从周先生誉之为"江南园林假山之冠"，虽占地仅一亩许却咫尺千岩气象万千'
  };

  // ============ 主生成函数 ============
  function generatePoem(gardenName, gardenId, style, customPrompt) {
    var polished = generatePolishedLocalPoem(gardenName, gardenId, style, customPrompt);
    if (polished) return polished;

    const templates = TEMPLATES[style];
    if (!templates) return { lines: [], error: '不支持的诗体' };

    const tpl = pick(templates);
    const themeWords = W.gardenThemes[gardenId] || ['园林','山水','亭台'];
    // 以园林文化内涵为主题，而非直接使用园名
    const cultureCtx = GARDEN_CULTURE[gardenId] || (gardenName + '，苏州古典园林，世界文化遗产');
    const ctx = { gardenName: gardenName, themeWords, cultureCtx: cultureCtx, customPrompt: customPrompt || '' };

    // 选择押韵韵部
    const rhymeCat = pick(Object.keys(RHYME_GROUPS));
    const rhymeMap = {};
    let rhymeCount = 0;
    tpl.forEach(line => {
      const matches = line.match(/\{R(\d+)\}/g);
      if (matches) {
        matches.forEach(m => {
          const num = m.match(/\d+/)[0];
          if (!rhymeMap[num]) {
            rhymeMap[num] = pickRhyme(rhymeCat);
            rhymeCount++;
          }
        });
      }
    });

    const lines = tpl.map(line => fillTemplate(line, ctx, rhymeMap));
    
    return {
      lines,
      gardenName,
      style,
      styleName: getStyleName(style),
      rhymeCategory: rhymeCat,
      theme: cultureCtx.substring(0, 30) + '…'
    };
  }

  function generatePolishedLocalPoem(gardenName, gardenId, style, customPrompt) {
    var scenes = {
      zhuozhengyuan: { a: '远香', b: '荷风', c: '小飞虹', d: '水云', title: '远香堂前' },
      liuyuan: { a: '冠云', b: '回廊', c: '漏窗', d: '庭深', title: '冠云峰下' },
      shizilin: { a: '怪石', b: '洞壑', c: '真趣', d: '松风', title: '狮林探石' },
      canglangting: { a: '沧浪', b: '花窗', c: '竹影', d: '清流', title: '沧浪听水' },
      wangshiyuan: { a: '彩霞', b: '风亭', c: '月影', d: '小桥', title: '月到风来' },
      ouyuan: { a: '城曲', b: '双园', c: '琴瑟', d: '归舟', title: '耦园归隐' },
      yipu: { a: '博雅', b: '乳鱼', c: '巷深', d: '池光', title: '艺圃清坐' },
      tuisi: { a: '退思', b: '菰雨', c: '水榭', d: '灯影', title: '退思临水' },
      huanxiu: { a: '环秀', b: '飞雪', c: '半潭', d: '千岩', title: '环秀观山' }
    };
    var s = scenes[gardenId] || { a: gardenName, b: '水石', c: '亭廊', d: '清阴', title: '园中即景' };
    var theme = customPrompt && customPrompt.trim() ? customPrompt.trim() : s.title;

    var banks = {
      wuyan_jueju: [
        s.a + '藏清影',
        s.b + '入晚风',
        '一径通幽处',
        '归心在画中'
      ],
      qiyan_jueju: [
        s.a + '深处见苔痕',
        s.b + '轻摇过短门',
        s.c + '收来山水意',
        '人行不觉到黄昏'
      ],
      wuyan_lvshi: [
        s.a + '含烟静',
        s.b + '带露新',
        '曲径分深浅',
        '虚窗纳近邻',
        s.c + '留客久',
        s.d + '照人亲',
        '咫尺乾坤里',
        '悠然见本真'
      ],
      qiyan_lvshi: [
        s.a + '深处石生云',
        s.b + '穿廊绿意分',
        '半壁粉墙留树影',
        '一池清水纳天文',
        s.c + '回看皆成画',
        s.d + '静听自无尘',
        '不是山林偏在远',
        '小园咫尺见精神'
      ],
      yijiangnan: [
        gardenName + '好',
        s.a + '最宜看',
        s.b + '轻摇临水榭',
        s.c + '深藏入画栏',
        '一坐忘尘喧'
      ]
    };

    if (!banks[style]) return null;
    return {
      lines: banks[style],
      gardenName: gardenName,
      style: style,
      styleName: getStyleName(style),
      theme: theme,
      fromLLM: false
    };
  }

  function getStyleName(style) {
    const names = {
      'wuyan_jueju': '五言绝句',
      'qiyan_jueju': '七言绝句',
      'wuyan_lvshi': '五言律诗',
      'qiyan_lvshi': '七言律诗',
      'yijiangnan':   '词·忆江南'
    };
    return names[style] || style;
  }

  // ============ LLM 模型定义 ============
  const LLM_MODELS = [
    { id: 'local',     name: '本地引擎',   desc: '模板+词库·离线可用', icon: '🏠' },
    { id: 'glm-4-flash', name: 'GLM-4-Flash', desc: '免费·快速响应', icon: '⚡' },
    { id: 'glm-4-air',   name: 'GLM-4-Air',   desc: '高性价比·均衡', icon: '🎯' },
    { id: 'glm-4',       name: 'GLM-4',       desc: '旗舰·质量最佳', icon: '🌟' }
  ];

  const ZHIPU_API_BASE = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  function expectedLineCount(style) {
    return { 'wuyan_jueju':4, 'qiyan_jueju':4, 'wuyan_lvshi':8, 'qiyan_lvshi':8, 'yijiangnan':5 }[style] || 4;
  }

  function expectedCharsPerLine(style) {
    return { 'wuyan_jueju':5, 'qiyan_jueju':7, 'wuyan_lvshi':5, 'qiyan_lvshi':7 }[style] || null;
  }

  function normalizePoetryLine(line) {
    return String(line || '')
      .replace(/^[\s\d一二三四五六七八九十、.．:：-]+/, '')
      .replace(/[，。！？；：,.!?;:]/g, '')
      .trim();
  }

  function parseLLMPoemContent(content, style, gardenName) {
    var expected = expectedLineCount(style);
    var title = '';

    try {
      var jsonText = content.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
      var parsed = JSON.parse(jsonText);
      if (parsed && Array.isArray(parsed.lines)) {
        title = String(parsed.title || parsed.poemTitle || '').replace(/^《|》$/g, '').trim();
        var jsonLines = parsed.lines.map(normalizePoetryLine).filter(Boolean);
        return {
          title: title || ('咏' + gardenName),
          lines: jsonLines.slice(0, expected)
        };
      }
    } catch (e) {
      // 回退到文本解析
    }

    var rawLines = content.trim().split('\n').map(function (line) {
      return line.trim();
    }).filter(Boolean).filter(function (line) {
      var skipPrefixes = ['注：','注:','说明','解析','赏析','翻译','备注','自检','检查','韵脚','平仄','以下'];
      return !skipPrefixes.some(function (p) { return line.startsWith(p); });
    });

    if (rawLines[0] && /诗题|题目|《.*》/.test(rawLines[0])) {
      title = rawLines[0].replace(/^诗题[:：]?/, '').replace(/^题目[:：]?/, '').replace(/[《》]/g, '').trim();
      rawLines = rawLines.slice(1);
    }

    var lines = rawLines.map(normalizePoetryLine).filter(Boolean);
    return {
      title: title || ('咏' + gardenName),
      lines: lines.slice(0, expected)
    };
  }

  function validatePoemLines(lines, style) {
    var expected = expectedLineCount(style);
    var chars = expectedCharsPerLine(style);
    if (!Array.isArray(lines) || lines.length !== expected) {
      return false;
    }
    if (!chars) return true;
    return lines.every(function (line) {
      return normalizePoetryLine(line).length === chars;
    });
  }

  // ============ 智谱 AI API 调用 ============
  async function generateWithLLM(gardenName, gardenId, style, model, apiKey, customPrompt) {
    const styleName = getStyleName(style);
    const themeWords = W.gardenThemes[gardenId] || ['园林','山水','亭台'];
    const cultureContext = GARDEN_CULTURE[gardenId] || (gardenName + '，苏州古典园林');

    // 格式指导
    const formatGuide = {
      'wuyan_jueju':  '五言绝句：共4句，每句5个字。',
      'qiyan_jueju':  '七言绝句：共4句，每句7个字。',
      'wuyan_lvshi':  '五言律诗：共8句，每句5个字，中间两联（第3-4句和第5-6句）需对仗。',
      'qiyan_lvshi':  '七言律诗：共8句，每句7个字，中间两联需对仗。',
      'yijiangnan':   '词牌《忆江南》：单调27字，句式"3,5,7,7,5"，第二、四、五句押平声韵。'
    };

    const systemPrompt = '你是一位严谨的中国古典诗词作者与校勘者，熟悉近体诗格律、平水韵、对仗、炼字、苏州园林文化。你必须先在内部自检字数、句数、韵脚、意象准确性，再只输出最终结果。';

    var userPrompt = '请以苏州园林' + gardenName + '的文化内涵与园林意境为主题，创作一首' + styleName + '。\n\n' +
      '园林文化背景：\n' + cultureContext + '\n\n' +
      '格律要求：\n' + (formatGuide[style] || '') + '\n\n' +
      '高质量要求：\n' +
      '- 诗题必须具体、雅致，指向园中景物或精神，不要直接写成“咏' + gardenName + '”\n' +
      '- 必须融入该园真实意象，不可泛写“山水亭台”；可用意象：' + themeWords.slice(0, 10).join('、') + '\n' +
      '- 用词要有炼字意识，避免“美、好、漂亮、景色”等直白俗词\n' +
      '- 意境应含蓄，有留白，有“咫尺乾坤、借景入心”的园林哲思\n' +
      '- 绝句第2、4句必须押同一平声韵；律诗第2、4、6、8句押同一平声韵\n' +
      '- 律诗中间两联必须尽量对仗，词性和结构要相称\n' +
      '- 近体诗正文每句只输出诗句，不加逗号句号；不要缺句，不要多句\n' +
      '- 创作完成后请在内部检查：句数正确、每句字数正确、韵脚一致、没有解释文字，然后再输出';

    // 如果有用户自定义提示词，追加
    if (customPrompt && customPrompt.trim()) {
      userPrompt += '\n\n用户特别要求：\n' + customPrompt.trim() + '\n请将这些要求自然地融入诗词创作中。';
    }

    userPrompt += '\n\n严格输出格式：\n只输出一个 JSON 对象，不要 Markdown，不要代码块，不要解释。格式如下：\n' +
      '{"title":"诗题，不带书名号","lines":["第一句","第二句","第三句","第四句"]}\n' +
      '如果是律诗，lines 必须有 8 句；如果是《忆江南》，lines 必须有 5 句。';

    const response = await fetch(ZHIPU_API_BASE, {
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
        temperature: 0.68,
        max_tokens: 1024,
        top_p: 0.82
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || `HTTP ${response.status}`;
      if (response.status === 401) {
        throw new Error('API Key 无效，请检查后重试');
      } else if (response.status === 429) {
        throw new Error('请求过于频繁，请稍后再试');
      } else {
        throw new Error('API 调用失败：' + errMsg);
      }
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    if (!content.trim()) {
      throw new Error('AI 未生成有效内容，请重试');
    }

    var parsedPoem = parseLLMPoemContent(content, style, gardenName);
    var finalLines = parsedPoem.lines;

    if (!validatePoemLines(finalLines, style)) {
      var hint = 'AI 输出未通过格式校验：需要 ' + expectedLineCount(style) + ' 句';
      var chars = expectedCharsPerLine(style);
      if (chars) hint += '，且每句 ' + chars + ' 字';
      hint += '。请再试一次，或改用 GLM-4。';
      throw new Error(hint);
    }

    return {
      lines: finalLines,
      gardenName,
      style,
      styleName,
      theme: parsedPoem.title,
      model,
      fromLLM: true
    };
  }

  // ============ 导出接口 ============
  window.PoetryEngine = {
    generate: generatePoem,
    generateWithLLM: generateWithLLM,
    LLM_MODELS: LLM_MODELS,
    styles: [
      { id: 'wuyan_jueju', name: '五言绝句', desc: '四句·每句五字', icon: '✒️' },
      { id: 'qiyan_jueju', name: '七言绝句', desc: '四句·每句七字', icon: '📜' },
      { id: 'wuyan_lvshi', name: '五言律诗', desc: '八句·每句五字', icon: '🖋️' },
      { id: 'qiyan_lvshi', name: '七言律诗', desc: '八句·每句七字', icon: '📝' },
      { id: 'yijiangnan',   name: '词·忆江南', desc: '小令·白居易体', icon: '🎵' }
    ],
    getStyleName
  };

})();
