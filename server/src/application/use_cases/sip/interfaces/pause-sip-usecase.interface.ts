export interface IPauseSipUseCase{
    execute(userId: string, sipId: string): Promise<void>;
}