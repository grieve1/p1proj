const searchButton = document.getElementById("search");
const genreDropdown = document.getElementById("genre");
const searchResults = document.getElementById("search-results");
const button = document.getElementById('search')

button.addEventListener('mouseenter', changeColor);
button.addEventListener('mouseleave', revertColor);

searchButton.addEventListener('click', e => {
    e.preventDefault();
    const selectedGenre = genreDropdown.value;
  
    fetch(`https://www.cheapshark.com/api/1.0/games?title=${selectedGenre}`)
      .then(response => response.json())
      .then(data => {
        console.log(data); // just for testing
        // code to display the search results
        searchResults.innerHTML = ''; // clear previous results
        for (const game of data) {
          const gameRow = document.createElement('div');
          gameRow.className = 'game-row';
          
          const thumbnail = document.createElement('img');
          thumbnail.src = game.thumb;
          thumbnail.alt = game.external;
          gameRow.appendChild(thumbnail);
          
          const title = document.createElement('h3');
          title.innerText = game.external;
          gameRow.appendChild(title);
          
          const price = document.createElement('p');
          price.innerText = `Price: ${game.cheapest}`;
          gameRow.appendChild(price);
          
          const buyLink = document.createElement('a');
          const steamStoreID = 1;
          if (game.steamAppID !== null) {
            buyLink.href = `https://store.steampowered.com/app/${game.steamAppID}/?utm_source=cheapshark&utm_medium=referral&utm_campaign=cheapshark`;
          } else {
            buyLink.href = game.link;
          }
          buyLink.target = '_blank';
          buyLink.innerText = 'Buy now';
          gameRow.appendChild(buyLink);
          
          searchResults.appendChild(gameRow);
        }
      })
      .catch(error => {
        console.log('ERROR:', error);
    });
});

function changeColor(event) {
    const cardButton = event.target;
    cardButton.style["background-color"] = "#ff0000";
    cardButton.style.color = "#fff";
}

function revertColor(event) {
    const cardButton = event.target;
    cardButton.style["background-color"] = "#333";
    cardButton.style.color = "fff";
}
