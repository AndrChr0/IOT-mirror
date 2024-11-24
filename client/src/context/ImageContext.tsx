import { useEffect, useState, createContext, useContext } from "react";

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
    imageState: string;
    setImageState: React.Dispatch<React.SetStateAction<string>>;
    DBImages: DBImage[];
    // setDBImages: React.Dispatch<React.SetStateAction<DBImage[]>>;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    fetchLatestArt: () => Promise<void>;
    loading: boolean;
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
    const [imageState, setImageState] = useState<string>("");
    const [DBImages, setDBImages] = useState<DBImage[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isShuffled, setIsShuffled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      // pretend this queries DB :)
      const fetchAiArt = async () => {
        // const data: DBImage[] = [
        //   {
        //     _id: "673a20e35fe3d47bc0c9aa27",
        //     generation_date: "2024-11-17T15:59:00.000Z",
        //     url: "http://localhost:5353/images/1731862586189.png",
        //     art_style: "Surrealism",
        //     art_title: "A Noble Gamer's Retreat in Gjøvik.",
        //     __v: 0
        //   },
        //   {
        //     _id: "673a22135fe3d47bc0c9aa33",
        //     generation_date: "2024-11-17T17:04:00.000Z",
        //     url: "http://localhost:5353/images/1731863048923.png",
        //     art_style: "Surrealism",
        //     art_title: "\"A Glimpse of Creativity from Above in Gjøvik.\"",
        //     __v: 0
        //   },
        //   {
        //     _id: "673a22b35fe3d47bc0c9aa3c",
        //     generation_date: "2024-11-16T23:00:00.000Z",
        //     url: "http://localhost:5353/images/1731863212127.png",
        //     art_style: "Surrealism",
        //     art_title: "Engaging Digital Pursuits in Gjøvik",
        //     __v: 0
        //   },
        //   {
        //     _id: "673a2ed31b110b2d7312ea0f",
        //     generation_date: "2024-11-16T23:00:00.000Z",
        //     url: "http://localhost:5353/images/1731866261859.png",
        //     art_style: "Surrealism",
        //     art_title: "\"Whispers of Imagination: A Journey Through Dreamscapes\"",
        //     __v: 0
        //   },
        //   {
        //     _id: "673a377ebb7ca103f814fc0f",
        //     generation_date: "2024-11-16T23:00:00.000Z",
        //     url: "http://localhost:5353/images/1731868525347.png",
        //     art_style: "Cubism",
        //     art_title: "\"Joy in Motion\"",
        //     __v: 0
        //   }
        // ];
        // populate states with dummy data for testing
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

    useEffect(() => {
      if (!isShuffled && DBImages.length > 0) {
        const shuffledImages = [...DBImages];
        shuffle(shuffledImages);
        setDBImages(shuffledImages);
        setIsShuffled(true);
      }
    }, [DBImages, isShuffled]);

    // Function to shuffle array
    const shuffle = (array: DBImage[]): void => {
      let currentIndex = array.length;

      while (currentIndex != 0) {
        const randomIndex = Math.floor(Math.random()*currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
    }

    // get latest art (singular)
    const fetchLatestArt = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:5353/mirror/new", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        console.log(JSON.stringify(data));

        // idk something like that
        // newList = [...DBImages]
        // insert at 'currentIndex + 2'
        // call setDBImages(newList)

      } catch (error) {
        console.error("Error fetching latest AI art:", error);
      }
    }

    // context value
    const value: ImageContextType = {
        imageState,
        setImageState,
        DBImages,
        // setDBImages,
        currentIndex,
        setCurrentIndex,
        fetchLatestArt,
        loading,
    };


    // other functions
    // change current index
    // ...


    return <ImageContext.Provider value={value}>
        {children}
    </ImageContext.Provider>;
};

