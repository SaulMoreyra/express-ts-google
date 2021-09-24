import axios from "axios";
import GooglePrediction, { Prediction } from "../types/TPrediction";
import GooglePlace, { Place } from "./../types/TPlace";
import { getServer } from "../config";

const SERVER_URL = getServer();
const BASE_URL = `${SERVER_URL}/api/places`;

const getPlaces = async (search: String): Promise<Prediction[]> => {
  const { data } = await axios.get<GooglePrediction>(
    `${BASE_URL}?search=${search}`
  );
  return data.predictions;
};

const getPlace = async (placeId: String): Promise<Place> => {
  const { data } = await axios.get<GooglePlace>(`${BASE_URL}/${placeId}`);
  return data.result;
};

export default { getPlaces, getPlace };
