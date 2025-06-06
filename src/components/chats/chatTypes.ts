import { Dispatch } from "react"

export interface OnlineOfflineHandlerType{
    chatId:string,
    isOnline:boolean
}

export interface MessageForwardContactListType{
    element:HTMLElement|null,
    setElement:Dispatch<React.SetStateAction<HTMLElement | null>>
}