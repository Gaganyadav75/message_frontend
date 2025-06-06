
import ProfileDetails from '../../components/profile&settings/ProfileDetails'
import { ProfilePhoto } from '../../components/profile&settings/ProfilePhoto';
import BackButton from '../../components/reusable/BackButton';
import DarkModeSwitch from '../../components/reusable/DarkModeSwitch';
import { getFileUrl } from '../../components/reusable/profileUrl';
import { useAppSelector } from '../../redux/store';

function Profile_SettingsMainPage() {

   const user = useAppSelector((state)=>state.auth.user); 



  return (
    <>
        {/* <Profile_Setting_Sidebar/> */}
        <div
        className={`pt-[10%] no-scrollbar overflow-y-scroll justify-start items-start p-5 block md:flex md:flex-row  bg-light-profileBg  dark:bg-dark-profileBg w-full h-[100vh] z-[100]`}
        >

          <BackButton className='md:hidden grid absolute top-3 left-3'/>
        <ProfilePhoto profile={getFileUrl(user?.profile,'profiles')}/>

        <ProfileDetails user={user}/>

        <DarkModeSwitch/>

        </div>

        
    </>
  )
}

export default Profile_SettingsMainPage