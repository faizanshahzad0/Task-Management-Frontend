export const API_ROUTES = {
  AUTH: {
    signupUrl: "/signup",
    signinUrl: "/signin",
  },

  USERS: {
    getAllUsers: "/users",
    createUser: "/user",
    getUserById: "/user/:id",
    updateUser: "/user/:id",
    deleteUser: "/user/:id",
    loggedInUser: "/me",
  },

  Tasks: {
    createTask: "/create/task",
    updateTask: "/task",
    getTasks: "/tasks",
    deleteTask: "/task",
  },
};
