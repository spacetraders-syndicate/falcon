import { PrismaClient } from '@prisma/client';
import Api from './api';
const prisma = new PrismaClient()
const api = new Api();

export const init = async () => {
    const goodCount = await prisma.goodType.count();
    if (goodCount === 0) {
        const { data: { ships } } = await api.types.listShipTypes();

        console.log(ships)
        const createShipTypes = ships.map((shipType) => {
            const payload = {
                class: shipType._class,
                ...shipType
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

        console.log(structures)

        const createStructureTypes = structures.map((structure) => {
            const payload = {
                name: structure.name,
                price: structure.price,
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
                }
            };

            return prisma.structureType.upsert({
                where: { type: structure.type },
                update: payload,
                create: {
                    type: structure.type!,
                    ...payload
                }
            })
        })

        const createdStructureTypes = await Promise.all(createStructureTypes);
    }
}