export default class Clicker {
    constructor(baseResourceAmount) {
      this.baseResourceAmount = baseResourceAmount;
    }
  
    getResourceAmount() {
      // Calculate the amount of resources generated per click, considering upgrades, etc.
      // For now, return the baseResourceAmount
      return this.baseResourceAmount;
    }
  
    gatherResources(resources) {
      // Get the amount of resources to add from the Clicker
      const amount = this.getResourceAmount();
      resources.food.quantity += amount;
      resources.materials.quantity += amount * 0.8;
      resources.luxuries.quantity += amount * 0.6;
      resources.science.quantity += amount * 0.4;
    }
}
  