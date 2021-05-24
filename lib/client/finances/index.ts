import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

const decisions = [];


export default class Finances {
    constructor(){
        
    }

    makeDecisions() {
        
    }

    static async countOfCredits(){
        const account = await prisma.account.findFirst();
        return account!.credits;
    }

    static request(){

    }
}