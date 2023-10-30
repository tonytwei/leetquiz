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
    nextQuestionButton.classList.remove("hidden");
}

function renderNextPartButton() {
    let nextButton = document.getElementById("next-question-part");
    nextButton.classList.remove("hidden");
}


function grabSettings() {
    const difficultySettings = document.querySelectorAll('.checkbox-container.original > input[name="difficulty"]:checked');
    const selectedDifficulties = Array.from(difficultySettings).map(checkbox => checkbox.value);

    const selectedSet = document.querySelector(".set.original").value;
    
    const topicSettings = document.querySelectorAll('.checkbox-container.original > input[name="topics"]:checked');
    let selectedTopics = Array.from(topicSettings).map(checkbox => checkbox.value);
    if (selectedTopics.length == 0) {
        selectedTopics = ['arrays', 'two-pointers', 'sliding-window', 'stack', 'binary-search', 'linked-list', 'trees', 'heap-priority-queue', 'backtracking', 'graphs', 'dynamic-programming', 'greedy'];
    }

    return {
        difficulty: selectedDifficulties,
        set: selectedSet,
        topics: selectedTopics
    };
}

function updateSettings() {
    const settings = grabSettings();
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

    console.log('Difficulty:', settings.difficulty);
    console.log('Topics:', settings.topics);
    console.log('Set:', settings.set);
    console.log(settings.topics.length);
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
    nextButton.classList.add("hidden");
    loadQuestion(questionID, questionPart);
}

function linkSettings() {
    const originalCheckboxes = document.querySelectorAll('.checkbox-container.original input[type="checkbox"]');
    const copyCheckboxes = document.querySelectorAll('.checkbox-container.copy input[type="checkbox"]');
    copyCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener("change", () => {
            originalCheckboxes[index].checked = !originalCheckboxes[index].checked;
        });
        checkbox.addEventListener("change", updateSettings);
    });
    originalCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener("change", () => {
            copyCheckboxes[index].checked = !copyCheckboxes[index].checked;
        });
        checkbox.addEventListener("change", updateSettings);
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
        set.addEventListener('change', updateSettings);
    });
}

const numTopics = 12;

console.log(questionID);
let questionPart = 0;
console.log(questionPartsCount);
console.log(questionPartAnswer);

document.addEventListener("DOMContentLoaded", () => {
    linkSettings();
    document.getElementById("submit-answer").addEventListener("click", checkAnswer);
    document.getElementById("next-question-part").addEventListener("click", nextQuestionPart);
});
