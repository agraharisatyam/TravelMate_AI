import { GetPlaceDetails } from "@/services/GlobalAPI";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

export const InfoSection = ({ trip }) => {
	const [photoUrls, setPhotoUrls] = useState(['../../../public/travel.jpg']);

	useEffect(() => {
		if (trip) {
			GetPlacePhotos();
		}
	}, [trip]);

	const PHOTO_REF_URL =
		"https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=" +
		'75c6b63bc2mshcf4ccd0d65bf112p177832jsn599da30e6ae6';

	const GetPlacePhotos = async () => {
		const locationLabel =
			trip?.userSelection?.location?.label ?? trip?.userSelection?.location;
		const data = {
			textQuery: locationLabel,
		};

		try {
			const result = await GetPlaceDetails(data);
			const photos = [4, 5, 6, 7, 8, 9].map((index) =>
				PHOTO_REF_URL.replace(
					"{NAME}",
					result.data.places[0].photos[index].name
				)
			);
			setPhotoUrls(photos);
		} catch (error) {
			console.error("Error fetching place details:", error);
		}
	};

	const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: false }));

	return (
		<Card className="my-4 border-x-2 p-5">
			<></>
			<div className="container">
				<Carousel
					plugins={[plugin.current]}
					className="w-full h-full"
					onMouseEnter={plugin.current.stop}
					onMouseLeave={plugin.current.reset}
				>
					<CarouselContent>
						{photoUrls.map((photoUrl, index) => (
							<CarouselItem key={index}>
								<Card>
									<CardContent className="p-1 rounded-2xl">
										<img
											src={
												photoUrl
													? photoUrl
													: "/trip.jpg"
											}
											className="h-48 md:h-[399px] object-fill w-full m-auto rounded-xl"
										/>
									</CardContent>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
			<div>
				<h2 className="font-extrabold text-2xl md:text-4xl mt-2 md:mt-9 lg:mt-14 text-blue-700 dark:text-customGreen">
					🧭 {trip?.userSelection?.location?.label ?? trip?.userSelection?.location} 🧭
				</h2>
				<div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-sm md:text-sm lg:text-base items-center md:flex-row gap-3 lg:gap-5 mt-5 md:mt-9 lg:mt-12 text-center">
					<h2 className="p-2 px-3 bg-blue-700 dark:bg-customGreen rounded-full dark:text-slate-800 text-white font-semibold">
						📅 {trip?.userSelection?.noOfDays} Day 📅
					</h2>
					<h2 className="p-2 px-3 bg-blue-700 dark:bg-customGreen rounded-full dark:text-slate-800 text-white font-semibold">
						💰 {trip?.userSelection?.budget} budget 💰
					</h2>
					<h2 className="p-2 px-3 bg-blue-700 dark:bg-customGreen rounded-full dark:text-slate-800 text-white font-semibold">
						👥 Traveler: {trip?.userSelection?.people} 👥
					</h2>
				</div>
			</div>
		</Card>
	);
};
