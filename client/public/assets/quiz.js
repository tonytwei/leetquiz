async function loadQuestion(questionID, questionPart) {
    try {
        const response = await fetch(`/assets/questions/${questionID}.json`);
        const data = await response.json();
        displayDescription(data);
        displayQuestion(data, questionPart);
    } catch (error) {
        console.error(error);
    }
}

function displayDescription(questionData) {
    document.querySelector(".question-header > h1").textContent = questionData.title;
    document.querySelector(".question-header > h2").textContent = questionData.difficulty;
    document.querySelector(".question-description > p").textContent = questionData.description;

    // display examples
    let questionExamplesContainer = document.querySelector(".question-examples-container");
    questionExamplesContainer.innerHTML = "";
    let examplesCount = 1;
    questionData.examples.forEach(element => {
        let example = document.createElement("div");
        example.classList.add("question-example");
        example.appendChild(document.createElement("h3")).textContent = `Example ${examplesCount}:`;
        examplesCount += 1;
        example.appendChild(document.createElement("p")).textContent = `Input: ${element.input}`;
        example.appendChild(document.createElement("p")).textContent = `Output: ${element.output}`;
        questionExamplesContainer.appendChild(example);
    });

    // display constraints
    let questionConstraintsList = document.querySelector(".question-constraints > ul");
    questionConstraintsList.innerHTML = "";
    questionData.constraints.forEach(element => {
        let para = document.createElement("p");
        para.classList.add("code");
        para.textContent = element;

        let constraint = document.createElement("li");
        constraint.appendChild(para);
        questionConstraintsList.appendChild(constraint);
    });
}

function displayQuestion(questionData, questionPart) {
    questionPartAnswer = questionData.questions[questionPart].answer;
    document.querySelector(".question-answer > p").textContent = questionData.questions[questionPart].questionText;
    
    radioContainer = document.querySelector(".radio-container");
    radioContainer.innerHTML = "";
    questionData.questions[questionPart].options.forEach((item, index) => {
        let radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "answer";
        radioButton.value = index;
        radioButton.id = `answer-${index}`;

        let label = document.createElement("label");
        label.htmlFor = `answer-${index}`;
        label.textContent = item;

        let radioOption = document.createElement("div");
        radioOption.classList.add("radio-option");
        radioOption.appendChild(radioButton);
        radioOption.appendChild(label);

        radioContainer.appendChild(radioOption);
    });
}

function checkAnswer() {
    let input = document.querySelector('input[name="answer"]:checked');
    let radioContainer = input.parentElement;

    if (questionPartAnswer != input.value) {
        radioContainer.classList.add("wrong-answer");
        return;
    }
    radioContainer.classList.add("correct-answer");

    questionPart += 1;
    if (questionPart == questionPartsCount) {
        renderNextQuestionButton();
    } else {
        renderNextPartButton();
    }
}

function renderNextQuestionButton() {
    let nextQuestionButton = document.getElementById("next-question");
    nextQuestionButton.style.display = "block";
    let nextButtonPart = document.getElementById("next-question-part");
    nextButtonPart.style.display = "none";
}

function renderNextPartButton() {
    let nextButtonPart = document.getElementById("next-question-part");
    nextButtonPart.style.visibility = "visible";
}


function getSettings() {
    const difficultySettings = document.querySelectorAll('.checkbox-container.original > input[name="difficulty"]:checked');
    let selectedDifficulties = Array.from(difficultySettings).map(checkbox => checkbox.value);
    if (selectedDifficulties.length == 0) {
        selectedDifficulties = ['Easy', 'Medium', 'Hard'];
    }

    const selectedSet = document.querySelector(".set.original").value;
    
    const topicSettings = document.querySelectorAll('.checkbox-container.original > input[name="topics"]:checked');
    let selectedTopics = Array.from(topicSettings).map(checkbox => checkbox.value);
    if (selectedTopics.length == 0) {
        selectedTopics = ['Arrays', 'Two-Pointers', 'Sliding-Window', 'Stack', 'Binary-Search', 'Linked-List', 'Trees', 'Heap', 'Backtracking', 'Graphs', 'DP', 'Greedy'];
    }

    return {
        difficulty: selectedDifficulties,
        set: selectedSet,
        topics: selectedTopics
    };
}

function updateSet() {
    const settings = getSettings();
    if (['all', 'custom'].includes(settings.set)) {
        if ((settings.topics.length == 0) || (settings.topics.length == numTopics)) {
            document.querySelectorAll('.set').forEach(set => {
                set.value = 'all';
            });
        } else {
            document.querySelectorAll('.set').forEach(set => {
                set.value = 'custom';
            });
        }
    }
}

function clearFilters() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('.set').forEach(set => {
        set.value = 'all';
    });
}


function nextQuestionPart() {
    let nextButton = document.getElementById("next-question-part");
    nextButton.style.visibility = "hidden";
    loadQuestion(questionID, questionPart);
}

