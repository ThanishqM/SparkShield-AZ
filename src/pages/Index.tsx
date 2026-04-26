import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Brain,
  CheckCircle2,
  Database,
  Gauge,
  Lock,
  LogIn,
  LogOut,
  MapPin,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  UserCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const cities = ["Phoenix", "Tucson", "Flagstaff", "Mesa", "Tempe"];
const symptoms = ["Fever", "Cough", "Rash", "Fatigue", "Vomiting", "Diarrhea", "Headache", "Shortness of breath"];
const roles = ["Public User", "Clinic Staff", "Public Health Reviewer", "Admin"];

const navItems = [
  ["Home", "home"],
  ["Submit Report", "submit"],
  ["Dashboard", "dashboard"],
  ["Live AI", "live"],
  ["AI Explanation", "gemma"],
  ["Data Sources", "sources"],
  ["Model Card", "model"],
  ["Review Panel", "review"],
  ["Backboard", "backboard"],
  ["Login/Profile", "profile"],
] as const;

const cityData = [
  { city: "Phoenix", risk: 86, reports: 248, top: "Fever, cough", exposure: "Travel + crowded events", level: "High" },
  { city: "Tucson", risk: 64, reports: 132, top: "Rash, fatigue", exposure: "Vector risk", level: "Medium" },
  { city: "Flagstaff", risk: 31, reports: 41, top: "Headache", exposure: "Low travel", level: "Low" },
  { city: "Mesa", risk: 58, reports: 98, top: "Cough, vomiting", exposure: "Clinic signal", level: "Medium" },
  { city: "Tempe", risk: 43, reports: 77, top: "Shortness of breath", exposure: "Crowded event", level: "Low" },
];

const defaultReports = [
  { id: "AZ-2048", location: "Phoenix", symptoms: "Fever, cough, fatigue", score: 91, status: "New" },
  { id: "AZ-2051", location: "Mesa", symptoms: "Rash, fever, wildlife exposure", score: 83, status: "Escalated" },
  { id: "AZ-2057", location: "Tucson", symptoms: "Headache, vomiting, domestic travel", score: 76, status: "Follow-up" },
];

const defaultLiveFeed = [
  "Spike detected in Phoenix respiratory reports",
  "Weather/vector risk elevated near Tucson corridor",
  "Clinic Staff cluster note added for Mesa",
  "Gemma 4 explanation generated for AZ-2057",
];

const riskVariant = (risk: number) => (risk >= 61 ? "high" : risk >= 31 ? "medium" : "low");
const riskLabel = (risk: number) => (risk >= 61 ? "High" : risk >= 31 ? "Medium" : "Low");

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}

