import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ApplicationList from "../components/ApplicationList";
import StatusPieChart from "../components/StatusPieChart";
import { getApplications, deleteApplication, updateApplication } from "../services/api";
import { exportAnalyticsPdf } from "../utils/exportAnalyticsPdf";

function computeCounts(apps) {
  const c = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  for (const a of apps) {
    if (c[a.status] !== undefined) c[a.status] += 1;
  }
  return c;
}

function compareDate(a, b) {
  // date_applied is "YYYY-MM-DD"
  return String(a.date_applied || "").localeCompare(String(b.date_applied || ""));
}

export default function TrackerPage({ theme, toggleTheme }) {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date_desc"); // date_desc, date_asc, company_asc, company_desc, status_asc

  const fetchApplications = async () => {
    const res = await getApplications();
    setApplications(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    await deleteApplication(id);
    fetchApplications();
  };

  const handleUpdate = async (id, updated) => {
    await updateApplication(id, updated);
    fetchApplications();
  };

  const filteredApps = useMemo(() => {
    const s = search.trim().toLowerCase();

    const filtered = applications.filter((a) => {
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      const matchesSearch =
        s === "" ||
        (a.company || "").toLowerCase().includes(s) ||
        (a.role || "").toLowerCase().includes(s) ||
        (a.notes || "").toLowerCase().includes(s);
      return matchesStatus && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "date_asc") return compareDate(a, b);
      if (sort === "date_desc") return compareDate(b, a);
      if (sort === "company_asc") return String(a.company || "").localeCompare(String(b.company || ""));
      if (sort === "company_desc") return String(b.company || "").localeCompare(String(a.company || ""));
      if (sort === "status_asc") return String(a.status || "").localeCompare(String(b.status || ""));
      return 0;
    });

    return sorted;
  }, [applications, statusFilter, search, sort]);

  const counts = useMemo(() => computeCounts(applications), [applications]);

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>Internship Application Tracker</h1>
          <p style={{ marginTop: 6, color: "var(--muted)" }}>
            Filter, search, sort, and track outcomes.
          </p>
        </div>

        <div className="row">
          <button className="btn" onClick={toggleTheme}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <Link to="/add" className="btn btnPrimary" style={{ textDecoration: "none" }}>
            + Add application
          </Link>
        </div>
      </div>

        {/* Analytics (discreet) */}
        <div className="card" style={{ marginTop: 16 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div className="row" style={{ gap: 16, alignItems: "center" }}>
            <div id="analytics-chart">
                <StatusPieChart counts={counts} size={110} />
            </div>


            <div>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Analytics</div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Hover slices for count + %
                </div>

                {/* discreet legend (no numbers) */}
                <div className="row" style={{ gap: 10, marginTop: 10, color: "var(--muted)", fontSize: 13 }}>
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: "#111827" }} />
                    Applied
                </span>
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: "#eab308" }} />
                    Interview
                </span>
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: "#22c55e" }} />
                    Offer
                </span>
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ef4444" }} />
                    Rejected
                </span>
                </div>
            </div>
            </div>

            <div className="row" style={{ gap: 10 }}>
            <div style={{ color: "var(--muted)" }}>
                Total: <strong>{applications.length}</strong>
            </div>
            <button
                className="btn"
                onClick={() =>
                    exportAnalyticsPdf({
                    counts,
                    total: applications.length,
                    })
                }
                >
                Export PDF
                </button>
            </div>
        </div>
        </div>


      {/* Filters + sorting */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="row">
          <div style={{ flex: 2, minWidth: 260 }}>
            <input
              placeholder="Search company / role / notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ flex: 1, minWidth: 180 }}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 190 }}>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="date_desc">Sort: Date (new → old)</option>
              <option value="date_asc">Sort: Date (old → new)</option>
              <option value="company_asc">Sort: Company (A → Z)</option>
              <option value="company_desc">Sort: Company (Z → A)</option>
              <option value="status_asc">Sort: Status (A → Z)</option>
            </select>
          </div>

          <div style={{ color: "var(--muted)" }}>
            Showing <strong>{filteredApps.length}</strong> of{" "}
            <strong>{applications.length}</strong>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="card" style={{ marginTop: 16 }}>
        <ApplicationList
          applications={filteredApps}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
