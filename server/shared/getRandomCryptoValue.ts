export default function getRandomCryptoValue(min: number, max: number) {
    if (min > max) throw new Error("Minimum value cannot be greater than maximum value")

    const buffer = new Uint32Array(1)
    global.crypto.getRandomValues(buffer)

    const number = buffer[0] / (0xffffffff + 1)

    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(number * (max - min + 1)) + min
}