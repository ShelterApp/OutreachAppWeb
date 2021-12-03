import axios from "helpers/configApi";

export const suppliesService = {
  list,
  create,
  get,
  update,
  _delete
};

async function list() {
  try {
    const res = await axios.get(`/supplies`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function create(params) {
  try {
    const res = await axios.post(`/supplies`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function update(id, params) {
  try {
    const res = await axios.patch(`/supplies/${id}`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function get(id) {
  try {
    const res = await axios.get(`/supplies/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function _delete(id) {
  try {
    const res = await axios.delete(`/supplies/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
