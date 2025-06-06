import { Avatar, IconButton } from '@mui/material';
import { ChangeTab } from '../../redux/slice/other/tabs';
import { getFileUrl } from '../reusable/profileUrl';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { updateScrollIt } from '../../redux/slice/message/mainMessage';

function ProfileNav({profile}:{profile?:string}) {

    const dispatch = useDispatch<AppDispatch>()
    

  return (
    <div className='flex items-center absolute left-5 bottom-5 drop-shadow-md rounded-full'>
        <IconButton
        onClick={()=>{
        dispatch(ChangeTab('profile'));
        dispatch(updateScrollIt(true))}}
        >
            <Avatar alt='profile' src={getFileUrl(profile,'profiles')}/>
        </IconButton>
    </div> 
  )
}

export default ProfileNav