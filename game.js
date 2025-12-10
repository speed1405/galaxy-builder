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
    offlineProgressEnabled: true,
    theme: 'dark',
    soundEffectsEnabled: false,
    musicEnabled: false,
    masterVolume: 50,
    showTooltips: true
};

// Game State
const gameState = {
    resources: {
        metal: 0,
        energy: 0,
        research: 0,
        credits: 100
    },
    resourceCaps: {
        metal: 10000,
        energy: 10000,
        research: 5000,
        credits: 20000
    },
    buildings: {
        metalMine: 0,
        solarPanel: 0,
        researchLab: 0,
        shipyard: 0,
        tradingPost: 0,
        warehouse: 0,
        refinery: 0,
        defensePlatform: 0,
        factory: 0,
        bank: 0,
        habitat: 0,
        researchAccelerator: 0
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
        quantumPhysics: false,
        // Military Specialization
        plasmaCannonsII: false,
        plasmaCannonsIII: false,
        tacticalSystems: false,
        // Economy Specialization
        advancedMining: false,
        fusionPower: false,
        galacticTrade: false,
        // Science Specialization
        researchNetwork: false,
        quantumComputing: false,
        // Mega-Projects
        dysonSphere: false,
        galaxyNetwork: false,
        universalConstructor: false
    },
    ships: {
        scout: 0,
        fighter: 0,
        corvette: 0,
        destroyer: 0,
        cruiser: 0,
        battleship: 0,
        supportShip: 0,
        stealthShip: 0,
        carrier: 0,
        miningShip: 0,
        colonyShip: 0
    },
    enemiesDefeated: 0,
    prestige: {
        darkMatter: 0,
        totalResets: 0,
        upgrades: {
            productionBoost: 0, // +10% production per level
            costReduction: 0, // -5% costs per level
            researchSpeed: 0, // +15% research per level
            combatPower: 0, // +20% fleet power per level
            startingBonus: 0 // Start with more resources per level
        },
        milestones: {
            enemies100: false,
            enemies500: false,
            enemies1000: false,
            resources1M: false,
            resources10M: false,
            allTech: false
        }
    },
    combat: {
        nextWaveTime: 0,
        waveNumber: 0,
        waveEnabled: false
    },
    exploration: {
        sectorsExplored: 0,
        sectors: {},
        nextExplorationTime: 0,
        expeditions: [],
        resourceNodes: [] // Active resource nodes being mined
    },
    trading: {
        availableTrades: [],
        tradeHistory: []
    },
    achievements: {
        unlocked: [],
        stats: {
            totalResourcesEarned: 0,
            totalShipsBuilt: 0,
            totalBuildingsBuilt: 0,
            totalResearchCompleted: 0,
            maxFleetPower: 0,
            prestigeCount: 0,
            bossesDefeated: 0,
            expeditionsCompleted: 0,
            coloniesEstablished: 0
        }
    },
    statistics: {
        productionHistory: [],
        lastRecordTime: 0,
        totalPlayTime: 0,
        sessionStartTime: Date.now()
    },
    challenges: {
        active: null,
        completed: [],
        available: []
    },
    story: {
        currentChapter: 0,
        currentScene: 0,
        choicesMade: [],
        unlockedChapters: [0]
    },
    seasonalEvents: {
        active: null,
        completed: [],
        nextEventTime: 0
    },
    galaxy: {
        seed: Math.floor(Math.random() * 1000000),
        generated: false,
        size: 'medium',
        density: 'normal'
    },
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
    },
    warehouse: {
        name: 'Warehouse',
        description: 'Increases storage capacity for all resources',
        baseCost: { metal: 100, credits: 200 },
        produces: {},
        costMultiplier: 1.5,
        capBonus: 5000 // Increases all caps by 5000
    },
    refinery: {
        name: 'Refinery',
        description: 'Converts basic resources into more valuable ones',
        baseCost: { metal: 150, energy: 100, credits: 300 },
        produces: {},
        costMultiplier: 1.4,
        requires: 'advancedMaterials',
        refinesPerSecond: 10 // Converts 10 metal -> 5 energy per second
    },
    defensePlatform: {
        name: 'Defense Platform',
        description: 'Protects against enemy raids (+50 defense power each)',
        baseCost: { metal: 200, energy: 150, credits: 400 },
        produces: {},
        costMultiplier: 1.35,
        requires: 'plasmaCannons',
        defensePower: 50
    },
    factory: {
        name: 'Factory',
        description: 'Automated ship production (produces 1 scout every 60s)',
        baseCost: { metal: 300, energy: 200, credits: 500 },
        produces: {},
        costMultiplier: 1.5,
        requires: 'nanoTechnology',
        autoProduceShip: 'scout',
        autoProduceInterval: 60 // seconds
    },
    bank: {
        name: 'Bank',
        description: 'Generates interest on stored credits (+1% per bank per minute)',
        baseCost: { metal: 100, energy: 50, credits: 1000 },
        produces: {},
        costMultiplier: 1.6,
        requires: 'galacticTrade',
        interestRate: 0.01 // 1% per minute
    },
    habitat: {
        name: 'Habitat',
        description: 'Houses population (+10 workers, +5% all production per habitat)',
        baseCost: { metal: 250, energy: 150, credits: 600 },
        produces: {},
        costMultiplier: 1.45,
        requires: 'advancedMaterials',
        populationBonus: 10,
        productionBonus: 0.05 // 5% production boost
    },
    researchAccelerator: {
        name: 'Research Accelerator',
        description: 'Boosts research point generation (+2 research/s)',
        baseCost: { metal: 200, energy: 300, credits: 500 },
        produces: { research: 2 },
        costMultiplier: 1.55,
        requires: 'quantumComputing'
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
    },
    // Military Specialization
    plasmaCannonsII: {
        name: 'Plasma Cannons II',
        description: 'Advanced plasma technology (+40% attack)',
        cost: { research: 200 },
        requires: 'plasmaCannons',
        category: 'military'
    },
    plasmaCannonsIII: {
        name: 'Plasma Cannons III',
        description: 'Ultimate plasma weapons (+60% attack)',
        cost: { research: 400 },
        requires: 'plasmaCannonsII',
        category: 'military'
    },
    tacticalSystems: {
        name: 'Tactical Systems',
        description: 'Advanced combat formations (+25% fleet power)',
        cost: { research: 250 },
        requires: 'advancedWeaponry',
        category: 'military'
    },
    // Economy Specialization
    advancedMining: {
        name: 'Advanced Mining',
        description: 'Improve metal production by 50%',
        cost: { research: 180 },
        requires: 'advancedMaterials',
        category: 'economy'
    },
    fusionPower: {
        name: 'Fusion Power',
        description: 'Improve energy production by 75%',
        cost: { research: 220 },
        requires: 'energyEfficiency',
        category: 'economy'
    },
    galacticTrade: {
        name: 'Galactic Trade',
        description: 'Improve credit production by 100%',
        cost: { research: 300 },
        requires: 'warpDrive',
        category: 'economy'
    },
    // Science Specialization
    researchNetwork: {
        name: 'Research Network',
        description: 'Link labs for +50% research',
        cost: { research: 150 },
        requires: 'basicEngineering',
        category: 'science'
    },
    quantumComputing: {
        name: 'Quantum Computing',
        description: 'Process data faster (+75% research)',
        cost: { research: 350 },
        requires: 'quantumPhysics',
        category: 'science'
    },
    // Mega-Projects
    dysonSphere: {
        name: 'Dyson Sphere',
        description: 'Harness star energy (massive energy boost)',
        cost: { research: 1000, metal: 10000, energy: 5000, credits: 10000 },
        requires: 'fusionPower',
        category: 'megaproject'
    },
    galaxyNetwork: {
        name: 'Galaxy Network',
        description: 'Interconnect all systems (all production +200%)',
        cost: { research: 2000, metal: 20000, energy: 15000, credits: 25000 },
        requires: 'galacticTrade',
        category: 'megaproject'
    },
    universalConstructor: {
        name: 'Universal Constructor',
        description: 'Self-replicating factories (all costs -50%)',
        cost: { research: 1500, metal: 15000, energy: 10000, credits: 20000 },
        requires: 'nanoTechnology',
        category: 'megaproject'
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
    },
    supportShip: {
        name: 'Support Ship',
        description: 'Heals and buffs other ships (+10% fleet effectiveness)',
        cost: { metal: 150, energy: 200, credits: 300 },
        power: 20,
        requires: 'nanoTechnology',
        supportBonus: 0.10 // 10% fleet boost
    },
    stealthShip: {
        name: 'Stealth Ship',
        description: 'Special reconnaissance and sabotage missions',
        cost: { metal: 250, energy: 150, credits: 400 },
        power: 50,
        requires: 'tacticalSystems',
        stealthBonus: true // Enables special missions
    },
    carrier: {
        name: 'Carrier',
        description: 'Launches fighter squadrons (+5 virtual fighters per carrier)',
        cost: { metal: 600, energy: 400, credits: 900 },
        power: 100,
        requires: 'warpDrive',
        carrierBonus: 5 // Each carrier adds power equivalent to 5 fighters
    },
    miningShip: {
        name: 'Mining Ship',
        description: 'Passive resource collection (+5 metal/s and +3 energy/s)',
        cost: { metal: 200, energy: 100, credits: 250 },
        power: 10,
        requires: 'advancedMining',
        miningBonus: { metal: 5, energy: 3 }
    },
    colonyShip: {
        name: 'Colony Ship',
        description: 'Establishes outposts on new worlds (consumed on use)',
        cost: { metal: 500, energy: 300, credits: 800 },
        power: 5,
        requires: 'warpDrive',
        colonizable: true
    }
};

// Enemy Definitions
const enemies = [
    { name: 'Space Pirates', power: 20, reward: { metal: 50, energy: 30, credits: 100 }, type: 'normal', 
      abilities: ['Fast Attack'] },
    { name: 'Rogue Drones', power: 50, reward: { metal: 100, energy: 80, credits: 200 }, type: 'normal',
      abilities: ['Self-Repair'] },
    { name: 'Rebel Fleet', power: 150, reward: { metal: 250, energy: 200, credits: 500 }, type: 'normal',
      abilities: ['Tactical Formation'] },
    { name: 'Alien Raiders', power: 300, reward: { metal: 500, energy: 400, credits: 1000 }, type: 'normal',
      abilities: ['Energy Drain'] },
    { name: 'Dark Empire Scout', power: 600, reward: { metal: 1000, energy: 800, credits: 2000 }, type: 'normal',
      abilities: ['Stealth Cloak'] },
    { name: 'Mercenary Squadron', power: 400, reward: { metal: 700, energy: 600, credits: 1500 }, type: 'elite',
      abilities: ['Precision Strike', 'Shield Boost'],
      description: '⚡ ELITE: Professional fighters with advanced tactics' },
    { name: 'Crystalline Horde', power: 800, reward: { metal: 1500, energy: 1200, credits: 2500, research: 100 }, type: 'elite',
      abilities: ['Energy Absorption', 'Crystal Armor'],
      description: '⚡ ELITE: Energy-based lifeforms with reflective defenses' },
    { name: 'Void Leviathan', power: 1200, reward: { metal: 2500, energy: 2000, credits: 5000 }, type: 'boss', 
      abilities: ['Regeneration', 'Area Attack'],
      description: '⚔️ BOSS: Massive creature with regenerative abilities' },
    { name: 'Ancient Guardian', power: 2500, reward: { metal: 5000, energy: 4000, credits: 10000 }, type: 'boss',
      abilities: ['Ancient Technology', 'Phase Shield'],
      description: '⚔️ BOSS: Ancient protector with devastating weapons' },
    { name: 'Void Titan', power: 5000, reward: { metal: 10000, energy: 8000, credits: 20000, research: 1000 }, type: 'boss',
      abilities: ['Void Pulse', 'Matter Annihilation'],
      description: '⚔️ BOSS: Colossal entity from the void between stars' },
    { name: 'Cosmic Devourer', power: 10000, reward: { metal: 25000, energy: 20000, credits: 50000, research: 2500 }, type: 'boss',
      abilities: ['Consume Reality', 'Dimensional Rift'],
      description: '⚔️ BOSS: Ultimate threat consuming entire star systems' },
    { name: 'Quantum Swarm', power: 1500, reward: { metal: 3000, energy: 2500, credits: 4000, research: 200 }, type: 'elite',
      abilities: ['Quantum Entanglement', 'Rapid Reproduction'],
      description: '⚡ ELITE: Hivemind entities that exist in multiple dimensions' },
    { name: 'Temporal Raiders', power: 3500, reward: { metal: 7000, energy: 6000, credits: 12000, research: 500 }, type: 'elite',
      abilities: ['Time Dilation', 'Future Knowledge'],
      description: '⚡ ELITE: Time-traveling marauders from the future' }
];

