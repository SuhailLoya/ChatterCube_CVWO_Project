import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrentUser = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem("token"); // Get authentication token from storage
                const response = await axios.get("http://localhost:3000/user", {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`, // Include token in Authorization header
                    },
                });
                setCurrentUser(response.data);
                setLoading(false);
            } catch (error) {
                if (error.response.status === 401) {
                    setError("User is not authenticated");
                } else {
                    setError(error.message);
                }
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Current User</h2>
            {currentUser ? (
                <div>
                    <p>Email: {currentUser.email}</p>
                    {/* Add more fields as needed */}
                </div>
            ) : (
                <p>No user found.</p>
            )}
        </div>
    );
};

export default CurrentUser;
