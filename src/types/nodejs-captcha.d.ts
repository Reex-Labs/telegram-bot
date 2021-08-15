declare module "nodejs-captcha" {
    function createCaptcha(): captchaObject

    interface captchaObject {
        value: string
        width: number
        height: 100
        image: string
    }

    export = createCaptcha
}