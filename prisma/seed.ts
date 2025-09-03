import dotenv from 'dotenv'
dotenv.config()
import {PrismaClient, Prisma} from '@prisma/client'
import {withAccelerate} from '@prisma/extension-accelerate'
import * as argon2 from "argon2";
import {translatePrismaError} from "../src/utils/prisma_error";

const prisma = new PrismaClient().$extends(withAccelerate())

const userData: Prisma.UserCreateInput =
    {
        name: 'Hachidori Admin',
        email: 'admin@hachidorirobotics.com',
        password: 'Fh6txz0K2gM22qmZSPWXupQwu8pvyuJoaUlqjuRP14TpU1JO5YCShRFWMDpiJYSU',
        status: true,
        role: 'ADMIN',
    }

async function main() {
    console.log(`Start seeding ...`)
    userData.password = await argon2.hash(userData.password, {
        type: argon2.argon2id,
        secret: Buffer.from(process.env.ARGON_SECRET as string, "utf8"),
    });

    try {
        const user = await prisma.user.create({
            data: userData,
        })

        console.log(`Created user with id: ${user.id}`)
    } catch (e) {
        console.log(translatePrismaError(e));
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })