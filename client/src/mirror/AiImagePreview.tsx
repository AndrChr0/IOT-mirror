interface AiImagePreviewProps {
  image: string;
  handleImageData: (img: string | null) => void;
}

export default function AiImagePreview({
  image,
  handleImageData,
}: AiImagePreviewProps) {
  return (
    <div className='p-4 bg-white absolute top-0'>
      <div className='h-fit w-96 '>
        {image && <img src={image} alt='image' />}
      </div>
      <div className='flex gap-3'>
        <h3>Send to gallery?</h3>
        <button className='bg-green-700 text-white p-2'>Yes</button>
        <button
          className='bg-red-600 text-white p-2'
          onClick={() => {
            handleImageData(null);
          }}
        >
          No
        </button>
      </div>
    </div>
  );
}
