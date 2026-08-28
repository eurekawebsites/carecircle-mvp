import { type FormEvent, useMemo, useState } from "react"
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Goal,
  HeartHandshake,
  Home,
  MessageCircle,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Task = {
  id: number
  time: string
  title: string
  detail: string
  done: boolean
  completedBy?: string
}

type Update = {
  id: number
  author: string
  role: string
  initials: string
  time: string
  body: string
  tone: "sage" | "blue" | "peach"
}

const initialTasks: Task[] = [
  { id: 1, time: "8:00 AM", title: "Morning routine", detail: "Breakfast, vitamins, and backpack check", done: true, completedBy: "Robin" },
  { id: 2, time: "12:30 PM", title: "Quiet reset", detail: "10 minutes with the breathing card", done: true, completedBy: "Nadia" },
  { id: 3, time: "4:00 PM", title: "Reading practice", detail: "Read together for 15 minutes", done: false },
  { id: 4, time: "7:30 PM", title: "Evening check-in", detail: "Choose a feeling and share one good moment", done: false },
]

const initialUpdates: Update[] = [
  { id: 1, author: "Nadia", role: "Aunt & caregiver", initials: "NA", time: "Today, 1:10 PM", body: "The quiet reset worked really well today. Milo picked the breathing card without prompting and returned to lunch calmly.", tone: "sage" },
  { id: 2, author: "Robin", role: "Parent", initials: "RP", time: "Today, 8:24 AM", body: "Morning routine is done. Backpack and reading folder are by the door for pickup.", tone: "blue" },
  { id: 3, author: "Casey", role: "Caregiver", initials: "CG", time: "Yesterday, 6:40 PM", body: "We reached the three-step bedtime routine without reminders. That makes four successful evenings this week!", tone: "peach" },
]

const careGoals = [
  { id: 1, title: "Independent transitions", description: "Move between daily activities using one verbal prompt or less.", progress: 68, trend: "+12% this month", color: "var(--sage)" },
  { id: 2, title: "Express needs clearly", description: "Use a word, phrase, or visual card before frustration builds.", progress: 54, trend: "+8% this month", color: "var(--blue)" },
  { id: 3, title: "Evening routine", description: "Complete the three-step routine with consistent support.", progress: 82, trend: "+18% this month", color: "var(--coral)" },
]

const navItems = [
  { value: "today", label: "Today", icon: Home },
  { value: "care", label: "Care plan", icon: ClipboardCheck },
  { value: "progress", label: "Progress", icon: TrendingUp },
  { value: "updates", label: "Updates", icon: MessageCircle },
]

