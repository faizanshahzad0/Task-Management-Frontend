export const API_ROUTES = {
  AUTH: {
    signupUrl: "/signup",
    signinUrl: "/signin",
  },

  USERS: {
    getAllUsers: "/users",
    getUserById: "/users/:id",
    updateUser: "/users/:id",
    deleteUser: "/users/:id",
    loggedInUser: "/me",
  },

  Tasks: {
    createTask: "/create/task",
    updateTask: "/task",
    getTasks: "/tasks",
    deleteTask: "/task",
  },
};
