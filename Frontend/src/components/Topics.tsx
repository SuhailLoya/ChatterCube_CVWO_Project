import { Box, Paper, Typography } from "@mui/material";
import { Topic } from "../interfaces";

interface TopicProps {
    topics: Topic[];
}

const Topics = ({ topics }: TopicProps) => {
    return (
        <Box sx={{ m: 2, p: 3 }}>
            {topics.map((topic) => (
                <Paper
                    elevation={3}
                    key={topic.id}
                    sx={{ bgcolor: "lightblue" }}
                >
                    <Box sx={{ p: 0.5, m: 3 }}>
                        <Typography variant="h4" sx={{ m: 2 }}>
                            {topic.title}
                        </Typography>
                        <Typography variant="h5">{topic.body}</Typography>
                        <Typography sx={{ m: 2 }}>{topic.tags}</Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default Topics;
