import { type FormEvent, useMemo, useState } from "react"
import {
  ArrowLeftRight, ArrowUpRight, Bell, CalendarDays, Check, CheckCircle2,
  ChevronRight, CircleHelp, ClipboardCheck, Clock3, Flag, Goal, Heart,
  HeartHandshake, Home, Lightbulb, ListChecks, LockKeyhole, MessageCircle,
  Megaphone, Plus, ShieldCheck, Sparkles, TrendingUp, UserRoundCog, Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

type Role = "parent" | "caregiver"
type Page = "overview" | "today" | "care" | "log" | "progress" | "circle" | "updates" | "community"
type Task = { id: number; time: string; title: string; detail: string; done: boolean; completedBy?: string }
type Update = { id: number; author: string; role: string; initials: string; time: string; body: string; tone: "sage" | "blue" | "peach" }
type GoalData = { id: number; title: string; description: string; progress: number; trend: string; color: string }
type CommunityCategory = "Question" | "Tip" | "Resource" | "Milestone"
type CommunityPost = { id: number; author: string; role: string; initials: string; tone: string; time: string; category: CommunityCategory; body: string; supports: number; replies: string[] }

const initialTasks: Task[] = [
  { id: 1, time: "8:00 AM", title: "Morning routine", detail: "Breakfast, vitamins, and backpack check", done: true, completedBy: "Robin" },
  { id: 2, time: "12:30 PM", title: "Quiet reset", detail: "10 minutes with the breathing card", done: true, completedBy: "Nadia" },
  { id: 3, time: "4:00 PM", title: "Reading practice", detail: "Read together for 15 minutes", done: false },
  { id: 4, time: "7:30 PM", title: "Evening check-in", detail: "Choose a feeling and share one good moment", done: false },
]

const initialUpdates: Update[] = [
  { id: 1, author: "Nadia", role: "Aunt & caregiver", initials: "NA", time: "Today, 1:10 PM", body: "The quiet reset worked really well today. Elio picked the breathing card without prompting and returned to lunch calmly.", tone: "sage" },
  { id: 2, author: "Robin", role: "Parent", initials: "RP", time: "Today, 8:24 AM", body: "Morning routine is done. Backpack and reading folder are by the door for pickup.", tone: "blue" },
  { id: 3, author: "Casey", role: "Caregiver", initials: "CG", time: "Yesterday, 6:40 PM", body: "We reached the three-step bedtime routine without reminders. That makes four successful evenings this week!", tone: "peach" },
]

const careGoals: GoalData[] = [
  { id: 1, title: "Independent transitions", description: "Move between daily activities using one verbal prompt or less.", progress: 68, trend: "+12% this month", color: "var(--sage)" },
  { id: 2, title: "Express needs clearly", description: "Use a word, phrase, or visual card before frustration builds.", progress: 54, trend: "+8% this month", color: "var(--blue)" },
  { id: 3, title: "Evening routine", description: "Complete the three-step routine with consistent support.", progress: 82, trend: "+18% this month", color: "var(--coral)" },
]

const initialCommunityPosts: CommunityPost[] = [
  { id: 1, author: "Avery", role: "Parent", initials: "AV", tone: "blue", time: "Today, 10:18 AM", category: "Tip", body: "A two-minute warning plus a visual timer made our after-school transition much calmer this week. Sharing in case it helps another family.", supports: 14, replies: ["We tried the visual timer today and it helped. Thank you for sharing!", "The two-minute warning works well for us too."] },
  { id: 2, author: "Morgan", role: "Caregiver", initials: "MO", tone: "peach", time: "Yesterday, 4:42 PM", category: "Question", body: "Has anyone found a simple way to keep a visual routine consistent between home and a caregiver’s house?", supports: 7, replies: ["We use the same three laminated cards in both places."] },
  { id: 3, author: "Jamie", role: "Parent", initials: "JM", tone: "sage", time: "Monday, 7:30 PM", category: "Milestone", body: "Celebrating a small win: our evening routine happened three days in a row with fewer reminders. Consistency is starting to feel possible.", supports: 21, replies: ["That is wonderful progress!", "Small wins add up—celebrating with you."] },
]

const roleDetails = {
  parent: { name: "Robin", initials: "RP", label: "Parent", description: "Manage Elio’s care circle, care plan, and progress.", color: "blue" },
  caregiver: { name: "Casey", initials: "CG", label: "Caregiver", description: "Complete daily care, follow strategies, and share handoffs.", color: "peach" },
} as const

const parentNav = [
  { value: "overview" as Page, label: "Overview", icon: Home },
  { value: "today" as Page, label: "Today’s care", icon: ListChecks },
  { value: "care" as Page, label: "Care plan", icon: ClipboardCheck },
  { value: "progress" as Page, label: "Progress", icon: TrendingUp },
  { value: "circle" as Page, label: "Care circle", icon: Users },
  { value: "updates" as Page, label: "Updates", icon: MessageCircle },
  { value: "community" as Page, label: "Community", icon: HeartHandshake },
]

const caregiverNav = [
  { value: "today" as Page, label: "Today’s care", icon: ListChecks },
  { value: "care" as Page, label: "Care plan", icon: ClipboardCheck },
  { value: "log" as Page, label: "Log progress", icon: CheckCircle2 },
  { value: "progress" as Page, label: "Progress", icon: TrendingUp },
  { value: "updates" as Page, label: "Updates", icon: MessageCircle },
  { value: "community" as Page, label: "Community", icon: HeartHandshake },
]

function PoweredBy() {
  return (
    <a className="powered-by" href="https://eurekawebsites.tech" target="_blank" rel="noreferrer">
      <img src={`${import.meta.env.BASE_URL}eureka-tech-secondary-bird-512.png`} alt="" />
      <span>POWERED BY EUREKA TECH</span>
    </a>
  )
}

function RoleGate({ onChoose }: { onChoose: (role: Role) => void }) {
  return (
    <main className="demo-gate">
      <section className="demo-gate-card">
        <div className="gate-brand-mark"><HeartHandshake /></div>
        <p className="eyebrow">CareCircle</p>
        <h1>One care plan. Everyone in step.</h1>
        <p className="gate-subtitle">Interactive web app/PWA concept demo</p>
        <span className="demo-badge">Demo mode · Sample data</span>
        <div className="role-options">
          {(Object.keys(roleDetails) as Role[]).map((role) => {
            const details = roleDetails[role]
            return (
              <button className="role-option" key={role} onClick={() => onChoose(role)}>
                <span className={`role-avatar ${details.color}`}>{details.initials}</span>
                <span className="role-copy"><strong>{details.label}</strong><small>{details.name} · {details.description}</small></span>
                <ChevronRight />
              </button>
            )
          })}
        </div>
        <p className="gate-note"><LockKeyhole /> Private family coordination concept</p>
        <PoweredBy />
      </section>
    </main>
  )
}

export default function App() {
  const [role, setRole] = useState<Role | null>(null)
  const [activePage, setActivePage] = useState<Page>("overview")
  const [tasks, setTasks] = useState(initialTasks)
  const [updates, setUpdates] = useState(initialUpdates)
  const [note, setNote] = useState("")
  const [goalBumps, setGoalBumps] = useState<Record<number, number>>({})
  const [logGoal, setLogGoal] = useState("Independent transitions")
  const [logOutcome, setLogOutcome] = useState("Completed with one prompt")
  const [logNote, setLogNote] = useState("")
  const [logSaved, setLogSaved] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [communityPosts, setCommunityPosts] = useState(initialCommunityPosts)
  const [communityDraft, setCommunityDraft] = useState("")
  const [communityCategory, setCommunityCategory] = useState<CommunityCategory>("Question")
  const [communityFilter, setCommunityFilter] = useState<"All" | CommunityCategory>("All")
  const [supportedPosts, setSupportedPosts] = useState<number[]>([])
  const [openReplies, setOpenReplies] = useState<number[]>([])
  const [reportedPosts, setReportedPosts] = useState<number[]>([])

  const completed = tasks.filter((task) => task.done).length
  const completion = Math.round((completed / tasks.length) * 100)
  const details = role ? roleDetails[role] : roleDetails.parent
  const navItems = role === "caregiver" ? caregiverNav : parentNav
  const goals = useMemo(() => careGoals.map((goal) => ({ ...goal, progress: Math.min(100, goal.progress + (goalBumps[goal.id] ?? 0)) })), [goalBumps])

  function chooseRole(nextRole: Role) { setRole(nextRole); setActivePage(nextRole === "parent" ? "overview" : "today") }
  function switchRole() { setRole(null); setInviteOpen(false) }
  function toggleTask(id: number, checked: boolean) { setTasks((current) => current.map((task) => task.id === id ? { ...task, done: checked, completedBy: checked ? details.name : undefined } : task)) }
  function bumpGoal(id: number, amount = 4) { setGoalBumps((current) => ({ ...current, [id]: (current[id] ?? 0) + amount })) }

  function addUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = note.trim()
    if (!body || !role) return
    setUpdates((current) => [{ id: Date.now(), author: details.name, role: details.label, initials: details.initials, time: "Just now", body, tone: role === "parent" ? "blue" : "peach" }, ...current])
    setNote("")
  }

  function saveProgress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const goal = careGoals.find((item) => item.title === logGoal)
    if (goal) bumpGoal(goal.id, 4)
    setLogSaved(true)
    setLogNote("")
  }

  function addCommunityPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = communityDraft.trim()
    if (!body || !role) return
    setCommunityPosts((current) => [{ id: Date.now(), author: details.name, role: details.label, initials: details.initials, tone: details.color, time: "Just now", category: communityCategory, body, supports: 0, replies: [] }, ...current])
    setCommunityDraft("")
    setCommunityFilter("All")
  }

  function toggleSupport(id: number) {
    setSupportedPosts((current) => current.includes(id) ? current.filter((postId) => postId !== id) : [...current, id])
  }

  function toggleReplies(id: number) {
    setOpenReplies((current) => current.includes(id) ? current.filter((postId) => postId !== id) : [...current, id])
  }

  if (!role) return <RoleGate onChoose={chooseRole} />

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand-row"><span className="brand-mark" aria-hidden="true"><HeartHandshake /></span><div><p className="brand-name">CareCircle</p><p className="brand-subtitle">Care, connected.</p></div></div>
        <div className="child-mini-card"><span className="child-avatar">E</span><div><p className="eyebrow">Care space</p><p className="child-mini-name">Elio’s circle</p></div><span className="demo-mini-badge">Demo</span></div>
        <div className="role-context"><span className={`mini-avatar ${details.color}`}>{details.initials}</span><div><small>Viewing as</small><strong>{details.label}</strong></div></div>
        <nav className="main-nav" aria-label="CareCircle sections">
          {navItems.map((item) => { const Icon = item.icon; return <button key={item.value} className={`nav-item ${activePage === item.value ? "is-active" : ""}`} onClick={() => setActivePage(item.value)}><Icon /><span>{item.label}</span></button> })}
        </nav>
        <div className="sidebar-footer">
          <button className="switch-role-button" onClick={switchRole}><ArrowLeftRight /> Switch role</button>
          <div className="privacy-note"><ShieldCheck /><div><strong>Private care circle</strong><span>Only invited caregivers can see Elio’s information.</span></div></div>
          <PoweredBy />
        </div>
      </aside>

      <main className="app-main">
        <header className="topbar">
          <div><p className="eyebrow">Friday, August 28</p><h1>{activePage === "overview" ? `Good morning, ${details.name}` : navItems.find((item) => item.value === activePage)?.label}</h1></div>
          <div className="topbar-actions"><span className="sample-data-label">Demo · Sample data</span><button className="icon-button" aria-label="Notifications"><Bell /><span className="notification-dot" /></button><button className="top-role-button" aria-label={`Switch role. Viewing as ${details.name} · ${details.label}`} onClick={switchRole}><span className={`mini-avatar ${details.color}`}>{details.initials}</span><span><small>Viewing as</small><strong>{details.name} · {details.label}</strong></span><ArrowLeftRight /></button></div>
        </header>

        {activePage === "overview" && <OverviewPage completed={completed} completion={completion} tasks={tasks} toggleTask={toggleTask} setActivePage={setActivePage} />}
        {activePage === "today" && <TodayPage completed={completed} tasks={tasks} toggleTask={toggleTask} setActivePage={setActivePage} />}
        {activePage === "care" && <CarePlanPage role={role} goals={goals} bumpGoal={bumpGoal} setActivePage={setActivePage} />}
        {activePage === "log" && <LogProgressPage details={details} logGoal={logGoal} setLogGoal={setLogGoal} logOutcome={logOutcome} setLogOutcome={setLogOutcome} logNote={logNote} setLogNote={setLogNote} logSaved={logSaved} setLogSaved={setLogSaved} saveProgress={saveProgress} />}
        {activePage === "progress" && <ProgressPage goals={goals} />}
        {activePage === "circle" && <CirclePage inviteOpen={inviteOpen} setInviteOpen={setInviteOpen} />}
        {activePage === "updates" && <UpdatesPage role={role} details={details} note={note} setNote={setNote} addUpdate={addUpdate} updates={updates} setActivePage={setActivePage} />}
        {activePage === "community" && <CommunityPage details={details} posts={communityPosts} draft={communityDraft} setDraft={setCommunityDraft} category={communityCategory} setCategory={setCommunityCategory} filter={communityFilter} setFilter={setCommunityFilter} supportedPosts={supportedPosts} toggleSupport={toggleSupport} openReplies={openReplies} toggleReplies={toggleReplies} reportedPosts={reportedPosts} reportPost={(id) => setReportedPosts((current) => current.includes(id) ? current : [...current, id])} addPost={addCommunityPost} />}
      </main>
    </div>
  )
}

