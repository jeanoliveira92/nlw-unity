import { prisma } from "../src/lib/prisma";

async function seed() {

    await prisma.event.create({
        data:{
            id: 'ab1201af-a74d-49f5-acd0-a7501c673960',
            title: "Unite summit",
            slug: "unite-summit",
            details: "Um evento para devs apaixonados(as) por código!",
            maximumAttendees: 120
        }
    })

}

seed().then(() => {
    console.log("Database seeded!")
    prisma.$disconnect()
})