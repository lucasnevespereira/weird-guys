import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import mapStyles from "./utils/MapStyles";
import logo from "./assets/logo.png";

const App = () => {
  const libraries = ["places"];
  const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
  };

  const center = {
    lat: 43.653225,
    lng: -79.383186,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
  };

  if (loadError) return "Error loading map";
  if (!isLoaded) return "Loading the map";

  return (
    <div>
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
      ></GoogleMap>
    </div>
  );
};

export default App;
