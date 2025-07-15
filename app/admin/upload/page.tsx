'use client';
import { useState } from 'react';
import axios from 'axios';

import { signOut } from 'next-auth/react';


export default function UploadPage() {
  const [files, setFiles] = useState<FileList | null>(null);


  const handleUpload = async () => {
    if (!files) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('images', file));

    const res = await axios.post('/api/upload', formData);
    console.log('Uploaded:', res.data);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Upload Images</h2>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFiles(e.target.files)}
      />
      <button onClick={handleUpload} className="mt-2 bg-black text-white px-4 py-2">
        Upload
      </button>
      <button onClick={() => signOut({ callbackUrl: '/' })} className="mt-2 ml-10 bg-black text-white px-4 py-2">
        signout
      </button>
    </div>
  );
}
