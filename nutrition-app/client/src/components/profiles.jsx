import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye, faRepeat, faTrashAlt, faSave, faCamera } from '@fortawesome/free-solid-svg-icons';
import '../styles/profile.css';

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        age: '',
        gender: '',
        goal: '',
        allergies: '',
        weight: '',
        height: '',
        avatarUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPwdForm, setShowPwdForm] = useState(false);
    const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '' });
    const [showPwd, setShowPwd] = useState({ old: false, new: false });
    const [pwdError, setPwdError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [avatarFile, setAvatarFile] = useState(null);

    useEffect(() => {
        if (!token) return navigate('/login');

        axios.get('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                const data = res.data;
                setUser({
                    name: data.name || '',
                    email: data.email || '',
                    age: data.age || '',
                    gender: data.gender || '',
                    goal: data.goal || '',
                    allergies: data.allergies || '',
                    weight: data.weight || '',
                    height: data.height || '',
                    avatarUrl: data.avatarUrl || ''
                });
            })
            .catch(() => setError("Failed to load profile"))
            .finally(() => setLoading(false));
    }, [navigate, token]);

    const handleChange = e => setUser({ ...user, [e.target.name]: e.target.value });

    const saveProfile = async e => {
        e.preventDefault();
        try {
            await axios.put('/api/profile', user, { headers: { Authorization: `Bearer ${token}` } });
            alert('✅ Profile saved successfully!');
        } catch {
            alert('❌ Failed to save profile!');
        }
    };

    const handleAvatarChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        setUser(u => ({
            ...u,
            avatarUrl: URL.createObjectURL(file)
        }));
    };

    const saveAvatar = async () => {
        if (!avatarFile) return;
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        await axios.post('/api/profile/avatar', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        alert('✅ Avatar updated successfully!');
    };

    const togglePwdForm = () => {
        setShowPwdForm(x => !x);
        setPwdError('');
        setPwdData({ oldPassword: '', newPassword: '' });
    };

    const handlePwdChange = e => setPwdData({ ...pwdData, [e.target.name]: e.target.value });

    const savePassword = async e => {
        e.preventDefault();
        setPwdError('');
        try {
            await axios.put('/api/profile/password', pwdData, { headers: { Authorization: `Bearer ${token}` } });
            alert('✅ Password changed successfully!');
            togglePwdForm();
        } catch (err) {
            setPwdError(err.response?.data?.message || '❌ Failed to change password!');
        }
    };

    const deleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
        try {
            await axios.delete('/api/profile', { headers: { Authorization: `Bearer ${token}` } });
            alert('✅ Account deleted successfully!');
            localStorage.removeItem('token');
            navigate('/login');
        } catch {
            alert('❌ Failed to delete account!');
        }
    };

    if (loading) return <p className="text-center mt-6">⏳ Loading...</p>;
    if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

    return (
        <div className="profile-container">
            {/* LEFT: Profile Form */}
            <div className="profile-left">
                <div className="profile-header">
                    <h2 className="profile-title">Update Profile</h2>
                    <button
                        onClick={togglePwdForm}
                        className="repeat-btn"
                        title={showPwdForm ? 'Cancel password change' : 'Change password'}
                    >
                        <FontAwesomeIcon icon={faRepeat} />
                    </button>
                </div>

                <form onSubmit={saveProfile} className="profile-form">
                    <input name="name" type="text" placeholder="Full Name" value={user.name} onChange={handleChange} className="profile-input" />

                    <input name="email" type="email" placeholder="Email" value={user.email} onChange={handleChange} className="profile-input" />

                    <input name="age" type="number" placeholder="Age" value={user.age} onChange={handleChange} className="profile-input" />

                    <select name="gender" value={user.gender} onChange={handleChange} className="profile-input">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>

                    <input name="goal" type="text" placeholder="Health Goal" value={user.goal} onChange={handleChange} className="profile-input" />

                    <input name="allergies" type="text" placeholder="Allergies (if any)" value={user.allergies} onChange={handleChange} className="profile-input" />

                    <div className="input-with-unit">
                        <input
                            name="weight"
                            type="number"
                            placeholder="Weight"
                            value={user.weight}
                            onChange={handleChange}
                            className="profile-input"
                        />
                        <span className="unit-label">kg</span>
                    </div>

                    <div className="input-with-unit">
                        <input
                            name="height"
                            type="number"
                            placeholder="Height"
                            value={user.height}
                            onChange={handleChange}
                            className="profile-input"
                        />
                        <span className="unit-label">cm</span>
                    </div>

                    {showPwdForm && (
                        <>
                            <h3 className="profile-subtitle">Change Password</h3>
                            <div className="relative">
                                <input
                                    name="oldPassword"
                                    type={showPwd.old ? 'text' : 'password'}
                                    placeholder="Current Password"
                                    value={pwdData.oldPassword}
                                    onChange={handlePwdChange}
                                    className="profile-input pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(prev => ({ ...prev, old: !prev.old }))}
                                    className="toggle-pwd-btn"
                                >
                                    <FontAwesomeIcon icon={showPwd.old ? faEye : faEyeSlash} />
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    name="newPassword"
                                    type={showPwd.new ? 'text' : 'password'}
                                    placeholder="New Password"
                                    value={pwdData.newPassword}
                                    onChange={handlePwdChange}
                                    className="profile-input pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(prev => ({ ...prev, new: !prev.new }))}
                                    className="toggle-pwd-btn"
                                >
                                    <FontAwesomeIcon icon={showPwd.new ? faEye : faEyeSlash} />
                                </button>
                            </div>
                            {pwdError && <p className="text-red-500">{pwdError}</p>}
                            <button type="submit" className="profile-btn btn-password">
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Save Password
                            </button>
                        </>
                    )}

                    <button type="submit" className="profile-btn btn-save">
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Save Profile
                    </button>

                    <button onClick={deleteAccount} type="button" className="profile-btn btn-delete mt-4">
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                        Delete Account
                    </button>
                </form>
            </div>

            {/* RIGHT: Avatar + info */}
            <div className="profile-info-panel">
                <div className="avatar-wrapper">
                    <img src={user.avatarUrl || '/images/avt_default.jpg'} alt="Avatar" className="avatar-img" />

                    <label className="avatar-upload-btn">
                        <FontAwesomeIcon icon={faCamera} />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </label>

                    {avatarFile && (
                        <button onClick={saveAvatar} className="btn-avatar-save">
                            Save Avatar
                        </button>
                    )}
                </div>

                <ul className="info-list">
                    <li><strong>Name:</strong> {user.name}</li>
                    <li><strong>Age:</strong> {user.age}</li>
                    <li><strong>Weight:</strong> {user.weight} kg</li>
                    <li><strong>Height:</strong> {user.height} cm</li>
                    <li><strong>Gender:</strong> {user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : 'Other'}</li>
                </ul>
            </div>
        </div>
    );
};

export default Profile;
