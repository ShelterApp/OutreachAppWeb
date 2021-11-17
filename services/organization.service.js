import axios from "helpers/configApi";

export const organizationService = {
  list,
  create,
  get,
  update,
  _delete
};

async function list() {
  try {
    const res = await axios.get(`/organizations`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function create(params) {
  try {
    const res = await axios.post(`/organizations`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function update(id, params) {
  try {
    const res = await axios.patch(`/organizations/${id}`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function get(id) {
  try {
    const res = await axios.get(`/organizations/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function _delete(id) {
  try {
    const res = await axios.delete(`/organizations/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
