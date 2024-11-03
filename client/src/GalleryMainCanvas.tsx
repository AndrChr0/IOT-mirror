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
    <div className='flex justify-center items-center min-h-screen bg-gray-950'>
      <div className='relative border-8 border-white shadow-2xl'>
        <img
          src={generatedArt}
          alt='AI generated image'
          className='max-w-4xl max-h-[95vh] object-contain'
        />
        <div className='bg-black bg-opacity-60 p-6 flex flex-col gap-4 absolute bottom-0 left-1/2 ml-16'>
          <h3 className='text-white text-xl'>{generatedArtStyle}</h3>
          <p className='text-white text-lg'>Generated on: {dateGenerated}</p>
        </div>
      </div>
    </div>
  );
}
