import { Avatar, Badge, styled } from "@mui/material";

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));



function StyledAvatar({src,alt,isOnline=false}:{src:string,alt:string,isOnline:boolean}) {
    
  return (
    
    isOnline?
        <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
       >
        <Avatar alt={alt} src={src} 
        slotProps={{
        img: {
            loading: "lazy",
        },
    }}/>
      </StyledBadge>
    :
        <Avatar alt={alt} src={src} />
    
    
  )
}

export default StyledAvatar