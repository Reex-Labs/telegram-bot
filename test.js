import { StargateClient, assertIsBroadcastTxSuccess, SigningStargateClient } from "@cosmjs/stargate"
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import * as dotenv from 'dotenv'
import axios from 'axios'

const mnemonic = 'icon crouch kite dose time wagon acid execute wrong behind decorate much mistake total winner hill rival sustain people plug tribe trash raven turkey'
const to = 'reex17wpr4e06kyanmw72ugrqd4wmnu708qtj4akcw9'

const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'reex' });
const [firstAccount] = await wallet.getAccounts();
const client = await SigningStargateClient.connectWithSigner('127.0.0.1:26657', wallet, { prefix: 'reex' });

console.log('firstAccount:', firstAccount)
console.log('client.fees.send:', client.fees.send)

// client.fees.send.amount[0].denom = 'reex'

console.log('client.fees.send:', client.fees.send)



const coin = {
    denom: "reex",
    amount: '100000',
}

console.log('amount', coin)

const result = await client.sendTokens(firstAccount.address, to, [coin], "");
assertIsBroadcastTxSuccess(result);

console.log('result', result)