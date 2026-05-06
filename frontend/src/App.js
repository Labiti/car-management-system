import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import bgImage from './images/bgcover.jpg';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

//const API_BASE_URL = 'http://127.0.0.1:8000';
const API_BASE_URL = '';

// Animated Background Component with Glass Effect and Waving Dots
function AnimatedBackground({ children, lightOverlay = false }) {
    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: lightOverlay ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.6)',
                zIndex: 1
            }}></div>
            
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                overflow: 'hidden',
                pointerEvents: 'none'
            }}>
                <div className="waving-dots">
                    {[...Array(50)].map((_, i) => (
                        <div 
                            key={i}
                            className="dot"
                            style={{
                                '--delay': `${Math.random() * 5}s`,
                                '--duration': `${3 + Math.random() * 4}s`,
                                '--x': `${Math.random() * 100}%`,
                                '--y': `${Math.random() * 100}%`,
                                '--size': `${5 + Math.random() * 15}px`
                            }}
                        />
                    ))}
                </div>
            </div>
            
            <div style={{ 
                position: 'relative', 
                zIndex: 2,
                backdropFilter: 'blur(10px)',
                minHeight: '100vh'
            }}>
                {children}
            </div>
            
            <style jsx="true">{`
                .waving-dots {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
                
                .dot {
                    position: absolute;
                    width: var(--size);
                    height: var(--size);
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    left: var(--x);
                    top: var(--y);
                    animation: wave var(--duration) ease-in-out infinite;
                    animation-delay: var(--delay);
                    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                }
                
                @keyframes wave {
                    0%, 100% {
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 0.3;
                    }
                    25% {
                        transform: translateY(-20px) translateX(10px) scale(1.2);
                        opacity: 0.7;
                    }
                    50% {
                        transform: translateY(0) translateX(-10px) scale(1);
                        opacity: 0.5;
                    }
                    75% {
                        transform: translateY(20px) translateX(5px) scale(0.8);
                        opacity: 0.7;
                    }
                }
                
                @keyframes runCar {
                    0% {
                        transform: translateX(-100px) translateY(0);
                        opacity: 0;
                    }
                    10% {
                        transform: translateX(-50px) translateY(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translateX(50vw) translateY(-20px);
                        opacity: 1;
                    }
                    90% {
                        transform: translateX(calc(100vw + 100px)) translateY(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(calc(100vw + 100px)) translateY(0);
                        opacity: 0;
                    }
                }
                
                .running-car {
                    position: fixed;
                    bottom: 20px;
                    left: -100px;
                    font-size: 48px;
                    z-index: 10000;
                    animation: runCar 2s ease-in-out forwards;
                    pointer-events: none;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out;
                }
                
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-fadeInRight {
                    animation: fadeInRight 0.4s ease-out;
                }
            `}</style>
        </div>
    );
}

// Home Component
function Home() {
    return (
        <AnimatedBackground lightOverlay={true}>
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ padding: '2rem' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="glass-card shadow-lg overflow-hidden animate-fadeInUp" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '20px' }}>
                                <div className="card-body p-5 text-center">
                                    <div className="mb-4">
                                        <div className="display-1">🚗</div>
                                    </div>
                                    <h1 className="display-4 fw-bold mb-3" style={{ color: '#667eea' }}>
                                        FLEET CAR
                                    </h1>
                                    <p className="lead text-muted mb-4">
                                        Your ultimate solution for fleet management and car booking
                                    </p>
                                    <hr className="my-4" />
                                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                                        <button 
                                            className="btn btn-primary btn-lg px-4 rounded-pill"
                                            onClick={() => window.location.href = '/login'}
                                        >
                                            Login
                                        </button>
                                        <button 
                                            className="btn btn-outline-success btn-lg px-4 rounded-pill"
                                            onClick={() => window.location.href = '/register'}
                                        >
                                            Register
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedBackground>
    );
}

// Login Component
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCar, setShowCar] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('Logging in...');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('user', JSON.stringify(data.user));
                setMessage('Login successful! Redirecting...');
                
                setShowCar(true);
                
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            } else {
                setMessage('Login failed: ' + (data.error || 'Invalid credentials'));
                setLoading(false);
            }
        } catch (error) {
            setMessage('Error: Could not connect to server. Make sure Django is running on port 8001');
            console.error('Login error:', error);
            setLoading(false);
        }
    };

    return (
        <AnimatedBackground lightOverlay={true}>
            {showCar && <div className="running-car">🏎️💨</div>}
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ padding: '2rem' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="card shadow-lg overflow-hidden animate-fadeInUp" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '20px' }}>
                                <div className="card-body p-5">
                                    <div className="text-center mb-4">
                                        <div className="display-4 mb-3">🔐</div>
                                        <h2 className="fw-bold" style={{ color: '#667eea' }}>Welcome Back</h2>
                                        <p className="text-muted">Please login to your account</p>
                                    </div>
                                    
                                    {message && (
                                        <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} rounded-3 animate-fadeInRight`}>
                                            {message}
                                        </div>
                                    )}
                                    
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Username</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">👤</span>
                                                <input 
                                                    type="text" 
                                                    className="form-control border-start-0 ps-0"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    required
                                                    placeholder="Enter your username"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">🔒</span>
                                                <input 
                                                    type="password" 
                                                    className="form-control border-start-0 ps-0"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    placeholder="Enter your password"
                                                />
                                            </div>
                                        </div>
                                        
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary w-100 py-2 rounded-pill fw-semibold"
                                            disabled={loading}
                                        >
                                            {loading ? <span><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</span> : 'Login'}
                                        </button>
                                    </form>
                                    
                                    <div className="text-center mt-4">
                                        <p className="text-muted mb-0">
                                            Don't have an account? 
                                            <button className="btn btn-link p-0 ms-1 text-decoration-none" onClick={() => window.location.href = '/register'}>
                                                Register here
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedBackground>
    );
}

// Register Component
function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        role: 'employee',
        employee_id: '',
        phone_number: '',
        driver_license: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCar, setShowCar] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('Registering...');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('user', JSON.stringify(data.user));
                setMessage('Registration successful! Redirecting...');
                
                setShowCar(true);
                
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            } else {
                const errors = Object.values(data).flat().join(', ');
                setMessage('Registration failed: ' + errors);
                setLoading(false);
            }
        } catch (error) {
            setMessage('Error: Could not connect to server. Make sure Django is running on port 8001');
            console.error('Registration error:', error);
            setLoading(false);
        }
    };

    return (
        <AnimatedBackground lightOverlay={true}>
            {showCar && <div className="running-car">🏎️💨</div>}
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ padding: '2rem' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-7">
                            <div className="card shadow-lg overflow-hidden animate-fadeInUp" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '20px' }}>
                                <div className="card-body p-5">
                                    <div className="text-center mb-4">
                                        <div className="display-4 mb-3">📝</div>
                                        <h2 className="fw-bold" style={{ color: '#667eea' }}>Create Account</h2>
                                        <p className="text-muted">Join us and start managing your fleet</p>
                                    </div>
                                    
                                    {message && (
                                        <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} rounded-3 animate-fadeInRight`}>
                                            {message}
                                        </div>
                                    )}
                                    
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">Username *</label>
                                                <input type="text" className="form-control rounded-3" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required placeholder="Choose a username" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">Email *</label>
                                                <input type="email" className="form-control rounded-3" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="your@email.com" />
                                            </div>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">First Name</label>
                                                <input type="text" className="form-control rounded-3" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} placeholder="First name" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">Last Name</label>
                                                <input type="text" className="form-control rounded-3" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} placeholder="Last name" />
                                            </div>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">Employee ID *</label>
                                                <input type="text" className="form-control rounded-3" value={formData.employee_id} onChange={(e) => setFormData({...formData, employee_id: e.target.value})} placeholder="e.g., EMP001" required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">Phone Number *</label>
                                                <input type="tel" className="form-control rounded-3" value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} required placeholder="+1234567890" />
                                            </div>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">Driver License *</label>
                                                <input type="text" className="form-control rounded-3" value={formData.driver_license} onChange={(e) => setFormData({...formData, driver_license: e.target.value})} required placeholder="License number" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">Role</label>
                                                <select className="form-select rounded-3" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                                    <option value="employee">Employee</option>
                                                    <option value="manager">Manager</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">Password *</label>
                                                <input type="password" className="form-control rounded-3" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required placeholder="Create a password" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">Confirm Password *</label>
                                                <input type="password" className="form-control rounded-3" value={formData.password2} onChange={(e) => setFormData({...formData, password2: e.target.value})} required placeholder="Confirm your password" />
                                            </div>
                                        </div>
                                        
                                        <button type="submit" className="btn btn-success w-100 py-2 rounded-pill fw-semibold mt-2" disabled={loading}>
                                            {loading ? <span><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</span> : 'Create Account'}
                                        </button>
                                    </form>
                                    
                                    <div className="text-center mt-4">
                                        <p className="text-muted mb-0">
                                            Already have an account? 
                                            <button className="btn btn-link p-0 ms-1 text-decoration-none" onClick={() => window.location.href = '/login'}>
                                                Login here
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedBackground>
    );
}

