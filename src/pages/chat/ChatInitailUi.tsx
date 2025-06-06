import React from "react";
import { Typography } from "@mui/material";
import BackButton from "../../components/reusable/BackButton";

const ChatInitialUi: React.FC = () => {
    
  return (
    <div className={`flex relative animate-fade-in flex-col h-[100vh] bg-light-chatBg dark:bg-dark-chatBg text-light-textPrimary dark:text-dark-textPrimary`} >
      <BackButton className='md:hidden grid absolute top-3 left-3'/>
    <div className="h-full flex flex-col items-center justify-center text-center ">
      {/* WhatsApp Icon */}
      <span className="w-20 aspect-square">
        <img className="w-full h-full" src="logo.jpeg" alt="logo" />
      </span>

      {/* Title */}
      <Typography variant="h5" fontWeight='bolder'>
      Hii Hello for browser
      </Typography>
      <Typography variant="body1" >
      Stay Connected, Anytime, Anywhere! 
      </Typography>

      {/* Description */}
      <Typography variant="body1" gutterBottom>
      Chat from your computer, tablet, or other devices.
     
      </Typography>

      {/* Footer */}
      <Typography
        variant="caption"
        className="absolute right-5 bottom-2  w-full text-end"
        sx={{ color: "gray" }}
      >
      
        Created by : <a href="https://www.instagram.com/gaganyadav.js" target="_blank" rel="noopener noreferrer"> @gaganyadav.js</a>

      <br />
      Tested by : <a href="https://www.instagram.com/__dishant_07" target="_blank" rel="noopener noreferrer"> @__dishant_07</a>
      
      </Typography>
    </div>
    </div>
  );
};

export default ChatInitialUi;
