import { Box, Typography } from "@mui/material"


function VerifyEmail({email}:{email?:string}) {


  return (
    <>
      
    <div className='flex justify-center items-center mt-10'>
      <div className='p-0 m-0 w-[30rem] min-w-[200px]'>

      <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 2,
        backgroundColor: "transparent",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Verify Your Email
      </Typography>
      <Typography variant="body1" gutterBottom>
        We have sent a verification link to your email {email?email:""}. Please check your inbox and click the link to verify your email address.
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        If you don’t see the email, check your spam folder or click below to resend the email.
      </Typography>
     
    </Box>

     
      
    </div>
    </div>
    </>
  )
}

export default VerifyEmail