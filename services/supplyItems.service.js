import axios from "helpers/configApi";

export const supplyItemsService = {
  list,
  create,
  get,
  update,
  _delete,
  createMany
};

async function list(params) {
  try {
    const res = await axios.get(`/supplies-items`, { params });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function create(params) {
  try {
    const res = await axios.post(`/supplies-items`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function createMany(params) {
  try {
    const res = await axios.post(`/supplies-items/create-many`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function update(id, params) {
  try {
    const res = await axios.patch(`/supplies-items/${id}`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function get(id) {
  try {
    const res = await axios.get(`/supplies-items/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function _delete(id) {
  try {
    const res = await axios.delete(`/supplies-items/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
