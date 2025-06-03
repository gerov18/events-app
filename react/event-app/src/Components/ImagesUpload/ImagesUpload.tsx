import React, { useState } from 'react';
import {
  useGetEventImagesQuery,
  useUploadEventImagesMutation,
} from '../../api/events/eventApi';

type Props = { eventId: number };

export const ImagesUpload: React.FC<Props> = ({ eventId }) => {
  const [file, setFile] = useState<File | null>(null);
  const { data: images } = useGetEventImagesQuery(eventId);
  const [uploadImage, { isLoading }] = useUploadEventImagesMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please choose file');
    try {
      await uploadImage({ eventId, files: file }).unwrap();
      setFile(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h3>Event Photos:</h3>
      <div className='grid grid-cols-3 gap-4 mb-4'>
        {images?.map(img => (
          <img
            key={img.id}
            src={img.url}
            alt='Event'
            className='w-full h-32 object-cover rounded'
          />
        ))}
      </div>
      <input
        type='file'
        accept='image/*'
        onChange={handleChange}
      />
      <button
        onClick={handleUpload}
        disabled={!file || isLoading}>
        {isLoading ? 'Uploading' : 'Upload'}
      </button>
    </div>
  );
};
