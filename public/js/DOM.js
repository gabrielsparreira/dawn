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


export { createButtons };
