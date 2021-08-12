import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

export default async function genAddress() {
    const wallet = await DirectSecp256k1HdWallet.generate(24, { prefix: "reex" })
    const mnemonic = wallet.mnemonic
    const [{ address }] = await wallet.getAccounts();
    return { address, mnemonic }
}
