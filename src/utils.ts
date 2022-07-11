/**
 * Schedule a callback N times with a self-correcting interval.
 *
 * Compensates for the fact that setInterval often drifts later than the provided
 * interval.
 */
export function busyDoN(callback: () => void, interval: number, repetitions: number) {
    let count = 1

    const startTime = Date.now()
    let next = startTime + interval

    while (true) {
        let now = Date.now();

        if (now >= next) {
            callback()
            count += 1
            next = startTime + count * interval
        }

        if (count === repetitions + 1) {
            break
        }
    }
}
