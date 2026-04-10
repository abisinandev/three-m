import { injectable } from "inversify";
import { IConfirmSignalUseCase } from "./interfaces/confirm-signal-usecase.interface";

@injectable()
export class ConfirmSignalUseCase implements IConfirmSignalUseCase {
    constructor(

    ) { }
    
    execute(): Promise<void> {

    }
}