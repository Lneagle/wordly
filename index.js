function displayDetails(info) {
    if (Array.isArray(info)) {
        document.getElementById("placeholder").classList.add("hidden");
        const resultsList = document.querySelector("#results");
        info.forEach(entry => {
            const resultsItem = document.createElement("article");
            const itemHeading = document.createElement("h3");
            const itemAudio = document.createElement("audio");
            itemHeading.textContent = `${entry.word} (${entry.phonetic})`;
            itemAudio.src = entry.phonetics[0].audio;
            itemAudio.controls = true;
            resultsItem.append(itemHeading, itemAudio);
            const itemMeanings = document.createElement("ol");
            entry.meanings.forEach((meaning) => {
                const meaningItem = document.createElement("li");
                const itemPOS = document.createElement("h4");
                itemPOS.textContent = meaning.partOfSpeech;
                const itemDefList = document.createElement("ul");
                meaning.definitions.forEach((definition) => {
                    const defItem = document.createElement("li");
                    defItem.textContent = definition.definition;
                    itemDefList.append(defItem);
                });
                let itemSyns;
                if (meaning.synonyms.length > 0) {
                    const synonyms = meaning.synonyms.join(", ");
                    itemSyns = document.createElement("p");
                    itemSyns.innerHTML = `<span>Synonyms:</span> ${synonyms}`;
                } else {
                    itemSyns = false;
                }
                meaningItem.append(itemPOS, itemDefList);
                if (itemSyns) {
                    meaningItem.append(itemSyns);
                }
                itemMeanings.append(meaningItem);
            });
            resultsItem.append(itemMeanings);
            resultsList.append(resultsItem);
        });
    } else {
        document.getElementById("placeholder").textContent = info.title;
        document.getElementById("placeholder").classList.add("error");
    }
}

document.getElementById("word-lookup").addEventListener("submit", (event) => {
    event.preventDefault();
    const word = document.getElementById("search-word").value;
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => response.json())
    .then(info => {
        displayDetails(info);
    })
    .catch(error => {
        document.getElementById("placeholder").textContent = error.message;
        document.getElementById("placeholder").classList.add("error");
    });
});