import { ChangeEvent, useState } from "react";


interface inputType {
name:string,
placeholder?:string,
type?:string,
className?:string,
value?:string|number,
onChange?:(event:ChangeEvent<HTMLInputElement>)=>void;
}

export function InputElement({name,placeholder,type="text",className,value,onChange}:inputType) {
  return (
          <input
          id="name"
            name={name}
            type={type}
            placeholder={placeholder}
            className={"w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400  "+className}
            value={value}
            onChange={onChange}
            />
  )
}

interface profileInputType extends inputType {
    disabled?:boolean;
    inputRef?:React.MutableRefObject<HTMLInputElement | null>
}

export function ProfileInputElement({name,placeholder,type="text",className,value,onChange,disabled=false,inputRef}: profileInputType) {
  return (
          <input
          id={name}
          disabled={disabled}
          autoFocus
          ref={inputRef}
            name={name}
            type={type}
            placeholder={placeholder}
            className={"box-border w-full py-2 rounded-md  text-gray-900 focus:outline-none   bg-transparent dark:text-gray-100  "+(!disabled?" focus:ring-2 focus:ring-gray-950 dark:focus:ring-gray-300 ":"focus:ring-0 ")+className}
            value={value}
            onChange={onChange}
            />
  )
}


// FloatingLabelInput.tsx
import React from "react";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?:string;
  className?:string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ label,error,className, ...props }) => {
  const [value, setValue] = useState('');

  const isFloating = value.length > 0;
  return (
    <div className={"relative w-full mb-2 "+className}>
      <input
      autoFocus={!!error}
        {...props}
        onChange={(e) => {setValue(e.target.value); if(props.onChange)props?.onChange(e)}}
        className={"peer h-12 w-full border group focus:border-none focus:ring-0  bg-transparent text-white px-3 py-6 rounded-md placeholder-transparent focus:outline-none z-50 "+(error?"border-red-500 ":"border-light-textPrimary dark:border-dark-textPrimary ")}
      />
     
      <label
        className={" animate-fade-out absolute left-3 text-sm transition-all duration-200 peer-placeholder-shown:-top-3 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm  "+(error?"text-red-500":"text-light-textPrimary dark:text-dark-textPrimary ")+(isFloating?"-top-3":"top-3")}
      >
        {label}
      </label>
       <fieldset className="hidden absolute -top-3 peer-placeholder-shown:blcok peer-placeholder-shown:-top-3 left-0 w-full animate-fade-in peer-focus:flex  text-left h-12 border border-blue-500 rounded-md px-2 py-5 bg-transparent">
      <legend className="opacity-0 text-sm p-0 m-0 px-2" title={label}>
        {label}
      </legend>
      </fieldset>
      {error && <p className="text-red-500 text-left text-sm ml-2">{error}</p>}
    </div>
  );
};




interface TextAreaType {
name:string,
placeholder:string,
className?:string,
value:string|number,
onChange?:(event:ChangeEvent<HTMLTextAreaElement>)=>void;
}

export function TextAreaElement({name,placeholder,className,value,onChange}:TextAreaType) {

  return (
          <textarea
            name={name}
            placeholder={placeholder}
            rows={1}
            className={"no-scrollbar resize-none w-full px-4 py-2 rounded-md borderborder-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400  "+className}
            value={value}
            onChange={onChange}
            />
  )
}
