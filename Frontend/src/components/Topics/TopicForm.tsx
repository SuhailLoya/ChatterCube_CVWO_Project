// TopicForm.tsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { Topic } from "../../interfaces";

interface TopicFormProps {
    onTopicCreated: (newTopic: Topic) => void;
}

const TopicForm = ({ onTopicCreated }: TopicFormProps) => {
    const [formData, setFormData] = useState({
        username: "",
        title: "",
        body: "",
        tags: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //   console.log("handleChange");
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        //    console.log("handleSubmit");
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
            })
            .catch((error) => {
                console.error("Error creating topic:", error);
            });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 700,
                margin: "auto",
                mt: 5,
                p: 2,
                border: "1px solid #cccccc",
                borderRadius: 4,
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
            />
            <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                fullWidth
                multiline
                label="Body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                margin="normal"
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
