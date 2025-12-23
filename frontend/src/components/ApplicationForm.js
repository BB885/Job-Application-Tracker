import React, { useState } from "react";

export default function ApplicationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    date_applied: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      company: "",
      role: "",
      status: "Applied",
      date_applied: "",
      notes: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      <div className="row">
        <div style={{ flex: 1, minWidth: 240 }}>
          <input
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <input
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="row">
        <div style={{ flex: 1, minWidth: 200 }}>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            name="date_applied"
            type="date"
            value={formData.date_applied}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <input name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} />

      <div className="row">
        <button className="btn btnPrimary" type="submit">Save</button>
      </div>
    </form>
  );
}
