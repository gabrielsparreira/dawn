class DataHandler {
    constructor() {
      this.cache = new Map();
      this.uri = '../data/';
    }
  
    async fetchData(url) {
      if (!this.cache.has(url)) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
          }
          const data = await response.json();
          this.cache.set(url, data);
        } catch (error) {
          console.error(error);
          return null;
        }
      }
      return this.cache.get(url);
    }

    async fetchResources() {
        const url = this.uri + 'resources.json';
        return await this.fetchData(url);
      }
  
    async fetchUnits() {
      const url = this.uri + 'units.json';
      return await this.fetchData(url);
    }
  
    async fetchBuildings() {
      const url = this.uri + 'buildings.json';
      return await this.fetchData(url);
    }
  
    // Add more methods for other data sources as needed
}
  
export default DataHandler;
  