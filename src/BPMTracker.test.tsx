import React from 'react';
import {createEvent, fireEvent, render, screen} from '@testing-library/react';
import BPMTracker from "./BPMTracker";
import {streamToInterval} from "./bpm";
import {busyDoN} from "./utils";


it('should show BPM after appropriate number of taps', () => {
    const REQUIRED_PRESSES = 4
    render(
        <BPMTracker
            keyOne="e"
            keyTwo="r"
            bpmTarget={80}
            sampleSize={REQUIRED_PRESSES}
            bufferSize={20}/>
    );

    for (let i = 0; i < REQUIRED_PRESSES; ++i) {
        fireEvent(
            window,
            createEvent.keyDown(window, {key: "e"})
        )
    }

    expect(screen.getByText(/Your BPM: /i)).toBeInTheDocument()
})

test('should show the BPM accurately', () => {
    const TARGET_BPM = 184
    const TOLERANCE = 1.5;

    // Logically, shouldn't need more than sampleSize of presses to get an accurate
    // BPM, but since it is tricky to fire keydown events exactly interval ms apart,
    // we need to up the number of presses to run longer to get the code detected as
    // "hot" and running fast enough.
    const PRESSES = 40

    render(
        <BPMTracker
            keyOne="e"
            keyTwo="r"
            bpmTarget={80}
            sampleSize={4}
            bufferSize={20}/>
    );

    // Grab BPM display from DOM
    const bpmDisplay = screen.getByText(/Your BPM: /i)

    // Verify it is in "Calculating" state
    expect(bpmDisplay).toHaveTextContent("Your BPM: Calculating")

    // Send 4 keydown events at the required interval to target TARGET_BPM
    busyDoN(() => {
            fireEvent(
                window,
                createEvent.keyDown(window, {key: "e"})
            )
        },
        streamToInterval(TARGET_BPM),
        PRESSES
    )

    // Now the BPM display should have some sort of number
    expect(bpmDisplay).toHaveTextContent(/Your BPM: \d/)

    // That number should be within TOLERANCE of TARGET_BPM
    const value = Number(bpmDisplay.textContent?.split(": ")[1])
    expect(Math.abs(TARGET_BPM - value)).toBeLessThanOrEqual(TOLERANCE)
});
