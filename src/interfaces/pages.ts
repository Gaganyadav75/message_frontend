import { EachMessageTypes } from "../redux/slice/message/mainMessage"

export interface newMessageHandlerType{
    info:EachMessageTypes[],
    chatId:string,
    sender:string
}

export interface MessageFileReceiveHandlerType{
    chatId:string,
    messageId:string,
    attach:string
}

export interface DeleteMessageHandlerType{
    chatId:string,
    messageId:string,
}
export interface SocketErrorHandlerType{
    type:string,
    message:string,
}
