/* eslint-disable prettier/prettier */

import { randomUUID } from "crypto"
export const generateRandomToken=()=>{
    const token=randomUUID()
    return token
}