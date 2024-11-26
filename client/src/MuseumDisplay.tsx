import { useEffect, useRef } from "react";
import GalleryMainCanvas from "./GalleryMainCanvas";
import { useImage } from "./context/ImageContext";
import { io, Socket } from "socket.io-client";

export default function MuseumDisplay() {
  const { imageState, DBImages, currentIndex, setCurrentIndex, fetchLatestArt, loading, setImageState } = useImage();
  const hasMounted = useRef(false);

  // Update currentIndex every 15 seconds to show next image
  useEffect(() => {
    // Update currentIndex every 15 seconds to show the next image
    const displayInterval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        DBImages.length ? (prevIndex + 1) % DBImages.length : 0
      );
      console.log("Current index: ", currentIndex);
    }, 5 * 1000);

    return () => clearInterval(displayInterval);
  }, [DBImages]); // Ensure this updates when DBImages changes
  
  // useEffect(() => {
  //   if (hasMounted.current) {
  //     const displayInterval = setInterval(() => {
  //       setImageState(true)
  //     }, 15*1000);
  //     return () => clearInterval(displayInterval);
  //   } else {
  //     hasMounted.current = true;
  //   }
  // }, []);
  useEffect(() => {
    const socket = io("http://localhost:3000/gallery");

    socket.on("gallery-update", () => {
      console.log("Gallery updated");
      setImageState((prevState) => !prevState);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  

  // Call function to add newest image to the gallery wall. When uploading a new image, call the setImageState context function to update the gallery
  useEffect(() => {
    fetchLatestArt();
  }, [imageState]);

  if (loading) {
    return <p>Loading AI art...</p>;
  }

  // Find the three images currently displayed
  const currentArt = DBImages[currentIndex];
  const leftImage =
    DBImages[currentIndex == 0 ? DBImages.length - 1 : currentIndex - 1];
  const rightImage =
    DBImages[currentIndex == DBImages.length - 1 ? 0 : currentIndex + 1];

  return (
    <div>
      {currentArt ? (
        <GalleryMainCanvas
          key={currentArt._id}
          artTitle={currentArt.art_title}
          mainGeneratedArt={currentArt.url}
          leftGeneratedArt={leftImage.url}
          rightGeneratedArt={rightImage.url}
          generatedArtStyle={currentArt.art_style}
          dateGenerated={new Date(currentArt.generation_date)
            .toISOString()
            .slice(0, 16)
            .replace("T", " ")
            .replace(/-/g, "/")}
        />
      ) : (
        <p>No AI art available</p>
      )}
    </div>
  );
}
