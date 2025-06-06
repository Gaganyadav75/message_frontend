import { Box, Typography } from "@mui/material";
import { MessageMoreIcon } from "../MoreMenu";
import { EachMessageTypes } from "../../../redux/slice/message/mainMessage";
import { useAppSelector } from "../../../redux/store";


interface MessageProps {
   message:EachMessageTypes
  }
  
  const DeletedMessage: React.FC<MessageProps> = ({message}) => {
    const dt = new Date(message.time)
    const hr = dt.getHours();
    const min = dt.getMinutes()

    const user = useAppSelector(state=>state.auth.user)

    const sent = message.sender == user?._id
  
    return (
      <Box
        display="flex"
        justifyContent={sent ? "flex-end" : "flex-start"}
        marginY={1} 
      >
        <span className={`group flex relative items-center gap-2 ${sent?" flex-row":'flex-row-reverse'}`}>
  
        {sent && <MessageMoreIcon message={message} horizontal={sent?'right':"left"} />}
  
        <div className={`${sent?"bg-light-chatBubbleOutgoing dark:bg-dark-chatBubbleOutgoing":"bg-light-chatBubbleIncoming dark:bg-dark-chatBubbleIncoming" } text-light-textPrimary dark:text-dark-textPrimary px-[10px] py-[4px] max-w-[300px] shadow-[0_2px_5px_rgba(0,0,0,0.1)] rounded-[8px] flex flex-row`}>
          
          <Typography
            variant="body1"
            sx={{
              marginBottom: "0px",
              fontSize: "12px",
              fontWeight: "500",
              textAlign:"left"
            }}
          >
            {message.text} 
            <span className="ml-1 text-[0.5rem] text-right mt-0">
            {hr+":"+min +(hr<12?" AM":" PM")}
          </span>
          </Typography>
  
         
        </div>
        </span>
  
      </Box>
    );
  };
  
  export default DeletedMessage;