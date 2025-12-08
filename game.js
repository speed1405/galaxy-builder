// Galaxy Builder - Incremental Game Engine

// Game Configuration
const gameConfig = {
    combatDefeatLossRate: 0.1, // Lose 10% of fleet on combat defeat
    gameLoopInterval: 100, // Game loop update interval in ms
    autoSaveInterval: 30000 // Auto-save interval in ms
};

// Game State
const gameState = {
    resources: {
        metal: 0,
        energy: 0,
        research: 0,
        credits: 100
    },
    buildings: {
        metalMine: 0,
        solarPanel: 0,
        researchLab: 0,
        shipyard: 0,
        tradingPost: 0
    },
    research: {
        basicEngineering: false,
        advancedMaterials: false,
        energyEfficiency: false,
        ionDrive: false,
        plasmaCannons: false,
        shieldTech: false,
        warpDrive: false,
        advancedWeaponry: false,
        nanoTechnology: false,
        quantumPhysics: false
    },
    ships: {
        scout: 0,
        fighter: 0,
        corvette: 0,
        destroyer: 0,
        cruiser: 0,
        battleship: 0
    },
    enemiesDefeated: 0,
    lastUpdate: Date.now()
};

// Building Definitions
const buildings = {
    metalMine: {
        name: 'Metal Mine',
        description: 'Extracts metal from asteroids',
        baseCost: { metal: 10, energy: 5, credits: 20 },
        produces: { metal: 1 },
        costMultiplier: 1.15
    },
    solarPanel: {
        name: 'Solar Panel',
        description: 'Generates energy from nearby stars',
        baseCost: { metal: 15, credits: 15 },
        produces: { energy: 1 },
        costMultiplier: 1.15
    },
    researchLab: {
        name: 'Research Lab',
        description: 'Produces research points',
        baseCost: { metal: 25, energy: 20, credits: 50 },
        produces: { research: 0.5 },
        costMultiplier: 1.2,
        requires: 'basicEngineering'
    },
    shipyard: {
        name: 'Shipyard',
        description: 'Required to build ships',
        baseCost: { metal: 100, energy: 50, credits: 100 },
        produces: {},
        costMultiplier: 1.3,
        requires: 'basicEngineering'
    },
    tradingPost: {
        name: 'Trading Post',
        description: 'Generates credits from trade',
        baseCost: { metal: 50, energy: 30, credits: 50 },
        produces: { credits: 2 },
        costMultiplier: 1.25,
        requires: 'advancedMaterials'
    }
};

// Research Definitions
const research = {
    basicEngineering: {
        name: 'Basic Engineering',
        description: 'Unlock advanced buildings and ship construction',
        cost: { research: 10 }
    },
    advancedMaterials: {
        name: 'Advanced Materials',
        description: 'Improve ship hull strength by 20%',
        cost: { research: 25 },
        requires: 'basicEngineering'
    },
    energyEfficiency: {
        name: 'Energy Efficiency',
        description: 'Reduce building energy costs by 15%',
        cost: { research: 30 },
        requires: 'basicEngineering'
    },
    ionDrive: {
        name: 'Ion Drive',
        description: 'Unlock better ship engines',
        cost: { research: 50 },
        requires: 'advancedMaterials'
    },
    plasmaCannons: {
        name: 'Plasma Cannons',
        description: 'Increase ship attack by 30%',
        cost: { research: 60 },
        requires: 'advancedMaterials'
    },
    shieldTech: {
        name: 'Shield Technology',
        description: 'Add energy shields to ships (+50% defense)',
        cost: { research: 75 },
        requires: 'energyEfficiency'
    },
    warpDrive: {
        name: 'Warp Drive',
        description: 'Unlock warp travel and advanced ships',
        cost: { research: 100 },
        requires: 'ionDrive'
    },
    advancedWeaponry: {
        name: 'Advanced Weaponry',
        description: 'Unlock devastating weapons (+50% attack)',
        cost: { research: 150 },
        requires: 'plasmaCannons'
    },
    nanoTechnology: {
        name: 'Nano Technology',
        description: 'Ships repair during combat',
        cost: { research: 200 },
        requires: 'shieldTech'
    },
    quantumPhysics: {
        name: 'Quantum Physics',
        description: 'Ultimate technology - all bonuses doubled',
        cost: { research: 500 },
        requires: 'warpDrive'
    }
};

