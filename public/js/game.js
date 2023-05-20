import Clicker from './clicker.js';
import { Resource, FoodResource, MaterialsResource, LuxuriesResource, ScienceResource, PopulationResource } from './resources.js';
import { Unit } from './unit.js';
import { Building } from './building.js';
import DataHandler from './dataHandler.js';

export default class Game {
    constructor() {
        this.dataHandler = new DataHandler;
        this.clicker = new Clicker(1); // Initialize Clicker with baseResourceAmount of 1
        // Initialize resources, units, buildings, and other game properties
        this.resources = {
          food: null,
          materials: null,
          luxuries: null,
          science: null,
        };
    
        this.units = [];
        this.buildings = [];
    
        //this.loadData();
    }

    static async createGame() {
        const game = new Game();
        await game.initializeData();
        return game;
    }
    
    async initializeData() {
        // Call instantiating functions
        await this.createResources();
        await this.createUnits();    
        await this.createBuildings();
    }
    
    async createResources() {
        // Fetch data from DataHandler
        const data = await this.dataHandler.fetchResources();
        // Find the resource data for each type
        const populationData = data.find(resource => resource.id === 'population');
        //console.log(populationData);
        const foodData = data.find(resource => resource.id === 'food');
        const materialsData = data.find(resource => resource.id === 'materials');
        const luxuriesData = data.find(resource => resource.id === 'luxuries');
        const scienceData = data.find(resource => resource.id === 'science');
      
        // Instantiate resources and add them to the game instance
        this.resources.science = new ScienceResource(
            scienceData.id,
            scienceData.name,
            scienceData.description,
            scienceData.initialQuantity,
            scienceData.initialMaxStorage,
            scienceData.initialProductionPerSecond,
            scienceData.spilloverMod
        );
      
        this.resources.luxuries = new LuxuriesResource(
            luxuriesData.id,
            luxuriesData.name,
            luxuriesData.description,
            luxuriesData.initialQuantity,
            luxuriesData.initialMaxStorage,
            luxuriesData.initialProductionPerSecond,
            luxuriesData.spilloverMod,
            this.resources.science
        );
      
        this.resources.materials = new MaterialsResource(
            materialsData.id,
            materialsData.name,
            materialsData.description,
            materialsData.initialQuantity,
            materialsData.initialMaxStorage,
            materialsData.initialProductionPerSecond,
            materialsData.spilloverMod,
            this.resources.luxuries
        );
      
        this.resources.food = new FoodResource(
            foodData.id,
            foodData.name,
            foodData.description,
            foodData.initialQuantity,
            foodData.initialMaxStorage,
            foodData.initialProductionPerSecond,
            foodData.spilloverMod,
            this.resources.materials
        );

        this.resources.population = new PopulationResource(
            populationData.id,
            populationData.name,
            populationData.description,
            populationData.initialQuantity,
            populationData.initialMaxStorage,
            this.resources.food
        );
    }
    
    async createUnits() {
        // Fetch data from DataHandler
        const data = await this.dataHandler.fetchUnits();
        // Instantiate units and add them to the game instance
        for (const unitData of data) {
            const unit = new Unit(
                unitData.id,
                unitData.name,
                unitData.description,
                unitData.initialQuantity,
                unitData.popCount,
                unitData.initialCost,
                unitData.prerequisite,
                unitData.foodProduction,
                unitData.materialsProduction,
                unitData.luxuriesProduction,
                unitData.scienceProduction,
                unitData.military
            );
            this.units.push(unit);
        }
        //console.log("Units array:", this.units);
    }
    
    async createBuildings() {
        // Fetch data from DataHandler
        const data = await this.dataHandler.fetchBuildings();
        // Instantiate buildings and add them to the game instance
        for (const buildingData of data) {
            const building = new Building(
                buildingData.id,
                buildingData.name,
                buildingData.description,
                buildingData.popValue,
                buildingData.initialQuantity,
                buildingData.initialCost,
                buildingData.prerequisites,
                buildingData.foodProduction,
                buildingData.materialsProduction,
                buildingData.luxuriesProduction,
                buildingData.scienceProduction,
                buildingData.military
            );
            this.buildings.push(building);
        }
    }
  
