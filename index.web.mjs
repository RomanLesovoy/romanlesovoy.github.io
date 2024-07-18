const amountSquares = 30;
const squareSize = 10;

let net = new brain.NeuralNetwork();
const allWeights = [];

const frameInput = document.getElementById('frame-input');
const buttonTrain = document.getElementById('on-train');
const buttonRun = document.getElementById('on-run');
const buttonClear = document.getElementById('on-clear');
const lastRecognized = document.getElementById('last-recognized');
const getInputs = () => document.getElementsByClassName('square-input');

let isMouseDown = false;

document.addEventListener('mousedown', function(e) {
    e.preventDefault()
    isMouseDown = true;
}, true);

document.addEventListener('mouseup', function(e) { 
    e.preventDefault()
    isMouseDown = false;
}, true);

buttonTrain.addEventListener('click', () => {
    onSaveTrain();
})

buttonRun.addEventListener('click', () => {
    onRun();
})

buttonClear.addEventListener('click', () => {
    onClear();
})

const createSquare = (type) => {
    const squareSizeWithoutBorder = squareSize - 2;
    const squareToFillFrame = document.createElement('div');
    squareToFillFrame.style.position = 'absolute';
    squareToFillFrame.className = `frame-square ${type}`;
    squareToFillFrame.style.backgroundColor = '#fff';
    squareToFillFrame.style.width = squareToFillFrame.style.height = `${squareSizeWithoutBorder}px`;
    squareToFillFrame.style.border = '1px solid grey';
    return squareToFillFrame;
}


const fillFrame = (frame, type) => {
    for (let i = 0; i < amountSquares; i++) {
        for (let y = 0; y < amountSquares; y++) {
            const square = createSquare(type);
            square.style.top = `${squareSize * i}px`;
            square.style.left = `${squareSize * y}px`
            frame.appendChild(square);
        }
    }

    frame.style.width = frame.style.height = `${squareSize * amountSquares}px`;
}

fillFrame(frameInput, 'square-input');

const handleSquareEvent = (e) => {
    const square = e.target;
    const isTargetSquare = square.className;
    if (isTargetSquare.includes('frame-square')) {
        square.style.backgroundColor = 'red';
    }
}

frameInput.addEventListener('mousemove', (e) => {
    isMouseDown && handleSquareEvent(e)
});

const resetSquares = () => {
    Array.from(getInputs()).forEach((s) => s.style.backgroundColor = '#fff');
}

const onSaveTrain = () => {
    const weights = getFilledSquares();
    const name = prompt('what is it ?');
    allWeights.push({ input: weights, output: { [name]: 1 } });

    resetSquares();
}

const getFilledSquares = () => {
    const weights = [];
    const bgDefault = ['rgb(255, 255, 255)','rgba(255, 255, 255, 1)', '#fff', '#ffffff'];

    Array.from(getInputs()).forEach((s) => {
        const colorNotDefault = !bgDefault.includes(String(s.style.backgroundColor).toLowerCase());

        weights.push(Number(colorNotDefault));
    });

    return weights;
}

const onRun = () => {
    const weights = getFilledSquares();

    net = new brain.NeuralNetwork();
    net.train(allWeights, { log: true, iterations: 50, callback: (e) => {console.log(e)} });

    const result = brain.likely(weights, net);
    const resule2 = net.run(weights)

    console.log(result, resule2)

    lastRecognized.innerHTML = result ? `Last: ${result}` : '';
    resetSquares();

    if (result === undefined || result === null) {
        alert('Sorry, try again.');
    }
}

const onClear = () => {
    resetSquares();
}
