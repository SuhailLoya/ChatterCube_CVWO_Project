import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Topic } from "../../interfaces";

interface TopicFormProps {
    onTopicCreated: (newTopic: Topic) => void;
}

const TopicForm = ({ onTopicCreated }: TopicFormProps) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Topic>({
        username: "aa",
        title: "",
        body: "",
        tags: "",
    });

    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/user", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setFormData((prevData) => ({
                    ...prevData,
                    username: response.data.email,
                }));
            })
            .catch((error) => {
                console.error("Error fetching current user:", error);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        axios
            .post("http://localhost:3000/api/v1/topics", formData, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                const newTopic: Topic = response.data;
                onTopicCreated(newTopic);
                setFormData({
                    username: "aa",
                    title: "",
                    body: "",
                    tags: "",
                });
                console.log("Topic created successfully");
                navigate("/");
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.errors
                ) {
                    // Handle validation errors from the server
                    setErrors(error.response.data.errors);
                    console.log(error.response.data.errors);
                } else {
                    console.error("Error creating topic:", error);
                }
            });
    };

    return (
        <Box
            sx={{
                maxWidth: 700,
                margin: "auto",
                mt: 2,
                p: 2,
                border: "1px solid #cccccc",
                borderRadius: 10,
            }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h4" sx={{ m: 2 }}>
                    Create a New Topic
                </Typography>
                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    error={errors.some((err) =>
                        err.toLowerCase().includes("username")
                    )}
                    helperText={
                        errors.find((err) =>
                            err.toLowerCase().includes("username")
                        ) || " "
                    }
                    disabled // Disable the username field to prevent modification
                />
                <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    margin="normal"
                    error={errors.some((err) =>
                        err.toLowerCase().includes("title")
                    )}
                    helperText={
                        errors.find((err) =>
                            err.toLowerCase().includes("title")
                        ) || " "
                    }
                />
                <TextField
                    fullWidth
                    multiline
                    label="Body"
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    margin="normal"
                    error={errors.some((err) =>
                        err.toLowerCase().includes("body")
                    )}
                    helperText={
                        errors.find((err) =>
                            err.toLowerCase().includes("body")
                        ) || " "
                    }
                />
                <TextField
                    fullWidth
                    label="Tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    margin="normal"
                    error={errors.some((err) =>
                        err.toLowerCase().includes("tags")
                    )}
                    helperText={
                        errors.find((err) =>
                            err.toLowerCase().includes("tags")
                        ) || " "
                    }
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1 }}
                >
                    Create Topic
                </Button>
            </Box>
            <Button
                component={Link}
                to="/"
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
            >
                Back
            </Button>
        </Box>
    );
};

export default TopicForm;
