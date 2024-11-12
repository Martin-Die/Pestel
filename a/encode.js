// Fonction pour inverser une chaîne de caractères
function reverseString(str) {
    return str.split('').reverse().join('');
}

// Fonction pour encoder en Base64 avec btoa (disponible dans les navigateurs)
function encodeBase64(str) {
    return btoa(str); // Utilise btoa dans un navigateur
}

// Ta clé API originale
const originalApiKey = "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";

// Étape 1: Découper la clé en deux parties
const part1 = originalApiKey.slice(0, 14);  // "sk-1234567890"
const part2 = originalApiKey.slice(14);     // "abcdefghijklmnopqrst"

// Étape 2: Inverser la première partie
const reversedPart1 = reverseString(part1); // "0987654321-ks"

// Étape 3: Reconstituer la chaîne avec les deux parties réorganisées
const obfuscatedKey = part2 + reversedPart1; // "abcdefghijklmnopqrst0987654321-ks"

// Étape 4: Encoder en Base64 avec btoa
const encodedKey = encodeBase64(obfuscatedKey);

console.log("Clé API encodée :", encodedKey);  // Affiche la clé encodée
