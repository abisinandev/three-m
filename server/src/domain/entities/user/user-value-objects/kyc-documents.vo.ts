export class KycDocumentVO {
  constructor(
    public readonly type: string,
    public readonly fileName: string,
    public readonly fileUrl: string,
  ) {}
}
