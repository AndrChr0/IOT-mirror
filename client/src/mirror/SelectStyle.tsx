import { useState } from "react";
import "./SelectStyle.css";
import { IoClose } from "react-icons/io5";

interface Style {
  id: number;
  name: string;
  img: string;
  description: string;
}

interface SelectStyleProps {
  onCapturePhoto: () => void;
  onCloseModal: () => void;
  onStyleSelect: (style: Style) => void;
}

const styles: Style[] = [
  {
    id: 1,
    name: "Van Gogh",
    img: "https://magazine.artland.com/wp-content/uploads/2022/07/van-gogh-starry-night-min.jpg",
    description:
      "Famous for his expressive brushstrokes and vibrant colors, Van Gogh's style is iconic in Post-Impressionism. His works often depict emotional depth and movement.",
  },
  {
    id: 2,
    name: "Renaissance",
    img: "https://cdn.britannica.com/41/3341-050-825E2B57/The-Creation-of-Adam-ceiling-fresco-Sistine.jpg",
    description:
      "Characterized by a focus on realism, proportion, and humanism, Renaissance art emphasizes detail, perspective, and lifelike representations of figures.",
  },
  {
    id: 3,
    name: "Cubism",
    img: "https://theartiz.ai/wp-content/uploads/2024/06/ec4-scaled.jpg",
    description:
      "An avant-garde movement that fragments objects into geometric shapes, presenting multiple viewpoints simultaneously. Developed by Picasso and Braque.",
  },
  {
    id: 4,
    name: "Surrealism",
    img: "https://media.cnn.com/api/v1/images/stellar/prod/rene-magritte-le-double.jpg?c=original",
    description:
      "A movement that merges the dream world with reality, Surrealism features strange, dreamlike scenes and symbolic imagery that challenges logic.",
  },
  {
    id: 5,
    name: "Baroque",
    img: "https://cdn.thecollector.com/wp-content/uploads/2023/12/important-baroque-paintings.jpg",
    description:
      "Known for its dramatic lighting, intense emotions, and ornate details, Baroque art is characterized by grandeur, movement, and opulence.",
  },
  {
    id: 6,
    name: "Abstract",
    img: "https://www.meisterdrucke.ie/kunstwerke/1260px/fachtali_abderrahim_-_Abstract_painting_silhouette_of_dancing_woman_Printable_digital_Art_-_%28MeisterDrucke-1469538%29.jpg",
    description:
      "Abstract art breaks away from traditional representation, focusing on color, form, and line to create compositions that are non-representational and subjective.",
  },
];

const SelectStyle = ({ onCapturePhoto, onCloseModal, onStyleSelect }: SelectStyleProps) => {
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);

  const handleSelectStyle = (style: Style) => {
    setSelectedStyle(style);
    onStyleSelect(style);
    console.log("Selected Style:", style.name, style);
  };

  return (
    <>
    <div className="select-styles_close-btn"><span onClick={onCloseModal}><IoClose size={25}/></span></div>
      <div className="artists">
        <div className="w-full">
          <h1 className="mb-4 text-2xl ">Choose a style</h1>

          <div className="mb-4">
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                const style = styles.find((s) => s.id === selectedId);
                if (style) handleSelectStyle(style);
              }}
            >
              <option value="" disabled selected>
                Select an Art Style
              </option>
              {styles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>

          {selectedStyle && (
            <div className="p-4 mt-4 border rounded shadow-lg selectedStyle">
              {selectedStyle.img && (
                <img
                  className="mt-2 w-[200px] h-auto"
                  src={selectedStyle.img}
                  alt={selectedStyle.name}
                />
              )}
              {selectedStyle.description && (
                <p className="mt-2 text-[12px]">{selectedStyle.description}</p>
              )}
            </div>
          )}
        </div>
        <div className="w-full">
          <button
            onClick={onCapturePhoto}
            className="w-full p-2 mt-4 text-white transition duration-200 bg-blue-500 rounded hover:bg-blue-700"
          >
            Capture Photo
          </button>
        </div>
      </div>
    </>
  );
};

export default SelectStyle;
