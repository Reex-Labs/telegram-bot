import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Bip39, EnglishMnemonic } from "@cosmjs/crypto";

export async function genAddress() {
    const wallet = await DirectSecp256k1HdWallet.generate(24, { prefix: "reex" })
    const mnemonic = wallet.mnemonic
    const [{ address }] = await wallet.getAccounts();
    return { address, mnemonic }
}

export function isValidAddress(address: string) {
    var regex = /^reex\w{39}$/;
    return regex.test(address)
}

export function isValidMnemonic(mnemonic: string) {
    try {
        new EnglishMnemonic(mnemonic)
        return true
    }
    catch (e) {
        return false
    }
}