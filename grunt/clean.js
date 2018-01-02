module.exports = {
    dist: {
        options: {
            force: true
        },
        files: [
            {
                dot: true,
                src: [
                    "dist/**/*"
                ]
            }
        ]
    },
    assemble: {
        options: {
            force: true
        },
        files: [
            {
                dot: true,
                src: [
                    "dist/*.html"
                ]
            }
        ]
    }
};
