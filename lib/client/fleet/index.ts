import { Prisma, PrismaClient } from '@prisma/client';
import Finances from '../finances';
const prisma = new PrismaClient()

import Api from '../api';
import { UserShip } from '@spacetraders-syndicate/openapi-sdk';
const api = new Api();

const BEGINNING_SYSTEM = 'OE'; // hardcoded temporarily
const decisions = [];
const finances = new Finances();

export default class Fleet {
    constructor(){}

    async makeDecisions() {
        const credits = await Finances.countOfCredits();
        const shipCount = await Fleet.countOfShips();

        console.log(credits, shipCount)
        // First few ships we need to just collect information
        if(shipCount < 3 && credits > 150000){
            await Fleet.beginningOfGame()
        }


    }

    private static async beginningOfGame(){

       // buy 3 market scouts
       const cheapestShipListing  = await Fleet.findCheapestShipInSystem();
       const { data } = await api.ships.buyUserShip({
           buyUserShipPayload: {
               type: cheapestShipListing.type,
               location: cheapestShipListing.purchaseLocations.reduce((prev, curr) => {
                return prev.price < curr.price ? prev : curr;
            }).location
           }
       })

    //    await finances.makePurchase(data.credits);
       await Fleet.addShip(data.ship);
       
       // buy 1 trader if we can

    }

    private static async addShip(ship: UserShip) {
        await prisma.ship.create({
            data: {
                ...ship,
                location: {
                    connect: {
                        symbol: ship.location
                    }
                },
                class: ship._class
            }
        })
    }

    private static async findCheapestShipInSystem(){
        const { data: { shipListings }} = await api.ships.listSystemShipListings({
            symbol: BEGINNING_SYSTEM
        })

        return shipListings!.reduce((prev, curr) => {
            const previousShipLowestPriceLocation = prev.purchaseLocations.reduce((prev, curr) => {
                return prev.price < curr.price ? prev : curr;
            }).price;
    
            const currentShipLowstPriceLocation = curr.purchaseLocations.reduce((prev, curr) => {
                return prev.price < curr.price ? prev : curr;
            }).price;
    
            return previousShipLowestPriceLocation < currentShipLowstPriceLocation ? prev : curr;
        });
    }

    static async countOfShips(){
        return await prisma.ship.count();
    }

    static async shipYards(){}

    static request(){

    }
}