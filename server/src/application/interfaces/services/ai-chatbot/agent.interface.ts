export interface IAgent {
    readonly name: string;
    readonly systemPrompt: string;
    handle(input: string): Promise<string>;
}
