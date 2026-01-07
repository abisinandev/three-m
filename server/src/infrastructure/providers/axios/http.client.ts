import axios, { AxiosInstance } from "axios";
import { injectable } from "inversify";
import { IHttpClient } from "../../../application/interfaces/services/externals/http-client-interface";

@injectable()
export class AxiosHttpClient implements IHttpClient {
    private readonly client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            timeout: 30000,
        });
    }

    async get<T>(url: string): Promise<T> {
        const res = await this.client.get<T>(url);
        return res.data;
    }
}
