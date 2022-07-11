import React, {FunctionComponent, useState} from 'react';

import {useEventListener} from 'usehooks-ts';

export interface Props {
    keyOne: string
    keyTwo: string
    bpmTarget: number
    sampleSize: number
}

const MS_PER_MIN: number = 60000

function computeBPM(samples: number[]): number {
    return (samples.length === 0) ? NaN : MS_PER_MIN / (samples
        .map((v, i, a) => v - (a[i - 1] || 0))
        .slice(1)
        .reduce((a, b) => a + b) / (samples.length - 1));
}

const BPMTracker: FunctionComponent<Props> = ({keyOne, keyTwo, bpmTarget, sampleSize}: Props) => {
    const [samples, setSamples] = useState<number[]>([])
    const [bpm, setBPM] = useState<string | undefined>(undefined)

    const registerTap = () => {
        if (samples.length === sampleSize) {
            setBPM((computeBPM(samples) / 4).toFixed(1))

            // Roll window
            setSamples(([_, ...rest]) => [...rest, Date.now()])
        } else {
            // Append to samples
            setSamples(samples => [...samples, Date.now()])
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        e.preventDefault()

        if (e.key === keyOne || e.key === keyTwo) {
            registerTap()
        }
    }

    useEventListener('keydown', handleKeyDown)

    const reset = () => {
        setBPM(undefined)
        setSamples([])
    }

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                height: "100%"
            }}>BPM: {bpmTarget}</div>

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                height: "100%"
            }}>Your BPM: {bpm ?? "Calculating"}</div>

            <button style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                height: "100%"
            }} onClick={reset}>Reset
            </button>
        </>
    );
}

export default BPMTracker;
