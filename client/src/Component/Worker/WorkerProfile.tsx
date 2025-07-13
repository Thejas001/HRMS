import { useState, useEffect } from "react";
import "./WorkerDashboard.css";

const WorkerProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const worker = JSON.parse(localStorage.getItem("worker") || "{}");
    setProfile(worker);
    setForm(worker);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Implement API call to update profile if needed
    setProfile(form);
    setEdit(false);
    localStorage.setItem("worker", JSON.stringify(form));
  };

  return (
    <div>
      <h2>My Profile</h2>
      <div className="profile-section">
        <label>Name:</label>
        {edit ? (
          <input name="name" value={form.name || ""} onChange={handleChange} />
        ) : (
          <span>{profile?.name}</span>
        )}
      </div>
      <div className="profile-section">
        <label>Email:</label>
        {edit ? (
          <input name="email" value={form.email || ""} onChange={handleChange} />
        ) : (
          <span>{profile?.email}</span>
        )}
      </div>
      <div className="profile-section">
        <label>Phone:</label>
        {edit ? (
          <input name="phone" value={form.phone || ""} onChange={handleChange} />
        ) : (
          <span>{profile?.phone}</span>
        )}
      </div>
      <div className="profile-section">
        <label>Status:</label>
        <span>{profile?.applicationStatus}</span>
      </div>
      <div className="profile-section">
        {edit ? (
          <>
            <button className="primary-button" onClick={handleSave}>Save</button>
            <button className="secondary-button" onClick={() => setEdit(false)}>Cancel</button>
          </>
        ) : (
          <button className="primary-button" onClick={() => setEdit(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default WorkerProfile; 