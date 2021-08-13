import { StargateClient } from "@cosmjs/stargate"
import * as dotenv from 'dotenv'
import axios from'axios'

dotenv.config()
const seed_url = process.env.NODE_REEX_SEED
const client = await StargateClient.connect(seed_url)

export async function getBalance(address: string, denom = 'reex') {
  try {
    const balance = await client.getBalance(address, denom)
    return balance.amount
  }
  catch (e) {
    console.log('Error with fetch balance')
    console.log(e)
    return null
  }
}

export async function getBalances(address: string, denom = 'reex') {
  try {
    const balances = await client.getAllBalances(address)
    return balances
  }
  catch (e) {
    console.log('Error with fetch balance')
    console.log(e)
    return null
  }
}

export async function getReex(address: string) {
    const url = `${process.env.NODE_FAUCET_API}${address}/${process.env.NODE_FAUCET_TOKEN}`

    try {
        const response = await axios.get(url);

        if (response.data === true) return true
        else return false
    } catch (error) {
        console.error('error ', error);
        return false
    }
}