// Ship Definitions
const ships = {
    scout: {
        name: 'Scout Ship',
        description: 'Light reconnaissance vessel',
        cost: { metal: 30, energy: 20, credits: 50 },
        power: 5,
        requires: 'basicEngineering'
    },
    fighter: {
        name: 'Fighter',
        description: 'Agile combat spacecraft',
        cost: { metal: 50, energy: 30, credits: 75 },
        power: 15,
        requires: 'basicEngineering'
    },
    corvette: {
        name: 'Corvette',
        description: 'Multi-role combat ship',
        cost: { metal: 100, energy: 60, credits: 150 },
        power: 35,
        requires: 'ionDrive'
    },
    destroyer: {
        name: 'Destroyer',
        description: 'Heavy weapons platform',
        cost: { metal: 200, energy: 120, credits: 300 },
        power: 80,
        requires: 'plasmaCannons'
    },
    cruiser: {
        name: 'Cruiser',
        description: 'Large capital ship',
        cost: { metal: 400, energy: 250, credits: 600 },
        power: 180,
        requires: 'warpDrive'
    },
    battleship: {
        name: 'Battleship',
        description: 'Ultimate war machine',
        cost: { metal: 800, energy: 500, credits: 1200 },
        power: 400,
        requires: 'advancedWeaponry'
    }
};

// Enemy Definitions
const enemies = [
    { name: 'Space Pirates', power: 20, reward: { metal: 50, energy: 30, credits: 100 } },
    { name: 'Rogue Drones', power: 50, reward: { metal: 100, energy: 80, credits: 200 } },
    { name: 'Rebel Fleet', power: 150, reward: { metal: 250, energy: 200, credits: 500 } },
    { name: 'Alien Raiders', power: 300, reward: { metal: 500, energy: 400, credits: 1000 } },
    { name: 'Dark Empire Scout', power: 600, reward: { metal: 1000, energy: 800, credits: 2000 } },
    { name: 'Void Leviathan', power: 1200, reward: { metal: 2500, energy: 2000, credits: 5000 } },
    { name: 'Ancient Guardian', power: 2500, reward: { metal: 5000, energy: 4000, credits: 10000 } }
];

// Calculate building cost with scaling
function getBuildingCost(buildingKey) {
    const building = buildings[buildingKey];
    const count = gameState.buildings[buildingKey];
    const cost = {};
    
    for (const [resource, amount] of Object.entries(building.baseCost)) {
        cost[resource] = Math.floor(amount * Math.pow(building.costMultiplier, count));
    }
    
    return cost;
}

// Check if player can afford a cost
function canAfford(cost) {
    for (const [resource, amount] of Object.entries(cost)) {
        if (gameState.resources[resource] < amount) {
            return false;
        }
    }
    return true;
}

// Deduct resources
function deductResources(cost) {
    for (const [resource, amount] of Object.entries(cost)) {
        gameState.resources[resource] -= amount;
    }
}

// Check if research requirements are met
function meetsRequirements(requires) {
    if (!requires) return true;
    return gameState.research[requires] === true;
}

// Calculate production rates
function calculateProduction() {
    const production = { metal: 0, energy: 0, research: 0, credits: 0 };
    
    for (const [buildingKey, count] of Object.entries(gameState.buildings)) {
        const building = buildings[buildingKey];
        for (const [resource, amount] of Object.entries(building.produces)) {
            production[resource] += amount * count;
        }
    }
    
    return production;
}

// Calculate fleet power
function calculateFleetPower() {
    let power = 0;
    
    for (const [shipKey, count] of Object.entries(gameState.ships)) {
        const ship = ships[shipKey];
        power += ship.power * count;
    }
    
    // Apply research bonuses
    if (gameState.research.advancedMaterials) power *= 1.2;
    if (gameState.research.plasmaCannons) power *= 1.3;
    if (gameState.research.shieldTech) power *= 1.5;
    if (gameState.research.advancedWeaponry) power *= 1.5;
    if (gameState.research.quantumPhysics) power *= 2;
    
    return Math.floor(power);
}

// Build a building
function buildBuilding(buildingKey) {
    const building = buildings[buildingKey];
    const cost = getBuildingCost(buildingKey);
    
    if (!meetsRequirements(building.requires)) {
        addCombatLog('Research requirement not met!', 'defeat');
        return;
    }
    
    if (canAfford(cost)) {
        deductResources(cost);
        gameState.buildings[buildingKey]++;
        updateUI();
    }
}

// Research a technology
function researchTech(techKey) {
    const tech = research[techKey];
    
    if (gameState.research[techKey]) return;
    
    if (!meetsRequirements(tech.requires)) {
        addCombatLog('Research requirement not met!', 'defeat');
        return;
    }
    
    if (canAfford(tech.cost)) {
        deductResources(tech.cost);
        gameState.research[techKey] = true;
        addCombatLog(`Researched: ${tech.name}!`, 'victory');
        updateUI();
    }
}