function MetricCard({ icon: Icon, label, value, detail }: { icon: typeof Activity; label: string; value: string; detail: string }) {
  return (
    <div className="spark-card spark-hover p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
        </div>
        <div className="rounded-2xl border border-secondary/30 bg-secondary/15 p-3 text-secondary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function MiniBarChart() {
  const bars = [84, 72, 58, 47, 38];

  return (
    <div className="spark-card p-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">Top symptoms</h3>
        <Badge variant="gold">Bar</Badge>
      </div>
      <div className="flex h-48 items-end gap-3">
        {bars.map((bar, index) => (
          <div key={symptoms[index]} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-xl bg-secondary/85 shadow-glow transition-all duration-300 hover:bg-secondary"
              style={{ height: `${bar}%` }}
            />
            <span className="text-xs text-muted-foreground">{symptoms[index].slice(0, 4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniLineChart() {
  return (
    <div className="spark-card p-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">Reports over time</h3>
        <Badge variant="gold">Line</Badge>
      </div>
      <div className="relative h-48 overflow-hidden rounded-2xl border border-border bg-muted/35 p-4">
        <svg viewBox="0 0 420 180" className="h-full w-full" role="img" aria-label="Reports line chart">
          <path
            d="M10 145 C60 130 80 105 125 112 C170 118 178 70 220 80 C260 90 270 38 315 45 C360 52 365 25 410 34"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M10 145 C60 130 80 105 125 112 C170 118 178 70 220 80 C260 90 270 38 315 45 C360 52 365 25 410 34 L410 180 L10 180 Z"
            fill="hsl(var(--secondary) / 0.18)"
          />
        </svg>
      </div>
    </div>
  );
}

function MiniPieChart() {
  return (
    <div className="spark-card p-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">Risk distribution</h3>
        <Badge variant="gold">Pie</Badge>
      </div>
      <div className="grid items-center gap-5 sm:grid-cols-[160px_1fr]">
        <div className="aspect-square rounded-full bg-[conic-gradient(hsl(var(--danger))_0_32%,hsl(var(--warning))_32%_64%,hsl(var(--success))_64%_100%)] p-5 shadow-glow">
          <div className="flex h-full items-center justify-center rounded-full bg-card text-center text-sm font-bold">
            AZ
            <br />
            Signals
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <p><Badge variant="high">High</Badge> 32%</p>
          <p><Badge variant="medium">Medium</Badge> 32%</p>
          <p><Badge variant="low">Low</Badge> 36%</p>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [view, setView] = useState("home");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["Fever", "Cough"]);
  const [risk, setRisk] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(roles[2]);

  const [reports, setReports] = useState(defaultReports);
  const [riskFilter, setRiskFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [liveConfidence, setLiveConfidence] = useState(94);
  const [scanTime, setScanTime] = useState(new Date().toLocaleTimeString());
  const [liveFeed, setLiveFeed] = useState(defaultLiveFeed);

  const [chatMessage, setChatMessage] = useState("");
  const [chatMode, setChatMode] = useState("Check My Symptoms");
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hi, I’m SparkShield AI. Ask me about symptoms, area risk, your report, or recommended actions." },
  ]);

  const [form, setForm] = useState({
    location: "Phoenix",
    age: "26-40",
    duration: "3",
    travel: "domestic",
    animal: "mosquito/tick bites",
    event: "Yes",
    description: "Fever and cough after a large indoor event.",
  });

  useEffect(() => {
    const savedReports = localStorage.getItem("spark_reports");
    const savedLogin = localStorage.getItem("spark_logged_in");
    const savedRole = localStorage.getItem("spark_role");

    if (savedReports) setReports(JSON.parse(savedReports));
    if (savedLogin) setLoggedIn(savedLogin === "true");
    if (savedRole) setRole(savedRole);
  }, []);

  useEffect(() => {
    localStorage.setItem("spark_reports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem("spark_logged_in", String(loggedIn));
    localStorage.setItem("spark_role", role);
  }, [loggedIn, role]);

  useEffect(() => {
    const updates = [
      "New report submitted from Tempe",
      "Phoenix risk score recalculated by AI",
      "Possible fever cluster detected in Tucson",
      "Mesa case moved to reviewer queue",
      "Weather/vector risk scan completed",
      "Gemma 4 generated new explanation summary",
    ];

    const interval = setInterval(() => {
      setLiveConfidence(Math.floor(84 + Math.random() * 13));
      setScanTime(new Date().toLocaleTimeString());
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      setLiveFeed((prev) => [randomUpdate, ...prev.slice(0, 5)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const riskFactors = useMemo(() => {
    let score = 0;

    const hasFever = selectedSymptoms.includes("Fever");
    const hasCough = selectedSymptoms.includes("Cough");
    const hasRash = selectedSymptoms.includes("Rash");
    const hasDiarrhea = selectedSymptoms.includes("Diarrhea");
    const hasVomiting = selectedSymptoms.includes("Vomiting");
    const hasShortness = selectedSymptoms.includes("Shortness of breath");

    if (hasFever && hasCough) score += 25;
    if (hasRash && hasFever) score += 20;
    if (hasDiarrhea || hasVomiting) score += 15;
    if (hasShortness) score += 20;

    if (form.travel === "domestic") score += 10;
    if (form.travel === "international") score += 20;

    if (form.animal === "mosquito/tick bites") score += 20;
    if (form.animal === "livestock" || form.animal === "wildlife") score += 15;

    if (form.event === "Yes") score += 10;

    if (form.location === "Phoenix" || form.location === "Tucson") score += 15;
    if (form.location === "Phoenix" || form.location === "Mesa") score += 10;

    return Math.min(100, Math.max(0, score));
  }, [form, selectedSymptoms]);

  const filteredReports = reports.filter((report) => {
    const matchesRisk = riskFilter === "All" || riskLabel(report.score) === riskFilter;
    const matchesLocation = locationFilter === "All" || report.location === locationFilter;
    const matchesStatus = statusFilter === "All" || report.status === statusFilter;

    return matchesRisk && matchesLocation && matchesStatus;
  });

  const updateReportStatus = (id: string, newStatus: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: newStatus } : report
      )
    );

    setLiveFeed((prev) => [`Report ${id} marked as ${newStatus}`, ...prev.slice(0, 5)]);
  };

  const submitReport = (event: FormEvent) => {
    event.preventDefault();

    const newRisk = riskFactors;
    const newReport = {
      id: `AZ-${Math.floor(3000 + Math.random() * 6000)}`,
      location: form.location,
      symptoms: selectedSymptoms.join(", "),
      score: newRisk,
      status: newRisk >= 61 ? "New" : "Reviewed",
    };

    setRisk(newRisk);
    setReports((prev) => [newReport, ...prev]);
    setLiveFeed((prev) => [`New report submitted from ${form.location} with ${riskLabel(newRisk)} risk`, ...prev.slice(0, 5)]);
    setView("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    );
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;

    const userText = chatMessage.trim();
    let aiText = "";

    if (chatMode === "Check My Symptoms") {
      aiText = `Based on your selected symptoms (${selectedSymptoms.join(", ")}), your current simulated risk score is ${riskFactors}. This is a ${riskLabel(riskFactors)} risk level.`;
    } else if (chatMode === "Risk in My Area") {
      aiText = `${form.location} currently has simulated community and weather/vector signals included in the risk model. Phoenix and Tucson are showing stronger alert patterns.`;
    } else if (chatMode === "Explain My Report") {
      aiText = `Your risk is mainly influenced by symptoms, ${form.travel} travel, ${form.animal} exposure, and crowded event status: ${form.event}.`;
    } else {
      aiText = "Monitor symptoms, avoid crowded places while sick, hydrate, rest, and seek professional medical care if symptoms become severe.";
    }

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
      { sender: "ai", text: aiText },
    ]);
    setChatMessage("");
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => setView("home")}
            className="mr-3 flex shrink-0 items-center gap-2 rounded-xl px-2 py-1 font-black tracking-tight transition hover:text-secondary"
          >
            <ShieldCheck className="h-5 w-5 text-secondary" />
            SparkShield AZ
          </button>

          {navItems.map(([label, target]) => (
            <button
              key={target}
              onClick={() => setView(target)}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition hover:bg-glass hover:text-secondary ${
                view === target ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-16">
        {view === "home" && (
          <>
            <section id="home" className="relative min-h-[76vh] overflow-hidden bg-hero">
              <div className="absolute inset-0 opacity-60">
                <div className="absolute left-0 top-20 h-px w-full animate-scan-line bg-secondary/70" />
              </div>

              <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
                <div className="animate-fade-up">
                  <Badge variant="gold" className="mb-6">Arizona participatory surveillance</Badge>
                  <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
                    SparkShield AZ
                  </h1>
                  <p className="mt-6 max-w-2xl text-xl text-muted-foreground sm:text-2xl">
                    AI-powered outbreak risk detection for Arizona using symptoms, travel, weather/vector risk,
                    animal exposure, and simulated public health signals.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button variant="hero" size="lg" onClick={() => setView("submit")}>
                      <Stethoscope className="h-5 w-5" />
                      Submit Health Report
                    </Button>
                    <Button variant="glass" size="lg" onClick={() => setView("dashboard")}>
                      <Gauge className="h-5 w-5" />
                      View Dashboard
                    </Button>
                  </div>
                </div>

                <div className="spark-card spark-hover self-end p-5 lg:p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="spark-kicker">Live state signal</p>
                      <h2 className="mt-2 text-2xl font-black">Cases rising in your area</h2>
                    </div>
                    <div className="animate-pulse-gold rounded-full bg-secondary/20 p-3 text-secondary">
                      <RadioTower className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <MetricCard icon={Activity} label="Reports" value={String(reports.length)} detail="Statewide intake" />
                    <MetricCard icon={TrendingUp} label="Hotspots" value="3" detail="Phoenix, Mesa, Tucson" />
                    <MetricCard icon={Sparkles} label="Streak" value="12d" detail="Gold participation badge" />
                  </div>
                </div>
              </div>
            </section>

            <Section id="usage">
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <p className="spark-kicker">How this would be used in Arizona</p>
                  <h2 className="mt-3 text-4xl font-black tracking-tight">
                    A premium command layer for early public health awareness.
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "Residents submit daily symptom check-ins",
                    "Clinics review high-risk clusters",
                    "AI explains patterns for reviewers",
                    "Agencies monitor hotspots and escalations",
                  ].map((item) => (
                    <div key={item} className="spark-panel spark-hover p-5">
                      <CheckCircle2 className="mb-4 h-6 w-6 text-secondary" />
                      <p className="font-bold">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </>
        )}

        {view === "submit" && (
          <Section id="submit">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="spark-kicker">Submit Health Report</p>
                <h1 className="mt-2 text-4xl font-black">Participatory signal intake</h1>
              </div>
              <Badge variant="gold">Daily check-in reminder active</Badge>
            </div>

            <form onSubmit={submitReport} className="spark-card grid gap-5 p-6 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                Location
                <select className="spark-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
                  {cities.map((city) => <option key={city}>{city}</option>)}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold">
                Age group
                <select className="spark-input" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })}>
                  {["0-17", "18-25", "26-40", "41-64", "65+"].map((age) => <option key={age}>{age}</option>)}
                </select>
              </label>

              <div className="lg:col-span-2">
                <p className="mb-3 text-sm font-bold">Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <button
                      type="button"
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`rounded-full border px-4 py-2 text-sm font-bold transition hover:border-secondary ${
                        selectedSymptoms.includes(symptom)
                          ? "border-secondary bg-secondary text-secondary-foreground"
                          : "border-border bg-glass text-muted-foreground"
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <label className="grid gap-2 text-sm font-bold">
                Duration in days
                <input className="spark-input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </label>

              <label className="grid gap-2 text-sm font-bold">
                Travel
                <select className="spark-input" value={form.travel} onChange={(e) => setForm({ ...form, travel: e.target.value })}>
                  <option value="none">None</option>
                  <option value="within Arizona">Within Arizona</option>
                  <option value="domestic">Domestic</option>
                  <option value="international">International</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold">
                Animal exposure
                <select className="spark-input" value={form.animal} onChange={(e) => setForm({ ...form, animal: e.target.value })}>
                  <option value="none">None</option>
                  <option value="pets">Pets</option>
                  <option value="livestock">Livestock</option>
                  <option value="wildlife">Wildlife</option>
                  <option value="mosquito/tick bites">Mosquito/tick bites</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold">
                Crowded event
                <select className="spark-input" value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })}>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold lg:col-span-2">
                Description
                <textarea className="spark-input min-h-32" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>

              <div className="lg:col-span-2">
                <Button variant="hero" size="lg" type="submit">
                  <Zap className="h-5 w-5" />
                  Calculate Risk
                </Button>
              </div>
            </form>
          </Section>
        )}

        {view === "result" && (
          <Section id="result">
            <div className="spark-card p-6 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="spark-kicker">Risk result</p>
                  <h1 className="mt-2 text-4xl font-black">AI triage summary</h1>
                </div>
                <Badge variant={riskVariant(risk)} className="text-sm">{riskLabel(risk)} Risk</Badge>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="spark-panel p-5">
                  <div className="mb-3 flex justify-between">
                    <span className="font-bold">Risk score</span>
                    <span className="font-black text-secondary">{risk}%</span>
                  </div>
                  <Progress value={risk} />
                  <p className="mt-4 text-sm text-muted-foreground">This is not a medical diagnosis. Seek professional medical care if symptoms are severe.</p>
                </div>

                <div className="spark-panel p-5">
                  <h2 className="mb-3 text-xl font-black">AI explanation (Gemma 4 simulated)</h2>
                  <p className="text-muted-foreground">
                    Gemma 4 flags a {riskLabel(risk).toLowerCase()} outbreak risk because {form.location} has elevated local signals,
                    selected symptoms include {selectedSymptoms.join(", ")}, and exposure inputs include {form.travel} travel,
                    {form.animal} exposure, and crowded event status: {form.event}.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="spark-panel p-5">
                  <h3 className="mb-3 font-black">Contributing factors</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Symptoms: {selectedSymptoms.join(", ")}</li>
                    <li>Travel: {form.travel}</li>
                    <li>Animal exposure: {form.animal}</li>
                    <li>Crowded event: {form.event}</li>
                    <li>Community and weather/vector signals included</li>
                  </ul>
                </div>

                <div className="spark-panel p-5">
                  <h3 className="mb-3 font-black">Recommended actions</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Monitor symptoms and seek care if worsening.</li>
                    <li>Reduce crowded exposure while symptomatic.</li>
                    <li>Respond to public health follow-up if contacted.</li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>
        )}

        {view === "dashboard" && (
          <Section id="dashboard">
            <div className="mb-8">
              <p className="spark-kicker">Agency dashboard</p>
              <h1 className="mt-2 text-4xl font-black">Arizona outbreak intelligence</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {cityData.map((item) => (
                <div key={item.city} className="spark-card spark-hover p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-black">{item.city}</h3>
                    <Badge variant={riskVariant(item.risk)}>{item.level}</Badge>
                  </div>
                  <p className="text-4xl font-black">{item.risk}</p>
                  <Progress value={item.risk} className="my-4" />
                  <p className="text-sm text-muted-foreground">{item.reports} reports</p>
                  <p className="mt-3 text-sm">Top: {item.top}</p>
                  <p className="text-sm text-muted-foreground">{item.exposure}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <MiniBarChart />
              <MiniLineChart />
              <MiniPieChart />
            </div>

            <div className="mt-6 spark-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black">AZ region map signals</h2>
                <MapPin className="text-secondary" />
              </div>

              <div className="grid gap-3 sm:grid-cols-5">
                {cityData.map((item) => (
                  <div
                    key={item.city}
                    className={`rounded-2xl border p-4 text-center font-black ${
                      item.risk >= 75
                        ? "border-secondary bg-secondary/20 text-secondary"
                        : item.risk >= 50
                        ? "border-primary bg-primary/30"
                        : "border-success bg-success/15 text-success"
                    }`}
                  >
                    {item.city}
                    <p className="mt-2 text-sm font-bold">{item.risk}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {view === "live" && (
          <Section id="live">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="spark-card p-6">
                <Badge variant="gold">Active AI state</Badge>
                <h1 className="mt-4 text-4xl font-black">AI analyzing new reports...</h1>

                <div className="mt-8 rounded-2xl border border-secondary/30 bg-secondary/10 p-6 text-secondary shadow-glow">
                  <Brain className="h-14 w-14 animate-pulse-gold" />
                  <p className="mt-4 text-3xl font-black">{liveConfidence}% confidence</p>
                  <p className="text-sm">Last scan time: {scanTime}</p>
                </div>

                <div className="mt-6 spark-panel p-5">
                  <h2 className="mb-4 text-xl font-black">AI Health Assistant</h2>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {["Check My Symptoms", "Risk in My Area", "Explain My Report", "What Should I Do"].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setChatMode(mode)}
                        className={`rounded-full border px-3 py-2 text-xs font-bold ${
                          chatMode === mode ? "border-secondary bg-secondary text-secondary-foreground" : "border-border bg-glass text-muted-foreground"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-64 space-y-3 overflow-y-auto rounded-2xl border border-border bg-background/40 p-4">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`rounded-2xl p-3 text-sm ${msg.sender === "ai" ? "bg-secondary/10 text-muted-foreground" : "bg-primary/30 text-foreground"}`}>
                        <b>{msg.sender === "ai" ? "SparkShield AI" : "You"}:</b> {msg.text}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <input
                      className="spark-input"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask about risk, symptoms, or actions..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendChatMessage();
                      }}
                    />
                    <Button variant="hero" onClick={sendChatMessage}>Send</Button>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">Powered by Gemma 4 simulated explanation logic.</p>
                </div>
              </div>

              <div className="spark-card p-6">
                <h2 className="mb-5 text-xl font-black">Live feed panel</h2>
                <div className="space-y-3">
                  {liveFeed.map((item, index) => (
                    <div key={`${item}-${index}`} className="spark-panel flex items-center gap-3 p-4">
                      <span className="h-2.5 w-2.5 rounded-full bg-secondary shadow-glow" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        )}

        {view === "gemma" && (
          <Section id="gemma">
            <div className="spark-card p-8">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                  <p className="spark-kicker">Gemma 4 AI Section</p>
                  <h1 className="mt-2 text-4xl font-black">Human-readable outbreak intelligence</h1>
                </div>
                <Badge variant="gold">Status: Active</Badge>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <MetricCard icon={Brain} label="Model" value="Gemma 4" detail="Risk explanation + pattern detection" />
                <MetricCard icon={Activity} label="Task" value="Triage" detail="Transforms signals into reviewer-ready context" />
                <MetricCard icon={ShieldCheck} label="Mode" value="HITL" detail="Human-in-the-loop review required" />
              </div>

              <p className="mt-6 text-lg text-muted-foreground">
                Gemma 4 generates human-readable explanations from symptoms, travel, and environmental signals.
                It helps reviewers understand why a case was flagged and what factors contributed to the score.
              </p>
            </div>
          </Section>
        )}


              
        {view === "sources" && (
          <Section id="sources">
            <div className="spark-card p-8">
              <p className="spark-kicker">Data integration layer</p>
              <h1 className="mt-2 text-4xl font-black">Data Sources</h1>
              <p className="mt-4 max-w-3xl text-muted-foreground">
                SparkShield AZ combines user-submitted health reports with simulated public health and environmental signals.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {[
                  {
                    source: "CDC",
                    use: "Disease trends and community health signals",
                    status: "Fallback/mock ready",
                    link: "https://data.cdc.gov/",
                  },
                  {
                    source: "Weather API / NOAA-style data",
                    use: "Weather and vector risk scoring",
                    status: "Live-ready",
                    link: "https://www.weather.gov/documentation/services-web-api",
                  },
                  {
                    source: "WHO",
                    use: "Global outbreak alerts",
                    status: "Simulated prototype feed",
                    link: "https://www.who.int/emergencies/disease-outbreak-news",
                  },
                  {
                    source: "EpiCore",
                    use: "Early outbreak signals",
                    status: "Simulated prototype feed",
                    link: "https://epicore.org/",
                  },
                ].map((item) => (
                  <div key={item.source} className="spark-panel p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black">{item.source}</h2>
                      <Badge variant="gold">{item.status}</Badge>
                    </div>

                    <p className="mt-3 text-muted-foreground">{item.use}</p>

                    <button
                      onClick={() => window.open(item.link, "_blank")}
                      className="mt-5 rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground"
                    >
                      Open Source
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {view === "profile" && (
          <Section id="profile">
            <div className="mx-auto max-w-3xl spark-card p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="spark-kicker">Auth0 login mock</p>
                  <h1 className="mt-2 text-4xl font-black">Secure access profile</h1>
                </div>
                <Lock className="h-10 w-10 text-secondary" />
              </div>

              {!loggedIn ? (
                <div className="mt-8 grid gap-4">
                  <label className="grid gap-2 text-sm font-bold">
                    Role
                    <select className="spark-input" value={role} onChange={(e) => setRole(e.target.value)}>
                      {roles.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>

                  <Button variant="hero" size="lg" onClick={() => setLoggedIn(true)}>
                    <LogIn className="h-5 w-5" />
                    Login with Auth0
                  </Button>
                </div>
              ) : (
                <div className="mt-8 spark-panel p-6">
                  <UserCircle className="mb-4 h-14 w-14 text-secondary" />
                  <h2 className="text-2xl font-black">Dr. Elena Ramirez</h2>
                  <p className="text-muted-foreground">elena.ramirez@azhealth.example</p>
                  <Badge variant="gold" className="mt-4">{role}</Badge>
                  <p className="mt-5 text-sm text-muted-foreground">
                    Secure access enabled. Role-based UI unlocks reviewer and Backboard workflows for authorized users.
                  </p>
                  <Button variant="glass" className="mt-5" onClick={() => setLoggedIn(false)}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </Section>
        )}

        {view === "review" && (
          <Section id="review">
            <div className="mb-8">
              <p className="spark-kicker">Review Panel</p>
              <h1 className="mt-2 text-4xl font-black">High-risk report queue</h1>
            </div>

            <div className="spark-card overflow-hidden">
              <div className="grid grid-cols-4 gap-4 border-b border-border p-4 text-sm font-black text-secondary">
                <span>Location</span>
                <span>Symptoms</span>
                <span>Risk score</span>
                <span>Actions</span>
              </div>

              {reports.map((report) => (
                <div key={report.id} className="grid grid-cols-1 gap-4 border-b border-border p-4 md:grid-cols-4">
                  <span className="font-bold">{report.location}</span>
                  <span className="text-muted-foreground">{report.symptoms}</span>
                  <span>
                    <Badge variant={riskVariant(report.score)}>{report.score}</Badge>
                    <p className="mt-2 text-xs text-muted-foreground">{report.status}</p>
                  </span>
                  <span className="flex flex-wrap gap-2">
                    <Button variant="glass" size="sm" onClick={() => updateReportStatus(report.id, "Reviewed")}>Review</Button>
                    <Button variant="maroon" size="sm" onClick={() => updateReportStatus(report.id, "Escalated")}>Escalate</Button>
                    <Button variant="glass" size="sm" onClick={() => updateReportStatus(report.id, "Follow-up")}>Follow-Up</Button>
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {view === "backboard" && (
          <Section id="backboard">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="spark-kicker">Backboard</p>
                <h1 className="mt-2 text-4xl font-black">Admin command center</h1>
              </div>
              <Badge variant="gold">Admin-grade controls</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
              <MetricCard icon={Database} label="High-risk queue" value={String(reports.filter((r) => r.score >= 61).length)} detail="Operational command metric" />
              <MetricCard icon={Database} label="Live AI flags" value={String(reports.filter((r) => r.status === "New").length)} detail="Operational command metric" />
              <MetricCard icon={Database} label="Hotspots" value="3" detail="Operational command metric" />
              <MetricCard icon={Database} label="Escalated cases" value={String(reports.filter((r) => r.status === "Escalated").length)} detail="Operational command metric" />
              <MetricCard icon={Database} label="Reviewed cases" value={String(reports.filter((r) => r.status === "Reviewed").length)} detail="Operational command metric" />
            </div>

            <div className="mt-6 spark-card p-6">
              <div className="mb-5 grid gap-3 md:grid-cols-3">
                <select className="spark-input" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
                  <option value="All">Risk level: All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select className="spark-input" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                  <option value="All">Location: All</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>

                <select className="spark-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">Status: All</option>
                  <option value="New">New</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="space-y-3">
                {filteredReports.length === 0 ? (
                  <div className="spark-panel p-5 text-muted-foreground">No reports match the selected filters.</div>
                ) : (
                  filteredReports.map((report) => (
                    <div key={report.id} className="spark-panel flex flex-wrap items-center justify-between gap-4 p-4">
                      <div>
                        <p className="font-black">{report.id} · {report.location}</p>
                        <p className="text-sm text-muted-foreground">{report.symptoms} · {report.status}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="glass" size="sm" onClick={() => updateReportStatus(report.id, "Reviewed")}>Review</Button>
                        <Button variant="maroon" size="sm" onClick={() => updateReportStatus(report.id, "Escalated")}>Escalate</Button>
                        <Button variant="hero" size="sm" onClick={() => updateReportStatus(report.id, "Resolved")}>Resolve</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Section>
        )}

        {view === "model" && (
          <Section id="model">
            <div className="spark-card p-8">
              <p className="spark-kicker">Model Card</p>
              <h1 className="mt-2 text-4xl font-black">SparkShield Risk Model v1</h1>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {[
                  { title: "Purpose", text: "Prioritize outbreak risk signals for public health review." },
                  { title: "Inputs", text: "Symptoms, duration, travel, location, animal exposure, events, weather/vector risk, public health signals." },
                  { title: "Outputs", text: "Risk score, badge, explanation, contributing factors, recommended actions." },
                  { title: "Performance metrics", text: "Mock precision 0.84, recall 0.79, reviewer agreement 0.88." },
                  { title: "Bias + limitations", text: "Self-reporting can underrepresent communities with low access or trust. Not diagnostic." },
                  { title: "Human-in-the-loop", text: "Reviewers validate AI flags before escalation or operational action." },
                ].map((item) => (
                  <div key={item.title} className="spark-panel p-5">
                    <h2 className="mb-2 text-xl font-black">{item.title}</h2>
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}
      </div>
    </main>
  );
}