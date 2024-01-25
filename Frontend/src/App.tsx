import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";
import Topics from "./components/Topics/Topics";
import TopicForm from "./components/Topics/TopicForm";
import { Topic } from "./interfaces";
import TopicView from "./components/Topics/TopicView";
import {
    Container,
    Typography,
    Button,
    AppBar,
    Toolbar,
    MenuItem,
    Select,
} from "@mui/material";
import TopicEdit from "./components/Topics/TopicEdit";
import SignUpForm from "./components/Users/SignUpForm";
import SignInForm from "./components/Users/SignInForm";

const API_URL = "http://localhost:3000/api/v1/topics";

function App() {
    const [error, setError] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:3000/user", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setCurrentUserEmail(response.data.email);
            })
            .catch((error) => {
                console.error("Error fetching current user:", error);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        axios
            .get<Topic[]>(API_URL)
            .then((response) => response.data)
            .then((data) => {
                setIsMounted(true);
                setTopics(data);
            })
            .catch((error) => {
                setIsMounted(true);
                setError(error);
            });
    }, []);

    const handleTopicCreated = (newTopic: Topic) => {
        setTopics((prevTopics) => [...prevTopics, newTopic]);
    };

    const handleUpdateTopic = (updatedTopic: Topic) => {
        setTopics((prevTopics) =>
            prevTopics.map((topic) =>
                topic.id === updatedTopic.id ? updatedTopic : topic
            )
        );
    };

    const handleDeleteTopic = (deletedTopic: Topic) => {
        setTopics((prevTopics) =>
            prevTopics.filter((topic) => topic.id !== deletedTopic.id)
        );
    };

    const handleSignOut = () => {
        localStorage.removeItem("token"); // Clear the authentication token
        setIsLoggedIn(false); // Update login status
    };

    const handleSignIn = async () => {
        await axios
            .get("http://localhost:3000/user", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setCurrentUserEmail(response.data.email);
            })
            .catch((error) => {
                console.error("Error fetching current user:", error);
            });
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: "none",
                            color: "#FFFFFF",
                            textAlign: "left",
                        }}
                    >
                        ChatterCube
                    </Typography>
                    {isLoggedIn ? (
                        <>
                            <Select
                                value=""
                                displayEmpty
                                sx={{ color: "#FFFFFF" }}
                            >
                                <MenuItem value="" disabled>
                                    Hi {currentUserEmail}!
                                </MenuItem>
                                <MenuItem onClick={handleSignOut}>
                                    Sign Out
                                </MenuItem>
                            </Select>
                        </>
                    ) : (
                        <>
                            <Button
                                component={Link}
                                to="/sign-up"
                                color="inherit"
                            >
                                Sign Up
                            </Button>
                            <Button
                                component={Link}
                                to="/sign-in"
                                color="inherit"
                            >
                                Sign In
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Routes>
                <Route
                    path="/create-topic"
                    element={<TopicForm onTopicCreated={handleTopicCreated} />}
                />
                <Route
                    path="/"
                    element={
                        <>
                            <Container>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        my: 2,
                                        textAlign: "center",
                                        color: "primary.main",
                                    }}
                                >
                                    Welcome to ChatterCube!!!
                                </Typography>
                                <Topics topics={topics} />
                                <Button
                                    component={Link}
                                    to="/create-topic"
                                    variant="contained"
                                    color="primary"
                                >
                                    Create a New Topic
                                </Button>
                            </Container>
                        </>
                    }
                />
                <Route
                    path="/topics/:id"
                    element={<TopicView onDeleteTopic={handleDeleteTopic} />}
                />
                <Route
                    path="/topics/:id/edit"
                    element={<TopicEdit onUpdateTopic={handleUpdateTopic} />}
                />
                <Route path="/sign-up" element={<SignUpForm />} />
                <Route
                    path="/sign-in"
                    element={<SignInForm onSignIn={handleSignIn} />}
                />
            </Routes>
        </Router>
    );
}

export default App;
