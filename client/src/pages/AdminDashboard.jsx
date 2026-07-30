import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Search,
  LayoutGrid,
  Users as UsersIcon,
  CalendarClock,
  Inbox,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  ArrowUpDown,
  SlidersHorizontal,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  XCircle,
  Circle,
  Mail,
  Phone,
  MessageCircle,
  Hexagon,
  Plus,
  Sun,
  Moon,
  Trash2,
  Pencil,
  Eye,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import {
  fetchAppointments,
  updateAppointment,
  deleteAppointment,
} from "../store/slices/appointmentSlice";
import {
  fetchAllUsers,
  fetchUser,
  registerUser,
} from "../store/slices/authSlice";
import { fetchContacts, deleteContact } from "../store/slices/contactSlice";
const FIRST = [
  "Amara",
  "Kwesi",
  "Nadia",
  "Leon",
  "Priya",
  "Tobias",
  "Selin",
  "Marcus",
  "Yara",
  "Dario",
  "Ines",
  "Kofi",
  "Sana",
  "Elias",
  "Ama",
  "Ravi",
  "Zora",
  "Femi",
  "Noor",
  "Caleb",
  "Lila",
  "Theo",
  "Aisha",
  "Bram",
];
const LAST = [
  "Owusu",
  "Mensah",
  "Larsen",
  "Petit",
  "Okafor",
  "Novak",
  "Reyes",
  "Adjei",
  "Sharma",
  "Kimani",
  "Dubois",
  "Osei",
  "Farah",
  "Lund",
  "Boateng",
  "Silva",
  "Haile",
  "Kone",
  "Weiss",
  "Danso",
];
const ROLES = ["Admin", "Manager", "Agent", "Analyst", "Viewer"];
const SERVICES = [
  "Strategy Session",
  "Onboarding Call",
  "Product Demo",
  "Technical Review",
  "Renewal Consult",
  "Discovery Call",
];
const STAFF = ["J. Mensah", "R. Sharma", "A. Novak", "T. Boateng", "K. Larsen"];
const CHANNELS = ["Email", "Phone", "Live Chat"];
const SUBJECTS = [
  "Billing question",
  "Feature request",
  "Access issue",
  "Integration help",
  "Refund inquiry",
  "Account upgrade",
  "API error",
  "General feedback",
];

