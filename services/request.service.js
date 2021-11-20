import axios from "helpers/configApi";

export const requestService = {
  list,
  create,
};

async function list() {
  try {
    const res = await axios.get(`/requests`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function create(data) {
  try {
    const res = await axios.post(`/requests`, data);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
