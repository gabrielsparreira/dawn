export class Unit {
    constructor(id, name, description, initialQuantity, popCount, initialCost, prerequisite, foodProduction, materialsProduction, luxuriesProduction, scienceProduction, military) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.quantity = initialQuantity;
      this.popCount = popCount;
      this.baseCost = initialCost;
      this.prerequisite = prerequisite;
      this.foodProduction = foodProduction;
      this.materialsProduction = materialsProduction;
      this.luxuriesProduction = luxuriesProduction;
      this.scienceProduction = scienceProduction;
      this.military = military;
      this.costMod = [1,1,1,1];
      this.prodMod = [1,1,1,1];
    }
  
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
    
    setQuantity(quantity) {
        this.quantity = quantity;
    }

    increaseQuantity(value) {
        this.quantity += value;
    }

    decreaseQuantity(value) {
        this.quantity -= value;
    }
    
    getPopCount() {
        return this.popCount * this.quantity;
    }
    
    getBaseCost() {
        return this.baseCost;
    }

    getCost() {
        let cost = [];
        for (let i = 0; i < 4; i++) {
            cost[i] = this.getBaseCost()[i] * this.getCostMod()[i];
        }
        return cost;
    }

    getRefundAmount() {
        let refundAmount = [];
        for (let i = 0; i < this.baseCost.length; i++) {
            // Calculate the refund amount for each resource type (e.g., food, materials, luxuries, science)
            // Here we assume a 50% refund rate, but you can adjust this value to your preference
            refundAmount[i] = this.baseCost[i] * this.costMod[i] * 0.5;
        }
        return refundAmount;
    }
    
    
    getPrerequisite() {
        return this.prerequisite;
    }
    
    getFoodProduction() {
        return this.foodProduction * this.prodMod[0] * this.quantity;
    }
    
    getMaterialsProduction() {
        return this.materialsProduction * this.prodMod[1] * this.quantity;
    }
    
    getLuxuriesProduction() {
        return this.luxuriesProduction * this.prodMod[2] * this.quantity;
    }
    
    getScienceProduction() {
        return this.scienceProduction * this.prodMod[3] * this.quantity;
    }
    
    getMilitary() {
        return this.military * this.quantity;
    }
    
    getCostMod() {
        return this.costMod;
    }
    
    setCostMod(index, value) {
        this.costMod[index] = value;
    }
    
    getProdMod() {
        return this.prodMod;
    }
    
    setProdMod(index, value) {
        this.prodMod[index] = value;
    }
}
  