
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function TermsAndConditionsDialog({ open, onClose }:{open:boolean,onClose:()=>void}) {
  return (
    <Dialog open={open} onClose={onClose} scroll="paper" maxWidth="sm" fullWidth className=''>
      <DialogTitle className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">Terms and Conditions</DialogTitle>
      <DialogContent dividers className="space-y-4 text-sm text-light-textSecondary dark:text-dark-textSecondary">
        <p>
          Welcome to our messaging app. By using this application, you agree to the following terms and conditions:
        </p>
        <ol className="list-decimal list-inside">
          <li>You must be 13 years or older to use this app.</li>
          <li>Do not use this app for illegal activities.</li>
          <li>We reserve the right to suspend your account at any time.</li>
          <li>Your data will be handled according to our privacy policy.</li>
          <li>We may update these terms without notice.</li>
        </ol>
        <p>
          If you do not agree with these terms, please do not use the application.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