function OverviewPage({ completed, completion, tasks, toggleTask, setActivePage }: { completed: number; completion: number; tasks: Task[]; toggleTask: (id: number, checked: boolean) => void; setActivePage: (page: Page) => void }) {
  return <div className="page-content">
    <section className="today-grid">
      <article className="daily-card"><div className="daily-copy"><span className="pill pill-light"><Sparkles /> Today’s care</span><h2>A steady day, one small step at a time.</h2><p>{completed} of {tasks.length} care items are complete. Everyone in Elio’s circle can see what comes next.</p><div className="circle-people"><span className="mini-avatar blue">RP</span><span className="mini-avatar peach">CG</span><span className="mini-avatar sage">NA</span><span className="people-label">3 caregivers active today</span></div></div><div className="completion-ring" style={{ "--progress": `${completion * 3.6}deg` } as React.CSSProperties}><div><strong>{completion}%</strong><span>complete</span></div></div></article>
      <article className="week-card"><div className="card-title-row"><div><p className="eyebrow">This week</p><h3>Consistency</h3></div><span className="trend-badge"><ArrowUpRight /> 14%</span></div><div className="week-bars">{[72, 88, 64, 92, completion, 0, 0].map((value, index) => <div key={index} className="day-bar"><div className="bar-track"><span style={{ height: `${value}%` }} /></div><small>{["M", "T", "W", "T", "F", "S", "S"][index]}</small></div>)}</div></article>
    </section>
    <section className="overview-actions">
      <button className="overview-action" onClick={() => setActivePage("today")}><span className="action-icon sage"><ListChecks /></span><span><small>Daily coordination</small><strong>Review today’s care</strong><em>{completed}/{tasks.length} completed</em></span><ChevronRight /></button>
      <button className="overview-action" onClick={() => setActivePage("care")}><span className="action-icon blue"><Goal /></span><span><small>Shared strategy</small><strong>Open care plan</strong><em>3 active goals</em></span><ChevronRight /></button>
      <button className="overview-action" onClick={() => setActivePage("updates")}><span className="action-icon peach"><MessageCircle /></span><span><small>Latest handoff</small><strong>Read caregiver updates</strong><em>New note from Nadia</em></span><ChevronRight /></button>
    </section>
    <section className="content-grid"><article className="panel checklist-panel"><div className="panel-heading"><div><p className="eyebrow">Shared checklist</p><h2>Today’s care</h2></div><button className="text-action" onClick={() => setActivePage("today")}>View all <ChevronRight /></button></div><TaskList tasks={tasks.slice(0, 3)} toggleTask={toggleTask} /></article><div className="side-stack"><GoalSpotlight /><HandoffCard /></div></section>
  </div>
}

