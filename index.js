const searchButton = document.getElementById("search");
const genreDropdown = document.getElementById("genre");
const searchResults = document.getElementById("search-results");
const costInput = document.getElementById("cost");
const releaseDateInput = document.getElementById("release-date");

searchButton.addEventListener("click", (event) => {
  event.preventDefault();

  // Get search parameters
  const selectedGenre = genreDropdown.value;
  const maxCost = parseFloat(costInput.value) || 0;
  const releaseDate = releaseDateInput.value;

  // Prepare API URL
  let apiUrl = `https://www.cheapshark.com/api/1.0/games?title=${selectedGenre}`;
  if (maxCost > 0) {
    apiUrl += `&maxPrice=${maxCost}`;
  }

  // Fetch game data
  fetch(apiUrl)
    .then((response) => response.json())
    .then((games) => {
      // Filter games by release date (if specified)
      let filteredGames = games;
      if (releaseDate) {
        filteredGames = games.filter((game) => game.releaseDate === releaseDate);
        if (filteredGames.length === 0) {
          searchResults.innerHTML = "no games found for selected release date.";
          return;
        }
      }

      // Filter games by max cost (if specified)
      if (maxCost > 0) {
        filteredGames = filteredGames.filter((game) => parseFloat(game.cheapest) <= maxCost);
        if (filteredGames.length === 0) {
          searchResults.innerHTML = "no games found within the selected price range.";
          return;
        }
      }

      displayGames(filteredGames);
    })
    .catch((error) => console.error(error));

  function displayGames(games) {
    // Clear previous results
    searchResults.innerHTML = "";

    // Display games
    games.forEach((game) => {
      const gameRow = document.createElement("div");
      gameRow.className = "game-row";

      const title = document.createElement("h3");
      title.innerText = game.external;
      gameRow.appendChild(title);

      const thumbnail = document.createElement("img");
      thumbnail.src = game.thumb;
      thumbnail.alt = game.external;
      thumbnail.style.imageRendering = "crisp-edges";
      thumbnail.width = 460;
      thumbnail.height = 215;
      gameRow.appendChild(thumbnail);

      const price = document.createElement("p");
      price.innerText = `Price: ${game.cheapest}`;
      gameRow.appendChild(price);

      const buyLink = document.createElement("a");
      const steamStoreID = 1;
      if (game.steamAppID !== null) {
        buyLink.href = `https://store.steampowered.com/app/${game.steamAppID}/?utm_source=cheapshark&utm_medium=referral&utm_campaign=cheapshark`;
      } else {
        buyLink.href = game.link;
      }
      buyLink.target = "_blank";
      buyLink.innerText = "buy now on steam";
      gameRow.appendChild(buyLink);

      searchResults.appendChild(gameRow);
    });
  }
})