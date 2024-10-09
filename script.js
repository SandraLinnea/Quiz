import { quizData } from './questions.js';

document.addEventListener('DOMContentLoaded', function() { 
    document.getElementById('startQuiz').addEventListener('click', EventHandlers.startQuiz);
    document.getElementById('nextQuestion').addEventListener('click', EventHandlers.nextQuestion);
    document.querySelectorAll('.subject-option').forEach(option => {
        option.addEventListener('click', selectSubject); // se till att selectSubject är definierad
    });
});

// Definiera funktionen selectSubject här
function selectSubject(event) {
    const options = document.querySelectorAll('.subject-option');
    options.forEach(option => option.classList.remove('selected')); // Ta bort 'selected' från alla alternativ
    event.currentTarget.classList.add('selected'); // Lägg till 'selected' på det aktuella alternativet
}

let questionIndex = 0;
let selectedSubject = "";

let EventHandlers = (function() {
    function startQuiz() {
        const selectedSubjectElement = document.querySelector('.subject-option.selected');

        if (selectedSubjectElement) {
            selectedSubject = selectedSubjectElement.getAttribute('data-value'); // Hämta värdet från data-attributet

            // Döljer ämnesval och texten när quizet startar
            document.getElementById('subjectSelection').style.display = 'none';
                
            // Visa quiz-delen
            document.getElementById('quizContainer').style.display = 'block';
            showQuestion();
        } else {
            alert("You have to select a subject to start the quiz!");
        }
    }

    function showQuestion() {
        const questionBox = quizData[selectedSubject]; // Använd rätt index för quizData
        if (questionIndex < questionBox.length) { // Kontrollera om det finns fler frågor
            const currentQuestion = questionBox[questionIndex];
            document.getElementById('question').innerText = currentQuestion.question;

            const answersContainer = document.querySelector('.parent'); 
            answersContainer.innerHTML = '';  // Rensa tidigare svar

            currentQuestion.answers.forEach((answer, index) => {
                const answerDiv = document.createElement('div');
                answerDiv.innerText = answer;
                answerDiv.classList.add(`div${index + 1}`); 
                answerDiv.addEventListener('click', () => checkAnswer(index, answerDiv)); // Lägg till click-handler
                answersContainer.appendChild(answerDiv);
            });

            document.getElementById('nextQuestion').style.display = 'none'; // Göm knappen tills användaren svarat
        }
    }

    function checkAnswer(selectedIndex, selectedDiv) {
        const questionBox = quizData[selectedSubject];
        const correctAnswerIndex = questionBox[questionIndex].correct;

        // Kontrollera om användarens svar är rätt
        if (selectedIndex === correctAnswerIndex) {
            selectedDiv.style.border = "2px solid green"; // Grön ram för rätt svar
            selectedDiv.style.borderRadius = "50%"; // Gör den rund
        } else {
            selectedDiv.style.border = "2px solid red"; // Röd ram för fel svar
            selectedDiv.style.borderRadius = "50%"; // Gör den rund
        }

        // Visa den rätta svaret också med grön ram om det inte var det som valdes
        const answersContainer = document.querySelector('.parent');
        const correctAnswerDiv = answersContainer.children[correctAnswerIndex];
        correctAnswerDiv.style.border = "2px solid green"; // Grön ram för rätt svar
        correctAnswerDiv.style.borderRadius = "50%"; // Gör den rund

        // Visa knappen för nästa fråga efter att användaren har svarat
        document.getElementById('nextQuestion').style.display = 'block';

        // Inaktivera klick på alla svar efter att ett val gjorts
        Array.from(answersContainer.children).forEach(child => {
            child.style.pointerEvents = 'none'; // Inaktivera klick efter första valet
        });
    }

    function nextQuestion() {
        questionIndex++;
        // Om vi fortfarande har frågor kvar, visa nästa fråga
        const questionBox = quizData[selectedSubject];
        if (questionIndex < questionBox.length) {
            showQuestion();  // Ladda nästa fråga
        } else {
            alert('Quiz is over!'); // Informera att quizet är slut
            questionIndex = 0;  // Återställ frågeindexet
            document.getElementById('quizContainer').style.display = 'none'; // Dölj quiz-sektionen
        }
    }

    return {
        startQuiz,
        nextQuestion
    }
})();

