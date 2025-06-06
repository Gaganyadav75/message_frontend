
import { BACKEND_URL } from '../../pages/main/Application';

export const getFileUrl = (filename:string|null|undefined,folder='') =>{

    if (!filename) {
      return ''
    }else{
      if (filename.startsWith('blob:') ||filename.startsWith('data:')||filename.startsWith('https://')) {
        return filename
      }else{
        return BACKEND_URL+'/'+folder+'/'+filename
      }
    }
  }
  