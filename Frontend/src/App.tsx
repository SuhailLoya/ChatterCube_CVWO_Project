import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Topics from "./components/Topics";

const API_URL = "http://localhost:3000/api/v1/topics";

interface Topic {
    id: number;
    title: string;
    body: Text;
    tags: string;
}

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
        return <div>Error: {error}</div>;
    } else if (!isMounted) {
        return <div>Please Wait</div>;
    }

    return (
        <>
            <h1>Welcome to ChatterCube!!!</h1>
            <Topics topics={topics} />
        </>
    );
}

export default App;
