import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";

const SignupForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log(formData);
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/users", {
                user: formData,
            });
            //console.log("Signup successful:", response.data);
            toast.success("Sign-up successful! You can now log in.", {
                autoClose: 2000,
                hideProgressBar: true,
            });
            navigate("/sign-in");
        } catch (error) {
            console.error("Error signing up:", error);
            setError("Failed to signup. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>
                Signup
            </Typography>
            <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
            />
            <TextField
                fullWidth
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                margin="normal"
            />
            <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
                Sign Up
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </form>
    );
};

export default SignupForm;
