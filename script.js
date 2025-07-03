const cardsContainer = document.getElementById('cards-container');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const currentEl = document.getElementById('current');
const showBtn = document.getElementById('show');
const hideBtn = document.getElementById('hide');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const addCardBtn = document.getElementById('add-card');
const clearBtn = document.getElementById('clear');
const addContainer = document.getElementById('add-container');
const setSelector = document.getElementById('set-selector');
const createSetBtn = document.getElementById('create-set');

// Keep track of current card and current set
let currentActiveCard = 0;
let currentSet = '';

// Store DOM cards
const cardsEl = [];

// Store card data
let cardSets = getCardSets();

// Create all cards for the selected set
function createCards() {
  // Clear existing cards
  cardsContainer.innerHTML = '';
  cardsEl.length = 0; // Reset the cardsEl array
  currentActiveCard = 0; // Reset the current active card

  const cardsData = cardSets[currentSet] || [];
  cardsData.forEach((data, index) => createCard(data, index));
}

// Create a single card in DOM
function createCard(data, index) {
  const card = document.createElement('div');
  card.classList.add('card');

  if (index === 0) {
    card.classList.add('active');
  }

  card.innerHTML = `
  <div class="inner-card">
    <div class="inner-card-front">
      <p>${data.question}</p>
    </div>
    <div class="inner-card-back">
      <p>${data.answer}</p>
    </div>
  </div>
  `;

  card.addEventListener('click', () => card.classList.toggle('show-answer'));

  // Add to DOM cards
  cardsEl.push(card);
  cardsContainer.appendChild(card);

  updateCurrentText();
}

// Show number of cards
function updateCurrentText() {
  currentEl.innerText = `${currentActiveCard + 1}/${cardsEl.length}`;
}

// Get card sets from local storage
function getCardSets() {
  const sets = JSON.parse(localStorage.getItem('cardSets'));
  return sets === null ? {} : sets;
}

// Add card sets to local storage
function setCardSets(sets) {
  localStorage.setItem('cardSets', JSON.stringify(sets));
}

// Create initial cards
createCards();

// Populate set selector
function populateSetSelector() {
  setSelector.innerHTML = '<option value="">Select a Set</option>'; // Reset options
  for (const set in cardSets) {
    const option = document.createElement('option');
    option.value = set;
    option.textContent = set;
    setSelector.appendChild(option);
  }
}

// Event listeners

// Set selector change
setSelector.addEventListener('change', (e) => {
  currentSet = e.target.value;
  createCards();
});

// Create new set
createSetBtn.addEventListener('click', () => {
  const newSetName = prompt('Enter the name of the new set:');
  if (newSetName && !cardSets[newSetName]) {
    cardSets[newSetName] = [];
    setCardSets(cardSets);
    populateSetSelector();
    currentSet = newSetName;
    createCards();
  } else {
    alert('Set name is either empty or already exists.');
  }
});

// Next button
nextBtn.addEventListener('click', () => {
  if (currentActiveCard < cardsEl.length - 1) {
    cardsEl[currentActiveCard].className = 'card left';
    currentActiveCard++;
    cardsEl[currentActiveCard].className = 'card active';
    updateCurrentText();
  }
});

// Prev button
prevBtn.addEventListener('click', () => {
  if (currentActiveCard > 0) {
    cardsEl[currentActiveCard].className = 'card right';
    currentActiveCard--;
    cardsEl[currentActiveCard].className = 'card active';
    updateCurrentText();
  }
});

// Show add container
showBtn.addEventListener('click', () => addContainer.classList.add('show'));

// Hide add container
hideBtn.addEventListener('click', () => addContainer.classList.remove('show'));

// Add new card
addCardBtn.addEventListener('click', () => {
  const question = questionEl.value;
  const answer = answerEl.value;

  if (question.trim() && answer.trim() && currentSet) {
    const newCard = { question, answer };

    // Create card in DOM
    createCard(newCard, cardsEl.length);
    questionEl.value = '';
    answerEl.value = '';
    addContainer.classList.remove('show');

    // Add new card to the current set
    cardSets[currentSet].push(newCard);
    setCardSets(cardSets);
  } else {
    alert('Please enter a question and answer, and select a set.');
  }
});

// Clear cards button
clearBtn.addEventListener('click', () => {
  if (currentSet) {
    cardSets[currentSet] = [];
    setCardSets(cardSets);
    createCards();
  } else {
    alert('Please select a set to clear.');
  }
});

// Populate the set selector on page load
populateSetSelector();
