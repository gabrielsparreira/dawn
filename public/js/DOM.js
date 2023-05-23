function createButtons(data, callback, targetDivId) {
    const targetDiv = document.getElementById(targetDivId);
    if (!targetDiv) {
        console.error(`No div found with ID ${targetDivId}`);
        return;
    }

    data.forEach(item => {
        const container = document.createElement('div');
        const buyButton = document.createElement('button');
        const sellButton = document.createElement('button');

        buyButton.id = `buy${item.constructor.name}Button-${item.id}`;
        buyButton.textContent = `Buy ${item.name}`;
        buyButton.addEventListener('click', () => callback(item.id, 'buy'));

        sellButton.id = `sell${item.constructor.name}Button-${item.id}`;
        sellButton.textContent = `Sell ${item.name}`;
        sellButton.addEventListener('click', () => callback(item.id, 'sell'));

        container.appendChild(buyButton);
        container.appendChild(sellButton);

        targetDiv.appendChild(container);
    });
}

function switchView(viewId, column) {
    // Get an array of all view divs
    const views = document.querySelectorAll(`#${column}-column div`);
    
    // Hide all view divs
    views.forEach(view => view.style.display = 'none');
  
    // Show the selected view
    document.getElementById(viewId).style.display = 'block';
}

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
  


export { createButtons, switchView, updateResourceTable };
