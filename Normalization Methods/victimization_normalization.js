
/*
UNIT TESTING HAS PROVED SUCCESFULL
*/


/**
 * Normalization function
 * Takes an input: "Type of Victimization"
 * Returns normalized data with every type of victimization in an array:
 * Possible array values:
 * sex trafficking
 * sex exploitation
 * labor trafficking
 * labor exploitation
 */
function extractVictimizationPairs(text) {
    // Handles case "unknown", else moves through typical logic
    if (text.toLowerCase() === "unknown") {
        return ["unknown"];
    }

    // Normalize: replace commas and ampersands with a space globally, then convert to lowercase
    let words = text.toLowerCase().replace(/[,&]/g, " ");
    
    // Split the string into an array of words based on whitespace
    let wordArray = words.split(/\s+/);

    // Map type words
    const typeMap = {
        "sex": "sex",
        "sexual": "sex",
        "labor": "labor"
    };

    const forms = ["trafficking", "exploitation"];

    const result = [];
    let pendingTypes = []; // types waiting to be matched

    // This for loop iterates through the words in the string
    // If the word is a type then it throws it into a list awaiting a form
    // once a form word is found, all pending type words are attributed that form and thrown into result
    for (const w of wordArray) {
        if (w in typeMap) {
            // Store type until next form appears
            pendingTypes.push(typeMap[w]);
        } else if (forms.includes(w)) {
            // Pair this form with ALL pending types
            for (const t of pendingTypes) {
                result.push(`${t} ${w}`);
            }
            pendingTypes = []; // reset after matching
        }
    }

    return result;
}