function TodayPage({ completed, tasks, toggleTask, setActivePage }: { completed: number; tasks: Task[]; toggleTask: (id: number, checked: boolean) => void; setActivePage: (page: Page) => void }) {
  return <div className="page-content"><section className="section-intro"><div><p className="eyebrow">Shared daily care</p><h2>Everyone knows what comes next</h2><p>Each item includes clear instructions, its status, and who completed it.</p></div><span className="status-pill"><CheckCircle2 /> {completed}/{tasks.length} complete</span></section><section className="content-grid"><article className="panel checklist-panel"><div className="panel-heading"><div><p className="eyebrow">Friday, August 28</p><h2>Elio’s care checklist</h2></div><span className="count-badge">{completed}/{tasks.length} done</span></div><TaskList tasks={tasks} toggleTask={toggleTask} /></article><div className="side-stack"><GoalSpotlight /><article className="panel handoff-card"><div className="panel-heading compact"><div><p className="eyebrow">Before you begin</p><h3>Latest context</h3></div><span className="mini-avatar sage">NA</span></div><p>“Elio responded well to the quiet reset at lunch. The breathing card is in the front pocket.”</p><button className="text-action" onClick={() => setActivePage("updates")}>Open all updates <ChevronRight /></button></article></div></section></div>
}