// Prestige Upgrade Definitions
const prestigeUpgrades = {
    productionBoost: {
        name: 'Production Boost',
        description: 'Increase all production by 10% per level',
        baseCost: 5,
        costMultiplier: 2,
        maxLevel: 10
    },
    costReduction: {
        name: 'Cost Reduction',
        description: 'Reduce all costs by 5% per level',
        baseCost: 10,
        costMultiplier: 2.5,
        maxLevel: 10
    },
    researchSpeed: {
        name: 'Research Speed',
        description: 'Increase research production by 15% per level',
        baseCost: 8,
        costMultiplier: 2.2,
        maxLevel: 10
    },
    combatPower: {
        name: 'Combat Power',
        description: 'Increase fleet power by 20% per level',
        baseCost: 15,
        costMultiplier: 2.5,
        maxLevel: 10
    },
    startingBonus: {
        name: 'Starting Bonus',
        description: 'Start new runs with bonus resources',
        baseCost: 20,
        costMultiplier: 3,
        maxLevel: 5
    }
};

// Prestige Milestone Definitions
const prestigeMilestones = {
    enemies100: { name: 'Defeat 100 Enemies', requirement: 100, bonus: 2, description: '+2 Dark Matter on prestige' },
    enemies500: { name: 'Defeat 500 Enemies', requirement: 500, bonus: 5, description: '+5 Dark Matter on prestige' },
    enemies1000: { name: 'Defeat 1000 Enemies', requirement: 1000, bonus: 10, description: '+10 Dark Matter on prestige' },
    resources1M: { name: 'Earn 1M Total Resources', requirement: 1000000, bonus: 3, description: '+3 Dark Matter on prestige' },
    resources10M: { name: 'Earn 10M Total Resources', requirement: 10000000, bonus: 8, description: '+8 Dark Matter on prestige' },
    allTech: { name: 'Research All Technologies', requirement: 1, bonus: 5, description: '+5 Dark Matter on prestige' }
};

// Achievement Definitions
const achievements = {
    // Combat Achievements
    firstBlood: {
        name: 'First Blood',
        description: 'Defeat your first enemy',
        category: 'combat',
        requirement: () => gameState.enemiesDefeated >= 1,
        reward: { credits: 100 },
        hidden: false
    },
    warrior: {
        name: 'Warrior',
        description: 'Defeat 50 enemies',
        category: 'combat',
        requirement: () => gameState.enemiesDefeated >= 50,
        reward: { credits: 500, metal: 200 },
        hidden: false
    },
    bossSlayer: {
        name: 'Boss Slayer',
        description: 'Defeat a boss enemy',
        category: 'combat',
        requirement: () => gameState.achievements.stats.bossesDefeated >= 1,
        reward: { darkMatter: 1 },
        hidden: false
    },
    fleetCommander: {
        name: 'Fleet Commander',
        description: 'Reach 1000 total fleet power',
        category: 'combat',
        requirement: () => calculateFleetPower() >= 1000,
        reward: { credits: 1000 },
        hidden: false
    },
    
    // Economy Achievements
    resourceful: {
        name: 'Resourceful',
        description: 'Earn 100,000 total resources',
        category: 'economy',
        requirement: () => gameState.achievements.stats.totalResourcesEarned >= 100000,
        reward: { metal: 500, energy: 500 },
        hidden: false
    },
    builder: {
        name: 'Builder',
        description: 'Construct 50 buildings',
        category: 'economy',
        requirement: () => gameState.achievements.stats.totalBuildingsBuilt >= 50,
        reward: { credits: 800 },
        hidden: false
    },
    magnate: {
        name: 'Magnate',
        description: 'Accumulate 50,000 credits at once',
        category: 'economy',
        requirement: () => gameState.resources.credits >= 50000,
        reward: { credits: 5000 },
        hidden: false
    },
    industrialist: {
        name: 'Industrialist',
        description: 'Build 10 factories',
        category: 'economy',
        requirement: () => gameState.buildings.factory >= 10,
        reward: { metal: 1000, energy: 500 },
        hidden: true
    },
    
    // Research Achievements
    scientist: {
        name: 'Scientist',
        description: 'Complete 5 research projects',
        category: 'research',
        requirement: () => gameState.achievements.stats.totalResearchCompleted >= 5,
        reward: { research: 50 },
        hidden: false
    },
    technocrat: {
        name: 'Technocrat',
        description: 'Complete 15 research projects',
        category: 'research',
        requirement: () => gameState.achievements.stats.totalResearchCompleted >= 15,
        reward: { research: 200, credits: 1000 },
        hidden: false
    },
    quantumMind: {
        name: 'Quantum Mind',
        description: 'Research Quantum Physics',
        category: 'research',
        requirement: () => gameState.research.quantumPhysics,
        reward: { darkMatter: 2 },
        hidden: false
    },
    megaEngineer: {
        name: 'Mega Engineer',
        description: 'Complete a mega-project',
        category: 'research',
        requirement: () => gameState.research.dysonSphere || gameState.research.galaxyNetwork || gameState.research.universalConstructor,
        reward: { darkMatter: 3 },
        hidden: true
    },
    
    // Exploration Achievements
    explorer: {
        name: 'Explorer',
        description: 'Explore 5 sectors',
        category: 'exploration',
        requirement: () => gameState.exploration.sectorsExplored >= 5,
        reward: { credits: 500, research: 50 },
        hidden: false
    },
    pioneer: {
        name: 'Pioneer',
        description: 'Explore 20 sectors',
        category: 'exploration',
        requirement: () => gameState.exploration.sectorsExplored >= 20,
        reward: { metal: 1000, energy: 1000, credits: 2000 },
        hidden: false
    },
    expeditionary: {
        name: 'Expeditionary',
        description: 'Complete 10 expeditions',
        category: 'exploration',
        requirement: () => gameState.achievements.stats.expeditionsCompleted >= 10,
        reward: { research: 200 },
        hidden: false
    },
    colonizer: {
        name: 'Colonizer',
        description: 'Establish 5 colonies',
        category: 'exploration',
        requirement: () => gameState.achievements.stats.coloniesEstablished >= 5,
        reward: { darkMatter: 1 },
        hidden: true
    },
    
    // Prestige Achievements
    ascended: {
        name: 'Ascended',
        description: 'Prestige for the first time',
        category: 'prestige',
        requirement: () => gameState.prestige.totalResets >= 1,
        reward: { darkMatter: 5 },
        hidden: false
    },
    reborn: {
        name: 'Reborn',
        description: 'Prestige 10 times',
        category: 'prestige',
        requirement: () => gameState.prestige.totalResets >= 10,
        reward: { darkMatter: 10 },
        hidden: false
    },
    
    // Hidden Special Achievements
    pacifist: {
        name: 'Pacifist',
        description: 'Reach 10,000 resources without defeating any enemies',
        category: 'special',
        requirement: () => {
            const totalResources = gameState.resources.metal + gameState.resources.energy + 
                                   gameState.resources.research + gameState.resources.credits;
            return totalResources >= 10000 && gameState.enemiesDefeated === 0;
        },
        reward: { darkMatter: 3 },
        hidden: true
    }
};

// Resource Conversion Rates
const resourceConversions = {
    metalToEnergy: { from: 'metal', to: 'energy', inputAmount: 2, outputAmount: 1 }, // 2 metal -> 1 energy
    energyToResearch: { from: 'energy', to: 'research', inputAmount: 5, outputAmount: 1 }, // 5 energy -> 1 research
    metalToCredits: { from: 'metal', to: 'credits', inputAmount: 1, outputAmount: 2 }, // 1 metal -> 2 credits
    energyToCredits: { from: 'energy', to: 'credits', inputAmount: 2, outputAmount: 3 }, // 2 energy -> 3 credits
    researchToCredits: { from: 'research', to: 'credits', inputAmount: 1, outputAmount: 5 } // 1 research -> 5 credits
};

// AI Trade Factions
const tradeFactions = {
    terranAlliance: {
        name: 'Terran Alliance',
        description: 'Human-led federation offering balanced trades',
        trades: [
            { offer: { metal: 100 }, request: { credits: 150 }, unlocked: true },
            { offer: { energy: 100 }, request: { credits: 120 }, unlocked: true },
            { offer: { credits: 500 }, request: { metal: 300, energy: 200 }, requires: 'galacticTrade' }
        ]
    },
    crystallineConsortium: {
        name: 'Crystalline Consortium',
        description: 'Energy-focused traders from crystal worlds',
        trades: [
            { offer: { energy: 200 }, request: { metal: 150 }, requires: 'energyEfficiency' },
            { offer: { energy: 500 }, request: { credits: 400 }, requires: 'fusionPower' }
        ]
    },
    scientificEnclave: {
        name: 'Scientific Enclave',
        description: 'Research-focused civilization',
        trades: [
            { offer: { research: 50 }, request: { metal: 200, energy: 200 }, requires: 'researchNetwork' },
            { offer: { research: 100 }, request: { credits: 1000 }, requires: 'quantumComputing' }
        ]
    }
};

// Resource Nodes (depletable sources)
const resourceNodeTypes = {
    richAsteroid: {
        name: 'Rich Asteroid Field',
        description: 'Dense asteroid field with abundant metal',
        resource: 'metal',
        totalYield: 5000,
        miningRate: 10, // per second
        discoveryChance: 0.3
    },
    energyNebula: {
        name: 'Energy Nebula',
        description: 'Nebula with harvestable energy',
        resource: 'energy',
        totalYield: 4000,
        miningRate: 8,
        discoveryChance: 0.25
    },
    ancientCache: {
        name: 'Ancient Research Cache',
        description: 'Lost civilization data stores',
        resource: 'research',
        totalYield: 2000,
        miningRate: 5,
        discoveryChance: 0.15
    },
    tradingHub: {
        name: 'Abandoned Trading Hub',
        description: 'Derelict station with credits',
        resource: 'credits',
        totalYield: 10000,
        miningRate: 20,
        discoveryChance: 0.2
    }
};


// Challenges Definitions
const challenges = {
    speedRunner: {
        name: 'Speed Runner',
        description: 'Defeat 50 enemies in 10 minutes',
        type: 'timed',
        duration: 600, // seconds
        requirement: { enemiesDefeated: 50 },
        reward: { darkMatter: 3, credits: 5000 },
        difficulty: 'medium'
    },
    pacifist: {
        name: 'Peaceful Expansion',
        description: 'Reach 50,000 total resources without defeating any enemies',
        type: 'condition',
        requirement: { totalResources: 50000, enemiesDefeated: 0 },
        reward: { darkMatter: 2, research: 500 },
        difficulty: 'hard'
    },
    researcher: {
        name: 'Research Rush',
        description: 'Complete 10 research projects in 15 minutes',
        type: 'timed',
        duration: 900,
        requirement: { researchCompleted: 10 },
        reward: { research: 1000, darkMatter: 2 },
        difficulty: 'easy'
    },
    builder: {
        name: 'Construction Frenzy',
        description: 'Build 100 total buildings',
        type: 'condition',
        requirement: { buildingsBuilt: 100 },
        reward: { metal: 5000, energy: 5000, credits: 10000 },
        difficulty: 'medium'
    },
    explorer: {
        name: 'Galactic Cartographer',
        description: 'Explore 15 sectors in 20 minutes',
        type: 'timed',
        duration: 1200,
        requirement: { sectorsExplored: 15 },
        reward: { darkMatter: 4, credits: 8000 },
        difficulty: 'hard'
    },
    fleetCommander: {
        name: 'Fleet Commander',
        description: 'Build 200 total ships',
        type: 'condition',
        requirement: { shipsBuilt: 200 },
        reward: { metal: 10000, energy: 8000, darkMatter: 3 },
        difficulty: 'medium'
    },
    bossHunter: {
        name: 'Boss Hunter',
        description: 'Defeat 5 boss enemies',
        type: 'condition',
        requirement: { bossesDefeated: 5 },
        reward: { darkMatter: 10, research: 2000 },
        difficulty: 'hard'
    },
    minimalist: {
        name: 'Minimalist',
        description: 'Defeat Void Leviathan with less than 10 total buildings',
        type: 'condition',
        requirement: { defeatedVoidLeviathan: true, maxBuildings: 10 },
        reward: { darkMatter: 5 },
        difficulty: 'extreme'
    }
};

