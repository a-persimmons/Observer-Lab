export const courseWeeks = [
  { week: 1, stage: "看清楚", title: "行业全景", output: "行业地图", status: "done" },
  { week: 2, stage: "看清楚", title: "价值与钱", output: "价值流地图", status: "done" },
  { week: 3, stage: "看清楚", title: "竞争结构", output: "竞争结构图", status: "done" },
  { week: 4, stage: "看懂", title: "核心变量", output: "核心变量树", status: "active" },
  { week: 5, stage: "看懂", title: "因果与系统", output: "因果网络", status: "next" },
  { week: 6, stage: "看懂", title: "多视角", output: "六视角分析卡", status: "locked" },
  { week: 7, stage: "判断", title: "证据", output: "证据矩阵", status: "locked" },
  { week: 8, stage: "判断", title: "概率", output: "正式判断组", status: "locked" },
  { week: 9, stage: "判断", title: "趋势与拐点", output: "拐点仪表盘", status: "locked" },
  { week: 10, stage: "判断", title: "情景与下注", output: "情景矩阵", status: "locked" },
  { week: 11, stage: "校准", title: "反证与偏误", output: "反方挑战报告", status: "locked" },
  { week: 12, stage: "校准", title: "个人系统", output: "个人判断手册", status: "locked" },
];

export const judgments = [
  {
    id: 1,
    proposition: "AI Coding 会在两年内重塑传统 IDE 的商业模式",
    probability: 65,
    initialProbability: 65,
    domain: "AI / 开发工具",
    due: "2026-08-12",
    status: "due",
    evidence: 8,
    revisions: [
      { date: "2026-05-12", probability: 65, note: "创建判断：模型能力与开发者采用率同时改善。" },
    ],
  },
  {
    id: 2,
    proposition: "企业 AI Agent 将在 2027 年前跨过规模化生产拐点",
    probability: 55,
    initialProbability: 50,
    domain: "企业软件",
    due: "2027-01-30",
    status: "tracking",
    evidence: 12,
    revisions: [
      { date: "2026-06-01", probability: 50, note: "以当前生产部署率为基准。" },
      { date: "2026-07-22", probability: 55, note: "企业续费案例增加，上调 5%。" },
    ],
  },
  {
    id: 3,
    proposition: "推理成本下降会改变多数 SaaS 的按席位定价",
    probability: 72,
    initialProbability: 60,
    domain: "商业模式",
    due: "2027-08-01",
    status: "tracking",
    evidence: 6,
    revisions: [
      { date: "2026-04-18", probability: 60, note: "初始判断。" },
      { date: "2026-07-08", probability: 72, note: "观察到更多按结果和用量计费的产品。" },
    ],
  },
];

export const researchProjects = [
  {
    id: 1,
    title: "企业 AI Agent 的生产化拐点",
    question: "哪些变量真正决定企业 AI Agent 从试点进入生产？",
    progress: 68,
    evidence: 24,
    judgments: 3,
    updated: "今天 18:42",
    status: "研究中",
  },
  {
    id: 2,
    title: "AI Coding 与 IDE 价值迁移",
    question: "价值会从编辑器界面迁移到哪里？",
    progress: 84,
    evidence: 31,
    judgments: 4,
    updated: "昨天",
    status: "待复盘",
  },
];

export const canvasSections = [
  { no: "01", title: "问题边界", body: "聚焦 200–5000 人企业；生产化定义为连续运行 90 天并进入正式预算。", state: "complete" },
  { no: "02", title: "参与者", body: "业务部门、IT、采购、安全、模型提供商、集成商、一线使用者。", state: "complete" },
  { no: "03", title: "价值与钱", body: "效率收益归业务部门；成本集中在集成、治理、推理与流程重构。", state: "complete" },
  { no: "04", title: "核心变量", body: "模型可靠性、集成成本、企业采购周期、组织阻力、可衡量 ROI。", state: "active" },
  { no: "05", title: "因果与时滞", body: "可靠性提高 → 人工监督下降 → 单任务成本下降 → 可扩展场景增加。", state: "draft" },
  { no: "06", title: "六视角盲区", body: "待补：组织激励、责任归属、监管与员工接受度。", state: "attention" },
  { no: "07", title: "证据矩阵", body: "支持 9 条 · 反对 5 条 · 待核验 4 条。", state: "draft" },
  { no: "08", title: "情景与指标", body: "基准情景：2027 年生产化率到 30%；领先指标为续费率与人工接管率。", state: "draft" },
];

export const roleDefaults = [
  { id: "Tutor", zh: "导师", mission: "逐问引导，先让你形成自己的答案", model: "GPT-5.2", temp: 0.3, web: false, enabled: true },
  { id: "Coach", zh: "教练", mission: "安排节奏、反思与迁移训练", model: "GPT-5.2", temp: 0.5, web: false, enabled: true },
  { id: "Researcher", zh: "研究员", mission: "联网检索、比较来源并提出证据候选", model: "GPT-5.2", temp: 0.2, web: true, enabled: true },
  { id: "Critic", zh: "反方", mission: "攻击假设、遗漏变量与证据薄弱点", model: "GPT-5.2", temp: 0.7, web: true, enabled: true },
  { id: "Auditor", zh: "审计员", mission: "按量表检查结构、引用与复盘质量", model: "GPT-5.2", temp: 0.1, web: false, enabled: true },
];

export const historyItems = [
  { type: "训练", date: "今天 19:20", title: "Week 4 · 从现象中提取核心变量", detail: "完成初稿，等待收敛变量清单", tag: "进行中" },
  { type: "证据", date: "今天 18:42", title: "企业 AI Agent 生产部署的组织阻力", detail: "新增 3 条证据候选，其中 2 条已核验", tag: "研究" },
  { type: "判断", date: "7 月 22 日", title: "企业 AI Agent 将在 2027 年前跨过规模化生产拐点", detail: "概率由 50% 上调至 55%", tag: "+5%" },
  { type: "挑战", date: "7 月 18 日", title: "AI Coding 与 IDE 价值迁移", detail: "接受 3 条挑战，拒绝 1 条，2 条待调查", tag: "已处理" },
  { type: "课程", date: "7 月 15 日", title: "完成 Week 3 · 竞争结构", detail: "产物：AI Coding 竞争结构图 v2", tag: "已完成" },
];
