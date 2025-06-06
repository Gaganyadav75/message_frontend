import { ContactType } from "../../redux/slice/chat/mainChats";

export interface HandleOfferType{
    from:ContactType, 
    chatId:string,
    offer:RTCSessionDescription, 
    video:boolean
}

export interface HandleAnswerType{
    from:ContactType, 
    answer:RTCSessionDescription, 
}

export interface setRemoteStateType{
    audio:boolean, 
    video:boolean, 
}
export interface VideoSteamsType{
  isVideoEnabled:boolean,
  status:{audio:boolean,video:boolean},
  localStream:MediaStream|null,
  remoteVideoStream:MediaStream|null,
}