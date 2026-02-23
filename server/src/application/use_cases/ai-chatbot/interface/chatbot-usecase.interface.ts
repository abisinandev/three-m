export interface IChatbotUseCase{
    execute(userInput: string): Promise<string>;
}