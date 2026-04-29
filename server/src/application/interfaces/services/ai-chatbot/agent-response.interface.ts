export interface AgentResponse {
    message: string;
    type: 'text' | 'confirmation' | 'portfolio_summary' | 'stock_details' | 'suggestion_list';
    data?: Record<string, unknown> | Array<unknown> | unknown;
}
