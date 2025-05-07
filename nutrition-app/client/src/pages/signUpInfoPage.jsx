// src/pages/SignUpInfoPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpInfoPage = () => {
    const [info, setInfo] = useState({
        age: '',
        weight: '',
        height: '',
        gender: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const basic = localStorage.getItem("signup_basic");
        if (!basic) {
            alert("Missing basic info, please register again.");
            navigate("/signUpPage");
        }
    }, [navigate]);

    const handleChange = e => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const basic = JSON.parse(localStorage.getItem("signup_basic") || "{}");
        if (!basic.email || !basic.password) {
            alert("Missing basic info, please register again.");
            return navigate("/signUpPage");
        }

        const payload = { ...basic, ...info };

        try {
            // 1️⃣ Register
            let res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Register failed");
            }

            // 2️⃣ Login immediately
            res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: basic.email,
                    password: basic.password
                })
            });
            const loginData = await res.json();
            if (!res.ok) throw new Error(loginData.message || "Login failed");

            // 3️⃣ Save token & redirect
            localStorage.setItem("token", loginData.token);
            localStorage.removeItem("signup_basic");
            alert("🎉 Registered and logged in!");
            navigate("/login");
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
                    Personal Info
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="number"
                        name="age"
                        value={info.age}
                        onChange={handleChange}
                        placeholder="Age"
                        required
                        className="w-full px-4 py-2 rounded bg-gray-100"
                    />
                    <input
                        type="number"
                        name="weight"
                        value={info.weight}
                        onChange={handleChange}
                        placeholder="Weight (kg)"
                        required
                        className="w-full px-4 py-2 rounded bg-gray-100"
                    />
                    <input
                        type="number"
                        name="height"
                        value={info.height}
                        onChange={handleChange}
                        placeholder="Height (cm)"
                        required
                        className="w-full px-4 py-2 rounded bg-gray-100"
                    />
                    <select
                        name="gender"
                        value={info.gender}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded bg-gray-100"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpInfoPage;
