import React from "react";
import Search from "./components/Search";
import Locate from "./components/Locate";
import { formatRelative } from "date-fns";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import mapStyles from "./utils/MapStyles";
import logo from "./assets/logo.png";

import { db } from "./services/firebase";
import { findByTitle } from "@testing-library/dom";

const App = () => {
  const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
  };

  const libraries = ["places"];

  const center = {
    lat: 48.8534,
    lng: 2.3488,
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

  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const udpateData = () => {
    db.collection("reports")
      .get()
      .then((snapshot) => {
        const fetchedData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedData.push(data);
        });
        setMarkers(fetchedData);
      })
      .catch((error) => console.log(error));
  };

  const onMapClick = React.useCallback((event) => {
    db.collection("reports")
      .add({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date().toISOString(),
      })
      .then((doc) => {
        console.log("Report added with ID: ", doc.id);
        doc.update({ id: doc.id });
        udpateData();
      })
      .catch((error) => {
        console.error("Error adding report: ", error);
      });
  }, []);

  React.useEffect(() => {
    udpateData();
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const moveMapTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  if (loadError) return "Error loading map";
  if (!isLoaded) return "Loading the map";

  return (
    <div>
      <div className="logo">
        <img src={logo} alt="logo" />
        <Search moveTo={moveMapTo} />
      </div>
      <Locate moveTo={moveMapTo} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{
              lat: marker.lat,
              lng: marker.lng,
            }}
            icon={{
              url: "/burglar.svg",
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{
              lat: selected.lat,
              lng: selected.lng,
            }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>Weird guy here!</h2>
              <p>
                Reported {formatRelative(new Date(selected.time), new Date())}
              </p>

              <button
                className="cancel"
                onClick={() => {
                  db.collection("reports").doc(selected.id).delete();
                  console.log("Deleted report with id: ", selected.id);
                  udpateData();
                }}
              >
                Cancel report
              </button>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
};

export default App;