// Build a ship
function buildShip(shipKey) {
    const ship = ships[shipKey];
    
    if (!meetsRequirements(ship.requires)) {
        addCombatLog('Research requirement not met!', 'defeat');
        return;
    }
    
    if (gameState.buildings.shipyard < 1) {
        addCombatLog('Shipyard required to build ships!', 'defeat');
        return;
    }
    
    if (canAfford(ship.cost)) {
        deductResources(ship.cost);
        gameState.ships[shipKey]++;
        updateUI();
    }
}

// Attack an enemy
function attackEnemy(enemyIndex) {
    const enemy = enemies[enemyIndex];
    const fleetPower = calculateFleetPower();
    
    if (fleetPower === 0) {
        addCombatLog('No ships available for combat!', 'defeat');
        return;
    }
    
    if (fleetPower >= enemy.power) {
        // Victory
        for (const [resource, amount] of Object.entries(enemy.reward)) {
            gameState.resources[resource] += amount;
        }
        gameState.enemiesDefeated++;
        addCombatLog(`Victory against ${enemy.name}! Gained rewards.`, 'victory');
    } else {
        // Defeat - lose some ships
        for (const shipKey in gameState.ships) {
            const losses = Math.ceil(gameState.ships[shipKey] * gameConfig.combatDefeatLossRate);
            gameState.ships[shipKey] = Math.max(0, gameState.ships[shipKey] - losses);
        }
        addCombatLog(`Defeated by ${enemy.name}! Lost 10% of fleet.`, 'defeat');
    }
    
    updateUI();
}

// Add message to combat log
function addCombatLog(message, type = '') {
    const logMessages = document.getElementById('log-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `log-message ${type ? 'log-' + type : ''}`;
    messageDiv.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logMessages.insertBefore(messageDiv, logMessages.firstChild);
    
    // Keep only last 20 messages
    while (logMessages.children.length > 20) {
        logMessages.removeChild(logMessages.lastChild);
    }
}

// Update UI
function updateUI() {
    // Update resources display
    const production = calculateProduction();
    
    document.getElementById('metal').textContent = Math.floor(gameState.resources.metal);
    document.getElementById('energy').textContent = Math.floor(gameState.resources.energy);
    document.getElementById('research').textContent = Math.floor(gameState.resources.research);
    document.getElementById('credits').textContent = Math.floor(gameState.resources.credits);
    
    document.getElementById('metal-rate').textContent = production.metal.toFixed(1);
    document.getElementById('energy-rate').textContent = production.energy.toFixed(1);
    document.getElementById('research-rate').textContent = production.research.toFixed(1);
    
    // Update buildings
    const buildingsList = document.getElementById('buildings-list');
    buildingsList.innerHTML = '';
    
    for (const [key, building] of Object.entries(buildings)) {
        if (!meetsRequirements(building.requires) && gameState.buildings[key] === 0) continue;
        
        const cost = getBuildingCost(key);
        const canBuild = canAfford(cost) && meetsRequirements(building.requires);
        
        const div = document.createElement('div');
        div.className = 'building-item';
        div.innerHTML = `
            <h3>${building.name}</h3>
            <p>${building.description}</p>
            <p>Owned: <span class="building-count">${gameState.buildings[key]}</span></p>
            <p>Cost: ${Object.entries(cost).map(([r, a]) => `${r.charAt(0).toUpperCase() + r.slice(1)}: ${a}`).join(', ')}</p>
            <button onclick="buildBuilding('${key}')" ${!canBuild ? 'disabled' : ''}>Build</button>
        `;
        buildingsList.appendChild(div);
    }
    
    // Update research
    const researchList = document.getElementById('research-list');
    researchList.innerHTML = '';
    
    for (const [key, tech] of Object.entries(research)) {
        if (gameState.research[key]) {
            const div = document.createElement('div');
            div.className = 'research-item researched';
            div.innerHTML = `
                <h3>${tech.name}</h3>
                <p>${tech.description}</p>
                <p>✓ Researched</p>
            `;
            researchList.appendChild(div);
        } else if (meetsRequirements(tech.requires)) {
            const canResearch = canAfford(tech.cost);
            const div = document.createElement('div');
            div.className = 'research-item';
            div.innerHTML = `
                <h3>${tech.name}</h3>
                <p>${tech.description}</p>
                <p>Cost: ${Object.entries(tech.cost).map(([r, a]) => `${r.charAt(0).toUpperCase() + r.slice(1)}: ${a}`).join(', ')}</p>
                <button onclick="researchTech('${key}')" ${!canResearch ? 'disabled' : ''}>Research</button>
            `;
            researchList.appendChild(div);
        }
    }
    
    // Update ships
    const shipsList = document.getElementById('ships-list');
    shipsList.innerHTML = '';
    
    for (const [key, ship] of Object.entries(ships)) {
        if (!meetsRequirements(ship.requires)) continue;
        
        const canBuild = canAfford(ship.cost) && gameState.buildings.shipyard > 0;
        const div = document.createElement('div');
        div.className = 'ship-item';
        div.innerHTML = `
            <h3>${ship.name}</h3>
            <p>${ship.description}</p>
            <p>Power: ${ship.power} | Owned: <span class="ship-count">${gameState.ships[key]}</span></p>
            <p>Cost: ${Object.entries(ship.cost).map(([r, a]) => `${r.charAt(0).toUpperCase() + r.slice(1)}: ${a}`).join(', ')}</p>
            <button onclick="buildShip('${key}')" ${!canBuild ? 'disabled' : ''}>Build Ship</button>
        `;
        shipsList.appendChild(div);
    }
    
    // Update fleet display
    const fleetDisplay = document.getElementById('fleet-display');
    fleetDisplay.innerHTML = '';
    
    for (const [key, count] of Object.entries(gameState.ships)) {
        if (count > 0) {
            const div = document.createElement('div');
            div.className = 'fleet-ship';
            div.textContent = `${ships[key].name}: ${count}`;
            fleetDisplay.appendChild(div);
        }
    }
    
    // Update combat
    document.getElementById('fleet-power').textContent = calculateFleetPower();
    document.getElementById('enemies-defeated').textContent = gameState.enemiesDefeated;
    
    const enemiesList = document.getElementById('combat-enemies');
    enemiesList.innerHTML = '';
    
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const fleetPower = calculateFleetPower();
        const canWin = fleetPower >= enemy.power;
        
        const div = document.createElement('div');
        div.className = 'enemy-item';
        div.innerHTML = `
            <h3>${enemy.name}</h3>
            <p>Power: ${enemy.power}</p>
            <p>Reward: ${Object.entries(enemy.reward).map(([r, a]) => `${r.charAt(0).toUpperCase() + r.slice(1)}: ${a}`).join(', ')}</p>
            <p>${canWin ? '✓ Can defeat' : '✗ Too powerful'}</p>
            <button onclick="attackEnemy(${i})" ${fleetPower === 0 ? 'disabled' : ''}>Attack</button>
        `;
        enemiesList.appendChild(div);
    }
}

