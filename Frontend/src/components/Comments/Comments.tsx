import React, { useEffect, useState } from "react";
import { Button, Typography, Box, Paper } from "@mui/material";
import { Comment } from "../../interfaces";
import CommentForm from "./CommentForm";
import axios from "axios";

interface CommentsProps {
    id: string;
}

const Comments = ({ id }: CommentsProps) => {
    const [comments, setComments] = useState<Comment[]>();
    useEffect(() => {
        axios
            .get<Comment[]>(
                `http://localhost:3000/api/v1/topics/${id}/comments`
            )
            .then((response) => response.data)
            .then((data) => {
                setComments(data);
            })
            .catch((error) => {
                console.error("Error fetching topic details:", error);
            });
    }, [id]);
    if (!comments) {
        return <div>Loading...</div>;
    }

    const handleCommentAdded = () => {
        axios
            .get(`http://localhost:3000/api/v1/topics/${id}/comments`)
            .then((response) => response.data)
            .then((data) => {
                setComments(data);
            })
            .catch((error) => {
                console.error("Error fetching updated topic details:", error);
            });
    };
    return (
        <Box sx={{ p: 3, width: 1000 }}>
            <Typography variant="h6" sx={{ m: 2 }}>
                Comments:
            </Typography>
            <ul style={{ padding: 0 }}>
                {comments.map((comment) => (
                    <Paper elevation={1} sx={{ bgcolor: "lightblue" }}>
                        <Box sx={{ p: 0.5, m: 3 }}>
                            <li>
                                <Typography>{comment.content}</Typography>
                                <Typography>
                                    <strong>Username:</strong>{" "}
                                    {comment.username}
                                </Typography>
                            </li>
                        </Box>
                    </Paper>
                ))}
            </ul>
            <CommentForm topicId={id} onCommentAdded={handleCommentAdded} />
        </Box>
    );
};

export default Comments;
