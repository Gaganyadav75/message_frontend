import React from 'react';
import {  Checkbox } from '@mui/material';
import { EachMessageTypes } from '../../../redux/slice/message/mainMessage';
import { AppDispatch, useAppSelector } from '../../../redux/store';
import { MessageMoreIcon } from '../MoreMenu';
import { useDispatch } from 'react-redux';
import { AddtoSelectedMessage, RemoveFromSelectedMessage } from '../../../redux/slice/other/select';

interface MessageProps {
  message:EachMessageTypes
}

const EmojiMessage: React.FC<MessageProps> = ({message}) => {
  const dt = new Date(message.time)
  const hr = dt.getHours();
  const min = dt.getMinutes()

  const user = useAppSelector(state=>state.auth.user)

  const sent = message.sender == user?._id

  const selectedMessages = useAppSelector(state=>state.select.messages)

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
    className={`flex p-2 w-full my-2 justify-between items-center hover:bg-opacity-30 bg-opacity-20 gap-2  ${selected?' bg-transparent ':selectedMessages.length>0?'hover:bg-gray-200':''} ${sent?" flex-row-reverse":'flex-row'} transition-colors duration-400`}>

      <span className={`group flex relative items-center gap-2 ${sent?" flex-row":'flex-row-reverse'}`}>

      {sent && <MessageMoreIcon message={message} horizontal={sent?'right':"left"} />}

        <div className={` bg-transparent  text-light-textPrimary dark:text-dark-textPrimary px-[8px] max-w-[300px] rounded-[8px] flex flex-col`}>
        <h1 className='text-5xl p-1'>{message.text}</h1>
    
    
        <span className="text-[0.6rem] text-[#666] text-right mt-0">
          {hr+":"+min +(hr<12?" AM":" PM")}
        </span>
      </div>
      </span>
    {selectedMessages.length>0 && <Checkbox sx={{height:'fit-content'}} checked={selected}/>}
    </div>
  );
};

export default EmojiMessage;

