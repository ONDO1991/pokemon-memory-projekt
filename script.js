//Dieser Codeabschnitt erstellt Variablen, die später im Code verwendet werden.

// moves ist ein HTML-Element, das die Anzahl der Schritte im Spiel anzeigt.
// timeValue ist ein HTML-Element, das die Spielzeit anzeigt.
// startButton ist ein HTML-Element, das den Startknopf des Spiels darstellt.
// stopButton ist ein HTML-Element, das den Stoppknopf des Spiels darstellt.
// gameContainer ist ein HTML-Element, das den Container für die Spielkarten darstellt.
// result ist ein HTML-Element, das das Ergebnis des Spiels anzeigt.
// controls ist ein HTML-Element, das den Container für die Steuerelemente des Spiels darstellt.
// cards ist eine Variable, die später im Code verwendet wird, um auf alle Karten im Spiel zuzugreifen.
// interval ist eine Variable, die später im Code verwendet wird, um den Timer des Spiels zu aktualisieren.
// firstCard und secondCard sind Variablen, die später im Code verwendet werden, um die beiden ausgewählten Karten im Spiel zu speichern.
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Dieser Codeblock definiert ein Array von Objekten namens "items", das alle Karten enthält, die im Spiel verwendet werden. Jedes Objekt enthält den Namen und das Bild der Karte. Das Spiel verwendet dieses Array später, um zufällige Karten auszuwählen und das Spielfeld zu erstellen. In diesem Fall gibt es 8 verschiedene Karten.
const items = [
  { name: "glumanda", image: "glumanda.png" },
  { name: "schiggy", image: "schiggy.png" },
  { name: "bisasam", image: "bisasam.png" },
  { name: "pikachu", image: "pikachu.png" },
  { name: "rattfratz", image: "rattfratz.png" },
  { name: "sandan", image: "sandan.png" },
  { name: "raupy", image: "raupy.png" },
  { name: "taubsi", image: "taubsi.png" },
];

//Dieser Codeblock initialisiert zwei Variablen, seconds und minutes, die später im Spiel verwendet werden, um die Zeit zu zählen. Sie werden zu Beginn auf 0 gesetzt.
let seconds = 0,
  minutes = 0;

//Dieser Codeabschnitt initialisiert zwei Variablen, movesCount und winCount, die später im Spiel verwendet werden. movesCount zählt die Anzahl der Züge, die ein Spieler benötigt, um das Spiel zu beenden, und winCount zählt die Anzahl der korrekten Kartenpaare, die ein Spieler gefunden hat. Beide Variablen werden zu Beginn auf 0 gesetzt.
let movesCount = 0,
  winCount = 0;

