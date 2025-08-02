import { useState, useEffect, useRef } from "react";
import "./WorkerDashboard.css";

const WorkerProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const worker = JSON.parse(localStorage.getItem("worker") || "{}");
    setProfile(worker);
    setForm(worker);
    // Load existing images if any
    if (worker.images) {
      setUploadedImages(worker.images);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              newImages.push(event.target.result as string);
              setUploadedImages(prev => [...prev, event.target?.result as string]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedProfile = {
        ...form,
        images: uploadedImages
      };
      
      setProfile(updatedProfile);
      setEdit(false);
      setPreview(false);
      localStorage.setItem("worker", JSON.stringify(updatedProfile));
      setMessage("Profile updated successfully!");
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEdit(false);
    setPreview(false);
    setUploadedImages(profile.images || []);
    setMessage("");
  };





  const isApproved = profile?.applicationStatus?.toLowerCase() === 'approved';

  if (!profile) {
    return (
      <div className="worker-profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="worker-profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      {message && (
        <div className={`form-message ${message.includes('Error') ? 'error' : ''}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'W'}
            </div>
            {isApproved && (
              <div className="approved-badge">
                <span>✓ Approved Worker</span>
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="info-section">
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  {edit ? (
                    <input
                      type="text"
                      name="name"
                      value={form.name || ""}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="info-value">{profile.name || "Not provided"}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  {edit ? (
                    <input
                      type="email"
                      name="email"
                      value={form.email || ""}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="info-value">{profile.email || "Not provided"}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  {edit ? (
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone || ""}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="info-value">{profile.phone || "Not provided"}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  {edit ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="info-value">
                      {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not provided"}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                {edit ? (
                  <textarea
                    name="address"
                    value={form.address || ""}
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    rows={4}
                  />
                ) : (
                  <div className="info-value address-display">{profile.address || "Not provided"}</div>
                )}
              </div>

              {isApproved && (
                <div className="form-group">
                  <label>Profile Images</label>
                  {edit ? (
                    <div className="image-upload-section">
                      <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                        <div className="upload-icon">📷</div>
                        <p>Click to upload images</p>
                        <span>Supports: JPG, PNG, GIF (Max 5 images)</span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      
                      {uploadedImages.length > 0 && (
                        <div className="image-preview-grid">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="image-preview-item">
                              <img src={image} alt={`Profile ${index + 1}`} />
                              <button
                                className="remove-image-btn"
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="profile-images">
                      {profile.images && profile.images.length > 0 ? (
                        <div className="image-preview-grid">
                          {profile.images.map((image: string, index: number) => (
                            <div key={index} className="image-preview-item">
                              <img src={image} alt={`Profile ${index + 1}`} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-images">No images uploaded</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="info-section">
              <h3>Professional Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Skills</label>
        {edit ? (
                    <input
                      type="text"
                      name="skills"
                      value={form.skills || ""}
                      onChange={handleChange}
                      placeholder="e.g., Plumbing, Electrical, Cleaning"
                    />
                  ) : (
                    <div className="info-value">{profile.skills || "Not specified"}</div>
        )}
      </div>

                <div className="form-group">
                  <label>Experience (Years)</label>
        {edit ? (
                    <input
                      type="number"
                      name="experience"
                      value={form.experience || ""}
                      onChange={handleChange}
                      placeholder="Years of experience"
                      min="0"
                    />
                  ) : (
                    <div className="info-value">{profile.experience ? `${profile.experience} years` : "Not specified"}</div>
        )}
      </div>
              </div>

              <div className="form-group">
                <label>Hourly Rate ($)</label>
        {edit ? (
                  <input
                    type="number"
                    name="hourlyRate"
                    value={form.hourlyRate || ""}
                    onChange={handleChange}
                    placeholder="Enter your hourly rate"
                    min="0"
                    step="0.01"
                  />
                ) : (
                  <div className="info-value">
                    {profile.hourlyRate ? `$${profile.hourlyRate}/hour` : "Not specified"}
                  </div>
        )}
      </div>

              {edit && (
                <div className="form-group">
                  <label>Bio/Description</label>
                  <textarea
                    name="bio"
                    value={form.bio || ""}
                    onChange={handleChange}
                    placeholder="Tell customers about yourself, your experience, and what you specialize in..."
                    rows={4}
                  />
                </div>
              )}
      </div>

            

            <div className="profile-actions">
        {edit ? (
                <div className="action-buttons">
                  <button 
                    className="primary-button" 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Saving...
          </>
        ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button className="secondary-button" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="action-buttons">
                  <button className="primary-button" onClick={() => setEdit(true)}>
                    Edit Profile
                  </button>
                  {isApproved && (
                    <button className="preview-button" onClick={() => setPreview(true)}>
                      Preview Profile
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {preview && (
          <div className="preview-modal">
            <div className="preview-content">
              <div className="preview-header">
                <h2>Profile Preview</h2>
                <button className="close-preview" onClick={() => setPreview(false)}>×</button>
              </div>
              <div className="preview-body">
                <div className="preview-avatar">
                  <div className="avatar-circle">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'W'}
                  </div>
                  <h3>{profile.name || "Worker Name"}</h3>
                  <p className="preview-location">{profile.address || "Location not specified"}</p>
                </div>
                
                {profile.images && profile.images.length > 0 && (
                  <div className="preview-images">
                    <h4>Portfolio</h4>
                    <div className="preview-image-grid">
                      {profile.images.map((image: string, index: number) => (
                        <img key={index} src={image} alt={`Work ${index + 1}`} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="preview-details">
                  <div className="preview-section">
                    <h4>Skills</h4>
                    <p>{profile.skills || "Skills not specified"}</p>
                  </div>
                  
                  <div className="preview-section">
                    <h4>Experience</h4>
                    <p>{profile.experience ? `${profile.experience} years` : "Experience not specified"}</p>
                  </div>
                  
                  <div className="preview-section">
                    <h4>Rate</h4>
                    <p>{profile.hourlyRate ? `$${profile.hourlyRate}/hour` : "Rate not specified"}</p>
                  </div>
                  
                  {profile.bio && (
                    <div className="preview-section">
                      <h4>About</h4>
                      <p>{profile.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerProfile; 