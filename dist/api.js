import { StargateClient } from "@cosmjs/stargate";
import * as dotenv from 'dotenv';
dotenv.config();
const seed_url = process.env.NODE_REEX_SEED;
const client = await StargateClient.connect(seed_url);
export async function getBalance(address, denom = 'reex') {
    try {
        const balance = await client.getBalance(address, denom);
        return balance.amount;
    }
    catch (e) {
        console.log('Error with fetch balance');
        console.log(e);
        return null;
    }
}
export async function getBalances(address, denom = 'reex') {
    try {
        const balances = await client.getAllBalances(address);
        return balances;
    }
    catch (e) {
        console.log('Error with fetch balance');
        console.log(e);
        return null;
    }
}
//# sourceMappingURL=api.js.map