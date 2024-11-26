import { useEffect, useState, createContext, useContext, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface ImageProviderProps {
    children: React.ReactNode;
}

interface DBImage {
    _id: string;
    generation_date: string;
    url: string;
    art_style: string;
    art_title: string;
}

interface ImageContextType {
    imageState: boolean;
    // setImageState: React.Dispatch<React.SetStateAction<boolean>>;
    DBImages: DBImage[];
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    fetchLatestArt: () => Promise<void>;
    loading: boolean;
    newArtUploaded: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImage = (): ImageContextType => {
    const context = useContext(ImageContext);
    if (!context) {
        throw new Error("useImage must be used within an ImageProvider");
    }
    return context;
};

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
    // context states
    const [imageState, setImageState] = useState<boolean>(false);
    const [DBImages, setDBImages] = useState<DBImage[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const socketRef = useRef<Socket | null>(null);

    // Only queries DB once when the gallery wall is opened
    useEffect(() => {
      const fetchAiArt = async () => {
        try {
          const response = await fetch("http://localhost:5353/mirror", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();

          setDBImages(data);

          setLoading(false);
        } catch (error) {
          console.error("Error fetching AI art:", error);
        }
      };

      fetchAiArt();
    }, []);

    // Get latest art (singular)
    const fetchLatestArt = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:5353/mirror/new", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const newImage = await response.json();
    
        // Append the new image to the existing gallery
        setDBImages((prevDBImages) => {
          const exists = prevDBImages.some((img) => img._id === newImage._id);
          if (exists) return prevDBImages;
        
          const insertIndex = (currentIndex + 2) % (prevDBImages.length + 1);

          const updatedDBImages = [...prevDBImages];
          updatedDBImages.splice(insertIndex, 0, newImage); // Insert at next index

          return updatedDBImages;
        });
        
        
    
      } catch (error) {
        console.error("Error fetching latest AI art:", error);
      }
    };
    
    useEffect(() => {
      socketRef.current = io("http://localhost:3000/gallery");

      if (socketRef.current) {
        socketRef.current.on("new-image", () => {
          fetchLatestArt();
        });
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.off("new-image");
        }
      }
    }, [fetchLatestArt]);

    const newArtUploaded = (): void => {
      const newState = !imageState;
      setImageState(newState);
      localStorage.setItem("imageStateUpdated", JSON.stringify(newState));
    };

    // context value
    const value: ImageContextType = {
        imageState,
        // setImageState,
        DBImages,
        currentIndex,
        setCurrentIndex,
        fetchLatestArt,
        loading,
        newArtUploaded,
    };

    return <ImageContext.Provider value={value}>
        {children}
    </ImageContext.Provider>;
};

