import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  ValidateNested,
  IsNumber,
} from "class-validator";

export class DocumentDTO {
  @IsString()
  @IsNotEmpty({ message: "Document type is required" })
  type!: string;

  @IsString()
  @IsNotEmpty({ message: "File name is required" })
  fileName!: string;

  @IsString()
  @IsNotEmpty({ message: "File URL is required" })
  @IsUrl({}, { message: "Invalid file URL" })
  fileUrl!: string;

  @IsString()
  @IsNotEmpty({ message: "Public ID is required" })
  publicId!: string;

  @IsString()
  @IsNotEmpty({ message: "Resource type is required" })
  resourceType!: string;

  @IsString()
  @IsNotEmpty({ message: "Format is required" })
  format!: string;

  @IsNumber()
  @IsNotEmpty({ message: "Bytes is required" })
  bytes!: number;
}

export class AddressDTO {
  @IsString()
  @IsNotEmpty({ message: "Full address is required" })
  @Length(10, 300, {
    message: "Address must be between 10 and 300 characters",
  })
  fullAddress!: string;

  @IsString()
  @IsNotEmpty({ message: "City is required" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "City can only contain letters and spaces",
  })
  city!: string;

  @IsString()
  @IsNotEmpty({ message: "State is required" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "State can only contain letters and spaces",
  })
  state!: string;

  @IsString()
  @IsNotEmpty({ message: "PIN code is required" })
  @Length(6, 6, { message: "PIN code must be exactly 6 digits" })
  @Matches(/^\d{6}$/, { message: "Invalid PIN code" })
  pincode!: string;
}

export class KycSubmitDTO {
  @IsString()
  @IsNotEmpty({ message: "Full name is required" })
  @Length(3, 100)
  @Matches(/^[A-Za-z\s'-]+$/, {
    message: "Full name contains invalid characters",
  })
  fullName!: string;

  @IsString()
  @IsNotEmpty({ message: "PAN number is required" })
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: "Invalid PAN format (e.g. ABCDE1234F)",
  })
  panNumber!: string;

  @IsString()
  @IsOptional() // Aadhar is optional
  @Matches(/^\d{12}$/, {
    message: "Aadhar must be 12 digits",
  })
  aadharNumber!: string;

  @ValidateNested()
  @Type(() => AddressDTO)
  address!: AddressDTO;

  @IsArray({ message: "Documents must be an array" })
  @ValidateNested({ each: true })
  @Type(() => DocumentDTO)
  documents!: DocumentDTO[];
}
