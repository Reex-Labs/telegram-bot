const userList = {};
const LOCK_TIME = 10000;
export function addUser(user) {
    userList[String(user.id)] = {
        un: user.username.slice(0, 30),
        fn: user.first_name.slice(0, 30),
        lc: user.language_code.slice(0, 5),
        ib: Boolean(user.is_bot),
        t: 0
    };
}
export function lockUser(id) {
    userList[String(id)].t = Date.now();
}
export function getTimeLeft(id) {
    return userList[String(id)].t + LOCK_TIME - Date.now();
}
export function isLocked(id) {
    const user = userList[String(id)];
    if (!user) {
        console.log('Undefined user');
        return;
    }
    const unlockTime = user.t ? user.t + LOCK_TIME : 0;
    const currentTimestamp = Date.now();
    if (unlockTime > currentTimestamp) {
        return true;
    }
    else {
        return false;
    }
}
export function isUser(id) {
    return userList[String(id)] !== undefined;
}
//# sourceMappingURL=users.js.map