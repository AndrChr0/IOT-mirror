import { useState, useEffect, useRef } from "react";
import "./SelectStyle.css";
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

  // Refactor
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

    // Refactor
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className='artists w-[50vw] scrollable-element m-0'>
        <div className='artists-content w-[100%] h-full flex gap-5 flex-wrap justify-center pt-4 pb-4 m-0'>
          <div className='flex items-center justify-between w-full px-[24px]'>
            <h1 className='text-2xl'>
              {selectedStyle ? selectedStyle.name : ""}
            </h1>
          </div>

          <div className='relative w-full h-full test'>
          <div className='card-container'>
              {styles.map((style) => (
                <div
                  key={style.id}
                  className='w-[45%] h-[25%] p-1 overflow-hidden cursor-pointer card dropdown-item hover:bg-blue-500 hover:text-white scaled-img-container'
                  onClick={() => handleSelectStyle(style)}
                  tabIndex={1}
                >
                  {style.name}{" "}
                  <div className='card-img-container'>
                    <img className="scaled-img" src={style.img[0]} alt='' />
                  </div>
                </div>
              ))}
            </div>
            {selectedStyle && (
              <>
                <div className='selectedStyle'>
                  <div className='selectedStyle-content'>
                  {selectedStyle.img && (
                    <div className='selectedStyle-images'>
                      <div className="carousel-slide h-[250px] ">
                        
                        {selectedStyle.img.map((src, index) => (
                          <img key={index} className='mr-2 scaled-img' src={src} alt="" />
                        ))}
                        <img className='scaled-img' src={selectedStyle.img[0]} alt="" />
                      </div>
                    </div>
                  )}
                    {selectedStyle.description && (
                      <>
                      <p className='mt-2 '>{selectedStyle.description}</p>
                      <p className='mt-2 mb-[200px] '>Famous fellas: {selectedStyle.famous_artists}</p>
                      </>
                    )}
                  </div>

                    <div className='fixed bottom-4 selectedStyle-buttons z-[1] '>
                    <button
                      tabIndex={1}
                      onClick={onGoBack}
                      className='selectedTabIndex w-[30%] p-2  text-blue-500 bg-white transition duration-200 border border-blue-500 rounded hover:bg-blue-500 hover:text-white flex items-center justify-center gap-[9px]'
                    >
                      <FaArrowLeftLong /> Go Back
                    </button>

                    <button
                      tabIndex={1}
                      onClick={onCapturePhoto}
                      className='w-full p-2 text-white transition duration-200 bg-blue-500 rounded selectedTabIndex hover:bg-blue-700'
                    >
                      Capture Photo
                    </button>
                    </div>
                </div>
              </>
            )}

           
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectStyle;
