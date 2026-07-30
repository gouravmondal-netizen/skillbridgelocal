/**
 * SkillBridge domain model + in-browser data store.
 * Prototype persistence: localStorage. Swap for Lovable Cloud later.
 */

export type JobType = "Daily Wage" | "Part Time" | "Weekend" | "Contract";
export type Availability = "Immediate" | "Weekends only" | "Weekdays" | "Flexible";
export type SkillTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export type Worker = {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  area: string;
  qualification: string;
  skills: string[];
  experience: number;
  preferredType: JobType;
  expectedSalary: number;
  availability: Availability;
  rating: number;
  verified: boolean;
  photo: string;
};

export type Employer = {
  id: string;
  company: string;
  industry: string;
  area: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  size: string;
  rating: number;
  verified: boolean;
};

export type Job = {
  id: string;
  employerId: string;
  title: string;
  description: string;
  salary: number;
  payPeriod: "day" | "month";
  duration: string;
  type: JobType;
  skills: string[];
  qualification: string;
  experience: number;
  area: string;
  lat: number;
  lng: number;
  vacancies: number;
  urgent: boolean;
  status: "Open" | "Filled";
  postedAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  workerId: string;
  status: "Applied" | "Shortlisted" | "Hired" | "Rejected";
  date: string;
  score: number;
};

export type Ticket = {
  id: string;
  name: string;
  role: string;
  category: string;
  message: string;
  status: "Open" | "Resolved";
  date: string;
};

export type Txn = { id: string; label: string; amount: number; date: string; status: "Paid" | "Pending" };

export const CITY = { lat: 12.9716, lng: 77.5946, name: "Bengaluru" };

export function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

/** Skill badge tier from experience + rating + verified certificates. */
export function tierFor(experience: number, rating: number, verified: boolean): SkillTier {
  const s = experience * 12 + rating * 8 + (verified ? 15 : 0);
  if (s >= 90) return "Platinum";
  if (s >= 65) return "Gold";
  if (s >= 40) return "Silver";
  return "Bronze";
}

export const TIER_STYLE: Record<SkillTier, string> = {
  Bronze: "bg-muted text-muted-foreground",
  Silver: "bg-secondary text-secondary-foreground",
  Gold: "bg-accent text-accent-foreground",
  Platinum: "bg-primary text-primary-foreground",
};

/** Match score: 40% skills, 30% distance, 20% experience, 10% ratings. */
export function matchScore(worker: Worker, job: Job) {
  const need = job.skills.map((s) => s.toLowerCase());
  const has = worker.skills.map((s) => s.toLowerCase());
  const overlap = need.filter((s) => has.includes(s)).length;
  const skills = need.length ? overlap / need.length : 0.5;
  const km = haversine(worker, job);
  const distance = Math.max(0, 1 - km / 8);
  const exp = Math.min(1, worker.experience / Math.max(1, job.experience || 1));
  const rating = worker.rating / 5;
  return Math.round((skills * 40 + distance * 30 + exp * 20 + rating * 10) * 10) / 10;
}

const off = (dLat: number, dLng: number) => ({ lat: CITY.lat + dLat, lng: CITY.lng + dLng });

export const employers: Employer[] = [
  { id: "e1", company: "ABC Retail Mart", industry: "Retail", area: "Jayanagar", ...off(0.02, 0.015), phone: "+91 98450 11111", email: "hr@abcretail.in", size: "50-200", rating: 4.4, verified: true },
  { id: "e2", company: "GreenBuild Constructions", industry: "Construction", area: "BTM Layout", ...off(-0.03, 0.02), phone: "+91 98450 22222", email: "site@greenbuild.in", size: "200+", rating: 4.1, verified: true },
  { id: "e3", company: "QuickShip Logistics", industry: "Delivery", area: "Koramangala", ...off(0.012, 0.03), phone: "+91 98450 33333", email: "ops@quickship.in", size: "50-200", rating: 4.6, verified: true },
  { id: "e4", company: "Nova Foods Factory", industry: "Manufacturing", area: "Peenya", ...off(0.05, -0.04), phone: "+91 98450 44444", email: "plant@novafoods.in", size: "200+", rating: 3.9, verified: false },
  { id: "e5", company: "Sunrise Cafe", industry: "Hospitality", area: "Indiranagar", ...off(0.025, 0.045), phone: "+91 98450 55555", email: "cafe@sunrise.in", size: "1-50", rating: 4.8, verified: true },
];

