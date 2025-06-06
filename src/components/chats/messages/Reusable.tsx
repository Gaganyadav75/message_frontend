import { Check, DoneAll, Pause, PlayArrow } from '@mui/icons-material';
import React, { useRef, useState } from 'react';

type BlueTickProps = {
    status:'sent'|'unread'|'read'
};

const BlueTick: React.FC<BlueTickProps> = ({status }) => {
    return (
        <>
            {/* Single Tick */}
            {status=='sent' && <Check fontSize='small'/>}
            
            {/* Double Gray Tick */}
            {status=='unread' && (
                <DoneAll fontSize='small'/>
            )}

            {/* Double Blue Tick */}
            {status=='read' &&(
                <DoneAll className="text-[#2563eb]" fontSize='small' />
            )}
        </>
    );
};

export default BlueTick;




export const AudioPlayer = ({ url,addClass}:{url:string,addClass?:string}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
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
     
      <div className={"flex flex-col items-center justify-center rounded-lg shadow-lg "+ addClass}>
        <audio ref={audioRef} src={url} onEnded={()=>{setIsPlaying(false)}}/>
        <div className="flex items-center space-x-4 pb-3">
          <button
          
            onClick={togglePlayPause}
             className={`px-4 py-2 rounded-lg bg-blue-600 focus:outline-none border-2  ${isPlaying && ' border-red-400'}`}
          >
            {isPlaying ? <Pause/> : <PlayArrow/>}
          </button>
        </div>
      </div>
  
  
    );
  };



export const GetHighlightedText = ({text, query}:{text:string,query:string}) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi'); // Case-insensitive matching
  return <>
  {text.split(regex).map((part, index) =>
      regex.test(part) ? (
          <span key={index} className="bg-yellow-200">
              {part}
          </span>
      ) : (
          part
      )
  )}
</>
};

