import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import type { KycDocumentVO } from "@domain/entities/user/user-value-objects/kyc-documents.vo";

export class KycEntity {
  private readonly _id?: string;
  private readonly _userId: string;
  private _isKycVerified: boolean;
  private _status: KycStatusType;
  private _documents: KycDocumentVO[];
  private _panNumber?: string | null;
  private _aadharNumber?: string | null;
  private _address: {
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  private _rejectionReason?: string | null;
  private readonly _createdAt?: Date;

  private constructor(props: {
    id?: string;
    userId: string;
    isKycVerified: boolean;
    status: KycStatusType;
    documents: KycDocumentVO[];
    panNumber?: string | null;
    aadharNumber?: string | null;
    address: {
      fullAddress: string;
      city: string;
      state: string;
      pincode: string;
    };
    rejectionReason?: string | null;
    createdAt?: Date;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._isKycVerified = props.isKycVerified;
    this._status = props.status;
    this._documents = props.documents;
    this._panNumber = props.panNumber ?? null;
    this._aadharNumber = props.aadharNumber ?? null;
    this._address = props.address;
    this._rejectionReason = props.rejectionReason ?? null;
    this._createdAt = props.createdAt;
  }

  static create(data: {
    userId: string;
    documents: KycDocumentVO[];
    panNumber?: string;
    aadharNumber?: string;
    address: { fullAddress: string; city: string; state: string; pincode: string };
  }): KycEntity {
    return new KycEntity({
      userId: data.userId,
      isKycVerified: false,
      status: KycStatusType.PENDING,
      documents: data.documents,
      panNumber: data.panNumber ?? null,
      aadharNumber: data.aadharNumber ?? null,
      address: data.address,
      rejectionReason: null,
    });
  }

  static reconstitute(data: {
    id: string;
    userId: string;
    isKycVerified: boolean;
    status: KycStatusType;
    documents: KycDocumentVO[];
    panNumber?: string | null;
    aadharNumber?: string | null;
    address: { fullAddress: string; city: string; state: string; pincode: string };
    rejectionReason?: string | null;
    createdAt?: Date;
  }): KycEntity {
    return new KycEntity({
      id: data.id,
      userId: data.userId,
      isKycVerified: data.isKycVerified,
      status: data.status,
      documents: data.documents ?? [],
      panNumber: data.panNumber ?? null,
      aadharNumber: data.aadharNumber ?? null,
      address: data.address,
      rejectionReason: data.rejectionReason ?? null,
      createdAt: data.createdAt,
    });
  }

  get id() {
    return this._id;
  }
  get userId() {
    return this._userId;
  }
  get isKycVerified() {
    return this._isKycVerified;
  }
  get documents() {
    return this._documents;
  }
  get address() {
    return this._address;
  }
  get panNumber() {
    return this._panNumber;
  }
  get aadharNumber() {
    return this._aadharNumber;
  }
  get status() {
    return this._status;
  }
  get rejectionReason() {
    return this._rejectionReason;
  }
  get createdAt() {
    return this._createdAt;
  }

  verifyKyc() {
    this._isKycVerified = true;
    this._status = KycStatusType.VERIFIED;
  }

  rejectKyc(reason: string) {
    this._isKycVerified = false;
    this._status = KycStatusType.REJECTED;
    this._rejectionReason = reason;
  }

  updateDocuments(documents: KycDocumentVO[]) {
    this._documents = documents;
  }

  updateAddress(address: { fullAddress: string; city: string; state: string; pincode: string }) {
    this._address = address;
  }
  
}
