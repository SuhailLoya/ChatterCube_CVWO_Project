export interface Topic {
    id?: number;
    username: string;
    title: string;
    body: string;
    tags: string;
}

export interface Comment {
    id?: number;
    content: string;
    username: string;
    topic_id: string;
}

export interface User {
    email: string;
}