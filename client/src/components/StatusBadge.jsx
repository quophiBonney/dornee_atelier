import { Circle } from "lucide-react";
import { STATUS_CONFIG } from "../data/constants";

export function StatusBadge({ status }) {
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
