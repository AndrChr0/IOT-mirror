import { useEffect, useState, createContext, useContext } from "react";

interface ImageProviderProps {
    children: React.ReactNode;
}

interface DBImage {
    _id: string;
    generation_date: string;
    url: string;
    art_style: string;
    art_title?: string;
    __v: number;
}

interface ImageContextType {
    imageState: string;
    setImageState: React.Dispatch<React.SetStateAction<string>>;
    DBImages: DBImage[];
    setDBImages: React.Dispatch<React.SetStateAction<DBImage[]>>;
    contextIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
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

    useEffect(() => {
        // populate states with dummy data for testing
        setImageState("khgnfyjrf");
        setDBImages([
            {
              _id: "673a20e35fe3d47bc0c9aa27",
              generation_date: "2024-11-17T15:59:00.000Z",
              url: "http://localhost:5353/images/1731862586189.png",
              art_style: "Surrealism",
              art_title: "A Noble Gamer's Retreat in Gjøvik.",
              __v: 0
            },
            {
              _id: "673a22135fe3d47bc0c9aa33",
              generation_date: "2024-11-17T17:04:00.000Z",
              url: "http://localhost:5353/images/1731863048923.png",
              art_style: "Surrealism",
              art_title: "\"A Glimpse of Creativity from Above in Gjøvik.\"",
              __v: 0
            },
            {
              _id: "673a22b35fe3d47bc0c9aa3c",
              generation_date: "2024-11-16T23:00:00.000Z",
              url: "http://localhost:5353/images/1731863212127.png",
              art_style: "Surrealism",
              art_title: "Engaging Digital Pursuits in Gjøvik",
              __v: 0
            },
            {
              _id: "673a2ed31b110b2d7312ea0f",
              generation_date: "2024-11-16T23:00:00.000Z",
              url: "http://localhost:5353/images/1731866261859.png",
              art_style: "Surrealism",
              art_title: "\"Whispers of Imagination: A Journey Through Dreamscapes\"",
              __v: 0
            },
            {
              _id: "673a377ebb7ca103f814fc0f",
              generation_date: "2024-11-16T23:00:00.000Z",
              url: "http://localhost:5353/images/1731868525347.png",
              art_style: "Cubism",
              art_title: "\"Joy in Motion\"",
              __v: 0
            }
        ]);
        setCurrentIndex(3);
    }, []);

    // context value
    const value: ImageContextType = {
        imageState,
        setImageState,
        DBImages,
        setDBImages,
        contextIndex: currentIndex,
        setCurrentIndex
    };


    // context functions(?)
    // change current index
    // ...


    return <ImageContext.Provider value={value}>
        {children}
    </ImageContext.Provider>;
};

