import { useState, useEffect, useRef } from "react";
import "./SelectStyle.css";
import { IoClose } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Style, styles } from "./styles";


interface SelectStyleProps {
  onCapturePhoto: () => void;
  onCloseModal: () => void;
  onStyleSelect: (style: Style) => void;
  voiceOptions: boolean;
  onResetVoiceOptions: () => void;
  selectedStyleDrop: Style | null;
  styleDropdownOpen: boolean;
}

const SelectStyle = ({
  onCapturePhoto,
  onCloseModal,
  onStyleSelect,
  voiceOptions,
  onResetVoiceOptions,
  selectedStyleDrop,
  styleDropdownOpen,
}: SelectStyleProps) => {
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(
    selectedStyleDrop
  );

  const [dropdownOpen, setDropdownOpen] = useState(styleDropdownOpen);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelectStyle = (style: Style) => {
    setSelectedStyle(style);
    onStyleSelect(style);
    setDropdownOpen(false);
    console.log("Selected Style:", style.name);
  };

  useEffect(() => {
    setDropdownOpen(styleDropdownOpen);
    console.log("Dropdown Open:", styleDropdownOpen);
  }, [styleDropdownOpen]);

  useEffect(() => {
    setSelectedStyle(selectedStyleDrop);
  }, [selectedStyleDrop]);

  useEffect(() => {
    if (voiceOptions) {
      setDropdownOpen(true);
      onResetVoiceOptions();
    }
  }, [voiceOptions, onResetVoiceOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="select-styles_close-btn">
        <span onClick={onCloseModal}>
          <IoClose size={25} />
        </span>
      </div>
      <div className="artists">
        <div className="relative w-full">
          <h1 className="mb-4 text-2xl">Choose a style</h1>
          <div className="custom-dropdown" ref={dropdownRef}>
            <button
              className="w-full p-2 border rounded"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <div className="flex items-center justify-between w-full"><span>{selectedStyle ? selectedStyle.name : "Select an Art Style"}</span><span><RiArrowDropDownLine size={22} /></span></div>
            </button>
            {dropdownOpen && (
              <ul className="w-full p-2 mt-2 border rounded styleDropdown dropdown-menu">
                {styles.map((style) => (
                  <li
                    key={style.id}
                    className="p-1 cursor-pointer dropdown-item hover:bg-blue-500 hover:text-white"
                    onClick={() => handleSelectStyle(style)}
                  >
                    {style.name}
                  </li>
                ))}
              </ul>
            )}
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