export const seedJobs: Job[] = [
  { id: "j1", employerId: "e1", title: "Sales Assistant", description: "Assist walk-in customers, manage billing counter and restock shelves.", salary: 18000, payPeriod: "month", duration: "3 Months", type: "Contract", skills: ["Retail Sales", "Billing", "Communication"], qualification: "12th Pass", experience: 1, area: "Jayanagar", ...off(0.02, 0.015), vacancies: 4, urgent: false, status: "Open", postedAt: "2026-07-25" },
  { id: "j2", employerId: "e2", title: "Site Electrician", description: "Wiring, panel fitting and safety checks at a residential site.", salary: 950, payPeriod: "day", duration: "45 Days", type: "Daily Wage", skills: ["Electrician", "Wiring", "Safety"], qualification: "ITI", experience: 2, area: "BTM Layout", ...off(-0.03, 0.02), vacancies: 3, urgent: true, status: "Open", postedAt: "2026-07-28" },
  { id: "j3", employerId: "e3", title: "Weekend Delivery Rider", description: "Saturday & Sunday hyperlocal deliveries. Own two-wheeler preferred.", salary: 1100, payPeriod: "day", duration: "Ongoing", type: "Weekend", skills: ["Driving", "Navigation"], qualification: "10th Pass", experience: 0, area: "Koramangala", ...off(0.012, 0.03), vacancies: 12, urgent: true, status: "Open", postedAt: "2026-07-29" },
  { id: "j4", employerId: "e4", title: "Packaging Helper", description: "Unskilled packing line support, morning shift.", salary: 700, payPeriod: "day", duration: "1 Month", type: "Daily Wage", skills: ["Packing"], qualification: "No formal education", experience: 0, area: "Peenya", ...off(0.05, -0.04), vacancies: 20, urgent: false, status: "Open", postedAt: "2026-07-22" },
  { id: "j5", employerId: "e5", title: "Weekend Kitchen Assistant", description: "Sat-Sun prep and dishwashing support for a busy cafe.", salary: 850, payPeriod: "day", duration: "Ongoing", type: "Weekend", skills: ["Cooking", "Hygiene"], qualification: "10th Pass", experience: 1, area: "Indiranagar", ...off(0.025, 0.045), vacancies: 2, urgent: false, status: "Open", postedAt: "2026-07-27" },
  { id: "j6", employerId: "e2", title: "Plumber (Contract)", description: "Bathroom fittings and drainage lines across 3 blocks.", salary: 26000, payPeriod: "month", duration: "6 Months", type: "Contract", skills: ["Plumbing", "Fitting"], qualification: "ITI", experience: 3, area: "BTM Layout", ...off(-0.028, 0.018), vacancies: 2, urgent: false, status: "Open", postedAt: "2026-07-20" },
  { id: "j7", employerId: "e1", title: "Weekend Store Promoter", description: "Weekend in-store product promotion and demo.", salary: 900, payPeriod: "day", duration: "Ongoing", type: "Weekend", skills: ["Communication", "Retail Sales"], qualification: "12th Pass", experience: 0, area: "Jayanagar", ...off(0.018, 0.012), vacancies: 6, urgent: false, status: "Open", postedAt: "2026-07-26" },
  { id: "j8", employerId: "e3", title: "Warehouse Data Entry", description: "Part-time inward/outward entry in the WMS.", salary: 14000, payPeriod: "month", duration: "3 Months", type: "Part Time", skills: ["Data Entry", "Computer Basics"], qualification: "Diploma", experience: 1, area: "Koramangala", ...off(0.015, 0.028), vacancies: 3, urgent: false, status: "Open", postedAt: "2026-07-24" },
];

