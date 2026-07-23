import {
  Users as UsersIcon,
  CalendarClock,
  Inbox,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import { KpiCard } from "./KpiCard";
import { ActivityChart } from "./ActivityChart.jsx";
import { ChannelSplit } from "./ChannelSplit";
import { StatusBadge } from "./StatusBadge";
import { USERS, APPOINTMENTS, ENQUIRIES } from "../data/mockData";
import { fmtDate } from "../utils/helpers";

export function OverviewPage({ theme }) {
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
