import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Typography, Box, Paper } from "@mui/material";
import { Topic } from "../../interfaces";

interface TopicViewProps {
    onDeleteTopic: (deletedTopic: Topic) => void;
}

const TopicView = ({ onDeleteTopic }: TopicViewProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState<Topic>();

    useEffect(() => {
        axios
            .get(`http://localhost:3000/api/v1/topics/${id}`)
            .then((response) => response.data)
            .then((data) => {
                setTopic(data);
            })
            .catch((error) => {
                console.error("Error fetching topic details:", error);
            });
    }, [id]);

    if (!topic) {
        return <div>Loading...</div>;
    }

    const handleDelete = () => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this topic?"
        );

        if (isConfirmed) {
            axios
                .delete(`http://localhost:3000/api/v1/topics/${id}`)
                .then(() => {
                    console.log("Topic deleted successfully");
                    onDeleteTopic(topic);
                    navigate("/");
                })
                .catch((error) => {
                    console.error("Error deleting topic:", error);
                });
        }
    };

    return (
        <Box sx={{ m: 2, p: 3 }}>
            <Paper elevation={3} sx={{ bgcolor: "lightblue" }}>
                <Box sx={{ p: 0.5, m: 3 }}>
                    <Typography variant="h4" sx={{ m: 2 }}>
                        {topic.title}
                    </Typography>
                    <Typography variant="h5">{topic.body}</Typography>
                    <Typography sx={{ m: 2 }}>
                        <strong>Username:</strong> {topic.username}
                    </Typography>
                    <Typography sx={{ m: 2 }}>
                        <strong>Tags:</strong> {topic.tags}
                    </Typography>
                    <Button
                        component={Link}
                        to={`/topics/${topic.id}/edit`}
                        variant="contained"
                        color="primary"
                        sx={{ mb: 1 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{ ml: 4, mr: 4, mb: 1 }}
                    >
                        Delete
                    </Button>
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        sx={{ mb: 1 }}
                    >
                        Back
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default TopicView;
