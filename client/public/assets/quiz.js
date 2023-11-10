async function loadQuestion(questionID) {
    const url = `/quiz/get-question?id=${questionID}`;
    await fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            questionPartsCount = data.questions.length;
            questionPartAnswer = data.questions[questionPart].answer;
            questionData = data;
            displayDescription();
            displayQuestionPart(0);
            })
        .catch((err) => console.log(err));
}

function displayDescription() {
    const difficulty_color_map = {
        "Easy": "var(--quiz-easy)",
        "Medium": "var(--quiz-medium)",
        "Hard": "var(--quiz-hard)"
    }

    document.querySelector(".question-header > h1").textContent = questionData.title;
    document.querySelector(".question-header > h2").textContent = questionData.difficulty;
    document.querySelector(".question-header > h2").style.color = difficulty_color_map[questionData.difficulty];
    document.querySelector(".question-description > p").textContent = questionData.description;

    // display examples
    let questionExamplesContainer = document.querySelector(".question-examples-container");
    questionExamplesContainer.innerHTML = "";
    let examplesCount = 1;
    questionData.examples.forEach(element => {
        let example = document.createElement("div");
        example.classList.add("question-example");
        example.appendChild(document.createElement("h3")).textContent = `Example ${examplesCount}:`;
        example.appendChild(document.createElement("p")).textContent = `Input: ${element.input}`;
        example.appendChild(document.createElement("p")).textContent = `Output: ${element.output}`;
        questionExamplesContainer.appendChild(example);
        examplesCount += 1;
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

function displayQuestionPart(questionPart) {
    questionPartAnswer = questionData.questions[questionPart].answer;

    document.querySelector(".question-answer > p").textContent = questionData.questions[questionPart].questionText;
    
    radioContainer = document.querySelector(".radio-container");
    radioContainer.innerHTML = "";
    questionData.questions[questionPart].options.forEach((item, index) => {
        let radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "answer";
        radioButton.id = `answer-${index}`;
        radioButton.value = index;

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
    if (!input || !input.value) {
        return;
    }

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
    
    const topicSettings = document.querySelectorAll('.checkbox-container.original > input[name="topics"]:checked');
    let selectedTopics = Array.from(topicSettings).map(checkbox => checkbox.value);
    if (selectedTopics.length == 0) {
        selectedTopics = ['Arrays', 'Two-Pointers', 'Sliding-Window', 'Stack', 'Binary-Search', 'Linked-List', 'Trees', 'Heap', 'Backtracking', 'Graphs', 'DP', 'Greedy'];
    }

    const selectedSet = document.querySelector(".set.original").value;

    return {
        difficulty: selectedDifficulties,
        topics: selectedTopics,
        set: selectedSet
    };
}

function updateSet() {
    const settings = getSettings();
    if (!['all', 'custom'].includes(settings.set)) {
        return;
    }
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
    displayQuestionPart(questionPart);
}

// links two settings components together
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

// stores completed question data using cookies
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

async function showQuestionsOverlay() {
    let json = localStorage.getItem('completedQuestionIDs');
    let completedQuestionIDs = {};
    if (json) {
        completedQuestionIDs = JSON.parse(json);
    }

    const questionData = getSettings();
    const topics_map = {
        "Arrays": "Arrays",
        "Two-Pointers": "Two Pointers",
        "Sliding-Window": "Sliding Window",
        "Stack": "Stack",
        "Binary-Search": "Binary Search",
        "Linked-List": "Linked List",
        "Trees": "Trees",
        "Heap": "Heap",
        "Backtracking": "Backtracking",
        "Graphs": "Graphs",
        "DP": "DP",
        "Greedy": "Greedy"
    };
    const topics = questionData.topics.map(topic => topics_map[topic]).join(',');
    const difficulty = questionData.difficulty;
    const set = questionData.set;

    const url = `/quiz/filter-questions?difficulty=${difficulty}&topics=${topics}&set=${set}`;
    await fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const difficulty_color_map = {
                "Easy": "var(--quiz-easy)",
                "Medium": "var(--quiz-medium)",
                "Hard": "var(--quiz-hard)"
            }

            const tbody = document.querySelector("tbody");
            tbody.textContent = "";
            data.forEach((question) => {
                const completedCheckbox = document.createElement("input");
                completedCheckbox.type = "checkbox";
                completedCheckbox.name = "completed";
                completedCheckbox.value = question.id;
                completedCheckbox.checked = completedQuestionIDs[question.id];

                const tdCompleted = document.createElement("td");
                tdCompleted.appendChild(completedCheckbox);

                const tdTitle = document.createElement("td");
                tdTitle.textContent = question.title;
                tdTitle.addEventListener("click", () => {
                    questionID = question.id;
                    questionPart = 0;
                    loadQuestion(question.id);
                    resetNextButtons();
                    closeOverlay();
                });

                const tdDifficulty = document.createElement("td");
                tdDifficulty.textContent = question.difficulty;
                tdDifficulty.style.color = difficulty_color_map[question.difficulty];

                const tr = document.createElement("tr");
                if (completedQuestionIDs[question.id]) {
                    tr.classList.add("completed");
                }
                tr.appendChild(tdCompleted);
                tr.appendChild(tdTitle);
                tr.appendChild(tdDifficulty);
                
                tbody.appendChild(tr);
            });
        })
        .catch((err) => console.log(err));
    
    // toggle question completed
    document.querySelectorAll('input[name="completed"]').forEach(input => {
        input.addEventListener("change", (event) => {
            toggleQuestionCompleted(input.value, input.checked);
            const tr = event.target.closest('tr');
            if (event.target.checked) {
                tr.classList.add('completed');
            } else {
                tr.classList.remove('completed');
            }
        });
    });

    // display overlay
    const overlay = document.querySelector(".overlay");
    overlay.style.display = "flex";

    const overlayQuestions = document.querySelector(".questions-list");
    overlayQuestions.style.display = "flex";
}

function resetNextButtons() {
    document.getElementById("next-question").style.display = "none";
    let nextQuestionPart = document.getElementById("next-question-part");
    nextQuestionPart.style.display = "block";
    nextQuestionPart.style.visibility = "hidden";
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
let questionPart = 0;
// questionID
// questionPartsCount
// questionPartAnswer
// questionDataRaw

// question data parsed through ejs (server-side rendering) for default question
questionDataRaw = questionDataRaw.replace(/&#34;/g, '\"');
let questionData = JSON.parse(questionDataRaw);

document.addEventListener("DOMContentLoaded", () => {
    linkSettings();
    document.getElementById("submit-answer").addEventListener("click", checkAnswer);
    document.getElementById("next-question-part").addEventListener("click", nextQuestionPart);
    document.getElementById("next-question").addEventListener("click", () => {
        setQuestionCompleted(questionID);
        showQuestionsOverlay();
    });
    document.getElementById("show-questions").addEventListener("click", showQuestionsOverlay);
    document.getElementById("show-settings").addEventListener("click", showSettingsOverlay);
    document.getElementById("overlay-close").addEventListener("click", closeOverlay);
});