const textResponse = (text) => {
    return {
        type: "text",
        content: text,
        timestamp: new Date().toISOString()
    };
};

export { textResponse };
// Audio, Video, Files can be added similarly
