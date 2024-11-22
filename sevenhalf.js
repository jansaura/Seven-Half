// Card Deck
const suits = ['heart', 'diamond', 'club', 'spade'];
const values = ['2', '3', '4', '5', '6', '7', 'J', 'Q', 'K', 'A']; 

// Function to create a full deck of cards with appropriate points
function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            let points = 0;
            if (value === 'J' || value === 'Q' || value === 'K') {
                points = 0.5; 
            } else if (value === 'A') {
                points = 1; 
            } else {
                points = parseInt(value); 
            }
            deck.push({ suit, value, points });
        }
    }
    return deck;
}

// Function to select a random card from the deck
function getRandomCard(deck) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randomIndex];
    deck.splice(randomIndex, 1); 
    return card;
}

// Function to render a card in the cards-el <p> element
function renderCard(card) {
    const cardEl = document.createElement('span'); 
    cardEl.classList.add('card', `suit-${card.suit}`); 
    cardEl.textContent = card.value; 
    document.getElementById('cards-el').appendChild(cardEl); 
}

// Initialize the game variables
let deck = createDeck();
let playerSum = 0;
let playerBudget = 0;
let playerBet = 0;
let playerNickname = '';
let dealerSum = 0;
let isGameOver = false;

// Helper function to reset the game to the initial state
function resetToInitialState() {
    // Reset all game-related variables
    deck = createDeck();
    playerSum = 0;
    dealerSum = 0;
    isGameOver = false;

    // Clear all displayed elements
    document.getElementById('cards-el').innerHTML = 'Cards:';
    document.getElementById('sum-el').textContent = 'Sum:';
    document.getElementById('player-el').textContent = '';
    document.getElementById('message-el').textContent = 'Want to play a round?';

    // Hide unnecessary elements
    document.getElementById('nickname-input').style.display = 'none';
    document.getElementById('submit-nickname').style.display = 'none';
    document.getElementById('budget-input').style.display = 'none';
    document.getElementById('submit-budget').style.display = 'none';
    document.getElementById('bet-input').style.display = 'none';
    document.getElementById('submit-bet').style.display = 'none';
    document.getElementById('new').style.display = 'none';
    document.getElementById('stay').style.display = 'none';

    // Show the Start Game button
    document.getElementById('start').style.display = 'block';

    // Clear dealer's section if it exists
    const dealerSection = document.getElementById('dealer-section');
    if (dealerSection) {
        dealerSection.innerHTML = '';
    }
}

// Helper function to reset the game
function resetGame() {
    deck = createDeck();
    playerSum = 0;
    dealerSum = 0; 
    isGameOver = false;

    // Clear player's cards and sum
    document.getElementById('cards-el').innerHTML = 'Cards: ';
    document.getElementById('sum-el').textContent = 'Sum: 0';

    // Clear dealer's cards and sum
    const dealerSection = document.getElementById('dealer-section');
    if (dealerSection) {
        dealerSection.innerHTML = '';
    }

    document.getElementById('message-el').textContent = 'Want to play a round?';

    document.getElementById('new').style.display = 'none';
    document.getElementById('stay').style.display = 'none';
}

// Start Game button event listener
document.getElementById('start').addEventListener('click', () => {
    document.getElementById('message-el').textContent = "Choose your username";
    document.getElementById('nickname-input').style.display = 'block';
    document.getElementById('submit-nickname').style.display = 'block';
    document.getElementById('start').style.display = 'none';
});

// Submit nickname button
document.getElementById('submit-nickname').addEventListener('click', () => {
    const nicknameInput = document.getElementById('nickname-input').value;
    if (nicknameInput.trim() !== '') {
        playerNickname = nicknameInput;
        document.getElementById('player-el').textContent = `Player: ${playerNickname}`;
        document.getElementById('nickname-input').style.display = 'none';
        document.getElementById('submit-nickname').style.display = 'none';

        document.getElementById('message-el').textContent = "Introduce your budget";
        document.getElementById('budget-input').style.display = 'block';
        document.getElementById('submit-budget').style.display = 'block';
    } else {
        alert('Please enter a valid username.');
    }
});

// Submit budget button
document.getElementById('submit-budget').addEventListener('click', () => {
    const budgetInput = parseInt(document.getElementById('budget-input').value);
    if (!isNaN(budgetInput) && budgetInput > 0) {
        playerBudget = budgetInput;
        document.getElementById('budget-input').style.display = 'none';
        document.getElementById('submit-budget').style.display = 'none';

        document.getElementById('message-el').textContent = "How much do you want to bet?";
        document.getElementById('bet-input').style.display = 'block';
        document.getElementById('submit-bet').style.display = 'block';
        document.getElementById('player-el').textContent += ` | Budget: ${playerBudget}`;
    } else {
        alert('Please enter a valid budget.');
    }
});

// Place bet button
document.getElementById('submit-bet').addEventListener('click', () => {
    const betInput = parseInt(document.getElementById('bet-input').value);
    if (!isNaN(betInput) && betInput > 0 && betInput <= playerBudget) {
        playerBet = betInput;
        document.getElementById('bet-input').style.display = 'none';
        document.getElementById('submit-bet').style.display = 'none';

        document.getElementById('message-el').textContent = "Game started! Draw a new card or stay.";
        startRound();
    } else {
        alert('Please enter a valid bet within your budget.');
    }
});

