import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { IconButton,  Menu, styled } from '@mui/material';
import { InsertEmoticon, AttachFile,  Send, Mic, Delete, Pause, PlayArrow, MicOff } from '@mui/icons-material';
import {  useAppSelector } from '../../redux/store';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Theme } from 'emoji-picker-react';
import { publish, subscribe, unsubscribe } from '../../handlers/reusable/Event';
import { useSocket } from '../../handlers/socket/SocketContext';
import { TextAreaElement } from '../reusable/InputElement';



const StyledMenu = styled(Menu)({
  
  '.MuiList-root': { padding: 0 ,background:'transparent'},
});

const ChatInput= () => {

  const socket = useSocket()
  const dark = useAppSelector((state)=>state.tabs.darkmode)
  const current = useAppSelector((state)=>state.chats.current)
  const user = useAppSelector((state)=>state.auth.user)
  const FileInputRef = useRef<HTMLInputElement | null>(null);
  const [info,setInfo] = useState({index:0,type:"text",text:""})
  const [anchorElEmoji, setAnchorElEmoji] = React.useState<null | HTMLElement>(null);
 

  const HandleSendMessage = useCallback(() =>{
      publish('send-message',{info,_id:user?._id,participantId:current?._id,chatId:current?.chatId})
      // socket?.emit("send-message",{_id:user?._id,chatId:current?.chatId,participantId:current?._id,info:[{...info,time:Date.now()}]})
      setInfo({index:0,type:'text',text:''})
      setAnchorElEmoji(null)
    },[info,setAnchorElEmoji,current,user])
  
  const fileIndexChange = useCallback((event:CustomEvent)=>{setInfo(state=>{return{...state,index:Number(event.detail)}})},[setInfo])


  useEffect(()=>{
    subscribe('file-index-change',fileIndexChange)
    return()=>{
      unsubscribe('file-index-change',fileIndexChange)
    }
    },[fileIndexChange])



  const handleKeyDown = useCallback((event:KeyboardEvent)=>{
    if (!event.shiftKey && event.key=="Enter") {
      HandleSendMessage() 
      setAnchorElEmoji(null)
    }
  },[HandleSendMessage,setAnchorElEmoji])





const handleEmojiClick = useCallback((emojiObject: EmojiClickData) => {
  if (!info.text) {
    publish('send-message',{info:{type:'emoji',text:emojiObject.emoji},_id:user?._id,participantId:current?._id,chatId:current?.chatId})
    setAnchorElEmoji(null)
  }else{
    setInfo(state=>{return{...state,text:state.text+emojiObject.emoji}})
  }
},[setInfo,setAnchorElEmoji,info,current,user])

// handle attach change
const handleAttachChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  
  publish('attachment-changed',files)
  event.target.value = ''
},[])


  useEffect(()=>{

    window.addEventListener("keydown",handleKeyDown)

    return()=>{
      window.removeEventListener("keydown",handleKeyDown)
    }
  },[current,user,info,handleKeyDown])




  const [input, setInput] = useState(true);
  const [mic, setMic] = useState(true);

  const setInputHandler = useCallback((event:CustomEvent) =>{
    setInput(event.detail)
  },[setInput])

  
  const setMicHandler = useCallback((event:CustomEvent) =>{
    setMic(event.detail)
  },[setMic])

  useEffect(()=>{
    subscribe('set-input',setInputHandler)
    subscribe('set-mic',setMicHandler)


    return () =>{
    unsubscribe('set-input',setInputHandler)
    unsubscribe('set-mic',setMicHandler)
    }

  },[setInputHandler,setMicHandler])


  const TypingInputChangeHandler = useCallback((event:ChangeEvent<HTMLTextAreaElement>)=>{
    const val = event.target.value
    if (val) {
      socket?.emit('typing',{_id:user?._id,participantId:current?._id})
    }
    setInfo(state=>{return {...state,text:val}})
  },[setInfo,current,socket,user])




  if(current?.isBlocked || current?.isDeleted){
    return null
  }


 
  
 
  return (
    <>
   

   
    <div className={`w-full flex items-center relative  p-[8px]  bg-light-inputBar dark:bg-dark-inputBar`} >

    {input?
      
      <>
    
    <StyledMenu 
     id="emoji-menu"
     anchorEl={anchorElEmoji}
     open={Boolean(anchorElEmoji)}
     onClose={() => {setAnchorElEmoji(null);}}
     sx={{mt:'-4rem'}}
     MenuListProps={{
       'aria-labelledby': 'emoji-button',
     }}
     transformOrigin={{ horizontal: 'left', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
    >
    
    <EmojiPicker theme={dark?Theme.DARK:Theme.LIGHT} onEmojiClick={handleEmojiClick} />
    
    </StyledMenu>
    
    
    {/* Emoji Icon */}
    <IconButton 
    id="emoji-button"
    aria-controls={anchorElEmoji ? 'emoji-menu' : undefined}
    aria-haspopup="true"
    aria-expanded={anchorElEmoji ? 'true' : undefined}
    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElEmoji(event.currentTarget);
    }}
    >
    <InsertEmoticon  className={dark?"text-white":"text-black"}/>
    </IconButton>
    
    
    <input
    title='file'
    type="file"
    ref={FileInputRef}
    onInput={handleAttachChange}
    className=' hidden'
    multiple
    // accept=".png, .jpg, .jpeg, .mp4, .pdf"
    />
    
    {/* Attachment Icon */}
    <IconButton
    id="attach-button"
    onClick={()=>{FileInputRef.current?.click()}}
    sx={{ color: '#b3b3b3' }}
    >
    <AttachFile />
    </IconButton>
    
    
    {/* Text Input */}

    <TextAreaElement name='texting' placeholder='Type a message' value={info.text} onChange={TypingInputChangeHandler}/>
    
    {!info.text && mic?
    <IconButton 
    onClick={()=>{setInput(false)}}
    sx={{ color: '#b3b3b3' }}>
       <Mic /> 
    </IconButton>
    :
    <IconButton 
    onClick={HandleSendMessage} 
    sx={{ color: '#b3b3b3' }}>
      <Send />
    </IconButton>
    }
    
    </>
 
:

<VoiceMessage />
    
}
    
      
 
    </div>

   
</>
  );
};

