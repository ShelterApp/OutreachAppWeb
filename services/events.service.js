import axios from "helpers/configApi";

export const eventsService = {
  list,
  create,
  get,
  update,
  _delete
};

async function list() {
  try {
    const res = await axios.get(`/event`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function create(params) {
  try {
    const res = await axios.post(`/event`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function update(id, params) {
  try {
    const res = await axios.patch(`/event/${id}`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function get(id) {
  try {
    const res = await axios.get(`/event/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function _delete(id) {
  try {
    const res = await axios.delete(`/event/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