// Car List Component
function CarList({ onRequestCar }) {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCar, setSelectedCar] = useState(null);
    const [hoveredCar, setHoveredCar] = useState(null);
    const carsPerPage = 6;

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/cars/`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                setCars(data.results || data);
            } else if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else {
                setError('Failed to fetch cars');
            }
        } catch (error) {
            setError('Error connecting to server.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const colors = { 'available': 'success', 'in_use': 'warning', 'maintenance': 'danger', 'reserved': 'info', 'out_of_service': 'secondary' };
        return `badge bg-${colors[status] || 'secondary'}`;
    };

    const getStatusText = (status) => {
        const texts = { 'available': 'Available', 'in_use': 'In Use', 'maintenance': 'Under Maintenance', 'reserved': 'Reserved', 'out_of_service': 'Out of Service' };
        return texts[status] || status;
    };

    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
    const totalPages = Math.ceil(cars.length / carsPerPage);

    if (loading) {
        return (
            <AnimatedBackground>
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
            </AnimatedBackground>
        );
    }

    if (error) {
        return (
            <AnimatedBackground>
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </AnimatedBackground>
        );
    }

    return (
        <AnimatedBackground>
            <div style={{ minHeight: '100vh', padding: '4rem 0' }}>
                <div className="container">
                    <div className="text-center mb-5 pt-4">
                        <div className="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-3"><span className="display-4">🚗</span></div>
                        <h2 className="fw-bold display-5 mb-2" style={{ color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>FLEET</h2>
                        <p className="lead" style={{ color: '#fff' }}>Click on a car to see details and request</p>
                        <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-light rounded-pill px-4" onClick={() => window.location.href = '/dashboard'}>← Back to Dashboard</button>
                        </div>
                    </div>
                    
                    {cars.length === 0 ? (
                        <div className="alert alert-info">No cars available.</div>
                    ) : (
                        <>
                            <div className="row mt-4">
                                {currentCars.map(car => (
                                    <div className="col-md-4 mb-4" key={car.id}>
                                        <div 
                                            className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden cursor-pointer"
                                            style={{ cursor: 'pointer', background: 'rgba(255, 255, 255, 0.95)' }}
                                            onMouseEnter={() => setHoveredCar(car)}
                                            onMouseLeave={() => setHoveredCar(null)}
                                            onClick={() => setSelectedCar(car)}
                                        >
                                            {hoveredCar?.id === car.id && (
                                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-95 text-white p-3 d-flex flex-column justify-content-center" style={{ zIndex: 10 }}>
                                                    <div className="text-center">
                                                        <div className="display-6 mb-2">🚗</div>
                                                        <h5>{car.brand} {car.model}</h5>
                                                        <hr />
                                                        <div className="text-start">
                                                            <p className="mb-1"><strong>Reg:</strong> {car.registration_number}</p>
                                                            <p className="mb-1"><strong>Year:</strong> {car.year}</p>
                                                            <p className="mb-1"><strong>Color:</strong> {car.color}</p>
                                                            <p className="mb-1"><strong>Seats:</strong> {car.seats}</p>
                                                            <p className="mb-0"><strong>Status:</strong> {getStatusText(car.status)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <h5 className="card-title fw-bold mb-0">{car.brand} {car.model}</h5>
                                                        <h6 className="card-subtitle text-muted mt-1">{car.registration_number}</h6>
                                                    </div>
                                                    <span className={`badge ${getStatusBadge(car.status)} rounded-pill px-3 py-2`}>{getStatusText(car.status)}</span>
                                                </div>
                                                <div className="mt-3">
                                                    <small className="text-muted">Click for details →</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center gap-2 mt-4">
                                    <button className="btn btn-light rounded-pill px-4" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>← Previous</button>
                                    <span className="btn btn-light rounded-pill px-4">Page {currentPage} of {totalPages}</span>
                                    <button className="btn btn-light rounded-pill px-4" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next →</button>
                                </div>
                            )}

                            {selectedCar && (
                                <div className="mt-5">
                                    <div className="card border-0 rounded-4 shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1.5rem', borderRadius: '16px 16px 0 0' }}>
                                            <h3 className="mb-0 fw-bold">Selected Car Details</h3>
                                        </div>
                                        <div className="card-body p-4">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h4 className="fw-bold mb-3">{selectedCar.brand} {selectedCar.model}</h4>
                                                    <div className="mb-3"><span className={`badge ${getStatusBadge(selectedCar.status)} rounded-pill px-3 py-2 fs-6`}>{getStatusText(selectedCar.status)}</span></div>
                                                    <div className="row mb-3">
                                                        <div className="col-6"><div className="bg-light p-3 rounded-3"><small className="text-muted">Registration</small><br /><strong>{selectedCar.registration_number}</strong></div></div>
                                                        <div className="col-6"><div className="bg-light p-3 rounded-3"><small className="text-muted">Year</small><br /><strong>{selectedCar.year}</strong></div></div>
                                                        <div className="col-6 mt-3"><div className="bg-light p-3 rounded-3"><small className="text-muted">Color</small><br /><strong>{selectedCar.color}</strong></div></div>
                                                        <div className="col-6 mt-3"><div className="bg-light p-3 rounded-3"><small className="text-muted">Seats</small><br /><strong>{selectedCar.seats}</strong></div></div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="bg-gradient-light p-4 rounded-3" style={{ background: '#f8f9fa' }}>
                                                        <h5 className="fw-bold mb-3">📝 Request This Car</h5>
                                                        <p className="text-muted mb-3">Request to book this car for your next trip.</p>
                                                        <button className="btn btn-primary w-100 rounded-pill py-3 fw-bold" disabled={selectedCar.status !== 'available'} onClick={() => { onRequestCar(selectedCar); setSelectedCar(null); }}>
                                                            {selectedCar.status === 'available' ? '🚀 Request This Car Now' : '🔒 Not Available'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AnimatedBackground>
    );
}

// Request Booking Form Component
function RequestBooking({ car, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        car: car.id,
        start_datetime: '',
        end_datetime: '',
        purpose: '',
        destination: '',
        estimated_km: '',
        trip_type: 'business',
        passengers: 1,
        employee_notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const token = localStorage.getItem('access_token');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onSuccess();
            } else {
                const data = await response.json();
                setError(data.message || Object.values(data).flat().join(', '));
            }
        } catch (error) {
            setError('Error submitting request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content rounded-4">
                    <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <h5 className="modal-title fw-bold">Request {car.brand} {car.model}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            {error && <div className="alert alert-danger rounded-3">{error}</div>}
                            <div className="row">
                                <div className="col-md-6 mb-3"><label className="form-label fw-semibold">Start Date & Time *</label><input type="datetime-local" className="form-control rounded-3" value={formData.start_datetime} onChange={(e) => setFormData({...formData, start_datetime: e.target.value})} required /></div>
                                <div className="col-md-6 mb-3"><label className="form-label fw-semibold">End Date & Time *</label><input type="datetime-local" className="form-control rounded-3" value={formData.end_datetime} onChange={(e) => setFormData({...formData, end_datetime: e.target.value})} required /></div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3"><label className="form-label fw-semibold">Destination *</label><input type="text" className="form-control rounded-3" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} placeholder="Where are you going?" required /></div>
                                <div className="col-md-6 mb-3"><label className="form-label fw-semibold">Estimated KM *</label><input type="number" className="form-control rounded-3" value={formData.estimated_km} onChange={(e) => setFormData({...formData, estimated_km: e.target.value})} placeholder="Estimated kilometers" required /></div>
                            </div>
                            <div className="mb-3"><label className="form-label fw-semibold">Purpose *</label><textarea className="form-control rounded-3" rows="3" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} placeholder="What is the purpose of this trip?" required /></div>
                            <div className="row">
                                <div className="col-md-6 mb-3"><label className="form-label fw-semibold">Trip Type</label><select className="form-select rounded-3" value={formData.trip_type} onChange={(e) => setFormData({...formData, trip_type: e.target.value})}><option value="business">Business</option><option value="private">Private</option></select></div>
                                <div className="col-md-6 mb-3"><label className="form-label fw-semibold">Passengers</label><input type="number" className="form-control rounded-3" value={formData.passengers} onChange={(e) => setFormData({...formData, passengers: e.target.value})} min="1" max="15" /></div>
                            </div>
                            <div className="mb-3"><label className="form-label fw-semibold">Additional Notes</label><textarea className="form-control rounded-3" rows="2" value={formData.employee_notes} onChange={(e) => setFormData({...formData, employee_notes: e.target.value})} placeholder="Any additional information..." /></div>
                        </div>
                        <div className="modal-footer border-0 p-4">
                            <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// My Bookings Component with Checkout and Checkin
// My Bookings Component - FIXED for Employees to see Start/End Trip buttons
function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showCheckinModal, setShowCheckinModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [checkoutData, setCheckoutData] = useState({ start_odometer: '', start_fuel_level: '', start_notes: '' });
    const [checkinData, setCheckinData] = useState({ end_odometer: '', end_fuel_level: '', end_notes: '', damages: '' });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/my_bookings/`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (response.ok) {
                const data = await response.json();
                setBookings(Array.isArray(data) ? data : (data.results || []));
            } else if (response.status === 401) {
                window.location.href = '/login';
            }
        } catch (error) { 
            setError('Error fetching bookings'); 
        } finally { 
            setLoading(false); 
        }
    };

    const cancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel/`, { 
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (response.ok) fetchBookings();
            else alert('Error cancelling booking');
        } catch (error) { alert('Error cancelling booking'); }
    };

    const handleCheckout = async () => {
        setActionLoading(true);
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/${selectedBooking.id}/checkout/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start_odometer: parseInt(checkoutData.start_odometer),
                    start_fuel_level: parseInt(checkoutData.start_fuel_level),
                    start_notes: checkoutData.start_notes
                })
            });
            const data = await response.json();
            if (response.ok) {
                alert(`✅ Trip started successfully!\n\nCar is now IN USE.`);
                setShowCheckoutModal(false);
                setCheckoutData({ start_odometer: '', start_fuel_level: '', start_notes: '' });
                fetchBookings();
            } else {
                alert('❌ Error: ' + (data.error || 'Failed to start trip'));
            }
        } catch (error) {
            alert('Error connecting to server');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckin = async () => {
        setActionLoading(true);
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/${selectedBooking.id}/checkin/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    end_odometer: parseInt(checkinData.end_odometer),
                    end_fuel_level: parseInt(checkinData.end_fuel_level),
                    end_notes: checkinData.end_notes,
                    damages: checkinData.damages
                })
            });
            const data = await response.json();
            if (response.ok) {
                let message = `✅ Trip ended successfully!\n\n📊 Trip Summary:\n• Total Kilometers Driven: ${data.total_km} km`;
                if (data.late_return) message += `\n⚠️ Late return! Fee: $${data.late_fee}`;
                alert(message);
                setShowCheckinModal(false);
                setCheckinData({ end_odometer: '', end_fuel_level: '', end_notes: '', damages: '' });
                fetchBookings();
            } else {
                alert('❌ Error: ' + (data.error || 'Failed to end trip'));
            }
        } catch (error) {
            alert('Error connecting to server');
        } finally {
            setActionLoading(false);
        }
    };

    // Check if employee can start trip (checkout)
    const canCheckout = (booking) => {
        return booking.status === 'approved' && new Date() >= new Date(booking.start_datetime);
    };

    // Check if employee can end trip (checkin)
    const canCheckin = (booking) => {
        return booking.status === 'in_progress';
    };

    const getStatusBadge = (status) => {
        const colors = { 'pending': 'warning', 'approved': 'success', 'rejected': 'danger', 'cancelled': 'secondary', 'completed': 'info', 'in_progress': 'primary' };
        return `badge bg-${colors[status] || 'secondary'}`;
    };

    const getStatusText = (status) => {
        const texts = { 'pending': 'Pending', 'approved': 'Approved', 'rejected': 'Rejected', 'cancelled': 'Cancelled', 'completed': 'Completed', 'in_progress': 'In Progress' };
        return texts[status] || status;
    };

    if (loading) return (<AnimatedBackground><div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div></AnimatedBackground>);

    return (
        <AnimatedBackground>
            <div style={{ minHeight: '100vh', padding: '4rem 0' }}>
                <div className="container">
                    <div className="text-center mb-5 pt-4">
                        <div className="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-3"><span className="display-4">📅</span></div>
                        <h2 className="fw-bold display-5 mb-2" style={{ color: '#fff' }}>MY BOOKINGS</h2>
                        <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-light rounded-pill px-4" onClick={() => window.location.href = '/dashboard'}>← Back to Dashboard</button>
                        </div>
                    </div>
                    {bookings.length === 0 ? <div className="alert alert-info">No bookings found.</div> : (
                        <div className="row mt-4">
                            {bookings.map(booking => (
                                <div className="col-md-6 mb-4" key={booking.id}>
                                    <div className="card shadow-sm border-0 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h5 className="card-title fw-bold mb-0">{booking.car_details?.brand} {booking.car_details?.model}</h5>
                                                <span className={`badge ${getStatusBadge(booking.status)} rounded-pill px-3 py-2`}>{getStatusText(booking.status)}</span>
                                            </div>
                                            <h6 className="card-subtitle text-muted mb-3">{booking.car_details?.registration_number}</h6>
                                            <hr />
                                            <div className="row">
                                                <div className="col-12 mb-2"><small className="text-muted">Destination:</small><p className="mb-1">{booking.destination}</p></div>
                                                <div className="col-12 mb-2"><small className="text-muted">Purpose:</small><p className="mb-1">{booking.purpose}</p></div>
                                                <div className="col-12 mb-2"><small className="text-muted">Start:</small><p className="mb-1">{new Date(booking.start_datetime).toLocaleString()}</p></div>
                                                <div className="col-12 mb-2"><small className="text-muted">End:</small><p className="mb-1">{new Date(booking.end_datetime).toLocaleString()}</p></div>
                                                <div className="col-6"><small className="text-muted">Est. KM:</small><p className="mb-1">{booking.estimated_km} km</p></div>
                                                <div className="col-6"><small className="text-muted">Passengers:</small><p className="mb-1">{booking.passengers}</p></div>
                                            </div>
                                            {booking.manager_comments && <div className="alert alert-info mt-3"><strong>Comments:</strong> {booking.manager_comments}</div>}
                                            
                                            {/* ACTION BUTTONS FOR EMPLOYEES */}
                                            <div className="mt-3 d-flex gap-2 flex-wrap">
                                                {booking.status === 'pending' && (
                                                    <button className="btn btn-danger rounded-pill px-4" onClick={() => cancelBooking(booking.id)}>Cancel Booking</button>
                                                )}
                                                {canCheckout(booking) && (
                                                    <button className="btn btn-success rounded-pill px-4" onClick={() => { setSelectedBooking(booking); setShowCheckoutModal(true); }}>
                                                        🚗 Start Trip (Checkout)
                                                    </button>
                                                )}
                                                {canCheckin(booking) && (
                                                    <button className="btn btn-primary rounded-pill px-4" onClick={() => { setSelectedBooking(booking); setShowCheckinModal(true); }}>
                                                        🏁 End Trip (Checkin)
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Checkout Modal */}
            {showCheckoutModal && selectedBooking && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white' }}>
                                <h5 className="modal-title fw-bold">🚗 Start Trip - Checkout</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCheckoutModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <p><strong>Car:</strong> {selectedBooking.car_details?.brand} {selectedBooking.car_details?.model}</p>
                                <p><strong>Registration:</strong> {selectedBooking.car_details?.registration_number}</p>
                                <p><strong>Start Time:</strong> {new Date(selectedBooking.start_datetime).toLocaleString()}</p>
                                <hr />
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Start Odometer (km) *</label>
                                    <input type="number" className="form-control rounded-3" value={checkoutData.start_odometer} onChange={(e) => setCheckoutData({...checkoutData, start_odometer: e.target.value})} placeholder="Current odometer reading" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Start Fuel Level (%) *</label>
                                    <input type="number" className="form-control rounded-3" value={checkoutData.start_fuel_level} onChange={(e) => setCheckoutData({...checkoutData, start_fuel_level: e.target.value})} placeholder="Fuel level (0-100)" min="0" max="100" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Start Notes</label>
                                    <textarea className="form-control rounded-3" rows="3" value={checkoutData.start_notes} onChange={(e) => setCheckoutData({...checkoutData, start_notes: e.target.value})} placeholder="Any notes about car condition before trip..." />
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4">
                                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setShowCheckoutModal(false)}>Cancel</button>
                                <button className="btn btn-success rounded-pill px-4" onClick={handleCheckout} disabled={actionLoading || !checkoutData.start_odometer || !checkoutData.start_fuel_level}>
                                    {actionLoading ? 'Starting...' : 'Start Trip'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Checkin Modal */}
            {showCheckinModal && selectedBooking && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', color: 'white' }}>
                                <h5 className="modal-title fw-bold">🏁 End Trip - Checkin</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCheckinModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <p><strong>Car:</strong> {selectedBooking.car_details?.brand} {selectedBooking.car_details?.model}</p>
                                <p><strong>Registration:</strong> {selectedBooking.car_details?.registration_number}</p>
                                <hr />
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">End Odometer (km) *</label>
                                    <input type="number" className="form-control rounded-3" value={checkinData.end_odometer} onChange={(e) => setCheckinData({...checkinData, end_odometer: e.target.value})} placeholder="Current odometer reading" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">End Fuel Level (%) *</label>
                                    <input type="number" className="form-control rounded-3" value={checkinData.end_fuel_level} onChange={(e) => setCheckinData({...checkinData, end_fuel_level: e.target.value})} placeholder="Fuel level (0-100)" min="0" max="100" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">End Notes</label>
                                    <textarea className="form-control rounded-3" rows="3" value={checkinData.end_notes} onChange={(e) => setCheckinData({...checkinData, end_notes: e.target.value})} placeholder="Any notes about the trip..." />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Damages (if any)</label>
                                    <textarea className="form-control rounded-3" rows="2" value={checkinData.damages} onChange={(e) => setCheckinData({...checkinData, damages: e.target.value})} placeholder="Describe any damages to the car..." />
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4">
                                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setShowCheckinModal(false)}>Cancel</button>
                                <button className="btn btn-primary rounded-pill px-4" onClick={handleCheckin} disabled={actionLoading || !checkinData.end_odometer || !checkinData.end_fuel_level}>
                                    {actionLoading ? 'Ending Trip...' : 'End Trip'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AnimatedBackground>
    );
}


// Manager Dashboard Component
function ManagerDashboard() {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [comments, setComments] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        
        try {
            setLoading(true);
            
            // Fetch pending bookings
            const pendingRes = await fetch(`${API_BASE_URL}/api/bookings/pending/`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            
            if (pendingRes.ok) {
                let data = await pendingRes.json();
                // Handle both array and paginated response
                if (Array.isArray(data)) {
                    setPendingBookings(data);
                } else if (data.results) {
                    setPendingBookings(data.results);
                } else {
                    setPendingBookings([]);
                }
            } else {
                setPendingBookings([]);
            }
            
            // Fetch all bookings
            const allRes = await fetch(`${API_BASE_URL}/api/bookings/`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            
            if (allRes.ok) {
                let data = await allRes.json();
                // Handle both array and paginated response
                if (Array.isArray(data)) {
                    setAllBookings(data);
                } else if (data.results) {
                    setAllBookings(data.results);
                } else {
                    setAllBookings([]);
                }
            } else {
                setAllBookings([]);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setPendingBookings([]);
            setAllBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (booking, action) => { 
        setSelectedBooking(booking); 
        setActionType(action); 
        setComments(''); 
        setShowModal(true); 
    };
    
    const submitAction = async () => {
        const token = localStorage.getItem('access_token');
        const url = `${API_BASE_URL}/api/bookings/${selectedBooking.id}/${actionType}/`;
        try {
            const response = await fetch(url, { 
                method: 'POST', 
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json' 
                }, 
                body: JSON.stringify({ comments }) 
            });
            if (response.ok) { 
                setShowModal(false); 
                fetchBookings(); 
                alert(`Booking ${actionType}d successfully!`); 
            } else {
                const error = await response.json();
                alert('Error: ' + (error.error || 'Could not process request'));
            }
        } catch (error) { 
            alert('Error processing request'); 
        }
    };

    const getStatusBadge = (status) => {
        const colors = { 
            'pending': 'warning', 
            'approved': 'success', 
            'rejected': 'danger', 
            'cancelled': 'secondary', 
            'completed': 'info', 
            'in_progress': 'primary' 
        };
        return `badge bg-${colors[status] || 'secondary'}`;
    };

    const getStatusText = (status) => {
        const texts = { 
            'pending': 'Pending', 
            'approved': 'Approved', 
            'rejected': 'Rejected', 
            'cancelled': 'Cancelled', 
            'completed': 'Completed', 
            'in_progress': 'In Progress' 
        };
        return texts[status] || status;
    };

    const BookingCard = ({ booking, showActions = false }) => (
        <div className="card mb-4 shadow-sm border-0 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 className="card-title fw-bold mb-0">{booking.car_details?.brand} {booking.car_details?.model}</h5>
                        <h6 className="card-subtitle text-muted mt-1">{booking.car_details?.registration_number}</h6>
                    </div>
                    <span className={`badge ${getStatusBadge(booking.status)} rounded-pill px-3 py-2`}>
                        {getStatusText(booking.status)}
                    </span>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-6 mb-2">
                        <small className="text-muted">Requester:</small>
                        <p className="mb-1 fw-semibold">{booking.employee_name}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <small className="text-muted">Destination:</small>
                        <p className="mb-1">{booking.destination}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <small className="text-muted">Start:</small>
                        <p className="mb-1">{new Date(booking.start_datetime).toLocaleString()}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <small className="text-muted">End:</small>
                        <p className="mb-1">{new Date(booking.end_datetime).toLocaleString()}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <small className="text-muted">Est. KM:</small>
                        <p className="mb-1">{booking.estimated_km} km</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <small className="text-muted">Passengers:</small>
                        <p className="mb-1">{booking.passengers}</p>
                    </div>
                </div>
                {booking.manager_comments && (
                    <div className="alert alert-info mt-3">
                        <strong>Comments:</strong> {booking.manager_comments}
                    </div>
                )}
                {showActions && booking.status === 'pending' && (
                    <div className="mt-3 d-flex gap-2">
                        <button className="btn btn-success rounded-pill px-4" onClick={() => handleAction(booking, 'approve')}>
                            ✓ Approve
                        </button>
                        <button className="btn btn-danger rounded-pill px-4" onClick={() => handleAction(booking, 'reject')}>
                            ✗ Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <AnimatedBackground>
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </AnimatedBackground>
        );
    }

    return (
        <AnimatedBackground>
            <div style={{ minHeight: '100vh', padding: '4rem 0' }}>
                <div className="container">
                    <div className="text-center mb-5 pt-4">
                        <div className="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-3">
                            <span className="display-4">👔</span>
                        </div>
                        <h2 className="fw-bold display-5 mb-2" style={{ color: '#fff' }}>MANAGER DASHBOARD</h2>
                        <p className="lead" style={{ color: '#fff' }}>Review and manage car booking requests</p>
                        <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-light rounded-pill px-4" onClick={() => window.location.href = '/dashboard'}>
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>

                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button 
                                className={`nav-link fw-semibold ${activeTab === 'pending' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('pending')}
                            >
                                Pending Requests 
                                {pendingBookings.length > 0 && (
                                    <span className="badge bg-danger ms-2 rounded-pill">{pendingBookings.length}</span>
                                )}
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link fw-semibold ${activeTab === 'all' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('all')}
                            >
                                All Bookings ({allBookings.length})
                            </button>
                        </li>
                    </ul>

                    {activeTab === 'pending' && (
                        pendingBookings.length === 0 ? (
                            <div className="alert alert-success rounded-3">No pending requests! All caught up.</div>
                        ) : (
                            pendingBookings.map(booking => (
                                <BookingCard key={booking.id} booking={booking} showActions={true} />
                            ))
                        )
                    )}

                    {activeTab === 'all' && (
                        allBookings.length === 0 ? (
                            <div className="alert alert-info rounded-3">No bookings found.</div>
                        ) : (
                            allBookings.map(booking => (
                                <BookingCard key={booking.id} booking={booking} showActions={false} />
                            ))
                        )
                    )}

                    {/* Approval/Rejection Modal */}
                    {showModal && (
                        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content rounded-4">
                                    <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                        <h5 className="modal-title fw-bold">
                                            {actionType === 'approve' ? 'Approve Booking' : 'Reject Booking'}
                                        </h5>
                                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body p-4">
                                        <p><strong>Car:</strong> {selectedBooking?.car_details?.brand} {selectedBooking?.car_details?.model}</p>
                                        <p><strong>Requester:</strong> {selectedBooking?.employee_name}</p>
                                        <p><strong>Destination:</strong> {selectedBooking?.destination}</p>
                                        <p><strong>Purpose:</strong> {selectedBooking?.purpose}</p>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Comments (optional):</label>
                                            <textarea 
                                                className="form-control rounded-3" 
                                                rows="3" 
                                                value={comments} 
                                                onChange={(e) => setComments(e.target.value)} 
                                                placeholder={actionType === 'approve' ? "Add any notes..." : "Reason for rejection..."} 
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0 p-4">
                                        <button className="btn btn-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button 
                                            className={`btn rounded-pill px-4 ${actionType === 'approve' ? 'btn-success' : 'btn-danger'}`} 
                                            onClick={submitAction}
                                        >
                                            {actionType === 'approve' ? '✓ Approve' : '✗ Reject'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AnimatedBackground>
    );
}

// Fleet Admin Car Management Component
function FleetAdminCars() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingCarId, setUpdatingCarId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState({});

    useEffect(() => { fetchCars(); }, []);

    const fetchCars = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) { window.location.href = '/login'; return; }
        try {
            const response = await fetch(`${API_BASE_URL}/api/cars/`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) setCars((await response.json()).results || []);
            else if (response.status === 401) { localStorage.clear(); window.location.href = '/login'; }
        } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };

    const updateCarStatus = async (carId, status) => {
        if (!status) return;
        const token = localStorage.getItem('access_token');
        setUpdatingCarId(carId);
        try {
            const response = await fetch(`${API_BASE_URL}/api/cars/${carId}/update-status/`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                setSelectedStatus(prev => ({ ...prev, [carId]: '' }));
                fetchCars();
                alert(`Car status updated to ${status}!`);
            } else alert('Error updating status');
        } catch (error) { alert('Error updating car status'); } finally { setUpdatingCarId(null); }
    };

    const getStatusBadge = (status) => {
        const colors = { 'available': 'success', 'in_use': 'warning', 'maintenance': 'danger', 'reserved': 'info', 'out_of_service': 'secondary' };
        return `badge bg-${colors[status] || 'secondary'}`;
    };

    const getStatusText = (status) => {
        const texts = { 'available': 'Available', 'in_use': 'In Use', 'maintenance': 'Under Maintenance', 'reserved': 'Reserved', 'out_of_service': 'Out of Service' };
        return texts[status] || status;
    };

    if (loading) return (<AnimatedBackground><div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div></AnimatedBackground>);

    return (
        <AnimatedBackground>
            <div style={{ minHeight: '100vh', padding: '4rem 0' }}>
                <div className="container">
                    <div className="text-center mb-5 pt-4">
                        <div className="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-3"><span className="display-4">🚘</span></div>
                        <h2 className="fw-bold display-5 mb-2" style={{ color: '#fff' }}>FLEET MANAGEMENT</h2>
                        <p className="lead" style={{ color: '#fff' }}>Manage car statuses and fleet operations</p>
                        <div className="d-flex justify-content-center mt-3"><button className="btn btn-light rounded-pill px-4" onClick={() => window.location.href = '/dashboard'}>← Back to Dashboard</button></div>
                    </div>
                    <div className="card border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                        <div className="card-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '16px 16px 0 0' }}><h5 className="mb-0 fw-bold">Manage Car Statuses</h5></div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-4">Car</th>
                                            <th>Registration</th>
                                            <th>Current Status</th>
                                            <th>Update Status</th>
                                            <th className="pe-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cars.map(car => (
                                            <tr key={car.id}>
                                                <td className="ps-4"><strong>{car.brand} {car.model}</strong><br /><small className="text-muted">{car.year} | {car.color}</small></td>
                                                <td>{car.registration_number}</td>
                                                <td><span className={`badge ${getStatusBadge(car.status)} rounded-pill px-3 py-2`}>{getStatusText(car.status)}</span></td>
                                                <td>
                                                    <select className="form-select form-select-sm" style={{ width: '160px' }} value={selectedStatus[car.id] || ''} onChange={(e) => setSelectedStatus(prev => ({ ...prev, [car.id]: e.target.value }))}>
                                                        <option value="">Select status...</option>
                                                        <option value="available">✓ Available</option>
                                                        <option value="in_use">🔧 In Use</option>
                                                        <option value="maintenance">⚠️ Maintenance</option>
                                                        <option value="reserved">📅 Reserved</option>
                                                        <option value="out_of_service">❌ Out of Service</option>
                                                    </select>
                                                </td>
                                                <td className="pe-4">
                                                    <button className="btn btn-primary btn-sm rounded-pill px-3" disabled={!selectedStatus[car.id] || updatingCarId === car.id} onClick={() => updateCarStatus(car.id, selectedStatus[car.id])}>
                                                        {updatingCarId === car.id ? <span className="spinner-border spinner-border-sm"></span> : 'Update'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedBackground>
    );
}

