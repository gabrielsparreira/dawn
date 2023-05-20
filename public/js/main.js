import Game from './game.js';
import { createButtons } from './DOM.js';


const targetFPS = 60;
let lastUpdateTime = performance.now();
let eventsInitialized = false;

Game.createGame().then(game => {
  // Your game instance is ready to use.
  function gameLoop() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastUpdateTime) / 1000; // Convert milliseconds to seconds
    lastUpdateTime = currentTime;
  
    // Call your update method with deltaTime
    game.update(deltaTime);
    updateResourceTable(game);
  
  
    // Use setTimeout instead of setInterval to ensure consistent update intervals
    setTimeout(gameLoop, 60000 / targetFPS);
  }

  //Constructing the DOM
  createButtons(game.units, (id, action) => {}, "game-container");
    
  if (!eventsInitialized) {
    const resourceButton = document.getElementById('resource-button');
  
  resourceButton.addEventListener('click', () => {
    // Call the gatherResources method
    game.clicker.gatherResources(game.resources);
    updateResourceTable(game);
  });
  
  // Add event listeners for each unit
  game.units.forEach(unit => {
    const unitId = unit.id;
    const buyUnitButton = document.getElementById(`buyUnitButton-${unitId}`);
    const sellUnitButton = document.getElementById(`sellUnitButton-${unitId}`);
  
    if (buyUnitButton) {
      buyUnitButton.addEventListener('click', () => {
        game.buyUnit(unitId);
      });
    } else {
      console.warn(`Buy button not found for unit with ID: ${unitId}`);
    }
  
    if (sellUnitButton) {
      sellUnitButton.addEventListener('click', () => {
        game.sellUnit(unitId);
      });
    } else {
      console.warn(`Sell button not found for unit with ID: ${unitId}`);
    }
  });  
    
    // Add event listeners for each building
    game.buildings.forEach(building => {
      const buildingId = building.id;
      const buyBuildingButton = document.getElementById(`buyBuildingButton-${buildingId}`);
      const sellBuildingButton = document.getElementById(`sellBuildingButton-${buildingId}`);
    
      if (buyBuildingButton) {
        buyBuildingButton.addEventListener('click', () => {
          game.buyBuilding(buildingId);
        });
      } else {
        console.warn(`Buy button not found for building with ID: ${buildingId}`);
      }
    
      if (sellBuildingButton) {
        sellBuildingButton.addEventListener('click', () => {
          game.sellBuilding(buildingId);
        });
      } else {
        console.warn(`Sell button not found for building with ID: ${buildingId}`);
      }
    });
    eventsInitialized = true;
  }
    
  
    // Updating resource table
    function updateResourceTable(game) {
      const tableBody = document.getElementById('resourceTableBody');
    
      // Clear the table body
      tableBody.innerHTML = '';
    
      // Add a row for each resource
      for (const resourceKey in game.resources) {
        const resource = game.resources[resourceKey];
    
        // Skip the population resource for this loop
        if (resourceKey === 'population') continue;
    
        const row = document.createElement('tr');
    
        const nameCell = document.createElement('td');
        nameCell.innerText = resource.name;
        row.appendChild(nameCell);
    
        const quantityCell = document.createElement('td');
        quantityCell.innerText = Math.floor(resource.quantity);
        row.appendChild(quantityCell);
    
        const productionCell = document.createElement('td');
        productionCell.innerText = resource.getProductionPerSecond().toFixed(2);
        row.appendChild(productionCell);
    
        tableBody.appendChild(row);
      }
    
      // Add a row for the population resource
      const population = game.resources.population;
      const populationRow = document.createElement('tr');
    
      const nameCell = document.createElement('td');
      nameCell.innerText = population.name;
      populationRow.appendChild(nameCell);
    
      const quantityCell = document.createElement('td');
      quantityCell.innerText = `${population.quantity}/${population.maxStorage}`;
      populationRow.appendChild(quantityCell);
    
      const debuffCell = document.createElement('td');
      if (population.quantity > population.maxStorage) {
        debuffCell.innerText = 'Debuff active';
      } else {
        debuffCell.innerText = 'No debuff';
      }
      populationRow.appendChild(debuffCell);
    
      tableBody.appendChild(populationRow);
  }
    
  // Start the game loop
  gameLoop();
  //console.log("Game instance:", game);
});