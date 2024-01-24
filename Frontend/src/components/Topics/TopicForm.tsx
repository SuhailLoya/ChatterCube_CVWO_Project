// TopicForm.tsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Topic } from "../../interfaces";

interface TopicFormProps {
    onTopicCreated: (newTopic: Topic) => void;
}

const TopicForm = ({ onTopicCreated }: TopicFormProps) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        title: "",
        body: "",
        tags: "",
    });

    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        // Clear the error when the user starts typing again
        setErrors([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        axios
            .post("http://localhost:3000/api/v1/topics", formData)
            .then((response) => {
                const newTopic: Topic = response.data;
                onTopicCreated(newTopic);
                setFormData({
                    username: "",
                    title: "",
                    body: "",
                    tags: "",
                });
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
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 700,
                margin: "auto",
                mt: 2,
                p: 2,
                border: "1px solid #cccccc",
                borderRadius: 10,
            }}
        >
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
                    errors.find((err) => err.toLowerCase().includes("title")) ||
                    " "
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
                error={errors.some((err) => err.toLowerCase().includes("body"))}
                helperText={
                    errors.find((err) => err.toLowerCase().includes("body")) ||
                    " "
                }
            />
            <TextField
                fullWidth
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                margin="normal"
                error={errors.some((err) => err.toLowerCase().includes("tags"))}
                helperText={
                    errors.find((err) => err.toLowerCase().includes("tags")) ||
                    " "
                }
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
            >
                Create Topic
            </Button>
        </Box>
    );
};

export default TopicForm;