function seededRand(seed) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}
function pick(list, seed) {
  return list[Math.floor(seededRand(seed) * list.length)];
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function fmtDate(d) {
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const USERS = Array.from({ length: 26 }).map((_, i) => {
  const first = pick(FIRST, i + 1);
  const last = pick(LAST, i + 7);
  const status = ["active", "active", "active", "invited", "suspended"][i % 5];
  const joined = daysAgo(20 + i * 11);
  return {
    id: `USR-${1000 + i}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@vertexops.io`,
    role: pick(ROLES, i + 3),
    status,
    joined,
    lastActive: daysAgo(i % 6),
  };
});

const APPOINTMENTS = Array.from({ length: 30 }).map((_, i) => {
  const first = pick(FIRST, i + 2);
  const last = pick(LAST, i + 9);
  const status = [
    "confirmed",
    "confirmed",
    "pending",
    "completed",
    "cancelled",
  ][i % 5];
  const date = daysAgo(i - 12);
  const hour = 8 + (i % 9);
  return {
    id: `APT-${2000 + i}`,
    client: `${first} ${last}`,
    service: pick(SERVICES, i + 5),
    staff: pick(STAFF, i + 1),
    date,
    time: `${hour > 12 ? hour - 12 : hour}:${i % 2 === 0 ? "00" : "30"} ${hour >= 12 ? "PM" : "AM"}`,
    status,
  };
});

const ENQUIRIES = Array.from({ length: 24 }).map((_, i) => {
  const first = pick(FIRST, i + 4);
  const last = pick(LAST, i + 13);
  const status = ["open", "in progress", "resolved", "open"][i % 4];
  return {
    id: `ENQ-${3000 + i}`,
    name: `${first} ${last}`,
    subject: pick(SUBJECTS, i + 6),
    channel: pick(CHANNELS, i + 2),
    status,
    received: daysAgo(i),
  };
});

/* ======================================================================= */
/*  SMALL SHARED PIECES                                                     */
/* ======================================================================= */

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

const STATUS_CONFIG = {
  active: { label: "Active", cls: "badge-success", icon: CheckCircle2 },
  invited: { label: "Invited", cls: "badge-info", icon: Clock },
  suspended: { label: "Suspended", cls: "badge-danger", icon: XCircle },
  confirmed: { label: "Confirmed", cls: "badge-success", icon: CheckCircle2 },
  pending: { label: "Pending", cls: "badge-warning", icon: Clock },
  completed: { label: "Completed", cls: "badge-info", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", cls: "badge-danger", icon: XCircle },
  open: { label: "Open", cls: "badge-warning", icon: Circle },
  "in progress": { label: "In progress", cls: "badge-info", icon: Clock },
  resolved: { label: "Resolved", cls: "badge-success", icon: CheckCircle2 },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    cls: "badge-neutral",
    icon: Circle,
  };
  const Icon = cfg.icon;
  return (
    <span className={`badge ${cfg.cls}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

const CHANNEL_ICON = { Email: Mail, Phone: Phone, "Live Chat": MessageCircle };

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "users", label: "Users", icon: UsersIcon },
  { key: "appointments", label: "Appointments", icon: CalendarClock },
  { key: "enquiries", label: "Enquiries", icon: Inbox },
];

function Sidebar({ active, onNavigate, open, onClose, counts }) {
  const activeIndex = NAV_ITEMS.findIndex((n) => n.key === active);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-white backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col glass-strong transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ borderRight: "1px solid var(--panel-border)" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            {/* <div className="relative flex h-9 w-9 items-center justify-center">
              <Hexagon
                size={34}
                className="spin-slow"
                style={{
                  color: "var(--cyan)",
                  position: "absolute",
                  opacity: 0.35,
                }}
              />
              <Hexagon
                size={18}
                fill="var(--cyan)"
                style={{ color: "var(--cyan)" }}
              />
            </div> */}
            <div>
              <p
                className="font-display text-sm font-semibold tracking-wide"
                style={{ color: "var(--text-1)" }}
              >
                DORNEE ATELIER
              </p>
              <p
                className="font-mono text-[10px] tracking-widest"
                style={{ color: "var(--text-3)" }}
              >
                ADMIN DASHBOARD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 lg:hidden"
            style={{ color: "var(--text-2)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="relative mt-2 flex-1 px-3">
          {activeIndex >= 0 && (
            <div
              className="rail absolute left-3 w-[calc(100%-24px)] rounded-lg"
              style={{
                height: 44,
                top: activeIndex * 48,
                background: "#AA1D23",
                color: "white",
                border: "1px solid rgba(238,241,248,0))",
              }}
            />
          )}
          <div className="relative space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              const count = counts[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className="relative z-10 flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200 uppercase"
                  style={{
                    color: isActive ? "white" : "var(--text-2)",
                  }}
                >
                  <Icon
                    size={17}
                    style={{
                      color: isActive ? "white" : "var(--text-3)",
                    }}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Status footer */}
        <div
          className="m-3 rounded-xl p-4 glass"
          style={{ borderColor: "var(--panel-border)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full pulse-dot"
              style={{ background: "var(--success)" }}
            />
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-1)" }}
            >
              All systems nominal
            </p>
          </div>
          <p
            className="mt-1 font-mono text-[10px]"
            style={{ color: "var(--text-3)" }}
          >
            Sync latency 42ms
          </p>
        </div>
      </aside>
    </>
  );
}

/* ======================================================================= */
/*  TOP BAR                                                                  */
/* ======================================================================= */

const PAGE_META = {
  overview: { title: "Overview", sub: "Live operations summary" },
  users: { title: "Users", sub: "Manage accounts and access" },
  appointments: {
    title: "Appointments",
    sub: "Scheduled sessions across your team",
  },
  enquiries: { title: "Enquiries", sub: "Inbound requests across channels" },
};

function ThemeToggle({ theme, onToggle }) {
  const isLight = theme === "light";
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle color theme"
      className="theme-toggle flex h-9 w-9 items-center justify-center rounded-lg glass hover-lift"
      style={{ color: "var(--text-2)" }}
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

function TopBar({
  page,
  onMenuClick,
  query,
  setQuery,
  theme,
  onToggleTheme,
  onCreateUser,
}) {
  const meta = PAGE_META[page];
  return (
    <div
      className="flex flex-col gap-4 border-b pb-5"
      style={{ borderColor: "var(--panel-border)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={onMenuClick}
            className="mt-1 rounded-md p-1.5 lg:hidden"
            style={{ color: "var(--text-2)" }}
          >
            <Menu size={20} />
          </button>
          <div>
            <h1
              className="font-display text-xl font-semibold sm:text-2xl"
              style={{ color: "var(--text-1)" }}
            >
              {meta.title}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
              {meta.sub}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            className="relative hidden h-9 w-9 items-center justify-center rounded-lg sm:flex glass hover-lift"
            style={{ color: "var(--text-2)" }}
          >
            <Bell size={16} />
            <span
              className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full pulse-dot"
              style={{ background: "var(--danger)" }}
            />
          </button>
          <button
            onClick={onCreateUser}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-transform duration-150 active:scale-95 bg-[#AA1D23] text-white"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">New User</span>
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg">
        <div className="relative flex items-center gap-2 rounded-lg px-3 py-2.5 vtx-input scanline">
          <Search size={16} style={{ color: "var(--text-3)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${page === "overview" ? "everything" : page}…`}
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text-1)" }}
          />
          <kbd
            className="font-mono rounded border px-1.5 py-0.5 text-[10px]"
            style={{
              borderColor: "var(--panel-border)",
              color: "var(--text-3)",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  REUSABLE DATA TABLE  — search, filter, sort, pagination, responsive     */
/* ======================================================================= */

function DataTable({
  columns,
  data,
  statusOptions,
  statusKey = "status",
  pageSize = 8,
  externalQuery = "",
}) {
  const [localQuery, setLocalQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const query = (externalQuery || localQuery).toLowerCase();

  useEffect(() => setPage(1), [query, statusFilter, sortKey, sortDir]);

  const filtered = useMemo(() => {
    let rows = data.filter((row) => {
      const matchesStatus =
        statusFilter === "all" || row[statusKey] === statusFilter;
      const matchesQuery =
        query.length === 0 ||
        columns.some((c) =>
          String(row[c.key] ?? "")
            .toLowerCase()
            .includes(query),
        );
      return matchesStatus && matchesQuery;
    });
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        let av = a[sortKey];
        let bv = b[sortKey];
        if (av instanceof Date) av = av.getTime();
        if (bv instanceof Date) bv = bv.getTime();
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [data, query, statusFilter, sortKey, sortDir, columns, statusKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const pageNumbers = useMemo(() => {
    const nums = [];
    const span = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= span)
        nums.push(i);
      else if (nums[nums.length - 1] !== "…") nums.push("…");
    }
    return nums;
  }, [totalPages, page]);

  return (
    <div
      className="glass-strong rounded-2xl fade-up"
      style={{ animationDelay: "60ms" }}
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b p-4"
        style={{ borderColor: "var(--panel-border)" }}
      >
        <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-lg px-3 py-2 vtx-input">
          <Search size={14} style={{ color: "var(--text-3)" }} />
          <input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Filter this table…"
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text-1)" }}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium vtx-input"
            style={{
              color: statusFilter === "all" ? "var(--text-2)" : "var(--cyan)",
            }}
          >
            <SlidersHorizontal size={14} />
            {statusFilter === "all"
              ? "Status"
              : STATUS_CONFIG[statusFilter]?.label || statusFilter}
            <ChevronDown size={14} />
          </button>
          {filterOpen && (
            <div
              className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg glass-strong"
              style={{ borderColor: "var(--panel-border)" }}
              onMouseLeave={() => setFilterOpen(false)}
            >
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setFilterOpen(false);
                }}
                className="row-hover flex w-full items-center px-3 py-2 text-left text-sm"
                style={{ color: "var(--text-2)" }}
              >
                All statuses
              </button>
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setFilterOpen(false);
                  }}
                  className="row-hover flex w-full items-center px-3 py-2 text-left text-sm"
                  style={{ color: "var(--text-2)" }}
                >
                  <StatusBadge status={s} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto scrollbar-thin md:block">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  onClick={() => c.sortable !== false && toggleSort(c.key)}
                  className={`whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${c.sortable !== false ? "cursor-pointer select-none" : ""}`}
                  style={{ color: "var(--text-3)" }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {c.label}
                    {c.sortable !== false && (
                      <ArrowUpDown
                        size={11}
                        style={{
                          color:
                            sortKey === c.key ? "var(--cyan)" : "var(--text-3)",
                        }}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr
                key={row.id}
                className="row-hover fade-up"
                style={{
                  borderTop: "1px solid var(--panel-border)",
                  animationDelay: `${i * 30}ms`,
                }}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className="whitespace-nowrap px-5 py-3.5"
                    style={{ color: "var(--text-2)" }}
                  >
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-sm"
                  style={{ color: "var(--text-3)" }}
                >
                  No records match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div
        className="divide-y md:hidden"
        style={{ borderColor: "var(--panel-border)" }}
      >
        {pageRows.map((row, i) => (
          <div
            key={row.id}
            className="fade-up space-y-1.5 p-4"
            style={{
              borderColor: "var(--panel-border)",
              animationDelay: `${i * 30}ms`,
            }}
          >
            {columns.map((c) => (
              <div
                key={c.key}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: "var(--text-3)" }}
                >
                  {c.label}
                </span>
                <span style={{ color: "var(--text-1)" }}>
                  {c.render ? c.render(row) : String(row[c.key] ?? "")}
                </span>
              </div>
            ))}
          </div>
        ))}
        {pageRows.length === 0 && (
          <div
            className="p-8 text-center text-sm"
            style={{ color: "var(--text-3)" }}
          >
            No records match your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-t p-4"
        style={{ borderColor: "var(--panel-border)" }}
      >
        <p className="font-mono text-xs" style={{ color: "var(--text-3)" }}>
          {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-7 w-7 items-center justify-center rounded-md disabled:opacity-30"
            style={{ color: "var(--text-2)" }}
          >
            <ChevronLeft size={15} />
          </button>
          {pageNumbers.map((n, idx) =>
            n === "…" ? (
              <span
                key={`e${idx}`}
                className="px-1 text-xs"
                style={{ color: "var(--text-3)" }}
              >
                …
              </span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="font-mono flex h-7 w-7 items-center justify-center rounded-md text-xs"
                style={{
                  background:
                    page === n ? "rgba(0,229,255,0.14)" : "transparent",
                  color: page === n ? "var(--cyan)" : "var(--text-2)",
                  border:
                    page === n
                      ? "1px solid rgba(0,229,255,0.3)"
                      : "1px solid transparent",
                }}
              >
                {n}
              </button>
            ),
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-md disabled:opacity-30"
            style={{ color: "var(--text-2)" }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  OVERVIEW PAGE                                                           */
/* ======================================================================= */

const ACTIVITY_DATA = {
  "7D": [
    { name: "Mon", value: 24 },
    { name: "Tue", value: 38 },
    { name: "Wed", value: 30 },
    { name: "Thu", value: 46 },
    { name: "Fri", value: 41 },
    { name: "Sat", value: 18 },
    { name: "Sun", value: 14 },
  ],
  "30D": Array.from({ length: 10 }).map((_, i) => ({
    name: `${i * 3 + 1}`,
    value: 20 + Math.round(seededRand(i + 1) * 40),
  })),
  "90D": Array.from({ length: 12 }).map((_, i) => ({
    name: `W${i + 1}`,
    value: 100 + Math.round(seededRand(i + 20) * 160),
  })),
};

function KpiCard({
  label,
  value,
  delta,
  positive,
  icon: Icon,
  delay,
  suffix = "",
}) {
  const animated = useCountUp(value);
  return (
    <div
      className="fade-up glass-strong hover-lift rounded-2xl p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            background: "rgba(0,229,255,0.1)",
            border: "1px solid rgba(0,229,255,0.25)",
          }}
        >
          <Icon size={16} style={{ color: "var(--cyan)" }} />
        </div>
        <span
          className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: positive ? "var(--success)" : "var(--danger)" }}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
        </span>
      </div>
      <p
        className="mt-4 text-xs font-medium uppercase tracking-wider"
        style={{ color: "var(--text-3)" }}
      >
        {label}
      </p>
      <p
        className="font-display font-mono mt-1 text-3xl font-semibold"
        style={{ color: "var(--text-1)" }}
      >
        {animated.toLocaleString()}
        {suffix}
      </p>
    </div>
  );
}

function ActivityChart({ theme }) {
  const [range, setRange] = useState("7D");
  const data = ACTIVITY_DATA[range];
  const isLight = theme === "light";
  const tickColor = isLight ? "#8891a3" : "#525c74";
  const tooltipBg = isLight ? "#ffffff" : "#0a0c16";
  const tooltipLabel = isLight ? "#4c5567" : "#8b95ac";

  return (
    <div
      className="fade-up glass-strong hover-lift rounded-2xl p-5 lg:col-span-2"
      style={{ animationDelay: "180ms" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--text-1)" }}
          >
            Operations activity
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-3)" }}>
            Combined users, appointments and enquiries
          </p>
        </div>
        <div
          className="flex items-center gap-1 rounded-lg p-1"
          style={{ background: "var(--chip-bg)" }}
        >
          {Object.keys(ACTIVITY_DATA).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
              style={{
                background:
                  range === r ? "rgba(0,229,255,0.14)" : "transparent",
                color: range === r ? "var(--cyan)" : "var(--text-3)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 11 }}
            />
            <Tooltip
              cursor={{ stroke: "rgba(0,229,255,0.3)" }}
              contentStyle={{
                background: tooltipBg,
                border: "1px solid rgba(0,229,255,0.25)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: tooltipLabel }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00e5ff"
              strokeWidth={2}
              fill="url(#areaFill)"
              isAnimationActive
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChannelSplit() {
  const counts = CHANNELS.map((ch) => ({
    name: ch,
    value: ENQUIRIES.filter((e) => e.channel === ch).length,
  }));
  const max = Math.max(...counts.map((c) => c.value));
  return (
    <div
      className="fade-up glass-strong hover-lift rounded-2xl p-5"
      style={{ animationDelay: "220ms" }}
    >
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>
        Enquiry channels
      </h3>
      <p className="mt-0.5 text-xs" style={{ color: "var(--text-3)" }}>
        Volume by intake source
      </p>
      <div className="mt-5 space-y-4">
        {counts.map((c) => {
          const Icon = CHANNEL_ICON[c.name];
          return (
            <div key={c.name}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span
                  className="flex items-center gap-1.5"
                  style={{ color: "var(--text-2)" }}
                >
                  <Icon size={12} /> {c.name}
                </span>
                <span className="font-mono" style={{ color: "var(--text-3)" }}>
                  {c.value}
                </span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full"
                style={{ background: "var(--chip-bg)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(c.value / max) * 100}%`,
                    background:
                      "linear-gradient(90deg, var(--violet), var(--cyan))",
                    transition: "width .8s cubic-bezier(.16,1,.3,1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OverviewPage({ theme }) {
  const activeUsers = USERS.filter((u) => u.status === "active").length;
  const today = APPOINTMENTS.filter((a) => a.status === "confirmed").length;
  const openEnquiries = ENQUIRIES.filter((e) => e.status !== "resolved").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active users"
          value={activeUsers}
          delta="4.2%"
          positive
          icon={UsersIcon}
          delay={0}
        />
        <KpiCard
          label="Appointments confirmed"
          value={today}
          delta="2.8%"
          positive
          icon={CalendarClock}
          delay={60}
        />
        <KpiCard
          label="Open enquiries"
          value={openEnquiries}
          delta="1.1%"
          positive={false}
          icon={Inbox}
          delay={120}
        />
        <KpiCard
          label="Response rate"
          value={94}
          suffix="%"
          delta="0.6%"
          positive
          icon={CheckCircle2}
          delay={180}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ActivityChart theme={theme} />
        <ChannelSplit />
      </div>

      <div
        className="fade-up glass-strong hover-lift rounded-2xl p-5"
        style={{ animationDelay: "260ms" }}
      >
        <h3
          className="mb-4 text-sm font-semibold"
          style={{ color: "var(--text-1)" }}
        >
          Recent activity
        </h3>
        <div className="space-y-3">
          {[
            ...APPOINTMENTS.slice(0, 2),
            ...ENQUIRIES.slice(0, 2),
            ...USERS.slice(0, 1),
          ].map((item, i) => (
            <div
              key={i}
              className="row-hover flex items-center gap-3 rounded-lg px-2 py-2"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "rgba(124,92,252,0.12)",
                  border: "1px solid rgba(124,92,252,0.25)",
                }}
              >
                <MoreVertical size={13} style={{ color: "var(--violet)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm"
                  style={{ color: "var(--text-1)" }}
                >
                  {item.client || item.name} —{" "}
                  {item.service || item.subject || item.role}
                </p>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>
                  {fmtDate(item.date || item.received || item.joined)}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  USERS / APPOINTMENTS / ENQUIRIES PAGES                                  */
/* ======================================================================= */

function UsersPage({ query }) {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const tableData = (users || []).map((u) => ({
    id: u._id,
    name: u.email ? u.email.split("@")[0] : "—",
    email: u.email || "—",
    role: u.role || "—",
    status: u.isActive !== false ? "active" : "suspended",
    joined: u.createdAt ? new Date(u.createdAt) : null,
    lastActive: u.lastLoginAt
      ? new Date(u.lastLoginAt)
      : u.updatedAt
        ? new Date(u.updatedAt)
        : null,
  }));

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <div
            className="font-mono flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold"
            style={{ background: "rgba(0,229,255,0.14)", color: "var(--cyan)" }}
          >
            {r.email.charAt(0).toUpperCase()}
          </div>
          <span style={{ color: "var(--text-1)" }}>{r.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "joined",
      label: "Joined",
      render: (r) => (r.joined ? fmtDate(r.joined) : "—"),
    },
    {
      key: "lastActive",
      label: "Last active",
      render: (r) => (r.lastActive ? fmtDate(r.lastActive) : "—"),
    },
  ];

  if (loading && tableData.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-16 text-sm"
        style={{ color: "var(--text-3)" }}
      >
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-sm"
        style={{ color: "var(--danger)" }}
      >
        <p>Failed to load users: {error}</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={tableData}
      statusOptions={["active", "suspended"]}
      externalQuery={query}
    />
  );
}

function StatusUpdateModal({ open, appointment, onClose, onUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState(
    appointment?.status || "pending",
  );
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (appointment) {
      setSelectedStatus(appointment.status);
    }
  }, [appointment]);

  if (!open) return null;

  const statusOptions = ["pending", "confirmed", "completed", "cancelled"];

  const handleUpdate = async () => {
    if (selectedStatus === appointment.status) {
      onClose();
      return;
    }
    setUpdating(true);
    await onUpdate(appointment.id, { status: selectedStatus });
    setUpdating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl p-6 glass-strong fade-up"
        style={{ borderColor: "var(--panel-border)" }}
      >
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--text-1)" }}
        >
          Update Appointment Status
        </h3>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          {appointment?.client} — {appointment?.service}
        </p>

        <div className="mt-6 space-y-3">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all"
              style={{
                background:
                  selectedStatus === s
                    ? "rgba(0,229,255,0.14)"
                    : "var(--chip-bg)",
                border:
                  selectedStatus === s
                    ? "1px solid rgba(0,229,255,0.3)"
                    : "1px solid transparent",
                color: "var(--text-1)",
              }}
            >
              <StatusBadge status={s} />
              <span className="capitalize">{s}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{ color: "var(--text-2)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={updating || selectedStatus === appointment?.status}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition-transform duration-150 active:scale-95 disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, var(--cyan), var(--violet))",
              color: "#04060a",
            }}
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  DELETE CONFIRMATION MODAL                                               */
/* ======================================================================= */

function DeleteConfirmModal({ open, appointment, onClose, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  if (!open) return null;

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(appointment.id);
    setDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl p-6 glass-strong fade-up"
        style={{ borderColor: "var(--panel-border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "rgba(255,92,122,0.15)" }}
          >
            <AlertTriangle size={20} style={{ color: "var(--danger)" }} />
          </div>
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-1)" }}
            >
              Delete Appointment
            </h3>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>
              {appointment?.client} — {appointment?.service}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm" style={{ color: "var(--text-2)" }}>
          Are you sure you want to delete this appointment? This action cannot
          be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{ color: "var(--text-2)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition-transform duration-150 active:scale-95 disabled:opacity-40"
            style={{
              background: "rgba(255,92,122,0.15)",
              color: "var(--danger)",
              border: "1px solid rgba(255,92,122,0.3)",
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppointmentsPage({ query }) {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector(
    (state) => state.appointment,
  );

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleStatusUpdate = async (id, data) => {
    await dispatch(updateAppointment({ id, ...data }));
  };

  const handleDelete = async (id) => {
    await dispatch(deleteAppointment(id));
  };

  const openStatusModal = (appt) => {
    setSelectedAppointment(appt);
    setStatusModalOpen(true);
  };

  const openDeleteModal = (appt) => {
    setSelectedAppointment(appt);
    setDeleteModalOpen(true);
  };

  // Transform API data to match DataTable column keys
  const tableData = appointments.map((a) => ({
    id: a._id,
    client: a.name,
    email: a.email,
    phone: a.phone || "—",
    service: a.service,
    date: a.date ? new Date(a.date) : null,
    time: a.createdAt
      ? new Date(a.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",
    status: a.status,
    reference: a.reference || "—",
    amount: a.amount ? `₵${a.amount}` : "—",
    notes: a.notes || "—",
    _original: a,
  }));

  const columns = [
    { key: "client", label: "Client" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "service", label: "Service" },
    {
      key: "date",
      label: "Date",
      render: (r) => (r.date ? fmtDate(r.date) : "—"),
    },
    { key: "time", label: "Time" },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openStatusModal(r)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(0,229,255,0.12)",
              color: "var(--cyan)",
              border: "1px solid rgba(0,229,255,0.25)",
            }}
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => openDeleteModal(r)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(255,92,122,0.12)",
              color: "var(--danger)",
              border: "1px solid rgba(255,92,122,0.25)",
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ),
    },
  ];

  if (loading && tableData.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-16 text-sm"
        style={{ color: "var(--text-3)" }}
      >
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-sm"
        style={{ color: "var(--danger)" }}
      >
        <p>Failed to load appointments: {error}</p>
        <button
          onClick={() => dispatch(fetchAppointments())}
          className="mt-4 rounded-lg px-4 py-2 text-xs font-semibold"
          style={{
            background: "rgba(0,229,255,0.14)",
            color: "var(--cyan)",
            border: "1px solid rgba(0,229,255,0.3)",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={tableData}
        statusOptions={["confirmed", "pending", "completed", "cancelled"]}
        externalQuery={query}
      />

      <StatusUpdateModal
        open={statusModalOpen}
        appointment={selectedAppointment}
        onClose={() => setStatusModalOpen(false)}
        onUpdate={handleStatusUpdate}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        appointment={selectedAppointment}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </>
  );
}

/* ======================================================================= */
/*  VIEW CONTACT MODAL                                                      */
/* ======================================================================= */

function ViewContactModal({ open, contact, onClose }) {
  if (!open || !contact) return null;

  const ChannelIcon = CHANNEL_ICON[contact.channel] || Mail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl p-6 glass-strong fade-up"
        style={{ borderColor: "var(--panel-border)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--text-1)" }}
          >
            Contact Enquiry Details
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1"
            style={{ color: "var(--text-3)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: "var(--text-3)" }}
              >
                Name
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-1)" }}
              >
                {contact.name}
              </p>
            </div>
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: "var(--text-3)" }}
              >
                Email
              </p>
              <p className="text-sm" style={{ color: "var(--text-1)" }}>
                {contact.email}
              </p>
            </div>
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: "var(--text-3)" }}
              >
                Channel
              </p>
              <p
                className="text-sm flex items-center gap-1.5"
                style={{ color: "var(--text-1)" }}
              >
                <ChannelIcon size={13} style={{ color: "var(--text-3)" }} />
                {contact.channel}
              </p>
            </div>
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: "var(--text-3)" }}
              >
                Status
              </p>
              <StatusBadge status={contact.status} />
            </div>
            <div className="col-span-2">
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: "var(--text-3)" }}
              >
                Received
              </p>
              <p className="text-sm" style={{ color: "var(--text-1)" }}>
                {contact.received ? fmtDate(contact.received) : "—"}
              </p>
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{
              background: "var(--chip-bg)",
              border: "1px solid var(--panel-border)",
            }}
          >
            <p
              className="text-xs font-medium uppercase tracking-wider mb-2"
              style={{ color: "var(--text-3)" }}
            >
              Message
            </p>
            <p
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: "var(--text-1)" }}
            >
              {contact.message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{ color: "var(--text-2)" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  DELETE CONFIRMATION MODAL — Enquiry                                     */
/* ======================================================================= */

function DeleteEnquiryModal({ open, contact, onClose, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  if (!open) return null;

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(contact.id);
    setDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl p-6 glass-strong fade-up"
        style={{ borderColor: "var(--panel-border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "rgba(255,92,122,0.15)" }}
          >
            <AlertTriangle size={20} style={{ color: "var(--danger)" }} />
          </div>
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-1)" }}
            >
              Delete Enquiry
            </h3>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>
              {contact?.name} — {contact?.email}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm" style={{ color: "var(--text-2)" }}>
          Are you sure you want to delete this enquiry? This action cannot be
          undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{ color: "var(--text-2)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition-transform duration-150 active:scale-95 disabled:opacity-40"
            style={{
              background: "rgba(255,92,122,0.15)",
              color: "var(--danger)",
              border: "1px solid rgba(255,92,122,0.3)",
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EnquiriesPage({ query }) {
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state) => state.contact);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const openViewModal = (contact) => {
    setSelectedContact(contact);
    setViewModalOpen(true);
  };

  const openDeleteModal = (contact) => {
    setSelectedContact(contact);
    setDeleteModalOpen(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteContact(id));
    dispatch(fetchContacts());
  };

  const tableData = (contacts || []).map((c) => ({
    id: c._id,
    name: c.name || "—",
    email: c.email || "—",
    message: c.message || "—",
    channel: c.channel || "Web Form",
    status: c.status || "open",
    received: c.createdAt ? new Date(c.createdAt) : null,
  }));

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "channel",
      label: "Channel",
      render: (r) => {
        const Icon = CHANNEL_ICON[r.channel] || Mail;
        return (
          <span className="flex items-center gap-1.5">
            <Icon size={12} style={{ color: "var(--text-3)" }} />
            {r.channel}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "received",
      label: "Received",
      render: (r) => (r.received ? fmtDate(r.received) : "—"),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openViewModal(r)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(0,229,255,0.12)",
              color: "var(--cyan)",
              border: "1px solid rgba(0,229,255,0.25)",
            }}
          >
            <Eye size={12} />
            <span>View</span>
          </button>
          <button
            onClick={() => openDeleteModal(r)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(255,92,122,0.12)",
              color: "var(--danger)",
              border: "1px solid rgba(255,92,122,0.25)",
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ),
    },
  ];

  if (loading && tableData.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-16 text-sm"
        style={{ color: "var(--text-3)" }}
      >
        Loading enquiries...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-sm"
        style={{ color: "var(--danger)" }}
      >
        <p>Failed to load enquiries: {error}</p>
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={tableData}
        statusOptions={["open", "in progress", "resolved"]}
        externalQuery={query}
      />

      <ViewContactModal
        open={viewModalOpen}
        contact={selectedContact}
        onClose={() => setViewModalOpen(false)}
      />

      <DeleteEnquiryModal
        open={deleteModalOpen}
        contact={selectedContact}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </>
  );
}

/* ======================================================================= */
/*  CREATE USER MODAL                                                       */
/* ======================================================================= */

function CreateUserModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      await dispatch(registerUser(formData)).unwrap();
      setSuccess(true);
      setTimeout(() => {
        setFormData({ email: "", password: "", role: "admin" });
        setSuccess(false);
        onClose();
        dispatch(fetchAllUsers());
      }, 1500);
    } catch (err) {
      setError(err || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl p-6 glass-strong fade-up"
        style={{ borderColor: "var(--panel-border)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "rgba(0,229,255,0.15)" }}
          >
            <UserPlus size={20} style={{ color: "var(--cyan)" }} />
          </div>
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-1)" }}
            >
              Create New User
            </h3>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>
              Add a new admin dashboard user
            </p>
          </div>
        </div>

        {success ? (
          <div
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
            style={{
              background: "rgba(46,230,166,0.12)",
              color: "var(--success)",
              border: "1px solid rgba(46,230,166,0.28)",
            }}
          >
            <CheckCircle2 size={18} />
            User created successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{
                  background: "rgba(255,92,122,0.12)",
                  color: "var(--danger)",
                  border: "1px solid rgba(255,92,122,0.28)",
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                className="mb-1.5 block text-xs font-medium"
                style={{ color: "var(--text-2)" }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                className="vtx-input w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ color: "var(--text-1)" }}
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-xs font-medium"
                style={{ color: "var(--text-2)" }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="vtx-input w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ color: "var(--text-1)" }}
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-xs font-medium"
                style={{ color: "var(--text-2)" }}
              >
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="vtx-input w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ color: "var(--text-1)" }}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
                <option value="support">Support</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium"
                style={{ color: "var(--text-2)" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="rounded-lg px-4 py-2 text-sm font-semibold transition-transform duration-150 active:scale-95 disabled:opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, var(--cyan), var(--violet))",
                  color: "#04060a",
                }}
              >
                {creating ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  MAIN CONTENT SWITCH                                                     */
/* ======================================================================= */

function MainContent({ page, query, theme }) {
  switch (page) {
    case "users":
      return <UsersPage query={query} />;
    case "appointments":
      return <AppointmentsPage query={query} />;
    case "enquiries":
      return <EnquiriesPage query={query} />;
    default:
      return <OverviewPage theme={theme} />;
  }
}

/* ======================================================================= */
/*  ROOT — VERTEX OPS DASHBOARD                                             */
/* ======================================================================= */

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const key = useRef(0);

  // Verify auth session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        await dispatch(fetchUser()).unwrap();
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/auth/login");
      }
    };
    verifySession();
  }, [dispatch, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => setQuery(""), [page]);

  const counts = {
    users: USERS.length,
    appointments: APPOINTMENTS.filter((a) => a.status !== "cancelled").length,
    enquiries: ENQUIRIES.filter((e) => e.status !== "resolved").length,
  };

  return (
    <div
      className="vtx-root relative flex h-screen w-full overflow-hidden"
      data-theme={theme}
    >
      <div className="grid-bg pointer-events-none absolute inset-0" />

      <Sidebar
        active={page}
        onNavigate={(k) => {
          setPage(k);
          setSidebarOpen(false);
          key.current += 1;
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        counts={counts}
      />

      <main className="relative z-10 flex-1 overflow-y-auto">
        <div
          className={`mx-auto max-w-6xl px-4 py-6 transition-opacity duration-500 sm:px-6 lg:px-8 lg:py-8 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          <TopBar
            page={page}
            onMenuClick={() => setSidebarOpen(true)}
            query={query}
            setQuery={setQuery}
            theme={theme}
            onToggleTheme={() =>
              setTheme((t) => (t === "dark" ? "light" : "dark"))
            }
            onCreateUser={() => setCreateUserOpen(true)}
          />
          <div className="mt-6" key={page}>
            <MainContent page={page} query={query} theme={theme} />
          </div>

          <CreateUserModal
            open={createUserOpen}
            onClose={() => setCreateUserOpen(false)}
          />
        </div>
      </main>
    </div>
  );
}
