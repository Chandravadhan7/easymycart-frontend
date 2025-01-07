export const fetchWithAuth = async (url, options = {}) => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
        window.location.href = "/login";
        return;
    }

    const headers = {
        "Content-Type": "application/json",
        sessionId,
        ...options.headers,
    };

    try {
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            // Redirect to login if the session is invalid or expired
            window.location.href = "/login";
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch with Auth error:", error);
        throw error;
    }
};
