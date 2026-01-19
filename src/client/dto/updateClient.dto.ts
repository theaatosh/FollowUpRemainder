import { PartialType } from "@nestjs/mapped-types";
import { createClientDto } from "./createClient.dto";


export class updateClientDto extends PartialType(createClientDto){}