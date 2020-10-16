
export interface Hrtime {
    seconds: number;
    nanoseconds: number;
}

export const hrtime = (): () => Hrtime => {
    if (typeof process.hrtime === 'function') {
        const start = process.hrtime();
        return () => {
            const end = process.hrtime(start);
            return {
                seconds: end[0],
                nanoseconds: end[1],
            };
        };
    }

    const start = Date.now();
    return () => {
        const ms = Date.now() - start;
        return ({
            seconds: Math.floor(ms),
            nanoseconds: (ms % 1000) * 1e6,
        });
    };
};
