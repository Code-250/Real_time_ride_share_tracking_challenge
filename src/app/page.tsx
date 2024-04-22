import GoogleMapComponent from "@/components/Map/GoogleMapComponent";
import Indicator from "@/components/Map/Indicator";


export default function Home() {
  return (
    <main>
      <Indicator />
      <GoogleMapComponent />
    </main>
  );
}
