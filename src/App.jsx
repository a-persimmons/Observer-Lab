import { useMemo, useState } from "react";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpen,
  Brain,
  CalendarBlank,
  CaretDown,
  CaretRight,
  ChartLineUp,
  Check,
  CheckCircle,
  Circle,
  Clock,
  Compass,
  Eye,
  FileText,
  GearSix,
  Globe,
  GraduationCap,
  Key,
  ListChecks,
  Lock,
  MagnifyingGlass,
  MapTrifold,
  Network,
  NotePencil,
  Plus,
  Robot,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  Target,
  TestTube,
  Timer,
  Trash,
  TrendUp,
  Warning,
  X,
} from "@phosphor-icons/react";
import {
  courseWeeks,
} from "./data.js";
import {
  buildWeekRhythm,
  formatSnapshotDate,
  getCourseStatus,
  getGreeting,
  getLocalDateKey,
  readLearningState,
  writeLearningState,
} from "./learningState.js";
import {
  createId,
  formatActivityTime,
  readWorkspaceState,
  writeWorkspaceState,
} from "./workspaceState.js";
import {
  readAiSettings,
  roleDefinitions,
  writeAiSettings,
} from "./aiSettingsState.js";

const navItems = [
  { id: "today", label: "今日", icon: Compass },
  { id: "learn", label: "学习", icon: BookOpen },
  { id: "research", label: "研究", icon: MagnifyingGlass },
  { id: "judgments", label: "判断", icon: ListChecks },
  { id: "insights", label: "洞察", icon: Eye },
  { id: "history", label: "历史", icon: Clock },
];

const stages = [
  { name: "看清楚", range: "Week 1–3", description: "建立完整地图" },
  { name: "看懂", range: "Week 4–6", description: "找到变量与机制" },
  { name: "开始判断", range: "Week 7–10", description: "证据、概率与情景" },
  { name: "形成系统", range: "Week 11–12", description: "反证、复盘与校准" },
];

function AppIcon({ icon: Icon, size = 21, weight = "regular" }) {
  return <Icon size={size} weight={weight} aria-hidden="true" />;
}

