
import { AppDispatch, useAppSelector } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { setDarkmode } from '../../redux/slice/other/tabs';
import { ToggleOff, ToggleOn } from '@mui/icons-material';

function DarkModeSwitch() {

     const darkmode = useAppSelector((state)=>state.tabs.darkmode)
    
        const dispatch = useDispatch<AppDispatch>();

  return (
      <span className='absolute top-3 right-3 aspect-square'>
          <button onClick={()=>{dispatch(setDarkmode(!darkmode))}}>
            <span className='text-light-textPrimary dark:text-dark-textPrimary'>
              {!darkmode?<ToggleOff/>:<ToggleOn/>}
            </span>
          </button>
        </span>
  )
}

export default DarkModeSwitch