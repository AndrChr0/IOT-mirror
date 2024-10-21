import { useState, useEffect, useRef } from "react";
import "./SelectStyle.css";
import { IoClose } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Style, styles } from "./styles";

interface SelectStyleProps {
  onCapturePhoto: () => void;
  onCloseModal: () => void;
  onStyleSelect: (style: Style) => void;
  voiceOptions: boolean;
  onResetVoiceOptions: () => void;
  selectedStyleDrop: Style | null;
  styleDropdownOpen: boolean;
  onGoBack: () => void;
}

const SelectStyle = ({
  onCapturePhoto,
  onCloseModal,
  onStyleSelect,
  voiceOptions,
  onResetVoiceOptions,
  selectedStyleDrop,
  styleDropdownOpen,
  onGoBack,
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
      <div className="artists">
        <div className="artists-content">

        <div className="flex items-center justify-between w-full px-[24px]">
            <h1 className="text-2xl">{selectedStyle ? selectedStyle.name : 'Choose a style'}</h1>
            <div className="select-styles_close-btn">
            <span tabIndex={1} className="selectedTabIndex" onClick={onCloseModal}>
              <IoClose size={25} />
            </span>
          </div>
            </div>
          
          <div className="relative w-full h-full test">
            {selectedStyle && (
              <>
                <div className="selectedStyle">
                  <div className="selectedStyle-content">
                    {selectedStyle.img && (
                      <img
                        className="mt-2 w-[300px] h-auto"
                        src={selectedStyle.img}
                        alt={selectedStyle.name}
                      />
                    )}
                    {selectedStyle.description && (
                      <p className="mt-2 ">{selectedStyle.description}</p>
                    )}
                  </div>

                  <div className="selectedStyle-buttons">
                    <button
                    tabIndex={1}
                      onClick={onGoBack}
                      className="selectedTabIndex w-[20%] p-2 mt-4 text-blue-500 transition duration-200 border border-blue-500 rounded hover:bg-blue-500 hover:text-white flex items-center justify-center gap-[9px]"
                    >
                      <FaArrowLeftLong /> Go Back
                    </button>

                    <button
                    tabIndex={1}
                      onClick={onCapturePhoto}
                      className="w-full p-2 mt-4 text-white transition duration-200 bg-blue-500 rounded selectedTabIndex hover:bg-blue-700"
                    >
                      Capture Photo
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="card-container">
              {styles.map((style) => (
                <div
                  key={style.id}
                  className="p-1 cursor-pointer card dropdown-item hover:bg-blue-500 hover:text-white"
                  onClick={() => handleSelectStyle(style)}
                  tabIndex={1}
                >
                  {style.name}{" "}
                  <div className="card-img-container">
                    <img src={style.img} alt="" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectStyle;
