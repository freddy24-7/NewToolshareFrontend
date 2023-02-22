import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FILE_UPLOAD_URL } from '../backend-urls/constants';

const usePhotoUploader = () => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setFileIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(FILE_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const photoUrl = response.data.downloadURL;
      setPhotoUrl(photoUrl);
    } catch (error) {
      setFileError(error);
    } finally {
      setFileIsLoading(false);
    }
  };

  const onChange = (event) => {
    const file = event.target.files[0];
    onDrop([file]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const dropzoneStyle = {
    border: isDragActive ? `2px dashed blue` : `2px dashed gray`,
  };

  return {
    file,
    fileError,
    fileIsLoading,
    setPhotoUrl,
    photoUrl,
    getRootProps,
    onDrop,
    getInputProps: (options) => ({
      ...getInputProps({
        ...options,
        onChange,
      }),
    }),
    dropzoneStyle,
  };
};

export default usePhotoUploader;