export default ChatInput;






export const VoiceMessage= () => {

  const send = useRef(false);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordTime, setRecordTime] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null); 

  const user = useAppSelector(state=>state.auth.user)
  const current = useAppSelector(state=>state.chats.current)
  

    // Start or continue recording audio
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
     
      mediaStreamRef.current = stream; // Store stream reference for stopping later
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data); 
      };

      mediaRecorderRef.current.onstop = () => {
        const combinedBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        if(send.current){
           publish('send-message',{info:{type:'audio',text:'',attach:new Blob(audioChunksRef.current, { type: 'audio/wav' })},_id:user?._id,participantId:current?._id,chatId:current?.chatId})
            publish('set-input',true)
          return;
        }
        setAudioBlob(combinedBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      // Start the timer
      intervalRef.current = setInterval(() => {
        setRecordTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      publish('set-input',true)
      console.error('Error accessing microphone:', error);
    }
  },[current?._id,current?.chatId,user?._id])


  const stopRecording = useCallback(()=>{
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    setIsRecording(false);
  },[])



  useEffect(() => {
    if(!isRecording)
    startRecording();
    return () => {
     stopRecording()
    };
  }, [startRecording,stopRecording,isRecording]);



  const pauseResumeRecording = () => {
    if (!isRecording) {
      startRecording()
    }else{
      stopRecording();
    }
  };


    const HandleSend = async()=>{

       send.current = true;
       stopRecording();
    
    }

    const deleteHandle = () =>{
      stopRecording();
      publish('set-input',true)
    }


    return (
      <div className='flex w-full justify-end'>
         <IconButton onClick={deleteHandle}>
                <Delete />
            </IconButton>
        <div className="flex items-center rounded-lg ">
        
            
            {!isRecording && audioBlob?
              <AudioPlayer2 audioBlob={audioBlob}/>
            :
          <div className='flex'>
            <span className='animate-ping'>•</span><span className="ml-2 text-center animate-pulse "> Recording</span>
          </div>
            }
            <span className="mx-4 text-lg">{new Date(recordTime * 1000).toISOString().substr(14, 5)}</span>
       
            <IconButton onClick={pauseResumeRecording} className="ml-4">
              {!isRecording ? <MicOff color='error'/> : <Pause/>}
            </IconButton>
            <IconButton onClick={HandleSend}>
              <Send/>
            </IconButton>
        </div>
       
      </div>
    );
};




export const AudioPlayer2 = ({ audioBlob,url=undefined,addClasses}: { audioBlob?: Blob,url?:string,addClasses?:string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const sliderRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {

        const audio = new Audio(audioBlob?URL.createObjectURL(audioBlob):url);
        audioRef.current = audio;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            if (sliderRef.current) {
                sliderRef.current.value = audio.currentTime.toString();
            }
        };
        const handleEnded = () => {
          setIsPlaying(false);
          setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        // Cleanup event listeners on component unmount
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioBlob,url]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };


    return (
        <div className={"flex border rounded-3xl py-1 px-3 gap-1 "+addClasses}>
            <button onClick={togglePlayPause}>
                {isPlaying ? <Pause /> : <PlayArrow />}
            </button>
            
            <span>
                {isNaN(currentTime) ? '00:00' : new Date(currentTime * 1000).toISOString().substr(14, 5)}
            </span>
        </div>
    );
};




