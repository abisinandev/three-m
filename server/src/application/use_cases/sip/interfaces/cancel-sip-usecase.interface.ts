export interface ICancelSipUseCase{
    execute(userId: string, sipId: string): Promise<void>;
}