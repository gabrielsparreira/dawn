export class Resource {
    constructor(id, name, description, initialQuantity, initialMaxStorage, initialProductionPerSecond, spilloverMod) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.quantity = initialQuantity;
      this.maxStorage = initialMaxStorage;
      this.productionPerSecond = initialProductionPerSecond;
      this.spilloverMod = spilloverMod;
      this.storageMod = 1;
      this.prodMod = 1;
    }
  
    update(deltaTime) {
        // Check for storage capacity and handle overproduction
        if (this.quantity >= this.maxStorage) {
          this.handleOverproduction(deltaTime);
        } else {
          // Update the resource based on its production rate
          this.quantity += this.getProductionPerSecond() * deltaTime;
        }
    }
  
    handleOverproduction() {
      // Implement logic for handling overproduction based on the resource type
    }
  
    // Getters
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getQuantity() {
        return this.quantity;
    }

    getMaxStorage() {
        return this.maxStorage * this.getStorageMod();
    }

    getProductionPerSecond() {
        return this.productionPerSecond * this.getProdMod();
    }

    getSpilloverMod() {
        return this.spilloverMod;
    }

    getStorageMod() {
        return this.storageMod;
    }

    getProdMod() {
        return this.prodMod;
    }

    // Setters
    setDescription(description) {
        this.description = description;
    }

    setQuantity(quantity) {
        this.quantity = quantity;
    }

    setMaxStorage(maxStorage) {
        this.maxStorage = maxStorage;
    }

    setProductionPerSecond(productionPerSecond) {
        this.productionPerSecond = productionPerSecond;
    }

    setSpilloverMod(spilloverMod) {
        this.spilloverMod = spilloverMod;
    }

    setStorageMod(storageMod) {
        this.storageMod = storageMod;
    }

    setProdMod(prodMod) {
        this.prodMod = prodMod;
    }
}

export class FoodResource extends Resource {
    constructor(id, name, description, initialQuantity, initialMaxStorage, initialProductionPerSecond, spilloverMod, materialsResource) {
      super(id, name, description, initialQuantity, initialMaxStorage, initialProductionPerSecond, spilloverMod);
      this.materialsResource = materialsResource;
    }
  
    handleOverproduction(deltaTime) {
        this.setQuantity(this.maxStorage);
        if (this.materialsResource) {
            const productionToAdd = this.getProductionPerSecond() * this.spilloverMod * deltaTime;
            this.materialsResource.setProductionPerSecond(this.materialsResource.getProductionPerSecond() + productionToAdd);
        }
    }

    applyDebuff(excessPopulation) {
        // Modify the debuff logic based on your game mechanics
        this.prodMod = 1 - (excessPopulation * 0.10); // Example: Reduce the production rate by 10% per excess population
    }
    
    removeDebuff() {
        this.prodMod = 1;
    }
}
  
export class MaterialsResource extends Resource {
    constructor(id, name, description, initialQuantity, initialMaxStorage, initialProductionPerSecond, spilloverMod, luxuriesResource) {
      super(id, name, description, initialQuantity, initialMaxStorage, initialProductionPerSecond, spilloverMod);
      this.luxuriesResource = luxuriesResource;
    }
  
    handleOverproduction(deltaTime) {
        this.setQuantity(this.maxStorage);
        if (this.luxuriesResource) {
            const productionToAdd = this.getProductionPerSecond() * this.spilloverMod * deltaTime;
            this.luxuriesResource.setProductionPerSecond(this.luxuriesResource.getProductionPerSecond() + productionToAdd);
        }
    }
}
  
export class LuxuriesResource extends Resource {
    constructor(id, name, description, initialQuantity, initialMaxStorage, initialProductionPerSecond, spilloverMod, scienceResource) {
      super(id, name, description, initialQuantity, initialMaxStorage, initialProductionPerSecond, spilloverMod);
      this.scienceResource = scienceResource;
    }
  
    handleOverproduction(deltaTime) {
        this.setQuantity(this.maxStorage);
        if (this.scienceResource) {
            const productionToAdd = this.getProductionPerSecond() * this.spilloverMod * deltaTime;
            this.scienceResource.setProductionPerSecond(this.scienceResource.getProductionPerSecond() + productionToAdd);
        }
    }
}

export class ScienceResource extends Resource {
    constructor(id, name, description, initialQuantity, initialProductionPerSecond, spilloverMod) {
        super(id, name, description, initialQuantity, Infinity, initialProductionPerSecond, spilloverMod);
    }
}

export class PopulationResource extends Resource {
    constructor(id, name, description, initialQuantity, initialMaxStorage, foodResource) {
      super(id, name, description, initialQuantity, initialMaxStorage, 0);
      this.foodResource = foodResource;
    }
  
    update() {
      // Check if the quantity is greater than the maxStorage
      if (this.quantity > this.maxStorage) {
        // Apply debuff to food production
        let excessPopulation = this.quantity - this.maxStorage;
        this.foodResource.applyDebuff(excessPopulation);
      } else {
        // Remove debuff from food production if the quantity is within maxStorage
        this.foodResource.removeDebuff();
      }
    }
}
  
  