exports.getDate = () => {
    return new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
};

exports.getDay = () => {
    return new Date().toLocaleDateString("en-US", {
        weekday: "long"
    });
};