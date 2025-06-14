# Jaura's Task Manager - Internship Project!

## Deployed App:

My Jaura's Task Manager Web App is deployed under the 'Render' platform, feel free to visit the following url and check my internship project out: https://task-manager-hoaa.onrender.com

## How to open Project at your Local Machine:

1. First step is to clone this repository to your local folder in any Integrated Development Environment.
2. write down cd "desired repository" in your terminal.
3. Install the required npm packages/dependencies by typing 'npm install' in terminal.
4. If package.json is not already present, create one by typing 'npm init -y', then install the dependencies listed.
5. Copy the dependencies to your package.json file and then download your node_modules file.
6. After dependencies are installed properly, from root directory type 'node src/server.js' to run the Task Manager locally.
7. Open your browser and type 'http://localhost:3000' to run the Website.

## Dependencies:

The following npm packages are required to run this project:

1. **express** – Web framework for Node.js.
2. **mongoose** – MongoDB for data modeling.
3. **socket.io** – Real-time communication via WebSockets.
4. **validator** – For validating and sanitizing input.
5. **cors** – Middleware for handling cross-origin requests.
6. **dotenv** – Loads environment variables from .env file.

To install all dependencies, type `npm install` in the terminal.

## Technologies used in Jaura's Task Manager Website:

- Javascript
- Node JS
- Express
- MONGODB
- Mongoose
- WEB SOCKETS
- HTML
- CSS
- AJAX
- Git & Github

# Project Overview:

Jaura's Task Manager is a personal productivity web application built for internship and as a personal everyday use application, designed to replicate the functionality and aesthetics of a modern task management system. It allows users to manage their daily tasks in a structured and visually appealing way.

The app supports real-time updates, flexible task categorization, intuitive UX/UI design, and great responsiveness across all screen sizes.

# Project Features and Functionalities:

## Task Management:

On page load, tasks are fetched directly from the MongoDB database.

Tasks can be:

- Added
- Deleted
- Updated
- Starred
- Marked as Completed

### Tasks flow through three main sections:

Tasks – Default view for newly added Mr Jaura's tasks.

Starred Tasks – Contains high-priority and starred tasks.

Completed Tasks – Contains all tasks marked as done.

Each task has a header, description, and priority level (Low, Medium, High). Priority is color-coded:

- Low Priority Tasks are Green

- Medium Priority Tasks are Yellow

- High Priority Tasks are Red

## Real-Time Functionality with WebSockets:

To enhance the responsiveness and interactivity of the Task Manager app, Socket.IO has been implemented to enable real-time communication between the server and connected clients. This ensures that updates such as task changes or time displays happen live, without needing to refresh the page.

### Real-Time Task Syncing:

When a task is updated—whether it’s marked as completed, edited, or starred—a taskUpdated event is emitted using WebSockets.

The server listens for these updates and broadcasts the changes to all connected users in real-time.

This allows for a seamless multi-user experience where all users see the most recent data without delay.

### Example Flow:

A user marks a task as "starred" or "completed".

The client emits a taskUpdated event through the socket.

The server listens for this event and emits it to all clients.

All open sessions update their task lists automatically.

## Live Time & Date Updates:

In addition to task syncing, another WebSocket integration sends the live time and date to each client every second.

### The time is formatted into:

HH:MM:SS (12-hour format) for current time

Weekday, Month Day, Year for the current date

This feature provides a dynamic and lively UI, giving the app a modern, dashboard-like feel.

## Socket Configuration:

The socket.io server is configured with CORS policies to accept requests only from trusted origins (e.g., localhost:3000).

Proper cleanup is ensured when users disconnect to avoid memory leaks, especially for the recurring time interval logic.

These real-time features demonstrate a production-level approach to user experience, improving interactivity, speed, and responsiveness.

## Interactive UI:

A PLUS button on the top center opens a popup form to add a task.

The form includes:

- Task title

- Task description

- Priority level (dropdown)

Upon submission, the task is added to "Mr. Jaura’s Tasks".

## UI/UX Design:

Fully responsive using CSS media queries for mobile, tablet, and desktop devices.

Minimalistic blue and white theme.

Task boxes automatically adjust layout based on screen size (flex/grid design).

### Functional navigation bar includes:

- Tasks

- Starred Tasks

- Completed Tasks

### Decorative elements include:

- Profile picture

- Current time display

- Notification bell

- Mail Box

All four of these are there just for design they do not have a proper JS functionality.

# Code Quality & Best Practices:

## Database Architecture & MongoDB Integration:

To manage, persist, and structure task data efficiently, MongoDB is used as the primary database for this Task Manager application. All task-related operations such as adding, updating, deleting, starring, and marking as completed are performed via a well-defined MongoDB schema using Mongoose, a library for Node.js.

## MongoDB + Mongoose Configuration:

- The application connects to MongoDB using Mongoose, providing a high-level API to manage data with schema definitions.

- The MongoDB URI is securely stored in an .env file and loaded using dotenv, following best practices for environment configuration.

- A successful connection to the database is confirmed in the terminal, and any connection errors are logged for debugging.

## Task Routing & API Integration

All backend routes related to tasks (GET, POST, PUT, DELETE) are handled through a dedicated router module (taskRouter.js), and are prefixed under /api.

Tasks are fetched from MongoDB and passed to the frontend where they are rendered using DOM.

Changes made on the frontend (like updating or completing a task) are reflected in MongoDB in real-time, ensuring data persistence and synchronization across sessions.

## Code Structure:

### Organized with clean architecture:

App, Database, Structure, Styling, Routers, Sounds and Src are all separated into clearly defined folders.

## Clean Syntax:

- Straightforward, meaningful variable and function names.

- Proper indentation and spacing throughout.

- Comments are used sparingly and effectively without redundancy.

- Functions follow single-responsibility principle for maintainability.

## Testing:

- Manual testing performed across all major features (task creation, update, deletion, etc.).

- Future integration of automated testing with tools like Jest is possible.

## Error Handling:

- Proper try/catch blocks and middleware for error management.

- Server errors and unexpected issues are handled gracefully.

## Source Control & Collaboration:

- Git has been used for version control, following standard commit practices and branching models.

- Each new feature or bug fix is developed in a separate branch and merged via pull requests to maintain a clean and trackable development history.

## Contribute to my Website:

- Fork the repo
- Create a new branch ('git checkout -b feature-branch')
- Make your changes
- Push to the branch ('git push origin feature-branch')
- Open a pull request

## Contact:

- Email: [hussainjaura10@gmail.com]
- LinkedIn: [https://www.linkedin.com/in/muhammad-hussain-jaura-b303482b1/]
