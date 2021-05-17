import * as dotenv from 'dotenv';
import { Configuration, ShipsApi, TypesApi, UsersApi } from "@spacetraders-syndicate/openapi-sdk"

dotenv.config();

export default class Api {
    config: Configuration;
    types: TypesApi;
    ships: ShipsApi;
    user: UsersApi;

    constructor(){
        this.config = new Configuration({
            username: process.env.USERNAME,
            accessToken: process.env.TOKEN
        })

        this.types = new TypesApi(this.config);
        this.ships = new ShipsApi(this.config);
        this.user = new UsersApi(this.config);
    }
}