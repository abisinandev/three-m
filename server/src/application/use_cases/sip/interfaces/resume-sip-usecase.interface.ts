export interface IResumeSipUseCase{
    execute(userId: string, sipId: string): Promise<void>;
}