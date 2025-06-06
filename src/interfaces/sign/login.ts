import { ContactType } from "../../redux/slice/chat/mainChats";

export interface LoginFormDataInterface {
    username: string;
    password: string;
 }
 
export interface ErrorLoginFormDataInterface {
    username?: string;
    password?: string;
 }

 
export interface loginResponseReturn {
    message:string;
    token:string;
    success:boolean;
    user:ContactType;
 }

