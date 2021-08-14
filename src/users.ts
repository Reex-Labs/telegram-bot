import { User } from "typegram"

interface TgUser {
    un: string
    fn: string
    lc: string
    ib: boolean
    t: number
}

type TgUserList = Record<string, TgUser>

const userList: TgUserList = {}
const LOCK_TIME = 10000

/**
 * Add user to array
 * username, first_name, language_code, is_bot, time
 */

export function addUser(user: User) {
    userList[String(user.id)] = {
        un: user.username.slice(0, 30),
        fn: user.first_name.slice(0, 30),
        lc: user.language_code.slice(0, 5),
        ib: Boolean(user.is_bot),
        t: 0
    }
}

export function lockUser(id: string) {
    userList[String(id)].t = Date.now()
}

export function getTimeLeft(id: string): number {
    return userList[String(id)].t + LOCK_TIME - Date.now()
}

export function isLocked(id: string): boolean {
    const user = userList[String(id)]

    if (!user) {
        console.log('Undefined user')
        return
    }

    const unlockTime = user.t ? user.t + LOCK_TIME : 0
    const currentTimestamp = Date.now()

    if (unlockTime > currentTimestamp) {
        return true
    } else {
        return false
    }
}

export function isUser(id: string): boolean {
    return userList[String(id)] !== undefined
}

export function logout(ctx: any) {
    ctx.session.state = null
    ctx.session.m = null
    ctx.session.pass = null
}