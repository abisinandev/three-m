// import { BlockHash } from "@domain/value-objects/wallet/block-hash.vo";
// import { BlockId } from "@domain/value-objects/wallet/block_id.vo";

// export class BlockEntity {
//   private readonly _id?: string;
//   private readonly _blockId: BlockId;
//   private readonly _index: number;
//   private readonly _prevHash: string | null;
//   private readonly _txHash: string;
//   private readonly _blockHash: string;
//   private readonly _timestamp: number;

//   private constructor(props: {
//     id?: string;
//     blockId: BlockId;
//     index: number;
//     prevHash: string | null;
//     txHash: string;
//     blockHash: string;
//     timestamp: number;
//   }) {
//     this._id = props.id;
//     this._blockId = BlockId.create(props.blockId.value);
//     this._index = props.index;
//     this._prevHash = props.prevHash;
//     this._txHash = props.txHash;
//     this._blockHash = props.blockHash;
//     this._timestamp = props.timestamp;
//   }

//   /**
//    * Creates a new block (for the domain logic)
//    */
  
//   static create(data: {
//     index: number;
//     prevHash: string | null;
//     txHash: string;
//   }): BlockEntity {
//     const timestamp = Date.now();

//     const blockHash = BlockHash.create({
//       index: data.index,
//       prevHash: data.prevHash as string,
//       txHash: data.txHash,
//       timestamp,
//     }).value;

//     return new BlockEntity({
//       blockId: BlockId.create(),
//       index: data.index,
//       prevHash: data.prevHash,
//       txHash: data.txHash,
//       blockHash,
//       timestamp,
//     });
//   }

//   /**
//    * Reconstructs a block from persistence (DB)
//    */
//   static fromPersistence(data: {
//     id: string;
//     index: number;
//     blockId: string;
//     prevHash: string | null;
//     txHash: string;
//     blockHash: string;
//     timestamp: number;
//   }): BlockEntity {
//     return new BlockEntity({
//       id: data.id,
//       index: data.index,
//       blockId: BlockId.rebuild(data.blockId),
//       prevHash: data.prevHash,
//       txHash: data.txHash,
//       blockHash: data.blockHash,
//       timestamp: data.timestamp,
//     });
//   }

//   get id(): string | undefined {
//     return this._id;
//   }

//   get index(): number {
//     return this._index;
//   }

//   get blockId(): string {
//     return this._blockId.value;
//   }

//   get prevHash(): string | null {
//     return this._prevHash;
//   }

//   get txHash(): string {
//     return this._txHash;
//   }

//   get blockHash(): string {
//     return this._blockHash;
//   }

//   get timestamp(): number {
//     return this._timestamp;
//   }
// }