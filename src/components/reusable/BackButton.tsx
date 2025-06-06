import { ArrowBack } from "@mui/icons-material"
import { AppDispatch, useAppSelector } from "../../redux/store";
import { ChangeTab } from "../../redux/slice/other/tabs";
import { updateCurrent } from "../../redux/slice/chat/mainChats";
import { useDispatch } from "react-redux";

function BackButton({className}:{className?:string}) {

    const current = useAppSelector(state=>state.chats.current)
    const dispatch = useDispatch<AppDispatch>()

  const handleClick = () =>{
    if(current)
    dispatch(updateCurrent(null));
    dispatch(ChangeTab('chats'))
  }

  return (
    <button onClick={handleClick} className={"transition-all aspect-square duration-700  p-2 rounded-full grid place-items-center text-light-textPrimary dark:text-dark-textPrimary bg-gray-900 dark:bg-gray-300 dark:bg-opacity-0 dark:hover:bg-opacity-30 bg-opacity-0 hover:bg-opacity-30 "+className}>
   
        <ArrowBack className=""/>

    </button>
  )
}

export default BackButton