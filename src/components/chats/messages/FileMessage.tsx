import React from 'react';
import { Checkbox } from '@mui/material';

import { EachMessageTypes } from '../../../redux/slice/message/mainMessage';
import { AppDispatch, useAppSelector } from '../../../redux/store';
import { MessageMoreIcon } from '../MoreMenu';
import BlueTick from './Reusable';
import { useDispatch } from 'react-redux';
import { AddtoSelectedMessage, RemoveFromSelectedMessage } from '../../../redux/slice/other/select';
import { GetHighlightedText } from './Reusable';
import { getFileUrl } from '../../reusable/profileUrl';


interface MessageProps {
 message:EachMessageTypes
  handler?:any
}

const FileMessage: React.FC<MessageProps> = ({message,handler }) => {
  const dt = new Date(message.time)
  const hr = dt.getHours();
  const min = dt.getMinutes()

  const time = hr+":"+min +(hr<12?" AM":" PM")

  const fileUrl = getFileUrl(message.attach,'uploads')

  const user = useAppSelector(state=>state.auth.user)

  const selectedMessages = useAppSelector(state=>state.select.messages)
  const sent = user?._id==message.sender

  const selected = selectedMessages.some(ele=>ele._id==message._id)
  const query = useAppSelector(state=>state.search.query)

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
    className={`flex p-2 w-full my-2 justify-between items-center hover:bg-opacity-30 bg-opacity-20 gap-2  ${selected?'bg-gray-400':selectedMessages.length>0?'hover:bg-gray-200':''} ${sent?" flex-row-reverse":'flex-row'} transition-colors duration-400`}>

      <span className={`group flex relative items-center gap-2 ${sent?" flex-row":'flex-row-reverse'}`}>
      {selectedMessages.length==0 && <MessageMoreIcon message={message} horizontal={sent?'right':"left"} />}


      <div>

    <div className={`${sent?"bg-light-chatBubbleOutgoing dark:bg-dark-chatBubbleOutgoing":"bg-light-chatBubbleIncoming dark:bg-dark-chatBubbleIncoming" } text-light-textPrimary dark:text-dark-textPrimary p-[2px] min-h-fit max-w-[300px] shadow-[0_2px_5px_rgba(0,0,0,0.1)] rounded-[8px] flex flex-col`}>
      <div  onClick={()=>{message.type!='application' && handler(message._id)}}>
     
      {
       message.type=='video'?<video src={fileUrl} title={message.text}/>
      : message.type=='image'?
      <img
      src={fileUrl}
      alt={message.text}
      width={'100%'}
      className='rounded-sm'
      loading='lazy'
      // placeholderSrc={"https://picsum.photos/id/1/500"}
      // effect='opacity'
      />
      : 
      <div className='flex'>
        <img
          src="https://cdn.pixabay.com/photo/2017/03/08/21/21/file-2127833_640.png" alt="" 
          className='w-10 h-10 '
          onClick={(e)=>{e.stopPropagation();e.preventDefault();window.open(fileUrl,"_blank")}}
          />
      </div>
      

      }
    </div>

  { message.text?
    <div className='flex justify-between p-2 relative pb-6'>
      <p className=' break-words text-left inline'>
          {<GetHighlightedText text={message.text} query={query}/>}
      </p>
      <span className=" absolute bottom-1 right-2 text-[0.6rem] items-center text-right mt-0 flex gap-1 ">
        <span >{time}</span>
        {sent &&  <BlueTick status={message.status}/> }
      </span>
  </div>
  :
  <div className='flex justify-between relative'>

  <span className=" absolute bottom-1 right-2 text-[0.6rem] w-fit justify-center items-center text-right mt-0 flex ">
    <span >{time}</span>
    {sent &&  <BlueTick status={message.status}/> }
  </span>
  </div>


}

     
    </div>

    </div>
     
      </span>


 {selectedMessages.length>0 && 
  <Checkbox sx={{height:'fit-content'}} checked={selected}/>
 }

    </div>
  );
};

export default FileMessage;











