import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

interface SigninFormProps {
    onSignIn: () => void;
}

const SignInForm = ({ onSignIn }: SigninFormProps) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:3000/users/sign_in",
                {
                    user: formData,
                }
            );
            console.log("Signin successful:", response.data);
            const token = response.data.token;
            localStorage.setItem("token", token);
            onSignIn();

            toast.success("You are signed in!!", {
                autoClose: 2000,
                hideProgressBar: true,
            });
            navigate("/");
        } catch (error) {
            console.error("Error signing in:", error);
            setError(
                "Failed to sign in. Please check your credentials and try again."
            );
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>
                Sign In
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
            <Button type="submit" variant="contained" color="primary">
                Sign In
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </form>
    );
};

export default SignInForm;
