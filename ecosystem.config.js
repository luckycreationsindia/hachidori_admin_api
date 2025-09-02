module.exports = {
    apps: [
        {
            name: "hachidori_api",
            script: "pnpm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
            },
        },
    ],
};