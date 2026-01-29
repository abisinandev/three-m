// import { ValueObjectBase } from "../vo.base-class";

// interface IBlockId {
//     value: string;
// }

// export class BlockId extends ValueObjectBase<IBlockId> {
//     private constructor(props: IBlockId) {
//         super(props);
//     }

//     static create(prefix = "BLOCK"): BlockId {
//         const randomNumber = BlockId.generateNumbers(3);

//         const code = `${prefix}${randomNumber}`;
//         return new BlockId({ value: code });
//     }

//     static rebuild(value: string): BlockId {
//         return new BlockId({ value });
//     }
    
//     static fromExisting(value: string): BlockId {
//         if (!/^[A-Z]{3,5}[A-Z]{1}\d{3}$/.test(value)) {
//             throw new Error("Invalid user code format");
//         }
//         return new BlockId({ value });
//     }

//     private static generateNumbers(length: number): string {
//         const digits = Math.floor(Math.random() * 5 ** length)
//             .toString()
//             .padStart(length, "0");
//         return digits;
//     }

//     get value(): string {
//         return this.props.value
//     }
// }