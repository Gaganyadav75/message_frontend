import { ChangeEvent, Dispatch } from "react";


export const InputChangeHandler = (setFormData:Dispatch<any>)=>{
    return (event:ChangeEvent<HTMLInputElement>)=>{
        const ele= event.target as HTMLInputElement;
        setFormData((state:any)=>{
         return {...state,[ele.name]:ele.value}
        })
    }
 }
