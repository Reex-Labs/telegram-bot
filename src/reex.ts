import { Coin } from "@cosmjs/stargate/build/codec/cosmos/base/v1beta1/coin"

const DECIMAL = 1000000

export function ureexToCoin(amount: string): Coin {
    return {
        amount: amount,
        denom: 'reex'
    }
}

export function reexToCoin(amount: string): Coin {
    const newAmount = Number(amount) * DECIMAL
    return {
        amount: String(newAmount),
        denom: 'reex'
    }
}

export function coinToReex(coin: Coin) {
    const amount = Number(coin.amount) / DECIMAL
    return {
        amount: String(amount),
        denom: 'reex'
    }
}

export function isValidAmount(amount: string) {
    return Number(amount) >= 1 / DECIMAL
}