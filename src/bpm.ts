const MS_PER_MIN: number = 60000

export function BPMToIntervalMS(bpm: number): number {
    return MS_PER_MIN / bpm
}

export function intervalMSToBPM(delay: number): number {
    return MS_PER_MIN / delay
}

export enum Note {
    Sixteenth = 4,
    Eighth = 2,
    Quarter = 1
}

/**
 * Given a map BPM as one would find in a map description, convert it to the delay
 * between taps that would occur when streaming the given note, defaults to 16th notes.
 */
export function streamToInterval(mapBPM: number, note: Note = Note.Sixteenth): number {
    return BPMToIntervalMS(mapBPM * note)
}

/**
 * Given a set of timestamps for taps, compute what map BPM the user is streaming at
 * for a given type of note, defaults to 16th notes.
 */
export function computeMapBPM(samples: number[], note: Note = Note.Sixteenth): number {
    return ((samples.length === 0) ? NaN : intervalMSToBPM(samples
        .map((v, i, a) => v - (a[i - 1] || 0))
        .slice(1)
        .reduce((a, b) => a + b) / (samples.length - 1))) / note
}