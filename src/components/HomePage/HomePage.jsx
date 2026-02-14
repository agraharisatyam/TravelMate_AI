import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { chatSession } from "@/services/AImodel";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelerList,
} from "@/constants/options";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/fireBaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const HomePage = () => {
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [formData, setFormData] = useState({
    noOfDays: "",
    budget: "",
    people: "",
    location: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch places from RapidAPI
  const fetchPlaceSuggestions = async (query) => {
    if (!query) return;
    try {
      const response = await fetch(
        `https://google-map-places.p.rapidapi.com/maps/api/place/autocomplete/json?input=${query}&radius=50000&strictbounds=true&offset=3&location=40,-110&origin=40,-110&components=country:us&language=en®ion=en`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": "google-map-places.p.rapidapi.com",
            "x-rapidapi-key": "29d8a67e4emsh4383f68fa8f089cp10a24djsn9e0bd0ab7d23", // Replace with your actual RapidAPI key
          },
        }
      );
      const data = await response.json();

      console.log("Fetched place suggestions:", data); // Check the response

      setPlaceSuggestions(data.predictions || []);
    } catch (error) {
      console.error("Error fetching place suggestions:", error);
      setPlaceSuggestions([]);
    }
  };

  const fetchPlaceSuggestionsDebounced = debounce(fetchPlaceSuggestions, 300);

  const handleInputChanges = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    fetchPlaceSuggestionsDebounced(value); // Call the debounced function
  };

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      formData.noOfDays > 15 ||
      formData.noOfDays < 1 ||
      !formData.location ||
      !formData.budget ||
      !formData.people
    ) {
      toast("Please fill all details!");
      return;
    }

    setLoading(true); // Indicate the process is starting
    toast(
      "Patience is a virtue, and awesome things take time. We'll get you there soon!"
    );

    try {
      const FINAL_PROMPT = AI_PROMPT.replace(
        "{noOfDays}",
        formData.noOfDays
      )
        .replace("{people}", formData.people)
        .replace("{location}", formData.location)
        .replace("{budget}", formData.budget);

      let result;
      const maxRetries = 2;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          result = await chatSession.sendMessage(FINAL_PROMPT);
          break;
        } catch (apiError) {
          const isQuotaError =
            apiError?.message?.includes("quota") ||
            apiError?.message?.includes("429") ||
            apiError?.message?.includes("ResourceExhausted");
          if (isQuotaError && attempt < maxRetries) {
            const waitSec = 15;
            toast(`Rate limit reached. Retrying in ${waitSec} seconds…`);
            await new Promise((r) => setTimeout(r, waitSec * 1000));
          } else {
            throw apiError;
          }
        }
      }
      let responseText = await result?.response?.text();
      if (!responseText) {
        throw new Error("No response from AI");
      }
      // Strip markdown code blocks if the model wrapped JSON in ```json ... ```
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        responseText = jsonMatch[1].trim();
      }
      let responseJSON;
      try {
        responseJSON = JSON.parse(responseText);
      } catch (parseError) {
        console.error("AI response was not valid JSON:", responseText?.slice(0, 200));
        throw new Error("Trip data could not be parsed. Please try again.");
      }

      await saveAiTrip(responseJSON);
    } catch (error) {
      console.error("Error during trip generation:", error);
      toast(error?.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after the API call completes
    }
  };

  const navigate = useNavigate();

  const saveAiTrip = async (TripData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    // ViewTrip expects userSelection.location.label; form stores location as string
    const userSelection = {
      ...formData,
      location: formData.location && typeof formData.location === "string"
        ? { label: formData.location }
        : formData.location,
    };
    await setDoc(doc(db, "AItrip", docId), {
      userSelection,
      tripData: TripData,
      userEmail: user?.email,
      id: docId,
    });
    navigate("/view-trip/" + docId);
  };

  // Handle place selection
  const handlePlaceSelection = (place) => {
    setSelectedPlace(place.description);
    handleInputChanges("location", place.description);
    setPlaceSuggestions([]);
  };

  return (
    <>
      <div className="w-full overflow-hidden px-3 md:px-14 lg:px-14 xl:px-40 font-serif">
        <Card className="mt-6 border-y-4 p-6">
          <CardHeader>
            <CardTitle className="pt-5 text-left text-lg md:text-2xl lg:text-3xl font-bold tracking-wider md:tracking-widest">
              Please share your travel preferences with us🏕️🌴
            </CardTitle>
            <CardDescription className="pt-5 pb-3 text-justify md:text-left font-light text-sm md:text-lg lg:text-xl tracking-tighter md:tracking-widest">
              Simply provide some basic information, and our trip planner will create a personalized itinerary tailored to your preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center">
                <div className="flex flex-col space-y-10">
                  {/* Preferred Destination */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-base md:text-lg">
                      What is your preferred destination?
                    </Label>
                    <div className="relative">
                      <Input
                        id="location"
                        type="text"
                        placeholder="Type to search..."
                        value={selectedPlace}
                        onChange={(e) => {
                          setSelectedPlace(e.target.value);
                          fetchPlaceSuggestions(e.target.value);
                        }}
                        className="border-2 dark:border-customGreen border-blue-700"
                      />
                      {placeSuggestions.length > 0 && (
                        <div className="absolute z-10 bg-black border border-gray-300 mt-2 max-h-60 overflow-auto w-full">
                          {placeSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              onClick={() => handlePlaceSelection(suggestion)}
                              className="p-2 cursor-pointer text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mx-1 transition-colors duration-150"
                            >
                              {suggestion.description} {/* Display description */}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* How Many Days */}
                  <div>
                    <Label htmlFor="days" className="text-base md:text-lg">
                      How many days do you plan to spend on your trip?
                    </Label>
                    <Input
                      id="days"
                      type="number"
                      placeholder="ex. 3"
                      min="1"
                      max="15"
                      value={formData.noOfDays}
                      onChange={(e) =>
                        handleInputChanges("noOfDays", e.target.value)
                      }
                      className="border-2 dark:border-customGreen border-blue-700 bg-white text-slate-800"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <Label htmlFor="budget" className="text-base md:text-lg">
                      What's your spending limit?
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 mt-5 cursor-pointer text-sm md:text-base lg:text-base items-center text-center">
                      {SelectBudgetOptions.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleInputChanges("budget", item.title)}
                          className={`p-1 m-1 md:p-2 md:m-1 border-2 rounded-lg mb-3 hover:shadow-lg dark:border-customGreen border-blue-700 dark:hover:shadow-customGreen hover:shadow-blue-700 ${
                            formData.budget === item.title &&
                            `shadow-lg border-2 dark:shadow-customGreen shadow-blue-700`
                          }`}
                        >
                          <h2 className="font-bold text-md">
                            <span className="text-lg">{item.icon}</span>{" "}
                            {item.title}
                          </h2>
                          <h2 className="text-gray-600 dark:text-gray-400">
                            {item.des}
                          </h2>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Who will you travel with? */}
                  <div>
                    <Label htmlFor="noOfPeople" className="text-base md:text-lg">
                      Who are you planning to travel with on your next adventure?
                    </Label>
                    <div className="grid grid-cols-2 mt-5 cursor-pointer text-[14px] md:text-base lg:text-base items-center text-center">
                      {SelectTravelerList.map((item, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleInputChanges("people", item.people)
                          }
                          className={`p-1 m-1 md:p-4 md:m-3 border-2 mb-2 rounded-lg dark:border-customGreen border-blue-700 hover:shadow-lg dark:hover:shadow-customGreen hover:shadow-blue-700 ${
                            formData.people === item.people &&
                            `shadow-lg border-2 dark:shadow-customGreen shadow-blue-700`
                          }`}
                        >
                          <h2 className="font-bold">
                            <span className="text-xl">{item.icon}</span>{" "}
                            {item.title}
                          </h2>
                          <h2 className="text-gray-600 dark:text-gray-400">
                            {item.des}
                          </h2>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end mt-5">
            <Button
              disabled={loading}
              onClick={onGenerateTrip}
              className="bg-blue-700 hover:bg-indigo-700 dark:text-white hover:shadow-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 md:text-lg"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
              ) : (
                "Generate Trip"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};