function CarePlanPage({ role, goals, bumpGoal, setActivePage }: { role: Role; goals: GoalData[]; bumpGoal: (id: number) => void; setActivePage: (page: Page) => void }) {
  return <div className="page-content"><section className="section-intro"><div><p className="eyebrow">Shared care plan</p><h2>What we’re working on together</h2><p>Clear goals and practical interventions keep every caregiver consistent.</p></div><span className="status-pill"><CheckCircle2 /> Plan active</span></section>{role === "caregiver" && <div className="access-banner"><LockKeyhole /><div><strong>Caregiver view</strong><span>You can follow the plan and log progress. Only a parent can edit goals or permissions.</span></div></div>}<section className="goal-grid">{goals.map((goal) => <GoalCard key={goal.id} goal={goal} role={role} onLog={() => role === "parent" ? bumpGoal(goal.id) : setActivePage("log")} />)}</section><InterventionPanel /></div>
}

function LogProgressPage({ details, logGoal, setLogGoal, logOutcome, setLogOutcome, logNote, setLogNote, logSaved, setLogSaved, saveProgress }: { details: typeof roleDetails.parent | typeof roleDetails.caregiver; logGoal: string; setLogGoal: (value: string) => void; logOutcome: string; setLogOutcome: (value: string) => void; logNote: string; setLogNote: (value: string) => void; logSaved: boolean; setLogSaved: (value: boolean) => void; saveProgress: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="page-content"><section className="section-intro"><div><p className="eyebrow">Measurable progress</p><h2>Record what happened</h2><p>A quick structured note connects today’s care to Elio’s longer-term goals.</p></div></section><section className="log-layout"><form className="panel progress-form" onSubmit={saveProgress}>{logSaved && <div className="success-banner"><CheckCircle2 /><div><strong>Progress saved for this demo</strong><span>The selected goal increased and will reset when the page refreshes.</span></div></div>}<label><span>Care goal</span><select value={logGoal} onChange={(event) => { setLogGoal(event.target.value); setLogSaved(false) }}>{careGoals.map((goal) => <option key={goal.id}>{goal.title}</option>)}</select></label><fieldset><legend>What happened?</legend><div className="choice-grid">{["Completed independently", "Completed with one prompt", "Needed extra support"].map((outcome) => <button type="button" className={logOutcome === outcome ? "is-selected" : ""} key={outcome} onClick={() => { setLogOutcome(outcome); setLogSaved(false) }}>{outcome}</button>)}</div></fieldset><label><span>Observation <small>Optional</small></span><textarea rows={5} value={logNote} onChange={(event) => setLogNote(event.target.value)} placeholder="What helped? What should the next caregiver know?" /></label><Button type="submit"><CheckCircle2 /> Save progress entry</Button></form><aside className="panel log-preview"><p className="eyebrow">Entry preview</p><h3>{logGoal}</h3><div className="preview-row"><span>Outcome</span><strong>{logOutcome}</strong></div><div className="preview-row"><span>Recorded by</span><strong>{details.name} · {details.label}</strong></div><div className="preview-row"><span>Time</span><strong>Today · Just now</strong></div><p>This entry will update the goal’s progress and appear in the shared history.</p></aside></section></div>
}

function ProgressPage({ goals }: { goals: GoalData[] }) {
  return <div className="page-content"><section className="section-intro"><div><p className="eyebrow">Progress over time</p><h2>Small wins are becoming patterns</h2><p>Care entries are translated into a simple view of what is helping Elio.</p></div><span className="date-pill"><CalendarDays /> Aug 3–28</span></section><section className="progress-summary-grid"><article className="panel momentum-card"><div className="card-title-row"><div><p className="eyebrow">Overall momentum</p><h3>Care plan progress</h3></div><span className="trend-badge"><ArrowUpRight /> 16%</span></div><div className="large-metric"><strong>68%</strong><span>from 52% at the start of August</span></div><div className="month-chart">{[34, 42, 39, 51, 48, 57, 61, 58, 68].map((value, index) => <span key={index} style={{ height: `${value}%` }} />)}</div><div className="chart-axis"><span>Aug 3</span><span>Aug 28</span></div></article><article className="panel wins-card"><div className="wins-icon"><Sparkles /></div><p className="eyebrow">This month</p><h3>18 meaningful wins</h3><p>Caregivers recorded successful routines, clear communication, and independent transitions.</p><div className="win-people"><span className="mini-avatar blue">RP</span><span>Robin logged 7</span><span className="mini-avatar peach">CG</span><span>Casey logged 6</span><span className="mini-avatar sage">NA</span><span>Nadia logged 5</span></div></article></section><section className="panel goals-table"><div className="panel-heading"><div><p className="eyebrow">Goal breakdown</p><h2>Where progress is happening</h2></div></div>{goals.map((goal) => <div className="goal-table-row" key={goal.id}><span className="goal-dot" style={{ background: goal.color }} /><div><strong>{goal.title}</strong><small>{goal.trend}</small></div><Progress value={goal.progress} className="table-progress" /><strong>{goal.progress}%</strong></div>)}</section></div>
}

function CirclePage({ inviteOpen, setInviteOpen }: { inviteOpen: boolean; setInviteOpen: (value: boolean) => void }) {
  const permissions: [string, boolean, boolean][] = [["View daily care", true, true], ["Complete assigned care", true, true], ["Log progress and updates", true, true], ["Edit care plan", true, false], ["Invite or remove members", true, false]]
  return <div className="page-content"><section className="section-intro"><div><p className="eyebrow">Private care circle</p><h2>The right people, with the right access</h2><p>Parents control who can see Elio’s information and what each person can do.</p></div><Button onClick={() => setInviteOpen(true)}><Plus /> Invite caregiver</Button></section>{inviteOpen && <div className="panel invite-demo"><div><p className="eyebrow">Invitation preview</p><h3>Invite a trusted caregiver</h3><p>Production will send a secure invitation. This demo shows the intended workflow only.</p></div><Button variant="outline" onClick={() => setInviteOpen(false)}>Close preview</Button></div>}<section className="members-grid"><MemberCard initials="RP" tone="blue" name="Robin" relation="Parent" access="Full access" detail="Care plan, members, daily care, progress, and updates" /><MemberCard initials="WP" tone="ink" name="Wren" relation="Parent" access="Full access" detail="Care plan, members, daily care, progress, and updates" /><MemberCard initials="CG" tone="peach" name="Casey" relation="Caregiver" access="Daily care" detail="Checklist, care strategies, progress entries, and updates" /><MemberCard initials="NA" tone="sage" name="Nadia" relation="Aunt & caregiver" access="Daily care" detail="Checklist, care strategies, progress entries, and updates" /></section><section className="panel permission-table"><div className="panel-heading"><div><p className="eyebrow">Role permissions</p><h2>Clear boundaries by role</h2></div></div><div className="permission-row header"><span>Capability</span><span>Parent</span><span>Caregiver</span></div>{permissions.map(([label, parent, caregiver]) => <div className="permission-row" key={label}><strong>{label}</strong><span>{parent ? <Check /> : "—"}</span><span>{caregiver ? <Check /> : "—"}</span></div>)}</section></div>
}

function UpdatesPage({ role, details, note, setNote, addUpdate, updates, setActivePage }: { role: Role; details: typeof roleDetails.parent | typeof roleDetails.caregiver; note: string; setNote: (value: string) => void; addUpdate: (event: FormEvent<HTMLFormElement>) => void; updates: Update[]; setActivePage: (page: Page) => void }) {
  return <div className="page-content"><section className="section-intro"><div><p className="eyebrow">Caregiver updates</p><h2>One clear place for every handoff</h2><p>Share helpful context without losing it in texts or group chats.</p></div><div className="member-stack"><span className="mini-avatar blue">RP</span><span className="mini-avatar peach">CG</span><span className="mini-avatar sage">NA</span><span className="mini-avatar ink">+1</span></div></section><section className="updates-layout"><div><form className="panel update-composer" onSubmit={addUpdate}><span className={`mini-avatar ${details.color}`}>{details.initials}</span><label><span className="sr-only">Share an update</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Share a care update, observation, or handoff note…" rows={3} /></label><Button type="submit" disabled={!note.trim()}><MessageCircle /> Share update</Button></form><div className="update-feed">{updates.map((update) => <article className="panel update-card" key={update.id}><span className={`mini-avatar ${update.tone}`}>{update.initials}</span><div className="update-body"><div className="update-meta"><div><strong>{update.author}</strong><span>{update.role}</span></div><time>{update.time}</time></div><p>{update.body}</p></div></article>)}</div></div><aside className="panel circle-panel"><p className="eyebrow">Elio’s care circle</p><h3>Everyone stays informed</h3><CircleMember initials="RP" tone="blue" name="Robin" detail="Parent · Full access" online /><CircleMember initials="CG" tone="peach" name="Casey" detail="Caregiver · Daily care" online /><CircleMember initials="NA" tone="sage" name="Nadia" detail="Aunt · Daily care" /><CircleMember initials="WP" tone="ink" name="Wren" detail="Parent · Full access" />{role === "parent" && <Button variant="outline" className="invite-button" onClick={() => setActivePage("circle")}><UserRoundCog /> Manage care circle</Button>}</aside></section></div>
}

function CommunityPage({ details, posts, draft, setDraft, category, setCategory, filter, setFilter, supportedPosts, toggleSupport, openReplies, toggleReplies, reportedPosts, reportPost, addPost }: { details: typeof roleDetails.parent | typeof roleDetails.caregiver; posts: CommunityPost[]; draft: string; setDraft: (value: string) => void; category: CommunityCategory; setCategory: (value: CommunityCategory) => void; filter: "All" | CommunityCategory; setFilter: (value: "All" | CommunityCategory) => void; supportedPosts: number[]; toggleSupport: (id: number) => void; openReplies: number[]; toggleReplies: (id: number) => void; reportedPosts: number[]; reportPost: (id: number) => void; addPost: (event: FormEvent<HTMLFormElement>) => void }) {
  const categories: ("All" | CommunityCategory)[] = ["All", "Question", "Tip", "Resource", "Milestone"]
  const visiblePosts = filter === "All" ? posts : posts.filter((post) => post.category === filter)
  const categoryIcons = { Question: CircleHelp, Tip: Lightbulb, Resource: Megaphone, Milestone: Sparkles }

  return <div className="page-content"><section className="community-hero"><div><span className="pill pill-light"><HeartHandshake /> CareCircle Community</span><h2>Shared experience. Practical support.</h2><p>A members-only space to ask questions, exchange helpful ideas, share resources, and celebrate progress—without exposing a child’s private care plan.</p></div><div className="community-trust"><ShieldCheck /><div><strong>Registered members only</strong><span>Care-circle details remain private. Community posts use only what members choose to share.</span></div></div></section><section className="community-layout"><div><form className="panel community-composer" onSubmit={addPost}><div className="composer-heading"><span className={`mini-avatar ${details.color}`}>{details.initials}</span><div><strong>Share with the community</strong><small>Post a question, idea, resource, or milestone.</small></div></div><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="What would you like to share?" rows={4} /><div className="composer-actions"><label><span className="sr-only">Post category</span><select value={category} onChange={(event) => setCategory(event.target.value as CommunityCategory)}><option>Question</option><option>Tip</option><option>Resource</option><option>Milestone</option></select></label><Button type="submit" disabled={!draft.trim()}><Plus /> Post to community</Button></div></form><div className="community-filters" aria-label="Filter community posts">{categories.map((item) => <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="community-feed">{visiblePosts.map((post) => { const CategoryIcon = categoryIcons[post.category]; const supported = supportedPosts.includes(post.id); const repliesOpen = openReplies.includes(post.id); const reported = reportedPosts.includes(post.id); return <article className="panel community-post" key={post.id}><div className="community-post-header"><span className={`member-avatar ${post.tone}`}>{post.initials}</span><div><strong>{post.author}</strong><span>{post.role} · {post.time}</span></div><span className={`community-category ${post.category.toLowerCase()}`}><CategoryIcon /> {post.category}</span></div><p>{post.body}</p><div className="community-post-actions"><button className={supported ? "is-supported" : ""} onClick={() => toggleSupport(post.id)}><Heart /> {post.supports + (supported ? 1 : 0)} Supports</button><button onClick={() => toggleReplies(post.id)}><MessageCircle /> {post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}</button><button className="report-action" onClick={() => reportPost(post.id)}><Flag /> {reported ? "Reported" : "Report"}</button></div>{repliesOpen && <div className="community-replies">{post.replies.length > 0 ? post.replies.map((reply, index) => <div key={index}><span className="mini-avatar sage">CC</span><p>{reply}</p></div>) : <p className="empty-replies">No replies yet. Be the first to offer support.</p>}</div>}</article>})}</div></div><aside className="community-sidebar"><article className="panel community-guidelines"><p className="eyebrow">Community promise</p><h3>Helpful, respectful, and safe</h3><ul><li><HeartHandshake />Lead with support and lived experience.</li><li><LockKeyhole />Protect children’s private information.</li><li><ShieldCheck />Report anything unsafe or inappropriate.</li></ul></article><article className="panel community-scope"><p className="eyebrow">Focused network</p><h3>Community—not a public social platform</h3><p>The MVP keeps the experience purposeful: posts, replies, supportive reactions, and basic moderation for registered CareCircle members.</p></article></aside></section></div>
}

function TaskList({ tasks, toggleTask }: { tasks: Task[]; toggleTask: (id: number, checked: boolean) => void }) { return <div className="task-list">{tasks.map((task) => <label key={task.id} className={`task-row ${task.done ? "is-done" : ""}`}><Checkbox checked={task.done} onCheckedChange={(checked) => toggleTask(task.id, checked === true)} aria-label={`Mark ${task.title} ${task.done ? "incomplete" : "complete"}`} /><span className="task-time">{task.time}</span><span className="task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span>{task.done ? <span className="completed-by"><Check /> {task.completedBy}</span> : <Clock3 className="task-status" />}</label>)}</div> }
function GoalSpotlight() { return <article className="panel goal-spotlight"><div className="spotlight-icon"><Goal /></div><p className="eyebrow">Goal spotlight</p><h3>Independent transitions</h3><p>Elio completed 5 of 7 transitions this week with one prompt or less.</p><Progress value={68} className="goal-progress" /><div className="progress-label"><span>Weekly goal</span><strong>5 / 7</strong></div></article> }
function HandoffCard() { return <article className="panel handoff-card"><div className="panel-heading compact"><div><p className="eyebrow">Latest handoff</p><h3>From Nadia</h3></div><span className="mini-avatar sage">NA</span></div><p>“Quiet reset went smoothly. Reading folder is in the front pocket.”</p><span className="timestamp">1:10 PM · Today</span></article> }
function GoalCard({ goal, role, onLog }: { goal: GoalData; role: Role; onLog: () => void }) { return <article className="panel care-goal-card" style={{ "--goal-color": goal.color } as React.CSSProperties}><div className="goal-number">0{goal.id}</div><div className="goal-card-heading"><span className="goal-icon"><Goal /></span><span className="goal-type">Measurable goal</span></div><h3>{goal.title}</h3><p>{goal.description}</p><div className="goal-metric"><strong>{goal.progress}%</strong><span>{goal.trend}</span></div><Progress value={goal.progress} className="care-progress" /><Button variant="outline" className="log-button" onClick={onLog}>{role === "parent" ? <><Plus /> Log a success</> : <><CheckCircle2 /> Record progress</>}</Button></article> }
function InterventionPanel() { return <article className="panel intervention-panel"><div className="panel-heading"><div><p className="eyebrow">Active intervention</p><h2>Pause · Name · Choose</h2></div><span className="pill sage-pill">Used by all caregivers</span></div><p className="intervention-purpose">Use this approach during difficult transitions so Elio receives the same support from every caregiver.</p><div className="intervention-steps"><div><span>1</span><strong>Pause</strong><p>Offer a calm ten-second pause before giving another direction.</p></div><div><span>2</span><strong>Name</strong><p>Help Elio identify the feeling or need using words or the visual card.</p></div><div><span>3</span><strong>Choose</strong><p>Offer two clear next-step options and let Elio choose.</p></div></div></article> }
function MemberCard({ initials, tone, name, relation, access, detail }: { initials: string; tone: string; name: string; relation: string; access: string; detail: string }) { return <article className="panel member-card"><div className="member-heading"><span className={`member-avatar ${tone}`}>{initials}</span><span className="access-chip"><ShieldCheck /> {access}</span></div><h3>{name}</h3><p>{relation}</p><small>{detail}</small><Button variant="outline"><UserRoundCog /> Manage access</Button></article> }
function CircleMember({ initials, tone, name, detail, online = false }: { initials: string; tone: string; name: string; detail: string; online?: boolean }) { return <div className="circle-member"><span className={`mini-avatar ${tone}`}>{initials}</span><div><strong>{name}</strong><small>{detail}</small></div>{online && <span className="online-dot" />}</div> }
