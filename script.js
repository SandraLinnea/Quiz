import { quizData } from './questions.js';

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startQuiz').addEventListener('click', EventHandlers.startQuiz);
    document.getElementById('nextQuestion').addEventListener('click', EventHandlers.nextQuestion);
    document.getElementById('restartQuiz').addEventListener('click', restartQuiz);
    document.querySelectorAll('.subject-option').forEach(option => {
        option.addEventListener('click', selectSubject);
    });
});

function selectSubject(event) {
    const options = document.querySelectorAll('.subject-option');
    options.forEach(option => option.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

let questionIndex = 0;
let selectedSubject = "";
let score = 0;
let randomQuestions = [];
let startTime;

let EventHandlers = (function() {
    function getRandomQuestions(questionBox, numQuestions) {
        const shuffled = questionBox.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numQuestions);
    }

    async function fetchGeographyQuestions() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=5&category=22&difficulty=easy&type=multiple');
            const data = await response.json();
            return data.results.map(item => ({
                question: item.question,
                answers: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
                correct: item.incorrect_answers.length
            }));
        } catch (error) {
            console.error('Error fetching geography questions:', error);
            return [];
        }
    }

    async function startQuiz() {
        const selectedSubjectElement = document.querySelector('.subject-option.selected');
        if (selectedSubjectElement) {
            selectedSubject = selectedSubjectElement.getAttribute('data-value');

            if (selectedSubject === "Sweden") {
                const questionBox = quizData[selectedSubject];
                randomQuestions = getRandomQuestions(questionBox, 5);
            } else if (selectedSubject === "Geografi") {
                randomQuestions = await fetchGeographyQuestions();
            } else if (selectedSubject === "Animal health care") {
                const questionBox = quizData[selectedSubject];
                randomQuestions = getRandomQuestions(questionBox, 5);
            } else {
                alert("Valt ämne stöds inte.");
                return;
            }

            startTime = Date.now(); 
            questionIndex = 0;
            score = 0;
            showQuestion(randomQuestions);
            document.getElementById('subjectSelection').style.display = 'none';
            document.getElementById('quizContainer').style.display = 'block';
        } else {
            alert("Du måste välja ett ämne för att starta quizet!");
        }
    }

    function showQuestion(randomQuestions) {
        if (questionIndex < randomQuestions.length) {
            const currentQuestion = randomQuestions[questionIndex];
            document.getElementById('question').innerText = currentQuestion.question;

            const answersContainer = document.querySelector('.parent');
            answersContainer.innerHTML = '';

            currentQuestion.answers.forEach((answer, index) => {
                const answerDiv = document.createElement('div');
                answerDiv.innerText = answer;
                answerDiv.classList.add(`div${index + 1}`);
                answerDiv.addEventListener('click', () => checkAnswer(index, answerDiv, randomQuestions));
                answersContainer.appendChild(answerDiv);
            });

            document.getElementById('nextQuestion').style.display = 'none';
        }
    }

    function checkAnswer(selectedIndex, selectedDiv, randomQuestions) {
        const correctAnswerIndex = randomQuestions[questionIndex].correct;

        if (selectedIndex === correctAnswerIndex) {
            selectedDiv.style.border = "2px solid green";
            selectedDiv.style.borderRadius = "50%";
            score++;
        } else {
            selectedDiv.style.border = "20px solid red";
            selectedDiv.style.borderRadius = "50%";
        }

        const answersContainer = document.querySelector('.parent');
        const correctAnswerDiv = answersContainer.children[correctAnswerIndex];
        correctAnswerDiv.style.border = "20px solid green";
        correctAnswerDiv.style.borderRadius = "50%";

        document.getElementById('nextQuestion').style.display = 'block';
        Array.from(answersContainer.children).forEach(child => {
            child.style.pointerEvents = 'none';
        });
    }

    function nextQuestion() {
        questionIndex++;
        if (questionIndex < randomQuestions.length) {
            showQuestion(randomQuestions);
        } else {
            showResult();
        }
    }

    function showResult() {
        document.getElementById('quizContainer').style.display = 'none';
        document.querySelector('.result').classList.remove('hidden');
        const totalQuestions = randomQuestions.length; 

        const endTime = Date.now();
        const totalTime = endTime - startTime;

        const seconds = Math.floor(totalTime / 1000);

        document.getElementById('scoreText').innerText = `Du hade ${score} av ${totalQuestions} rätt! Du tog ${seconds} sekunder.`;

        saveScore(seconds);
    }

    function saveScore(seconds) {
        const bestScore = localStorage.getItem('bestScore');
        const bestTime = localStorage.getItem('bestTime');
        if (!bestScore || score > bestScore || (score === bestScore && seconds < bestTime)) {
            localStorage.setItem('bestScore', score);
            localStorage.setItem('bestTime', seconds);
        }
    }

    return {
        startQuiz,
        nextQuestion
    }
})();

function restartQuiz() {
    questionIndex = 0;
    score = 0;
    randomQuestions = [];
    document.querySelector('.result').classList.add('hidden');
    document.getElementById('subjectSelection').style.display = 'block';
}

