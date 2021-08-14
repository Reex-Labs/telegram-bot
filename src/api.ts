import { StargateClient, assertIsBroadcastTxSuccess, SigningStargateClient } from "@cosmjs/stargate"
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
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

export async function sendTransaction(mnemonic: string, to: string, amount: string) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'reex' });
  const [firstAccount] = await wallet.getAccounts();
  const client: any = await SigningStargateClient.connectWithSigner(seed_url, wallet);
  client.fees.send.amount[0].denom = 'reex'
  const coin = {
    denom: "reex",
    amount: String(amount),
  }

  const result = await client.sendTokens(firstAccount.address, to, [coin], "");
  assertIsBroadcastTxSuccess(result);

  return result
}