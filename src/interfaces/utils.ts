import { ContactType } from "../redux/slice/chat/mainChats";


export interface SignUpReturnInterface {
    user: ContactType;
    token: string;
    success: boolean;
    message: string;
    custom: boolean | undefined;
 }