import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Topics from "./components/Topics";
import { Topic } from "./interfaces";
import { Box, Container, Typography } from "@mui/material";
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
        return <div>Please Wait</div>;
    }

    return (
        <Container sx={{ height: 1000 }}>
            <Typography
                variant="h1"
                sx={{ my: 2, textAlign: "center", color: "primary.main" }}
            >
                Welcome to ChatterCube!!!
            </Typography>
            <Topics topics={topics} />
        </Container>
    );
}

export default App;
