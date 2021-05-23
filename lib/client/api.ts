import * as dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';
import rateLimit from '@hokify/axios-rate-limit';
import { Configuration, LoansApi, ShipsApi, TypesApi, UsersApi } from "@spacetraders-syndicate/openapi-sdk"
import axiosRetry, {isNetworkOrIdempotentRequestError} from 'axios-retry';


dotenv.config();

const axiosInstance = rateLimit(axios.create(), {
    maxRPS: 10
})

axiosRetry(axiosInstance, {
    retryCondition: (error: AxiosError) => {
        console.log('retry')
        return isNetworkOrIdempotentRequestError(error) || error.response?.status === 429;
    },
    retries: 30,
    retryDelay: axiosRetry.exponentialDelay
})

export default class Api {
    config: Configuration;
    types: TypesApi;
    ships: ShipsApi;
    user: UsersApi;
    loans: LoansApi;

    constructor(){
        this.config = new Configuration({
            username: process.env.USERNAME,
            accessToken: process.env.TOKEN
        })

        this.types = new TypesApi(this.config, undefined, axiosInstance);
        this.ships = new ShipsApi(this.config, undefined, axiosInstance);
        this.user = new UsersApi(this.config, undefined, axiosInstance);
        this.loans = new LoansApi(this.config, undefined, axiosInstance);
    }
}