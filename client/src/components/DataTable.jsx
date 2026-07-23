import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { STATUS_CONFIG } from "../data/constants";

export function DataTable({
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
