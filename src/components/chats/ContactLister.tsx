
import { ContactType } from "../../redux/slice/chat/mainChats"
import { Checkbox, ListItemButton, Typography } from "@mui/material"
import StyledAvatar from "../reusable/StyledAvatar"
import { getFileUrl } from "../reusable/profileUrl"
import { publish } from "../../handlers/reusable/Event"



type ListMapType = {list:ContactType[],handler:Function,current?:ContactType|null,checkbox?:boolean,checkedList?:ContactType[]|null}

export const ContactLister = ({list,handler,current=null,checkbox=false,checkedList}:ListMapType)=>{


    if (list.length==0) {
      return (
        <>
          <div className="flex flex-col items-center justify-center text-center p-6 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405M15 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm-4.25-2.25H4.75a.75.75 0 01-.75-.75V6.75a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75V9M4.75 4.5h14.5M4.75 19.5h14.5" />
            </svg>
            <p className="text-lg font-medium">No Contacts Found</p>
            <p className="text-sm mt-1">We couldn’t find anyone matching your search.</p>
          </div>
        </>
      )
    }

        const handleProfileClick = (profile:string)=>{
          const fl = {attach:getFileUrl(profile,'profiles')|| "https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg",type:'image'}
          publish("view-files",{list:[fl],current:0})
        }
    

  return list.map((user, index) => (
    <div  key={'contact-'+index}>
    <ListItemButton  selected={current?._id==user._id}  className='flex gap-2' 
    onClick={()=>{handler(user)}}>
    
      <span className="hover:scale-110" onClick={(e)=>{e.stopPropagation(); handleProfileClick(user.profile)}}>
        <StyledAvatar src={getFileUrl(user?.profile,'profiles') || "/static/images/avatar/1.jpg"} alt={user.username||""} isOnline={user.isOnline}/>
      </span>
      

      <div className='flex justify-between relative w-full gap-1'>
        <div className='flex flex-col p-0 text-left'>

          <Typography fontWeight={"bolder"} variant="subtitle1">{user?.username}</Typography>
          <Typography variant="caption" align='left'>{user.bio||"hey how's going!"}</Typography>

        </div>

        {checkbox?
        <Checkbox sx={{height:'fit-content'}} checked={checkedList?.some(ele=>ele.chatId==user.chatId)}/>
        :user.unreadCount && user.unreadCount>0?  
        <span className='absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-red-400 aspect-square w-6 text-center'>
          {user.unreadCount}
        </span>
        :null
        }
     

      </div>

    </ListItemButton>
    </div>
  ))
}
