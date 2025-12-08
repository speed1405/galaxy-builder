// Galaxy Builder - Incremental Game Engine

// Game Configuration
const gameConfig = {
    combatDefeatLossRate: 0.1, // Lose 10% of fleet on combat defeat
    gameLoopInterval: 100, // Game loop update interval in ms
    autoSaveInterval: 30000, // Default auto-save interval in ms (30 seconds)
    autoCombatSafetyMargin: 1.2, // Require 20% more power than enemy for auto-combat
    offlineProgressCapHours: 4, // Maximum hours of offline progress
    minOfflineProgressMs: 60000 // Minimum time away before offline progress applies (1 minute)
};

// Speed display names
const speedDisplayNames = {
    0: 'Paused',
    0.5: 'Slow (0.5x)',
    1: 'Normal (1x)',
    2: 'Fast (2x)'
};

// Speed names for combat log (without multiplier info)
const speedLogNames = {
    0: 'Paused',
    0.5: 'Slow',
    1: 'Normal',
    2: 'Fast'
};

// Game Settings (User Configurable)
const gameSettings = {
    autoSaveEnabled: true,
    autoSaveInterval: 30, // in seconds (note: different unit from gameConfig.autoSaveInterval which is in ms)
    gameSpeed: 1, // 0=paused, 0.5=slow, 1=normal, 2=fast
    showResourceRates: true,
    showNotifications: true,
    confirmReset: true,
    confirmBulkActions: true,
    autoCombatEnabled: false,
    offlineProgressEnabled: true
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
    
    // Show/hide resource rates based on settings
    const rateElements = document.querySelectorAll('.resource-rate');
    rateElements.forEach(el => {
        el.style.display = gameSettings.showResourceRates ? 'inline' : 'none';
    });
    
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
            <div class="button-group">
                <button onclick="buildBuilding('${key}')" ${!canBuild ? 'disabled' : ''}>Build x1</button>
                <button onclick="bulkBuildBuilding('${key}', 10)" ${!canBuild ? 'disabled' : ''} class="bulk-btn">x10</button>
                <button onclick="bulkBuildBuilding('${key}', 100)" ${!canBuild ? 'disabled' : ''} class="bulk-btn">x100</button>
            </div>
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
            <div class="button-group">
                <button onclick="buildShip('${key}')" ${!canBuild ? 'disabled' : ''}>Build x1</button>
                <button onclick="bulkBuildShip('${key}', 10)" ${!canBuild ? 'disabled' : ''} class="bulk-btn">x10</button>
                <button onclick="bulkBuildShip('${key}', 100)" ${!canBuild ? 'disabled' : ''} class="bulk-btn">x100</button>
            </div>
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
    // Check if game is paused
    if (gameSettings.gameSpeed === 0) {
        gameState.lastUpdate = Date.now(); // Update timestamp to prevent time jump when unpausing
        return;
    }
    
    const now = Date.now();
    const deltaTime = (now - gameState.lastUpdate) / 1000; // seconds
    gameState.lastUpdate = now;
    
    const production = calculateProduction();
    
    // Add resources based on production and game speed
    for (const [resource, rate] of Object.entries(production)) {
        gameState.resources[resource] += rate * deltaTime * gameSettings.gameSpeed;
    }
    
    // Auto-combat if enabled
    if (gameSettings.autoCombatEnabled) {
        autoEngageCombat();
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
    if (!gameSettings.confirmReset) {
        localStorage.removeItem('galaxyBuilderSave');
        localStorage.removeItem('galaxyBuilderSettings');
        location.reload();
        return;
    }
    
    if (confirm('Are you sure you want to reset the game? All progress will be lost!')) {
        localStorage.removeItem('galaxyBuilderSave');
        localStorage.removeItem('galaxyBuilderSettings');
        location.reload();
    }
}

// Auto-combat helper
function autoEngageCombat() {
    const fleetPower = calculateFleetPower();
    
    // Find the strongest enemy we can defeat with safety margin
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const requiredPower = enemy.power * gameConfig.autoCombatSafetyMargin;
        if (fleetPower >= requiredPower) {
            attackEnemy(i);
            break;
        }
    }
}