// Story Mode Chapters
const storyChapters = [
    {
        id: 0,
        title: 'The Beginning',
        scenes: [
            {
                text: 'In the depths of space, your civilization has just discovered the principles of advanced metallurgy. The stars beckon, but the journey ahead is long.',
                choices: [
                    { text: 'Focus on resource gathering', effect: { metal: 100 }, nextScene: 1 },
                    { text: 'Invest in research', effect: { research: 50 }, nextScene: 1 }
                ]
            },
            {
                text: 'Your people work tirelessly, building the foundation of what will become a galactic empire. But dark forces stir in the void...',
                choices: [
                    { text: 'Continue', nextScene: -1, unlockChapter: 1 }
                ]
            }
        ]
    },
    {
        id: 1,
        title: 'First Contact',
        requires: { enemiesDefeated: 10 },
        scenes: [
            {
                text: 'Strange ships appear at the edge of your territory. The aliens seem... hostile. Your advisors debate the best course of action.',
                choices: [
                    { text: 'Prepare for war', effect: { ships: { fighter: 5 } }, nextScene: 1 },
                    { text: 'Attempt diplomacy', effect: { credits: 500 }, nextScene: 2 }
                ]
            },
            {
                text: 'Your fleet engages the enemy. The battle is fierce, but your ships prove superior. The enemy retreats... for now.',
                choices: [
                    { text: 'Continue expansion', nextScene: -1, unlockChapter: 2 }
                ]
            },
            {
                text: 'Your diplomatic overtures are met with suspicion, but eventually they yield results. A shaky trade agreement is formed.',
                choices: [
                    { text: 'Focus on trade', nextScene: -1, unlockChapter: 2 }
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'The Ancient Ruins',
        requires: { research: 'warpDrive' },
        scenes: [
            {
                text: 'Deep in uncharted space, your explorers discover ruins of an ancient civilization. The technology here could change everything.',
                choices: [
                    { text: 'Study the ruins carefully', effect: { research: 500 }, nextScene: 1 },
                    { text: 'Salvage what you can quickly', effect: { metal: 2000, energy: 1500 }, nextScene: 1 }
                ]
            },
            {
                text: 'The knowledge gained from the ruins propels your civilization forward. But you sense you are being watched...',
                choices: [
                    { text: 'Prepare for what comes next', nextScene: -1, unlockChapter: 3 }
                ]
            }
        ]
    },
    {
        id: 3,
        title: 'The Void Awakens',
        requires: { enemiesDefeated: 50 },
        scenes: [
            {
                text: 'Ancient evils stir in the depths of space. The Void Leviathan, dormant for eons, has awakened. Your greatest challenge lies ahead.',
                choices: [
                    { text: 'Rally the fleet', effect: { allShips: 10 }, nextScene: 1 }
                ]
            },
            {
                text: 'The final battle will determine the fate of your empire. Will you rise to become masters of the galaxy, or fall into the endless void?',
                choices: [
                    { text: 'Face your destiny', nextScene: -1 }
                ]
            }
        ]
    }
];


// Seasonal Events Definitions
const seasonalEvents = {
    solarFlare: {
        name: 'Solar Flare',
        description: 'Intense solar activity increases energy production by 50% for 5 minutes',
        duration: 300, // seconds
        effect: { energyBonus: 0.5 },
        rarity: 'common'
    },
    meteorShower: {
        name: 'Meteor Shower',
        description: 'Rich meteors provide bonus metal production (+100%) for 5 minutes',
        duration: 300,
        effect: { metalBonus: 1.0 },
        rarity: 'common'
    },
    galacticBazaar: {
        name: 'Galactic Bazaar',
        description: 'Traders arrive offering better rates (all trades 50% cheaper) for 10 minutes',
        duration: 600,
        effect: { tradeBonus: 0.5 },
        rarity: 'uncommon'
    },
    ancientBeacon: {
        name: 'Ancient Beacon',
        description: 'Discovered beacon doubles research production for 5 minutes',
        duration: 300,
        effect: { researchBonus: 1.0 },
        rarity: 'uncommon'
    },
    cosmicAlignment: {
        name: 'Cosmic Alignment',
        description: 'Rare planetary alignment boosts ALL production by 100% for 3 minutes',
        duration: 180,
        effect: { allBonus: 1.0 },
        rarity: 'rare'
    },
    darkMatterStorm: {
        name: 'Dark Matter Storm',
        description: 'Cosmic storm grants +5 Dark Matter immediately!',
        duration: 0,
        effect: { darkMatter: 5 },
        rarity: 'rare'
    },
    peaceAccord: {
        name: 'Peace Accord',
        description: 'Temporary peace treaty: no enemy attacks for 10 minutes',
        duration: 600,
        effect: { noAttacks: true },
        rarity: 'uncommon'
    }
};

// Galaxy Generation Parameters
const galaxyTemplates = {
    tiny: { sectors: 20, resourceMultiplier: 0.8, enemyDensity: 0.5 },
    small: { sectors: 50, resourceMultiplier: 0.9, enemyDensity: 0.7 },
    medium: { sectors: 100, resourceMultiplier: 1.0, enemyDensity: 1.0 },
    large: { sectors: 200, resourceMultiplier: 1.1, enemyDensity: 1.2 },
    huge: { sectors: 500, resourceMultiplier: 1.2, enemyDensity: 1.5 }
};


// Calculate building cost with scaling
function getBuildingCost(buildingKey) {
    const building = buildings[buildingKey];
    const count = gameState.buildings[buildingKey];
    const cost = {};
    
    for (const [resource, amount] of Object.entries(building.baseCost)) {
        let finalCost = Math.floor(amount * Math.pow(building.costMultiplier, count));
        
        // Apply prestige cost reduction
        const costReductionLevel = gameState.prestige.upgrades.costReduction;
        if (costReductionLevel > 0) {
            const reduction = 1 - (costReductionLevel * 0.05);
            finalCost = Math.floor(finalCost * reduction);
        }
        
        // Apply universal constructor
        if (gameState.research.universalConstructor) {
            finalCost = Math.floor(finalCost * 0.5);
        }
        
        cost[resource] = finalCost;
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
    
    // Apply habitat production bonus
    if (gameState.buildings.habitat > 0 && buildings.habitat) {
        const habitatBonus = buildings.habitat.productionBonus;
        const multiplier = 1 + (habitatBonus * gameState.buildings.habitat);
        for (const resource in production) {
            production[resource] *= multiplier;
        }
    }
    
    // Apply research bonuses
    if (gameState.research.advancedMining) production.metal *= 1.5;
    if (gameState.research.fusionPower) production.energy *= 1.75;
    if (gameState.research.galacticTrade) production.credits *= 2;
    if (gameState.research.researchNetwork) production.research *= 1.5;
    if (gameState.research.quantumComputing) production.research *= 1.75;
    
    // Apply mega-project bonuses
    if (gameState.research.dysonSphere) production.energy *= 5;
    if (gameState.research.galaxyNetwork) {
        production.metal *= 3;
        production.energy *= 3;
        production.research *= 3;
        production.credits *= 3;
    }
    
    // Apply prestige bonuses
    const prodBoostLevel = gameState.prestige.upgrades.productionBoost;
    if (prodBoostLevel > 0) {
        const multiplier = 1 + (prodBoostLevel * 0.1);
        for (const resource in production) {
            production[resource] *= multiplier;
        }
    }
    
    const researchBoostLevel = gameState.prestige.upgrades.researchSpeed;
    if (researchBoostLevel > 0) {
        production.research *= 1 + (researchBoostLevel * 0.15);
    }
    
    // Apply seasonal event bonuses
    production = applySeasonalBonuses(production);
    
    return production;
}

// Calculate fleet power
function calculateFleetPower() {
    let power = 0;
    
    for (const [shipKey, count] of Object.entries(gameState.ships)) {
        const ship = ships[shipKey];
        if (!ship) continue;
        power += ship.power * count;
    }
    
    // Apply carrier bonus (each carrier adds power of virtual fighters)
    if (gameState.ships.carrier > 0 && ships.carrier) {
        const carrierBonus = ships.carrier.carrierBonus;
        const fighterPower = ships.fighter ? ships.fighter.power : 15;
        power += carrierBonus * fighterPower * gameState.ships.carrier;
    }
    
    // Apply support ship bonus
    if (gameState.ships.supportShip > 0 && ships.supportShip) {
        const supportBonus = ships.supportShip.supportBonus;
        power *= (1 + supportBonus * gameState.ships.supportShip);
    }
    
    // Apply defense platform bonus
    if (gameState.buildings.defensePlatform > 0 && buildings.defensePlatform) {
        power += buildings.defensePlatform.defensePower * gameState.buildings.defensePlatform;
    }
    
    // Apply habitat production bonus (affects fleet effectiveness)
    if (gameState.buildings.habitat > 0 && buildings.habitat) {
        const habitatBonus = buildings.habitat.productionBonus;
        power *= (1 + habitatBonus * gameState.buildings.habitat);
    }
    
    // Apply research bonuses
    if (gameState.research.advancedMaterials) power *= 1.2;
    if (gameState.research.plasmaCannons) power *= 1.3;
    if (gameState.research.plasmaCannonsII) power *= 1.4;
    if (gameState.research.plasmaCannonsIII) power *= 1.6;
    if (gameState.research.shieldTech) power *= 1.5;
    if (gameState.research.advancedWeaponry) power *= 1.5;
    if (gameState.research.tacticalSystems) power *= 1.25;
    if (gameState.research.quantumPhysics) power *= 2;
    
    // Apply prestige combat power bonus
    const combatLevel = gameState.prestige.upgrades.combatPower;
    if (combatLevel > 0) {
        power *= 1 + (combatLevel * 0.2);
    }
    
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
        gameState.achievements.stats.totalBuildingsBuilt++;
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
    
    // Apply cost reduction
    const cost = {};
    for (const [resource, amount] of Object.entries(tech.cost)) {
        let finalCost = amount;
        const costReductionLevel = gameState.prestige.upgrades.costReduction;
        if (costReductionLevel > 0) {
            const reduction = 1 - (costReductionLevel * 0.05);
            finalCost = Math.floor(finalCost * reduction);
        }
        if (gameState.research.universalConstructor && techKey !== 'universalConstructor') {
            finalCost = Math.floor(finalCost * 0.5);
        }
        cost[resource] = finalCost;
    }
    
    if (canAfford(cost)) {
        deductResources(cost);
        gameState.research[techKey] = true;
        gameState.achievements.stats.totalResearchCompleted++;
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
    
    // Apply cost reduction
    const cost = {};
    for (const [resource, amount] of Object.entries(ship.cost)) {
        let finalCost = amount;
        const costReductionLevel = gameState.prestige.upgrades.costReduction;
        if (costReductionLevel > 0) {
            const reduction = 1 - (costReductionLevel * 0.05);
            finalCost = Math.floor(finalCost * reduction);
        }
        if (gameState.research.universalConstructor) {
            finalCost = Math.floor(finalCost * 0.5);
        }
        cost[resource] = finalCost;
    }
    
    if (canAfford(cost)) {
        deductResources(cost);
        gameState.ships[shipKey]++;
        gameState.achievements.stats.totalShipsBuilt++;
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
            gameState.achievements.stats.totalResourcesEarned += amount;
        }
        gameState.enemiesDefeated++;
        
        // Track boss defeats
        if (enemy.type === 'boss') {
            if (!gameState.achievements.stats.bossesDefeated) {
                gameState.achievements.stats.bossesDefeated = 0;
            }
            gameState.achievements.stats.bossesDefeated++;
        }
        
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

// Enemy wave system
function triggerEnemyWave() {
    if (!gameState.combat.waveEnabled) return;
    
    const waveNumber = gameState.combat.waveNumber;
    
    // Generate enemy wave based on wave number
    const enemyCount = Math.min(3 + Math.floor(waveNumber / 5), 10);
    const enemyPower = 50 + (waveNumber * 20);
    
    const waveName = `Enemy Wave ${waveNumber + 1}`;
    const waveEnemy = {
        name: waveName,
        power: enemyPower,
        reward: {
            metal: 100 + (waveNumber * 50),
            energy: 80 + (waveNumber * 40),
            credits: 200 + (waveNumber * 100)
        },
        type: 'wave'
    };
    
    addCombatLog(`⚠️ ${waveName} incoming! Power: ${enemyPower}`, 'defeat');
    
    const fleetPower = calculateFleetPower();
    
    // Auto-defend if fleet is strong enough
    if (fleetPower >= waveEnemy.power * 1.1) {
        for (const [resource, amount] of Object.entries(waveEnemy.reward)) {
            gameState.resources[resource] += amount;
        }
        addCombatLog(`✓ Successfully defended against ${waveName}!`, 'victory');
        gameState.enemiesDefeated++;
    } else if (fleetPower > 0) {
        // Partial defense - some losses
        const lossRate = Math.min(0.3, (waveEnemy.power - fleetPower) / waveEnemy.power);
        for (const shipKey in gameState.ships) {
            const losses = Math.ceil(gameState.ships[shipKey] * lossRate);
            gameState.ships[shipKey] = Math.max(0, gameState.ships[shipKey] - losses);
        }
        addCombatLog(`⚠️ Heavy losses defending against ${waveName}! Lost ${Math.floor(lossRate * 100)}% of fleet.`, 'defeat');
    } else {
        // No fleet - lose resources
        for (const resource in gameState.resources) {
            gameState.resources[resource] = Math.max(0, gameState.resources[resource] * 0.9);
        }
        addCombatLog(`✗ Failed to defend against ${waveName}! Lost 10% of resources.`, 'defeat');
    }
    
    gameState.combat.waveNumber++;
    gameState.combat.nextWaveTime = Date.now() + (120000); // Next wave in 2 minutes
    
    updateUI();
}

// Toggle enemy waves
function toggleEnemyWaves() {
    gameState.combat.waveEnabled = !gameState.combat.waveEnabled;
    
    if (gameState.combat.waveEnabled) {
        gameState.combat.nextWaveTime = Date.now() + 120000; // First wave in 2 minutes
        gameState.combat.waveNumber = 0;
        addCombatLog('Enemy waves enabled! Prepare for periodic attacks.', 'victory');
    } else {
        addCombatLog('Enemy waves disabled.', 'victory');
    }
    
    updateUI();
}

// Exploration System
const sectorTypes = [
    { name: 'Asteroid Field', bonus: 'metal', multiplier: 1.5 },
    { name: 'Nebula', bonus: 'energy', multiplier: 1.5 },
    { name: 'Ancient Ruins', bonus: 'research', multiplier: 2 },
    { name: 'Trade Hub', bonus: 'credits', multiplier: 2 }
];

const randomEvents = [
    { name: 'Derelict Ship', reward: { metal: 500, credits: 1000 } },
    { name: 'Resource Asteroid', reward: { metal: 1000, energy: 500 } },
    { name: 'Ancient Artifact', reward: { research: 100, credits: 2000 } },
    { name: 'Space Anomaly', reward: { energy: 1000, research: 50 } },
    { name: 'Abandoned Station', reward: { metal: 800, energy: 800, credits: 1500 } }
];

function exploreSector() {
    if (!gameState.research.warpDrive) {
        addCombatLog('Warp Drive required to explore new sectors!', 'defeat');
        return;
    }
    
    const cost = {
        energy: 500 + (gameState.exploration.sectorsExplored * 100),
        credits: 1000 + (gameState.exploration.sectorsExplored * 200)
    };
    
    if (!canAfford(cost)) {
        addCombatLog('Not enough resources to explore!', 'defeat');
        return;
    }
    
    deductResources(cost);
    
    // Generate sector
    const sectorType = sectorTypes[Math.floor(Math.random() * sectorTypes.length)];
    const sectorId = `sector_${gameState.exploration.sectorsExplored}`;
    
    gameState.exploration.sectors[sectorId] = {
        name: `${sectorType.name} ${gameState.exploration.sectorsExplored + 1}`,
        type: sectorType.name,
        bonus: sectorType.bonus,
        multiplier: sectorType.multiplier,
        controlled: false
    };
    
    gameState.exploration.sectorsExplored++;
    
    // Random event chance
    if (Math.random() < 0.3) {
        const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        for (const [resource, amount] of Object.entries(event.reward)) {
            gameState.resources[resource] += amount;
        }
        addCombatLog(`Discovered ${event.name}! Gained rewards.`, 'victory');
    }
    
    // Chance to discover resource node
    discoverResourceNode();
    
    addCombatLog(`Explored: ${gameState.exploration.sectors[sectorId].name}`, 'victory');
    updateUI();
}

function claimSector(sectorId) {
    const sector = gameState.exploration.sectors[sectorId];
    
    if (!sector) return;
    if (sector.controlled) {
        addCombatLog('Sector already controlled!', 'defeat');
        return;
    }
    
    const cost = { credits: 5000, metal: 2000 };
    
    if (!canAfford(cost)) {
        addCombatLog('Not enough resources to claim sector!', 'defeat');
        return;
    }
    
    deductResources(cost);
    sector.controlled = true;
    
    addCombatLog(`Claimed ${sector.name}! +${Math.floor((sector.multiplier - 1) * 100)}% ${sector.bonus} production`, 'victory');
    updateUI();
}

function sendExpedition() {
    if (!gameState.research.warpDrive) {
        addCombatLog('Warp Drive required for expeditions!', 'defeat');
        return;
    }
    
    const fleetPower = calculateFleetPower();
    if (fleetPower < 100) {
        addCombatLog('Need at least 100 fleet power for expeditions!', 'defeat');
        return;
    }
    
    const cost = { energy: 1000, credits: 2000 };
    
    if (!canAfford(cost)) {
        addCombatLog('Not enough resources for expedition!', 'defeat');
        return;
    }
    
    deductResources(cost);
    
    const duration = 60000; // 1 minute
    const expedition = {
        startTime: Date.now(),
        endTime: Date.now() + duration,
        reward: {
            metal: 1000 + Math.floor(fleetPower * 2),
            energy: 800 + Math.floor(fleetPower * 1.5),
            credits: 2000 + Math.floor(fleetPower * 3),
            research: Math.floor(fleetPower * 0.5)
        }
    };
    
    gameState.exploration.expeditions.push(expedition);
    addCombatLog('Expedition launched! Returns in 1 minute.', 'victory');
    updateUI();
}

function checkExpeditions() {
    const now = Date.now();
    const completedExpeditions = [];
    
    for (let i = 0; i < gameState.exploration.expeditions.length; i++) {
        const expedition = gameState.exploration.expeditions[i];
        if (now >= expedition.endTime) {
            for (const [resource, amount] of Object.entries(expedition.reward)) {
                gameState.resources[resource] += amount;
            }
            completedExpeditions.push(i);
            addCombatLog('Expedition returned with resources!', 'victory');
        }
    }
    
    // Remove completed expeditions (in reverse order to maintain indices)
    for (let i = completedExpeditions.length - 1; i >= 0; i--) {
        gameState.exploration.expeditions.splice(completedExpeditions[i], 1);
        if (!gameState.achievements.stats.expeditionsCompleted) {
            gameState.achievements.stats.expeditionsCompleted = 0;
        }
        gameState.achievements.stats.expeditionsCompleted++;
    }
}

// Establish colony with colony ship
function establishColony() {
    if (gameState.ships.colonyShip < 1) {
        addCombatLog('Need a Colony Ship to establish a colony!', 'defeat');
        return;
    }
    
    if (gameState.exploration.sectorsExplored < 5) {
        addCombatLog('Explore at least 5 sectors before colonizing!', 'defeat');
        return;
    }
    
    const cost = {
        metal: 5000,
        energy: 3000,
        credits: 10000
    };
    
    if (!canAfford(cost)) {
        addCombatLog('Not enough resources to establish colony!', 'defeat');
        return;
    }
    
    deductResources(cost);
    gameState.ships.colonyShip--; // Colony ship is consumed
    
    // Grant bonus resources and production
    gameState.resources.metal += 2000;
    gameState.resources.energy += 1500;
    
    // Track colony establishment
    if (!gameState.achievements.stats.coloniesEstablished) {
        gameState.achievements.stats.coloniesEstablished = 0;
    }
    gameState.achievements.stats.coloniesEstablished++;
    
    addCombatLog(`Colony established! Colony Ship consumed. Production increased.`, 'victory');
    updateUI();
}

// Update UI
function updateUI() {
    // Update resources display
    const production = calculateProduction();
    
    document.getElementById('metal').textContent = Math.floor(gameState.resources.metal);
    document.getElementById('energy').textContent = Math.floor(gameState.resources.energy);
    document.getElementById('research').textContent = Math.floor(gameState.resources.research);
    document.getElementById('credits').textContent = Math.floor(gameState.resources.credits);
    
    // Update resource caps
    document.getElementById('metal-cap').textContent = gameState.resourceCaps.metal;
    document.getElementById('energy-cap').textContent = gameState.resourceCaps.energy;
    document.getElementById('research-cap').textContent = gameState.resourceCaps.research;
    document.getElementById('credits-cap').textContent = gameState.resourceCaps.credits;
    
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
        
        // Build tooltip text
        let tooltipText = building.description;
        if (building.produces && Object.keys(building.produces).length > 0) {
            tooltipText += `\n\nProduces: ${Object.entries(building.produces).map(([r, a]) => `${a} ${r}/s`).join(', ')}`;
        }
        if (building.capBonus) {
            tooltipText += `\n\nIncreases all resource caps by ${building.capBonus}`;
        }
        if (building.defensePower) {
            tooltipText += `\n\nDefense Power: ${building.defensePower}`;
        }
        if (building.refinesPerSecond) {
            tooltipText += `\n\nConverts ${building.refinesPerSecond * 2} metal → ${building.refinesPerSecond} energy per second`;
        }
        if (building.productionBonus) {
            tooltipText += `\n\nBoosts all production by ${building.productionBonus * 100}%`;
        }
        
        const div = document.createElement('div');
        div.className = 'building-item tooltip';
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
            ${gameSettings.showTooltips ? `<span class="tooltiptext">${tooltipText.replace(/\n/g, '<br>')}</span>` : ''}
        `;
        buildingsList.appendChild(div);
    }
    
    // Update research
    const researchList = document.getElementById('research-list');
    researchList.innerHTML = '';
    
    for (const [key, tech] of Object.entries(research)) {
        if (gameState.research[key]) {
            const div = document.createElement('div');
            const category = tech.category ? ` tech-${tech.category}` : '';
            div.className = `research-item researched${category} tooltip`;
            div.innerHTML = `
                <h3>${tech.name}</h3>
                ${tech.category ? `<span class="tech-category">[${tech.category.toUpperCase()}]</span>` : ''}
                <p>${tech.description}</p>
                <p>✓ Researched</p>
                ${gameSettings.showTooltips ? `<span class="tooltiptext">Unlocked: ${tech.description}</span>` : ''}
            `;
            researchList.appendChild(div);
        } else if (meetsRequirements(tech.requires)) {
            // Apply cost reduction for display
            const displayCost = {};
            for (const [resource, amount] of Object.entries(tech.cost)) {
                let finalCost = amount;
                const costReductionLevel = gameState.prestige.upgrades.costReduction;
                if (costReductionLevel > 0) {
                    const reduction = 1 - (costReductionLevel * 0.05);
                    finalCost = Math.floor(finalCost * reduction);
                }
                if (gameState.research.universalConstructor && key !== 'universalConstructor') {
                    finalCost = Math.floor(finalCost * 0.5);
                }
                displayCost[resource] = finalCost;
            }
            
            const canResearch = canAfford(displayCost);
            const div = document.createElement('div');
            const category = tech.category ? ` tech-${tech.category}` : '';
            
            let tooltipText = `${tech.description}\n\nRequires: ${tech.requires || 'None'}`;
            
            div.className = `research-item${category} tooltip`;
            div.innerHTML = `
                <h3>${tech.name}</h3>
                ${tech.category ? `<span class="tech-category">[${tech.category.toUpperCase()}]</span>` : ''}
                <p>${tech.description}</p>
                <p>Cost: ${Object.entries(displayCost).map(([r, a]) => `${r.charAt(0).toUpperCase() + r.slice(1)}: ${a}`).join(', ')}</p>
                <button onclick="researchTech('${key}')" ${!canResearch ? 'disabled' : ''}>Research</button>
                ${gameSettings.showTooltips ? `<span class="tooltiptext">${tooltipText.replace(/\n/g, '<br>')}</span>` : ''}
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
        
        let tooltipText = `${ship.description}\n\nPower: ${ship.power}`;
        if (ship.supportBonus) tooltipText += `\n\nSupport Bonus: +${ship.supportBonus * 100}% fleet effectiveness`;
        if (ship.carrierBonus) tooltipText += `\n\nCarrier Bonus: +${ship.carrierBonus} virtual fighters`;
        if (ship.miningBonus) {
            tooltipText += `\n\nMining: ${Object.entries(ship.miningBonus).map(([r, a]) => `${a} ${r}/s`).join(', ')}`;
        }
        
        const div = document.createElement('div');
        div.className = 'ship-item tooltip';
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
            ${gameSettings.showTooltips ? `<span class="tooltiptext">${tooltipText.replace(/\n/g, '<br>')}</span>` : ''}
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
    
    // Add wave controls
    const waveControlDiv = document.createElement('div');
    waveControlDiv.className = 'wave-controls';
    waveControlDiv.innerHTML = `
        <h3>Enemy Waves</h3>
        <p>Periodic enemy attacks that must be defended against</p>
        <button onclick="toggleEnemyWaves()" class="wave-toggle-btn">
            ${gameState.combat.waveEnabled ? '✓ Waves Enabled' : 'Enable Waves'}
        </button>
        ${gameState.combat.waveEnabled ? `
            <p>Wave ${gameState.combat.waveNumber + 1} in ${Math.max(0, Math.ceil((gameState.combat.nextWaveTime - Date.now()) / 1000))}s</p>
        ` : ''}
    `;
    enemiesList.appendChild(waveControlDiv);
    
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const fleetPower = calculateFleetPower();
        const canWin = fleetPower >= enemy.power;
        
        const div = document.createElement('div');
        div.className = `enemy-item ${enemy.type === 'boss' ? 'boss-enemy' : enemy.type === 'elite' ? 'enemy-type-elite' : 'enemy-type-normal'}`;
        div.innerHTML = `
            <h3>${enemy.name}</h3>
            ${enemy.description ? `<p class="enemy-description">${enemy.description}</p>` : ''}
            <p>Power: ${enemy.power}</p>
            ${enemy.abilities ? `<p>Abilities: ${enemy.abilities.map(a => `<span class="enemy-ability">${a}</span>`).join(' ')}</p>` : ''}
            <p>Reward: ${Object.entries(enemy.reward).map(([r, a]) => `${r.charAt(0).toUpperCase() + r.slice(1)}: ${a}`).join(', ')}</p>
            <p>${canWin ? '✓ Can defeat' : '✗ Too powerful'}</p>
            <button onclick="attackEnemy(${i})" ${fleetPower === 0 ? 'disabled' : ''}>Attack</button>
        `;
        enemiesList.appendChild(div);
    }
    
    // Update prestige
    document.getElementById('dark-matter').textContent = gameState.prestige.darkMatter;
    document.getElementById('total-resets').textContent = gameState.prestige.totalResets;
    document.getElementById('next-prestige-gain').textContent = calculatePrestigeGain();
    
    const prestigeUpgradesList = document.getElementById('prestige-upgrades-list');
    prestigeUpgradesList.innerHTML = '';
    
    for (const [key, upgrade] of Object.entries(prestigeUpgrades)) {
        const currentLevel = gameState.prestige.upgrades[key];
        const cost = getPrestigeUpgradeCost(key);
        const canBuy = gameState.prestige.darkMatter >= cost && currentLevel < upgrade.maxLevel;
        
        const div = document.createElement('div');
        div.className = 'prestige-upgrade-item';
        div.innerHTML = `
            <h4>${upgrade.name}</h4>
            <p>${upgrade.description}</p>
            <p>Level: ${currentLevel} / ${upgrade.maxLevel}</p>
            ${currentLevel < upgrade.maxLevel ? `
                <p>Cost: ${cost} Dark Matter</p>
                <button onclick="buyPrestigeUpgrade('${key}')" ${!canBuy ? 'disabled' : ''}>Upgrade</button>
            ` : '<p>✓ Max Level</p>'}
        `;
        prestigeUpgradesList.appendChild(div);
    }
    
    const prestigeMilestonesList = document.getElementById('prestige-milestones-list');
    prestigeMilestonesList.innerHTML = '';
    
    for (const [key, milestone] of Object.entries(prestigeMilestones)) {
        const achieved = gameState.prestige.milestones[key];
        let progress = 0;
        
        if (key.includes('enemies')) {
            progress = gameState.enemiesDefeated;
        } else if (key.includes('resources')) {
            const totalRes = gameState.resources.metal + gameState.resources.energy + 
                            gameState.resources.research + gameState.resources.credits;
            progress = totalRes;
        } else if (key === 'allTech') {
            const completedTech = Object.values(gameState.research).filter(val => val === true).length;
            const totalTech = Object.keys(gameState.research).length;
            progress = completedTech >= totalTech ? 1 : 0;
        }
        
        const div = document.createElement('div');
        div.className = `prestige-milestone-item ${achieved ? 'achieved' : ''}`;
        div.innerHTML = `
            <h4>${milestone.name} ${achieved ? '✓' : ''}</h4>
            <p>${milestone.description}</p>
            <p>Progress: ${Math.min(progress, milestone.requirement)} / ${milestone.requirement}</p>
        `;
        prestigeMilestonesList.appendChild(div);
    }
    
    // Update exploration
    document.getElementById('sectors-explored').textContent = gameState.exploration.sectorsExplored;
    document.getElementById('active-expeditions').textContent = gameState.exploration.expeditions.length;
    
    const sectorsDisplay = document.getElementById('sectors-display');
    sectorsDisplay.innerHTML = '';
    
    for (const [sectorId, sector] of Object.entries(gameState.exploration.sectors)) {
        if (sector.controlled) {
            const div = document.createElement('div');
            div.className = 'sector-item';
            div.innerHTML = `
                <h4>${sector.name}</h4>
                <p>Type: ${sector.type}</p>
                <p>Bonus: +${Math.floor((sector.multiplier - 1) * 100)}% ${sector.bonus}</p>
            `;
            sectorsDisplay.appendChild(div);
        }
    }
    
    const expeditionsDisplay = document.getElementById('expeditions-display');
    expeditionsDisplay.innerHTML = '';
    
    const now = Date.now();
    for (const expedition of gameState.exploration.expeditions) {
        const timeLeft = Math.max(0, Math.ceil((expedition.endTime - now) / 1000));
        const div = document.createElement('div');
        div.className = 'expedition-item';
        div.innerHTML = `
            <p>⏱️ Returns in ${timeLeft}s</p>
            <p>Expected: ${Object.entries(expedition.reward).map(([r, a]) => `${r}: ${a}`).join(', ')}</p>
        `;
        expeditionsDisplay.appendChild(div);
    }
    
    if (gameState.exploration.expeditions.length === 0) {
        expeditionsDisplay.innerHTML = '<p>No active expeditions</p>';
    }
    
    // Update new UI elements
    updateAchievementsDisplay();
    updateConversionDisplay();
    updateTradingDisplay();
    updateResourceNodesDisplay();
    updateStatisticsDashboard();
    updateChallengesDisplay();
    updateStoryDisplay();
    updateSeasonalEventDisplay();
}

function updateSeasonalEventDisplay() {
    const panel = document.getElementById('seasonal-events-panel');
    const display = document.getElementById('seasonal-event-display');
    
    if (!panel || !display) return;
    
    const eventInfo = displaySeasonalEvent();
    
    if (eventInfo) {
        panel.style.display = 'block';
        const minutes = Math.floor(eventInfo.timeRemaining / 60);
        const seconds = eventInfo.timeRemaining % 60;
        
        display.innerHTML = `
            <div style="background: rgba(255, 193, 7, 0.2); padding: 15px; border-radius: 8px; border: 2px solid #ffc107;">
                <h3 style="color: #ffc107; margin-bottom: 10px;">🎉 ${eventInfo.name}</h3>
                <p style="color: #a8dadc; margin-bottom: 10px;">${eventInfo.description}</p>
                <p style="color: #ffd700; font-weight: bold;">⏱️ Time Remaining: ${minutes}m ${seconds}s</p>
            </div>
        `;
    } else {
        panel.style.display = 'none';
    }
}

// Achievement System Functions
function checkAchievements() {
    for (const [key, achievement] of Object.entries(achievements)) {
        // Skip if already unlocked
        if (gameState.achievements.unlocked.includes(key)) continue;
        
        // Check requirement
        if (achievement.requirement()) {
            unlockAchievement(key);
        }
    }
}

function unlockAchievement(key) {
    if (gameState.achievements.unlocked.includes(key)) return;
    
    gameState.achievements.unlocked.push(key);
    const achievement = achievements[key];
    
    // Grant rewards
    if (achievement.reward) {
        for (const [resource, amount] of Object.entries(achievement.reward)) {
            if (resource === 'darkMatter') {
                gameState.prestige.darkMatter += amount;
            } else if (gameState.resources[resource] !== undefined) {
                gameState.resources[resource] += amount;
            }
        }
    }
    
    // Show notification
    if (gameSettings.showNotifications) {
        showNotification(`🏆 Achievement Unlocked: ${achievement.name}!`, 'achievement');
    }
    
    updateAchievementsDisplay();
}

function updateAchievementsDisplay() {
    const achievementsDisplay = document.getElementById('achievements-display');
    if (!achievementsDisplay) return;
    
    achievementsDisplay.innerHTML = '';
    
    for (const [key, achievement] of Object.entries(achievements)) {
        const isUnlocked = gameState.achievements.unlocked.includes(key);
        const isHidden = achievement.hidden && !isUnlocked;
        
        if (isHidden) continue;
        
        const div = document.createElement('div');
        div.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'} ${achievement.category}`;
        
        const rewardText = achievement.reward ? 
            Object.entries(achievement.reward).map(([r, a]) => `${r}: +${a}`).join(', ') : 'None';
        
        div.innerHTML = `
            <div class="achievement-icon">${isUnlocked ? '🏆' : '🔒'}</div>
            <div class="achievement-info">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <small>Reward: ${rewardText}</small>
                <span class="achievement-category">${achievement.category}</span>
            </div>
        `;
        
        achievementsDisplay.appendChild(div);
    }
    
    // Update count
    document.getElementById('achievements-unlocked').textContent = gameState.achievements.unlocked.length;
    document.getElementById('achievements-total').textContent = Object.keys(achievements).length;
}

function filterAchievements(category, event) {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    const items = document.querySelectorAll('.achievement-item');
    items.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Resource Conversion Functions
function convertResource(conversionKey, amount) {
    const conversion = resourceConversions[conversionKey];
    if (!conversion) return;
    
    // Calculate how many conversions we can do
    const conversions = Math.floor(amount / conversion.inputAmount);
    const actualInput = conversions * conversion.inputAmount;
    const actualOutput = conversions * conversion.outputAmount;
    
    // Check if player has enough
    if (gameState.resources[conversion.from] < actualInput) {
        showNotification(`Not enough ${conversion.from}`, 'error');
        return;
    }
    
    // Perform conversion
    gameState.resources[conversion.from] -= actualInput;
    gameState.resources[conversion.to] += actualOutput;
    
    showNotification(`Converted ${actualInput} ${conversion.from} to ${actualOutput} ${conversion.to}`, 'success');
}

function updateConversionDisplay() {
    const conversionOptions = document.getElementById('conversion-options');
    if (!conversionOptions) return;
    
    conversionOptions.innerHTML = '';
    
    for (const [key, conversion] of Object.entries(resourceConversions)) {
        const div = document.createElement('div');
        div.className = 'conversion-option';
        
        div.innerHTML = `
            <h4>${conversion.from} → ${conversion.to}</h4>
            <p>Rate: ${conversion.inputAmount} ${conversion.from} = ${conversion.outputAmount} ${conversion.to}</p>
            <input type="number" id="convert-${key}" min="0" step="${conversion.inputAmount}" value="${conversion.inputAmount}" />
            <button onclick="convertResource('${key}', parseInt(document.getElementById('convert-${key}').value))">Convert</button>
        `;
        
        conversionOptions.appendChild(div);
    }
}

// Trading Functions
function executeTrade(factionKey, tradeIndex) {
    const faction = tradeFactions[factionKey];
    const trade = faction.trades[tradeIndex];
    
    // Check requirements
    if (trade.requires && !gameState.research[trade.requires]) {
        showNotification(`Requires ${trade.requires} research`, 'error');
        return;
    }
    
    // Check if can afford request
    if (!canAfford(trade.request)) {
        showNotification('Cannot afford this trade', 'error');
        return;
    }
    
    // Execute trade
    deductResources(trade.request);
    for (const [resource, amount] of Object.entries(trade.offer)) {
        gameState.resources[resource] += amount;
    }
    
    // Track trade
    gameState.trading.tradeHistory.push({
        faction: factionKey,
        trade: tradeIndex,
        timestamp: Date.now()
    });
    
    showNotification(`Trade completed with ${faction.name}`, 'success');
    updateTradingDisplay();
}

function updateTradingDisplay() {
    const tradingFactions = document.getElementById('trading-factions');
    if (!tradingFactions) return;
    
    tradingFactions.innerHTML = '';
    
    for (const [key, faction] of Object.entries(tradeFactions)) {
        const div = document.createElement('div');
        div.className = 'faction-trades';
        
        let tradesHTML = '';
        faction.trades.forEach((trade, index) => {
            const unlocked = !trade.requires || gameState.research[trade.requires];
            const canAffordTrade = canAfford(trade.request);
            
            if (unlocked) {
                const offerText = Object.entries(trade.offer).map(([r, a]) => `${a} ${r}`).join(', ');
                const requestText = Object.entries(trade.request).map(([r, a]) => `${a} ${r}`).join(', ');
                
                tradesHTML += `
                    <div class="trade-option ${canAffordTrade ? 'affordable' : 'expensive'}">
                        <p>Give: ${requestText}</p>
                        <p>Get: ${offerText}</p>
                        <button onclick="executeTrade('${key}', ${index})" ${canAffordTrade ? '' : 'disabled'}>Trade</button>
                    </div>
                `;
            }
        });
        
        div.innerHTML = `
            <h4>${faction.name}</h4>
            <p class="faction-desc">${faction.description}</p>
            <div class="trades-list">${tradesHTML || '<p>No trades available</p>'}</div>
        `;
        
        tradingFactions.appendChild(div);
    }
}

// Resource Nodes Functions
function updateResourceNodes(deltaTime) {
    const nodes = gameState.exploration.resourceNodes;
    
    for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        const nodeType = resourceNodeTypes[node.type];
        
        // Mine resources
        const mineAmount = Math.min(nodeType.miningRate * deltaTime, node.remainingYield);
        gameState.resources[nodeType.resource] += mineAmount;
        node.remainingYield -= mineAmount;
        
        gameState.achievements.stats.totalResourcesEarned += mineAmount;
        
        // Remove depleted nodes
        if (node.remainingYield <= 0) {
            nodes.splice(i, 1);
            showNotification(`Resource node depleted: ${nodeType.name}`, 'info');
        }
    }
}

function discoverResourceNode() {
    // Random discovery when exploring
    for (const [key, nodeType] of Object.entries(resourceNodeTypes)) {
        if (Math.random() < nodeType.discoveryChance * 0.1) { // 10% of normal chance per exploration
            const node = {
                type: key,
                remainingYield: nodeType.totalYield,
                discoveredAt: Date.now()
            };
            gameState.exploration.resourceNodes.push(node);
            showNotification(`Discovered: ${nodeType.name}!`, 'discovery');
            break;
        }
    }
}

function updateResourceNodesDisplay() {
    const nodesDisplay = document.getElementById('resource-nodes-display');
    if (!nodesDisplay) return;
    
    nodesDisplay.innerHTML = '';
    
    if (gameState.exploration.resourceNodes.length === 0) {
        nodesDisplay.innerHTML = '<p>No active resource nodes. Explore to discover them!</p>';
        return;
    }
    
    gameState.exploration.resourceNodes.forEach(node => {
        const nodeType = resourceNodeTypes[node.type];
        const progress = ((nodeType.totalYield - node.remainingYield) / nodeType.totalYield * 100).toFixed(1);
        
        const div = document.createElement('div');
        div.className = 'resource-node';
        div.innerHTML = `
            <h4>${nodeType.name}</h4>
            <p>${nodeType.description}</p>
            <p>Remaining: ${Math.floor(node.remainingYield)} ${nodeType.resource}</p>
            <p>Mining Rate: ${nodeType.miningRate}/s</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
        `;
        
        nodesDisplay.appendChild(div);
    });
}

// Helper function for notifications
function showNotification(message, type = 'info') {
    if (!gameSettings.showNotifications) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Theme Management
function changeTheme(themeName) {
    // Remove all theme classes
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-classic', 'theme-green');
    
    // Add new theme class
    if (themeName !== 'dark') {
        document.body.classList.add(`theme-${themeName}`);
    }
    
    gameSettings.theme = themeName;
    saveSettings();
    showNotification(`Theme changed to ${themeName}`, 'success');
}

// Statistics Functions
function recordProductionSnapshot() {
    const now = Date.now();
    if (now - gameState.statistics.lastRecordTime < 60000) return; // Record every minute
    
    const production = calculateProduction();
    const snapshot = {
        timestamp: now,
        metal: production.metal,
        energy: production.energy,
        research: production.research,
        credits: production.credits,
        fleetPower: calculateFleetPower()
    };
    
    gameState.statistics.productionHistory.push(snapshot);
    
    // Keep only last 30 snapshots (30 minutes of data)
    if (gameState.statistics.productionHistory.length > 30) {
        gameState.statistics.productionHistory.shift();
    }
    
    gameState.statistics.lastRecordTime = now;
}

function updateStatisticsDashboard() {
    const statsDisplay = document.getElementById('stats-dashboard');
    if (!statsDisplay) return;
    
    const totalResources = gameState.resources.metal + gameState.resources.energy + 
                          gameState.resources.research + gameState.resources.credits;
    const totalBuildings = Object.values(gameState.buildings).reduce((a, b) => a + b, 0);
    const totalShips = Object.values(gameState.ships).reduce((a, b) => a + b, 0);
    const playTime = Math.floor((gameState.statistics.totalPlayTime + (Date.now() - gameState.statistics.sessionStartTime)) / 1000);
    const playHours = Math.floor(playTime / 3600);
    const playMinutes = Math.floor((playTime % 3600) / 60);
    
    const stats = [
        { label: 'Total Resources', value: totalResources.toLocaleString() },
        { label: 'Total Buildings', value: totalBuildings },
        { label: 'Total Ships', value: totalShips },
        { label: 'Fleet Power', value: calculateFleetPower() },
        { label: 'Enemies Defeated', value: gameState.enemiesDefeated },
        { label: 'Sectors Explored', value: gameState.exploration.sectorsExplored },
        { label: 'Technologies Researched', value: Object.values(gameState.research).filter(v => v).length },
        { label: 'Play Time', value: `${playHours}h ${playMinutes}m` }
    ];
    
    statsDisplay.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <h4>${stat.label}</h4>
            <div class="stat-value">${stat.value}</div>
        </div>
    `).join('');
    
    updateProductionChart();
}

function updateProductionChart() {
    const chartContainer = document.getElementById('production-chart');
    const chartLabels = document.getElementById('chart-labels');
    if (!chartContainer) return;
    
    const history = gameState.statistics.productionHistory;
    if (history.length === 0) {
        chartContainer.innerHTML = '<p style="text-align:center; color:#a8dadc; padding:20px;">Collecting data...</p>';
        return;
    }
    
    // Get max values for scaling
    const maxMetal = Math.max(...history.map(h => h.metal), 1);
    const maxEnergy = Math.max(...history.map(h => h.energy), 1);
    const maxResearch = Math.max(...history.map(h => h.research), 1);
    const maxCredits = Math.max(...history.map(h => h.credits), 1);
    const maxValue = Math.max(maxMetal, maxEnergy, maxResearch, maxCredits);
    
    // Create bars for each snapshot
    chartContainer.innerHTML = history.slice(-10).map((snapshot, index) => {
        const metalHeight = (snapshot.metal / maxValue) * 100;
        return `<div class="chart-bar" style="height: ${metalHeight}%" title="Metal: ${snapshot.metal.toFixed(1)}/s"></div>`;
    }).join('');
    
    // Add labels (time ago)
    if (chartLabels) {
        chartLabels.innerHTML = '<div style="display:flex; justify-content:space-around; margin-top:10px;">' +
            '<span class="chart-label">Metal</span>' +
            '<span class="chart-label">Energy</span>' +
            '<span class="chart-label">Research</span>' +
            '<span class="chart-label">Credits</span>' +
            '</div>';
    }
}

function exportStatistics() {
    const stats = {
        gameState: {
            resources: gameState.resources,
            buildings: gameState.buildings,
            ships: gameState.ships,
            research: gameState.research,
            enemiesDefeated: gameState.enemiesDefeated,
            prestige: gameState.prestige
        },
        statistics: gameState.statistics,
        achievements: gameState.achievements,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `galaxy-builder-stats-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Statistics exported successfully!', 'success');
}

// Challenge System
function initializeChallenges() {
    // Populate available challenges
    for (const [key, challenge] of Object.entries(challenges)) {
        if (!gameState.challenges.completed.includes(key)) {
            gameState.challenges.available.push(key);
        }
    }
}

function startChallenge(challengeKey) {
    const challenge = challenges[challengeKey];
    if (!challenge) return;
    
    if (gameState.challenges.active) {
        showNotification('Complete current challenge first!', 'error');
        return;
    }
    
    gameState.challenges.active = {
        key: challengeKey,
        startTime: Date.now(),
        startState: {
            enemiesDefeated: gameState.enemiesDefeated,
            buildingsBuilt: gameState.achievements.stats.totalBuildingsBuilt,
            shipsBuilt: gameState.achievements.stats.totalShipsBuilt,
            researchCompleted: gameState.achievements.stats.totalResearchCompleted,
            sectorsExplored: gameState.exploration.sectorsExplored
        }
    };
    
    showNotification(`Challenge started: ${challenge.name}`, 'info');
    updateChallengesDisplay();
}

function checkChallengeProgress() {
    if (!gameState.challenges.active) return;
    
    const activeKey = gameState.challenges.active.key;
    const challenge = challenges[activeKey];
    const startState = gameState.challenges.active.startState;
    const now = Date.now();
    
    // Check if timed challenge expired
    if (challenge.type === 'timed') {
        const elapsed = (now - gameState.challenges.active.startTime) / 1000;
        if (elapsed > challenge.duration) {
            showNotification(`Challenge failed: ${challenge.name} (time expired)`, 'error');
            gameState.challenges.active = null;
            updateChallengesDisplay();
            return;
        }
    }
    
    // Check completion conditions
    let completed = false;
    
    if (challenge.requirement.enemiesDefeated !== undefined) {
        const progress = gameState.enemiesDefeated - startState.enemiesDefeated;
        if (progress >= challenge.requirement.enemiesDefeated) completed = true;
    }
    
    if (challenge.requirement.buildingsBuilt !== undefined) {
        const progress = gameState.achievements.stats.totalBuildingsBuilt - startState.buildingsBuilt;
        if (progress >= challenge.requirement.buildingsBuilt) completed = true;
    }
    
    if (challenge.requirement.shipsBuilt !== undefined) {
        const progress = gameState.achievements.stats.totalShipsBuilt - startState.shipsBuilt;
        if (progress >= challenge.requirement.shipsBuilt) completed = true;
    }
    
    if (challenge.requirement.researchCompleted !== undefined) {
        const progress = gameState.achievements.stats.totalResearchCompleted - startState.researchCompleted;
        if (progress >= challenge.requirement.researchCompleted) completed = true;
    }
    
    if (challenge.requirement.sectorsExplored !== undefined) {
        const progress = gameState.exploration.sectorsExplored - startState.sectorsExplored;
        if (progress >= challenge.requirement.sectorsExplored) completed = true;
    }
    
    if (challenge.requirement.totalResources !== undefined) {
        const total = gameState.resources.metal + gameState.resources.energy + 
                     gameState.resources.research + gameState.resources.credits;
        const enemyCheck = challenge.requirement.enemiesDefeated !== undefined ? 
                          gameState.enemiesDefeated <= challenge.requirement.enemiesDefeated : true;
        if (total >= challenge.requirement.totalResources && enemyCheck) completed = true;
    }
    
    if (completed) {
        // Award rewards
        for (const [resource, amount] of Object.entries(challenge.reward)) {
            if (resource === 'darkMatter') {
                gameState.prestige.darkMatter += amount;
            } else if (gameState.resources[resource] !== undefined) {
                gameState.resources[resource] += amount;
            }
        }
        
        gameState.challenges.completed.push(activeKey);
        gameState.challenges.available = gameState.challenges.available.filter(k => k !== activeKey);
        gameState.challenges.active = null;
        
        showNotification(`✅ Challenge completed: ${challenge.name}!`, 'achievement');
        updateChallengesDisplay();
    }
}

function updateChallengesDisplay() {
    const challengesList = document.getElementById('challenges-list');
    if (!challengesList) return;
    
    challengesList.innerHTML = '';
    
    // Show active challenge
    if (gameState.challenges.active) {
        const activeKey = gameState.challenges.active.key;
        const challenge = challenges[activeKey];
        const elapsed = Math.floor((Date.now() - gameState.challenges.active.startTime) / 1000);
        const timeLeft = challenge.duration ? challenge.duration - elapsed : null;
        
        const div = document.createElement('div');
        div.className = 'challenge-item active';
        div.innerHTML = `
            <div class="challenge-header">
                <span class="challenge-title">${challenge.name} (ACTIVE)</span>
                <span class="challenge-reward">🏆 Reward: ${Object.entries(challenge.reward).map(([r, a]) => `${a} ${r}`).join(', ')}</span>
            </div>
            <p class="challenge-description">${challenge.description}</p>
            ${timeLeft !== null ? `<p class="challenge-timer">⏱️ Time Remaining: ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s</p>` : ''}
        `;
        challengesList.appendChild(div);
    }
    
    // Show available challenges
    for (const key of gameState.challenges.available) {
        const challenge = challenges[key];
        const div = document.createElement('div');
        div.className = 'challenge-item';
        div.innerHTML = `
            <div class="challenge-header">
                <span class="challenge-title">${challenge.name}</span>
                <span class="challenge-reward">🏆 Reward: ${Object.entries(challenge.reward).map(([r, a]) => `${a} ${r}`).join(', ')}</span>
            </div>
            <p class="challenge-description">${challenge.description}</p>
            <p style="color: #a8dadc; font-size: 0.9em;">Difficulty: <span style="color: ${challenge.difficulty === 'easy' ? '#4caf50' : challenge.difficulty === 'medium' ? '#ffd700' : challenge.difficulty === 'hard' ? '#ff6b6b' : '#9c27b0'}">${challenge.difficulty.toUpperCase()}</span></p>
            <button onclick="startChallenge('${key}')" ${gameState.challenges.active ? 'disabled' : ''} class="control-btn" style="margin-top: 10px;">Start Challenge</button>
        `;
        challengesList.appendChild(div);
    }
    
    // Show completed challenges
    for (const key of gameState.challenges.completed) {
        const challenge = challenges[key];
        const div = document.createElement('div');
        div.className = 'challenge-item completed';
        div.innerHTML = `
            <div class="challenge-header">
                <span class="challenge-title">✅ ${challenge.name}</span>
            </div>
            <p class="challenge-description">${challenge.description}</p>
            <p style="color: #4caf50;">COMPLETED</p>
        `;
        challengesList.appendChild(div);
    }
}

// Story Mode Functions
function updateStoryDisplay() {
    const storyContent = document.getElementById('story-content');
    if (!storyContent) return;
    
    const currentChapter = storyChapters[gameState.story.currentChapter];
    if (!currentChapter) {
        storyContent.innerHTML = '<p style="color: #a8dadc;">Your story has just begun. Continue building your empire...</p>';
        return;
    }
    
    // Check if chapter is unlocked
    if (currentChapter.requires) {
        const meetsRequirements = checkStoryRequirements(currentChapter.requires);
        if (!meetsRequirements) {
            storyContent.innerHTML = `
                <div class="story-panel">
                    <h3 style="color: #9c27b0;">${currentChapter.title} (Locked)</h3>
                    <p style="color: #a8dadc;">Requirements not met. Continue your journey...</p>
                </div>
            `;
            return;
        }
    }
    
    const currentScene = currentChapter.scenes[gameState.story.currentScene];
    if (!currentScene) return;
    
    storyContent.innerHTML = `
        <div class="story-panel">
            <h3 style="color: #9c27b0;">${currentChapter.title}</h3>
            <p class="story-text">${currentScene.text}</p>
            <div class="story-choices">
                ${currentScene.choices.map((choice, index) => `
                    <div class="story-choice" onclick="makeStoryChoice(${index})">
                        ${choice.text}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function checkStoryRequirements(requires) {
    if (requires.enemiesDefeated && gameState.enemiesDefeated < requires.enemiesDefeated) return false;
    if (requires.research && !gameState.research[requires.research]) return false;
    return true;
}

function makeStoryChoice(choiceIndex) {
    const currentChapter = storyChapters[gameState.story.currentChapter];
    const currentScene = currentChapter.scenes[gameState.story.currentScene];
    const choice = currentScene.choices[choiceIndex];
    
    // Apply effects
    if (choice.effect) {
        for (const [resource, amount] of Object.entries(choice.effect)) {
            if (gameState.resources[resource] !== undefined) {
                gameState.resources[resource] += amount;
            } else if (resource === 'ships') {
                for (const [ship, count] of Object.entries(amount)) {
                    gameState.ships[ship] += count;
                }
            }
        }
    }
    
    // Record choice
    gameState.story.choicesMade.push({
        chapter: gameState.story.currentChapter,
        scene: gameState.story.currentScene,
        choice: choiceIndex
    });
    
    // Move to next scene
    if (choice.nextScene === -1) {
        // Chapter complete
        if (choice.unlockChapter !== undefined) {
            if (!gameState.story.unlockedChapters.includes(choice.unlockChapter)) {
                gameState.story.unlockedChapters.push(choice.unlockChapter);
                gameState.story.currentChapter = choice.unlockChapter;
                gameState.story.currentScene = 0;
                showNotification(`New chapter unlocked: ${storyChapters[choice.unlockChapter].title}`, 'discovery');
            }
        }
    } else {
        gameState.story.currentScene = choice.nextScene;
    }
    
    updateStoryDisplay();
    updateUI();
}

// Seasonal Events Functions
function checkSeasonalEvent() {
    const now = Date.now();
    
    // Check if an event should spawn (every 10-20 minutes)
    if (!gameState.seasonalEvents.nextEventTime) {
        gameState.seasonalEvents.nextEventTime = now + (600000 + Math.random() * 600000); // 10-20 min
        return;
    }
    
    // Check if active event expired
    if (gameState.seasonalEvents.active) {
        const event = seasonalEvents[gameState.seasonalEvents.active.key];
        const elapsed = (now - gameState.seasonalEvents.active.startTime) / 1000;
        
        if (elapsed >= event.duration) {
            showNotification(`Event ended: ${event.name}`, 'info');
            gameState.seasonalEvents.active = null;
        }
        return;
    }
    
    // Spawn new event
    if (now >= gameState.seasonalEvents.nextEventTime) {
        const eventKeys = Object.keys(seasonalEvents);
        const weights = eventKeys.map(key => {
            const rarity = seasonalEvents[key].rarity;
            if (rarity === 'common') return 50;
            if (rarity === 'uncommon') return 30;
            if (rarity === 'rare') return 10;
            return 5;
        });
        
        // Weighted random selection
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let selectedIndex = 0;
        
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                selectedIndex = i;
                break;
            }
        }
        
        const eventKey = eventKeys[selectedIndex];
        const event = seasonalEvents[eventKey];
        
        // Apply instant effects
        if (event.effect.darkMatter) {
            gameState.prestige.darkMatter += event.effect.darkMatter;
        }
        
        // Start timed event
        if (event.duration > 0) {
            gameState.seasonalEvents.active = {
                key: eventKey,
                startTime: now
            };
        }
        
        showNotification(`🎉 SEASONAL EVENT: ${event.name}! ${event.description}`, 'achievement');
        gameState.seasonalEvents.nextEventTime = now + (600000 + Math.random() * 600000);
    }
}

function applySeasonalBonuses(production) {
    if (!gameState.seasonalEvents.active) return production;
    
    const event = seasonalEvents[gameState.seasonalEvents.active.key];
    const effect = event.effect;
    
    if (effect.metalBonus) production.metal *= (1 + effect.metalBonus);
    if (effect.energyBonus) production.energy *= (1 + effect.energyBonus);
    if (effect.researchBonus) production.research *= (1 + effect.researchBonus);
    if (effect.allBonus) {
        production.metal *= (1 + effect.allBonus);
        production.energy *= (1 + effect.allBonus);
        production.research *= (1 + effect.allBonus);
        production.credits *= (1 + effect.allBonus);
    }
    
    return production;
}

// Galaxy Generation Functions
function generateGalaxy(size = 'medium') {
    const template = galaxyTemplates[size];
    if (!template) return;
    
    gameState.galaxy.size = size;
    gameState.galaxy.generated = true;
    
    // Generate procedural sectors based on seed
    const sectors = [];
    for (let i = 0; i < template.sectors; i++) {
        const sectorSeed = gameState.galaxy.seed + i;
        const random = seededRandom(sectorSeed);
        
        // Determine sector type
        const typeRoll = random();
        let type;
        if (typeRoll < 0.3) type = sectorTypes[0]; // Asteroid Field
        else if (typeRoll < 0.6) type = sectorTypes[1]; // Nebula
        else if (typeRoll < 0.85) type = sectorTypes[2]; // Ancient Ruins
        else type = sectorTypes[3]; // Trade Hub
        
        sectors.push({
            id: i,
            name: `${type.name} Sector-${i}`,
            type: type.name,
            bonus: type.bonus,
            multiplier: type.multiplier * template.resourceMultiplier,
            enemyChance: random() * template.enemyDensity,
            discovered: false
        });
    }
    
    showNotification(`Galaxy generated! ${template.sectors} sectors await discovery.`, 'discovery');
    return sectors;
}

// Simple seeded random number generator
function seededRandom(seed) {
    let state = seed;
    return function() {
        state = (state * 9301 + 49297) % 233280;
        return state / 233280;
    };
}

function displaySeasonalEvent() {
    // Could add a UI element to show active seasonal events
    if (!gameState.seasonalEvents.active) return null;
    
    const event = seasonalEvents[gameState.seasonalEvents.active.key];
    const elapsed = Math.floor((Date.now() - gameState.seasonalEvents.active.startTime) / 1000);
    const remaining = Math.max(0, event.duration - elapsed);
    
    return {
        name: event.name,
        description: event.description,
        timeRemaining: remaining
    };
}

// Apply special building effects
function applyBuildingEffects(deltaTime) {
    // Refinery: Auto-convert resources
    if (gameState.buildings.refinery > 0) {
        const refinery = buildings.refinery;
        const convertAmount = refinery.refinesPerSecond * gameState.buildings.refinery * deltaTime;
        if (gameState.resources.metal >= convertAmount * 2) {
            gameState.resources.metal -= convertAmount * 2;
            gameState.resources.energy += convertAmount;
        }
    }
    
    // Factory: Auto-produce ships
    if (gameState.buildings.factory > 0) {
        if (!gameState.factoryTimer) gameState.factoryTimer = 0;
        gameState.factoryTimer += deltaTime;
        
        const factory = buildings.factory;
        if (gameState.factoryTimer >= factory.autoProduceInterval) {
            const shipsToMake = Math.floor(gameState.factoryTimer / factory.autoProduceInterval);
            gameState.ships[factory.autoProduceShip] += shipsToMake * gameState.buildings.factory;
            gameState.factoryTimer %= factory.autoProduceInterval;
            gameState.achievements.stats.totalShipsBuilt += shipsToMake * gameState.buildings.factory;
        }
    }
    
    // Bank: Generate interest
    if (gameState.buildings.bank > 0) {
        const bank = buildings.bank;
        const interestPerSecond = bank.interestRate / 60; // Convert per-minute to per-second
        const interest = gameState.resources.credits * interestPerSecond * gameState.buildings.bank * deltaTime;
        gameState.resources.credits += interest;
        gameState.achievements.stats.totalResourcesEarned += interest;
    }
    
    // Mining Ships: Passive resource collection
    if (gameState.ships.miningShip > 0) {
        const miningShip = ships.miningShip;
        for (const [resource, amount] of Object.entries(miningShip.miningBonus)) {
            const collected = amount * gameState.ships.miningShip * deltaTime;
            gameState.resources[resource] += collected;
            gameState.achievements.stats.totalResourcesEarned += collected;
        }
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
    
    // Calculate resource caps
    const resourceCaps = {
        metal: 10000,
        energy: 10000,
        research: 5000,
        credits: 20000
    };
    
    // Apply warehouse bonuses
    const warehouseCount = gameState.buildings.warehouse || 0;
    for (const resource in resourceCaps) {
        resourceCaps[resource] += warehouseCount * 5000;
    }
    
    // Add resources based on production and game speed
    for (const [resource, rate] of Object.entries(production)) {
        gameState.resources[resource] += rate * deltaTime * gameSettings.gameSpeed;
        // Apply caps
        gameState.resources[resource] = Math.min(gameState.resources[resource], resourceCaps[resource]);
    }
    
    // Store caps for UI display
    gameState.resourceCaps = resourceCaps;
    
    // Apply sector bonuses
    for (const sector of Object.values(gameState.exploration.sectors)) {
        if (sector.controlled && sector.bonus) {
            const baseProduction = production[sector.bonus] || 0;
            const bonus = baseProduction * (sector.multiplier - 1) * deltaTime * gameSettings.gameSpeed;
            gameState.resources[sector.bonus] += bonus;
            // Apply caps
            gameState.resources[sector.bonus] = Math.min(gameState.resources[sector.bonus], resourceCaps[sector.bonus]);
        }
    }
    
    // Check for enemy waves
    if (gameState.combat.waveEnabled && now >= gameState.combat.nextWaveTime) {
        triggerEnemyWave();
    }
    
    // Check expeditions
    checkExpeditions();
    
    // Update resource nodes
    updateResourceNodes(deltaTime * gameSettings.gameSpeed);
    
    // Apply special building effects
    applyBuildingEffects(deltaTime * gameSettings.gameSpeed);
    
    // Check achievements
    checkAchievements();
    
    // Auto-combat if enabled
    if (gameSettings.autoCombatEnabled) {
        autoEngageCombat();
    }
    
    // Record production statistics
    recordProductionSnapshot();
    
    // Update play time
    gameState.statistics.totalPlayTime += (now - gameState.lastUpdate);
    
    // Check challenge progress
    checkChallengeProgress();
    
    // Check for seasonal events
    checkSeasonalEvent();
    
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

// Calculate Dark Matter earned on prestige
function calculatePrestigeGain() {
    let darkMatter = 0;
    
    // Base dark matter from enemies defeated (1 DM per 10 enemies)
    darkMatter += Math.floor(gameState.enemiesDefeated / 10);
    
    // Dark matter from total resources earned
    const totalResources = gameState.resources.metal + gameState.resources.energy + 
                           gameState.resources.research + gameState.resources.credits;
    darkMatter += Math.floor(totalResources / 100000);
    
    // Add milestone bonuses
    if (gameState.enemiesDefeated >= 100 && !gameState.prestige.milestones.enemies100) {
        darkMatter += prestigeMilestones.enemies100.bonus;
    }
    if (gameState.enemiesDefeated >= 500 && !gameState.prestige.milestones.enemies500) {
        darkMatter += prestigeMilestones.enemies500.bonus;
    }
    if (gameState.enemiesDefeated >= 1000 && !gameState.prestige.milestones.enemies1000) {
        darkMatter += prestigeMilestones.enemies1000.bonus;
    }
    
    const totalRes = gameState.resources.metal + gameState.resources.energy + 
                     gameState.resources.research + gameState.resources.credits;
    if (totalRes >= 1000000 && !gameState.prestige.milestones.resources1M) {
        darkMatter += prestigeMilestones.resources1M.bonus;
    }
    if (totalRes >= 10000000 && !gameState.prestige.milestones.resources10M) {
        darkMatter += prestigeMilestones.resources10M.bonus;
    }
    
    // Check if all research is complete
    const allResearchComplete = Object.values(gameState.research).every(val => val === true);
    if (allResearchComplete && !gameState.prestige.milestones.allTech) {
        darkMatter += prestigeMilestones.allTech.bonus;
    }
    
    return Math.max(darkMatter, 1); // Minimum 1 dark matter
}

// Prestige reset
function prestigeReset() {
    const dmGain = calculatePrestigeGain();
    
    const message = `You will gain ${dmGain} Dark Matter. All progress will be reset, but you'll keep prestige upgrades. Continue?`;
    if (!confirm(message)) {
        return;
    }
    
    // Update milestones before reset
    if (gameState.enemiesDefeated >= 100) gameState.prestige.milestones.enemies100 = true;
    if (gameState.enemiesDefeated >= 500) gameState.prestige.milestones.enemies500 = true;
    if (gameState.enemiesDefeated >= 1000) gameState.prestige.milestones.enemies1000 = true;
    
    const totalRes = gameState.resources.metal + gameState.resources.energy + 
                     gameState.resources.research + gameState.resources.credits;
    if (totalRes >= 1000000) gameState.prestige.milestones.resources1M = true;
    if (totalRes >= 10000000) gameState.prestige.milestones.resources10M = true;
    
    const allResearchComplete = Object.values(gameState.research).every(val => val === true);
    if (allResearchComplete) gameState.prestige.milestones.allTech = true;
    
    // Award dark matter
    gameState.prestige.darkMatter += dmGain;
    gameState.prestige.totalResets++;
    
    // Save prestige data
    const prestigeData = JSON.parse(JSON.stringify(gameState.prestige));
    
    // Reset resources
    gameState.resources = {
        metal: 0,
        energy: 0,
        research: 0,
        credits: 100
    };
    
    // Apply starting bonus if unlocked
    const startingLevel = gameState.prestige.upgrades.startingBonus;
    if (startingLevel > 0) {
        const bonus = startingLevel * 100;
        gameState.resources.metal += bonus;
        gameState.resources.energy += bonus;
        gameState.resources.credits += bonus * 2;
    }
    
    // Reset buildings
    for (const key in gameState.buildings) {
        gameState.buildings[key] = 0;
    }
    
    // Reset research
    for (const key in gameState.research) {
        gameState.research[key] = false;
    }
    
    // Reset ships
    for (const key in gameState.ships) {
        gameState.ships[key] = 0;
    }
    
    // Reset enemies defeated
    gameState.enemiesDefeated = 0;
    
    // Restore prestige data
    gameState.prestige = prestigeData;
    
    saveGame();
    updateUI();
    addCombatLog(`Prestige activated! Gained ${dmGain} Dark Matter!`, 'victory');
}

// Get prestige upgrade cost
function getPrestigeUpgradeCost(upgradeKey) {
    const upgrade = prestigeUpgrades[upgradeKey];
    const currentLevel = gameState.prestige.upgrades[upgradeKey];
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
}

// Purchase prestige upgrade
function buyPrestigeUpgrade(upgradeKey) {
    const upgrade = prestigeUpgrades[upgradeKey];
    const currentLevel = gameState.prestige.upgrades[upgradeKey];
    
    if (currentLevel >= upgrade.maxLevel) {
        addCombatLog('Upgrade is already at max level!', 'defeat');
        return;
    }
    
    const cost = getPrestigeUpgradeCost(upgradeKey);
    
    if (gameState.prestige.darkMatter < cost) {
        addCombatLog('Not enough Dark Matter!', 'defeat');
        return;
    }
    
    gameState.prestige.darkMatter -= cost;
    gameState.prestige.upgrades[upgradeKey]++;
    
    saveGame();
    updateUI();
    addCombatLog(`Purchased ${upgrade.name} level ${gameState.prestige.upgrades[upgradeKey]}!`, 'victory');
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
    
    // Theme selector
    const themeSelector = document.getElementById('setting-theme');
    if (themeSelector) {
        themeSelector.value = gameSettings.theme || 'dark';
    }
    
    // Audio settings
    const soundEffects = document.getElementById('setting-sound-effects');
    const music = document.getElementById('setting-music');
    const volume = document.getElementById('setting-volume');
    const volumeDisplay = document.getElementById('volume-display');
    
    if (soundEffects) soundEffects.checked = gameSettings.soundEffectsEnabled || false;
    if (music) music.checked = gameSettings.musicEnabled || false;
    if (volume) {
        volume.value = gameSettings.masterVolume || 50;
        if (volumeDisplay) volumeDisplay.textContent = `${gameSettings.masterVolume || 50}%`;
    }
    
    updateSpeedDisplay();
}

// Apply setting change
function applySetting(settingName, value) {
    // Validate settingName to prevent unintended property modification
    const allowedSettings = [
        'autoSaveEnabled',
        'autoSaveInterval',
        'gameSpeed',
        'showResourceRates',
        'showNotifications',
        'confirmReset',
        'confirmBulkActions',
        'autoCombatEnabled',
        'offlineProgressEnabled',
        'theme',
        'soundEffectsEnabled',
        'musicEnabled',
        'masterVolume',
        'showTooltips'
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
    
    // Update volume display
    if (settingName === 'masterVolume') {
        const volumeDisplay = document.getElementById('volume-display');
        if (volumeDisplay) {
            volumeDisplay.textContent = `${value}%`;
        }
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
    
    // Apply saved theme
    if (gameSettings.theme && gameSettings.theme !== 'dark') {
        document.body.classList.add(`theme-${gameSettings.theme}`);
    }
    
    // Try to load saved game
    const saved = localStorage.getItem('galaxyBuilderSave');
    if (saved) {
        const loadedState = JSON.parse(saved);
        Object.assign(gameState, loadedState);
        
        // Apply offline progress
        applyOfflineProgress();
    } else {
        gameState.lastUpdate = Date.now();
        gameState.statistics.sessionStartTime = Date.now();
    }
    
    // Initialize challenges if not already set
    if (!gameState.challenges.available || gameState.challenges.available.length === 0) {
        initializeChallenges();
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
