import { useEffect, useState, useRef } from "react";
import GalleryMainCanvas from "./GalleryMainCanvas";

interface AiArt {
  generation_date: string;
  url: string;
  art_style: string;
  _id: string;
}

export default function MuseumDisplay() {
  const [aiArtList, setAiArtList] = useState<AiArt[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const prevDataLengthRef = useRef<number>(0);

  // Function to fetch AI art data
  const fetchAiArt = async () => {
    try {
      const response = await fetch("http://localhost:5353/mirror", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      setAiArtList(data);

      if (data.length > prevDataLengthRef.current) {
        // New entry added; show it first
        setCurrentIndex(data.length - 1);
      }

      prevDataLengthRef.current = data.length;
      setLoading(false);
    } catch (error) {
      console.error("Error fetching AI art:", error);
      setLoading(false);
    }
  };

  // Fetch data on component mount and set up interval
  useEffect(() => {
    fetchAiArt();
    const fetchInterval = setInterval(fetchAiArt, 15000); // Fetch every 15 seconds
    return () => clearInterval(fetchInterval);
  }, []);

  // Update currentIndex every 15 seconds to show next image
  useEffect(() => {
    const displayInterval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        aiArtList.length ? (prevIndex + 1) % aiArtList.length : 0
      );
    }, 12000);
    return () => clearInterval(displayInterval);
  }, [aiArtList]);

  if (loading) {
    return <p>Loading AI art...</p>;
  }

  const currentArt = aiArtList[currentIndex];

  return (
    <div>
      {currentArt ? (
        <GalleryMainCanvas
          key={currentArt._id}
          generatedArt={currentArt.url}
          generatedArtStyle={currentArt.art_style}
          dateGenerated={new Date(
            currentArt.generation_date
          ).toLocaleDateString()}
        />
      ) : (
        <p>No AI art available</p>
      )}
    </div>
  );
}
