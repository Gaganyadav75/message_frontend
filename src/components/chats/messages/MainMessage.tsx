import { Typography } from "@mui/material"
import DeletedMessage from "./DeletedMessage"
import EmojiMessage from "./EmojiMessage"
import FileMessage from "./FileMessage"
import TextMessage from "./TextMessages"
import {  EachMessageTypes, updateScrollIt } from "../../../redux/slice/message/mainMessage"
import { AppDispatch, useAppSelector } from "../../../redux/store"
import { useCallback, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { GetMessagesApiCall } from "../../../redux/slice/message/getMessages"
import  { LoadingSmall } from "../../reusable/Loading"
import { publish} from "../../../handlers/reusable/Event"
import { ArrowDownward, ArrowUpward, Cancel } from "@mui/icons-material"
import SearchContact from "../SearchContact"
import { ChangeSearchCurrent, resetButDontShutSerachComponent, resetSearch, setSearchMessage, setSearchQuery } from "../../../redux/slice/other/search"
import AudioMessage from "./AudioMessage"
import CallMessage from "./CallMessage"





function MainMessage() {



    const allMessageList = useAppSelector(state=>state.messages.list)
    const scrollIt = useAppSelector(state=>state.messages.scrollIt)
     const current = useAppSelector(state=>state.chats.current)

     const currentMessageList = allMessageList.find(ele=>ele.chatId==current?.chatId)


  const messages = currentMessageList?.messages
  const loading = useAppSelector(state=>state.messages.loading)

  const dispatch = useDispatch<AppDispatch>()

     const hasmore = currentMessageList?.hasmore==undefined?true:currentMessageList?.hasmore;
     const last = currentMessageList?.last==undefined?0:currentMessageList.last;

    
     useEffect(() => {
        if (hasmore) {
          dispatch(GetMessagesApiCall({contact:current,limit:20, last:last||0}))
        }
     }, [current,dispatch,hasmore]);


 

  
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const onScrollHandler = useCallback(() => {
      const container = messagesEndRef.current;
      if (container) {
        if (
          container.scrollTop <300 
        ) {
          if (hasmore && last) {
            dispatch(GetMessagesApiCall({contact:current,limit:20, last:last}))
          }
        }
      }
    },[dispatch,current,hasmore,last])
  
    const debounce = (func: (...args: any[]) => void, delay: number) => {
      let timeoutId: any;
      return (...args: any[]) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(...args), delay);
      };
    };
  
    useEffect(() => {
      const container = messagesEndRef.current;
      if (container) {
        const debouncedScroll = debounce(onScrollHandler, 500);
        container.addEventListener("scroll", debouncedScroll);
        // Cleanup on unmount
        return () => {
          container.removeEventListener("scroll", debouncedScroll);
        };
      }
    }, [onScrollHandler]);


 
    const searchedCurrentMessages = useAppSelector(state=>state.search.current)

    useEffect(()=>{
      
      if (searchedCurrentMessages) {
        const scrollDiv = document.getElementById(searchedCurrentMessages._id)
        scrollDiv?.scrollIntoView({ behavior: 'smooth',block: 'center'  });
      }

    },[searchedCurrentMessages])


    useEffect(()=>{
    if (scrollIt && messages ) {
      const scrollDiv = document.getElementById(messages[messages?.length-1]._id)
      scrollDiv?.scrollIntoView({ behavior: 'smooth',block: 'end'  });
      dispatch(updateScrollIt(false))
    }
    },[scrollIt,messages,dispatch])




  return (
    <>
    <div ref={messagesEndRef} id='scrollableDiv'  className='relative scroll-smooth h-full overflow-hidden w-full overflow-y-scroll no-scrollbar' >
    <MessagesSearch messages={messages}/>
  
    <>
    <div className="w-full flex justify-center items-center whitespace-pre-wrap">{loading && <LoadingSmall/>}</div>

        <MessageLister/>
    
    </>
   
    </div>

    </>
  )
}

