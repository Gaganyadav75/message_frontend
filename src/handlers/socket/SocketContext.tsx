import { createContext, ReactNode, useContext, useMemo } from "react"
import { BACKEND_URL } from "../../pages/main/Application"
import  io from "socket.io-client"
import { useAppSelector } from "../../redux/store"



const SocketContext = createContext<null|SocketIOClient.Socket>(null)


export const useSocket = () =>{
    const socket = useContext(SocketContext)
    return socket
}

export const SocketProvider = ({children}:{children:ReactNode}) =>{
    const user = useAppSelector(state=>state.auth.user)
    const socket = useMemo(()=>{
        if(!user){
            socket?.disconnect();
            return null;
        }else
        return io.connect(BACKEND_URL,{query: { _id: user?._id,}})
    },[user])

    
    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}