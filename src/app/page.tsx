"use client"
import { useState, useEffect } from "react";
import GoogleMapComponent from "@/components/Map/GoogleMapComponents";
import Indicator from "@/components/Map/Indicator";
import useFetchDirections from "@/util/useFetchDirections";
import useBusLocation from "@/util/useBusLocation";
import { useDistanceCalculation } from "@/util/useDistanceCalculation";


export default function Home() {
  const waypoints = [{ name: "Nyabugogo", lat: -1.939826787816454, lng: 30.0445426438232 }, { name: "Stop A", lat: -1.9355377074007851, lng: 30.060163829002217 }, { name: "Stop B", lat: -1.9358808342336546, lng: 30.08024820994666 }, { name: "Stop C", lat: -1.9489196023037583, lng: 30.092607828989397 }, { name: "Stop D", lat: -1.9592132952818164, lng: 30.106684061788073 }, { name: "Stop E", lat: -1.9487480402200394, lng: 30.126596781356923 }, { name: "Kimironko", lat: -1.9365670876910166, lng: 30.13020167024439 }]

  const busSpeed = 40;
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1); // Increment elapsed time every second
    }, 1000); // Update elapsed time every second

    return () => clearInterval(interval);
  }, []);
  const { directions, error } = useFetchDirections(waypoints);

  const busLocation = useDistanceCalculation(directions, elapsedTime, busSpeed)

  const { distanceToNextStop, timeToNextStop, nextStopInfo } = useBusLocation(busLocation, waypoints, busSpeed);
  const time = Number(timeToNextStop.toFixed(2)) * 100;
  return (
    <main className="h-[calc(100vh/-/200px)] w-full relative">
      <Indicator distance={distanceToNextStop} time={time} nextStop={nextStopInfo} />
      <GoogleMapComponent waypoints={waypoints} busSpeed={busSpeed} directions={directions} error=" there has been an error" busLocation={busLocation} />
    </main>
  );
}
