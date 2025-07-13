import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkerDashboard.css";

const categories = ["Plumbing", "Electrical", "Carpentry", "Cleaning", "Painting", "Gardening", "Moving", "Construction", "Maintenance", "Other"];

const WorkerPostWork = () => {
  const [form, setForm] = useState({
    category: "",
    description: "",
    ratePerHour: "",
    ratePerDay: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };



  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!form.category) {
      newErrors.category = "Category is required.";
    }
    
    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (form.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters.";
    }
    
    if (!form.location.trim()) {
      newErrors.location = "Location is required.";
    }
    
    // At least one rate should be provided
    if (!form.ratePerHour && !form.ratePerDay) {
      newErrors.ratePerHour = "Either hourly rate or daily rate is required.";
      newErrors.ratePerDay = "Either hourly rate or daily rate is required.";
    }
    
    // Validate rates if provided
    if (form.ratePerHour && (isNaN(Number(form.ratePerHour)) || Number(form.ratePerHour) <= 0)) {
      newErrors.ratePerHour = "Hourly rate must be a positive number.";
    }
    
    if (form.ratePerDay && (isNaN(Number(form.ratePerDay)) || Number(form.ratePerDay) <= 0)) {
      newErrors.ratePerDay = "Daily rate must be a positive number.";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("Please fix the errors above.");
      return;
    }
    
    setLoading(true);
    try {
      const worker = JSON.parse(localStorage.getItem("worker") || "{}");
      if (!worker.id) {
        throw new Error("Worker not authenticated");
      }
      
      // Prepare the request body matching the API structure
      const requestBody = {
        category: form.category,
        description: form.description,
        location: form.location,
        ...(form.ratePerHour && { ratePerHour: Number(form.ratePerHour) }),
        ...(form.ratePerDay && { ratePerDay: Number(form.ratePerDay) })
      };
      
      const response = await fetch("http://localhost:5000/api/jobposts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("workerToken")}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create job post");
      }
      
      const result = await response.json();
      setMessage("Job post created successfully! Redirecting to your job posts...");
      
      // Reset form
      setForm({
        category: "",
        description: "",
        ratePerHour: "",
        ratePerDay: "",
        location: ""
      });
      setTimeout(() => navigate("/worker/my-job-posts"), 2000);
    } catch (err: any) {
      setMessage(err.message || "Error posting work. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="worker-form-container">
      <form className="worker-form" onSubmit={handleSubmit}>
        <h2>Create Job Post</h2>
        <p className="form-subtitle">Post a job to find workers for your project</p>
        
        {/* Job Category */}
        <div className="form-section">
          <h3>Job Category</h3>
          <select 
            name="category" 
            value={form.category} 
            onChange={handleChange} 
            required
            className={errors.category ? "error" : ""}
          >
            <option value="">Select Job Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="form-error">{errors.category}</span>}
        </div>

        {/* Job Description */}
        <div className="form-section">
          <h3>Job Description</h3>
          <textarea
            name="description"
            placeholder="Describe the job in detail. What needs to be done? Any specific requirements, skills needed, or special instructions?"
            value={form.description}
            onChange={handleChange}
            required
            rows={6}
            className={errors.description ? "error" : ""}
          />
          {errors.description && <span className="form-error">{errors.description}</span>}
          <p className="form-help">Minimum 20 characters. Be specific about the work requirements.</p>
        </div>

        {/* Location */}
        <div className="form-section">
          <h3>Job Location</h3>
          <input
            name="location"
            placeholder="Enter job location (e.g., Mumbai, Maharashtra or specific address)"
            value={form.location}
            onChange={handleChange}
            required
            className={errors.location ? "error" : ""}
          />
          {errors.location && <span className="form-error">{errors.location}</span>}
        </div>

        {/* Pricing */}
        <div className="form-section">
          <h3>Pricing</h3>
          <p className="form-help">Provide at least one rate option (hourly or daily)</p>
          
          <div className="form-row">
            <div className="form-group">
              <label>Hourly Rate (₹)</label>
              <input
                name="ratePerHour"
                placeholder="e.g., 500"
                value={form.ratePerHour}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.01"
                className={errors.ratePerHour ? "error" : ""}
              />
              {errors.ratePerHour && <span className="form-error">{errors.ratePerHour}</span>}
            </div>
            
            <div className="form-group">
              <label>Daily Rate (₹)</label>
              <input
                name="ratePerDay"
                placeholder="e.g., 4000"
                value={form.ratePerDay}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.01"
                className={errors.ratePerDay ? "error" : ""}
              />
              {errors.ratePerDay && <span className="form-error">{errors.ratePerDay}</span>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Creating Job Post...
            </>
          ) : (
            "Create Job Post"
          )}
        </button>
        
        {message && (
          <p className={`form-message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default WorkerPostWork; 