//Dieser Codeblock definiert eine Funktion timeGenerator, die später im Spiel als Timer verwendet wird. Diese Funktion wird einmal pro Sekunde aufgerufen und erhöht die seconds-Variable um 1.
const timeGenerator = () => {
  seconds += 1;

  //Dieser Code-Block enthält eine Bedingung, die prüft, ob die Sekunden größer oder gleich 60 sind. Wenn dies der Fall ist, wird die minutes-Variable um 1 erhöht und die seconds-Variable wird auf 0 zurückgesetzt. Auf diese Weise wird sichergestellt, dass die Zeit im Spiel korrekt angezeigt wird.
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //Dieser Codeblock formatiert die Anzeige der Spielzeit. Zuerst werden die Sekunden und Minuten auf ihre Einerstelle überprüft. Wenn sie kleiner als 10 sind, wird eine führende Null hinzugefügt. Dann wird die timeValue-Variable aktualisiert, um die formatierte Zeit anzuzeigen. Die Zeit wird in HTML formatiert und in das Element eingefügt, das durch timeValue referenziert wird. Das HTML-Code enthält auch einen span-Tag, um "Time:" als Text vor der formatierten Zeit anzuzeigen.
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//Dieser Codeblock definiert eine Funktion movesCounter, die aufgerufen wird, wenn ein Spieler eine Karte auswählt. Jedes Mal, wenn diese Funktion aufgerufen wird, wird die movesCount-Variable um 1 erhöht, um die Anzahl der Züge zu zählen, die ein Spieler benötigt, um das Spiel abzuschließen. Die Funktion aktualisiert auch das HTML-Element, das durch moves referenziert wird, um die aktuelle Anzahl der Züge anzuzeigen. Der Text "Moves:" wird vor der Anzahl der Züge im HTML-Code angezeigt.
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Dieser Codeblock definiert eine Funktion generateRandom, die ein Array von zufälligen Karten zurückgibt. Es nimmt eine optionale size-Parameter, der standardmäßig auf 4 gesetzt ist. Das size-Argument bestimmt die Anzahl der Kartenpaare, die im Spiel verwendet werden.

// Die Funktion erstellt zunächst eine temporäre Kopie des items-Arrays. Dann wählt es zufällig size * size / 2 Objekte aus dem Array aus und fügt sie zu cardValues hinzu. Die ausgewählten Objekte werden aus dem temporären Array entfernt, um sicherzustellen, dass keine Karte doppelt verwendet wird.

// Schließlich wird das cardValues-Array zurückgegeben, das eine zufällige Auswahl von Karten enthält, die später verwendet werden, um das Spielfeld zu generieren.
const generateRandom = (size = 4) => {
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size) / 2;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

// Dieser Codeblock definiert eine Funktion matrixGenerator, die das Spielfeld erstellt. Es nimmt zwei Argumente: das cardValues-Array, das die ausgewählten Karten enthält, und einen optionalen size-Parameter, der standardmäßig auf 4 gesetzt ist.

// Die Funktion leert zunächst das HTML-Element, das durch gameContainer referenziert wird. Dann kopiert es das cardValues-Array und fügt jedes Element im Array erneut hinzu, um doppelte Kartenpaare zu erstellen. Schließlich werden die Karten im Array zufällig sortiert.

// Die Funktion erstellt dann ein Raster von Karten, indem es HTML-Code für jedes Karten-Element in das gameContainer-Element einfügt. Die Karten werden durch ein Div-Element dargestellt, das das Bild der Karte enthält und eine data-card-value-Attribute mit dem Namen der Karte enthält. Jedes Karten-Element erhält auch eine card-container-Klasse und einen style-Attribute, das die Position des Karten-Elements auf dem Raster angibt.

// Schließlich wird das Raster angezeigt, indem das gameContainer-Element auf das entsprechende Rasterformat für die ausgewählte size angepasst wird. Außerdem werden alle Karten-Elemente durch document.querySelectorAll ausgewählt und für jeden wird ein Event-Listener hinzugefügt, der ausgeführt wird, wenn eine Karte ausgewählt wird.
const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);

  //Dieser Codeblock definiert eine indexes-Variable, die ein Array von zufällig sortierten Indizes für die Kartenmatrix generiert. Es nutzt den Spread-Operator [...], um ein Array von Größe size * size zu generieren. Dann wird der keys()-Methode auf dem Array aufgerufen, um ein Array von aufeinanderfolgenden Zahlen von 0 bis size * size - 1 zu generieren. Schließlich wird auf das Array eine sort()-Methode angewendet, die eine Funktion als Argument erhält, die den Vergleichswert für die Sortierung generiert. In diesem Fall wird eine Funktion definiert, die eine zufällige Zahl zurückgibt, die entweder positiv oder negativ sein kann, was zu einer zufälligen Sortierung der Elemente im Array führt.
  const indexes = [...Array(size * size).keys()].sort(
    () => Math.random() - 0.5
  );

  //Dieser Codeblock generiert die HTML-Elemente für jede Karte im Spiel. Die Schleife iteriert über jeden Index im indexes-Array, wobei der indexes-Array die Position jeder Karte im Raster repräsentiert. Der cardValues-Array enthält die ausgewählten Karten. Für jeden Index wird eine card-container-Div erstellt, die das HTML-Element für die Karte darstellt.

  // Die row- und column-Variablen geben die Zeile und Spalte an, in der die Karte im Raster platziert werden soll. Diese Werte werden aus dem indexes-Array berechnet, der den Index der Karte im Raster repräsentiert. Der card-Wert wird verwendet, um das Bild und den Namen der Karte in das HTML-Element einzufügen. Das data-card-value-Attribut des HTML-Elements wird auf den Namen der Karte festgelegt, während das src-Attribut des Bild-Elements auf den Pfad des Bilds der Karte gesetzt wird.

  // Schließlich wird das HTML-Element für jede Karte dem gameContainer-Element hinzugefügt, das den gesamten Spieltisch darstellt. Jede Karte wird als Kindknoten dem gameContainer-Element hinzugefügt.
  for (let i = 0; i < size * size; i++) {
    const index = indexes[i];
    const card = cardValues[i];
    const row = Math.floor(index / size) + 1;
    const column = (index % size) + 1;
    gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${card.name}" style="grid-row: ${row}; grid-column: ${column}">
        <div class="card-before">?</div>
        <div class="card-after">
          <img src="${card.image}" class="image"/>
        </div>
      </div>
    `;
  }
  //Dieser Codeblock ändert die CSS-Regel grid-template-columns des gameContainer-Elements, um die Anzahl der Spalten im Raster entsprechend der ausgewählten Größe size zu setzen. Das repeat()-CSS-Funktion wiederholt die Spaltenanweisung auto size-mal. Mit anderen Worten, diese Zeile sorgt dafür, dass das Spielfeld eine feste Anzahl von Spalten hat, die auf die Größe des Spielfelds angepasst werden.
  gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

  //Dieser Codeblock definiert ein Event-Handler, der beim Klicken auf eine Karte aufgerufen wird. Es beginnt damit, alle Karten zu sammeln, indem es die querySelectorAll()-Methode auf dem Dokument aufruft, um alle Elemente mit der Klasse card-container auszuwählen. Die gefundenen Karten werden dann in die cards-Variable gespeichert.

  // Als nächstes wird ein Event-Listener auf jedes Karten-Element in der cards-Liste hinzugefügt. Wenn eine Karte angeklickt wird, prüft der Event-Listener, ob die Klasse matched auf der Karte nicht vorhanden ist. Wenn sie vorhanden ist, wurde die Karte bereits gefunden und kann nicht noch einmal gefunden werden. Wenn die Klasse matched nicht vorhanden ist, wird die Klasse flipped auf die Karte angewendet, um sie umzudrehen.

  // Wenn dies die erste Karte ist, die umgedreht wird (!firstCard), wird das firstCard-Feld auf diese Karte gesetzt, und das firstCardValue-Feld wird auf den Wert des data-card-value-Attributs der Karte gesetzt. Das Attribut wird mit der getAttribute()-Methode abgerufen.

  // Wenn dies nicht die erste Karte ist, die umgedreht wird, erhöht der Event-Listener die Anzahl der Züge, indem er die movesCounter()-Funktion aufruft. Die secondCard-Variable wird auf die angeklickte Karte gesetzt, und der Wert des data-card-value-Attributs wird in der secondCardValue-Variablen gespeichert.
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) {
        card.classList.add("flipped");
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");

          //Wenn dies nicht die erste Karte ist, die umgedreht wird, wird der Code in diesem Block ausgeführt. Zunächst wird die Anzahl der Züge mit der movesCounter()-Funktion erhöht, da der Spieler einen zweiten Zug macht.

          // Dann wird die secondCard-Variable auf die angeklickte Karte gesetzt, und der Wert des data-card-value-Attributs wird in der secondCardValue-Variablen gespeichert.

          // Wenn der Wert des data-card-value-Attributs der ersten Karte gleich dem Wert des data-card-value-Attributs der zweiten Karte ist, bedeutet dies, dass der Spieler ein Paar gefunden hat. Daher wird der matched-Klasse auf beiden Karten hinzugefügt, um anzuzeigen, dass sie gefunden wurden.

          // Die firstCard-Variable wird auf false gesetzt, um die Suche nach einer neuen ersten Karte zu ermöglichen. Außerdem wird der winCount erhöht, um zu verfolgen, wie viele Paare der Spieler gefunden hat. Wenn der winCount gleich der Hälfte der Anzahl von Karten in cardValues ist, hat der Spieler alle Kartenpaare gefunden und das Spiel gewonnen. In diesem Fall wird das result-Element aktualisiert, um dies anzuzeigen, und die stopGame()-Funktion wird aufgerufen, um das Spiel anzuhalten.
        } else {
          movesCounter();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            winCount += 1;
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won!</h2>
              <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }

            //Dieser Code-Block wird ausgeführt, wenn der Spieler eine zweite Karte umdreht. Zunächst wird die Anzahl der Züge mit der Funktion movesCounter() erhöht, da der Spieler einen zweiten Zug macht.

            // Dann wird die secondCard-Variable auf die angeklickte Karte gesetzt, und der Wert des data-card-value-Attributs wird in der secondCardValue-Variablen gespeichert.

            // Wenn der Wert des data-card-value-Attributs der ersten Karte gleich dem Wert des data-card-value-Attributs der zweiten Karte ist, bedeutet dies, dass der Spieler ein Paar gefunden hat. Daher wird der matched-Klasse auf beiden Karten hinzugefügt, um anzuzeigen, dass sie gefunden wurden.

            // Die firstCard-Variable wird auf false gesetzt, um die Suche nach einer neuen ersten Karte zu ermöglichen. Außerdem wird der winCount erhöht, um zu verfolgen, wie viele Paare der Spieler gefunden hat. Wenn der winCount gleich der Hälfte der Anzahl von Karten in cardValues ist, hat der Spieler alle Kartenpaare gefunden und das Spiel gewonnen. In diesem Fall wird das result-Element aktualisiert, um dies anzuzeigen, und die stopGame()-Funktion wird aufgerufen, um das Spiel anzuhalten.
          } else {
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Dieser Codeblock enthält einen Event Listener, der auf den Klick des Start-Buttons reagiert. Wenn der Start-Button geklickt wird, wird zunächst movesCount auf 0 und time auf 0 gesetzt. Dann werden die CSS-Klassen "hide" von controls entfernt und zu stopButton hinzugefügt, um sie auszublenden und den Start-Button auszublenden.

// Der timeGenerator wird dann mit setInterval() aufgerufen, um die Zeit im Spiel zu aktualisieren. Die Anzahl der Züge wird auf der Seite mit der movesCounter()-Funktion aktualisiert.

// Schließlich wird die initializer()-Funktion aufgerufen, um das Spiel zu initialisieren und das Spielfeld anzuzeigen.
startButton.addEventListener("click", () => {
  movesCount = 0;
  time = 0;
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
  initializer();
});

//Dieser Codeabschnitt definiert ein Event-Listener für den "stopButton". Wenn der "stopButton" geklickt wird, wird die stopGame()-Funktion aufgerufen. Diese Funktion macht die Steuerelemente wieder sichtbar, indem sie der "controls"-Klasse die "hide"-Klasse entfernt und die "startButton"- und "stopButton"-Elemente wieder sichtbar macht, indem sie die "hide"-Klasse entfernt. Außerdem wird das Interval, das von der setInterval()-Funktion erstellt wurde, gestoppt, indem die clearInterval()-Funktion aufgerufen wird.
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Diese Funktion initialisiert das Spiel, indem sie das result-Element leert, den winCount auf 0 setzt und eine zufällige Auswahl von Karten mithilfe der generateRandom()-Funktion erstellt. Anschließend wird die matrixGenerator()-Funktion aufgerufen, um das Spielbrett zu generieren und die Karten anzuzeigen.
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