export default function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [updates, setUpdates] = useState(initialUpdates)
  const [note, setNote] = useState("")
  const [viewer, setViewer] = useState<"Robin" | "Casey">("Robin")
  const [goalBumps, setGoalBumps] = useState<Record<number, number>>({})

  const completed = tasks.filter((task) => task.done).length
  const completion = Math.round((completed / tasks.length) * 100)
  const viewerRole = viewer === "Robin" ? "Parent" : "Caregiver"

  const goals = useMemo(
    () => careGoals.map((goal) => ({ ...goal, progress: Math.min(100, goal.progress + (goalBumps[goal.id] ?? 0)) })),
    [goalBumps],
  )

  function toggleTask(id: number, checked: boolean) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: checked, completedBy: checked ? viewer : undefined } : task))
  }

  function addUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = note.trim()
    if (!body) return
    setUpdates((current) => [{
      id: Date.now(), author: viewer, role: viewerRole,
      initials: viewer === "Robin" ? "RP" : "CG", time: "Just now", body,
      tone: viewer === "Robin" ? "blue" : "peach",
    }, ...current])
    setNote("")
  }

  return (
    <Tabs defaultValue="today" orientation="vertical" className="app-shell">
      <aside className="app-sidebar">
        <div className="brand-row">
          <span className="brand-mark" aria-hidden="true"><HeartHandshake /></span>
          <div><p className="brand-name">CareCircle</p><p className="brand-subtitle">Care, connected.</p></div>
        </div>

        <div className="child-mini-card">
          <span className="child-avatar">M</span>
          <div><p className="eyebrow">Care space</p><p className="child-mini-name">Milo&apos;s circle</p></div>
          <ChevronDown className="ml-auto size-4 text-[var(--ink-muted)]" />
        </div>

        <TabsList className="main-nav" aria-label="CareCircle sections">
          {navItems.map((item) => {
            const Icon = item.icon
            return <TabsTrigger key={item.value} value={item.value} className="nav-item"><Icon /><span>{item.label}</span></TabsTrigger>
          })}
        </TabsList>

        <div className="privacy-note">
          <ShieldCheck />
          <div><strong>Private care circle</strong><span>Only invited caregivers can see Milo&apos;s information.</span></div>
        </div>
        <p className="powered">Powered by Eureka Websites.</p>
      </aside>

      <main className="app-main">
        <header className="topbar">
          <div><p className="eyebrow">Friday, August 28</p><h1>Good morning, {viewer}</h1></div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications"><Bell /><span className="notification-dot" /></button>
            <div className="viewer-switcher">
              <span className={`mini-avatar ${viewer === "Robin" ? "blue" : "peach"}`}>{viewer === "Robin" ? "RP" : "CG"}</span>
              <label><span>Viewing as</span><select value={viewer} onChange={(event) => setViewer(event.target.value as "Robin" | "Casey")}><option value="Robin">Robin · Parent</option><option value="Casey">Casey · Caregiver</option></select></label>
            </div>
          </div>
        </header>

        <TabsContent value="today" className="page-content">
          <section className="today-grid">
            <article className="daily-card">
              <div className="daily-copy">
                <span className="pill pill-light"><Sparkles /> Today&apos;s care</span>
                <h2>A steady day, one small step at a time.</h2>
                <p>{completed} of {tasks.length} care items are complete. Everyone in Milo&apos;s circle can see what comes next.</p>
                <div className="circle-people" aria-label="Care circle members"><span className="mini-avatar blue">RP</span><span className="mini-avatar peach">CG</span><span className="mini-avatar sage">NA</span><span className="people-label">3 caregivers active today</span></div>
              </div>
              <div className="completion-ring" style={{ "--progress": `${completion * 3.6}deg` } as React.CSSProperties}><div><strong>{completion}%</strong><span>complete</span></div></div>
            </article>

            <article className="week-card">
              <div className="card-title-row"><div><p className="eyebrow">This week</p><h3>Consistency</h3></div><span className="trend-badge"><ArrowUpRight /> 14%</span></div>
              <div className="week-bars" aria-label="Weekly completion chart">
                {[72, 88, 64, 92, completion, 0, 0].map((value, index) => <div key={index} className="day-bar"><div className="bar-track"><span style={{ height: `${value}%` }} /></div><small>{["M", "T", "W", "T", "F", "S", "S"][index]}</small></div>)}
              </div>
            </article>
          </section>

          <section className="content-grid">
            <article className="panel checklist-panel">
              <div className="panel-heading"><div><p className="eyebrow">Shared checklist</p><h2>Today&apos;s care</h2></div><span className="count-badge">{completed}/{tasks.length} done</span></div>
              <div className="task-list">
                {tasks.map((task) => (
                  <label key={task.id} className={`task-row ${task.done ? "is-done" : ""}`}>
                    <Checkbox checked={task.done} onCheckedChange={(checked) => toggleTask(task.id, checked === true)} aria-label={`Mark ${task.title} ${task.done ? "incomplete" : "complete"}`} />
                    <span className="task-time">{task.time}</span>
                    <span className="task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span>
                    {task.done ? <span className="completed-by"><Check /> {task.completedBy}</span> : <Clock3 className="task-status" />}
                  </label>
                ))}
              </div>
            </article>

            <div className="side-stack">
              <article className="panel goal-spotlight">
                <div className="spotlight-icon"><Goal /></div><p className="eyebrow">Goal spotlight</p><h3>Independent transitions</h3>
                <p>Milo completed 5 of 7 transitions this week with one prompt or less.</p><Progress value={68} className="goal-progress" />
                <div className="progress-label"><span>Weekly goal</span><strong>5 / 7</strong></div>
              </article>
              <article className="panel handoff-card">
                <div className="panel-heading compact"><div><p className="eyebrow">Latest handoff</p><h3>From Nadia</h3></div><span className="mini-avatar sage">NA</span></div>
                <p>“Quiet reset went smoothly. Reading folder is in the front pocket.”</p><span className="timestamp">1:10 PM · Today</span>
              </article>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="care" className="page-content">
          <section className="section-intro"><div><p className="eyebrow">Shared care plan</p><h2>What we&apos;re working on together</h2><p>Clear goals and practical interventions keep every caregiver consistent.</p></div><span className="status-pill"><CheckCircle2 /> Plan active</span></section>
          <section className="goal-grid">
            {goals.map((goal) => (
              <article className="panel care-goal-card" key={goal.id} style={{ "--goal-color": goal.color } as React.CSSProperties}>
                <div className="goal-number">0{goal.id}</div><div className="goal-card-heading"><span className="goal-icon"><Goal /></span><button className="more-button" aria-label={`More options for ${goal.title}`}><MoreHorizontal /></button></div>
                <h3>{goal.title}</h3><p>{goal.description}</p><div className="goal-metric"><strong>{goal.progress}%</strong><span>{goal.trend}</span></div>
                <Progress value={goal.progress} className="care-progress" />
                <Button variant="outline" className="log-button" onClick={() => setGoalBumps((current) => ({ ...current, [goal.id]: (current[goal.id] ?? 0) + 4 }))}><Plus /> Log a success</Button>
              </article>
            ))}
          </section>
          <article className="panel intervention-panel">
            <div className="panel-heading"><div><p className="eyebrow">Active intervention</p><h2>Pause · Name · Choose</h2></div><span className="pill sage-pill">Used by all caregivers</span></div>
            <div className="intervention-steps"><div><span>1</span><strong>Pause</strong><p>Offer a calm ten-second pause before giving another direction.</p></div><div><span>2</span><strong>Name</strong><p>Help the child identify the feeling or need using words or the visual card.</p></div><div><span>3</span><strong>Choose</strong><p>Offer two clear next-step options and let the child choose.</p></div></div>
          </article>
        </TabsContent>

        <TabsContent value="progress" className="page-content">
          <section className="section-intro"><div><p className="eyebrow">Progress over time</p><h2>Small wins are becoming patterns</h2><p>Care entries are translated into a simple view of what is helping.</p></div><span className="date-pill"><CalendarDays /> Aug 3–28</span></section>
          <section className="progress-summary-grid">
            <article className="panel momentum-card">
              <div className="card-title-row"><div><p className="eyebrow">Overall momentum</p><h3>Care plan progress</h3></div><span className="trend-badge"><ArrowUpRight /> 16%</span></div>
              <div className="large-metric"><strong>68%</strong><span>from 52% at the start of August</span></div>
              <div className="month-chart" aria-label="August progress trend">{[34, 42, 39, 51, 48, 57, 61, 58, 68].map((value, index) => <span key={index} style={{ height: `${value}%` }} />)}</div>
              <div className="chart-axis"><span>Aug 3</span><span>Aug 28</span></div>
            </article>
            <article className="panel wins-card"><div className="wins-icon"><Sparkles /></div><p className="eyebrow">This month</p><h3>18 meaningful wins</h3><p>Caregivers recorded successful routines, clear communication, and independent transitions.</p><div className="win-people"><span className="mini-avatar blue">RP</span><span>Robin logged 7</span><span className="mini-avatar peach">CG</span><span>Casey logged 6</span><span className="mini-avatar sage">NA</span><span>Nadia logged 5</span></div></article>
          </section>
          <section className="panel goals-table"><div className="panel-heading"><div><p className="eyebrow">Goal breakdown</p><h2>Where progress is happening</h2></div></div>{goals.map((goal) => <div className="goal-table-row" key={goal.id}><span className="goal-dot" style={{ background: goal.color }} /><div><strong>{goal.title}</strong><small>{goal.trend}</small></div><Progress value={goal.progress} className="table-progress" /><strong>{goal.progress}%</strong></div>)}</section>
        </TabsContent>

        <TabsContent value="updates" className="page-content">
          <section className="section-intro"><div><p className="eyebrow">Caregiver updates</p><h2>One clear place for every handoff</h2><p>Share helpful context without losing it in texts or group chats.</p></div><div className="member-stack" aria-label="Four care circle members"><span className="mini-avatar blue">RP</span><span className="mini-avatar peach">CG</span><span className="mini-avatar sage">NA</span><span className="mini-avatar ink">+1</span></div></section>
          <section className="updates-layout">
            <div>
              <form className="panel update-composer" onSubmit={addUpdate}><span className={`mini-avatar ${viewer === "Robin" ? "blue" : "peach"}`}>{viewer === "Robin" ? "RP" : "CG"}</span><label><span className="sr-only">Share an update</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Share a care update, observation, or handoff note…" rows={3} /></label><Button type="submit" disabled={!note.trim()}><MessageCircle /> Share update</Button></form>
              <div className="update-feed">{updates.map((update) => <article className="panel update-card" key={update.id}><span className={`mini-avatar ${update.tone}`}>{update.initials}</span><div className="update-body"><div className="update-meta"><div><strong>{update.author}</strong><span>{update.role}</span></div><time>{update.time}</time></div><p>{update.body}</p></div></article>)}</div>
            </div>
            <aside className="panel circle-panel"><p className="eyebrow">Milo&apos;s care circle</p><h3>Everyone stays informed</h3><div className="circle-member"><span className="mini-avatar blue">RP</span><div><strong>Robin</strong><small>Parent · Full access</small></div><span className="online-dot" /></div><div className="circle-member"><span className="mini-avatar peach">CG</span><div><strong>Casey</strong><small>Caregiver · Daily care</small></div><span className="online-dot" /></div><div className="circle-member"><span className="mini-avatar sage">NA</span><div><strong>Nadia</strong><small>Aunt · Daily care</small></div></div><div className="circle-member"><span className="mini-avatar ink">WP</span><div><strong>Wren</strong><small>Parent · Full access</small></div></div><Button variant="outline" className="invite-button"><Users /> Manage care circle</Button></aside>
          </section>
        </TabsContent>
      </main>
    </Tabs>
  )
}
