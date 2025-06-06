# Unison 🎶

![Last Commit](https://img.shields.io/github/last-commit/your-username/unison?style=for-the-badge&logo=github&color=cba6f7)
![Repo Size](https://img.shields.io/github/repo-size/your-username/unison?style=for-the-badge&logo=github&color=f5c2e7)
![License](https://img.shields.io/github/license/your-username/unison?style=for-the-badge&color=a6e3a1)

A real-time "who's most likely to" social game to see if your friend group truly thinks in unison. Vote together on daily questions, watch the results update live, and find out just how in-sync you really are.

<br>
## ✨ Features

* **User Authentication:** Secure sign-up and login for players.
* **Group Management:** Create private groups and invite friends to join.
* **Daily Questions:** A new "who's most likely to" question delivered to each group, every day.
* **Real-Time Voting:** Cast your vote and watch the results change for everyone in the group instantly without a page refresh.
* **Results History:** Browse through past questions and see how your group voted.

## 🚀 Tech Stack

This project is a monorepo with a decoupled frontend and backend, built with a focus on performance and a modern developer experience.

| Layer      | Technology                                                                                                                                                                                                                                                                    |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | ![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)                                                     |
| **Backend** | ![Bun](https://img.shields.io/badge/Bun-111111?style=for-the-badge&logo=bun&logoColor=white) ![ElysiaJS](https://img.shields.io/badge/ElysiaJS-FFFFFF?style=for-the-badge&logo=elysia&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) ![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)                                               |
| **Deployment**| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![Fly.io](https://img.shields.io/badge/Fly.io-7B33FF?style=for-the-badge&logo=fly&logoColor=white)                                                                           |


## 🔧 Getting Started & Local Development

### Prerequisites

* [Bun](https://bun.sh/) installed locally.
* [Node.js](https://nodejs.org/) and npm (for the frontend).
* A running [PostgreSQL](https://www.postgresql.org/) database.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/unison.git](https://github.com/your-username/unison.git)
    cd unison
    ```

2.  **Set up the Backend:**
    ```sh
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    bun install

    # Create a .env file from the example
    cp .env.example .env
    ```
    Now, open `.env` and add your database connection string and other required environment variables.

3.  **Set up the Frontend:**
    ```sh
    # Navigate to the frontend directory from the root
    cd frontend

    # Install dependencies
    npm install

    # Create a .env file from the example
    cp .env.example .env
    ```
    Open `.env` in the `frontend` directory and add the URL for your local backend server (e.g., `VITE_BACKEND_URL=http://localhost:3000`).

### Running the Application

You'll need to run the frontend and backend in separate terminal windows.

* **Run the Backend Server:**
    ```sh
    # In the /backend directory
    bun run dev
    ```

* **Run the Frontend Development Server:**
    ```sh
    # In the /frontend directory
    npm run dev
    ```

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