function Sidebar({ page, setPage, openSearch }) {
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => setPage("today")} aria-label="返回今日">
        <span>Observer Lab</span>
        <small>观察者训练场</small>
      </button>

      <nav className="primary-nav" aria-label="主导航">
        {navItems.map((item) => {
          const active = page === item.id || (page === "training" && item.id === "learn") || (page === "review" && item.id === "judgments");
          return (
            <button key={item.id} className={active ? "nav-item active" : "nav-item"} onClick={() => setPage(item.id)}>
              <AppIcon icon={item.icon} size={24} weight={active ? "fill" : "regular"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={openSearch}>
          <AppIcon icon={MagnifyingGlass} size={22} />
          <span>搜索</span>
          <kbd>⌘ K</kbd>
        </button>
        <button className={page === "settings" ? "nav-item active" : "nav-item"} onClick={() => setPage("settings")}>
          <AppIcon icon={GearSix} size={24} />
          <span>设置</span>
        </button>
      </div>
    </aside>
  );
}

function MobileNav({ page, setPage }) {
  return (
    <nav className="mobile-nav" aria-label="移动端主导航">
      {navItems.slice(0, 5).map((item) => {
        const active = page === item.id || (page === "training" && item.id === "learn") || (page === "review" && item.id === "judgments");
        return (
          <button key={item.id} className={active ? "active" : ""} onClick={() => setPage(item.id)}>
            <AppIcon icon={item.icon} size={20} weight={active ? "fill" : "regular"} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

function Button({ children, variant = "primary", icon, className = "", ...props }) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      <span>{children}</span>
      {icon && <AppIcon icon={icon} size={20} />}
    </button>
  );
}

function TodayPage({ setPage, learningState, startTraining }) {
  const now = new Date();
  const week = buildWeekRhythm(now, learningState.completedTrainingDates);
  const currentCourse = courseWeeks[learningState.currentWeek - 1];
  const started = Boolean(learningState.startedAt);
  const completedToday = learningState.completedTrainingDates.includes(getLocalDateKey(now));
  const progress = Math.round((learningState.completedWeeks / courseWeeks.length) * 100);
  const stepProgress = Math.round((learningState.currentStep / 7) * 100);

  return (
    <main className="today-page page-enter">
      <section className="today-hero">
        <div className="greeting-block">
          <p className="snapshot-label">{formatSnapshotDate(now)}</p>
          <h1>{getGreeting(now)}，柿子。</h1>
          <p>{started ? "今天继续训练你的观察与判断。" : "从今天开始，建立自己的观察与判断方法。"}</p>
        </div>
        <img className="observatory-art" src={`${import.meta.env.BASE_URL}assets/observatory-instrument.png`} alt="简洁的观测仪器线稿" />
      </section>

      <section className="program-progress" aria-label="课程进度">
        <div><strong>第 {currentCourse.week} 周 · {currentCourse.title}</strong><span>12 周课程完成 {progress}%</span></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      </section>

      <section className="today-focus">
        <article className="training-focus">
          <p className="section-kicker">{completedToday ? "今日训练已完成" : started ? `继续第 ${currentCourse.week} 周训练` : `开始第 ${currentCourse.week} 周训练`}</p>
          <h2>{currentCourse.week === 1 ? "建立你的第一张行业全景图" : currentCourse.title}</h2>
          <p className="step-line"><strong>{learningState.currentStep} / 7</strong><span>· {started ? "当前训练进度" : "明确研究对象"}</span></p>
          <div className="micro-progress"><span style={{ width: `${stepProgress}%` }} /></div>
          <p className="time-estimate"><AppIcon icon={Clock} size={20} />约 30 分钟</p>
          <Button icon={ArrowRight} onClick={startTraining}>{completedToday ? "查看训练结果" : started ? "继续训练" : "开始训练"}</Button>
        </article>

        <article className="review-focus empty-state">
          <p className="section-kicker">暂无待复盘判断</p>
          <h2>写下第一个可验证判断后，这里会提醒你按时回来校准。</h2>
          <p className="empty-state-copy">不会用示例判断冒充你的记录。</p>
          <Button variant="outline" icon={ArrowRight} onClick={() => setPage("judgments")}>创建第一个判断</Button>
        </article>
      </section>

      <section className="today-lower">
        <article className="observation-note">
          <AppIcon icon={Eye} size={24} />
          <p>完成几次训练后，<br />这里才会生成有依据的认知观察。</p>
          <button className="text-link" onClick={startTraining}>{started ? "继续积累样本" : "开始第一次训练"} <CaretRight size={17} /></button>
        </article>
        <article className="weekly-rhythm">
          <h3>本周训练节奏</h3>
          <div className="week-row">
            {week.map((day) => (
              <div key={day.date} className={`day-cell ${day.status}`}>
                <span>{day.day}</span><small>{day.date}</small>
                <div className="day-marker">{day.status === "done" && <Check size={18} weight="bold" />}</div>
                <em>{day.status === "done" ? "已完成" : day.status === "today" ? "今天" : "—"}</em>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

function LearnPage({ learningState, startTraining }) {
  const activeStage = learningState.currentWeek <= 3 ? 0 : learningState.currentWeek <= 6 ? 1 : learningState.currentWeek <= 10 ? 2 : 3;
  const weeks = courseWeeks.map((item) => ({ ...item, status: getCourseStatus(item.week, learningState) }));
  const started = Boolean(learningState.startedAt);
  return (
    <main className="content-page page-enter">
      <PageHeader
        eyebrow="12 周递进课程"
        title="把观察世界变成一套稳定方法"
        description="课程不以看完内容计完成。每一周都要形成可复用产物，并迁移到你的真实研究。"
        actions={<Button icon={ArrowRight} onClick={startTraining}>{started ? `继续 Week ${learningState.currentWeek}` : "开始 Week 1"}</Button>}
      />
      <section className="stage-strip">
        {stages.map((stage, index) => <div key={stage.name} className={index === activeStage ? "active" : ""}><span>{stage.range}</span><strong>{stage.name}</strong><small>{stage.description}</small></div>)}
      </section>
      <section className="course-grid">
        {weeks.map((item) => (
          <button key={item.week} className={`course-card ${item.status}`} onClick={() => item.week === learningState.currentWeek && startTraining()}>
            <div className="course-card-top">
              <span>W{String(item.week).padStart(2, "0")}</span>
              {item.status === "done" && <CheckCircle size={22} weight="fill" />}
              {item.status === "locked" && <Lock size={18} />}
              {item.status === "active" && <span className="active-label">进行中</span>}
              {item.status === "next" && <span className="active-label">待开始</span>}
            </div>
            <p>{item.stage}</p>
            <h3>{item.title}</h3>
            <small>本周产物</small>
            <strong>{item.output}</strong>
          </button>
        ))}
      </section>
      <section className="phase-gate">
        <div><AppIcon icon={Target} size={28} /><span><small>第一阶段挑战</small><strong>Week 3 · 看清行业</strong></span></div>
        <p>完成行业地图、价值流地图与竞争结构图，建立观察一个行业的基本骨架。</p>
        <span>还需完成 {Math.max(0, 3 - learningState.completedWeeks)} 周</span>
      </section>
    </main>
  );
}

function TrainingPage({ setPage, showToast, learningState, updateTrainingStep, completeTraining }) {
  const [phase, setPhase] = useState(Math.max(0, learningState.currentStep - 1));
  const [draft, setDraft] = useState("");
  const [revision, setRevision] = useState("");
  const steps = ["选择主题", "划定边界", "识别参与者", "梳理价值流", "检查遗漏", "形成地图", "完成"];

  const next = () => {
    if (phase < 6) {
      const nextPhase = phase + 1;
      setPhase(nextPhase);
      updateTrainingStep(nextPhase + 1);
      if (nextPhase === 6) completeTraining();
    }
    else {
      showToast("训练已保存，行业地图已加入你的记录");
      setPage("research");
    }
  };

  return (
    <main className="workspace-page training-page page-enter">
      <header className="workspace-header">
        <button className="back-button" onClick={() => setPage("learn")}><ArrowLeft size={20} />课程地图</button>
        <div><span>Week 1 · 行业全景</span><strong>建立第一张行业地图</strong></div>
        <p><Timer size={19} />约 30 分钟</p>
      </header>

      <div className="training-layout">
        <aside className="step-sidebar">
          <p>今日训练</p>
          {steps.map((step, index) => (
            <button key={step} className={index === phase ? "active" : index < phase ? "done" : ""} onClick={() => index < phase && setPhase(index)}>
              <span>{index < phase ? <Check size={14} weight="bold" /> : index + 1}</span>{step}
            </button>
          ))}
          <div className="autosave"><CheckCircle size={17} weight="fill" />已自动保存</div>
        </aside>

        <section className="training-canvas">
          <div className="training-question">
            <p className="eyebrow">步骤 {phase + 1} / 7</p>
            {phase === 0 && <>
              <h1>你想用哪个真实行业完成这 12 周训练？</h1>
              <p>先写下一个你确实想长期理解的行业，以及你现在最想弄清楚的问题。没有标准答案。</p>
              <label className="field-label" htmlFor="draft">行业与核心问题</label>
              <textarea id="draft" value={draft} onChange={(event) => setDraft(event.target.value)} rows={10} placeholder="例如：AI Coding。核心问题：价值会从传统 IDE 迁移到哪里？" />
              <div className="canvas-actions"><span>{draft.trim() ? "这会成为你的训练主题" : "先写下真实主题再继续"}</span><Button icon={ArrowRight} onClick={next} disabled={!draft.trim()}>确定主题</Button></div>
            </>}
            {phase === 1 && <>
              <h1>先把行业边界说清楚</h1>
              <div className="ai-note tutor"><span><GraduationCap size={22} weight="fill" />Tutor · 导师</span><p>一个可研究的行业需要说明服务谁、解决什么问题、由谁付钱，以及哪些相邻领域暂时不纳入。</p></div>
              <div className="selection-list">
                {["谁在使用", "谁在付钱", "解决什么问题", "地域范围", "时间范围", "暂不包含什么"].map((item, index) => <label key={item}><input type="checkbox" defaultChecked={index < 3} /> <span>{item}</span></label>)}
              </div>
              <div className="canvas-actions"><button className="text-link">查看方法卡：问题边界</button><Button icon={ArrowRight} onClick={next}>确认边界</Button></div>
            </>}
            {phase === 2 && <>
              <h1>谁参与其中，谁真正拥有决定权？</h1>
              <div className="ai-note critic"><span><ShieldCheck size={22} weight="fill" />Critic · 反方</span>
                <ol><li><strong>不要只看产品提供者：</strong>用户、付费者和受益者可能不是同一个人。</li><li><strong>检查上下游：</strong>基础设施、渠道和替代方案会改变行业边界。</li><li><strong>寻找门槛角色：</strong>有些参与者不直接使用产品，却能决定它能否被购买。</li></ol>
              </div>
              <div className="challenge-disposition">
                <label><span>用户与付费者</span><select defaultValue="accept"><option value="accept">已区分</option><option>待补充</option><option>不适用</option></select></label>
                <label><span>上下游参与者</span><select defaultValue="partial"><option>已区分</option><option value="partial">待补充</option><option>不适用</option></select></label>
                <label><span>替代方案</span><select defaultValue="investigate"><option>已区分</option><option value="investigate">待调查</option><option>不适用</option></select></label>
              </div>
              <div className="canvas-actions"><span>先标记缺口，不要求一次补全</span><Button icon={ArrowRight} onClick={next}>保存参与者清单</Button></div>
            </>}
            {phase === 3 && <>
              <h1>钱从哪里来，价值流向哪里？</h1>
              <div className="compare-drafts"><div><span>你选择的主题</span><pre>{draft}</pre></div><div><span>价值流草图</span><textarea rows={10} value={revision} placeholder="谁付钱 → 向谁购买 → 得到什么价值\n谁承担主要成本 → 谁获得主要收益" onChange={(e) => setRevision(e.target.value)} /></div></div>
              <label className="field-label">当前最不确定的一环</label><input className="text-input" placeholder="例如：最终预算由业务部门还是 IT 部门承担？" />
              <div className="canvas-actions"><span>主题原文会保留</span><Button icon={ArrowRight} onClick={next} disabled={!revision.trim()}>保存价值流</Button></div>
            </>}
            {phase === 4 && <>
              <h1>用完整性清单检查你的行业地图</h1>
              <div className="audit-grid">
                {[["目标用户","已检查","谁使用、谁受益"],["付费角色","已检查","谁掌握预算"],["上下游","待验证","供应与渠道"],["替代方案","待验证","用户还能怎么解决"]].map(([a,b,c])=><div key={a}><span>{a}</span><strong>{b}</strong><small>{c}</small></div>)}
              </div>
              <div className="ai-note auditor"><span><ShieldCheck size={22} />Auditor · 审计员</span><p>首次地图不追求完整。只要明确已知部分和待验证缺口，它就可以作为后续研究的起点。</p></div>
              <div className="canvas-actions"><span>系统不会用示例分数评价你</span><Button icon={ArrowRight} onClick={next}>继续</Button></div>
            </>}
            {phase === 5 && <>
              <h1>把零散信息整理成第一张行业地图</h1>
              <p>用自己的话总结：这个行业为谁解决什么问题，谁付钱，主要参与者是谁。</p>
              <textarea rows={6} placeholder="这个行业服务……；核心问题是……；付费者是……；主要参与者包括……；当前最大的未知是……" />
              <div className="method-summary"><Sparkle size={24} /><div><strong>这张地图会成为后续 11 周的共同底稿</strong><p>以后补充事实时追加版本，不会覆盖你今天的原始理解。</p></div></div>
              <div className="canvas-actions"><span>可以不完美，但必须是你的答案</span><Button icon={ArrowRight} onClick={next}>完成第一课</Button></div>
            </>}
            {phase === 6 && <>
              <div className="completion-panel"><CheckCircle size={48} weight="thin" /><p className="eyebrow">第一次训练完成</p><h1>你的行业全景训练已经开始</h1><p>今天的主题、边界、参与者与价值流已经保存为第一版训练记录。</p></div>
              <div className="completion-delta"><div><span>开始时</span><p>一个想了解的行业</p></div><ArrowRight size={24}/><div><span>现在</span><p>一张带有明确缺口的行业地图</p></div></div>
              <div className="canvas-actions"><button className="text-link" onClick={() => setPage("today")}>返回今日</button><Button icon={MapTrifold} onClick={next}>创建研究项目</Button></div>
            </>}
          </div>
        </section>

        <aside className="context-panel">
          <div className="context-tabs"><button className="active">上下文</button><button>方法</button></div>
          <p className="context-title">当前研究</p><strong>尚未绑定研究项目</strong>
          <div className="context-stat"><span>相关证据</span><strong>0</strong></div>
          <div className="context-stat"><span>待核验</span><strong>0</strong></div>
          <div className="context-divider" />
          <p className="context-title">AI 介入记录</p>
          <ul><li>你的答案先于 AI 建议</li><li>Tutor 仅提供结构化追问</li><li>示例内容不会计入个人画像</li></ul>
          <button className="context-config" onClick={() => setPage("settings")}><Robot size={19}/>本次 AI 配置<CaretRight size={16}/></button>
        </aside>
      </div>
    </main>
  );
}

function EmptyWorkspace({ icon: Icon = FileText, title, description, action }) {
  return <section className="empty-workspace"><AppIcon icon={Icon} size={38} weight="thin" /><h2>{title}</h2><p>{description}</p>{action}</section>;
}

function ResearchPage({ projects, createProject }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const selectedProject = projects.find((project) => project.id === selectedProjectId) || projects[0];
  const sections = ["问题边界", "参与者", "价值与钱", "核心变量", "因果与时滞", "六视角盲区", "证据矩阵", "情景与指标"];
  const saveProject = (event) => {
    event.preventDefault();
    if (!title.trim() || !question.trim()) return;
    const project = createProject({ title: title.trim(), question: question.trim() });
    setSelectedProjectId(project.id);
    setTitle("");
    setQuestion("");
    setCreating(false);
  };
  return <main className="content-page page-enter">
    <PageHeader eyebrow="真实问题工作区" title="研究" description="课程方法在这里沉淀为你的长期研究，而不是一次性作业。" actions={<Button icon={Plus} onClick={() => setCreating(true)}>新建研究</Button>} />
    {creating && <form className="create-form" onSubmit={saveProject}><label>研究项目名称<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如：我想理解的行业或变化" autoFocus /></label><label>你想回答的问题<textarea value={question} onChange={(event) => setQuestion(event.target.value)} rows={3} placeholder="例如：这个行业的钱最终流向哪里？" /></label><div><Button type="button" variant="ghost" onClick={() => setCreating(false)}>取消</Button><Button type="submit" icon={ArrowRight}>创建研究</Button></div></form>}
    {!projects.length ? <EmptyWorkspace icon={MapTrifold} title="还没有研究项目" description="从一个你确实想理解的问题开始。创建后，行业地图和证据会只记录你的内容。" action={<Button icon={Plus} onClick={() => setCreating(true)}>创建第一个研究</Button>} /> : <div className="research-layout">
      <aside className="project-list"><div className="list-heading"><strong>研究项目</strong><span>{projects.length}</span></div>{projects.map((project) => <button key={project.id} className={selectedProject?.id === project.id ? "active" : ""} onClick={() => setSelectedProjectId(project.id)}><span>进行中</span><strong>{project.title}</strong><small>{project.updatedAt} · 0 条证据</small></button>)}<button className="archived-link"><Archive size={18}/>已归档项目</button></aside>
      <section className="canvas-workspace"><header className="canvas-header"><div><p>研究画布 · 第 1 版</p><h2>{selectedProject?.title}</h2><span>{selectedProject?.question}</span></div></header><div className="canvas-toolbar"><button className="active">画布</button><button>证据 0</button><button>判断 0</button><span /></div><div className="canvas-grid">{sections.map((section, index) => <button key={section} className="canvas-section" onClick={() => {}}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{section}</h3><p>尚未填写。后续训练会把你的内容沉淀在这里。</p></div><CaretRight size={18}/></button>)}</div><footer className="canvas-footer"><span>尚未产生版本</span><p>先完成训练或添加你的第一条研究内容。</p></footer></section>
    </div>}
  </main>;
}

function judgmentStatus(judgment) {
  if (judgment.reviewedAt) return "reviewed";
  return judgment.due && judgment.due <= new Date().toISOString().slice(0, 10) ? "due" : "tracking";
}

function JudgmentsPage({ judgments, createJudgment, startReview }) {
  const [filter, setFilter] = useState("all");
  const [creating, setCreating] = useState(false);
  const [proposition, setProposition] = useState("");
  const [probability, setProbability] = useState(50);
  const [domain, setDomain] = useState("");
  const [due, setDue] = useState("");
  const filtered = judgments.filter((judgment) => filter === "all" || judgmentStatus(judgment) === filter);
  const saveJudgment = (event) => {
    event.preventDefault();
    if (!proposition.trim() || !domain.trim() || !due) return;
    createJudgment({ proposition: proposition.trim(), probability: Number(probability), domain: domain.trim(), due });
    setProposition(""); setProbability(50); setDomain(""); setDue(""); setCreating(false);
  };
  const summary = { tracking: judgments.filter((item) => judgmentStatus(item) === "tracking").length, due: judgments.filter((item) => judgmentStatus(item) === "due").length, reviewed: judgments.filter((item) => judgmentStatus(item) === "reviewed").length };
  return <main className="content-page page-enter">
    <PageHeader eyebrow="让观点经得起时间" title="判断日志" description="命题冻结，更新追加。这里仅显示你亲自创建的判断。" actions={<Button icon={Plus} onClick={() => setCreating(true)}>新建判断</Button>} />
    {creating && <form className="create-form" onSubmit={saveJudgment}><label>可验证命题<textarea value={proposition} onChange={(event) => setProposition(event.target.value)} rows={3} placeholder="例如：在两年内……" autoFocus /></label><div className="form-grid"><label>当前概率<input type="number" min="0" max="100" value={probability} onChange={(event) => setProbability(event.target.value)} /></label><label>领域<input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="例如：AI / 商业模式" /></label><label>复盘日期<input type="date" value={due} onChange={(event) => setDue(event.target.value)} /></label></div><div><Button type="button" variant="ghost" onClick={() => setCreating(false)}>取消</Button><Button type="submit" icon={ArrowRight}>冻结这个判断</Button></div></form>}
    <section className="judgment-summary"><div><span>进行中</span><strong>{summary.tracking}</strong></div><div><span>等待复盘</span><strong className={summary.due ? "warning-text" : ""}>{summary.due}</strong></div><div><span>已完成复盘</span><strong>{summary.reviewed}</strong></div><div><span>概率校准</span><strong>—</strong><small>{summary.reviewed ? "样本积累中" : "完成复盘后生成"}</small></div></section>
    {!judgments.length ? <EmptyWorkspace icon={ListChecks} title="还没有判断记录" description="从一个你愿意被时间验证的命题开始。它会保留原始概率和复盘日期。" action={<Button icon={Plus} onClick={() => setCreating(true)}>创建第一个判断</Button>} /> : <><div className="filter-bar"><div>{[["all","全部"],["due","待复盘"],["tracking","跟踪中"],["reviewed","已复盘"]].map(([id,label]) => <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>)}</div></div><section className="judgment-list">{filtered.map((judgment) => { const status = judgmentStatus(judgment); return <article key={judgment.id} className={status === "due" ? "due" : ""}><div className="probability-dial"><strong>{judgment.probability}%</strong><span>当前概率</span></div><div className="judgment-body"><div><span>{judgment.domain}</span>{status === "due" && <em>已到复盘日</em>}</div><h2>{judgment.proposition}</h2><p>创建于 {judgment.createdAt} · 判定日 {judgment.due}</p></div><Button variant={status === "due" ? "danger-outline" : "ghost"} icon={ArrowRight} onClick={() => status === "due" ? startReview(judgment.id) : null} disabled={status !== "due"}>{status === "due" ? "开始复盘" : status === "reviewed" ? "已复盘" : "等待复盘"}</Button></article>; })}</section></>}
    <section className="ledger-note"><Lock size={23}/><div><strong>判断账本不可覆盖</strong><p>冻结后若命题或判定规则本质改变，系统会创建新判断并保留关联。</p></div></section>
  </main>;
}

function ReviewPage({ setPage, judgment, finishReview }) {
  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState("unknown");
  const [note, setNote] = useState("");
  const steps = ["看见过去", "判定结果", "形成规则"];
  if (!judgment) return <main className="content-page page-enter"><PageHeader eyebrow="到期复盘" title="没有待复盘判断" description="创建一个带复盘日期的判断后，系统才会在这里显示它。" actions={<Button icon={ArrowLeft} onClick={() => setPage("judgments")}>返回判断日志</Button>} /><EmptyWorkspace icon={Clock} title="暂无可复盘记录" description="这里不会展示任何示例判断。" /></main>;
  const finish = () => { finishReview(judgment.id, outcome, note); setPage("insights"); };
  return (
    <main className="review-page page-enter">
      <header className="review-header"><button className="back-button" onClick={()=>setPage("judgments")}><ArrowLeft size={20}/>判断日志</button><div><span>到期复盘</span><strong>先看过去，再看结果</strong></div><p>判断创建于 {judgment.createdAt}</p></header>
      <div className="review-stepper">{steps.map((label,index)=><div key={label} className={index===step?"active":index<step?"done":""}><span>{index<step?<Check size={14}/>:index+1}</span><strong>{label}</strong></div>)}</div>
      <section className="review-sheet">
        {step===0 && <><p className="eyebrow">冻结的原始判断</p><h1>{judgment.proposition}</h1><div className="frozen-probability"><span>原始概率</span><strong>{judgment.probability}%</strong><small>创建于 {judgment.createdAt} · 此记录不可修改</small></div><div className="falsifier"><strong>复盘前提醒</strong><p>此判断没有填写额外的支持或反对证据。请在下一步记录今天的依据，而不是事后重写原命题。</p></div><div className="sheet-actions"><span>确认你已经看见“当时的自己”</span><Button icon={ArrowRight} onClick={()=>setStep(1)}>查看现实结果</Button></div></>}
        {step===1 && <><p className="eyebrow">结果判定</p><h1>现实与原命题的关系是什么？</h1><p className="lead">请根据预先写下的命题选择。系统不会替你判定。</p><div className="outcome-options">{[["yes","已发生","命题满足预设阈值"],["not","未发生","未达到判定标准"],["partial","部分发生","方向成立但未达到阈值"],["unknown","无法判定","数据不足或规则存在问题"]].map(([id,title,desc])=><button key={id} className={outcome===id?"selected":""} onClick={()=>setOutcome(id)}><span>{outcome===id?<CheckCircle size={24} weight="fill"/>:<Circle size={24}/>}</span><strong>{title}</strong><small>{desc}</small></button>)}</div><label className="field-label">今天看到的证据或理由</label><textarea rows={5} value={note} onChange={(event)=>setNote(event.target.value)} placeholder="用自己的话记录：哪些新事实让你这样判定？"/><div className="sheet-actions"><button className="text-link" onClick={()=>setStep(0)}>返回原判断</button><Button icon={ArrowRight} onClick={()=>setStep(2)} disabled={!note.trim()}>形成复盘规则</Button></div></>}
        {step===2 && <><div className="completion-panel"><Brain size={48} weight="thin"/><p className="eyebrow">保存复盘</p><h1>将这次判断纳入你的长期校准记录</h1></div><label className="field-label">下次遇到类似判断，我要额外检查</label><textarea rows={5} placeholder="写下一条你愿意在下一次判断中执行的规则。"/><div className="review-score"><div><span>本次结果</span><strong>{outcome === "yes" ? "已发生" : outcome === "not" ? "未发生" : outcome === "partial" ? "部分发生" : "无法判定"}</strong><small>由你本人确认</small></div><div><span>校准统计</span><strong>—</strong><small>需要更多已复盘样本</small></div><ArrowRight size={26}/></div><div className="sheet-actions"><span>会新增一条真实的历史记录</span><Button icon={ChartLineUp} onClick={finish}>完成复盘</Button></div></>}
      </section>
    </main>
  );
}

function InsightsPage({ learningState, workspaceState, startTraining }) {
  const trainingCount = learningState.completedTrainingDates.length;
  const judgmentCount = workspaceState.judgments.length;
  const reviewedCount = workspaceState.judgments.filter((item) => item.reviewedAt).length;
  const sampleCount = trainingCount + reviewedCount;
  return <main className="content-page page-enter"><PageHeader eyebrow="行为证据，而非人格测试" title="认知画像" description="只有足够的个人行为记录，系统才会给出可追溯的观察。" />
    {!sampleCount ? <EmptyWorkspace icon={Brain} title="还没有足够的个人样本" description="完成训练、创建判断并复盘后，这里才会形成你的认知画像。系统不会用示例结论替代你。" action={<Button icon={ArrowRight} onClick={startTraining}>开始第一次训练</Button>} /> : <section className="insight-hero"><div><p className="eyebrow">当前样本</p><h2>画像仍在积累中。</h2><p>已完成 {trainingCount} 次训练，创建 {judgmentCount} 条判断，完成 {reviewedCount} 次复盘。样本不足时不生成能力评分或偏差结论。</p></div><div className="profile-ring"><span>综合样本</span><strong>{sampleCount}</strong><small>来自你的记录</small></div></section>}
  </main>;
}

function HistoryPage({ history, openSearch }) {
  const [type, setType] = useState("全部");
  const visible = history.filter(item=>type==="全部"||item.type===type);
  return <main className="content-page page-enter"><PageHeader eyebrow="你的学习不是被覆盖，而是被积累" title="历史与归档" description="回到任何一次训练、版本、证据或判断，查看当时的完整上下文。" actions={<><Button variant="outline" icon={MagnifyingGlass} onClick={openSearch}>全局搜索</Button><Button variant="ghost" icon={Archive}>查看归档</Button></>}/>
    <div className="history-controls"><div>{["全部","训练","研究","判断","复盘"].map(item=><button key={item} className={type===item?"active":""} onClick={()=>setType(item)}>{item}</button>)}</div></div>
    {history.length ? <section className="history-timeline">{visible.map((item,index)=><article key={item.id}><div className="timeline-mark"><span>{index+1}</span></div><div className="timeline-time">{item.date}</div><div className="timeline-content"><span>{item.type}</span><h3>{item.title}</h3><p>{item.detail}</p></div><em>{item.tag}</em></article>)}</section> : <EmptyWorkspace icon={Clock} title="还没有历史记录" description="完成训练、创建研究或冻结判断后，时间线会从你的真实行动开始积累。" />}
    <section className="archive-panel"><Archive size={27}/><div><strong>归档会保留你的历史</strong><p>你主动归档的项目会出现在这里；当前没有任何归档内容。</p></div></section>
  </main>;
}

function SettingsPage({ aiSettings, updateAiSettings, showToast }) {
  const [tab, setTab] = useState("connections");
  const [editingConnection, setEditingConnection] = useState(null);
  const [testingId, setTestingId] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("Tutor");
  const selectedRole = aiSettings.roles.find((role) => role.id === selectedRoleId) || aiSettings.roles[0];
  const updateRole = (id, patch) => updateAiSettings((previous) => ({ ...previous, roles: previous.roles.map((role) => role.id === id ? { ...role, ...patch } : role) }));
  const testConnection = async (connection) => {
    if (!connection?.baseUrl || !connection?.apiKey) {
      setTestResult({ id: connection?.id, status: "error", message: "请先填写 Base URL 和 API Key。" });
      return;
    }
    setTestingId(connection.id); setTestResult(null);
    try {
      const response = await fetch(`${connection.baseUrl.replace(/\/+$/, "")}/models`, { headers: { Authorization: `Bearer ${connection.apiKey}` } });
      if (!response.ok) throw new Error(`服务返回 ${response.status}`);
      setTestResult({ id: connection.id, status: "success", message: "已成功请求模型列表。" });
    } catch (error) {
      setTestResult({ id: connection.id, status: "error", message: `连接未通过：${error.message}。若提示跨域限制，请使用允许浏览器请求的兼容端点。` });
    } finally { setTestingId(""); }
  };
  const startConnection = () => setEditingConnection({ id: createId("connection"), name: "", provider: "OpenAI-compatible", baseUrl: "", model: "", apiKey: "" });
  const saveConnection = (event) => {
    event.preventDefault();
    if (!editingConnection.name.trim() || !editingConnection.baseUrl.trim()) return;
    const connection = { ...editingConnection, name: editingConnection.name.trim(), baseUrl: editingConnection.baseUrl.trim().replace(/\/+$/, "") };
    updateAiSettings((previous) => ({ ...previous, connections: previous.connections.some((item) => item.id === connection.id) ? previous.connections.map((item) => item.id === connection.id ? connection : item) : [connection, ...previous.connections] }));
    setEditingConnection(null); showToast("AI 连接已保存到当前浏览器");
  };
  const deleteConnection = (id) => {
    if (!window.confirm("删除这个本地 AI 连接？关联角色会变为未选择连接。")) return;
    updateAiSettings((previous) => ({ ...previous, connections: previous.connections.filter((item) => item.id !== id), roles: previous.roles.map((role) => role.connectionId === id ? { ...role, connectionId: "", enabled: false } : role), defaultConnectionId: previous.defaultConnectionId === id ? "" : previous.defaultConnectionId }));
    setEditingConnection(null); showToast("本地 AI 连接已删除");
  };
  return <main className="content-page settings-page page-enter"><PageHeader eyebrow="完全由你控制" title="AI 配置" description="决定怎么连接、哪个角色使用哪个模型、发送哪些数据，以及何时允许联网。" actions={<Button variant="outline" icon={ShieldCheck}>隐私与用量</Button>}/>
    <div className="settings-tabs">{[["connections","提供商与连接"],["roles","五个 AI 角色"],["overrides","默认与覆盖"],["preview","测试与预览"]].map(([id,label])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}>{label}</button>)}</div>
    {tab==="connections"&&<section className="settings-body"><div className="settings-main"><div className="settings-section-title"><div><h2>模型提供商</h2><p>连接、密钥与模型选择只保存到当前浏览器。</p></div><Button icon={Plus} onClick={startConnection}>添加连接</Button></div>{editingConnection && <form className="connection-editor" onSubmit={saveConnection}><label>连接名称<input value={editingConnection.name} onChange={(event) => setEditingConnection({ ...editingConnection, name: event.target.value })} placeholder="例如：我的 OpenAI 连接" autoFocus /></label><label>提供商<select value={editingConnection.provider} onChange={(event) => setEditingConnection({ ...editingConnection, provider: event.target.value })}><option>OpenAI-compatible</option><option>OpenRouter-compatible</option><option>自定义兼容端点</option></select></label><label>Base URL<input value={editingConnection.baseUrl} onChange={(event) => setEditingConnection({ ...editingConnection, baseUrl: event.target.value })} placeholder="https://…/v1" /></label><label>默认模型<input value={editingConnection.model} onChange={(event) => setEditingConnection({ ...editingConnection, model: event.target.value })} placeholder="例如：你的模型 ID" /></label><label className="wide">API Key<input type="password" value={editingConnection.apiKey} onChange={(event) => setEditingConnection({ ...editingConnection, apiKey: event.target.value })} placeholder="仅保存在本浏览器" autoComplete="off" /></label><div className="wide editor-actions"><Button type="button" variant="ghost" onClick={() => setEditingConnection(null)}>取消</Button>{aiSettings.connections.some((item) => item.id === editingConnection.id) && <Button type="button" variant="danger-outline" onClick={() => deleteConnection(editingConnection.id)}>删除</Button>}<Button type="submit" icon={Check}>保存本地连接</Button></div></form>}{aiSettings.connections.map((connection) => <article className="connection-card active" key={connection.id}><header><div className="provider-mark">AI</div><div><strong>{connection.name}</strong><span className="muted">{connection.provider} · {connection.model || "未设置默认模型"}</span></div><button onClick={() => setEditingConnection(connection)} aria-label={`编辑 ${connection.name}`}><GearSix size={20}/></button></header><p>{connection.baseUrl} · {connection.apiKey ? "API Key 已保存于本地" : "尚未填写 API Key"}</p><footer><span>{testResult?.id === connection.id ? testResult.message : "尚未测试此连接"}</span><Button variant="outline" icon={TestTube} onClick={() => testConnection(connection)} disabled={testingId === connection.id}>{testingId === connection.id ? "正在测试…" : "测试连接"}</Button></footer></article>)}{!aiSettings.connections.length && !editingConnection && <EmptyWorkspace icon={Key} title="尚未配置 AI 连接" description="添加一个支持 OpenAI 兼容接口的连接后，可以在下方为五个角色分别选择模型与参数。" />}</div><aside className="settings-aside"><ShieldCheck size={27}/><h3>本地保存说明</h3><p>API Key 以明文保存在此浏览器的站点数据中，不会上传到 GitHub。请只在个人设备使用；清除站点数据会同时删除它。</p></aside></section>}
    {tab==="roles"&&<section className="role-section"><div className="settings-section-title"><div><h2>角色矩阵</h2><p>每个角色都有独立的连接、模型、温度、上下文、联网开关与系统提示词。</p></div></div><div className="role-table"><div className="role-table-head"><span>角色与使命</span><span>连接</span><span>模型</span><span>温度</span><span>联网</span><span>启用</span></div>{aiSettings.roles.map((role) => <div className={!role.enabled ? "disabled" : ""} key={role.id}><button className="role-details" onClick={() => setSelectedRoleId(role.id)}><span className={`role-icon ${role.id.toLowerCase()}`}><Robot size={20}/></span><span><strong>{role.id} · {role.name}</strong><small>{role.mission}</small></span></button><select value={role.connectionId} onChange={(event) => updateRole(role.id, { connectionId: event.target.value })}><option value="">未选择</option>{aiSettings.connections.map((connection) => <option value={connection.id} key={connection.id}>{connection.name}</option>)}</select><input value={role.model} onChange={(event) => updateRole(role.id, { model: event.target.value })} placeholder="模型 ID" /><input type="number" min="0" max="2" step="0.1" value={role.temperature} onChange={(event) => updateRole(role.id, { temperature: Number(event.target.value) })} /><button className={role.web ? "toggle on" : "toggle"} onClick={() => updateRole(role.id, { web: !role.web })} aria-label={`切换 ${role.id} 联网`}><span/></button><button className={role.enabled ? "toggle on" : "toggle"} onClick={() => updateRole(role.id, { enabled: !role.enabled })} aria-label={`切换 ${role.id} 启用`}><span/></button></div>)}</div>{selectedRole && <section className="role-editor"><header><div><p>编辑角色</p><h3>{selectedRole.id} · {selectedRole.name}</h3></div><label>上下文上限<input type="number" min="1000" step="1000" value={selectedRole.context} onChange={(event) => updateRole(selectedRole.id, { context: Number(event.target.value) })} /></label></header><label>该角色的系统提示词<textarea rows={5} value={selectedRole.systemPrompt} onChange={(event) => updateRole(selectedRole.id, { systemPrompt: event.target.value })} placeholder="留空时使用全局系统提示词。" /></label><p>修改会立即保存到当前浏览器。</p></section>}</section>}
    {tab==="overrides"&&<section className="override-section"><div className="settings-section-title"><div><h2>默认与覆盖规则</h2><p>全局默认会在角色没有单独配置时生效；更具体的角色配置优先。</p></div></div><section className="default-config"><label>默认连接<select value={aiSettings.defaultConnectionId} onChange={(event) => updateAiSettings((previous) => ({ ...previous, defaultConnectionId: event.target.value }))}><option value="">不设置默认连接</option>{aiSettings.connections.map((connection) => <option value={connection.id} key={connection.id}>{connection.name}</option>)}</select></label><label>全局系统提示词<textarea rows={7} value={aiSettings.defaultSystemPrompt} onChange={(event) => updateAiSettings((previous) => ({ ...previous, defaultSystemPrompt: event.target.value }))} placeholder="例如：先追问，再给建议；区分事实、推测与判断。" /></label><p><CheckCircle size={17} weight="fill"/> 修改会立即保存到当前浏览器。角色内填写的提示词优先于这里。</p></section></section>}
    {tab==="preview"&&<section className="preview-section"><div className="preview-controls"><label>角色<select value={selectedRoleId} onChange={(event) => setSelectedRoleId(event.target.value)}>{roleDefinitions.map(([id, name]) => <option value={id} key={id}>{id} · {name}</option>)}</select></label><Button icon={TestTube} onClick={() => selectedRole && testConnection(aiSettings.connections.find((connection) => connection.id === (selectedRole.connectionId || aiSettings.defaultConnectionId)))}>测试此角色连接</Button></div>{selectedRole && <div className="preview-columns"><article><header><strong>最终生效配置</strong><span>来自本地浏览器</span></header><dl className="config-preview"><div><dt>连接</dt><dd>{aiSettings.connections.find((connection) => connection.id === (selectedRole.connectionId || aiSettings.defaultConnectionId))?.name || "未选择"}</dd></div><div><dt>模型</dt><dd>{selectedRole.model || aiSettings.connections.find((connection) => connection.id === selectedRole.connectionId)?.model || "未设置"}</dd></div><div><dt>温度 / 上下文</dt><dd>{selectedRole.temperature} / {selectedRole.context}</dd></div><div><dt>联网</dt><dd>{selectedRole.web ? "允许" : "关闭"}</dd></div></dl></article><article><header><strong>系统提示词预览</strong><span>{selectedRole.systemPrompt ? "角色覆盖" : "全局默认"}</span></header><p className="prompt-preview">{selectedRole.systemPrompt || aiSettings.defaultSystemPrompt || "尚未设置系统提示词。"}</p></article></div>}</section>}
  </main>;
}

function SearchOverlay({ onClose, setPage, workspaceState }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const all = [
      ...workspaceState.judgments.map(x=>({type:"判断",title:x.proposition,detail:`当前概率 ${x.probability}%`})),
      ...workspaceState.projects.map(x=>({type:"研究",title:x.title,detail:x.question})),
      ...workspaceState.history.map(x=>({type:x.type,title:x.title,detail:x.detail})),
      ...courseWeeks.map(x=>({type:"课程",title:`Week ${x.week} · ${x.title}`,detail:`产物：${x.output}`})),
    ];
    return query ? all.filter(x=>(x.title+x.detail).toLowerCase().includes(query.toLowerCase())).slice(0,8) : all.slice(0,6);
  }, [query, workspaceState]);
  return <div className="overlay" onMouseDown={onClose}><section className="search-dialog" onMouseDown={e=>e.stopPropagation()}><header><MagnifyingGlass size={23}/><input autoFocus placeholder="搜索课程、研究、判断与历史…" value={query} onChange={e=>setQuery(e.target.value)}/><button onClick={onClose}><X size={21}/></button></header><div className="search-filters"><button className="active">全部</button><button>课程</button><button>研究</button><button>判断</button><button>历史</button></div><div className="search-results">{results.length ? results.map((item,index)=><button key={`${item.title}-${index}`} onClick={()=>{onClose();setPage(item.type==="判断"?"judgments":item.type==="研究"?"research":item.type==="课程"?"learn":"history")}}><span>{item.type}</span><div><strong>{item.title}</strong><small>{item.detail}</small></div><CaretRight size={18}/></button>) : <p className="search-empty">没有匹配的真实记录。</p>}</div><footer><span>↑↓ 选择</span><span>Enter 打开</span><span>Esc 关闭</span></footer></section></div>;
}

function Toast({ message }) { return <div className="toast"><CheckCircle size={20} weight="fill"/><span>{message}</span></div>; }

export function App() {
  const [page, setPage] = useState("today");
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [learningState, setLearningState] = useState(() => readLearningState(window.localStorage));
  const [workspaceState, setWorkspaceState] = useState(() => readWorkspaceState(window.localStorage));
  const [aiSettings, setAiSettings] = useState(() => readAiSettings(window.localStorage));
  const [reviewId, setReviewId] = useState(null);
  const showToast = message => { setToast(message); window.setTimeout(()=>setToast(""),2400); };
  const updateLearningState = updater => setLearningState(previous => {
    const next = typeof updater === "function" ? updater(previous) : updater;
    return writeLearningState(window.localStorage, next);
  });
  const updateWorkspaceState = updater => setWorkspaceState(previous => {
    const next = typeof updater === "function" ? updater(previous) : updater;
    return writeWorkspaceState(window.localStorage, next);
  });
  const updateAiSettings = updater => setAiSettings(previous => {
    const next = typeof updater === "function" ? updater(previous) : updater;
    return writeAiSettings(window.localStorage, next);
  });
  const addHistory = (previous, item) => ({ ...previous, history: [item, ...previous.history].slice(0, 100) });
  const startTraining = () => {
    updateLearningState(previous => ({
      ...previous,
      startedAt: previous.startedAt || new Date().toISOString(),
      currentStep: Math.max(1, previous.currentStep),
    }));
    setPage("training");
  };
  const updateTrainingStep = currentStep => updateLearningState(previous => ({ ...previous, currentStep }));
  const completeTraining = () => {
    const today = getLocalDateKey();
    const alreadyCompleted = learningState.completedTrainingDates.includes(today);
    updateLearningState(previous => ({
      ...previous,
      currentStep: 7,
      completedTrainingDates: previous.completedTrainingDates.includes(today)
        ? previous.completedTrainingDates
        : [...previous.completedTrainingDates, today],
    }));
    if (!alreadyCompleted) {
      const week = courseWeeks[Math.min(Math.floor(learningState.completedTrainingDates.length / 7), courseWeeks.length - 1)];
      updateWorkspaceState(previous => addHistory(previous, {
        id: createId("training"), type: "训练", date: formatActivityTime(), title: `完成 Week ${week.week} · ${week.title}`,
        detail: "完成了一次个人训练。", tag: "已完成",
      }));
    }
  };
  const createProject = ({ title, question }) => {
    const project = { id: createId("project"), title, question, createdAt: formatActivityTime(), updatedAt: formatActivityTime() };
    updateWorkspaceState(previous => addHistory({ ...previous, projects: [project, ...previous.projects] }, {
      id: createId("history"), type: "研究", date: project.createdAt, title, detail: question, tag: "已创建",
    }));
    return project;
  };
  const createJudgment = ({ proposition, probability, domain, due }) => {
    const judgment = { id: createId("judgment"), proposition, probability, domain, due, createdAt: formatActivityTime() };
    updateWorkspaceState(previous => addHistory({ ...previous, judgments: [judgment, ...previous.judgments] }, {
      id: createId("history"), type: "判断", date: judgment.createdAt, title: proposition, detail: `冻结概率 ${probability}% · ${domain || "未分类"}`, tag: "已创建",
    }));
  };
  const finishReview = (id, outcome, note) => {
    const reviewedAt = formatActivityTime();
    updateWorkspaceState(previous => {
      const judgment = previous.judgments.find(item => item.id === id);
      if (!judgment) return previous;
      const next = { ...previous, judgments: previous.judgments.map(item => item.id === id ? { ...item, reviewedAt, review: { outcome, note } } : item) };
      return addHistory(next, { id: createId("history"), type: "复盘", date: reviewedAt, title: judgment.proposition, detail: note, tag: "已完成" });
    });
    setReviewId(null);
  };
  const renderPage = () => {
    switch(page) {
      case "learn": return <LearnPage learningState={learningState} startTraining={startTraining}/>;
      case "training": return <TrainingPage setPage={setPage} showToast={showToast} learningState={learningState} updateTrainingStep={updateTrainingStep} completeTraining={completeTraining}/>;
      case "research": return <ResearchPage projects={workspaceState.projects} createProject={createProject}/>;
      case "judgments": return <JudgmentsPage judgments={workspaceState.judgments} createJudgment={createJudgment} startReview={(id) => { setReviewId(id); setPage("review"); }}/>;
      case "review": return <ReviewPage setPage={setPage} judgment={workspaceState.judgments.find(item => item.id === reviewId)} finishReview={finishReview}/>;
      case "insights": return <InsightsPage learningState={learningState} workspaceState={workspaceState} startTraining={startTraining}/>;
      case "history": return <HistoryPage history={workspaceState.history} openSearch={()=>setSearchOpen(true)}/>;
      case "settings": return <SettingsPage aiSettings={aiSettings} updateAiSettings={updateAiSettings} showToast={showToast}/>;
      default: return <TodayPage setPage={setPage} learningState={learningState} startTraining={startTraining}/>;
    }
  };
  return <div className="app-shell"><Sidebar page={page} setPage={setPage} openSearch={()=>setSearchOpen(true)}/><div className="mobile-header"><button className="brand" onClick={()=>setPage("today")}><span>Observer Lab</span><small>观察者训练场</small></button><div><button onClick={()=>setSearchOpen(true)}><MagnifyingGlass size={21}/></button><button onClick={()=>setPage("settings")}><GearSix size={21}/></button></div></div><div className="app-content">{renderPage()}</div><MobileNav page={page} setPage={setPage}/>{searchOpen&&<SearchOverlay onClose={()=>setSearchOpen(false)} setPage={setPage} workspaceState={workspaceState}/>} {toast&&<Toast message={toast}/>}</div>;
}