    update(deltaTime) {   
        //console.log(this.units);
        // Update resource production based on units and buildings
        this.updateResourceProduction();
        
        // Update resources
        this.resources.population.update(deltaTime);
        this.resources.food.update(deltaTime);
        this.resources.materials.update(deltaTime);
        this.resources.luxuries.update(deltaTime);
        this.resources.science.update(deltaTime);
    }
      
    updateResourceProduction = () => {
        let totalPopCount = 0;
        let totalMaxPopulation = 0;
        let totalFoodProduction = 0;
        let totalMaterialsProduction = 0;
        let totalLuxuriesProduction = 0;
        let totalScienceProduction = 0;

        //console.log(this.units.length);
      
        for (const unit of this.units) {
            totalPopCount += unit.getPopCount();
            totalFoodProduction += unit.getFoodProduction();
            totalMaterialsProduction += unit.getMaterialsProduction();
            totalLuxuriesProduction += unit.getLuxuriesProduction();
            totalScienceProduction += unit.getScienceProduction();
            }
        
      
        for (const building of this.buildings) {
            totalMaxPopulation += building.getPopValue();
            totalFoodProduction += building.getFoodProduction();
            totalMaterialsProduction += building.getMaterialsProduction();
            totalLuxuriesProduction += building.getLuxuriesProduction();
            totalScienceProduction += building.getScienceProduction();
        }
        
        this.resources.population.setQuantity(totalPopCount);
        this.resources.population.setMaxStorage(totalMaxPopulation);
        this.resources.science.setProductionPerSecond(totalScienceProduction);
        this.resources.luxuries.setProductionPerSecond(totalLuxuriesProduction);
        this.resources.materials.setProductionPerSecond(totalMaterialsProduction);
        this.resources.food.setProductionPerSecond(totalFoodProduction);
    }      

    buyUnit(unitId) {
        const unit = this.units.find(u => u.id === unitId);
        if (unit && this.canAfford(unit.getCost())) {
          this.subtractResources(unit.getCost());
          unit.increaseQuantity(1);
          // Any additional logic or side effects of buying a unit
        }
    }
    
    sellUnit(unitId) {
        const unit = this.units.find(u => u.id === unitId);
        if (unit && unit.quantity > 0) {
          this.addResources(unit.getRefundAmount());
          unit.decreaseQuantity(1);
          // Any additional logic or side effects of selling a unit
        }
    }
    
    buyBuilding(buildingId) {
        const building = this.buildings.find(b => b.id === buildingId);
        if (building && this.canAfford(building.getCost())) {
          this.subtractResources(building.getCost());
          building.quantity += 1;
          // Any additional logic or side effects of buying a building
        }
    }
    
    sellBuilding(buildingId) {
        const building = this.buildings.find(b => b.id === buildingId);
        if (building && building.quantity > 0) {
          this.addResources(building.getRefundAmount());
          building.quantity -= 1;
          // Any additional logic or side effects of selling a building
        }
    }
    
    // Helper methods to check affordability and update resources
    canAfford(cost) {
        // Check if you have enough resources to afford the cost
        // Assuming cost is an array [foodCost, materialsCost, luxuriesCost, scienceCost]
        return this.resources.food.quantity >= cost[0]
          && this.resources.materials.quantity >= cost[1]
          && this.resources.luxuries.quantity >= cost[2]
          && this.resources.science.quantity >= cost[3];
    }
    
    subtractResources(cost) {
        this.resources.food.quantity -= cost[0];
        this.resources.materials.quantity -= cost[1];
        this.resources.luxuries.quantity -= cost[2];
        this.resources.science.quantity -= cost[3];
    }
    
    addResources(refund) {
        this.resources.food.quantity += refund[0];
        this.resources.materials.quantity += refund[1];
        this.resources.luxuries.quantity += refund[2];
        this.resources.science.quantity += refund[3];
    }
}