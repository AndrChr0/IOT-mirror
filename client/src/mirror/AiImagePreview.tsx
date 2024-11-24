import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
interface AiImagePreviewProps {
  artStyle: string;
  handleImageData: (img: string | null) => void;
  relativeImg: string;
  openModule: boolean;
  artTitle: string;
  runToastSuccess: () => void;
}

export default function AiImagePreview({
  handleImageData,
  artStyle,
  relativeImg,
  artTitle,
  runToastSuccess,
}: AiImagePreviewProps) {
  const handleSubmitArt = async () => {
    // The data object to be sent in the POST request
    const newArtData = {
      generation_date: new Date(),
      url: relativeImg,
      art_style: artStyle,
      art_title: artTitle.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ""),
    };

    try {
      const response = await fetch("http://localhost:5353/mirror", {
        method: "POST", // Make a POST request
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(newArtData), // Convert the data to JSON and send it
      });

      const data = await response.json();

      if (response.status === 201) {
        console.log("AI art created successfully!");
        console.log(data); // The saved AI art object returned from the server
        handleImageData(null);
        runToastSuccess();
      } else {
        console.log("Error creating AI art");
        console.error(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    // <div  className=''>
    <div
      className='flex flex-col relative pt-[20dvh] left-[2dvw] items-center'
      aria-describedby={undefined}
    >
      <h1 className='text-5xl pb-[10dvh] albert-sans-regular'>
        YOUR ART IS GENERATED
      </h1>
      {artTitle && (
        <div className=' flex flex-col justify-center items-center gap-8'>
          <p className='text-xl '>Title of the artwork</p>
          <h2 className='text-5xl aboreto-regular text-center'>
            “{artTitle.toLocaleUpperCase()}”
          </h2>
        </div>
      )}
      <div className='pt-[15dvh]'>
        <div className='w-[30dvw] bg-[#D4BD91] flex flex-col items-center p-4 border border-[#44361C] rounded-[12px]'>
          <div className='mb-[3dvh]'>
            <p className='aboreto-regular text-[24px] mb-[2dvh]'>
              TODAYS GALLERY
            </p>
            <p className='text-[19px]'>
              We want to share your ai generated art to the smArt Gallery. The
              gallery is open to the public for 12 hours.
            </p>
          </div>
          <div className='flex gap-12 flex-row-reverse'>
            <button
              type='submit'
              className='selectedTabIndex rounded w-[12dvw] flex items-center justify-between bg-[#3B6246] border border-[#0F281C] text-[#F0E8D9] text-[20px] px-[12px] py-[8px]'
              onClick={() => handleSubmitArt()}
            >
              <span>SEND TO GALLERY</span>
              <img src='assets/icons/shareArrow.png' alt='' className='' />{" "}
            </button>
            <button
              tabIndex={1}
              type='button'
              className='selectedTabIndex flex items-center w-[10dvw] justify-around text-[20px] text-[#7A0B0B] underline rounded'
              onClick={() => handleImageData(null)}
            >
              <img src='assets/icons/arrow_left.png' alt='' className='' />{" "}
              <span>BACK TO START</span>
            </button>
          </div>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center pt-[5dvh]'>
        <h2 className='text-xl'>Want to see other paintings?</h2>
        <p>more generated artworks are displayed on </p>
        <p>the smArt gallery</p>
      </div>
    </div>
  );
}
