import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../../redux/store";
import { AddtoSelectedMessage, RemoveFromSelectedMessage } from "../../../redux/slice/other/select";
import { AudioPlayer2 } from "../ChatInput";
import { MessageMoreIcon } from "../MoreMenu";
import { EachMessageTypes } from "../../../redux/slice/message/mainMessage";
import { Checkbox } from "@mui/material";
import { getFileUrl } from "../../reusable/profileUrl";



interface MessageProps {
 message:EachMessageTypes
}
export default function AudioMessage({message }:MessageProps) {


  const fileUrl = getFileUrl(message.attach,'uploads')

  const user = useAppSelector(state=>state.auth.user)

  const selectedMessages = useAppSelector(state=>state.select.messages)
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

    const dt = new Date(message.time)
  const hr = dt.getHours();
  const min = dt.getMinutes()
  
  const time = hr+":"+min +(hr<12?" AM":" PM")

  return (
    <>
      <div 
      id={message._id}
        onClick={selectedMessages.length>0?selectHandler:undefined}
        className={`flex p-2 w-full my-2 justify-between items-center hover:bg-opacity-30 bg-opacity-20 gap-2  ${selected?'bg-gray-400':selectedMessages.length>0?'hover:bg-gray-200':''} ${sent?" flex-row-reverse":'flex-row'} transition-colors duration-400`}>
    
          <span className={`group flex relative items-center gap-2 ${sent?" flex-row":'flex-row-reverse'}`}>
          {selectedMessages.length==0 && <MessageMoreIcon message={message} horizontal={sent?'right':"left"} />}
    
          <div className="relative text-light-textPrimary dark:text-dark-textPrimary">
            <AudioPlayer2 url={fileUrl} addClasses={sent?'py-2 pr-5  bg-light-chatBubbleOutgoing dark:bg-dark-chatBubbleOutgoing ':'bg-light-chatBubbleIncoming dark:bg-dark-chatBubbleIncoming'}/>
            <span className=" absolute bottom-0 right-4 text-[0.6rem] w-fit justify-center items-center text-right mt-0 flex ">
            <span className="absolute bottom-0 right-0 whitespace-nowrap">
              {time}
            </span>
            </span>
            </div>

            </span>

             {selectedMessages.length>0 && 
              <Checkbox sx={{height:'fit-content'}} checked={selected}/>
             }
            </div>
    </>
  )
}
