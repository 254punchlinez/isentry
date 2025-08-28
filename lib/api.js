import axios from "axios"

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
})

// Users API
export const usersApi = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (user) => api.post("/users", user),
  update: (id, user) => api.put(`/users/${id}`, user),
  delete: (id) => api.delete(`/users/${id}`),
}

// Posts API
export const postsApi = {
  getAll: () => api.get("/posts"),
  getById: (id) => api.get(`/posts/${id}`),
  create: (post) => api.post("/posts", post),
  update: (id, post) => api.put(`/posts/${id}`, post),
  delete: (id) => api.delete(`/posts/${id}`),
}

export default api
