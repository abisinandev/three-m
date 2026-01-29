export interface ISipBlockUseCase {
    execute(sipId: string): Promise<void>;
}