export default MainMessage







const MessageLister = () =>{

  const current = useAppSelector(state=>state.chats.current)
  const allMessageList = useAppSelector(state=>state.messages.list)
  const currentMessageList = allMessageList.find(ele=>ele.chatId==current?.chatId)
  const messages = currentMessageList?.messages


  const HandleFileClicked = (_id:string) =>{
    const list = messages?.map(mess=>{
      if (["image", "video"].includes(mess.type)) {
        return mess
      } 
      return null
    }).filter(ele=>ele)

    const current= list?.findIndex((value)=>value?._id==_id)
    publish('view-files',{current,list})
  }







  return(
    messages?.map((message,ind) => {
      if (message.type=="info") {
       return <Typography  key={'mess-'+ind} color='gray' variant="body1" align="center">
        <span id={message._id}>{message.text}</span></Typography>
      }
      if(message.type=='call'){
        return <CallMessage key={"mess-"+ind} message={message}/>
      }
      if (message.deleted) {
       return <DeletedMessage key={'mess-'+ind} message={message}/>
      }else
      if (message.type=="emoji") {
       return <EmojiMessage key={'mess-'+ind} message={message}/>
      }else if(message.type=='text'){
       return <TextMessage key={'mess-'+ind} message={message}/>
      }else if(message.type=='audio'){
       return <AudioMessage key={'mess-'+ind} message={message}/>
      }else{
       return <FileMessage key={'mess-'+ind} message={message} handler={HandleFileClicked} />
      }
   
 })
  )
}






export function MessagesSearch({messages}:{messages:EachMessageTypes[]|undefined}) {

  const searchQuery = useAppSelector(state=>state.search.query)

  const search = useAppSelector(state=>state.search.search)

  const list = useAppSelector(state=>state.search.messages)
  const currentIndex = useAppSelector(state=>state.search.currentIndex)


  const dispatch = useDispatch<AppDispatch>()

  const SearchHandler = useCallback(() =>{

    if (searchQuery) {
    const pattern = new RegExp(`${searchQuery}`, 'i');
    const  searchedlist = messages?.filter(ele=>pattern.test(ele.text)).reverse()
    dispatch(setSearchMessage(searchedlist))
    }else{
    dispatch(resetButDontShutSerachComponent())
    }
  },[dispatch,searchQuery,messages])

  useEffect(()=>{
      const timeoutid = setTimeout(SearchHandler,500)

    return() =>{
      clearTimeout(timeoutid)
    }

  },[SearchHandler])

  const Cancelhandler = () =>{
    dispatch(resetSearch())
  }


  const handleUpWard = () =>{
    dispatch(ChangeSearchCurrent(true))
  }
  const handleDownWard = () =>{
    dispatch(ChangeSearchCurrent(false))
  }

  const setSearchQueryHandler = (value:string) =>{
    dispatch(setSearchQuery(value))
  }


  if (!search) {
    return null
  }
 

return (
  <div className='right-0  flex z-50 bg-slate-500 px-4 py-2 fixed gap-2 rounded-bl-md items-center'>
  <SearchContact placeholder="search messages" cancelBtn={false} searchQuery={searchQuery} setSearchQuery={setSearchQueryHandler} searchIcon={false} small={true}/>

  <div className="flex gap-1 px-1 items-center">
    
    <span >
     {list.length>0?currentIndex+1+'/'+ list.length :'0/0'}
    </span>

    
    <button onClick={handleUpWard} title="arrowup" className="p-1 h-fit rounded-md aspect-square hover:bg-gray-600" >
      <ArrowUpward/>
    </button>
    <button title='arrowdown' onClick={handleDownWard} className="p-1 h-fit rounded-md aspect-square hover:bg-gray-600">
      <ArrowDownward/>
    </button>
  </div>


  <button  onClick={Cancelhandler} title="arrowup" className="p-1 h-fit rounded-md aspect-square hover:bg-gray-600" >
    <Cancel/>
  </button>

  </div>
)
}
