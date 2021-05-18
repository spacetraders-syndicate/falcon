import { Prisma, PrismaClient } from '@prisma/client';
import Api from './api';
const prisma = new PrismaClient()
const api = new Api();

export const init = async () => {
    const loanCount = await prisma.loanType.count();
    if (loanCount === 0) {
        const { data: { loans } } = await api.types.listGameLoans();

        const createLoanTypes = loans.map((loanType) => {
            const payload: Prisma.LoanTypeCreateInput = {
                ...loanType
            }
            return prisma.loanType.upsert({
                where: { type: loanType.type },
                update: payload,
                create: payload
            })
        })

        await Promise.all(createLoanTypes)
    }

    const goodCount = await prisma.goodType.count();
    if (goodCount === 0) {
        const { data: { goods } } = await api.types.listGoodTypes();

        const createGoodTypes = goods!.map((goodType) => {
            const payload: Prisma.GoodTypeCreateInput = {
                ...goodType,
                volumePerUnit: goodType.volumePerUnit!
            }

            return prisma.goodType.upsert({
                where: { symbol: goodType.symbol },
                update: payload,
                create: payload
            })
        })

        await Promise.all(createGoodTypes)
    }


    const shipCount = await prisma.shipType.count();
    if (shipCount === 0) {
        const { data: { ships } } = await api.types.listShipTypes();

        const createShipTypes = ships!.map((shipType) => {

            let restrictedGoods: Prisma.RestrictedGoodsOnShipTypeCreateNestedManyWithoutShipTypeInput | undefined;
            if (shipType.restrictedGoods) {
                restrictedGoods = {
                    connectOrCreate: [
                        ...shipType.restrictedGoods.map((goodType) => {
                            return {
                                where: {
                                    goodSymbol_shipTypeType: {
                                        goodSymbol: goodType,
                                        shipTypeType: shipType.type
                                    }
                                },
                                create: {
                                    goodSymbol: goodType,
                                }
                            }
                        })
                    ]
                };
            }

            const payload: Prisma.ShipTypeCreateInput = {
                class: shipType._class,
                ...shipType,
                restrictedGoods: restrictedGoods
            }

            return prisma.shipType.upsert({
                where: { type: shipType.type },
                update: payload,
                create: payload
            })
        })

        await Promise.all(createShipTypes)
    }


    // ensure structure types (and location types)
    const structureCount = await prisma.structureType.count();
    if (structureCount === 0) {
        const { data: { structures } } = await api.types.listGameStructures();

        const createStructureTypes = structures.map((structure) => {
            const payload: Prisma.StructureTypeCreateInput = {
                name: structure.name,
                price: structure.price,
                type: structure.type!,
                allowedLocationTypes: {
                    connectOrCreate: [
                        ...structure.allowedLocationTypes.map((locationType) => {
                            return {
                                create: { type: locationType },
                                where: {
                                    type: locationType
                                }
                            }
                        })
                    ]
                },
                producesGood: {
                    connectOrCreate: [
                        ...structure.produces.map((goodTypeSymbol) => {
                            return {
                                where: {
                                    goodTypeSymbol_structureTypeType: {
                                        goodTypeSymbol: goodTypeSymbol,
                                        structureTypeType: structure.type!
                                    }
                                },
                                create: {
                                    goodTypeSymbol: goodTypeSymbol,
                                }
                            }
                        })
                    ]
                },
                consumesGood: {
                    connectOrCreate: [
                        ...structure.consumes.map((goodTypeSymbol) => {
                            return {
                                where: {
                                    goodTypeSymbol_structureTypeType: {
                                        goodTypeSymbol: goodTypeSymbol,
                                        structureTypeType: structure.type!
                                    }
                                },
                                create: {
                                    goodTypeSymbol: goodTypeSymbol,
                                }
                            }
                        })
                    ]
                }
            };

            return prisma.structureType.upsert({
                where: { type: structure.type },
                update: payload,
                create: payload
            })
        })

        const createdStructureTypes = await Promise.all(createStructureTypes);
    }
}