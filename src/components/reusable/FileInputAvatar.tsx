import React, { useRef } from 'react';
import { Avatar, IconButton } from '@mui/material';

const AvatarUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    // Simulate a click on the hidden file input when the avatar is clicked
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log("Selected file:", file);
    }
  };

  return (
    <div>
      {/* Avatar wrapped in IconButton for click effect */}
      <IconButton sx={{'&:hover': {backgroundColor:"transparent"},"&:focus":{backgroundColor:"transparent"}}} onClick={handleAvatarClick}>
        <Avatar src="/path/to/default-avatar.jpg" sx={{width:"65px",height:"65px"}}/>
      </IconButton>

      {/* Hidden file input */}
      <input
        title='hi'
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className=' hidden'
        accept="image/*" // Optional: restrict to images only
      />
    </div>
  );
};

export default AvatarUpload;