export const workers: Worker[] = [
  { id: "w1", name: "Ravi Kumar", age: 28, phone: "+91 90000 10001", email: "ravi@mail.com", ...off(0.015, 0.02), area: "Jayanagar", qualification: "ITI", skills: ["Electrician", "Wiring", "Safety"], experience: 4, preferredType: "Daily Wage", expectedSalary: 900, availability: "Immediate", rating: 4.6, verified: true, photo: "RK" },
  { id: "w2", name: "Lakshmi Devi", age: 32, phone: "+91 90000 10002", email: "lakshmi@mail.com", ...off(0.022, 0.04), area: "Indiranagar", qualification: "12th Pass", skills: ["Cooking", "Hygiene", "Tailoring"], experience: 6, preferredType: "Weekend", expectedSalary: 850, availability: "Weekends only", rating: 4.8, verified: true, photo: "LD" },
  { id: "w3", name: "Imran Sheikh", age: 24, phone: "+91 90000 10003", email: "imran@mail.com", ...off(0.01, 0.031), area: "Koramangala", qualification: "10th Pass", skills: ["Driving", "Navigation"], experience: 2, preferredType: "Weekend", expectedSalary: 1000, availability: "Weekends only", rating: 4.3, verified: false, photo: "IS" },
  { id: "w4", name: "Anita Rao", age: 26, phone: "+91 90000 10004", email: "anita@mail.com", ...off(0.019, 0.014), area: "Jayanagar", qualification: "Diploma", skills: ["Retail Sales", "Billing", "Communication"], experience: 3, preferredType: "Contract", expectedSalary: 18000, availability: "Immediate", rating: 4.5, verified: true, photo: "AR" },
  { id: "w5", name: "Suresh Naik", age: 41, phone: "+91 90000 10005", email: "suresh@mail.com", ...off(-0.026, 0.021), area: "BTM Layout", qualification: "ITI", skills: ["Plumbing", "Fitting"], experience: 12, preferredType: "Contract", expectedSalary: 26000, availability: "Flexible", rating: 4.7, verified: true, photo: "SN" },
  { id: "w6", name: "Meena Bai", age: 35, phone: "+91 90000 10006", email: "meena@mail.com", ...off(0.045, -0.035), area: "Peenya", qualification: "No formal education", skills: ["Packing"], experience: 1, preferredType: "Daily Wage", expectedSalary: 700, availability: "Immediate", rating: 4.0, verified: false, photo: "MB" },
  { id: "w7", name: "Deepak Shetty", age: 22, phone: "+91 90000 10007", email: "deepak@mail.com", ...off(0.013, 0.026), area: "Koramangala", qualification: "Diploma", skills: ["Data Entry", "Computer Basics", "Communication"], experience: 1, preferredType: "Part Time", expectedSalary: 14000, availability: "Flexible", rating: 4.2, verified: true, photo: "DS" },
  { id: "w8", name: "Farhan Ali", age: 30, phone: "+91 90000 10008", email: "farhan@mail.com", ...off(-0.02, 0.01), area: "BTM Layout", qualification: "10th Pass", skills: ["Carpentry", "Fitting"], experience: 7, preferredType: "Daily Wage", expectedSalary: 1050, availability: "Immediate", rating: 4.4, verified: true, photo: "FA" },
];

export const ME = workers[0]; // demo signed-in worker
export const MY_EMPLOYER = employers[0]; // demo signed-in employer

export const transactions: Txn[] = [
  { id: "t1", label: "GreenBuild – 6 days wiring", amount: 5700, date: "2026-07-24", status: "Paid" },
  { id: "t2", label: "Sunrise Cafe – weekend shift", amount: 1700, date: "2026-07-19", status: "Paid" },
  { id: "t3", label: "ABC Retail – setup support", amount: 2400, date: "2026-07-29", status: "Pending" },
];

/* ---------------- store ---------------- */

type State = {
  jobs: Job[];
  applications: Application[];
  tickets: Ticket[];
  location: { lat: number; lng: number; label: string };
  radius: number;
};

const KEY = "skillbridge-v1";

const initial: State = {
  jobs: seedJobs,
  applications: [
    { id: "a1", jobId: "j2", workerId: "w1", status: "Hired", date: "2026-07-26", score: 92 },
    { id: "a2", jobId: "j1", workerId: "w4", status: "Shortlisted", date: "2026-07-27", score: 88 },
    { id: "a3", jobId: "j3", workerId: "w3", status: "Applied", date: "2026-07-29", score: 84 },
    { id: "a4", jobId: "j7", workerId: "w1", status: "Applied", date: "2026-07-29", score: 61 },
  ],
  tickets: [],
  location: { lat: ME.lat, lng: ME.lng, label: "Jayanagar, Bengaluru (default)" },
  radius: 8,
};

let state: State = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export const store = {
  get(): State {
    load();
    return state;
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  set(patch: Partial<State> | ((s: State) => Partial<State>)) {
    load();
    const next = typeof patch === "function" ? patch(state) : patch;
    state = { ...state, ...next };
    persist();
    listeners.forEach((l) => l());
  },
  reset() {
    state = initial;
    persist();
    listeners.forEach((l) => l());
  },
};

export const uid = () => Math.random().toString(36).slice(2, 9);
