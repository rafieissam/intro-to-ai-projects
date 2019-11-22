// For convenience, set this to true to skip intro song
const skipIntro = true;

// Array of possible behaviors
let bhvrs = ["Hunting", "Defense", "Shy", "Random"];

// Global Variables
const ticksPerUnitRate = 5;
let ticks = 0;
let pelletsEaten = [];
let pelletTime = 0;
let pelletRate = 0;
let id = 0;

for (let i = 0; i < ticksPerUnitRate; i++)
    pelletsEaten.push(0);

/**
 * This function is called when pacman eats a pellet
 */
function pacmanAte() {
    pelletTime = 0;
    if (pelletsEaten.length)
        pelletsEaten[pelletsEaten.length - 1]++;
}

function roundDec(num) {
    return Math.round(num * 100) / 100;
}

function getDistance(c1, c2) {
    return roundDec(Math.sqrt((c2.x - c1.x) * (c2.x - c1.x) + (c2.y - c1.y) * (c2.y - c1.y)));
}

function fuzzify(name, value) {
    let levelSize = 808;
    let baseTime = 16;
    let maxRate = 10;
    switch (name) {
        case "pacmanDistance":
        case "ghostDistance":
            return (function() {
                let pts = [0, levelSize / 3, 2 * levelSize / 3];
                let near = 0, medium = 0, far = 0;
                if (value >= pts[0] && value < pts[2]) {
                    if (value >= pts[0] && value < pts[1]) {
                        near = - value / (pts[1] - pts[0]) + 1;
                        medium = value / (pts[1] - pts[0]);
                    }
                    else if (value >= pts[1] && value < pts[2]) {
                        medium = - value / (pts[2] - pts[1]) + (pts[2] / (pts[2] - pts[1]));
                        far = value / (pts[2] - pts[1]) - (pts[1] / (pts[2] - pts[1]));
                    } else {
                        medium = 1;
                    }
                } else if (value >= pts[2]) {
                    far = 1;
                }
                near = roundDec(near);
                medium = roundDec(medium);
                far = roundDec(far);
                return {near, medium, far};
            })();
        case "pelletTime":
            return (function() {
                let pts = [0, 2 * baseTime / 3, 4 * baseTime / 3];
                let short = 0, medium = 0, long = 0;
                if (value >= pts[0] && value < pts[2]) {
                    if (value >= pts[0] && value < pts[1]) {
                        short = - value / (pts[1] - pts[0]) + 1;
                        medium = value / (pts[1] - pts[0]);
                    }
                    else if (value >= pts[1] && value < pts[2]) {
                        medium = - value / (pts[2] - pts[1]) + (pts[2] / (pts[2] - pts[1]));
                        long = value / (pts[2] - pts[1]) - (pts[1] / (pts[2] - pts[1]));
                    } else {
                        medium = 1;
                    }
                } else if (value >= pts[2]) {
                    long = 1;
                }
                short = roundDec(short);
                medium = roundDec(medium);
                long = roundDec(long);
                return {short, medium, long};
            })();
        case "pelletRate":
            return (function() {
                let pts = [0, maxRate / 4, maxRate / 2];
                let slow = 0, medium = 0, fast = 0;
                if (value >= pts[0] && value < pts[2]) {
                    slow = - value / (pts[2] - pts[0]) + 1;
                    fast = value / (pts[2] - pts[0]);
                    if (value >= pts[0] && value < pts[1]) {
                        medium = value / (pts[1] - pts[0]);
                    }
                    else if (value >= pts[1] && value < pts[2]) {
                        medium = - value / (pts[2] - pts[1]) + 2;
                    } else {
                        medium = 1;
                    }
                } else if (value >= pts[2]) {
                    fast = 1;
                }
                slow = roundDec(slow);
                medium = roundDec(medium);
                fast = roundDec(fast);
                return {slow, medium, fast};
            })();
    }
}

