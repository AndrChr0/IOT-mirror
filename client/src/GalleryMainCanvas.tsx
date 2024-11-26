interface GalleryMainCanvasProps {
  mainGeneratedArt: string;
  leftGeneratedArt: string;
  rightGeneratedArt: string;
  generatedArtStyle: string;
  dateGenerated: string;
  artTitle: string;
}
export default function GalleryMainCanvas({
  mainGeneratedArt,
  leftGeneratedArt,
  rightGeneratedArt,
  generatedArtStyle,
  dateGenerated,
  artTitle,
}: GalleryMainCanvasProps) {
  return (
    <div className='fixed w-screen h-screen bg-[#F0E8D9]'>
      <div className='flex items-center justify-between w-[98%] mx-auto my-0 pt-3'>
        <img src='./logo-new.png' alt='smArt gallery logo' className='h-16' />
        <p>An Interactive Art Exhibition</p>
      </div>
      <div className='flex items-center justify-between pt-16'>
        <img
          src={leftGeneratedArt}
          alt='AI generated image'
          className='max-w-4xl max-h-[35vh] object-contain '
        />
        <div className='relative'>
          <img
            src={mainGeneratedArt}
            alt='AI generated image'
            className='max-w-4xl max-h-[75vh] object-contain'
          />
          <div className='pt-2'>
            <h2 className='text-base'>{artTitle}</h2>
            <p className='text-xs'>{generatedArtStyle}</p>
            <p className='text-xs'>{dateGenerated}</p>
          </div>
        </div>

        <img
          src={rightGeneratedArt}
          alt='AI generated image'
          className='max-w-4xl max-h-[35vh] object-contain '
        />
      </div>

      <div className='flex flex-col justify-center text-center pt-[.5dvh]'>
        <p className='text-lg'>Want to create your own?</p>
        <p className='text-lg'>Go find our smArt installation!</p>
      </div>
    </div>
  );
}
