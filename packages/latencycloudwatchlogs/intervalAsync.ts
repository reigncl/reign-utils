
import { promisify } from 'util'
const newLocal = promisify(setTimeout);

export type IntervalAsync = ReturnType<typeof setIntervalAsync>

export const setIntervalAsync = (callback: (...args: any[]) => Promise<void>, ms: number, ...args: any[]) => {
    let working = true;
    const endInterval = () => {
        working = false;
    }

    const runInterval = async () => {
        while (working) {
            const start = Date.now()
            try {
                await callback(...args);
            } catch (ex) {
                console.error(ex)
            }
            const timeout = ms - (Date.now() - start);
            if (timeout > 0) await newLocal(timeout)
        }
    }

    const r = {}

    Object.defineProperties(r, {
        interval: {
            value: runInterval(),
            writable: false,
        },
        end: {
            value: endInterval,
            writable: false,
        },
    })

    return r
}

export const clearIntervalAsync = (interval?: IntervalAsync) => {
    if (!interval) return
    const end = Object.getOwnPropertyDescriptor(interval, 'end')?.value
    if (typeof end !== 'function') return
    end()
}