function linkSettings() {
    const originalCheckboxes = document.querySelectorAll('.checkbox-container.original input[type="checkbox"]');
    const copyCheckboxes = document.querySelectorAll('.checkbox-container.copy input[type="checkbox"]');
    copyCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener("change", () => {
            originalCheckboxes[index].checked = !originalCheckboxes[index].checked;
        });
        checkbox.addEventListener("change", updateSet);
    });
    originalCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener("change", () => {
            copyCheckboxes[index].checked = !copyCheckboxes[index].checked;
        });
        checkbox.addEventListener("change", updateSet);
    });

    const originalSet = document.querySelector(".set.original");
    const copySet = document.querySelector(".set.copy");
    originalSet.addEventListener('change', () => {
        copySet.value = originalSet.value;
    });
    copySet.addEventListener('change', () => {
        originalSet.value = copySet.value;
    });

    document.querySelectorAll(".clear-filters").forEach((button) => {
        button.addEventListener('click', clearFilters);
    });
    document.querySelectorAll("set").forEach((set) => {
        set.addEventListener('change', updateSet);
    });
}

// storing completed question using cookies
function setQuestionCompleted(questionID) {
    let json = localStorage.getItem('completedQuestionIDs');
    let completedQuestionIDs = {};
    if (json) {
        completedQuestionIDs = JSON.parse(json);
    }
    completedQuestionIDs[questionID] = true;
    localStorage.setItem('completedQuestionIDs', JSON.stringify(completedQuestionIDs));
}

function toggleQuestionCompleted(questionID, completedBool) {
    let json = localStorage.getItem('completedQuestionIDs');
    let completedQuestionIDs = {};
    if (json) {
        completedQuestionIDs = JSON.parse(json);
    }
    completedQuestionIDs[questionID] = completedBool;
    localStorage.setItem('completedQuestionIDs', JSON.stringify(completedQuestionIDs));
}

async function questionsOverlay() {
    // grab cookie for completed questions
    let json = localStorage.getItem('completedQuestionIDs');
    let completedQuestionIDs = {};
    if (json) {
        completedQuestionIDs = JSON.parse(json);
    }

    // grab question settings
    const questionData = getSettings();
    
    // query database for questions
    const difficulty = questionData.difficulty.join(',');
    const topics = questionData.topics.join(',');
    const set = questionData.set;
    const url = `/quiz/get-questions?difficulty=${difficulty}&topics=${topics}&set=${set}`;
    await fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const tbody = document.querySelector("tbody");
            tbody.textContent = "";
            data.forEach((question) => {
                const tdCompleted = document.createElement("td");
                const completedCheckbox = document.createElement("input");
                completedCheckbox.type = "checkbox";
                completedCheckbox.name = "completed";
                completedCheckbox.value = question.id;
                completedCheckbox.checked = completedQuestionIDs[question.id];
                tdCompleted.appendChild(completedCheckbox);

                const tdTitle = document.createElement("td");
                tdTitle.textContent = question.title;

                const tdDifficulty = document.createElement("td");
                tdDifficulty.textContent = question.difficulty;

                
                const tr = document.createElement("tr");
                tr.appendChild(tdCompleted);
                tr.appendChild(tdTitle);
                tr.appendChild(tdDifficulty);
                
                tbody.appendChild(tr);
            });
        })
        .catch((err) => console.log(err));
    
    // allow toggeling of completeness
    document.querySelectorAll('input[name="completed"]').forEach(input => {
        input.addEventListener("click", () => {
            toggleQuestionCompleted(input.value, input.checked);
        });
    });

    // display overlay
    const overlay = document.querySelector(".overlay");
    overlay.style.display = "flex";
    const overlayQuestions = document.querySelector(".questions-list");
    overlayQuestions.style.display = "flex";
}

function showSettingsOverlay() {
    const overlay = document.querySelector(".overlay");
    overlay.style.display = "flex";

    const overlaySettings = document.querySelector(".overlay-settings");
    overlaySettings.style.display = "flex";
}

function closeOverlay() {
    const overlay = document.querySelector(".overlay");
    overlay.style.display = "none";

    const overlayQuestions = document.querySelector(".questions-list");
    overlayQuestions.style.display = "none";

    const overlaySettings = document.querySelector(".overlay-settings");
    overlaySettings.style.display = "none";
}

const numTopics = 12;
console.log(questionID);
let questionPart = 0;
console.log(questionPartsCount);
console.log(questionPartAnswer);
console.log("end of boiler plate variables");

document.addEventListener("DOMContentLoaded", () => {
    linkSettings();
    document.getElementById("submit-answer").addEventListener("click", checkAnswer);
    document.getElementById("next-question-part").addEventListener("click", nextQuestionPart);
    document.getElementById("next-question").addEventListener("click", () => {
        setQuestionCompleted(questionID);
        questionsOverlay();
    });
    
    document.getElementById("show-questions").addEventListener("click", questionsOverlay);
    document.getElementById("show-settings").addEventListener("click", showSettingsOverlay);
    document.getElementById("overlay-close").addEventListener("click", closeOverlay);
});