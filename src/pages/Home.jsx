import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginSelection from './auth/LoginSelection';

const Home = () => {
    const { user, loading } = useAuth();

    if (loading && !user) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
            <div className="animate-pulse" style={{ color: '#10b981', fontWeight: 'bold' }}>Loading Varogra Secure...</div>
        </div>;
    }

    try {
        // Not logged in -> Show Login Selection directly
        if (!user) {
            return <Navigate to="/login" replace />;
        }

        // Doctor Logged In
        if (user.role === 'doctor') {
            return <Navigate to="/dashboard/doctor" replace />;
        }

        // Medical Store Logged In
        if (user.role === 'medical_store') {
            return <Navigate to="/dashboard/pharmacy" replace />;
        }

        // Hospital Role Check
        const storedRole = localStorage.getItem('userRole');
        if (storedRole === 'hospital') {
            return <Navigate to="/hospital" replace />;
        }

        // Patient Logged In -> NEW DASHBOARD
        return <Navigate to="/dashboard/patient" replace />;
    } catch (error) {
        console.error("Home Component Crash:", error);
        return (
            <div style={{ padding: '20px', color: 'red', backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '16px' }}>Dashboard Load Error</h1>
                <p style={{ marginBottom: '24px' }}>{error.message}</p>
                <button
                    onClick={() => { localStorage.clear(); window.location.reload(); }}
                    style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Clear Data & Reset
                </button>
            </div>
        );
    }
};

export default Home;
