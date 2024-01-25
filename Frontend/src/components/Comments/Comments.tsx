import React, { useEffect, useState } from "react";
import { Button, Typography, Box, Paper, TextField } from "@mui/material";
import { Comment } from "../../interfaces";
import CommentForm from "./CommentForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CommentsProps {
    id: string;
}

const Comments = ({ id }: CommentsProps) => {
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>();
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null
    );
    const [errors, setErrors] = useState<string[]>([]);
    const [editedCommentContent, setEditedCommentContent] =
        useState<string>("");

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedCommentContent(e.target.value);
        setErrors([]);
    };

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
        await axios
            .delete(
                `http://localhost:3000/api/v1/topics/${id}/comments/${commentId}`,
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
                console.log("Comment deleted successfully");
                refresh();
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    window.alert(
                        "You are not authorized to delete this comment"
                    );
                    navigate("/");
                }
            });
    };

    const handleEditComment = (commentId: number) => {
        setEditingCommentId(commentId);
        const existingComment = comments.find(
            (comment) => comment.id === commentId
        );
        if (existingComment) {
            setEditedCommentContent(existingComment.content);
        }
    };

    const handleSaveEdit = async (commentId: number) => {
        await axios
            .put(
                `http://localhost:3000/api/v1/topics/${id}/comments/${commentId}`,
                { content: editedCommentContent },
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
                console.log("Comment edited successfully");
                refresh();
                setEditingCommentId(null);
                setEditedCommentContent("");
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
                if (error.response.status === 401) {
                    window.alert(
                        "You are not authorized to edit this comment!"
                    );
                    navigate("/");
                }
            });
    };

    const handleCancelEdit = () => {
        setErrors([]);
        setEditingCommentId(null);
        setEditedCommentContent("");
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
                        key={comment.id}
                    >
                        <Box sx={{ p: 0.5, m: 3 }}>
                            {editingCommentId === comment.id ? (
                                <>
                                    <TextField
                                        fullWidth
                                        multiline
                                        label="Edit Comment"
                                        value={editedCommentContent}
                                        onChange={handleChange}
                                        error={errors.length > 0}
                                        helperText={
                                            errors.length > 0 ? errors[0] : " "
                                        }
                                        sx={{ mt: 1 }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() =>
                                            comment.id
                                                ? handleSaveEdit(comment.id)
                                                : null
                                        }
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleCancelEdit}
                                        sx={{ mt: 1 }}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography>{comment.content}</Typography>
                                    <Typography>
                                        <strong>Username:</strong>{" "}
                                        {comment.username}
                                    </Typography>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 5,
                                            right: 5,
                                            color: "grey",
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            fontSize: "0.8rem",
                                            mr: 1,
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
                                            right: 50,
                                            color: "grey",
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            fontSize: "0.8rem",
                                        }}
                                        onClick={() =>
                                            comment.id
                                                ? handleDeleteComment(
                                                      comment.id
                                                  )
                                                : null
                                        }
                                    >
                                        Delete
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Paper>
                ))}
            </ul>
            <CommentForm topicId={id} onCommentAdded={refresh} />
        </Box>
    );
};

export default Comments;
