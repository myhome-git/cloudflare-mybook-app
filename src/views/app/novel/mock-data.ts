// 模拟小说数据 - 用于测试展示效果

// 小说分类
export const mockCategories = [
  { id: '1', name: '玄幻修真' },
  { id: '2', name: '都市言情' },
  { id: '3', name: '历史军事' },
  { id: '4', name: '武侠仙侠' },
  { id: '5', name: '科幻游戏' }
];

// 热门小说列表
export const mockNovels = [
  {
    id: '1',
    title: '星辰变',
    author: '我吃西红柿',
    cover: '',
    description: '一名少年，因父亲的原因，无法修炼，但他从未放弃，最终成就一代强者。',
    chapterCount: 368,
    updateTime: '2026-06-20',
    readCount: 1256890,
    isHot: true,
    classId: '1'
  },
  {
    id: '2',
    title: '完美世界',
    author: '辰东',
    cover: '',
    description: '一粒尘可填海，一根草斩尽日月星辰，弹指间天地翻覆。',
    chapterCount: 2755,
    updateTime: '2026-06-18',
    readCount: 2345678,
    isHot: true,
    classId: '1'
  },
  {
    id: '3',
    title: '全职高手',
    author: '蝴蝶蓝',
    cover: '',
    description: '被誉为荣耀教科书的游戏高手叶修，被俱乐部驱逐后，重新回到游戏。',
    chapterCount: 1728,
    updateTime: '2026-06-15',
    readCount: 3456789,
    isHot: true,
    classId: '5'
  },
  {
    id: '4',
    title: '斗破苍穹',
    author: '天蚕土豆',
    cover: '',
    description: '三十年河东，三十年河西，莫欺少年穷！',
    chapterCount: 1658,
    updateTime: '2026-06-12',
    readCount: 4567890,
    isHot: false,
    classId: '1'
  },
  {
    id: '5',
    title: '遮天',
    author: '辰东',
    cover: '',
    description: '冰冷与黑暗并存的宇宙深处，九具庞大的龙尸拉着一口青铜古棺。',
    chapterCount: 1598,
    updateTime: '2026-06-10',
    readCount: 3234567,
    isHot: false,
    classId: '1'
  },
  {
    id: '6',
    title: '剑来',
    author: '烽火戏诸侯',
    cover: '',
    description: '天下事，一件件，一桩桩，总有人要出头，总有人要低头。',
    chapterCount: 2456,
    updateTime: '2026-06-08',
    readCount: 2123456,
    isHot: false,
    classId: '4'
  },
  {
    id: '7',
    title: '诡秘之主',
    author: '爱潜水的乌贼',
    cover: '',
    description: '蒸汽与机械的浪潮中，谁能触及非凡？历史和黑暗的迷雾里，又是谁在耳语？',
    chapterCount: 1398,
    updateTime: '2026-06-05',
    readCount: 4123456,
    isHot: true,
    classId: '1'
  },
  {
    id: '8',
    title: '庆余年',
    author: '猫腻',
    cover: '',
    description: '一个少年，身世成谜，却拥有过人的智慧，在这个权谋交织的世界里生存。',
    chapterCount: 568,
    updateTime: '2026-06-01',
    readCount: 3567890,
    isHot: false,
    classId: '3'
  }
];

// 章节内容示例
export const mockChapters = [
  {
    id: 'c1',
    novelId: '1',
    name: '第一章 秦羽',
    content: `# 第一章 秦羽\n\n**大周王朝，羽族领地。**\n\n这是一个修仙者的世界，也是一个弱肉强食的世界。\n\n在这片广袤的土地上，无数修士为了追求长生大道，前赴后继，不惜一切代价。\n\n而在羽族领地之中，有一个名叫秦羽的少年，他天生经脉闭塞，无法修炼，注定只能做一个普通人。\n\n然而，秦羽并没有因此气馁。相反，他立下誓言，一定要找到一条属于自己的修行之路。\n\n"爹，娘，孩儿一定会让你们过上好日子的！"\n\n秦羽站在山崖边，望着远方连绵的山脉，眼中闪烁着坚定的光芒。\n\n风从山谷吹来，扬起他的衣角，也扬起他心中的梦想。\n\n这个看似平凡的少年，即将开启一段传奇的人生旅程...`
  },
  {
    id: 'c2',
    novelId: '1',
    name: '第二章 神秘石碑',
    content: `# 第二章 神秘石碑\n\n清晨的阳光透过树叶的缝隙，洒在秦羽的脸上。\n\n他揉了揉眼睛，从地上坐起身来。昨晚在山崖边思考了一夜，他的心中已经有了一个新的计划。\n\n"既然我无法修炼，那我就用其他方式来改变命运！"\n\n秦羽站起身，拍了拍身上的泥土，开始向山下走去。\n\n他的目的地是家族的后山禁地。那里有一座神秘的黑石，据说已经存在了数百年。\n\n家族中的长辈们都说，那是一块不祥之物，靠近它会带来厄运。\n\n但秦羽不信邪。他觉得，这块黑石说不定隐藏着什么秘密。\n\n一路小跑，秦羽很快来到了后山禁地。\n\n只见一块黑色的巨石矗立在空地上，表面光滑如镜，倒映着蓝天白云。\n\n秦羽小心翼翼地走近，伸手触摸那块黑石。\n\n就在他的手指触碰到石面的瞬间，一股奇异的力量涌入他的体内...`
  },
  {
    id: 'c3',
    novelId: '1',
    name: '第三章 奇遇',
    content: `# 第三章 奇遇\n\n秦羽感觉自己的身体仿佛被撕裂了一般，剧痛让他几乎晕厥过去。\n\n"这是怎么回事？"\n\n他想要后退，却发现自己的身体不受控制地被吸向黑石。\n\n就在他以为自己必死无疑的时候，一道金色的光芒突然从黑石中射出，将他整个人笼罩其中。\n\n光芒散去后，秦羽惊讶地发现，自己竟然能够感受到体内有一股前所未有的力量在涌动。\n\n"我...我能感觉到灵气了！"\n\n秦羽激动得浑身颤抖。作为一个无法修炼的人，这是他第一次感受到灵气的存在。\n\n他试着运转体内的这股力量，惊喜地发现，自己的修为竟然在飞速提升。\n\n短短几分钟的时间，他就从一个普通人突破到了羽阶三等。\n\n"这怎么可能？!"\n\n秦羽不敢置信地看着自己的双手。按照常理，一个无法修炼的人，就算遇到再大的机缘，也不可能一夜之间突破这么多境界。\n\n除非...这块黑石有什么特殊的功效。`
  }
];

// 获取小说详情
export function getNovelDetail(novelId: string) {
  return mockNovels.find(n => n.id === novelId) || null;
}

// 获取章节列表
export function getChapters(novelId: string) {
  return mockChapters.filter(c => c.novelId === novelId);
}

// 获取单个章节
export function getChapter(chapterId: string) {
  return mockChapters.find(c => c.id === chapterId) || null;
}