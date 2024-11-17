interface GalleryMainCanvasProps {
  generatedArt: string;
  generatedArtStyle: string;
  dateGenerated: string;
}
export default function GalleryMainCanvas({
  generatedArt,
  generatedArtStyle,
  dateGenerated,
}: GalleryMainCanvasProps) {
  return (
    <div className='bg-neutral-200 h-screen'>
      <div className='flex items-center justify-between w-[98%] mx-auto my-0 pt-3'>
        <img
          src='./smart-gallery-logo.png'
          alt='smArt gallery logo'
          className='h-16'
        />
        <p>see yourself as famous paintings</p>
      </div>
      <div className='flex justify-between items-center pt-10'>
        <img
          src={generatedArt}
          alt='AI generated image'
          className='max-w-4xl max-h-[45vh] object-contain relative right-[14%]'
        />
        <div className='flex flex-col '>
          <img
            src={generatedArt}
            alt='AI generated image'
            className='max-w-4xl max-h-[70vh] object-contain '
          />
          <div className=''>
            <h3 className='text-xs'>{generatedArtStyle}</h3>
            <p className='text-xs'>Date: {dateGenerated}</p>
          </div>
        </div>

        <img
          src={generatedArt}
          alt='AI generated image'
          className='max-w-4xl max-h-[45vh] object-contain relative left-[14%]'
        />
      </div>

      <div className='flex flex-col justify-center text-center pt-2'>
        <h2 className='text-lg'>Want to create your own?</h2>
        <p>more generated artworks are displayed on the smart gallery</p>
      </div>
    </div>
  );
}
