import React, { useState, useEffect } from "react";
import { Paper, Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Topic } from "../../interfaces";

interface TopicEditProps {
    onUpdateTopic: (updatedTopic: Topic) => void;
}

const TopicEdit = ({ onUpdateTopic }: TopicEditProps) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState<Topic>({
        username: "",
        title: "",
        body: "",
        tags: "",
    });

    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        axios
            .get(`http://localhost:3000/api/v1/topics/${id}`)
            .then((response) => setFormData(response.data))
            .catch((error) => console.error("Error fetching topic:", error));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        // Clear the error when the user starts typing again
        setErrors([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        axios
            .put(`http://localhost:3000/api/v1/topics/${id}`, formData, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                const updatedTopic: Topic = response.data;
                console.log("Topic updated successfully");
                onUpdateTopic(updatedTopic);
                navigate(`/topics/${id}`);
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
                    console.error("Error updating topic:", error);
                }
                if (error.response.status === 401) {
                    window.alert("You are not authorized to edit this topic!");
                    navigate("/");
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
                borderRadius: 10,
            }}
        >
            <Paper elevation={3} sx={{ bgcolor: "lightblue" }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ p: 0.5, m: 3 }}
                >
                    <Typography variant="h4" sx={{ m: 2 }}>
                        Edit Topic
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
                        sx={{ mt: 2 }}
                    >
                        Update Topic
                    </Button>
                </Box>
                <Button
                    component={Link}
                    to={`/topics/${id}`}
                    variant="contained"
                    sx={{ p: 0.5, mb: 2 }}
                >
                    Cancel
                </Button>
            </Paper>
        </Box>
    );
};

export default TopicEdit;
