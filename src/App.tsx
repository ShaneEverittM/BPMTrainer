import BPMTracker from "./BPMTracker";

function App() {
    return (
        <BPMTracker keyOne="e" keyTwo="r" bpmTarget={80} sampleSize={4} bufferSize={20}/>
    );
}

export default App;