function defuzzify(pacmanDistance, ghostDistance, pelletTime, pelletRate) {
    let hunting, defense, shy, random;
    hunting = Math.max(Math.min(pacmanDistance.near, pelletRate.fast),
                Math.min(pacmanDistance.near, pelletRate.medium, pelletTime.medium),
                Math.min(pacmanDistance.near, pelletRate.medium, pelletTime.long),
                Math.min(pacmanDistance.medium, pelletRate.fast, pelletTime.long),
                Math.min(pacmanDistance.medium, pelletRate.medium, pelletTime.long),
                Math.min(pacmanDistance.far, pelletRate.fast, pelletTime.long));
    defense = Math.max(Math.min(pacmanDistance.far, pelletRate.slow, ghostDistance.far, pelletTime.short),
                Math.min(pacmanDistance.far, pelletRate.slow, ghostDistance.far, pelletTime.medium),
                Math.min(pacmanDistance.far, pelletRate.slow, ghostDistance.medium, pelletTime.short),
                Math.min(pacmanDistance.far, pelletRate.slow, ghostDistance.medium, pelletTime.medium),
                Math.min(pacmanDistance.far, pelletRate.medium, ghostDistance.far, pelletTime.short),
                Math.min(pacmanDistance.medium, pelletRate.slow, ghostDistance.far, pelletTime.short));
    shy = Math.max(Math.min(pacmanDistance.far, pelletRate.slow, ghostDistance.near, pelletTime.short),
                Math.min(pacmanDistance.far, pelletRate.slow, ghostDistance.near, pelletTime.medium),
                Math.min(pacmanDistance.far, pelletRate.slow, ghostDistance.medium, pelletTime.short),
                Math.min(pacmanDistance.far, pelletRate.slow, ghostDistance.medium, pelletTime.medium),
                Math.min(pacmanDistance.far, pelletRate.medium, ghostDistance.near, pelletTime.short),
                Math.min(pacmanDistance.medium, pelletRate.slow, ghostDistance.near, pelletTime.short));
    random = Math.min(1 - hunting, 1 - defense, 1 - shy);
    return {hunting, defense, shy, random};
}

function multipleWeights(behaviors) {
    let hunting, defense, shy, random;
    hunting = behaviors.hunting * 4;
    defense = behaviors.defense * 1;
    shy = behaviors.shy * 1;
    random = behaviors.random * 2;
    return {hunting, defense, shy, random};
}

function selectMax(behaviors) {
    let maxNum = null, maxBhvr;
    for (let i in behaviors) {
        let n = behaviors[i];
        if (maxNum == null || n > maxNum) {
            maxNum = n;
            maxBhvr = i;
        }
    }
    return maxBhvr.charAt(0).toUpperCase() + maxBhvr.slice(1);
}

/**
 * This function is called by an individual ghost to decide what behavior to act
 * @param {*} myGhost The ghost that called this function
 * @param {*} pacmanCoords The coordinates of pacman
 * @param {*} ghostsCoords The coordinates of all the other ghosts
 */
function chooseBehavior(myGhost, pacmanCoords, ghostsCoords) {
    // return "Defense";
    if (!id)
        id = myGhost.color;
    if (id == myGhost.color) {
        pelletTime++;
        if (ticks++ == ticksPerUnitRate) {
            ticks = 0;
            pelletsEaten.shift();
            pelletsEaten.push(0);
        }
        pelletRate = 0;
        for (let i = 0; i < pelletsEaten.length; i++)
            pelletRate += pelletsEaten[i];
        pelletRate /= pelletsEaten.length;
    }
    let pacmanDistance = getDistance(myGhost, pacmanCoords);
    let ghostDistance = null;
    for (let i in ghostsCoords) {
        let d = getDistance(myGhost, ghostsCoords[i]);
        if (ghostDistance == null || d < ghostDistance)
            ghostDistance = d;
    }
    let fuzzy = {};
    fuzzy.pacmanDistance = fuzzify("pacmanDistance", pacmanDistance);
    fuzzy.ghostDistance = fuzzify("ghostDistance", ghostDistance);
    fuzzy.pelletTime = fuzzify("pelletTime", pelletTime);
    fuzzy.pelletRate = fuzzify("pelletRate", pelletRate);
    let behaviors = defuzzify(fuzzy.pacmanDistance, fuzzy.ghostDistance, fuzzy.pelletTime, fuzzy.pelletRate);
    behaviors = multipleWeights(behaviors);
    return selectMax(behaviors);
}

// "Defense" and "Shy" behaviors are not actually implemented. If unimplemented
// behaviors are chosen then the "Random" behavior will take effect. In the case
// that you would like to code your own behaviors for extra credit set the
// respective behavior's custom code flag to true.

const customHunting = false;
const customDefense = true;
const customShy = true;
const customRandom = false;

/**
 * Custom function that is called during "Hunting" behavior
 * @param {*} myGhost The ghost that called this function
 * @param {*} pacman Pacman object
 */
function behaveHunting(myGhost, pacman) {
    // CODE HERE
}

/**
 * Custom function that is called during "Defense" behavior
 * @param {*} myGhost The ghost that called this function
 * @param {*} mapSize Size of map in number of nodes
 * @param {*} pellets Array of all remaining pellets on the map
 * @param {*} nodeSize Size of a node to find pellet coordinates
 * Example:
 * pellets[0].x => node x
 * (pellets[0].x + 0.5) * nodeSize => actual x
 */
