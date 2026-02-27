import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload';
import { registerUser, updateUserProfilePhoto } from '../../firebase/auth';
import { uploadProfilePhoto } from '../../firebase/services';

const DoctorRegister = () => {
    const navigate = useNavigate();
    const { registerDoctor } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [doctorType, setDoctorType] = useState('specialist'); // 'specialist' | 'rmp'
    const [hospitalCode, setHospitalCode] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Auto-calculate age from birthDate
    React.useEffect(() => {
        if (birthDate) {
            const bDate = new Date(birthDate);
            const today = new Date();
            let calculatedAge = today.getFullYear() - bDate.getFullYear();
            const monthDiff = today.getMonth() - bDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bDate.getDate())) {
                calculatedAge--;
            }
            if (calculatedAge >= 0) {
                setAge(calculatedAge.toString());
            }
        }
    }, [birthDate]);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!image) {
            setError("Please upload a profile photo.");
            return;
        }

        try {
            // 1. Register in Firebase Auth and Firestore
            const firebaseUser = await registerUser(email, password, name, 'doctor');

            // 2. Upload Photo
            const downloadURL = await uploadProfilePhoto(firebaseUser.uid, image, (progress) => {
                setUploadProgress(progress);
            });

            // 3. Update Firestore profile with Photo URL
            await updateUserProfilePhoto(firebaseUser.uid, downloadURL);

            alert('Registration Successful! Please wait for Admin approval.');
            navigate('/login/doctor');
        } catch (err) {
            setError(err.message);
            setUploadProgress(0);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <AuthLayout title="Doctor Registration" subtitle="Join a Hospital" showBack={true}>
                    <form onSubmit={handleRegister} className="flex-col" style={{ gap: 'var(--spacing-md)' }}>

                        {/* Image Upload */}
                        <ImageUpload
                            label="Profile Photo"
                            image={image}
                            onImageChange={setImage}
                            progress={uploadProgress}
                            className="mb-2"
                        />

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                            <label style={{
                                flex: 1, padding: '10px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                                backgroundColor: doctorType === 'specialist' ? '#eef2ff' : 'white',
                                border: `2px solid ${doctorType === 'specialist' ? 'var(--primary-color)' : '#f3f4f6'}`,
                                transition: 'all 0.2s'
                            }}>
                                <input type="radio" style={{ display: 'none' }} checked={doctorType === 'specialist'} onChange={() => setDoctorType('specialist')} />
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: doctorType === 'specialist' ? 'var(--primary-color)' : '#666' }}>Specialist</span>
                            </label>
                            <label style={{
                                flex: 1, padding: '10px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                                backgroundColor: doctorType === 'rmp' ? '#eef2ff' : 'white',
                                border: `2px solid ${doctorType === 'rmp' ? 'var(--primary-color)' : '#f3f4f6'}`,
                                transition: 'all 0.2s'
                            }}>
                                <input type="radio" style={{ display: 'none' }} checked={doctorType === 'rmp'} onChange={() => setDoctorType('rmp')} />
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: doctorType === 'rmp' ? 'var(--primary-color)' : '#666' }}>RMP Doctor</span>
                            </label>
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="doctor@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            label="Full Name"
                            placeholder="Dr. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {doctorType === 'specialist' && (
                            <Input
                                label="Specialty"
                                placeholder="Cardiologist, General Physician..."
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                required
                            />
                        )}
                        <Input
                            label="Phone Number (Used as Login PIN)"
                            placeholder="1234567890"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <Input
                            label="Hospital Name (Must match Code)"
                            placeholder="City Care Hospital"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            required
                        />
                        <Input
                            label="Hospital Code to Join"
                            placeholder="HOSP-XXXX"
                            value={hospitalCode}
                            onChange={(e) => setHospitalCode(e.target.value)}
                            required
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 2 }}>
                                <Input
                                    label="Birthdate"
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input
                                    label="Age"
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

                        <div style={{ marginTop: 'var(--spacing-md)' }}>
                            <Button type="submit" size="block">Submit Request</Button>
                        </div>

                        <p style={{ textAlign: 'center', fontSize: '15px', color: '#1e293b', marginTop: '24px', fontWeight: '500' }}>
                            Already have an account? <span onClick={() => navigate('/login/doctor')} style={{ color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>Login here</span>
                        </p>
                    </form>
                </AuthLayout>
            </div>
        </div>
    );
};

export default DoctorRegister;
