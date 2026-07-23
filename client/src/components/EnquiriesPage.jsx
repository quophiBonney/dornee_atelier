import { DataTable } from "./DataTable";
import { StatusBadge } from "./StatusBadge";
import { ENQUIRIES } from "../data/mockData";
import { CHANNEL_ICON } from "../data/constants";
import { fmtDate } from "../utils/helpers";

export function EnquiriesPage({ query }) {
  const columns = [
    { key: "name", label: "Name" },
    { key: "subject", label: "Subject" },
    {
      key: "channel",
      label: "Channel",
      render: (r) => {
        const Icon = CHANNEL_ICON[r.channel];
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
    { key: "received", label: "Received", render: (r) => fmtDate(r.received) },
  ];

  return (
    <DataTable
      columns={columns}
      data={ENQUIRIES}
      statusOptions={["open", "in progress", "resolved"]}
      externalQuery={query}
    />
  );
}
