import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './WorkerLogin.css';

const WorkerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!email || !password) {
    toast.error('Please fill in all fields');
    return;
  }
  setLoading(true);
  try {
    const response = await axios.post('http://localhost:5000/api/employee/login', {
      email,
      password,
    });

    if (response.status === 200) {
      const { token, user } = response.data;

      // ✅ Store token separately
      localStorage.setItem('workerToken', token);
      // ✅ Store worker data separately
      localStorage.setItem('worker', JSON.stringify(user));

      // Check if application is approved and show appropriate message
      if (user.applicationStatus === 'accepted') {
        toast.success('🎉 Welcome back! Your application is approved. Redirecting to dashboard...', { autoClose: 2000 });
        setTimeout(() => {
          navigate('/worker/dashboard');
        }, 2000);
      } else {
        toast.success('Login successful! Redirecting...', { autoClose: 1500 });
        setTimeout(() => {
          navigate('/worker/dashboard');
        }, 1500);
      }
    }
  } catch (error) {
    toast.error('Invalid credentials or server error');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="worker-login-container">
      <ToastContainer />
      <div className="worker-login-card">
        <h2>Worker Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p onClick={() => navigate('/worker/register')} className="worker-login-register-link">
          New Worker? Register here
        </p>
      </div>
    </div>
  );
};

export default WorkerLogin;
