import React from 'react';
import {  Typography } from '@mui/material';
import {  useAppSelector } from '../../../redux/store';
import { EachMessageTypes } from '../../../redux/slice/message/mainMessage';
import { Call } from '@mui/icons-material';

import { MessageMoreIcon } from '../MoreMenu';

const CallMessage: React.FC<{message:EachMessageTypes}> = ({message}) => {
  const dt = new Date(message.time)
  const hr = dt.getHours();
  const min = dt.getMinutes()

  const user = useAppSelector(state=>state.auth.user)
  const selectedMessages = useAppSelector(state=>state.select.messages)
  const sent = user?._id==message.sender

  return (
    <div
    id={message._id}
    className={`flex p-2 my-2 w-full justify-between items-center hover:bg-opacity-30 bg-opacity-20 gap-2 ${sent?" flex-row-reverse":'flex-row'} transition-colors duration-500`}
    >
      <span className={`group flex items-center w-fit gap-2 ${sent?" flex-row":'flex-row-reverse'}`}>
    {selectedMessages.length==0 && message.sender==user?._id&&<MessageMoreIcon message={message} horizontal={sent?'right':"left"} />}
    <div className={`${sent?"bg-light-chatBubbleOutgoing dark:bg-dark-chatBubbleOutgoing":"bg-light-chatBubbleIncoming dark:bg-dark-chatBubbleIncoming" } text-light-textPrimary dark:text-dark-textPrimary px-[10px] w-fit py-[4px] max-w-[300px] shadow-[0_2px_5px_rgba(0,0,0,0.1)] rounded-[8px] flex `}>
      
        
        <span className='flex justify-center items-center'>
            <Call fontSize='small' color={message.text== "answered"?'success':'error'}/>
        </span>
     
        <div className='flex flex-col'>
        <Typography
          variant="body1"
          sx={{
            marginBottom: "0px",
            fontSize: "12px",
            fontWeight: "500",
            color:message.text!= "answered"?"red":undefined,
            textAlign:"left"
          }}
        >
         {message.text}
        </Typography>

        <span className=" text-[0.6rem] w-full justify-start items-center text-right mt-0 flex gap-1 ">
          <span className='text-[0.6rem] '>{hr+":"+min +(hr<12?" AM":" PM")}</span>
        </span>
        </div>
 
      </div>
      </span>
     

    </div>
  );
};

export default CallMessage;