// Car Management Component (CRUD)
// Car Management Component (CRUD) - FIXED for DELETE and ADD
function CarManagement() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [formData, setFormData] = useState({
        registration_number: '', brand: '', model: '', year: new Date().getFullYear(), color: '',
        vin_number: '', fuel_type: 'petrol', transmission: 'automatic', seats: 5,
        status: 'available', location: 'Main Parking', daily_rate: 0, notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUserRole(JSON.parse(userData).role);
        fetchCars();
    }, []);

    const fetchCars = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/cars/`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (response.ok) {
                const data = await response.json();
                setCars(data.results || data || []);
            }
        } catch (error) { 
            console.error('Error:', error); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('access_token');
        const url = editingCar ? `${API_BASE_URL}/api/cars/${editingCar.id}/` : `${API_BASE_URL}/api/cars/`;
        const method = editingCar ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, { 
                method, 
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, 
                body: JSON.stringify(formData) 
            });
            if (response.ok) {
                alert(editingCar ? 'Car updated!' : 'Car added!');
                setShowModal(false);
                resetForm();
                fetchCars();
            } else {
                const error = await response.json();
                alert('Error saving car: ' + JSON.stringify(error));
            }
        } catch (error) { 
            alert('Error saving car: ' + error.message); 
        } finally { 
            setSubmitting(false); 
        }
    };

const deleteCar = async (car) => {
    if (!window.confirm(`Delete ${car.brand} ${car.model}? This action cannot be undone.`)) return;
    const token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/cars/${car.id}/`, { 
            method: 'DELETE', 
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } 
        });
        
        if (response.ok) { 
            alert('Car deleted successfully!'); 
            fetchCars(); 
        } else if (response.status === 500) {
            // If delete fails due to foreign key, try to mark as out of service
            const updateResponse = await fetch(`${API_BASE_URL}/api/cars/${car.id}/update-status/`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'out_of_service' })
            });
            
            if (updateResponse.ok) {
                alert('Car has active bookings. Status changed to "Out of Service" instead of deleting.');
                fetchCars();
            } else {
                alert('Cannot delete car with active bookings. Please remove all bookings first.');
            }
        } else {
            const error = await response.text();
            console.error('Delete error:', error);
            alert('Error deleting car. Please check console for details.');
        }
    } catch (error) { 
        console.error('Delete error:', error);
        alert('Error deleting car: ' + error.message); 
    }
};

    const editCar = (car) => { 
        setEditingCar(car); 
        setFormData(car); 
        setShowModal(true); 
    };
    
    const resetForm = () => { 
        setEditingCar(null); 
        setFormData({ 
            registration_number: '', brand: '', model: '', year: new Date().getFullYear(), color: '',
            vin_number: '', fuel_type: 'petrol', transmission: 'automatic', seats: 5,
            status: 'available', location: 'Main Parking', daily_rate: 0, notes: '' 
        }); 
    };

    if (loading) return (<AnimatedBackground><div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div></AnimatedBackground>);
    if (userRole !== 'fleet_admin' && userRole !== 'super_admin') return (<AnimatedBackground><div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="alert alert-danger">Access Denied - Fleet Admin Only</div></div></AnimatedBackground>);

    return (
        <AnimatedBackground>
            <div style={{ minHeight: '100vh', padding: '4rem 0' }}>
                <div className="container">
                    <div className="text-center mb-5 pt-4">
                        <div className="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-3"><span className="display-4">✏️</span></div>
                        <h2 className="fw-bold display-5 mb-2" style={{ color: '#fff' }}>CAR MANAGEMENT</h2>
                        <p className="lead" style={{ color: '#fff' }}>Add, edit, or remove cars from the fleet</p>
                        <div className="d-flex justify-content-center gap-3 mt-3">
                            <button className="btn btn-light rounded-pill px-4" onClick={() => window.location.href = '/dashboard'}>← Back to Dashboard</button>
                            <button className="btn btn-success rounded-pill px-4" onClick={() => { resetForm(); setShowModal(true); }}>+ Add New Car</button>
                        </div>
                    </div>
                    <div className="card border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                        <div className="card-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '16px 16px 0 0' }}>
                            <h5 className="mb-0 fw-bold">Fleet Vehicles ({cars.length})</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr><th className="ps-4">Car</th><th>Registration</th><th>Year</th><th>Status</th><th className="pe-4">Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {cars.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-4">No cars found. Click "Add New Car" to create one.</td></tr>
                                        ) : (
                                            cars.map(car => (
                                                <tr key={car.id}>
                                                    <td className="ps-4"><strong>{car.brand} {car.model}</strong><br /><small className="text-muted">{car.fuel_type} | {car.seats} seats</small></td>
                                                    <td>{car.registration_number}</td>
                                                    <td>{car.year}</td>
                                                    <td><span className="badge bg-secondary">{car.status}</span></td>
                                                    <td className="pe-4">
                                                        <button className="btn btn-sm btn-warning rounded-pill px-3 me-2" onClick={() => editCar(car)}>✏️ Edit</button>
                                                        <button className="btn btn-sm btn-danger rounded-pill px-3" onClick={() => deleteCar(car)}>🗑️ Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                <h5 className="modal-title fw-bold">{editingCar ? '✏️ Edit Car' : '➕ Add New Car'}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowModal(false); resetForm(); }}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    <div className="row">
                                        <div className="col-md-6 mb-3"><label className="form-label fw-semibold">Registration Number *</label><input type="text" className="form-control rounded-3" value={formData.registration_number} onChange={(e) => setFormData({...formData, registration_number: e.target.value})} required /></div>
                                        <div className="col-md-6 mb-3"><label className="form-label fw-semibold">VIN Number</label><input type="text" className="form-control rounded-3" value={formData.vin_number} onChange={(e) => setFormData({...formData, vin_number: e.target.value})} /></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3"><label className="form-label fw-semibold">Brand *</label><input type="text" className="form-control rounded-3" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required /></div>
                                        <div className="col-md-4 mb-3"><label className="form-label fw-semibold">Model *</label><input type="text" className="form-control rounded-3" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required /></div>
                                        <div className="col-md-4 mb-3"><label className="form-label fw-semibold">Year</label><input type="number" className="form-control rounded-3" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} /></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3"><label className="form-label fw-semibold">Color</label><input type="text" className="form-control rounded-3" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} /></div>
                                        <div className="col-md-4 mb-3"><label className="form-label fw-semibold">Fuel Type</label><select className="form-select rounded-3" value={formData.fuel_type} onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option></select></div>
                                        <div className="col-md-4 mb-3"><label className="form-label fw-semibold">Transmission</label><select className="form-select rounded-3" value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})}><option value="manual">Manual</option><option value="automatic">Automatic</option></select></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3"><label className="form-label fw-semibold">Seats</label><input type="number" className="form-control rounded-3" value={formData.seats} onChange={(e) => setFormData({...formData, seats: e.target.value})} min="1" max="15" /></div>
                                        <div className="col-md-4 mb-3"><label className="form-label fw-semibold">Status</label><select className="form-select rounded-3" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}><option value="available">Available</option><option value="in_use">In Use</option><option value="maintenance">Under Maintenance</option><option value="reserved">Reserved</option><option value="out_of_service">Out of Service</option></select></div>
                                        <div className="col-md-4 mb-3"><label className="form-label fw-semibold">Location</label><input type="text" className="form-control rounded-3" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} /></div>
                                    </div>
                                    <div className="mb-3"><label className="form-label fw-semibold">Daily Rate ($)</label><input type="number" step="0.01" className="form-control rounded-3" value={formData.daily_rate} onChange={(e) => setFormData({...formData, daily_rate: e.target.value})} /></div>
                                    <div className="mb-3"><label className="form-label fw-semibold">Notes</label><textarea className="form-control rounded-3" rows="2" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Additional information..." /></div>
                                </div>
                                <div className="modal-footer border-0 p-4">
                                    <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={submitting}>{submitting ? 'Saving...' : (editingCar ? 'Update Car' : 'Add Car')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AnimatedBackground>
    );
}

