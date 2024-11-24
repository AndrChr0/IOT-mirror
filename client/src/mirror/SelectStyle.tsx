import { useState, useEffect, useRef } from "react";
import "./SelectStyle.css";
import { Style, styles } from "./styles";
import Processing from "./Processing";

interface SelectStyleProps {
  onCapturePhoto: () => void;
  onCloseModal: () => void;
  onStyleSelect: (style: Style) => void;
  voiceOptions: boolean;
  onResetVoiceOptions: () => void;
  selectedStyleDrop: Style | null;
  styleDropdownOpen: boolean;
  onGoBack: () => void;
  isProcessing: boolean;
}

const SelectStyle = ({
  onCapturePhoto,
  onStyleSelect,
  voiceOptions,
  onResetVoiceOptions,
  selectedStyleDrop,
  styleDropdownOpen,
  onGoBack,
  isProcessing,
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
      <div className='m-0 pb-[40px] pt-[40px]'>
        <div className='artists-content w-[100%] h-full flex flex-wrap justify-center m-0'>
          <div className='relative w-full h-full test'>
            {!selectedStyle && (
              <>
                <div className='card-container h-full pl-[120px] pr-[120px]'>
                  <div className='flex flex-col items-center gap-[80px] pt-[60px] pb-[74px]'>
                    <span className='albert-sans-regular'>
                      see yourself as famous paintings
                    </span>
                    <span className='albert-sans-regular text-5xl text-center flex flex-col gap-[20px]'>
                      <span>SELECT</span> <span>ART STYLE</span>
                    </span>
                  </div>
                  <div className='w-full justify-around gap-[40px] grid grid-cols-2 grid-rows-3'>
                    {styles.map((style) => (
                      <div
                        key={style.id}
                        className='w-[240px] p-1 overflow-hidden cursor-pointer card dropdown-item hover:bg-blue-500 hover:text-white aboreto-regular'
                        onClick={() => handleSelectStyle(style)}
                        tabIndex={1}
                      >
                        <div className='card-img-container'>
                          <img
                            className='scaled-img'
                            src={style.img[0]}
                            alt=''
                          />
                        </div>
                        <span className='pl-[10px]'>{style.name} </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedStyle && !isProcessing && (
              <>
                <div className='selectedStyle pt-[100px] pl-[120px] pr-[120px] w-full'>
                  <div className='selectedStyle-content'>
                    {selectedStyle.img && (
                      <div className='selectedStyle-images'>
                        <div className='carousel-slide h-[192px] '>
                          <img className='' src={selectedStyle.img[0]} alt='' />
                        </div>
                      </div>
                    )}
                    <h2 className='aboreto-big text-center my-[29px]'>
                      {selectedStyle.name}
                    </h2>
                    {selectedStyle.description && (
                      <>
                        <p className='text-[18px]'>
                          {selectedStyle.description}
                        </p>
                      </>
                    )}
                  </div>

                  <div className='w-full'>
                    <h3 className='text-[24px] text-center mb-[16px]'>
                      Characteristics
                    </h3>
                    <div className='flex justify-center gap-[50px]'>
                      {selectedStyle.characteristics && (
                        <>
                          <div className='w-full h-[200px] '>
                            <img
                              className='mx-auto my-0'
                              src='assets/images/icon_characteristics_paint.png'
                              alt=''
                            />
                            <h4 className='font-bold text-center'>
                              {selectedStyle.characteristics[0]}
                            </h4>
                          </div>
                          <div className='w-full h-[200px] '>
                            <img
                              className='mx-auto my-0'
                              src='assets/images/icon_characteristics_fibonacci.png'
                              alt=''
                            />
                            <h4 className='font-bold text-center'>
                              {selectedStyle.characteristics[1]}
                            </h4>
                          </div>
                          <div className='w-full h-[200px] '>
                            <img
                              className='mx-auto my-0'
                              src='assets/images/icon_characteristics_smileys.png'
                              alt=''
                            />
                            <h4 className='font-bold text-center'>
                              {selectedStyle.characteristics[2]}
                            </h4>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className='selectedStyle-buttons '>
                    <button
                      tabIndex={1}
                      onClick={onCapturePhoto}
                      className='selectedTabIndex rounded w-full flex items-center justify-between bg-[#3B6246] border border-[#0F281C] text-[#F0E8D9] text-[20px] px-[12px] py-[8px]'
                    >
                      TAKE PICTURE
                      <img src='assets/icons/camera.png' alt='' />
                    </button>
                    <button
                      tabIndex={1}
                      onClick={onGoBack}
                      className='selectedTabIndex w-full flex items-center justify-around rounded'
                    >
                      <img src='assets/icons/arrow_left.png' alt='' />{" "}
                      <span className='aboreto-regular text-[20px] text-[#7A0B0B] underline'>
                        GO BACK
                      </span>
                    </button>
                  </div>
                  <div>
                    <div>
                      <p className='text-center'>Other peoples AI art</p>
                    </div>
                    <div className='flex gap-[17.5px]'>
                      <div className='w-[90px] h-[90px]'>
                        {" "}
                        <img
                          src='assets/images/ai-1.png'
                          alt='AI generated image'
                        />
                      </div>
                      <div className='w-[90px] h-[90px]'>
                        {" "}
                        <img
                          src='assets/images/ai-2.png'
                          alt='AI generated image'
                        />
                      </div>
                      <div className='w-[90px] h-[90px]'>
                        {" "}
                        <img
                          src='assets/images/ai-3.png'
                          alt='AI generated image'
                        />
                      </div>
                      <div className='w-[90px] h-[90px]'>
                        {" "}
                        <img
                          src='assets/images/ai-4.png'
                          alt='AI generated image'
                        />
                      </div>
                      <div className='w-[90px] h-[90px]'>
                        {" "}
                        <img
                          src='assets/images/ai-5.png'
                          alt='AI generated image'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {isProcessing && selectedStyle && (
              <>
                <div className='selectedStyle pt-[100px] pl-[120px] pr-[120px] w-full '>
                  <div className='w-[150%] pt-[100px]'>
                    <p className='text-center text-[48px] albert-sans-regular'>
                      GENERATING YOUR ART
                    </p>
                    <p className='text-center akatab-regular'>
                      Just a moment, the Ai is generating your image
                    </p>
                  </div>

                  <div>
                    <p className='text-center text-[24px] mb-[30px]'>
                      Known artworks within {selectedStyle.name}
                    </p>
                    <div className='flex gap-[17.5px]'>
                      <figure className='w-[208px] h-[143px] bg-black'>
                        <img className='w-full h-full' src='' alt='' />
                        <figcaption>ydsdsao</figcaption>
                      </figure>
                      <figure className='w-[208px] h-[143px] bg-black'>
                        <img className='w-full h-full' src='' alt='' />
                        <figcaption>ydsdsao</figcaption>
                      </figure>
                      <figure className='w-[208px] h-[143px] bg-black'>
                        <img className='w-full h-full' src='' alt='' />
                        <figcaption>ydsdsao</figcaption>
                      </figure>
                    </div>
                  </div>

                  <div className='relative w-[501px] h-[107px] border-2 border-black'>
                    <div className='absolute p-2 pl-5 ml-[-2px] mt-[-21px] bg-[#F0E8D9] font-bold'>
                      Did you know
                    </div>
                    <div className='absolute w-[50px] h-[62px] ml-[-40px] mt-[-35px]'>
                      <img
                        className='animate-pulse-icon'
                        src='assets/icons/light_bulb.png'
                        alt=''
                      />
                    </div>
                    <div className='py-5 px-8'>
                      {" "}
                      <Processing />{" "}
                    </div>
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
