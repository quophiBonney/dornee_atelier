import { DataTable } from "./DataTable";
import { StatusBadge } from "./StatusBadge";
import { USERS } from "../data/mockData";
import { fmtDate } from "../utils/helpers";

export function UsersPage({ query }) {
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
            {r.name
              .split(" ")
              .map((p) => p[0])
              .join("")}
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
    { key: "joined", label: "Joined", render: (r) => fmtDate(r.joined) },
    {
      key: "lastActive",
      label: "Last active",
      render: (r) => fmtDate(r.lastActive),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={USERS}
      statusOptions={["active", "invited", "suspended"]}
      externalQuery={query}
    />
  );
}
