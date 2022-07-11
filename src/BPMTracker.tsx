import React, {FunctionComponent, useEffect, useState} from 'react';

import {useEventListener} from 'usehooks-ts';

// TODO:
//     Implement visualizer
//     Add knobs for parameters

export interface Props {
    keyOne: string
    keyTwo: string
    bpmTarget: number
    sampleSize: number
    bufferSize: number
}

const MS_PER_MIN: number = 60000

function computeBPM(samples: number[]): number {
    return (samples.length === 0) ? NaN : MS_PER_MIN / (samples
        .map((v, i, a) => v - (a[i - 1] || 0))
        .slice(1)
        .reduce((a, b) => a + b) / (samples.length - 1));
}

function validateProps(props: Props): Props {
    if (props.bufferSize < props.sampleSize)
        throw new TypeError("Buffer size must be greater or equal to sample size.")

    return props
}

const BPMTracker: FunctionComponent<Props> = (props: Props) => {
    const {
        keyOne,
        keyTwo,
        bpmTarget,
        sampleSize,
        bufferSize
    } = validateProps(props)

    const [samples, setSamples] = useState<number[]>([])
    const [bpm, setBPM] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (samples.length >= sampleSize) {
            let window = samples.slice(-sampleSize);
            let newBPM = (computeBPM(window) / 4).toFixed(1);
            setBPM(newBPM)
        }
    }, [samples, sampleSize])

    const registerTap = () => {
        if (samples.length === bufferSize * 2) {
            setSamples(samples => {
                return [...samples.slice(-(bufferSize - 1)), Date.now()]
            })
        } else {
            setSamples(samples => {
                return [...samples, Date.now()]
            })
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        e.preventDefault()

        if ((e.key === keyOne || e.key === keyTwo) && !e.repeat) {
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
