import React, {FunctionComponent, useEffect, useState} from 'react';

import {useEventListener} from 'usehooks-ts';
import {computeMapBPM, Note} from "./bpm";

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
            let newBPM = (computeMapBPM(window, Note.Sixteenth)).toFixed(10);
            setBPM(newBPM)
        }
    }, [samples, sampleSize])

    const registerTap = () => {
        const range = samples.length === bufferSize * 2 ? 0 : -(bufferSize - 1)
        setSamples(samples => [...samples.slice(range), Date.now()])
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
