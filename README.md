# 🤖 Hachidori Admin API

API for Hachidori Admin Panel.

---

# ✨ Requirements
- Any Operating System (ie. MacOS X, Linux, Windows)
- NodeJS Installed on System
- Any IDE (ie. IntelliJ Idea, VSCode etc)
- Knowledge of NodeJS, TypeScript, Express and MongoDB

---

# 📝 Notes
- Add .env file (Refer to .env.example file to generate one)
- Generate Secure Secret for Argon2 Hashing (Used for User Authentication) and add it to the .env file.
- Generate JWT Secret for JWT Authentication and add it to the .env file.
- Generate JWT Secret for JWT Refresh Token and add it to the .env file.
- Generate Cookie Secret for Cookie Authentication and add it to the .env file.
- Change NODE_ENV to "production" if deploying to production.

---

# 🗄️ Prisma Setup

This project uses **Prisma** as the ORM for PostgreSQL. Follow the steps below to set up the database locally.

- Set up a PostgreSQL database.
- Add the database URL to the .env file.
`DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"`

- Run the following command to generate the Prisma client.
`pnpm generate`

- Run the following command to add migration.
`pnpm migrate:dev -- --name [NAME OF MIGRATION TO BE CREATED]`

- Run the following command to migrate the database.
`pnpm migrate:deploy`

- Run the following command to seed the database.
`pnpm seed`

---

# 🐛 Development

### ▶️ Run in Dev Mode
To run the API in development mode with live reloading, use the following command. This will watch for changes in your files and automatically restart the server.

`npm run dev`
or
`yarn dev`
or
`pnpm dev`

---

# 🚀 Deployment

### ⚙️ Build
To build the project for a production environment, run the following command. This will transpile the TypeScript files into the dist directory.

`npm run build`
or
`yarn build`
or
`pnpm build`

### ▶️ Run
To run the production build, use the start script. The server will launch using the compiled JavaScript files.

`npm run start`
or
`yarn start`
or
`pnpm start`

---

###### `©️ Hachidori Robotics Pvt Ltd`