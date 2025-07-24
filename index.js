function displayDetails(data) {
    if (Array.isArray(data)) { //if the API finds the word, it returns an array.  If not, it returns an object.
        document.getElementById("placeholder").classList.add("hidden");
        const resultsContainer = document.querySelector("#lookup-results");

        //For each word searched, the API can return multiple entries, each with its own phonetics information, meanings (which each have a part of speech and list of definitions), and optional synonyms
        data.forEach(entry => {
            const resultsItem = document.createElement("article");
            const resultsItemHeading = document.createElement("h3");
            const resultsItemAudio = document.createElement("audio");
            resultsItemHeading.textContent = `${entry.word} (${entry.phonetic})`;
            resultsItemAudio.src = entry.phonetics[0].audio;
            resultsItemAudio.controls = true;
            resultsItem.append(resultsItemHeading, resultsItemAudio);
            const resultsItemMeanings = document.createElement("ol");
            entry.meanings.forEach((meaning) => {
                const meaningItem = document.createElement("li");
                const partOfSpeech = document.createElement("h4");
                partOfSpeech.textContent = meaning.partOfSpeech;
                const definitionList = document.createElement("ul");
                meaning.definitions.forEach((definition) => {
                    const definitionItem = document.createElement("li");
                    definitionItem.textContent = definition.definition;
                    definitionList.append(definitionItem);
                });
                let itemSynonyms;
                if (meaning.synonyms.length > 0) {
                    const synonyms = meaning.synonyms.join(", ");
                    itemSynonyms = document.createElement("p");
                    itemSynonyms.innerHTML = `<span>Synonyms:</span> ${synonyms}`;
                } else {
                    itemSynonyms = false;
                }
                meaningItem.append(partOfSpeech, definitionList);
                if (itemSynonyms) {
                    meaningItem.append(itemSynonyms);
                }
                resultsItemMeanings.append(meaningItem);
            });
            resultsItem.append(resultsItemMeanings);
            resultsContainer.append(resultsItem);
        });
    } else { //word was not found in the dictionary, so use the messaging that the API returns
        document.getElementById("placeholder").textContent = data.title;
        document.getElementById("placeholder").classList.add("error");
        document.getElementById("placeholder").classList.remove("hidden");
    }
}

//When Search button is pressed, search Free Dictionary API for the entered word, then process the returned data
document.getElementById("word-lookup").addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelectorAll('#lookup-results article').forEach(el => el.remove()); //clear previous results

    const word = document.getElementById("search-word").value;
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => response.json())
    .then(data => {
        displayDetails(data);
    })
    .catch(error => {
        document.getElementById("placeholder").textContent = error.message;
        document.getElementById("placeholder").classList.add("error");
        document.getElementById("placeholder").classList.remove("hidden");
    });
});