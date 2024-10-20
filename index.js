document.addEventListener("DOMContentLoaded", () => {
    const postsRow = document.getElementById("posts_row");
    const addPostForm = document.getElementById("add_post_form");
    
    // Fetch and display games
    function fetchGames() {
      fetch('db.json')
        .then(response => response.json())
        .then(data => {
          postsRow.innerHTML = ''; // Clear previous content
          data.games.forEach(game => {
            const gameCard = createGameCard(game);
            postsRow.appendChild(gameCard);
          });
        })
        .catch(error => console.error('Error fetching games:', error));
    }
  
    // Create a new game card
    function createGameCard(game) {
      const col = document.createElement("div");
      col.classList.add("col-md-4");
      col.innerHTML = `
        <div class="card">
          <img src="${game.img_url}" class="card-img-top" alt="${game.gamename}">
          <div class="card-body">
            <h5 class="card-title">${game.gamename}</h5>
            <p class="card-text">${game.description}</p>
            <a href="${game.game_url}" class="btn btn-primary">Play Now</a>
            <button class="btn btn-danger" onclick="deleteGame('${game.id}')">Delete</button>
            <button class="btn btn-secondary" onclick="editGame('${game.id}')">Edit</button>
          </div>
        </div>
      `;
      return col;
    }
  
    // Add new post (simulate POST request)
    addPostForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newGame = {
        gamename: document.getElementById('gameName').value,
        author: document.getElementById('author').value,
        email: document.getElementById('email').value,
        game_url: document.getElementById('gameUrl').value,
        date: document.getElementById('date').value,
        img_url: document.getElementById('imageUrl').value,
        description: document.getElementById('description').value,
        id: Math.random().toString(36).substr(2, 9) // Random ID
      };
      fetch('https://ride-7dku.onrender.com/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGame),
      })
      .then(response => response.json())
      .then(data => {
        document.getElementById('message').textContent = "Game added successfully!";
        fetchGames(); // Refresh games list
      })
      .catch(error => console.error('Error adding game:', error));
      
    });
  
    // Delete a game (simulate DELETE request)
    window.deleteGame = (id) => {
      if (confirm('Are you sure you want to delete this game?')) {
        fetch(`https://ride-7dku.onrender.com/games/${id}`, {
            method: 'DELETE',
          })
          .then(response => response.json())
          .then(() => {
            fetchGames(); // Refresh games list
          })
          .catch(error => console.error('Error deleting game:', error));
          
      }
    };
  
    // Edit a game (simulate PUT request)
    window.editGame = (id) => {
      // Fetch the game by ID and populate the form (similar to adding post)
      fetch(`https://ride-7dku.onrender.com/games/${id}`)
        .then(response => response.json())
        .then(game => {
          document.getElementById('gameName').value = game.gamename;
          document.getElementById('author').value = game.author;
          document.getElementById('email').value = game.email;
          document.getElementById('gameUrl').value = game.game_url;
          document.getElementById('date').value = game.date;
          document.getElementById('imageUrl').value = game.img_url;
          document.getElementById('description').value = game.description;
          // Change form submit action to update instead of create
          addPostForm.removeEventListener('submit', addPostForm.submit);

          addPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateGame(id);
          });
        })
        .catch(error => console.error('Error fetching game:', error));
    };
  
    // Update game (simulate PUT request)
    function updateGame(id) {
      const updatedGame = {
        gamename: document.getElementById('gameName').value,
        author: document.getElementById('author').value,
        email: document.getElementById('email').value,
        game_url: document.getElementById('gameUrl').value,
        date: document.getElementById('date').value,
        img_url: document.getElementById('imageUrl').value,
        description: document.getElementById('description').value,
      };
  
      fetch(`https://ride-7dku.onrender.com/games/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGame),
      })
      .then(response => response.json())
      .then(() => {
        document.getElementById('message').textContent = "Game updated successfully!";
        fetchGames(); // Refresh games list
      })
      .catch(error => console.error('Error updating game:', error));
      
    }
  
    // Initial fetch to display games
    fetchGames();
  });
  