// Maintenance Tracking Component
// Maintenance Tracking Component - WITH COMPLETED HISTORY FIXED
function MaintenanceTracking() {
    const [upcomingRecords, setUpcomingRecords] = useState([]);
    const [completedRecords, setCompletedRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [userRole, setUserRole] = useState(null);
    const [completingId, setCompletingId] = useState(null);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [completeData, setCompleteData] = useState({ actual_cost: '', technician_notes: '' });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUserRole(JSON.parse(userData).role);
        fetchMaintenance();
    }, []);

    const fetchMaintenance = async () => {
        const token = localStorage.getItem('access_token');
        try {
            // Fetch ALL maintenance records
            const allRes = await fetch(`${API_BASE_URL}/api/maintenance/maintenance/`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            
            if (allRes.ok) {
                let data = await allRes.json();
                const allRecords = Array.isArray(data) ? data : (data.results || []);
                
                // Split into upcoming and completed
                const upcoming = allRecords.filter(r => r.status !== 'completed');
                const completed = allRecords.filter(r => r.status === 'completed');
                
                setUpcomingRecords(upcoming);
                setCompletedRecords(completed);
            }
        } catch (error) { 
            console.error('Error fetching maintenance:', error);
        } finally { 
            setLoading(false); 
        }
    };

    const completeMaintenance = async () => {
        const token = localStorage.getItem('access_token');
        setCompletingId(selectedRecord.id);
        try {
            const response = await fetch(`${API_BASE_URL}/api/maintenance/maintenance/${selectedRecord.id}/complete/`, {
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    actual_cost: parseFloat(completeData.actual_cost) || selectedRecord.estimated_cost, 
                    technician_notes: completeData.technician_notes 
                })
            });
            if (response.ok) {
                alert('✅ Maintenance completed!');
                setShowCompleteModal(false);
                setCompleteData({ actual_cost: '', technician_notes: '' });
                fetchMaintenance(); // Refresh the list
            } else {
                const error = await response.json();
                alert('❌ Error: ' + (error.error || 'Failed to complete'));
            }
        } catch (error) { 
            alert('Error connecting to server'); 
        } finally { 
            setCompletingId(null); 
        }
    };

    const getPriorityBadge = (priority) => {
        const colors = { 'low': 'secondary', 'medium': 'info', 'high': 'warning', 'urgent': 'danger' };
        return `badge bg-${colors[priority] || 'secondary'}`;
    };
    
    const getPriorityText = (priority) => {
        const texts = { 'low': 'Low', 'medium': 'Medium', 'high': 'High', 'urgent': 'Urgent' };
        return texts[priority] || priority;
    };

    if (loading) return (<AnimatedBackground><div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div></AnimatedBackground>);

    return (
        <AnimatedBackground>
            <div style={{ minHeight: '100vh', padding: '4rem 0' }}>
                <div className="container">
                    <div className="text-center mb-5 pt-4">
                        <div className="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-3"><span className="display-4">🔧</span></div>
                        <h2 className="fw-bold display-5 mb-2" style={{ color: '#fff' }}>MAINTENANCE TRACKING</h2>
                        <p className="lead" style={{ color: '#fff' }}>Track and manage vehicle maintenance</p>
                        <div className="d-flex justify-content-center gap-3 mt-3">
                            <button className="btn btn-light rounded-pill px-4" onClick={() => window.location.href = '/dashboard'}>← Back to Dashboard</button>
                            <button className="btn btn-primary rounded-pill px-4" onClick={() => window.location.href = '/schedule-maintenance'}>+ Schedule Maintenance</button>
                        </div>
                    </div>
                    
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button className={`nav-link fw-semibold ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
                                Upcoming Maintenance ({upcomingRecords.length})
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link fw-semibold ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                                Maintenance History ({completedRecords.length})
                            </button>
                        </li>
                    </ul>

                    {/* Upcoming Tab */}
                    {activeTab === 'upcoming' && (
                        <>
                            {upcomingRecords.length === 0 ? (
                                <div className="alert alert-success rounded-3">No upcoming maintenance scheduled! All vehicles are in good condition.</div>
                            ) : (
                                <div className="row mt-4">
                                    {upcomingRecords.map(record => (
                                        <div className="col-md-6 mb-4" key={record.id}>
                                            <div className="card shadow-sm border-0 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h5 className="card-title fw-bold mb-0">{record.car_details?.brand || record.car?.brand} {record.car_details?.model || record.car?.model}</h5>
                                                            <h6 className="card-subtitle text-muted mt-1">{record.car_details?.registration_number || record.car?.registration_number}</h6>
                                                        </div>
                                                        <span className={`badge ${getPriorityBadge(record.priority)} rounded-pill px-3 py-2`}>{getPriorityText(record.priority)}</span>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-12 mb-2"><small className="text-muted">Type:</small><p className="mb-1 fw-semibold">{record.maintenance_type}</p></div>
                                                        <div className="col-12 mb-2"><small className="text-muted">Scheduled:</small><p className="mb-1">{new Date(record.scheduled_date).toLocaleDateString()}</p></div>
                                                        <div className="col-12 mb-2"><small className="text-muted">Est. Cost:</small><p className="mb-1">${record.estimated_cost}</p></div>
                                                        <div className="col-12"><small className="text-muted">Description:</small><p className="mb-1">{record.description}</p></div>
                                                    </div>
                                                    {(userRole === 'fleet_admin' || userRole === 'super_admin') && (
                                                        <div className="mt-3">
                                                            <button className="btn btn-success w-100 rounded-pill" onClick={() => { setSelectedRecord(record); setCompleteData({ actual_cost: record.estimated_cost, technician_notes: '' }); setShowCompleteModal(true); }}>
                                                                ✓ Mark Complete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* HISTORY TAB - NOW SHOWS COMPLETED MAINTENANCE */}
                    {activeTab === 'history' && (
                        <>
                            {completedRecords.length === 0 ? (
                                <div className="alert alert-info rounded-3">No completed maintenance records yet.</div>
                            ) : (
                                <div className="row mt-4">
                                    {completedRecords.map(record => (
                                        <div className="col-md-6 mb-4" key={record.id}>
                                            <div className="card shadow-sm border-0 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h5 className="card-title fw-bold mb-0">{record.car_details?.brand || record.car?.brand} {record.car_details?.model || record.car?.model}</h5>
                                                            <h6 className="card-subtitle text-muted mt-1">{record.car_details?.registration_number || record.car?.registration_number}</h6>
                                                        </div>
                                                        <span className="badge bg-success rounded-pill px-3 py-2">Completed</span>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-12 mb-2"><small className="text-muted">Type:</small><p className="mb-1 fw-semibold">{record.maintenance_type}</p></div>
                                                        <div className="col-12 mb-2"><small className="text-muted">Completed Date:</small><p className="mb-1">{record.completed_date ? new Date(record.completed_date).toLocaleDateString() : 'N/A'}</p></div>
                                                        <div className="col-12 mb-2"><small className="text-muted">Actual Cost:</small><p className="mb-1">${record.actual_cost || record.estimated_cost}</p></div>
                                                        {record.technician_notes && (
                                                            <div className="col-12"><small className="text-muted">Notes:</small><p className="mb-1">{record.technician_notes}</p></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Complete Maintenance Modal */}
            {showCompleteModal && selectedRecord && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white' }}>
                                <h5 className="modal-title fw-bold">Complete Maintenance</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCompleteModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <p><strong>Car:</strong> {selectedRecord.car_details?.brand || selectedRecord.car?.brand} {selectedRecord.car_details?.model || selectedRecord.car?.model}</p>
                                <p><strong>Maintenance:</strong> {selectedRecord.maintenance_type}</p>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Actual Cost ($)</label>
                                    <input type="number" className="form-control rounded-3" value={completeData.actual_cost} onChange={(e) => setCompleteData({...completeData, actual_cost: e.target.value})} placeholder="Actual cost" step="0.01" />
                                    <small className="text-muted">Estimated: ${selectedRecord.estimated_cost}</small>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Technician Notes</label>
                                    <textarea className="form-control rounded-3" rows="3" value={completeData.technician_notes} onChange={(e) => setCompleteData({...completeData, technician_notes: e.target.value})} placeholder="Service notes..." />
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4">
                                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setShowCompleteModal(false)}>Cancel</button>
                                <button className="btn btn-success rounded-pill px-4" onClick={completeMaintenance} disabled={completingId === selectedRecord.id}>
                                    {completingId === selectedRecord.id ? 'Completing...' : 'Complete Maintenance'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AnimatedBackground>
    );
}

// Schedule Maintenance Component
// Schedule Maintenance Component - FIXED
function ScheduleMaintenance() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        car: '', maintenance_type: 'general_service', priority: 'medium',
        scheduled_date: '', estimated_cost: '', description: '',
        service_provider: '', next_service_km: '', odometer_at_service: ''
    });

    useEffect(() => { fetchCars(); }, []);

    const fetchCars = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/cars/`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (response.ok) {
                const data = await response.json();
                // Handle both array and object response
                const carsData = Array.isArray(data) ? data : (data.results || []);
                setCars(carsData);
            }
        } catch (error) { 
            console.error('Error:', error); 
        } finally { 
            setLoading(false); 
        }
    };

   const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('access_token');
    
    // Prepare data
    const submitData = {
        car: parseInt(formData.car),
        maintenance_type: formData.maintenance_type,
        priority: formData.priority,
        scheduled_date: formData.scheduled_date,
        estimated_cost: parseFloat(formData.estimated_cost) || 0,
        description: formData.description,
        service_provider: formData.service_provider || '',
        odometer_at_service: parseInt(formData.odometer_at_service) || 0,
        status: 'scheduled'
    };
    
    console.log('Submitting maintenance data:', submitData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/maintenance/maintenance/`, {
            method: 'POST', 
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(submitData)
        });
        
        if (response.ok) { 
            const data = await response.json();
            alert('✅ Maintenance scheduled successfully!'); 
            setShowScheduleModal(false); 
            resetForm(); 
        } else {
            const error = await response.text();
            console.error('Schedule error:', error);
            try {
                const errorJson = JSON.parse(error);
                alert('❌ Error scheduling maintenance: ' + JSON.stringify(errorJson));
            } catch {
                alert('❌ Error scheduling maintenance. Please check all fields are correct.');
            }
        }
    } catch (error) { 
        console.error('Connection error:', error);
        alert('Error connecting to server: ' + error.message); 
    } finally { 
        setSubmitting(false); 
    }
};

    const resetForm = () => {
        setFormData({ 
            car: '', maintenance_type: 'general_service', priority: 'medium', 
            scheduled_date: '', estimated_cost: '', description: '', 
            service_provider: '', next_service_km: '', odometer_at_service: '' 
        });
    };

    if (loading) return (<AnimatedBackground><div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div></AnimatedBackground>);

    return (
        <AnimatedBackground>
            <div style={{ minHeight: '100vh', padding: '4rem 0' }}>
                <div className="container">
                    <div className="text-center mb-5 pt-4">
                        <div className="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-3"><span className="display-4">📋</span></div>
                        <h2 className="fw-bold display-5 mb-2" style={{ color: '#fff' }}>SCHEDULE MAINTENANCE</h2>
                        <p className="lead" style={{ color: '#fff' }}>Schedule maintenance tasks for your fleet</p>
                        <div className="d-flex justify-content-center gap-3 mt-3">
                            <button className="btn btn-light rounded-pill px-4" onClick={() => window.location.href = '/dashboard'}>← Back to Dashboard</button>
                            <button className="btn btn-primary rounded-pill px-4" onClick={() => setShowScheduleModal(true)}>+ Schedule New Maintenance</button>
                        </div>
                    </div>
                    <div className="card border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                        <div className="card-header" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white', borderRadius: '16px 16px 0 0' }}>
                            <h5 className="mb-0 fw-bold">📅 Available Cars</h5>
                        </div>
                        <div className="card-body p-4">
                            {cars.length === 0 ? (
                                <div className="alert alert-warning">No cars available. Please add cars first.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr><th>Car</th><th>Registration</th><th>Status</th><th>Action</th></tr>
                                        </thead>
                                        <tbody>
                                            {cars.map(car => (
                                                <tr key={car.id}>
                                                    <td><strong>{car.brand} {car.model}</strong></td>
                                                    <td>{car.registration_number}</td>
                                                    <td><span className="badge bg-secondary">{car.status}</span></td>
                                                    <td>
                                                        <button className="btn btn-sm btn-primary rounded-pill" onClick={() => { setFormData({...formData, car: car.id}); setShowScheduleModal(true); }}>
                                                            Schedule
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Maintenance Modal */}
            {showScheduleModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white' }}>
                                <h5 className="modal-title fw-bold">📅 Schedule Maintenance</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowScheduleModal(false)}></button>
                            </div>
                            <form onSubmit={handleScheduleSubmit}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Select Car *</label>
                                        <select className="form-select rounded-3" value={formData.car} onChange={(e) => setFormData({...formData, car: e.target.value})} required>
                                            <option value="">Choose a car...</option>
                                            {cars.map(car => (
                                                <option key={car.id} value={car.id}>{car.brand} {car.model} ({car.registration_number})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Maintenance Type *</label>
                                            <select className="form-select rounded-3" value={formData.maintenance_type} onChange={(e) => setFormData({...formData, maintenance_type: e.target.value})} required>
                                                <option value="oil_change">Oil Change</option>
                                                <option value="tire_rotation">Tire Rotation</option>
                                                <option value="brake_service">Brake Service</option>
                                                <option value="general_service">General Service</option>
                                                <option value="repair">Repair</option>
                                                <option value="inspection">Inspection</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Priority</label>
                                            <select className="form-select rounded-3" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Scheduled Date *</label>
                                            <input type="date" className="form-control rounded-3" value={formData.scheduled_date} onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Estimated Cost ($)</label>
                                            <input type="number" step="0.01" className="form-control rounded-3" value={formData.estimated_cost} onChange={(e) => setFormData({...formData, estimated_cost: e.target.value})} required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Service Provider</label>
                                            <input type="text" className="form-control rounded-3" value={formData.service_provider} onChange={(e) => setFormData({...formData, service_provider: e.target.value})} placeholder="Service center name" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Odometer at Service (km)</label>
                                            <input type="number" className="form-control rounded-3" value={formData.odometer_at_service} onChange={(e) => setFormData({...formData, odometer_at_service: e.target.value})} placeholder="Current odometer" />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Description</label>
                                        <textarea className="form-control rounded-3" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the maintenance..." required />
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4">
                                    <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success rounded-pill px-4" disabled={submitting}>
                                        {submitting ? 'Scheduling...' : 'Schedule Maintenance'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AnimatedBackground>
    );
}
// User Management Component (Admin only)
function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetPassword, setResetPassword] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserRole(user.role);
            setCurrentUserId(user.id);
        }
        fetchUsers();
        fetchStats();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('access_token');
        try {
            let url = `${API_BASE_URL}/api/users/`;
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (roleFilter) params.append('role', roleFilter);
            if (url) params.append('search', searchTerm);
            if (params.toString()) url += `?${params.toString()}`;
            
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data.results || data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/user_stats/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setStats(await response.json());
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const updateUserRole = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${selectedUser.id}/update_role/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole })
            });
            if (response.ok) {
                alert(`User role updated to ${newRole}`);
                setShowRoleModal(false);
                fetchUsers();
                fetchStats();
            } else {
                const error = await response.json();
                alert(error.error || 'Error updating role');
            }
        } catch (error) {
            alert('Error updating role');
        }
    };

    const toggleUserStatus = async (user) => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/toggle_active/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                alert(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`);
                fetchUsers();
                fetchStats();
            } else {
                const error = await response.json();
                alert(error.error || 'Error toggling status');
            }
        } catch (error) {
            alert('Error toggling status');
        }
    };

    const deleteUser = async (user) => {
        if (!window.confirm(`Are you sure you want to delete ${user.username}? This action cannot be undone.`)) return;
        
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/delete_user/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert('User deleted successfully');
                fetchUsers();
                fetchStats();
            } else {
                const error = await response.json();
                alert(error.error || 'Error deleting user');
            }
        } catch (error) {
            alert('Error deleting user');
        }
    };

    const resetUserPassword = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${selectedUser.id}/reset_password/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_password: resetPassword })
            });
            if (response.ok) {
                alert(`Password reset to: ${resetPassword}`);
                setShowResetModal(false);
                setResetPassword('');
            } else {
                const error = await response.json();
                alert(error.error || 'Error resetting password');
            }
        } catch (error) {
            alert('Error resetting password');
        }
    };

    const getRoleBadge = (role) => {
        const colors = {
            'super_admin': 'dark',
            'fleet_admin': 'danger',
            'manager': 'warning',
            'employee': 'info'
        };
        return `badge bg-${colors[role] || 'secondary'}`;
    };

    const filteredUsers = users.filter(user => {
        if (roleFilter && user.role !== roleFilter) return false;
        if (statusFilter === 'active' && !user.is_active) return false;
        if (statusFilter === 'inactive' && user.is_active) return false;
        return true;
    });

    if (loading) {
        return (
            <AnimatedBackground>
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </AnimatedBackground>
        );
    }

    // Check permission
    if (userRole !== 'super_admin' && userRole !== 'fleet_admin') {
        return (
            <AnimatedBackground>
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="alert alert-danger">Access Denied. Admin access required.</div>
                </div>
            </AnimatedBackground>
        );
    }

    return (
        <AnimatedBackground>
            <div style={{ minHeight: '100vh', padding: '4rem 0' }}>
                <div className="container">
                    <div className="text-center mb-5 pt-4">
                        <div className="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-3">
                            <span className="display-4">👥</span>
                        </div>
                        <h2 className="fw-bold display-5 mb-2" style={{ color: '#fff' }}>USER MANAGEMENT</h2>
                        <p className="lead" style={{ color: '#fff' }}>Manage system users, roles, and permissions</p>
                        <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-light rounded-pill px-4" onClick={() => window.location.href = '/dashboard'}>
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    {stats && (
                        <div className="row mb-4">
                            <div className="col-md-3 mb-3">
                                <div className="card text-center border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                    <div className="card-body">
                                        <h3 className="display-4 fw-bold text-primary">{stats.total_users}</h3>
                                        <p className="text-muted mb-0">Total Users</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card text-center border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                    <div className="card-body">
                                        <h3 className="display-4 fw-bold text-success">{stats.active_users}</h3>
                                        <p className="text-muted mb-0">Active Users</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card text-center border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                    <div className="card-body">
                                        <h3 className="display-4 fw-bold text-warning">{stats.by_role?.manager || 0}</h3>
                                        <p className="text-muted mb-0">Managers</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card text-center border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                    <div className="card-body">
                                        <h3 className="display-4 fw-bold text-danger">{stats.by_role?.fleet_admin || 0}</h3>
                                        <p className="text-muted mb-0">Fleet Admins</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="card border-0 rounded-4 shadow-sm mb-4" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-md-5">
                                    <input 
                                        type="text" 
                                        className="form-control rounded-3" 
                                        placeholder="Search by username, email, or employee ID..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); fetchUsers(); }}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <select className="form-select rounded-3" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                                        <option value="">All Roles</option>
                                        <option value="super_admin">Super Admin</option>
                                        <option value="fleet_admin">Fleet Admin</option>
                                        <option value="manager">Manager</option>
                                        <option value="employee">Employee</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select className="form-select rounded-3" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="col-md-1">
                                    <button className="btn btn-secondary w-100 rounded-3" onClick={() => { setSearchTerm(''); setRoleFilter(''); setStatusFilter(''); fetchUsers(); }}>
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="card border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                        <div className="card-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '16px 16px 0 0' }}>
                            <h5 className="mb-0 fw-bold">System Users</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-4">User</th>
                                            <th>Email</th>
                                            <th>Employee ID</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th className="pe-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length === 0 ? (
                                            <tr><td colSpan="7" className="text-center py-4">No users found</td></tr>
                                        ) : (
                                            filteredUsers.map(user => (
                                                <tr key={user.id}>
                                                    <td className="ps-4">
                                                        <strong>{user.first_name} {user.last_name}</strong>
                                                        <br />
                                                        <small className="text-muted">@{user.username}</small>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>{user.employee_id || 'N/A'}</td>
                                                    <td><span className={getRoleBadge(user.role)}>{user.role}</span></td>
                                                    <td>
                                                        {user.is_active ? (
                                                            <span className="badge bg-success">Active</span>
                                                        ) : (
                                                            <span className="badge bg-secondary">Inactive</span>
                                                        )}
                                                    </td>
                                                    <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                                                    <td className="pe-4">
                                                        <div className="btn-group" role="group">
                                                            <button 
                                                                className="btn btn-sm btn-warning rounded-pill px-3 me-2"
                                                                onClick={() => { setSelectedUser(user); setNewRole(user.role); setShowRoleModal(true); }}
                                                                title="Change Role"
                                                            >
                                                                👔 Role
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-info rounded-pill px-3 me-2 text-white"
                                                                onClick={() => { setSelectedUser(user); setResetPassword('TempPass123!'); setShowResetModal(true); }}
                                                                title="Reset Password"
                                                            >
                                                                🔑 Reset
                                                            </button>
                                                            <button 
                                                                className={`btn btn-sm rounded-pill px-3 me-2 ${user.is_active ? 'btn-secondary' : 'btn-success'}`}
                                                                onClick={() => toggleUserStatus(user)}
                                                                title={user.is_active ? 'Deactivate' : 'Activate'}
                                                            >
                                                                {user.is_active ? '🔴 Deactivate' : '🟢 Activate'}
                                                            </button>
                                                            {userRole === 'super_admin' && user.id !== currentUserId && (
                                                                <button 
                                                                    className="btn btn-sm btn-danger rounded-pill px-3"
                                                                    onClick={() => deleteUser(user)}
                                                                    title="Delete User"
                                                                >
                                                                    🗑️ Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Role Modal */}
            {showRoleModal && selectedUser && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                <h5 className="modal-title fw-bold">Change User Role</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowRoleModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <p><strong>User:</strong> {selectedUser.first_name} {selectedUser.last_name} (@{selectedUser.username})</p>
                                <p><strong>Current Role:</strong> <span className={getRoleBadge(selectedUser.role)}>{selectedUser.role}</span></p>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">New Role</label>
                                    <select className="form-select rounded-3" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                                        <option value="employee">Employee</option>
                                        <option value="manager">Manager</option>
                                        {userRole === 'super_admin' && <option value="fleet_admin">Fleet Admin</option>}
                                        {userRole === 'super_admin' && <option value="super_admin">Super Admin</option>}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4">
                                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setShowRoleModal(false)}>Cancel</button>
                                <button className="btn btn-primary rounded-pill px-4" onClick={updateUserRole}>Update Role</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetModal && selectedUser && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                <h5 className="modal-title fw-bold">Reset User Password</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowResetModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <p><strong>User:</strong> {selectedUser.first_name} {selectedUser.last_name} (@{selectedUser.username})</p>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">New Password</label>
                                    <input type="text" className="form-control rounded-3" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} />
                                    <small className="text-muted">Default: TempPass123!</small>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4">
                                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setShowResetModal(false)}>Cancel</button>
                                <button className="btn btn-warning rounded-pill px-4" onClick={resetUserPassword}>Reset Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AnimatedBackground>
    );
}
// Reports Dashboard Component
function ReportsDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [bookingData, setBookingData] = useState(null);
    const [tripData, setTripData] = useState(null);
    const [maintenanceData, setMaintenanceData] = useState(null);
    const [costData, setCostData] = useState(null);
    const [departmentData, setDepartmentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month');
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role);
        fetchAllData();
    }, [period]);

    const fetchAllData = async () => {
        const token = localStorage.getItem('access_token');
        setLoading(true);
        
        try {
            const [statsRes, bookingsRes, tripsRes, maintenanceRes, costsRes, deptRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/reports/dashboard-stats/`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/api/reports/bookings/?period=${period}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/api/reports/trips/?period=${period}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/api/reports/maintenance/?period=${period}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/api/reports/costs/?period=${period}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/api/reports/departments/`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            
            if (statsRes.ok) setStats(await statsRes.json());
            if (bookingsRes.ok) setBookingData(await bookingsRes.json());
            if (tripsRes.ok) setTripData(await tripsRes.json());
            if (maintenanceRes.ok) setMaintenanceData(await maintenanceRes.json());
            if (costsRes.ok) setCostData(await costsRes.json());
            if (deptRes.ok) setDepartmentData(await deptRes.json());
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="col-md-3 mb-3">
            <div className="card border-0 rounded-4 shadow-sm h-100" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="text-muted mb-2">{title}</h6>
                            <h2 className="fw-bold mb-0">{value?.toLocaleString() || 0}</h2>
                        </div>
                        <div className={`display-4 opacity-50 text-${color}`}>{icon}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <AnimatedBackground>
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </AnimatedBackground>
        );
    }

    return (
        <AnimatedBackground>
            <div style={{ minHeight: '100vh', padding: '4rem 0' }}>
                <div className="container">
                    <div className="text-center mb-5 pt-4">
                        <div className="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-3">
                            <span className="display-4">📊</span>
                        </div>
                        <h2 className="fw-bold display-5 mb-2" style={{ color: '#fff' }}>REPORTS DASHBOARD</h2>
                        <p className="lead" style={{ color: '#fff' }}>Analytics and insights for your fleet</p>
                        <div className="d-flex justify-content-center gap-3 mt-3">
                            <button className="btn btn-light rounded-pill px-4" onClick={() => window.location.href = '/dashboard'}>
                                ← Back to Dashboard
                            </button>
                            <select className="form-select w-auto rounded-pill" value={period} onChange={(e) => setPeriod(e.target.value)}>
                                <option value="week">Last 7 Days</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button className={`nav-link fw-semibold ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                                📈 Overview
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link fw-semibold ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                                📅 Bookings
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link fw-semibold ${activeTab === 'trips' ? 'active' : ''}`} onClick={() => setActiveTab('trips')}>
                                🚗 Trips
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link fw-semibold ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>
                                🔧 Maintenance
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link fw-semibold ${activeTab === 'costs' ? 'active' : ''}`} onClick={() => setActiveTab('costs')}>
                                💰 Costs
                            </button>
                        </li>
                    </ul>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && stats && (
                        <>
                            <div className="row mb-4">
                                <StatCard title="Total Cars" value={stats.total_cars} icon="🚗" color="primary" />
                                <StatCard title="Total Users" value={stats.total_users} icon="👥" color="success" />
                                <StatCard title="Total Bookings" value={stats.total_bookings} icon="📅" color="info" />
                                <StatCard title="Active Trips" value={stats.active_trips} icon="🔄" color="warning" />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="card border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                                            <h5 className="fw-bold mb-0">Booking Status</h5>
                                        </div>
                                        <div className="card-body p-4">
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <span>Pending</span>
                                                    <span className="fw-bold">{stats.pending_bookings}</span>
                                                </div>
                                                <div className="progress mt-1" style={{ height: '10px' }}>
                                                    <div className="progress-bar bg-warning" style={{ width: `${(stats.pending_bookings / stats.total_bookings) * 100}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <span>Approved</span>
                                                    <span className="fw-bold">{stats.approved_bookings}</span>
                                                </div>
                                                <div className="progress mt-1" style={{ height: '10px' }}>
                                                    <div className="progress-bar bg-success" style={{ width: `${(stats.approved_bookings / stats.total_bookings) * 100}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <span>Completed</span>
                                                    <span className="fw-bold">{stats.completed_bookings}</span>
                                                </div>
                                                <div className="progress mt-1" style={{ height: '10px' }}>
                                                    <div className="progress-bar bg-info" style={{ width: `${(stats.completed_bookings / stats.total_bookings) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="card border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                                            <h5 className="fw-bold mb-0">Cars by Status</h5>
                                        </div>
                                        <div className="card-body p-4">
                                            {stats.cars_by_status?.map((item, idx) => (
                                                <div key={idx} className="mb-3">
                                                    <div className="d-flex justify-content-between">
                                                        <span>{item.status}</span>
                                                        <span className="fw-bold">{item.count}</span>
                                                    </div>
                                                    <div className="progress mt-1" style={{ height: '10px' }}>
                                                        <div className="progress-bar bg-primary" style={{ width: `${(item.count / stats.total_cars) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Bookings Tab */}
                    {activeTab === 'bookings' && bookingData && (
                        <>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="card border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                                            <h5 className="fw-bold mb-0">Top Used Cars</h5>
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead className="table-light">
                                                        <tr><th>Car</th><th>Bookings</th><th>Est. KM</th></tr>
                                                    </thead>
                                                    <tbody>
                                                        {bookingData.by_car?.map((car, idx) => (
                                                            <tr key={idx}>
                                                                <td><strong>{car.car__brand} {car.car__model}</strong><br /><small>{car.car__registration_number}</small></td>
                                                                <td>{car.total_bookings}</td>
                                                                <td>{car.total_km?.toLocaleString()} km</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="card border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                                            <h5 className="fw-bold mb-0">Top Employees</h5>
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead className="table-light">
                                                        <tr><th>Employee</th><th>Bookings</th><th>Est. KM</th></tr>
                                                    </thead>
                                                    <tbody>
                                                        {bookingData.by_employee?.map((emp, idx) => (
                                                            <tr key={idx}>
                                                                <td><strong>{emp.employee__first_name} {emp.employee__last_name}</strong><br /><small>@{emp.employee__username}</small></td>
                                                                <td>{emp.total_bookings}</td>
                                                                <td>{emp.total_km?.toLocaleString()} km</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Trips Tab */}
                    {activeTab === 'trips' && tripData && (
                        <>
                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <div className="card text-center border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-body p-4">
                                            <h3 className="fw-bold text-primary">{tripData.statistics?.total_trips || 0}</h3>
                                            <p className="text-muted mb-0">Total Trips</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-center border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-body p-4">
                                            <h3 className="fw-bold text-success">{tripData.statistics?.total_km?.toLocaleString() || 0} km</h3>
                                            <p className="text-muted mb-0">Total Kilometers</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-center border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-body p-4">
                                            <h3 className="fw-bold text-danger">R{tripData.statistics?.total_late_fees?.toFixed(2) || 0}</h3>
                                            <p className="text-muted mb-0">Late Fees Collected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                <div className="card-header bg-transparent border-0 pt-4 px-4">
                                    <h5 className="fw-bold mb-0">Recent Trips</h5>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr><th>Car</th><th>Driver</th><th>Start Time</th><th>End Time</th><th>Total KM</th><th>Status</th></tr>
                                            </thead>
                                            <tbody>
                                                {tripData.recent_trips?.map((trip, idx) => (
                                                    <tr key={idx}>
                                                        <td><strong>{trip.car}</strong><br /><small>{trip.registration}</small></td>
                                                        <td>{trip.employee}</td>
                                                        <td>{new Date(trip.start_time).toLocaleString()}</td>
                                                        <td>{new Date(trip.end_time).toLocaleString()}</td>
                                                        <td>{trip.total_km?.toLocaleString()} km</td>
                                                        <td>{trip.late_return ? <span className="badge bg-danger">Late</span> : <span className="badge bg-success">On Time</span>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Maintenance Tab */}
                    {activeTab === 'maintenance' && maintenanceData && (
                        <>
                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <div className="card text-center border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-body p-4">
                                            <h3 className="fw-bold text-warning">{maintenanceData.statistics?.total_scheduled || 0}</h3>
                                            <p className="text-muted mb-0">Scheduled</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-center border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-body p-4">
                                            <h3 className="fw-bold text-success">{maintenanceData.statistics?.total_completed || 0}</h3>
                                            <p className="text-muted mb-0">Completed</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-center border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                        <div className="card-body p-4">
                                            <h3 className="fw-bold text-primary">R{maintenanceData.statistics?.total_cost?.toFixed(2) || 0}</h3>
                                            <p className="text-muted mb-0">Total Cost</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                <div className="card-header bg-transparent border-0 pt-4 px-4">
                                    <h5 className="fw-bold mb-0">Upcoming Maintenance</h5>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr><th>Car</th><th>Type</th><th>Scheduled Date</th><th>Est. Cost</th><th>Priority</th></tr>
                                            </thead>
                                            <tbody>
                                                {maintenanceData.upcoming?.map((maint, idx) => (
                                                    <tr key={idx}>
                                                        <td><strong>{maint.car}</strong><br /><small>{maint.registration}</small></td>
                                                        <td>{maint.type}</td>
                                                        <td>{new Date(maint.scheduled_date).toLocaleDateString()}</td>
                                                        <td>${maint.estimated_cost}</td>
                                                        <td><span className={`badge ${maint.priority === 'urgent' ? 'bg-danger' : maint.priority === 'high' ? 'bg-warning' : 'bg-secondary'}`}>{maint.priority}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Costs Tab */}
                    {activeTab === 'costs' && costData && (
                        <>
                            <div className="card border-0 rounded-4 shadow-sm mb-4" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                <div className="card-header bg-transparent border-0 pt-4 px-4">
                                    <h5 className="fw-bold mb-0">Fuel Costs by Car</h5>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr><th>Car</th><th>Fuel Cost</th><th>Total KM</th><th>Cost/km</th></tr>
                                            </thead>
                                            <tbody>
                                                {costData.fuel_costs_by_car?.map((car, idx) => (
                                                    <tr key={idx}>
                                                        <td><strong>{car.booking__car__brand} {car.booking__car__model}</strong><br /><small>{car.booking__car__registration_number}</small></td>
                                                        <td>${car.total_fuel_cost?.toFixed(2) || 0}</td>
                                                        <td>{car.total_km?.toLocaleString()} km</td>
                                                        <td>${car.cost_per_km?.toFixed(2) || 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                <div className="card-header bg-transparent border-0 pt-4 px-4">
                                    <h5 className="fw-bold mb-0">Late Fees by Employee</h5>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr><th>Employee</th><th>Late Returns</th><th>Total Late Fees</th></tr>
                                            </thead>
                                            <tbody>
                                                {costData.late_fees_by_employee?.map((emp, idx) => (
                                                    <tr key={idx}>
                                                        <td><strong>{emp.booking__employee__first_name} {emp.booking__employee__last_name}</strong><br /><small>@{emp.booking__employee__username}</small></td>
                                                        <td>{emp.total_late_returns}</td>
                                                        <td>${emp.total_late_fees?.toFixed(2) || 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AnimatedBackground>
    );
}



function CalendarView() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [availableCars, setAvailableCars] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedCarForBooking, setSelectedCarForBooking] = useState(null);
    const [bookingFormData, setBookingFormData] = useState({
        start_datetime: '',
        end_datetime: '',
        purpose: '',
        destination: '',
        estimated_km: '',
        trip_type: 'business',
        passengers: 1
    });

    useEffect(() => {
        // Set current month range
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        fetchCalendarEvents(start, end);
    }, []);

    const fetchCalendarEvents = async (start, end) => {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
            window.location.href = '/login';
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/calendar/?start=${start}&end=${end}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error fetching calendar events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = async (selectInfo) => {
        const start = selectInfo.startStr;
        const end = selectInfo.endStr;
        
        const token = localStorage.getItem('access_token');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/available_cars_by_date/?start=${start}&end=${end}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setAvailableCars(data.available || []);
                setSelectedCarForBooking(null);
                setBookingFormData({
                    ...bookingFormData,
                    start_datetime: start,
                    end_datetime: end
                });
                setShowBookingModal(true);
            } else {
                alert('Error fetching available cars');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to server');
        }
    };

    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        
        if (!selectedCarForBooking) {
            alert('Please select a car');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...bookingFormData,
                    car: selectedCarForBooking.id
                })
            });
            
            if (response.ok) {
                alert('✅ Booking request submitted successfully!');
                setShowBookingModal(false);
                // Refresh calendar
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
                fetchCalendarEvents(start, end);
            } else {
                const error = await response.json();
                alert('❌ Error: ' + (error.message || 'Failed to create booking'));
            }
        } catch (error) {
            alert('Error creating booking');
        }
    };

    if (loading) {
        return (
            <AnimatedBackground>
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </AnimatedBackground>
        );
    }

    return (
        <AnimatedBackground>
            <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
                <div className="container">
                    <div className="text-center mb-4 pt-3">
                        <div className="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-3">
                            <span className="display-4">📅</span>
                        </div>
                        <h2 className="fw-bold display-5 mb-2" style={{ color: '#fff' }}>CAR AVAILABILITY CALENDAR</h2>
                        <p className="lead" style={{ color: '#fff' }}>View and book cars from the calendar</p>
                        <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-light rounded-pill px-4" onClick={() => window.location.href = '/dashboard'}>
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>

                    <div className="card border-0 rounded-4 shadow-sm overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                        <div className="card-body p-4">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                initialView="dayGridMonth"
                                editable={false}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={true}
                                weekends={true}
                                events={events}
                                select={handleDateSelect}
                                eventClick={handleEventClick}
                                datesSet={(dateInfo) => {
                                    const start = dateInfo.startStr.split('T')[0];
                                    const end = dateInfo.endStr.split('T')[0];
                                    fetchCalendarEvents(start, end);
                                }}
                                height="auto"
                                eventContent={(eventInfo) => {
                                    return (
                                        <div style={{ padding: '2px', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <strong>{eventInfo.event.title}</strong>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white' }}>
                                <h5 className="modal-title fw-bold">📝 Request a Car</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowBookingModal(false)}></button>
                            </div>
                            <form onSubmit={handleBookingSubmit}>
                                <div className="modal-body p-4">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Start Date & Time</label>
                                            <input type="text" className="form-control" value={new Date(bookingFormData.start_datetime).toLocaleString()} readOnly disabled />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">End Date & Time</label>
                                            <input type="text" className="form-control" value={new Date(bookingFormData.end_datetime).toLocaleString()} readOnly disabled />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Available Cars ({availableCars.length})</label>
                                        <div className="row">
                                            {availableCars.length === 0 ? (
                                                <div className="alert alert-warning">No cars available for selected dates</div>
                                            ) : (
                                                availableCars.map(car => (
                                                    <div key={car.id} className="col-md-6 mb-2">
                                                        <div 
                                                            className={`car-select p-3 border rounded-3 cursor-pointer ${selectedCarForBooking?.id === car.id ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`}
                                                            onClick={() => setSelectedCarForBooking(car)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <div className="d-flex justify-content-between">
                                                                <div>
                                                                    <strong>{car.brand} {car.model}</strong>
                                                                    <br />
                                                                    <small className="text-muted">{car.registration_number}</small>
                                                                </div>
                                                                {selectedCarForBooking?.id === car.id && (
                                                                    <div className="text-primary">✓ Selected</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Destination *</label>
                                            <input type="text" className="form-control rounded-3" value={bookingFormData.destination} onChange={(e) => setBookingFormData({...bookingFormData, destination: e.target.value})} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Estimated KM *</label>
                                            <input type="number" className="form-control rounded-3" value={bookingFormData.estimated_km} onChange={(e) => setBookingFormData({...bookingFormData, estimated_km: e.target.value})} required />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Purpose *</label>
                                        <textarea className="form-control rounded-3" rows="3" value={bookingFormData.purpose} onChange={(e) => setBookingFormData({...bookingFormData, purpose: e.target.value})} required />
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Trip Type</label>
                                            <select className="form-select rounded-3" value={bookingFormData.trip_type} onChange={(e) => setBookingFormData({...bookingFormData, trip_type: e.target.value})}>
                                                <option value="business">Business</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Passengers</label>
                                            <input type="number" className="form-control rounded-3" value={bookingFormData.passengers} onChange={(e) => setBookingFormData({...bookingFormData, passengers: e.target.value})} min="1" max="15" />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4">
                                    <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setShowBookingModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success rounded-pill px-4" disabled={!selectedCarForBooking}>Submit Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Event Details Modal */}
            {selectedEvent && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                <h5 className="modal-title fw-bold">📋 Booking Details</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedEvent(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <p><strong>🚗 Car:</strong> {selectedEvent.extendedProps.car_name}</p>
                                <p><strong>📝 Registration:</strong> {selectedEvent.extendedProps.car_registration}</p>
                                <p><strong>👤 Employee:</strong> {selectedEvent.extendedProps.employee_name}</p>
                                <p><strong>📍 Destination:</strong> {selectedEvent.extendedProps.destination}</p>
                                <p><strong>📖 Purpose:</strong> {selectedEvent.extendedProps.purpose}</p>
                                <p><strong>⏰ Start:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
                                <p><strong>⏰ End:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
                                <p><strong>📊 Status:</strong> <span className={`badge bg-${selectedEvent.extendedProps.status === 'approved' ? 'success' : 'warning'}`}>{selectedEvent.extendedProps.status}</span></p>
                            </div>
                            <div className="modal-footer border-0 p-4">
                                <button className="btn btn-primary rounded-pill px-4" onClick={() => setSelectedEvent(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AnimatedBackground>
    );
}

// Calendar View Component

// Dashboard Component
function Dashboard() {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        else window.location.href = '/login';
    }, []);
    
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };
    
    if (!user) return (<AnimatedBackground><div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div></AnimatedBackground>);
    
    return (
        <AnimatedBackground>
            <div style={{ minHeight: '100vh', padding: '4rem 0' }}>
                <div className="container">
                    <div className="text-center mb-5 pt-4">
                        <div className="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-3"><span className="display-4">👋</span></div>
                        <h2 className="fw-bold display-5 mb-2" style={{ color: '#fff' }}>DASHBOARD</h2>
                        <p className="lead" style={{ color: '#fff' }}>Welcome back, {user.first_name || user.username}!</p>
                        <div className="mt-3"><button className="btn btn-outline-light rounded-pill px-4" onClick={handleLogout}>Logout</button></div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-6"><div className="card border-0 rounded-4 shadow-sm h-100" style={{ background: 'rgba(255, 255, 255, 0.95)' }}><div className="card-body p-4"><h5 className="fw-bold mb-3" style={{ color: '#667eea' }}>Profile Info</h5><div className="list-group list-group-flush"><div className="list-group-item d-flex justify-content-between px-0"><span className="text-muted">Username:</span><span className="fw-semibold">{user.username}</span></div><div className="list-group-item d-flex justify-content-between px-0"><span className="text-muted">Email:</span><span className="fw-semibold">{user.email}</span></div><div className="list-group-item d-flex justify-content-between px-0"><span className="text-muted">Role:</span><span className="badge bg-info rounded-pill">{user.role}</span></div><div className="list-group-item d-flex justify-content-between px-0"><span className="text-muted">Employee ID:</span><span className="fw-semibold">{user.employee_id || 'N/A'}</span></div></div></div></div></div>
                        <div className="col-md-6"><div className="card border-0 rounded-4 shadow-sm h-100" style={{ background: 'rgba(255, 255, 255, 0.95)' }}><div className="card-body p-4"><h5 className="fw-bold mb-3" style={{ color: '#667eea' }}>Personal Details</h5><div className="list-group list-group-flush"><div className="list-group-item d-flex justify-content-between px-0"><span className="text-muted">Full Name:</span><span className="fw-semibold">{user.first_name} {user.last_name}</span></div><div className="list-group-item d-flex justify-content-between px-0"><span className="text-muted">Phone:</span><span className="fw-semibold">{user.phone_number || 'N/A'}</span></div></div></div></div></div>
                    </div>
                    <h5 className="fw-bold mb-4 text-center" style={{ color: '#fff' }}>Quick Actions</h5>
                    <div className="row g-3">
                        <div className="col-md-3"><button className="btn btn-primary w-100 py-3 rounded-3 d-flex flex-column align-items-center" onClick={() => window.location.href = '/cars'}><span className="display-6 mb-2">🚗</span><span>View Cars</span></button></div>
                        <div className="col-md-3"><button className="btn btn-info w-100 py-3 rounded-3 d-flex flex-column align-items-center text-white" onClick={() => window.location.href = '/my-bookings'}><span className="display-6 mb-2">📅</span><span>My Bookings</span></button></div>
                        <div className="col-md-3"><button className="btn btn-warning w-100 py-3 rounded-3 d-flex flex-column align-items-center" onClick={() => window.location.href = '/maintenance'}><span className="display-6 mb-2">🔧</span><span>Maintenance</span></button></div>
                        {(user.role === 'manager' || user.role === 'fleet_admin' || user.role === 'super_admin') && (<div className="col-md-3"><button className="btn btn-secondary w-100 py-3 rounded-3 d-flex flex-column align-items-center" onClick={() => window.location.href = '/manager'}><span className="display-6 mb-2">👔</span><span>Manager Dashboard</span></button></div>)}
                        {(user.role === 'fleet_admin' || user.role === 'super_admin') && (<div className="col-md-3"><button className="btn btn-danger w-100 py-3 rounded-3 d-flex flex-column align-items-center" onClick={() => window.location.href = '/fleet-admin'}><span className="display-6 mb-2">🚘</span><span>Fleet Management</span></button></div>)}
                        {(user.role === 'fleet_admin' || user.role === 'super_admin') && (<div className="col-md-3"><button className="btn btn-dark w-100 py-3 rounded-3 d-flex flex-column align-items-center" onClick={() => window.location.href = '/car-management'}><span className="display-6 mb-2">✏️</span><span>Car Management</span></button></div>)}
                        {(user.role === 'fleet_admin' || user.role === 'super_admin') && (<div className="col-md-3"><button className="btn btn-success w-100 py-3 rounded-3 d-flex flex-column align-items-center" onClick={() => window.location.href = '/schedule-maintenance'}><span className="display-6 mb-2">📋</span><span>Schedule</span></button></div>)}
                        {(user.role === 'super_admin' || user.role === 'fleet_admin') && (
    <div className="col-md-3 mt-3">
        <button className="btn btn-dark w-100 py-3 rounded-3 d-flex flex-column align-items-center" onClick={() => window.location.href = '/user-management'}>
            <span className="display-6 mb-2">👥</span>
            <span>User Management</span>
        </button>
    </div>
)}
{(user.role === 'fleet_admin' || user.role === 'super_admin') && (
    <div className="col-md-3">
        <button className="btn btn-info w-100 py-3 rounded-3 d-flex flex-column align-items-center text-white" onClick={() => window.location.href = '/reports'}>
            <span className="display-6 mb-2">📊</span>
            <span>Reports</span>
        </button>
    </div>
)}
<div className="col-md-3">
    <button className="btn btn-info w-100 py-3 rounded-3 d-flex flex-column align-items-center text-white" onClick={() => window.location.href = '/calendar'}>
        <span className="display-6 mb-2">📅</span>
        <span>Calendar</span>
    </button>
</div>

                    </div>
                </div>
            </div>
        </AnimatedBackground>
    );
}

// Main App Component
function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [selectedCar, setSelectedCar] = useState(null);
    
    useEffect(() => {
        const handleLocationChange = () => setCurrentPath(window.location.pathname);
        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);
    
    const isAuthenticated = !!localStorage.getItem('access_token');
    const protectedRoutes = ['/dashboard', '/cars', '/my-bookings', '/manager', '/fleet-admin', '/maintenance', '/car-management', '/schedule-maintenance','/user-management','/reports','/calendar'];
    
    if (protectedRoutes.includes(currentPath) && !isAuthenticated) { window.location.href = '/login'; return null; }
    
    switch(currentPath) {
        case '/login': return <Login />;
        case '/register': return <Register />;
        case '/dashboard': return <Dashboard />;
        case '/cars': return <CarList onRequestCar={(car) => { setSelectedCar(car); window.history.pushState({}, '', '/request-booking'); setCurrentPath('/request-booking'); }} />;
        case '/request-booking': return selectedCar ? <RequestBooking car={selectedCar} onClose={() => { setSelectedCar(null); window.history.pushState({}, '', '/cars'); setCurrentPath('/cars'); }} onSuccess={() => { setSelectedCar(null); window.history.pushState({}, '', '/my-bookings'); setCurrentPath('/my-bookings'); alert('Booking request submitted successfully!'); }} /> : (window.location.href = '/cars', null);
        case '/my-bookings': return <MyBookings />;
        case '/manager': return <ManagerDashboard />;
        case '/fleet-admin': return <FleetAdminCars />;
        case '/maintenance': return <MaintenanceTracking />;
        case '/car-management': return <CarManagement />;
        case '/schedule-maintenance': return <ScheduleMaintenance />;
        case '/user-management':return <UserManagement />;
        case '/reports':return <ReportsDashboard />;
        case '/calendar':return <CalendarView />;
        default: return isAuthenticated ? (window.location.href = '/dashboard', null) : <Home />;
    }
}

export default App;