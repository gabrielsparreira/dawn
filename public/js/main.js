import Game from './game.js';
import { createButtons, switchView, updateResourceTable } from './DOM.js';


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
  createButtons(game.units, (id, action) => {}, "units-view");
    
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

  // Start the game loop
  gameLoop();
  //console.log("Game instance:", game);
});