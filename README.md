# Realtime-Todo-App

## Overview
Create a simple real-time collaborative to-do list application using Next.js, TypeScript, React, and WebSockets.

## Functional Requirements

<details>
<summary>Click to expand</summary>

1. **Create a Next.js Project with TypeScript**
   - Set up a Next.js project configured to use TypeScript for type safety and improved developer experience.

2. **Fetch, Add, and Delete Tasks from the State**
   - Implement functionality to fetch tasks, add new tasks, and delete existing tasks while managing the state effectively.

3. **Set up WebSocket Connections**
   - Use Pusher.io sandbox to establish WebSocket connections for handling real-time updates.

4. **Real-Time Task Changes**
   - Use WebSockets to broadcast task changes in real time, ensuring all connected users see updates immediately.

5. **Form to Add New Tasks**
   - Implement a form that allows users to add new tasks to the to-do list.

6. **Display a List of Tasks**
   - Display a list of tasks with real-time updates, reflecting any changes made by users.

7. **Type Safety**
   - Ensure type safety throughout the application by utilizing TypeScript features.

</details>

## Use Case

<details>
  <summary>Click to expand</summary>
  
User 1 and User 2 collaborate on a simple to-do list. Both users can:

- [x] View a default list of 4 to-do items.
- [x] Add tasks to the list.
- [x] Mark a to-do as done by clicking a checkbox.
- [x] Delete a to-do by clicking a delete button beside each to-do item.

## Extras
- Display the creator of each to-do item beside the item.
- Display who marked the to-do item as done.

</details>

## Getting Started

<details>
<summary>Click to expand</summary>

### Prerequisites
- Node.js
- npm or yarn
- Pusher.io account (for WebSocket setup)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/real-time-todo-list.git
   cd real-time-todo-list
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with the following content
   ```sh
    NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
    NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
   ```

### Running the Application
1.  Start the development server:
    ```sh
    npm run dev
    ```
2. Open your browser and navigate to `http://localhost:3000`.

   
</details>

## LICENSE
This project is licensed under the MIT License.
