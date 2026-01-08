/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // loop over each item in the data
    for (let game of games) {
        // check if game is funded or not
        const funded = game.goal < game.pledged;

        // create a new div element, which will become the game card
        const gameCard = document.createElement("div");

        // add the class game-card to the list
        gameCard.classList.add("game-card");
        gameCard.classList.add(`${funded ? "funded" : "unfunded"}`);

        /* set the inner HTML using a template literal to display some info 
        about each game */
        gameCard.innerHTML = `
                <img class="game-img" src="${game.img}" alt="">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
        `
        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
// calling the function after sorting on chalange 7 below.


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalcontributions = GAMES_JSON.reduce((accumulator, cuurentGame) => {
    return accumulator + cuurentGame.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = totalcontributions.toLocaleString("en-US");

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaisedAmount = GAMES_JSON.reduce((accumulator, cuurentGame) => {
    return accumulator + cuurentGame.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = "$" + totalRaisedAmount.toLocaleString("en-US");

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = GAMES_JSON.length;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unFundedGames = GAMES_JSON.filter(game => game.goal > game.pledged);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unFundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.goal < game.pledged);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// count the number of unfunded games
const unfundedGamesNumber = GAMES_JSON.reduce((acc, cur) => {
    return cur.goal > cur.pledged ? acc + 1 : acc;
}, 0);

// create a new DOM element containing the template string and append it to the description container
const currentSituationElement = document.createElement("p");

// a string that explains the number of unfunded games using the ternary operator

const totalGameWord = GAMES_JSON.length === 1 ? "game" : "games";
const unfundedGameWord = unfundedGamesNumber === 1 ? "game" : "games";
const verb = unfundedGamesNumber === 1 ? "remains" : "remain";

currentSituationElement.textContent =
    `A total of $${totalRaisedAmount.toLocaleString("en-US")} has been raised for ${GAMES_JSON.length} ${totalGameWord}. Currently, ${unfundedGamesNumber} ${unfundedGameWord} ${verb} unfunded. We need your help to fund these amazing ${totalGameWord}!`;

descriptionContainer.appendChild(currentSituationElement);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
    return item2.pledged - item1.pledged;
});

// initial render of addGamesToPage() function after sorting GAMES_JSON
addGamesToPage(GAMES_JSON);

// use destructuring and the spread operator to grab the first and second games
const [topFundedGame, runnerUpGame] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topFundedGameElement = document.createElement("p");
topFundedGameElement.textContent = topFundedGame.name;

firstGameContainer.appendChild(topFundedGameElement);

// do the same for the runner up item
const runnerUpGameElement = document.createElement("p");
runnerUpGameElement.textContent = runnerUpGame.name;

secondGameContainer.appendChild(runnerUpGameElement);

/*****************************************************************************
 * Customizations: Adding some improvements to the site:
 * -> Go to top button
 * Skills used: DOM manipulation, ternary operator, event listeners, arrow function
*/

const goTopBtn = document.getElementById("go-top");

// show go to top button only after scrolling
window.addEventListener("scroll", () => {
    goTopBtn.style.display =
        window.scrollY > 300 ? "block" : "none";
});

// scroll up smoothly when clicked
goTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
})

// Adding current year to the footer
document.getElementById("year").textContent = new Date().getFullYear();