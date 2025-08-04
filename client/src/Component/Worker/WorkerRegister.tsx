import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './WorkerRegister.css';

const WorkerRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [workerData, setWorkerData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        middleName: "",
        lastName: "",
        age: "",
        address: "",
        state: "",
        pinCode: "",
        mobileNumber: "",
        nationality: "",
        workExperience: "",
        workType: "",
    });

    const [workExperienceFile, setWorkExperienceFile] = useState<File | null>(null);
    const [aadharFile, setAadharFile] = useState<File | null>(null);
    const [panFile, setPanFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setWorkerData({ ...workerData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (workerData.password !== workerData.confirmPassword) {
            toast.error("Passwords do not match. Please try again.");
            return;
        }

        if (workerData.password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (!workerData.email.includes('@')) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (workerData.mobileNumber.length < 10) {
            toast.error("Please enter a valid mobile number.");
            return;
        }

        if (parseInt(workerData.age) < 18 || parseInt(workerData.age) > 65) {
            toast.error("Age must be between 18 and 65 years.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            const { confirmPassword, ...dataToSend } = workerData;
            Object.entries(dataToSend).forEach(([key, value]) => {
                formData.append(key, value);
            });
            if (workExperienceFile) {
                formData.append('certificate', workExperienceFile);
            }
            if (aadharFile) {
                formData.append('aadharCard', aadharFile);
            }
            if (panFile) {
                formData.append('panCard', panFile);
            }

            const response = await axios.post("http://localhost:5000/api/employee/register", formData);
            if (response.status === 201 || response.status === 200) {
                const token = response.data.token;
                if (token) {
                    localStorage.setItem('workerToken', token);
                }
                toast.success('Registration successful! Your application is pending admin approval.');
                setTimeout(() => navigate('/worker/dashboard'), 2000);
            }
        } catch (error: any) {
            console.error('Error registering worker:', error);
            if (error.response?.status === 400) {
                toast.error(error.response.data.message || 'Invalid data provided. Please check your information.');
            } else if (error.response?.status === 409) {
                toast.error('Email already exists. Please use a different email address.');
            } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
                toast.error('Unable to connect to server. Please ensure the backend server is running on port 5000.');
            } else {
                toast.error(error.response?.data?.message || 'Error registering worker. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animated-register-container">
            <ToastContainer />
            <div className="animated-register-card">
                <div className="animated-header">
                    <h1>Worker Registration</h1>
                    <p>Create your account to start working</p>
                </div>

                <form className="animated-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Personal Details</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name *</label>
                                <input 
                                    type="text" 
                                    id="firstName"
                                    name="firstName" 
                                    value={workerData.firstName} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="First name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name *</label>
                                <input 
                                    type="text" 
                                    id="lastName"
                                    name="lastName" 
                                    value={workerData.lastName} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Last name"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="age">Age *</label>
                                <input 
                                    type="number" 
                                    id="age"
                                    name="age" 
                                    value={workerData.age} 
                                    onChange={handleChange} 
                                    required 
                                    min="18"
                                    max="65"
                                    placeholder="Age"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mobileNumber">Mobile Number *</label>
                                <input 
                                    type="tel" 
                                    id="mobileNumber"
                                    name="mobileNumber" 
                                    value={workerData.mobileNumber} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Mobile number"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input 
                                type="email" 
                                id="email"
                                name="email" 
                                value={workerData.email} 
                                onChange={handleChange} 
                                required 
                                placeholder="Email address"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Address</h3>
                        <div className="form-group">
                            <label htmlFor="address">Full Address *</label>
                            <textarea 
                                id="address"
                                name="address" 
                                value={workerData.address} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter your complete address"
                                rows={3}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="state">State *</label>
                                <input 
                                    type="text" 
                                    id="state"
                                    name="state" 
                                    value={workerData.state} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="State"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pinCode">Pin Code *</label>
                                <input 
                                    type="text" 
                                    id="pinCode"
                                    name="pinCode" 
                                    value={workerData.pinCode} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Pin code"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Account Security</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">Password *</label>
                                <input 
                                    type="password" 
                                    id="password"
                                    name="password" 
                                    value={workerData.password} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Password"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password *</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword"
                                    name="confirmPassword" 
                                    value={workerData.confirmPassword} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Professional Information</h3>
                        <div className="form-group">
                            <label htmlFor="workType">Work Type *</label>
                            <select 
                                id="workType"
                                name="workType" 
                                value={workerData.workType} 
                                onChange={handleChange} 
                                required 
                            >
                                <option value="">Select your work type</option>
                                <option value="Electrician">Electrician</option>
                                <option value="Plumber">Plumber</option>
                                <option value="Painter">Painter</option>
                                <option value="Carpenter">Carpenter</option>
                                <option value="Gardener">Gardener</option>
                                <option value="Cleaner">Cleaner</option>
                                <option value="Mason">Mason</option>
                                <option value="Welder">Welder</option>
                                <option value="Mechanic">Mechanic</option>
                                <option value="Driver">Driver</option>
                                <option value="Cook">Cook</option>
                                <option value="Security Guard">Security Guard</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="workExperience">Work Experience *</label>
                            <input 
                                type="text" 
                                id="workExperience"
                                name="workExperience" 
                                value={workerData.workExperience} 
                                onChange={handleChange} 
                                required 
                                placeholder="Describe your work experience"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Documents</h3>
                        <div className="form-group">
                            <label htmlFor="aadharFile">Aadhaar Card *</label>
                            <input 
                                type="file" 
                                id="aadharFile"
                                onChange={(e) => handleFileChange(e, setAadharFile)}
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="panFile">PAN Card *</label>
                            <input 
                                type="file" 
                                id="panFile"
                                onChange={(e) => handleFileChange(e, setPanFile)}
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="workExperienceFile">Work Experience Certificate</label>
                            <input 
                                type="file" 
                                id="workExperienceFile"
                                onChange={(e) => handleFileChange(e, setWorkExperienceFile)}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                        <p className="login-link">
                            Already have an account? <span onClick={() => navigate('/worker/login')}>Login here</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkerRegister;
