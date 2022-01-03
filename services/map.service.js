import axios from "axios";

export const getLocationAPIMap = async coords => {
  try {
    const res = await axios.get(
      `http://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&sensor=true&key=${process.env.NEXT_PUBLIC_APIKEY_MAP}`
    );
    return res.data;
  } catch (error) {
    // return error.response.data;
    return Promise.reject(error);
  }
};

export const getAddress = async address => {
  try {
    const res = await axios.get(
      `http://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_APIKEY_MAP}`
    );
    return res.data;
  } catch (error) {
    // return error.response.data;
    return Promise.reject(error);
  }
}
