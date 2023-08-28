# GraphQL Prisma VN

**Apollo GraphQL APIs using Prisma ORM with User Signup, Login, and Change Password APIs, along with Movies CRUD Operations.**

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)

## Prerequisites

Before you begin, make sure you have the following software installed:

- Node.js and npm
- PostgreSQL

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/graphql-prisma-vn.git

2. **Navigate to the Project Directory:**
  
   ```bash
   cd graphql-prisma-vn


3. **Install Dependencies:**
    
    ```bash
    npm install

4. **Update Environment Variables:**
    
    ```bash
    npx prisma migrate dev --name init


5. **Compile TypeScript Files:**

    ```bash
    npx tsc

This creates a dist folder with compiled JavaScript files.

## Usage
**Start the Server:**
    
    ```bash
    node dist/index.js

Access GraphQL Playground:

Open your web browser and navigate to http://localhost:4000 to use the GraphQL Playground.

Features
User authentication with signup, login, and password change APIs.
CRUD operations for movies.
Contributing
Contributions are welcome! Please open issues and pull requests to contribute.


