import React, { useState } from "react";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

function pillClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "interview") return "pill interview";
  if (s === "offer") return "pill offer";
  if (s === "rejected") return "pill rejected";
  return "pill applied";
}

export default function ApplicationList({ applications, onDelete, onUpdate }) {
  const list = Array.isArray(applications) ? applications : [];

  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingId, setSavingId] = useState(null);

  const saveFull = async (app, patch) => {
    setSavingId(app.id);

    // PUT expects all fields
    const payload = {
      company: app.company,
      role: app.role,
      status: app.status,
      date_applied: app.date_applied,
      notes: app.notes || "",
      ...patch,
    };

    await onUpdate(app.id, payload);

    setSavingId(null);
    setEditingStatusId(null);
    setEditingNotesId(null);
  };

  const handleDeleteClick = async (app) => {
    const ok = window.confirm(`Delete ${app.company} – ${app.role}?`);
    if (!ok) return;
    await onDelete(app.id);
  };

  const startEditNotes = (app) => {
    setEditingNotesId(app.id);
    setNotesDraft(app.notes || "");
  };

  const cancelEditNotes = () => {
    setEditingNotesId(null);
    setNotesDraft("");
  };

  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: 10 }}>Applications</h2>

      {list.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No applications yet.</p>
      ) : (
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date</th>
                <th>Notes</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {list.map((app) => (
                <tr key={app.id}>
                  <td>{app.company}</td>
                  <td>{app.role}</td>

                  {/* Inline status edit */}
                  <td>
                    {editingStatusId === app.id ? (
                      <select
                        value={app.status}
                        onChange={(e) => saveFull(app, { status: e.target.value })}
                        disabled={savingId === app.id}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        className="btn"
                        onClick={() => setEditingStatusId(app.id)}
                        style={{ padding: 0, border: "none", background: "transparent" }}
                        title="Click to change status"
                      >
                        <span className={pillClass(app.status)} style={{ cursor: "pointer" }}>
                          {savingId === app.id ? "Saving..." : app.status}
                        </span>
                      </button>
                    )}
                  </td>

                  <td>{app.date_applied}</td>

                  {/* Inline notes edit */}
                  <td style={{ color: "var(--muted)", minWidth: 240 }}>
                    {editingNotesId === app.id ? (
                      <div style={{ display: "grid", gap: 8 }}>
                        <input
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          placeholder="Add notes..."
                          disabled={savingId === app.id}
                        />
                        <div className="row">
                          <button
                            className="btn btnPrimary"
                            onClick={() => saveFull(app, { notes: notesDraft })}
                            disabled={savingId === app.id}
                            type="button"
                          >
                            Save
                          </button>
                          <button className="btn" onClick={cancelEditNotes} type="button">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn"
                        onClick={() => startEditNotes(app)}
                        style={{ padding: 0, border: "none", background: "transparent", textAlign: "left" }}
                        title="Click to edit notes"
                      >
                        <span style={{ color: "var(--muted)" }}>
                          {app.notes ? app.notes : "N/A"}
                        </span>
                      </button>
                    )}
                  </td>

                  {/* Confirm delete */}
                  <td>
                    <button className="btn btnDanger" onClick={() => handleDeleteClick(app)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