// Helper function to start a round
function startRound() {
    resetGame();
    document.getElementById('new').style.display = 'block'; 
    document.getElementById('stay').style.display = 'block'; 

    const initialCard = getRandomCard(deck);
    renderCard(initialCard);
    playerSum += initialCard.points;
    document.getElementById('sum-el').textContent = `Sum: ${playerSum}`;

    document.getElementById('message-el').textContent = "Game started! Draw a new card or stay.";
}

// New Card button event listener
document.getElementById('new').addEventListener('click', () => {
    if (!isGameOver) {
        if (deck.length > 0) {
            const newCard = getRandomCard(deck);
            renderCard(newCard);
            playerSum += newCard.points;
            document.getElementById('sum-el').textContent = `Sum: ${playerSum}`;

            if (playerSum > 7.5) {
                document.getElementById('message-el').textContent = 'You went over 7.5! You lose!';
                playerBudget -= playerBet;
                document.getElementById('player-el').textContent = `Player: ${playerNickname} | Budget: ${playerBudget}`;
                isGameOver = true;
                askForAnotherRound();
            }
        } else {
            document.getElementById('message-el').textContent = 'No more cards in the deck!';
        }
    }
});

// Stay button event listener
document.getElementById('stay').addEventListener('click', () => {
    if (!isGameOver) {
        document.getElementById('new').style.display = 'none'; 
        document.getElementById('stay').style.display = 'none'; 
        dealerPlay(); 
    }
});

// Dealer play logic
function dealerPlay() {
    document.getElementById('message-el').textContent = "Dealer's turn...";

    // Create/clear the dealer's section
    let dealerSection = document.getElementById('dealer-section');
    if (!dealerSection) {
        dealerSection = document.createElement('div');
        dealerSection.id = 'dealer-section';
        document.body.appendChild(dealerSection);
    } else {
        dealerSection.innerHTML = ''; 
    }

    // Create cards and sum containers
    const dealerCardsEl = document.createElement('div');
    dealerCardsEl.id = 'dealer-cards-el';
    dealerCardsEl.innerHTML = '<strong>Dealer\'s Cards:</strong>';
    dealerSection.appendChild(dealerCardsEl);

    const dealerSumEl = document.createElement('div');
    dealerSumEl.id = 'dealer-sum-el';
    dealerSumEl.innerHTML = '<strong>Dealer\'s Sum:</strong> 0';
    dealerSection.appendChild(dealerSumEl);

    // Simulate the dealer drawing cards
    let dealerInterval = setInterval(() => {
        if (dealerSum < 5 || (dealerSum < playerSum && dealerSum < 7.5)) {
            const dealerCard = getRandomCard(deck);
            dealerSum += dealerCard.points;

            // Render the dealer's card in the card container
            const cardEl = document.createElement('span');
            cardEl.classList.add('card', `suit-${dealerCard.suit}`);
            cardEl.textContent = dealerCard.value;
            dealerCardsEl.appendChild(cardEl);

            // Update dealer sum
            dealerSumEl.innerHTML = `<strong>Dealer's Sum:</strong> ${dealerSum.toFixed(1)}`;

            if (dealerSum > 7.5) {
                clearInterval(dealerInterval);
                document.getElementById('message-el').textContent = 'Dealer went over 7.5! You win!';
                playerBudget += playerBet;
                document.getElementById('player-el').textContent = `Player: ${playerNickname} | Budget: ${playerBudget}`;
                askForAnotherRound();
            }
        } else {
            clearInterval(dealerInterval);
            determineWinner();
        }
    }, 1000);
}

// Determine winner
function determineWinner() {
    if (dealerSum > playerSum) {
        document.getElementById('message-el').textContent = `Dealer wins with ${dealerSum.toFixed(1)}!`;
        playerBudget -= playerBet;
    } else if (dealerSum === playerSum) {
        document.getElementById('message-el').textContent = `It's a tie! Dealer has ${dealerSum.toFixed(1)}.`;
    } else {
        document.getElementById('message-el').textContent = `You win! Dealer has ${dealerSum.toFixed(1)}.`;
        playerBudget += playerBet;
    }
    document.getElementById('player-el').textContent = `Player: ${playerNickname} | Budget: ${playerBudget}`;
    askForAnotherRound();
}

// Ask for another round
function askForAnotherRound() {
    const playAgainMessage = document.createElement('div');
    playAgainMessage.innerHTML = `
        <p>Do you want to play another round?</p>
        <button id="play-again">Yes</button>
        <button id="end-game">No</button>
    `;
    document.body.appendChild(playAgainMessage);

    // Event listener for playing again
    document.getElementById('play-again').addEventListener('click', () => {
        document.body.removeChild(playAgainMessage); 
        document.getElementById('bet-input').style.display = 'block';
        document.getElementById('submit-bet').style.display = 'block';
        resetGame(); 
    });

    // Event listener for ending the game
    document.getElementById('end-game').addEventListener('click', () => {
        document.body.removeChild(playAgainMessage); 
        resetToInitialState(); 
    });
}
