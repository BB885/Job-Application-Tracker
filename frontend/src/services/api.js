import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export const getApplications = () => axios.get(`${API_URL}/applications`);
export const createApplication = (data) => axios.post(`${API_URL}/applications`, data);
export const deleteApplication = (id) => axios.delete(`${API_URL}/applications/${id}`);
export const updateApplication = (id, data) => axios.put(`${API_URL}/applications/${id}`, data);
