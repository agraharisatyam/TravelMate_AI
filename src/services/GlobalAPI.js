import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

const config = {
	headers: {
		"Content-Type": "application/json",
		"X-Goog-Api-Key": '75c6b63bc2mshcf4ccd0d65bf112p177832jsn599da30e6ae6',
		"X-Goog-FieldMask": "places.photos,places.displayName,places.id",
	},
};

export const GetPlaceDetails = (data) => axios.post(BASE_URL, data, config);
