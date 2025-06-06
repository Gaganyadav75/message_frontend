
import { useAppSelector } from '../../redux/store';

import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from 'react';

const MainMessage = lazy(()=>import('./messages/MainMessage'));
import { publish, subscribe, unsubscribe } from '../../handlers/reusable/Event';
import FilesCarousal from './FilesCarousal';

import { unstable_batchedUpdates } from 'react-dom';
import LoadingComponent from '../reusable/Loading';
import { MessageForwordContactList } from './MoreMenu';
import { Box } from '@mui/material';
import { useSocket } from '../../handlers/socket/SocketContext';


const ChatBody = () => {

    const socket = useSocket()

    const [fileUrls, setFileUrls] = useState<null|{attach:string,type:string}[]>(null);
    const [filesList, setFileList] = useState<null|File[]>(null);

    
  const filePriview = useCallback((event:CustomEvent)=>{
    fileUrls?.forEach(ele=>{
      URL.revokeObjectURL(ele.attach)
    }) 
  {event.detail && 
  unstable_batchedUpdates(()=>{
    setFileUrls(null);
    setFileList(null)
  });
  }

  publish('set-mic',true)
  },[fileUrls])

  

  useEffect(()=>{
      subscribe('close-file-preview',filePriview)
    return()=>{
      unsubscribe('close-file-preview',filePriview)
    }
  },[filePriview])


  const onSwipe = useCallback((swipe:any)=>{
    publish("file-index-change",swipe.activeIndex)
  },[])


      const fileChangeHandler = useCallback((event:CustomEvent<File[]>)=>{
        const files = event.detail
        if (files) {
          setFileList(Array.from(files))
          const urls = Array.from(files).map((value:File)=>{
            return {
            type:value.type.split("/")[0],
            attach:URL.createObjectURL(value)
            }
          })
          setFileUrls(urls)
          publish('set-mic',false)
        }else {
          setFileList(null)
          setFileUrls(null)
          publish('set-mic',true)
    
        }
      },[])
    
    useEffect(()=>{
        subscribe('attachment-changed',fileChangeHandler)
      return()=>{
        unsubscribe('attachment-changed',fileChangeHandler)
      }
    },[fileChangeHandler])
  
   


    

    const [element, setElement] = useState<null|HTMLElement>(null);

    const messbodyref = useRef<HTMLElement | null>(null)

    const foraward = useAppSelector(state=>state.select.forward)

    
    useEffect(()=>{
      if (foraward) {
        setElement(messbodyref.current)
      }else{
        setElement(null)
      }
    },[foraward])
    

    
    const HandleSendMessage = useCallback((event:CustomEvent) =>{
      let size = 0;
      if (event.detail) {
        const inf = event.detail.info
      if (filesList) {
          const info = filesList.map((fl:File,ind:number)=>{
          const type = fl.type.split('/')[0]
          const text = inf.index==ind && inf.text?inf.text:fl.name
          size = size+fl.size;
          return {type,text,attach:fl,name:fl.name,time:Date.now()}
        })
        if (size>(10*1024*1024)) {
          alert('file size exceeds the limit')
        }else{
          socket?.emit('send-message',{...event.detail,info})
        }
        publish('close-file-preview',true)

      }
      else if (inf.type=="audio" && inf.attach) {
          socket?.emit('send-message',{...event.detail,info:[{...event.detail.info,time:Date.now()}]})
      }
      else if (inf.text.replace(/ /g,'') || !inf.attach) {
          socket?.emit('send-message',{...event.detail,info:[{...event.detail.info,time:Date.now()}]})
      }

    }

    },[filesList,socket])


    useEffect(()=>{
      if (!socket)return;
      subscribe('send-message',HandleSendMessage)
    return()=>{
      unsubscribe('send-message',HandleSendMessage)
  
    }
    },[filesList,socket,HandleSendMessage])

     

  




   
    


  return (<>
  

  <Box  ref={messbodyref} id='forwardview'   aria-controls={element ? 'forward-menu' : undefined} className="flex flex-col h-full overflow-hidden no-scrollbar relative ">
    
   <MessageForwordContactList element={element} setElement={setElement}/>


  <div className='flex flex-col w-full h-full relative overflow-scroll no-scrollbar'>
  

      <Suspense fallback={<LoadingComponent/>}>
        <MainMessage/>
        </Suspense>


      {fileUrls && filesList && <FilesCarousal ViewList={fileUrls} onSwipe={onSwipe}  needDialogBox={true}/> } 


  </div>
  


  
  
</Box>

    </>
  );
};

export default memo(ChatBody);







