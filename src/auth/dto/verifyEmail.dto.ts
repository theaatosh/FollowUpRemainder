/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsUUID } from "class-validator";

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsUUID()
  token: string;
}
