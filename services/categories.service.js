import axios from "helpers/configApi";

export const categoriesService = {
  list,
};

async function list() {
  try {
    const res = await axios.get(`/categories`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
