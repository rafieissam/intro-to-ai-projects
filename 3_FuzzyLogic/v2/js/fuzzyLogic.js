// For convenience, set this to true to skip intro song
const skipIntro = false;

// Array of possible behaviours
// ----------------------------
// "Defense" and "Shy" behaviours are not actually implemented
// If unimplemented behaviours are chosen then "Random" will take effect
let bhvrs = ["Hunting", "Defense", "Shy", "Random"];

// Global Variables
// ----------------
// CODE HERE

function pacmanAte() {
    // CODE HERE
    console.log("nom nom"); // This line can be removed
}

function chooseBehaviour(ghost, pacmanDistance, ghostsDistances) {
    // To change the behaviour of the ghost:
    // ghost.setBehaviour("Hunting");
    
    // CODE HERE
    ghost.setBehaviour(bhvrs[0]); // This line can be removed
}