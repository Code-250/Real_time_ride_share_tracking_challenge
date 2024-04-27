import GoogleMapComponent from "@/components/Map/GoogleMapComponent";
import Indicator from "@/components/Map/Indicator";


export default function Home() {
  return (
    <main className="h-[calc(100vh/-/200px)] w-full">
      {/* <Indicator waypoints={[{ name: "Nyabugogo", lat: -1.939826787816454, lng: 30.0445426438232 }, { name: "Stop A", lat: -1.9355377074007851, lng: 30.060163829002217 }, { name: "Stop B", lat: -1.9358808342336546, lng: 30.08024820994666 }, { name: "Stop C", lat: -1.9489196023037583, lng: 30.092607828989397 }, { name: "Stop D", lat: -1.9592132952818164, lng: 30.106684061788073 }, { name: "Stop E", lat: -1.9487480402200394, lng: 30.126596781356923 }, { name: "Kimironko", lat: -1.9365670876910166, lng: 30.13020167024439 }]} busSpeed={40} /> */}
      <GoogleMapComponent waypoints={[{ name: "Nyabugogo", lat: -1.939826787816454, lng: 30.0445426438232 }, { name: "Stop A", lat: -1.9355377074007851, lng: 30.060163829002217 }, { name: "Stop B", lat: -1.9358808342336546, lng: 30.08024820994666 }, { name: "Stop C", lat: -1.9489196023037583, lng: 30.092607828989397 }, { name: "Stop D", lat: -1.9592132952818164, lng: 30.106684061788073 }, { name: "Stop E", lat: -1.9487480402200394, lng: 30.126596781356923 }, { name: "Kimironko", lat: -1.9365670876910166, lng: 30.13020167024439 }]} busSpeed={40} />
    </main>
  );
}
