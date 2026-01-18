export interface registerUserData{
    userName:string,
    email:string,
    password:string,
    phone?:string,
}

export interface loginUserData{
    email:string,
    password:string,
}