// Calculate offline progress
function calculateOfflineProgress(timeAway) {
    if (!gameSettings.offlineProgressEnabled || timeAway < gameConfig.minOfflineProgressMs) {
        return null;
    }
    
    const maxOfflineSeconds = gameConfig.offlineProgressCapHours * 3600;
    const secondsAway = Math.min(timeAway / 1000, maxOfflineSeconds);
    const production = calculateProduction();
    const gains = {};
    
    for (const [resource, rate] of Object.entries(production)) {
        gains[resource] = rate * secondsAway;
    }
    
    return { secondsAway, gains };
}

// Apply offline progress
function applyOfflineProgress() {
    const now = Date.now();
    const timeAway = now - gameState.lastUpdate;
    const progress = calculateOfflineProgress(timeAway);
    
    if (progress) {
        for (const [resource, amount] of Object.entries(progress.gains)) {
            gameState.resources[resource] += amount;
        }
        
        const hours = Math.floor(progress.secondsAway / 3600);
        const minutes = Math.floor((progress.secondsAway % 3600) / 60);
        const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        
        addCombatLog(`Welcome back! You were away for ${timeString}. Offline progress applied.`, 'victory');
    }
    
    gameState.lastUpdate = now;
}

// Bulk build buildings
function bulkBuildBuilding(buildingKey, count) {
    if (count <= 0) return;
    
    const building = buildings[buildingKey];
    
    if (!meetsRequirements(building.requires)) {
        addCombatLog('Research requirement not met!', 'defeat');
        return;
    }
    
    // Confirm bulk action if setting is enabled
    if (gameSettings.confirmBulkActions && count > 1) {
        if (!confirm(`Build ${count} ${building.name}(s)?`)) {
            return;
        }
    }
    
    let built = 0;
    for (let i = 0; i < count; i++) {
        const cost = getBuildingCost(buildingKey);
        if (canAfford(cost)) {
            deductResources(cost);
            gameState.buildings[buildingKey]++;
            built++;
        } else {
            break;
        }
    }
    
    if (built > 0) {
        addCombatLog(`Built ${built} ${building.name}(s)!`, 'victory');
        updateUI();
    } else {
        addCombatLog('Cannot afford any buildings!', 'defeat');
    }
}

// Bulk build ships
function bulkBuildShip(shipKey, count) {
    if (count <= 0) return;
    
    const ship = ships[shipKey];
    
    if (gameState.buildings.shipyard === 0) {
        addCombatLog('Build a Shipyard first!', 'defeat');
        return;
    }
    
    if (!meetsRequirements(ship.requires)) {
        addCombatLog('Research requirement not met!', 'defeat');
        return;
    }
    
    // Confirm bulk action if setting is enabled
    if (gameSettings.confirmBulkActions && count > 1) {
        if (!confirm(`Build ${count} ${ship.name}(s)?`)) {
            return;
        }
    }
    
    let built = 0;
    for (let i = 0; i < count; i++) {
        if (canAfford(ship.cost)) {
            deductResources(ship.cost);
            gameState.ships[shipKey]++;
            built++;
        } else {
            break;
        }
    }
    
    if (built > 0) {
        addCombatLog(`Built ${built} ${ship.name}(s)!`, 'victory');
        updateUI();
    } else {
        addCombatLog('Cannot afford any ships!', 'defeat');
    }
}

// Save settings
function saveSettings() {
    localStorage.setItem('galaxyBuilderSettings', JSON.stringify(gameSettings));
}

// Load settings
function loadSettings() {
    const saved = localStorage.getItem('galaxyBuilderSettings');
    if (saved) {
        try {
            const loadedSettings = JSON.parse(saved);
            Object.assign(gameSettings, loadedSettings);
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    }
}

// Toggle settings modal
function toggleSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        const isVisible = modal.style.display === 'block';
        modal.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            updateSettingsUI();
        }
    }
}

