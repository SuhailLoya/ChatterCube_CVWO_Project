import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Typography, Box, Paper } from "@mui/material";
import { Topic } from "../../interfaces";
import Comments from "../Comments/Comments";

interface TopicViewProps {
    onDeleteTopic: (deletedTopic: Topic) => void;
}

const TopicView = ({ onDeleteTopic }: TopicViewProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState<Topic>();

    useEffect(() => {
        axios
            .get<Topic>(`http://localhost:3000/api/v1/topics/${id}`)
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

    const handleDelete = async () => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this topic?"
        );

        if (isConfirmed) {
            await axios
                .delete(`http://localhost:3000/api/v1/topics/${id}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                })
                .then(() => {
                    console.log("Topic deleted successfully");
                    onDeleteTopic(topic);
                    navigate("/");
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        window.alert(
                            "You are not authorized to delete this topic"
                        );
                        navigate("/");
                    }
                });
        }
    };
    return (
        <>
            <Box sx={{ p: 3, width: 1000 }}>
                <Paper elevation={3} sx={{ bgcolor: "primary.light" }}>
                    <Box sx={{ p: 0.5, m: 1 }}>
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
                            color="secondary"
                            sx={{ mb: 1 }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                            sx={{ ml: 4, mb: 1 }}
                        >
                            Delete
                        </Button>
                    </Box>
                </Paper>
            </Box>
            {id && <Comments id={id} />}
            <Button
                component={Link}
                to="/"
                variant="contained"
                color="info"
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                }}
            >
                Back
            </Button>
        </>
    );
};

export default TopicView;
