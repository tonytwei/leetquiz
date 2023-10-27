function loadQuestion(questionID, questionNumber) {
    fetch(`../assets/questions/${questionID}.json`)
        .then(response => response.json())
        .then(data => {
            displayDescription(data);
            displayQuestion(data, questionNumber);
        })
        .catch(error => console.error(error))
}

function loadQuestionAPI(questionID, questionNumber) {
    fetch(`https://raw.githubusercontent.com/tonytwei/leetquiz/main/client/public/assets/questions/0242.json`)
        .then(response => response.json())
        .then(data => {
            displayDescription(data);
            displayQuestion(data, questionNumber);
        })
        .catch(error => console.error(error))
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

function displayQuestion(questionData, questionNumber) {
    currentAnswer = questionData.questions[questionNumber].answer;
    document.querySelector(".question-answer > p").textContent = questionData.questions[questionNumber].questionText;
    
    radioContainer = document.querySelector(".radio-container");
    radioContainer.innerHTML = "";
    questionData.questions[questionNumber].options.forEach((item, index) => {
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
        radioOption.setAttribute('for', 'answer-3');
        radioOption.appendChild(radioButton);
        radioOption.appendChild(label);

        radioContainer.appendChild(radioOption);
    });
}

function checkAnswer() {
    let input = document.querySelector('input[name="answer"]:checked');
    let radioContainer = input.parentElement;
    if (currentAnswer != input.value) {
        radioContainer.classList.add("wrong-answer");
    } else {
        // correct condition
        radioContainer.classList.add("correct-answer");
        renderNextButton();
    }
}

function renderNextButton() {
    let nextButton = document.getElementById("next-question");
    nextButton.classList.remove("hidden");
    nextButton.addEventListener("click", () => {
        nextButton.classList.add("hidden");
        questionNumber += 1;
        loadQuestion(questionID, questionNumber);
    });
}

/* 
    questionNumber += 1;
    loadQuestion(questionID, questionNumber);
*/

let questionNumber = 0;
let currentAnswer = 'a';
// let questionID = "0217"
let questionID = "0242"
loadQuestionAPI(questionID, questionNumber);

document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit-answer");
    submitButton.addEventListener("click", checkAnswer);
});
