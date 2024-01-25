import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { Comment } from "../../interfaces";

interface CommentFormProps {
    topicId: string;
    onCommentAdded: () => void;
}

const CommentForm = ({ topicId, onCommentAdded }: CommentFormProps) => {
    const [comment, setComment] = useState<Comment>({
        username: "",
        content: "",
        topic_id: topicId,
    });

    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setComment((prevComment) => ({ ...prevComment, [name]: value }));
        // Clear the error when the user starts typing again
        setErrors([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        axios
            .post(
                `http://localhost:3000/api/v1/topics/${topicId}/comments`,
                comment,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then(() => {
                onCommentAdded();
                setComment({
                    username: "",
                    content: "",
                    topic_id: topicId,
                }); // Clear the comment fields after submission
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.errors
                ) {
                    // Handle validation errors from the server
                    setErrors(error.response.data.errors);
                } else {
                    console.error("Error adding comment:", error);
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
            }}
        >
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={comment.username}
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
                    multiline
                    label="Add a comment"
                    name="content"
                    value={comment.content}
                    onChange={handleChange}
                    margin="normal"
                    error={errors.some((err) =>
                        err.toLowerCase().includes("content")
                    )}
                    helperText={
                        errors.find((err) =>
                            err.toLowerCase().includes("content")
                        ) || " "
                    }
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1 }}
                >
                    Add Comment
                </Button>
            </form>
        </Box>
    );
};

export default CommentForm;
