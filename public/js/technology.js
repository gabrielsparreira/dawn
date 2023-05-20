class Technology {
    constructor(id, name, description, cost, prerequisites) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.baseCost = cost;
      this.costMod = [1,1,1,1];
      this.prerequisites = prerequisites;
      this.researched = false;
    }
  
    research() {
      this.researched = true;
    }
  
    isResearched() {
      return this.researched;
    }
  }