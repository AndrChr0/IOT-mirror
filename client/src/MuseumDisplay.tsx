import { useEffect, useState } from "react";

interface AiArt {
  generation_date: string;
  url: string;
  art_style: string;
  _id: string;
}

export default function MuseumDisplay() {
  const [aiArtList, setAiArtList] = useState<AiArt[]>([]); // Fetched data
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading

  useEffect(() => {
    // Function to fetch all AI art data from the backend
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching AI art:", error);
        setLoading(false);
      }
    };

    fetchAiArt();
  }, [aiArtList]);

  if (loading) {
    return <p>Loading AI art...</p>;
  }

  return (
    <div>
      <h1>AI Art Museum</h1>
      <div>
        {aiArtList.length > 0 ? (
          aiArtList.map((art) => (
            <div key={art._id}>
              <h3>{art.art_style}</h3>
              <p>
                Generated on:
                {new Date(art.generation_date).toLocaleDateString()}
              </p>
              <img src={art.url} alt={art.art_style} />
            </div>
          ))
        ) : (
          <p>No AI art available</p>
        )}
      </div>
    </div>
  );
}
