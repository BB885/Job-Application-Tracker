import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm";
import { createApplication } from "../services/api";

export default function AddApplicationPage() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    await createApplication(data);
    navigate("/");
  };

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>Add application</h1>
          <p style={{ marginTop: 6, color: "var(--muted)" }}>
            Fill the details and save.
          </p>
        </div>

        <Link to="/" className="btn" style={{ textDecoration: "none" }}>
          ← Back
        </Link>
      </div>

      <div className="card" style={{ marginTop: 16, maxWidth: 700 }}>
        <ApplicationForm onSubmit={handleCreate} />
      </div>
    </div>
  );
}
