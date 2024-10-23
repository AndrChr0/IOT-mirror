import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  title?: string;
  confirmText: string;
  declineText: string;
  imgSrc: string;
  openModule: boolean;
  confirmMoodScreenshot: () => void;
  cancelMoodScreenshot: () => void;
}

export default function ImageModule({
  imgSrc,
  openModule,
  confirmMoodScreenshot,
  cancelMoodScreenshot,
  confirmText,
  declineText,
  title,
}: ImageModalProps) {
  const [open, setOpen] = React.useState(openModule);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby={undefined}
        className='sm:max-w-[525px] p-4 !rounded overflow-hidden'
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className='relative'>
          <img src={imgSrc} alt='Mood screenshot' className='w-full h-auto' />
        </div>
        {title && <DialogTitle className='p-0 text-lg'>{title}</DialogTitle>}
        <DialogFooter className='flex p-0 bg-white md:items-center sm:justify-end'>
          <Button
            type='submit'
            className='text-white bg-blue-500 rounded hover:bg-blue-600 selectedTabIndex'
            onClick={() => confirmMoodScreenshot()}
          >
            {confirmText}
          </Button>
          <Button
            tabIndex={1}
            type='button'
            variant='secondary'
            className='rounded selectedTabIndex'
            onClick={() => cancelMoodScreenshot()}
          >
            {declineText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
