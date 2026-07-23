import { DataTable } from "./DataTable";
import { StatusBadge } from "./StatusBadge";
import { APPOINTMENTS } from "../data/mockData";
import { fmtDate } from "../utils/helpers";

export function AppointmentsPage({ query }) {
  const columns = [
    { key: "client", label: "Client" },
    { key: "service", label: "Service" },
    { key: "staff", label: "Staff" },
    { key: "date", label: "Date", render: (r) => fmtDate(r.date) },
    { key: "time", label: "Time" },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={APPOINTMENTS}
      statusOptions={["confirmed", "pending", "completed", "cancelled"]}
      externalQuery={query}
    />
  );
}
