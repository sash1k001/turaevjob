import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const adapter = new PrismaLibSql({
            url: process.env.DATABASE_URL as string,
        });
        super({ adapter });
    }
}