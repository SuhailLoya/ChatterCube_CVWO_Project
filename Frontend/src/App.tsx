import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";
import Topics from "./components/Topics/Topics";
import TopicForm from "./components/Topics/TopicForm";
import { Topic } from "./interfaces";
import TopicView from "./components/Topics/TopicView";
import { Container, Typography, Button } from "@mui/material";
import TopicEdit from "./components/Topics/TopicEdit";
const API_URL = "http://localhost:3000/api/v1/topics";

function App() {
    const [error, setError] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [topics, setTopics] = useState<Topic[]>([]);
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

    if (error) {
        return <div>{error}</div>;
    } else if (!isMounted) {
        return <div></div>;
    }

    // using to update topics with new data without refreshing the page
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

    return (
        <Router>
            <Routes>
                <Route
                    path="/create-topic"
                    element={<TopicForm onTopicCreated={handleTopicCreated} />}
                />
                <Route
                    path="/"
                    element={
                        <>
                            <Container sx={{ height: 1000 }}>
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
                    path="/topics/:id" // Route for individual topic, :id is a parameter
                    element={<TopicView onDeleteTopic={handleDeleteTopic} />} // Render the IndividualTopic component
                />
                <Route
                    path="/topics/:id/edit"
                    element={<TopicEdit onUpdateTopic={handleUpdateTopic} />}
                />
            </Routes>
        </Router>
    );
}

export default App;
