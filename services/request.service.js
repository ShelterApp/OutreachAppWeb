import axios from "helpers/configApi";

export const requestService = {
  list,
  create,
  update,
  get
};

async function list(params) {
  try {
    const res = await axios.get(`/requests`, { params });
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

async function update(id, params) {
  try {
    const res = await axios.put(`/requests/${id}/change-status`, params);
    return res;
  } catch (error) {
    return error.response.data;
  }
}

async function get(id) {
  try {
    const res = await axios.get(`/requests/${id}`,);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}


