import React, {useState, FunctionComponent} from 'react';

import {useInterval, useEventListener} from "usehooks-ts";

export interface Props {
    keyOne: string
    keyTwo: string
}

const BPMTracker: FunctionComponent<Props> = ({keyOne, keyTwo}: Props) => {
    const [counter, setCounter] = useState(0)
    const [presses, setPresses] = useState(0)

    useInterval(() => {
        setCounter(counter => counter + 1)
    }, 1000)

    const handleKeyDown = (e: KeyboardEvent) => {
        e.preventDefault()

        if (e.key === keyOne || e.key === keyTwo) {
            setPresses(prevPresses => prevPresses + 1)
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
            }}>Expected Presses: {counter}</div>
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
