import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
interface AiImagePreviewProps {
  absoluteImage: string;
  artStyle: string;
  handleImageData: (img: string | null) => void;
  relativeImg: string;
  title: string;
  openModule: boolean;
  artTitle: string;
}

export default function AiImagePreview({
  absoluteImage,
  handleImageData,
  artStyle,
  relativeImg,
  title,
  openModule,
  artTitle,
}: AiImagePreviewProps) {
  const [open, setOpen] = useState(openModule);

  console.log("preview Image url:", absoluteImage);

  const handleSubmitArt = async () => {
    // The data object to be sent in the POST request
    // data format = dd.mm.yyyy hr:min
    console.log(new Date().toDateString());

    const newArtData = {
      generation_date: new Date().toDateString(),
      url: relativeImg,
      art_style: artStyle,
      art_title: artTitle,
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
      } else {
        console.log("Error creating AI art");
        console.error(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby={undefined}
        className='sm:max-w-[525px] p-4 !rounded overflow-hidden'
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className='relative'>
          <img src={absoluteImage} alt='AI image' className='w-full h-auto' />
        </div>
        {title && <DialogTitle className='p-0 text-lg'>{title}</DialogTitle>}
        <DialogFooter className='flex p-0 bg-white md:items-center sm:justify-end'>
          <Button
            type='submit'
            className='text-white bg-blue-500 rounded hover:bg-blue-600 selectedTabIndex'
            onClick={() => handleSubmitArt()}
          >
            Send to gallery
          </Button>
          <Button
            tabIndex={1}
            type='button'
            variant='secondary'
            className='rounded selectedTabIndex'
            onClick={() => handleImageData(null)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