// Game loop
function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - gameState.lastUpdate) / 1000; // seconds
    gameState.lastUpdate = now;
    
    const production = calculateProduction();
    
    // Add resources based on production
    for (const [resource, rate] of Object.entries(production)) {
        gameState.resources[resource] += rate * deltaTime;
    }
    
    updateUI();
}

// Save game
function saveGame() {
    localStorage.setItem('galaxyBuilderSave', JSON.stringify(gameState));
    addCombatLog('Game saved!', 'victory');
}

// Load game
function loadGame() {
    const saved = localStorage.getItem('galaxyBuilderSave');
    if (saved) {
        const loadedState = JSON.parse(saved);
        Object.assign(gameState, loadedState);
        gameState.lastUpdate = Date.now();
        updateUI();
        addCombatLog('Game loaded!', 'victory');
    } else {
        addCombatLog('No saved game found!', 'defeat');
    }
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset the game? All progress will be lost!')) {
        localStorage.removeItem('galaxyBuilderSave');
        location.reload();
    }
}

// Initialize game
function init() {
    // Try to load saved game
    const saved = localStorage.getItem('galaxyBuilderSave');
    if (saved) {
        const loadedState = JSON.parse(saved);
        Object.assign(gameState, loadedState);
    }
    gameState.lastUpdate = Date.now();
    
    // Set up event listeners
    document.getElementById('save-btn').addEventListener('click', saveGame);
    document.getElementById('load-btn').addEventListener('click', loadGame);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    
    // Initial UI update
    updateUI();
    
    // Start game loop
    setInterval(gameLoop, gameConfig.gameLoopInterval);
    
    // Auto-save periodically
    setInterval(saveGame, gameConfig.autoSaveInterval);
    
    addCombatLog('Welcome to Galaxy Builder! Start by building Metal Mines and Solar Panels.', 'victory');
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', init);
