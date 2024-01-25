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

    const refresh = () => {
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

    const handleDeleteComment = async (commentId: number) => {
        try {
            await axios.delete(
                `http://localhost:3000/api/v1/topics/${id}/comments/${commentId}`
            );
            console.log("Comment deleted successfully");
            refresh();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleEditComment = async (commentId: number) => {
        console.log("Edit");
    };

    return (
        <Box sx={{ p: 3, width: 1000 }}>
            <Typography variant="h6" sx={{ m: 2 }}>
                Comments:
            </Typography>
            <ul style={{ padding: 0 }}>
                {comments.map((comment) => (
                    <Paper
                        elevation={1}
                        sx={{ bgcolor: "lightblue", position: "relative" }}
                    >
                        <Box sx={{ p: 0.5, m: 3 }}>
                            <Typography>{comment.content}</Typography>
                            <Typography>
                                <strong>Username:</strong> {comment.username}
                            </Typography>

                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 5,
                                    right: 5,
                                    color: "grey",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    fontSize: "0.8rem", // Adjust the font size as needed
                                    mr: 1, // Add some right margin for spacing
                                }}
                                onClick={() =>
                                    comment.id
                                        ? handleEditComment(comment.id)
                                        : null
                                }
                            >
                                Edit
                            </Box>

                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 5,
                                    right: 50, // Adjust the position as needed for spacing
                                    color: "grey",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    fontSize: "0.8rem", // Adjust the font size as needed
                                }}
                                onClick={() =>
                                    comment.id
                                        ? handleDeleteComment(comment.id)
                                        : null
                                }
                            >
                                Delete
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </ul>
            <CommentForm topicId={id} onCommentAdded={refresh} />
        </Box>
    );
};

export default Comments;
