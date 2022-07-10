import React, {FunctionComponent} from 'react';

import {useCounter, useEventListener, useInterval} from 'usehooks-ts';

export interface Props {
    keyOne: string
    keyTwo: string
    bpm: number
}


const BPMTracker: FunctionComponent<Props> = ({keyOne, keyTwo, bpm}: Props) => {
    const {count: presses, increment: incrementPresses} = useCounter()
    const {count: expectedPresses, increment: incrementCount} = useCounter()

    const delay_ms = (60 * 1000) / bpm
    useInterval(incrementCount, delay_ms)

    const handleKeyDown = (e: KeyboardEvent) => {
        e.preventDefault()

        if (e.key === keyOne || e.key === keyTwo) {
            incrementPresses()
        }
    }

    useEventListener('keydown', handleKeyDown)

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                height: "100%"
            }}>Expected Presses: {expectedPresses}</div>

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                height: "100%"
            }}>Your Presses: {presses}</div>
        </>
    );
}

export default BPMTracker;
