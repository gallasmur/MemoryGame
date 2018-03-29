/*
 * Create a list that holds all of your cards
 */
const numberOfPairsToWin = 8;

let pairs = 0;
let cardsSelected = [];
let counter = 0;
let arrayOfCards = ['gem', 'gem', 'plane', 'plane', 'anchor', 'anchor', 'bolt', 'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb'];

let newArray = shuffle(arrayOfCards);
for (let i = 0; i < newArray.length; i++) {
    let html = '<li class="card"><i class="'
    switch(newArray[i]) {
        case 'gem':
            html += 'far fa-gem';
            break;
        case 'plane':
            html += 'far fa-paper-plane';
            break;
        case 'anchor':
            html += 'fas fa-anchor';
            break;
        case 'bolt':
            html += 'fas fa-bolt';
            break;
        case 'cube':
            html += 'fas fa-cube';
            break;
        case 'leaf':
            html += 'fas fa-leaf';
            break;
        case 'bicycle':
            html += 'fas fa-bicycle';
            break;
        case 'bomb':
            html += 'fas fa-bomb';
            break;
    }
    html += '"></i></li>';

    const deck = document.querySelector('.deck');
    deck.insertAdjacentHTML('beforeend', html);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const allCards = document.querySelectorAll('.card');

document.querySelector('.deck').addEventListener('click', function(event) {
    const card = event.target;
    if (card && card.nodeName == 'LI') {
        //Comprobar que no está matcheada o abierta para continuar, si lo esta no hacer nada
        //Tambien comprabar que no hay ya 2 cartas seleccionadas
        if (!card.classList.contains('open') && !card.classList.contains('match') && cardsSelected.length < 2) {
            showCard(card);
            if (checkForMatch(card)) {
                pairs ++;
                if (pairs === numberOfPairsToWin) {
                    document.querySelector('.deck').style.display = "none";
                    document.querySelector('.win').style.display = "block";
                }
            }


        }
    }
});

function showCard(card) {
    const listOfClasses = card.classList;
    listOfClasses.add('open');
    listOfClasses.add('show');
    console.log(listOfClasses);
}

function hideCard(card) {
    const listOfClasses = card.classList;
    listOfClasses.remove('open');
    listOfClasses.remove('show');
    console.log(listOfClasses);
}

function matchCards(cards) {
    let listOfClasses = cards[0].classList;
    listOfClasses.remove('open');
    listOfClasses.remove('show');
    listOfClasses.add('match');

    listOfClasses = cards[1].classList;
    listOfClasses.remove('open');
    listOfClasses.remove('show');
    listOfClasses.add('match');
}

function checkForMatch(card) {
    cardsSelected.push(card);
    if (cardsSelected.length === 2) {
        incrementCounter();

        if (cardsSelected[0].innerHTML === cardsSelected[1].innerHTML) {
            matchCards(cardsSelected);
            cardsSelected = [];

            return true;
        } else {
            window.setTimeout(function () {
                hideCard(cardsSelected[0]);
                hideCard(cardsSelected[1]);
                cardsSelected = [];
            }, 500);

            return false;
        }
    }
}

function incrementCounter() {
    counter++;
    document.querySelector('.moves').textContent = counter;
}