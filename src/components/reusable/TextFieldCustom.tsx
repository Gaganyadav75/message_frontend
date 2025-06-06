import { TextField} from "@mui/material";


type TextFieldType = {
    disabled:boolean,
    value:string,
    customProps: { [key: string]: string | number };
}

export function TextFieldDisabledCustom({disabled,value,customProps={}}:TextFieldType) {
  return (
    <TextField
        variant="outlined"
        fullWidth
        disabled={disabled}
        value={value}
        margin='none'
        sx={{
          backgroundColor: 'transparent',
          borderRadius: '4px',
          marginBottom: '16px', 
          borderColor:"transparent",
          "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "transparent", //Adjust border color here
          },
          ...customProps
        }}
        InputProps={{
          style: { color: '#fff',padding:"0"},
        }}
      />
  )
}
