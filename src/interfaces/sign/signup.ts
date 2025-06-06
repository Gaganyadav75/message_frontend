export interface SignUpDataInterFace {
    username: string;
    email: string;
    password: string;
 }
 
export interface SignUpErrorDataInterFace {
    username: string | null | undefined;
    email: string | null| undefined;
    password: string | null | undefined;
 }
 

export interface SignUpError extends SignUpDataInterFace {
    message: string;
  }