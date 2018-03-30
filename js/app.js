/**
 * Create a list that holds all of your cards
 */
const numberOfPairsToWin = 8;

let pairs = 0;              //pairs matched
let cardsSelected = [];     //array of cards selected, max length is 2
let counter = 0;            //counter of moves
let numberOfStars = 3;      //rating of the player, dependant of moves
let arrayOfCards = ['gem', 'gem', 'plane', 'plane', 'anchor', 'anchor', 'bolt', 'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb'];
let seconds = 0;            //total seconds of the actual game
let myTimer;                //variable that hold the timer
let firstCard = true;       //Keep track of the cards to start the timer
let newArray;               //Holds the current shuffle of the cards

//To start shuffle and populate the deck
newGame(true);

/**
* Takes an array of cards and populate the html with them
*/
function populateDeck(array) {
    for (let i = 0; i < array.length; i++) {
        let html = '<li class="card"><i class="'
        switch (array[i]) {
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
}

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


/**
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

//Add Event Listener to the cards indeck
document.querySelector('.deck').addEventListener('click', function(event) {
    //Check if first card clicked to start the timer
    if (firstCard) {
        myTimer = setInterval(timer, 1000);

        firstCard = false;
    }
    const card = event.target;
    if (card && card.nodeName == 'LI') {
        //Check if the card is not matched, open of if there are 2 cards already selected
        //before calling the showCard function and checking for matches
        if (!card.classList.contains('open') && !card.classList.contains('match') && cardsSelected.length < 2) {
            showCard(card);
            if (checkForMatch(card)) {
                pairs ++;
                //Check if all the cards have been matched
                if (pairs === numberOfPairsToWin) {
                    endGame();

                }
            }


        }
    }
});

/**
* Take a card as a parameter and display it to the user
*/
function showCard(card) {
    const listOfClasses = card.classList;
    listOfClasses.add('open');
    listOfClasses.add('show');
    console.log(listOfClasses);
}

/**
* Take a card as a parameter and hide it to the user
*/
function hideCard(card) {
    const listOfClasses = card.classList;
    listOfClasses.remove('open');
    listOfClasses.remove('show');
    listOfClasses.remove('red');
    listOfClasses.remove('swing');
    console.log(listOfClasses);
}

/**
* Take a list of two matched cards and lock them in matched state
*/
function matchCards(cards) {
    window.setTimeout(function () {
        listOfClasses = cards[0].classList;
        listOfClasses.remove('open');
        listOfClasses.remove('show');
        listOfClasses.remove('swingY');
        listOfClasses.add('match');

        listOfClasses = cards[1].classList;
        listOfClasses.remove('open');
        listOfClasses.remove('show');
        listOfClasses.remove('swingY');
        listOfClasses.add('match');
    }, 1000);
    cards[0].classList.add('swingY');
    cards[1].classList.add('swingY');
}

/**
* Takes a card as a parameter and push it to cardsSelected array
* If we have already two cards in the array check for match.
*/
function checkForMatch(card) {
    cardsSelected.push(card);

    //If there is just 1 card in cardsSelected do nothing else.
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
            cardsSelected[0].classList.add('red');
            cardsSelected[1].classList.add('red');
            cardsSelected[0].classList.add('swing');
            cardsSelected[1].classList.add('swing');

            return false;
        }
    }
}

/**
* Increment counter of moves and update the UI for moves and stars
*/
function incrementCounter() {
    counter++;
    document.querySelector('.moves').textContent = counter;
    
    //Update stars if necessary
    if (counter === 11) {
        document.querySelector('.stars').lastElementChild.innerHTML = '<li><i class="far fa-star"></i></li>';
        numberOfStars = 2;
    }

    if (counter === 21) {
        document.querySelector('.stars').firstElementChild.nextElementSibling.innerHTML = '<li><i class="far fa-star"></i></li>';
        numberOfStars = 1;
    }

    if (counter === 31) {
        document.querySelector('.stars').firstElementChild.innerHTML = '<li><i class="far fa-star"></i></li>';
        numberOfStars = 0;
    }
}

/**
* Update info of the game and show the win screen
*/
function endGame() {
    window.setTimeout(function () {
        window.clearInterval(myTimer);
        document.querySelector('.move').textContent = counter;
        document.querySelector('.star').textContent = numberOfStars;

        const minutes = getFormattedMinutes();

        document.querySelector('.minutesWin').innerHTML = minutes;
        document.querySelector('.secondsWin').innerHTML = getFormattedSeconds(minutes);

        document.querySelector('.deck').style.display = "none";
        document.querySelector('.win').style.display = "flex";
    }, 2000);
    
    for (let i = 0; i < allCards.length; i++) {
        allCards[i].classList.add('hidden');
    }
}

/**
* Takes shuffleCards as a parameter, if true we shuffled the cards and if false we play the same deck
* Restart all of the stats for a new game
*/
function newGame(shuffleCards) {
    counter = 0;
    pairs = 0;
    numberOfStars = 3;
    cardsSelected = [];
    seconds = 0;
    firstCard = true;
    window.clearInterval(myTimer);

    document.querySelector('.deck').innerHTML = "";

    if (shuffleCards) {
        newArray = shuffle(arrayOfCards);
        populateDeck(newArray);
    } else {
        document.querySelector('.deck').innerHTML = "";
        populateDeck(newArray);
    }
    
    //Update moves to 0
    document.querySelector('.moves').textContent = counter;

    //show 3 stars
    const parent = document.querySelector('.stars');

    parent.firstElementChild.innerHTML = '<li><i class="fas fa-star"></i></li>';
    parent.firstElementChild.nextElementSibling.innerHTML = '<li><i class="fas fa-star"></i></li>';
    parent.lastElementChild.innerHTML = '<li><i class="fas fa-star"></i></li>';

    //show correct screen
    document.querySelector('.deck').style.display = "flex";
    document.querySelector('.win').style.display = "none";
}

//Listeners for new and same game for all the buttons

document.querySelector('.newGame').addEventListener('click', function() {
    newGame(true);
});

document.querySelector('.sameGame').addEventListener('click', function() {
    newGame(false);
});

document.querySelector('.buttonNewGame').addEventListener('click', function() {
    newGame(true);
});

document.querySelector('.sameAgain').addEventListener('click', function(event) {
    event.preventDefault();
    newGame(false);
});

/**
* Function that is call every 1 second and updates the UI
*/
function timer() {
    const minutes = getFormattedMinutes();

    document.querySelector('.minutes').innerHTML = minutes;
    document.querySelector('.seconds').innerHTML = getFormattedSeconds(minutes);

    seconds++;
}

/**
* Return a string of two digit minutes
*/
function getFormattedMinutes() {
    let minutes = Math.floor(seconds / 60);

    return ("0" + minutes).slice(-2);
}

/**
* Return a string of two digit seconds
*/
function getFormattedSeconds(minutes) {
    let secundero = seconds - minutes * 60;

    return ("0" + secundero).slice(-2);
}