// Update settings UI
function updateSettingsUI() {
    document.getElementById('setting-autosave').checked = gameSettings.autoSaveEnabled;
    document.getElementById('setting-autosave-interval').value = gameSettings.autoSaveInterval;
    document.getElementById('setting-resource-rates').checked = gameSettings.showResourceRates;
    document.getElementById('setting-notifications').checked = gameSettings.showNotifications;
    document.getElementById('setting-confirm-reset').checked = gameSettings.confirmReset;
    document.getElementById('setting-confirm-bulk').checked = gameSettings.confirmBulkActions;
    document.getElementById('setting-autocombat').checked = gameSettings.autoCombatEnabled;
    document.getElementById('setting-offline-progress').checked = gameSettings.offlineProgressEnabled;
    
    updateSpeedDisplay();
}

// Apply setting change
function applySetting(settingName, value) {
    // Validate settingName to prevent unintended property modification
    const allowedSettings = [
        'autoSaveEnabled', 'autoSaveInterval', 'gameSpeed', 'showResourceRates',
        'showNotifications', 'confirmReset', 'confirmBulkActions', 
        'autoCombatEnabled', 'offlineProgressEnabled'
    ];
    
    if (!allowedSettings.includes(settingName)) {
        console.error(`Invalid setting name: ${settingName}`);
        return;
    }
    
    gameSettings[settingName] = value;
    saveSettings();
    
    // Handle auto-save timer changes
    if (settingName === 'autoSaveInterval' || settingName === 'autoSaveEnabled') {
        if (window.autoSaveTimer) {
            clearInterval(window.autoSaveTimer);
            window.autoSaveTimer = null;
        }
        if (gameSettings.autoSaveEnabled) {
            window.autoSaveTimer = setInterval(saveGame, gameSettings.autoSaveInterval * 1000);
        }
    }
    
    if (settingName === 'showResourceRates') {
        updateUI();
    }
}

// Change game speed
function setGameSpeed(speed) {
    gameSettings.gameSpeed = speed;
    saveSettings();
    updateSpeedDisplay();
    
    const speedName = speedLogNames[speed] || `${speed}x`;
    addCombatLog(`Game speed: ${speedName}`, 'victory');
}

// Update speed display
function updateSpeedDisplay() {
    const speedText = speedDisplayNames[gameSettings.gameSpeed] || `${gameSettings.gameSpeed}x`;
    
    const speedDisplay = document.getElementById('speed-display');
    if (speedDisplay) {
        speedDisplay.textContent = speedText;
    }
}

// Keyboard shortcuts
function handleKeyboardShortcut(event) {
    // Don't trigger if user is typing in form elements
    const isFormElement = ['INPUT', 'TEXTAREA'].includes(event.target.tagName) || 
                         event.target.contentEditable === 'true';
    if (isFormElement) return;
    
    switch(event.key.toLowerCase()) {
        case 's':
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                saveGame();
            }
            break;
        case 'p':
            setGameSpeed(gameSettings.gameSpeed === 0 ? 1 : 0);
            break;
        case '1':
            setGameSpeed(0.5);
            break;
        case '2':
            setGameSpeed(1);
            break;
        case '3':
            setGameSpeed(2);
            break;
        case 'o':
            toggleSettings();
            break;
    }
}

// Initialize game
function init() {
    // Load settings first
    loadSettings();
    
    // Try to load saved game
    const saved = localStorage.getItem('galaxyBuilderSave');
    if (saved) {
        const loadedState = JSON.parse(saved);
        Object.assign(gameState, loadedState);
        
        // Apply offline progress
        applyOfflineProgress();
    } else {
        gameState.lastUpdate = Date.now();
    }
    
    // Set up event listeners
    document.getElementById('save-btn').addEventListener('click', saveGame);
    document.getElementById('load-btn').addEventListener('click', loadGame);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcut);
    
    // Initial UI update
    updateUI();
    
    // Start game loop
    setInterval(gameLoop, gameConfig.gameLoopInterval);
    
    // Auto-save periodically
    if (gameSettings.autoSaveEnabled) {
        window.autoSaveTimer = setInterval(saveGame, gameSettings.autoSaveInterval * 1000);
    }
    
    addCombatLog('Welcome to Galaxy Builder! Start by building Metal Mines and Solar Panels.', 'victory');
    addCombatLog('Press [P] to pause, [1/2/3] for speed, [O] for options, [Ctrl+S] to save', 'victory');
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', init);
