import React, { Dispatch, SetStateAction } from 'react';
import {  IconButton } from '@mui/material';
import { Close} from '@mui/icons-material';
import {InputElement} from '../reusable/InputElement';

type Props = { searchQuery: string ,setSearchQuery:Dispatch<SetStateAction<string>>|Function,searchIcon?:boolean,small?:boolean,placeholder?:string,cancelBtn?:boolean}

const SearchContact: React.FC<Props> = ({searchQuery, setSearchQuery,small=false,placeholder}) => {


  return (
    <div className='w-full flex items-center p-[2px_4px] relative' >
       
        

 <InputElement name='search-contact' type='text' placeholder={placeholder||"Search contacts"} value={searchQuery} onChange={(event) =>{setSearchQuery(event.target.value)}} className=' border'/>


         {searchQuery &&
         <span  className='absolute right-1 top-1/2 -translate-y-1/2'>
          <IconButton className={`${small?'p-0 ':' '} `} onClick={()=>{setSearchQuery("")}}>
            <Close fontSize={small? 'small':undefined} />
          </IconButton>
          </span>
         }
        
      </div>
  );
};

export default SearchContact;