function behaveDefense(myGhost, mapSize, nodeSize, pellets) {
    let area = [];
    for (let i = 0; i < 3; i++) {
        let xmin = Math.round(i * mapSize.x / 4);
        let xmax = Math.round((i + 2) * mapSize.x / 4);
        area[i] = [];
        for (let j = 0; j < 3; j++) {
            let ymin = Math.round(j * mapSize.y / 4);
            let ymax = Math.round((j + 2) * mapSize.y / 4);
            let value = 0;
            for (let pi = 0; pi < pellets.length; pi++) {
                if ((pellets[pi].x >= xmin && (pellets[pi].x < xmax || xmax == mapSize.x))
                    && (pellets[pi].y >= ymin && (pellets[pi].y < ymax || ymax == mapSize.y)))
                    value++;
            }
            area[i][j] = {
                xmin, xmax,
                ymin, ymax,
                pelletCount: value
            };
        }
    }
    let max = null;
    for (let i = 0; i < area.length; i++)
        for (let j = 0; j < area[i].length; j++)
            if (max == null || area[i][j].pelletCount > max.pelletCount)
                max = area[i][j];
    let pelletRegion = [];
    for (let i = max.xmin; i < max.xmax || i == max.xmax; i++) {
        pelletRegion[i - max.xmin] = [];
        for (let j = max.ymin; j < max.ymax || j == max.ymax; j++) {
            pelletRegion[i - max.xmin][j - max.ymin] = 0;
        }
    }
    for (let i = 0; i < pellets.length; i++) {
        if ((pellets[i].x >= max.xmin && (pellets[i].x < max.xmax || max.xmax == mapSize.x))
            && (pellets[i].y >= max.ymin && (pellets[i].y < max.ymax || max.ymax == mapSize.y)))
            pelletRegion[pellets[i].x - max.xmin][pellets[i].y - max.ymin] = 1;
    }
    let t = 0;
    let midPellet;
    let leave = false;
    for (let i = 0; i < pelletRegion.length; i++) {
        for (let j = 0; j < pelletRegion[i].length; j++) {
            if (pelletRegion[i][j])
                t++;
            if (t >= max.pelletCount) {
                midPellet = {
                    x: i + max.xmin,
                    y: j + max.ymin
                };
                leave = true;
                break;
            }
        }
        if (leave)
            break;
    }
    myGhost.goToCoords(midPellet.x, midPellet.y);
}

/**
 * Custom function that is called during "Shy" behavior
 * @param {*} myGhost The ghost that called this function
 * @param {*} restGhosts All ghosts excluding the ghost that called this function
 * @param {*} nodes Array of all nodes excluding walls
 * @param {*} nodeSize Size of a node to find pellet coordinates
 */
function behaveShy(myGhost, restGhosts, nodes, nodeSize) {
    let min = null, minGhost;
    for (let i = 0; i < restGhosts.length; i++) {
        let d = Math.abs(restGhosts[i].x - myGhost.x) + Math.abs(restGhosts[i].y - myGhost.y);
        if (min == null || d < min) {
            min = d
            minGhost = restGhosts[i];
        }
    }
    let xDiff = minGhost.x - myGhost.x;
    let yDiff = minGhost.y - myGhost.y;

    let x = Math.floor(myGhost.x / nodeSize);
    let y = Math.floor(myGhost.y / nodeSize);
    let right, left, top, bottom;
    for (let i = 0; i < nodes; i++) {
        right = right || nodes.x == x + 1 && nodes.y == y;
        left = left || nodes.x == x - 1 &&  nodes.y == y;
        top = top || nodes.x == x &&  nodes.y == y - 1;
        bottom = bottom || nodes.x == x &&  nodes.y == y + 1;
    }
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff < 0 && right)
            myGhost.changeDirection(39);
        else if (xDiff > 0 && left)
            myGhost.changeDirection(37);
        else if (yDiff < 0 && bottom)
            myGhost.changeDirection(40);
        else if (yDiff > 0 && top)
            myGhost.changeDirection(38);
        else if (left)
            myGhost.changeDirection(37);
        else if (top)
            myGhost.changeDirection(38);
        else if (right)
            myGhost.changeDirection(39);
        else
            myGhost.changeDirection(40);
    } else {
        if (yDiff < 0 && bottom)
            myGhost.changeDirection(40);
        else if (yDiff > 0 && top)
            myGhost.changeDirection(38);
        else if (xDiff < 0 && right)
            myGhost.changeDirection(39);
        else if (xDiff > 0 && left)
            myGhost.changeDirection(37);
        else if (left)
            myGhost.changeDirection(37);
        else if (top)
            myGhost.changeDirection(38);
        else if (right)
            myGhost.changeDirection(39);
        else
            myGhost.changeDirection(40);
    }
}

/**
 * Custom function that is called during "Random" behavior
 * @param {*} myGhost The ghost that called this function
 * @param {*} nodes Array of all nodes excluding walls
 */
function behaveRandom(myGhost, nodes) {
    // CODE HERE
}