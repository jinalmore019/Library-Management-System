import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = ({ setAuthStatus }) => {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Forgot Password Modal State
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [tempPassword, setTempPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (mode === 'login') {
                const authString = window.btoa(`${username}:${password}`);
                await api.verifyLogin(authString);
                localStorage.setItem('auth', authString);
                setAuthStatus(true);
                toast.success("Login Successful!");
                navigate('/');
            } else {
                await api.register({ username, email, password });
                toast.success("Registration Successful! You can now log in.");
                setMode('login');
                setPassword('');
            }
        } catch (error) {
            toast.error(error.message || (mode === 'login' ? "Invalid Credentials" : "Registration Failed"));
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.forgotPassword(forgotEmail);
            toast.success(res.message);
            if (res.tempPassword) {
                setTempPassword(res.tempPassword);
            }
        } catch (err) {
            toast.error(err.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', width: '100vw', background: 'var(--bg-color)'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', textAlign: 'center' }}>
                <h1 className="title" style={{ marginBottom: '0.5rem', fontSize: '2.2rem' }}>LMS Pro</h1>
                <p className="subtitle" style={{ marginBottom: '2rem' }}>{mode === 'login' ? 'Sign in to your account' : 'Create a new admin account'}</p>
                
                <div style={{ display: 'flex', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
                    <button 
                        style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', background: mode === 'login' ? 'var(--accent)' : 'transparent', color: mode === 'login' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600' }}
                        onClick={() => { setMode('login'); setTempPassword(''); }}
                    >Login</button>
                    <button 
                        style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', background: mode === 'register' ? 'var(--accent)' : 'transparent', color: mode === 'register' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600' }}
                        onClick={() => { setMode('register'); setTempPassword(''); }}
                    >Register</button>
                </div>

                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div className="form-group">
                        <label>Username</label>
                        <input required type="text" className="input" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    {mode === 'register' && (
                        <div className="form-group">
                            <label>Email Address</label>
                            <input required type="email" className="input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    )}
                    <div className="form-group" style={{ marginBottom: mode === 'login' ? '1rem' : '2rem' }}>
                        <label>Password</label>
                        <input required type="password" className="input" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    
                    {mode === 'login' && (
                        <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
                            <button type="button" onClick={() => setIsForgotModalOpen(true)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem' }}>
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button type="submit" className="btn" style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }} disabled={loading}>
                        {loading ? 'Please wait...' : (mode === 'login' ? 'Login Securely' : 'Create Account')}
                    </button>
                </form>
            </div>

            {/* Forgot Password Modal */}
            {isForgotModalOpen && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content animate-fade-in" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => { setIsForgotModalOpen(false); setTempPassword(''); }}>
                                <X size={20} />
                            </button>
                        </div>
                        <h3>Reset Password</h3>
                        
                        {!tempPassword ? (
                            <>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
                                    Enter your registered email address and we will generate a temporary password for you.
                                </p>
                                <form onSubmit={handleForgotPassword} style={{ textAlign: 'left' }}>
                                    <div className="form-group">
                                        <input required type="email" className="input" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                                        {loading ? 'Processing...' : 'Generate New Password'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={{ marginTop: '2rem' }}>
                                <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed var(--accent)', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>Your temporary password is:</p>
                                    <h2 style={{ color: 'var(--text-primary)', letterSpacing: '2px' }}>{tempPassword}</h2>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--error)' }}>Please login and change your password immediately!</p>
                                <button className="btn" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => { setIsForgotModalOpen(false); setTempPassword(''); setMode('login'); }}>
                                    Back to Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
