function inicio(){
// Game state
    const gameState = {
      mode: 'single', // 'single' or 'two'
      isPlaying: false,
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      totalPairs: 0,
      currentPlayer: 1,
      scores: {
        player1: 0,
        player2: 0
      },
      timerInterval: null,
      startTime: 0,
      elapsedTime: 0
    };
    
    // Audio elements
    const successAudio = new Audio('http://localhost/juego3/audios/logro.mp3');
    const errorAudio = new Audio('http://localhost/juego3/audios/error2.mp3');
    
    
    // DOM elements
    const gameBoardEl = document.getElementById('game-board');
    const singlePlayerBtn = document.getElementById('single-player-btn');
    const twoPlayerBtn = document.getElementById('two-player-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const scoreboardEl = document.getElementById('scoreboard');
    const timerDisplayEl = document.getElementById('timer-display');
    const timerEl = document.getElementById('timer');
    const player1ScoreEl = document.getElementById('player1-score');
    const player2ScoreEl = document.getElementById('player2-score');
    const currentPlayerEl = document.getElementById('current-player');
    const player1ContainerEl = document.getElementById('player1-container');
    const player2ContainerEl = document.getElementById('player2-container');
    const feedbackMessageEl = document.getElementById('feedback-message');
    const victoryOverlayEl = document.getElementById('victory-overlay');
    const victoryTitleEl = document.getElementById('victory-title');
    const victoryMessageEl = document.getElementById('victory-message');
    const singlePlayerResultsEl = document.getElementById('single-player-results');
    const twoPlayerResultsEl = document.getElementById('two-player-results');
    const finalTimeEl = document.getElementById('final-time');
    const finalP1ScoreEl = document.getElementById('final-p1-score');
    const finalP2ScoreEl = document.getElementById('final-p2-score');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    // Card vocabulary pairs - images and words
    const vocabularyPairs = [
      { word: 'cat', image: 'http://localhost/juego3/imagenes/cat.jpg' },
      { word: 'dog', image: 'http://localhost/juego3/imagenes/dog.png' },
      { word: 'bird', image: 'http://localhost/juego3/imagenes/bird.png' },
      { word: 'fish', image: 'http://localhost/juego3/imagenes/fish.jpg' },
      { word: 'apple', image: 'http://localhost/juego3/imagenes/apple.jpg' },
      { word: 'banana', image: 'http://localhost/juego3/imagenes/banana.jpg' },
      { word: 'book', image: 'http://localhost/juego3/imagenes/book.png' },
      { word: 'chair', image: 'http://localhost/juego3/imagenes/chair.jpg' },
      { word: 'house', image: 'http://localhost/juego3/imagenes/house.png' },
      { word: 'car', image: 'http://localhost/juego3/imagenes/car.jpg' },
      { word: 'tree', image: 'http://localhost/juego3/imagenes/tree.jpg' },
      { word: 'sun', image: 'http://localhost/juego3/imagenes/sun.jpg' },
      { word: 'moon', image: 'http://localhost/juego3/imagenes/moon.jpg' },
      { word: 'star', image: 'http://localhost/juego3/imagenes/star.jpg' },
      { word: 'flower', image: 'http://localhost/juego3/imagenes/flower.jpg' },
      { word: 'water', image: 'http://localhost/juego3/imagenes/water.jpg' },
      { word: 'ball', image: 'http://localhost/juego3/imagenes/ball.jpg' },
      { word: 'hat', image: 'http://localhost/juego3/imagenes/hat.jpg' },
      { word: 'shoe', image: 'http://localhost/juego3/imagenes/shoe.jpg' },
      { word: 'pencil', image: 'http://localhost/juego3/imagenes/pencil.png' },
      { word: 'clock', image: 'http://localhost/juego3/imagenes/clock.jpg' },
    ];
    
    // Event listeners
    singlePlayerBtn.addEventListener('click', () => setGameMode('single'));
    twoPlayerBtn.addEventListener('click', () => setGameMode('two'));
    startGameBtn.addEventListener('click', startGame);
    restartGameBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', hideVictoryAndReset);
    
    // Preload audio
    function preloadAudio() {
      successAudio.load();
      errorAudio.load();
    }
    
    // Set game mode
    function setGameMode(mode) {
      gameState.mode = mode;
      
      // Update UI for game mode
      if (mode === 'single') {
        singlePlayerBtn.classList.add('bg-indigo-600', 'text-white');
        singlePlayerBtn.classList.remove('bg-gray-300', 'text-gray-700');
        twoPlayerBtn.classList.add('bg-gray-300', 'text-gray-700');
        twoPlayerBtn.classList.remove('bg-indigo-600', 'text-white');
        scoreboardEl.classList.add('hidden');
        timerDisplayEl.classList.remove('hidden');
      } else {
        twoPlayerBtn.classList.add('bg-indigo-600', 'text-white');
        twoPlayerBtn.classList.remove('bg-gray-300', 'text-gray-700');
        singlePlayerBtn.classList.add('bg-gray-300', 'text-gray-700');
        singlePlayerBtn.classList.remove('bg-indigo-600', 'text-white');
        scoreboardEl.classList.remove('hidden');
        timerDisplayEl.classList.add('hidden');
      }
    }
    
    // Start game
    function startGame() {
      gameState.isPlaying = true;
      gameState.matchedPairs = 0;
      gameState.flippedCards = [];
      gameState.scores = { player1: 0, player2: 0 };
      gameState.currentPlayer = 1;
      
      // Clear board and generate cards
      gameBoardEl.innerHTML = '';
      generateCards();
      
      // Update UI for game start
      startGameBtn.disabled = true;
      startGameBtn.classList.add('opacity-50', 'cursor-not-allowed');
      
      // Set up player UI
      if (gameState.mode === 'two') {
        updateScoreboard();
        updatePlayerTurn();
      } else {
        startTimer();
      }
    }
    
    // Generate cards
    function generateCards() {
      // Select a subset of vocabulary pairs for the game (you can adjust the number)
      const selectedPairs = [...vocabularyPairs]
        .sort(() => 0.5 - Math.random())
        .slice(0, 12); // Use 12 pairs (24 cards)
      
      gameState.totalPairs = selectedPairs.length;
      
      // Create array with image and word cards
      const cards = [];
      selectedPairs.forEach(pair => {
        cards.push({
          id: `${pair.word}-image`,
          type: 'image',
          content: pair.image,
          match: `${pair.word}-word`
        });
        
        cards.push({
          id: `${pair.word}-word`,
          type: 'word',
          content: pair.word,
          match: `${pair.word}-image`
        });
      });
      
      // Shuffle cards
      gameState.cards = shuffleArray(cards);
      
      // Render cards
      gameState.cards.forEach(card => {
        const cardEl = createCardElement(card);
        gameBoardEl.appendChild(cardEl);
      });
    }
    
    // Create card element
    function createCardElement(card) {
      const cardEl = document.createElement('div');
      cardEl.className = 'card aspect-square';
      cardEl.dataset.id = card.id;
      
      const cardInnerEl = document.createElement('div');
      cardInnerEl.className = 'card-inner relative w-full h-full';
      
      const cardFrontEl = document.createElement('div');
      cardFrontEl.className = 'card-front';
      cardFrontEl.innerHTML = '<i class="fas fa-question"></i>';
      
      const cardBackEl = document.createElement('div');
      cardBackEl.className = `card-back ${card.type === 'word' ? 'word' : ''}`;
      
      if (card.type === 'image') {
        const imgEl = document.createElement('img');
        imgEl.src = card.content;
        imgEl.alt = card.id;
        cardBackEl.appendChild(imgEl);
      } else {
        cardBackEl.textContent = card.content;
      }
      
      cardInnerEl.appendChild(cardFrontEl);
      cardInnerEl.appendChild(cardBackEl);
      cardEl.appendChild(cardInnerEl);
      
      // Add click handler
      cardEl.addEventListener('click', () => handleCardClick(cardEl, card));
      
      return cardEl;
    }
    
    // Handle card click
    function handleCardClick(cardEl, card) {
      // Prevent clicking if game is not playing or card is already flipped or matched
      if (!gameState.isPlaying || 
          cardEl.classList.contains('flipped') || 
          gameState.flippedCards.length >= 2) {
        return;
      }
      
      // Flip card
      cardEl.classList.add('flipped');
      gameState.flippedCards.push({ element: cardEl, card: card });
      
      // Check for match if 2 cards are flipped
      if (gameState.flippedCards.length === 2) {
        const card1 = gameState.flippedCards[0].card;
        const card2 = gameState.flippedCards[1].card;
        
        if (card1.match === card2.id && card2.match === card1.id) {
          // Match found
          setTimeout(() => {
            handleMatch();
          }, 500);
        } else {
          // No match
          setTimeout(() => {
            handleMismatch();
          }, 1000);
        }
      }
    }
    
    // Handle matching cards
    function handleMatch() {
      successAudio.play();
      showFeedbackMessage('¡Buen trabajo!', 'success');
      
      const card1El = gameState.flippedCards[0].element;
      const card2El = gameState.flippedCards[1].element;
      
      // Add matched class and fade out
      card1El.classList.add('animate__animated', 'animate__fadeOut');
      card2El.classList.add('animate__animated', 'animate__fadeOut');
      
      setTimeout(() => {
        card1El.style.visibility = 'hidden';
        card2El.style.visibility = 'hidden';
      }, 1000);
      
      gameState.matchedPairs++;
      
      // Update score for current player in 2-player mode
      if (gameState.mode === 'two') {
        if (gameState.currentPlayer === 1) {
          gameState.scores.player1++;
        } else {
          gameState.scores.player2++;
        }
        updateScoreboard();
      }
      
      // Reset flipped cards
      gameState.flippedCards = [];
      
      // Check for game end
      if (gameState.matchedPairs === gameState.totalPairs) {
        endGame();
      }
    }
    
    // Handle mismatched cards
    function handleMismatch() {
      errorAudio.play();
      showFeedbackMessage('¡Intenta de nuevo!', 'error');
      
      const card1El = gameState.flippedCards[0].element;
      const card2El = gameState.flippedCards[1].element;
      
      // Flip cards back
      card1El.classList.remove('flipped');
      card2El.classList.remove('flipped');
      
      // Switch player in 2-player mode
      if (gameState.mode === 'two') {
        gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
        updatePlayerTurn();
      }
      
      // Reset flipped cards
      gameState.flippedCards = [];
    }
    
    // Show feedback message
    function showFeedbackMessage(message, type) {
      feedbackMessageEl.textContent = message;
      feedbackMessageEl.className = `feedback-message ${type}`;
      feedbackMessageEl.classList.add('show');
      
      setTimeout(() => {
        feedbackMessageEl.classList.remove('show');
      }, 1000);
    }
    
    // Update scoreboard
    function updateScoreboard() {
      player1ScoreEl.textContent = gameState.scores.player1;
      player2ScoreEl.textContent = gameState.scores.player2;
      finalP1ScoreEl.textContent = gameState.scores.player1;
      finalP2ScoreEl.textContent = gameState.scores.player2;
    }
    
    // Update player turn
    function updatePlayerTurn() {
      currentPlayerEl.textContent = `Jugador ${gameState.currentPlayer}`;
      
      // Highlight current player
      if (gameState.currentPlayer === 1) {
        player1ContainerEl.classList.add('highlight');
        player2ContainerEl.classList.remove('highlight');
      } else {
        player2ContainerEl.classList.add('highlight');
        player1ContainerEl.classList.remove('highlight');
      }
    }
    
    // Timer functions
    function startTimer() {
      gameState.startTime = Date.now();
      gameState.timerInterval = setInterval(updateTimer, 1000);
      updateTimer();
    }
    
    function updateTimer() {
      const elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
      gameState.elapsedTime = elapsedSeconds;
      
      const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
      const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
      
      timerEl.textContent = `${minutes}:${seconds}`;
      finalTimeEl.textContent = `${minutes}:${seconds}`;
    }
    
    function stopTimer() {
      clearInterval(gameState.timerInterval);
    }
    
    // End game
    function endGame() {
      gameState.isPlaying = false;
      
      if (gameState.mode === 'single') {
        stopTimer();
        
        // Show single player victory
        victoryTitleEl.textContent = '¡Felicidades!';
        victoryMessageEl.textContent = 'Has completado el juego de memoria';
        
        singlePlayerResultsEl.classList.remove('hidden');
        twoPlayerResultsEl.classList.add('hidden');
      } else {
        // Determine winner for two player mode
        let winnerMessage;
        
        if (gameState.scores.player1 > gameState.scores.player2) {
          winnerMessage = '¡Jugador 1 gana!';
        } else if (gameState.scores.player2 > gameState.scores.player1) {
          winnerMessage = '¡Jugador 2 gana!';
        } else {
          winnerMessage = '¡Es un empate!';
        }
        
        victoryTitleEl.textContent = '¡Juego terminado!';
        victoryMessageEl.textContent = winnerMessage;
        
        singlePlayerResultsEl.classList.add('hidden');
        twoPlayerResultsEl.classList.remove('hidden');
      }
      
      // Show victory overlay with animation
      setTimeout(() => {
        victoryOverlayEl.classList.add('show');
        createConfetti();
      }, 1000);
      
      // Enable start button
      startGameBtn.disabled = false;
      startGameBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    // Reset game
    function resetGame() {
      // Stop timer if running
      if (gameState.timerInterval) {
        stopTimer();
      }
      
      // Reset state
      gameState.isPlaying = false;
      gameState.matchedPairs = 0;
      gameState.flippedCards = [];
      gameState.scores = { player1: 0, player2: 0 };
      gameState.currentPlayer = 1;
      
      // Reset UI
      gameBoardEl.innerHTML = '<div class="card-placeholder text-center p-12 bg-gray-200 text-gray-500 rounded-lg"><i class="fas fa-dice-d6 text-4xl mb-2"></i><p>Presiona "Comenzar" para jugar</p></div>';
      
      // Enable start button
      startGameBtn.disabled = false;
      startGameBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      
      // Reset player UI
      if (gameState.mode === 'two') {
        updateScoreboard();
        updatePlayerTurn();
      }
      
      // Reset timer display
      timerEl.textContent = '00:00';
    }
    
    // Hide victory overlay and reset game
    function hideVictoryAndReset() {
      victoryOverlayEl.classList.remove('show');
      resetGame();
    }
    
    // Create confetti effect
    function createConfetti() {
      const confettiCount = 100;
      const container = document.body;
      
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties
        const size = Math.random() * 10 + 5;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        
        // Random position
        const left = Math.random() * 100;
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${left}%`;
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.position = 'fixed';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        
        container.appendChild(confetti);
        
        // Create keyframe animation for this confetti
        const animationName = `fall-${i}`;
        const keyframes = `
          @keyframes ${animationName} {
            0% {
              transform: translateY(-10px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg);
              opacity: 0;
            }
          }
        `;
        
        const style = document.createElement('style');
        style.innerHTML = keyframes;
        document.head.appendChild(style);
        
        confetti.style.animation = `${animationName} ${Math.random() * 3 + 2}s linear forwards`;
        
        // Remove confetti after animation
        setTimeout(() => {
          confetti.remove();
          style.remove();
        }, 5000);
      }
    }
    
    // Helper function to shuffle array
    function shuffleArray(array) {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    }
    
    // Initialize game
    function init() {
      preloadAudio();
      setGameMode('single');
    }
    
    // Start initialization
    init();
    }