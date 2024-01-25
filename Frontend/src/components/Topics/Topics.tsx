import { Box, Paper, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Topic } from "../../interfaces";

interface TopicsProps {
    topics: Topic[];
}

const Topics = ({ topics }: TopicsProps) => {
    return (
        <Box sx={{ m: 2, p: 3 }}>
            {topics.map((topic) => (
                <Paper
                    elevation={3}
                    key={topic.id}
                    sx={{ bgcolor: "primary.light", cursor: "pointer" }}
                >
                    <Box sx={{ p: 0.5, m: 3 }}>
                        <Link
                            component={RouterLink}
                            to={`/topics/${topic.id}`}
                            color="inherit"
                            underline="none"
                        >
                            <Typography variant="h4" sx={{ m: 2 }}>
                                {topic.title}
                            </Typography>
                            <Typography variant="h5">{topic.body}</Typography>
                            <Typography sx={{ m: 2 }}>
                                By {topic.username}
                            </Typography>
                            <Typography sx={{ m: 2 }}>#{topic.tags}</Typography>
                        </Link>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default Topics;
