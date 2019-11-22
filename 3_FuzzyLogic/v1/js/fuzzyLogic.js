// For convenience, set this to true to skip intro song
const skipIntro = false;

// Array of possible behaviors
let bhvrs = ["Hunting", "Defense", "Shy", "Random"];

// Global Variables
// CODE HERE

/**
 * This function is called when pacman eats a pellet
 */
function pacmanAte() {
    // CODE HERE
}

/**
 * This function is called by an individual ghost to decide what behavior to act
 * @param {*} myGhost The ghost that called this function
 * @param {*} pacmanCoords The coordinates of pacman
 * @param {*} ghostsCoords The coordinates of all the other ghosts
 */
function chooseBehavior(myGhost, pacmanCoords, ghostsCoords) {
    // CODE HERE
    return bhvrs[0]; // You should change this return value
}

// "Defense" and "Shy" behaviors are not actually implemented. If unimplemented
// behaviors are chosen then the "Random" behavior will take effect. In the case
// that you would like to code your own behaviors for extra credit set the
// respective behavior's custom code flag to true.

const customHunting = false;
const customDefense = false;
const customShy = false;
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
 * @param {*} pellets Array of all remaining pellets on the map
 * @param {*} nodeSize Size of a node to find pellet coordinates
 * Example:
 * pellets[0].x => node x
 * (pellets[0].x + 0.5) * nodeSize => actual x
 */
function behaveDefense(myGhost, pellets, nodeSize) {
    // CODE HERE
}

/**
 * Custom function that is called during "Shy" behavior
 * @param {*} myGhost The ghost that called this function
 * @param {*} allGhosts All ghosts including the ghost that called this function
 */
function behaveShy(myGhost, allGhosts) {
    // CODE HERE
}

/**
 * Custom function that is called during "Random" behavior
 * @param {*} myGhost The ghost that called this function
 * @param {*} nodes Array of all nodes excluding walls
 */
function behaveRandom(myGhost, nodes) {
    // CODE HERE
}