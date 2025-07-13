import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WorkerRegister.css';

const WorkerRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [workerData, setWorkerData] = useState({
        email: "",
        password: "",
        confirmPassword: "", // ✅ NEW
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

        // ✅ Confirm Password Validation
        if (workerData.password !== workerData.confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            // Do not send confirmPassword to backend
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
                alert('Worker registered successfully!');
                navigate('/worker-dashboard');
            }
        } catch (error) {
            console.error('Error registering worker:', error);
            alert('Error registering worker. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="worker-register-container">
            <form className="worker-register-form" onSubmit={handleSubmit}>
                <h2>Worker Registration</h2>
                <div className="form-row">
                    {/* Names */}
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" value={workerData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Middle Name</label>
                        <input type="text" name="middleName" value={workerData.middleName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={workerData.lastName} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={workerData.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={workerData.password} onChange={handleChange} required />
                </div>

                {/* ✅ Confirm Password Field */}
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={workerData.confirmPassword} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Age</label>
                    <input type="text" name="age" value={workerData.age} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Address</label>
                    <textarea name="address" value={workerData.address} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>State</label>
                        <input type="text" name="state" value={workerData.state} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Pin Code</label>
                        <input type="text" name="pinCode" value={workerData.pinCode} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Nationality</label>
                        <input type="text" name="nationality" value={workerData.nationality} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Mobile Number</label>
                    <input type="text" name="mobileNumber" value={workerData.mobileNumber} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Work Experience</label>
                    <input type="text" name="workExperience" value={workerData.workExperience} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Upload Work Experience Certificate</label>
                    <input type="file" onChange={(e) => handleFileChange(e, setWorkExperienceFile)} />
                </div>
                <div className="form-group">
                    <label>Upload Aadhaar Card</label>
                    <input type="file" onChange={(e) => handleFileChange(e, setAadharFile)} />
                </div>

                <div className="form-group">
                    <label>Upload PAN Card</label>
                    <input type="file" onChange={(e) => handleFileChange(e, setPanFile)} />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default WorkerRegister;
