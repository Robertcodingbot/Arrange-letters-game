async function fetchWord(word) {
    const endpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
    const response = await fetch(endpoint);

    if (response.ok) {
        const data = await response.json();
        return data[0].word;  // Get the word from the API response
    } else {
        return null;
    }
}

async function arrangeLetters() {
    const input = document.getElementById('inputLetters').value.trim().toUpperCase();
    const results = document.getElementById('wordList');
    const totalCount = document.getElementById('totalCount');
    results.innerHTML = '';
    totalCount.innerText = '';

    if (input.length === 0) {
        alert('Please enter some letters.');
        return;
    }

    const words = await findValidWords(input);

    results.innerText = words.join('\n');
    totalCount.innerText = words.length;
}

async function findValidWords(input) {
    const permutations = getPermutations(input);
    const validWords = [];

    for (const word of permutations) {
        const validWord = await fetchWord(word);
        if (validWord) {
            validWords.push(validWord);
        }
    }

    return [...new Set(validWords)]; // Remove duplicates
}

// Function to generate permutations of the given letters
function getPermutations(string) {
    if (string.length < 2) return [string];

    let permutations = [];

    for (let i = 0; i < string.length; i++) {
        let char = string[i];

        if (string.indexOf(char) != i) continue; // Avoid duplicates

        let remainingString = string.slice(0, i) + string.slice(i + 1, string.length);

        for (let subPermutation of getPermutations(remainingString)) {
            permutations.push(char + subPermutation);
        }
    }
    return permutations;
}
