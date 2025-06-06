import React from 'react';
import {  Checkbox, Typography } from '@mui/material';
import { MessageMoreIcon } from '../MoreMenu';
import { AppDispatch, useAppSelector } from '../../../redux/store';
import { EachMessageTypes } from '../../../redux/slice/message/mainMessage';
import BlueTick, { GetHighlightedText } from './Reusable';
import { useDispatch } from 'react-redux';
import { AddtoSelectedMessage, RemoveFromSelectedMessage } from '../../../redux/slice/other/select';

const TextMessage: React.FC<{message:EachMessageTypes}> = ({message}) => {
  const dt = new Date(message.time)
  const hr = dt.getHours();
  const min = dt.getMinutes()

  const user = useAppSelector(state=>state.auth.user)
  const selectedMessages = useAppSelector(state=>state.select.messages)
  const query = useAppSelector(state=>state.search.query)
  const sent = user?._id==message.sender

  const selected = selectedMessages.some(ele=>ele._id==message._id)
  const dispatch = useDispatch<AppDispatch>()

  const selectHandler = () =>{
    if (selected) {
      dispatch(RemoveFromSelectedMessage(message))
    }else{
      dispatch(AddtoSelectedMessage(message))
    }
  }

  return (
    <div
    id={message._id}
    onClick={selectedMessages.length>0?selectHandler:undefined}
    className={`flex p-2 my-2 w-full justify-between items-center hover:bg-opacity-30 bg-opacity-20 gap-2  ${selected?'bg-gray-400':selectedMessages.length>0?'hover:bg-gray-200':''} ${sent?" flex-row-reverse":'flex-row'} transition-colors duration-500`}
    >
      <span className={`group flex relative items-center w-fit ${sent?" flex-row":'flex-row-reverse'}`}>

       {selectedMessages.length==0 && <MessageMoreIcon message={message} horizontal={sent?'right':"left"} />}

      <div className={`${sent?"bg-light-chatBubbleOutgoing dark:bg-dark-chatBubbleOutgoing":"bg-light-chatBubbleIncoming dark:bg-dark-chatBubbleIncoming" } text-light-textPrimary dark:text-dark-textPrimary px-[10px] py-[4px] max-w-[300px] shadow-[0_2px_5px_rgba(0,0,0,0.1)] rounded-[8px] flex flex-col`}>

        <Typography variant="body1" className='mb-0 text-[16px] font-medium text-left' >
         {<GetHighlightedText text={message.text}query={query}/>}
        </Typography>

        <span className=" text-[0.6rem] w-full justify-end items-center text-right mt-0 flex gap-1 ">
          <span className='text-[0.6rem] '>{hr+":"+min +(hr<12?" AM":" PM")}</span>
          {sent &&  <BlueTick status={message.status}/> }
        </span>
      </div>
      </span>


    {selectedMessages.length>0 && <Checkbox sx={{height:'fit-content'}} checked={selected}/>}
     
    </div>
  );
};

export default TextMessage;



