import { GetPlaceDetails } from "@/services/GlobalAPI";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import axios from 'axios'; // Import axios for making API requests

function MyTripsCard({ trip }) {
  const [photoUrl, setPhotoUrl] = useState([]);

  useEffect(() => {
    if (trip) {
      GetPlacePhotos();
    }
  }, [trip]);

  // Fetches place photos using the RapidAPI Google Maps Places endpoint
  const GetPlacePhotos = async () => {
    try {
      // Replace with the appropriate logic to fetch the photo reference dynamically
      // const photoReference = "ATJ83zhSSAtkh5LTozXMhBghqubeOxnZWUV2m7Hv2tQaIzKQJgvZk9yCaEjBW0r0Zx1oJ9RF1G7oeM34sQQMOv8s2zA0sgGBiyBgvdyMxeVByRgHUXmv-rkJ2wyvNv17jyTSySm_-_6R2B0v4eKX257HOxvXlx_TSwp2NrICKrZM2d5d2P4q"; 
      const photoReference = "ATJ83zhSSAtkh5LTozXMhBghqubeOxnZWUV2m7Hv2tQaIzKQJgvZk9yCaEjBW0r0Zx1oJ9RF1G7oeM34sQQMOv8s2zA0sgGBiyBgvdyMxeVByRgHUXmv-rkJ2wyvNv17jyTSySm_-_6R2B0v4eKX257HOxvXlx_TSwp2NrICKrZM2d5d2P4q"; 

      const options = {
        method: 'GET',
        url: `https://google-map-places.p.rapidapi.com/maps/api/place/photo?photo_reference=${photoReference}&maxheight=1000&maxwidth=1000`,
        headers: {
          'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
          'x-rapidapi-key': '75c6b63bc2mshcf4ccd0d65bf112p177832jsn599da30e6ae6',
        },
      };

      const response = await axios.request(options);
      const photoUrls = response.request.responseURL; // Retrieves the photo URL from the response
      setPhotoUrl([photoUrls]); // Update state with the retrieved photo URL
    } catch (error) {
      console.error("Error fetching place photos:", error);
    }
  };

  return (
    <Card className="my-4 border-x-4 p-2">
      <Link to={"/view-trip/" + trip?.id}>
        <div className="font-serif xs:text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl hover:scale-105 transition-all rounded-2xl px-1 cursor-pointer">
          <img
            className="h-56 w-full rounded-2xl p-2"
            src='https://picsum.photos/id/1/200/300'
            alt={`Photo of ${trip?.userSelection?.location?.label ?? trip?.userSelection?.location ?? 'trip'}`} // Added alt attribute for better accessibility
          />
          <div className="my-6 mx-2 ">
            <h2 className="font-semibold text-sm md:text-lg mt-2 text-left">
              📍 {trip?.userSelection?.location?.label ?? trip?.userSelection?.location}
            </h2>
            <h2 className="font-semibold text-sm md:text-lg mt-2 text-left">
              📅 No of Days: {trip?.userSelection?.noOfDays}
            </h2>
            <h2 className="font-semibold text-sm md:text-lg mt-2 text-left">
              💰 Budget: {trip?.userSelection?.budget}
            </h2>
            <h2 className="font-semibold text-sm md:text-lg mt-2 text-left">
              👥 Traveler: {trip?.userSelection?.people}
            </h2>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default MyTripsCard;
