import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

type DialogBoxType = {
    setDialogBoxOpen:React.Dispatch<React.SetStateAction<boolean>>;
    AgreeFunction?:()=>void;
    DisagreeFunction?: ()=>void ;
    yes?: string ;
    no?: string ;
    content?: string ;
    header?: string ;
}

export default function DialogBox({ setDialogBoxOpen,AgreeFunction,DisagreeFunction,content,yes,no,header}:DialogBoxType) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setDialogBoxOpen(false);
  };

  return (
    <React.Fragment>
      
      <Dialog
        fullScreen={fullScreen}
        open={true}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {header || "Do you want to continue?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content || ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={()=>{if(DisagreeFunction)DisagreeFunction();handleClose()}}>
            {no || "no"}
          </Button>
          <Button onClick={()=>{if(AgreeFunction)AgreeFunction();handleClose()}} autoFocus>
            {yes || "yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
