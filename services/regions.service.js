import axios from "helpers/configApi";

export const regionsService = {
  list,
  create,
  get,
  update,
  _delete
};

async function list() {
  try {
    const res = await axios.get(`/regions`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function create(params) {
  try {
    const res = await axios.post(`/regions`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function update(id, params) {
  try {
    const res = await axios.patch(`/regions/${id}`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function get(id) {
  try {
    const res = await axios.get(`/regions/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function _delete(id) {
  try {
    const res = await axios.delete(`/regions/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
