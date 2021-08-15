import createCaptcha from 'nodejs-captcha'

export default class Captcha {
    image: Buffer
    text: string

    constructor() {
        const captcha = createCaptcha()
        this.image = Buffer.from(captcha.image.substring(23), 'base64')
        this.text = captcha.value
    }

    isValid(text: string) {
        return text === this.text
    }
}