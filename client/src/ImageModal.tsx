import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  //   DialogTrigger,
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
      {/* <DialogTrigger asChild>
        <Button variant='outline'>Open Mood Screenshot</Button>
      </DialogTrigger> */}
      <DialogContent className='sm:max-w-[425px] p-0 overflow-hidden' onInteractOutside={(event) => event.preventDefault()}>
        <div className='relative'>
          <img src={imgSrc} alt='Mood screenshot' className='w-full h-auto' />
          {/* <svg
            className='absolute w-16 h-16 text-yellow-400 top-4 left-4'
            viewBox='0 0 24 24'
            fill='currentColor'
          >
            <path d='M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z' />
          </svg>
          <svg
            className='absolute w-16 h-16 text-purple-400 top-4 right-4'
            viewBox='0 0 24 24'
            fill='currentColor'
          >
            <path d='M10.5,7h3c0.28,0,0.5-0.22,0.5-0.5v-2C14,3.67,13.33,3,12.5,3h-1C10.67,3,10,3.67,10,4.5v2C10,6.78,10.22,7,10.5,7z M16.77,8.61c-0.29-0.29-0.77-0.29-1.06,0l-2.12,2.12l-2.12-2.12c-0.29-0.29-0.77-0.29-1.06,0s-0.29,0.77,0,1.06L12.53,12 l-2.12,2.12c-0.29,0.29-0.29,0.77,0,1.06c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22l2.12-2.12l2.12,2.12 c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22c0.29-0.29,0.29-0.77,0-1.06L14.65,12l2.12-2.12 C17.06,9.39,17.06,8.9,16.77,8.61z M21,14c0-0.55-0.45-1-1-1h-2c-0.55,0-1,0.45-1,1s0.45,1,1,1h2C20.55,15,21,14.55,21,14z M3,13 c-0.55,0-1,0.45-1,1s0.45,1,1,1h2c0.55,0,1-0.45,1-1s-0.45-1-1-1H3z M13,19c0-0.55-0.45-1-1-1s-1,0.45-1,1v2c0,0.55,0.45,1,1,1 s1-0.45,1-1V19z' />
          </svg> */}
        </div>
        <DialogFooter className='p-4 bg-white sm:justify-start'>
          {title && <h2 className='text-lg '>{title}</h2>}
          <Button
            type='submit'
            className='text-white bg-blue-500 hover:bg-blue-600'
            onClick={() => confirmMoodScreenshot()}
          >
            {confirmText}
          </Button>
          <Button
            type='button'
            variant='secondary'
            onClick={() => cancelMoodScreenshot()}
          >
            {declineText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
