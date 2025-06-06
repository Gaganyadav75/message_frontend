export const validateField = (name:string,value:string|null) => {
    let error;
   //  for (const key in formData) {
   //      let keyval = formData[key as keyof FormData]
   //      if (keyval) {
            if (name === 'email') {
                error = /\S+@\S+\.\S+/.test(value!) ? '' : 'Invalid email address';
             } else if (name === 'password') {
                error = value && value!.length >= 6 ? '' : 'Password must be at least 6 characters';
             } else if (name === 'username') {
                error = value && value.trim() ? '' : 'Username is required';
             }
              else if (name === 'otp') {
               error = value && value!.length >= 6 ? '' : 'OTP must be 6 digits';
             }
   //      }
   //  }

   //  setErrors(errorObj)
    
    return error;
 };