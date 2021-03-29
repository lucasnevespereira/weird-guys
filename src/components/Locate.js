import React from "react";

const Locate = ({ moveTo }) => {
  return (
    <button
      className="location"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            moveTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {}
        );
      }}
    >
      <img src="location.svg" alt="locate-me" />
    </button>
  );
};

export default Locate;
