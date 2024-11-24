interface GalleryMainCanvasProps {
  generatedArt: string;
  generatedArtStyle: string;
  dateGenerated: string;
  artTitle: string;
}
export default function GalleryMainCanvas({
  generatedArt,
  generatedArtStyle,
  dateGenerated,
  artTitle,
}: GalleryMainCanvasProps) {
  return (
    <div className='bg-neutral-200 h-screen w-screen fixed'>
      <div className='flex items-center justify-between w-[98%] mx-auto my-0 pt-3'>
        <img src='./logo-new.png' alt='smArt gallery logo' className='h-16' />
        <p>An interactive art exibition</p>
      </div>
      <div className='flex justify-between items-center pt-16'>
        <img
          src={generatedArt}
          alt='AI generated image'
          className='max-w-4xl max-h-[35vh] object-contain '
        />
        <div className='relative'>
          <img
            src={generatedArt}
            alt='AI generated image'
            className='max-w-4xl max-h-[75vh] object-contain'
          />
          <div className='absolute bottom-0 right-0 translate-x-[16dvw] w-[15dvw]'>
            <h2 className='text-base'>{artTitle}</h2>
            <p className='text-xs'>{generatedArtStyle}</p>
            <p className='text-xs'>{dateGenerated}</p>
          </div>
        </div>

        <img
          src={generatedArt}
          alt='AI generated image'
          className='max-w-4xl max-h-[35vh] object-contain '
        />
      </div>

      <div className='flex flex-col justify-center text-center pt-[4.5dvh]'>
        <p className='text-lg'>Want to create your own?</p>
        <p className='text-lg'>Go find our smArt installation!</p>
      </div>
    </div>
  );
}
