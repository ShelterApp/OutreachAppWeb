import axios from "helpers/configApi";

export const campsService = {
  list,
  create,
  get,
  update,
  _delete,
  log,
  getLog
};

async function list(params) {
  try {
    const res = await axios.get(`/camps`, { params });

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function create(params) {
  try {
    const res = await axios.post(`/camps`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function update(id, params) {
  try {
    const res = await axios.patch(`/camps/${id}`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function get(id) {
  try {
    const res = await axios.get(`/camps/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function _delete(id) {
  try {
    const res = await axios.delete(`/camps/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function log() {
  try {
    const res = await axios.get(`/camplogs`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function getLog(id) {
  try {
    const res = await axios.get(`/auditlogs/camplogs/${id}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}