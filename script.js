let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'circle';

function init() {
    render();
}

function render() {
    const contentDiv = document.getElementById('content');

    // Generate table HTML
    let tableHtml = '<table>';              //in eine Variable den Start-tag für Tabelle packen
    for (let i = 0; i < 3; i++) {           // nun for-loop für drei Zeilen anlegen
        tableHtml += '<tr>';                // und für jede eine tr hinzufügen
        for (let j = 0; j < 3; j++) {       // damit es noch Spalten gibt, jede Zeile i mit einem 3-fachen j durchlaufen
            const index = i * 3 + j;        // ein Feldindex wird erzeugt (0-8)
            let symbol = '';                // Variable Symbol anlegen, leer
            if (fields[index] === 'circle') {       //wenn im Field-Array an der Stelle Index (0-8) 'circle' eingetragen ist dann
                symbol = generateCircleSVG();       //wird mal CircleSVG generiert als Symbol
            } else if (fields[index] === 'cross') {     //und falls fields-array an Stelle Index (0-8) 'cross' eingetragen hat
                symbol = generateCrossSVG();            //dann CrossSVG als Symbol erzeugen
            }
            tableHtml += `<td id="cell${index}" onclick="handleClick(this, ${index})">${symbol}</td>`;   //dem table-String nun Zelle an der Stelle Index mit Symbol zufügen
            // und auch dabei: ,
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    // Set table HTML to contentDiv
    contentDiv.innerHTML = tableHtml;
}

function checkGameStatus() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const winningCombination = getWinningCombination(winningCombinations);   //function with winningCombis as Param

    if (winningCombination) {                           //if there is a winning combi
        drawWinningLine(winningCombination);            //call drawLine-function handing over the winCombi
        setTimeout(() => {                              //moreover Timeout for an alert
            alert(`Player ${fields[winningCombination[0]]} wins!`);     //alert mit cross oder circle je nachdem
            resetGame();
        }, 500);                                         //500ms = 0.5s
        return true;
    }



    // Check for a tie
    if (!fields.includes(null)) {
        alert('It\'s a tie!');
        resetGame();
        return true;
    }
    return false;
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;

    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const contentRect = document.getElementById('content').getBoundingClientRect();

    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById('content').appendChild(line);
}

function getWinningCombination(winningCombinations) {
    for (const combination of winningCombinations) {        //einmal durch alle win-Mglktn
        //
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            //und wenn das erste Field nen 
            // Symbol hat, ob die anderen dasselbe haben?
            return combination;         //dann mach ein Return mit der Kombi
        }
    }
    return null;
}

function getRotationDegrees(rect1, rect2) {
    const deltaX = rect2.left - rect1.left;
    const deltaY = rect2.top - rect1.top;

    // Adjust the angle calculation to ensure correct rotation
    let angle = Math.atan2(deltaY, deltaX) * (90 / Math.PI);

    if (angle < 0) {
        angle += 360;
    }

    return angle;
}



function handleClick(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null;
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';

        checkGameStatus();
    }
}


function resetGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];

    render();
}

function generateCircleSVG() {
    const color = '#00B0EF';
    const width = 70;
    const height = 70;

    return `
   <svg width="${width}" height="${height}">
    <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="5" fill="none">
      <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.2s" fill="freeze" />
    </circle>
  </svg>`;
}

function generateCrossSVG() {
    const color = '#FFC000';
    const width = 70;
    const height = 70;

    return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="none" />
        <line x1="10" y1="10" x2="60" y2="60" stroke="${color}" stroke-width="5" />
        <line x1="10" y1="60" x2="60" y2="10" stroke="${color}" stroke-width="5" />
        <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.2s" fill="freeze" />
      </svg>
  `;
}

function computerMove() {
    const availableCells = fields.map((value, index) => (value === null ? index : null)).filter(index => index !== null);

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const move = availableCells[randomIndex];

    fields[move] = 'cross';
    document.getElementById(`cell${move}`).innerHTML = generateCrossSVG();
    document.getElementById(`cell${move}`).onclick = null;

    if (!checkGameStatus()) {
        currentPlayer = 'circle';
    }
}