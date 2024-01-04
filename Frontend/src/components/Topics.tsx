import React from "react";

interface TopicsProps {
    topics: Topic[];
}

const Topics = ({ topics }: TopicsProps) => {
    return (
        <ol>
            {topics.map((topic) => (
                <li key={topic.id}>
                    <strong>{topic.title}</strong> <p>topic.body</p>
                    <ul >
                        <li>{topic.tags}</li>
                    </ul>
                    <p></p>
                </li>
            ))}
        </ol>
    );
};

export default Topics;
