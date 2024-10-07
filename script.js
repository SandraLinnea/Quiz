import { quizData } from './questions.js';

document.addEventListener('DOMContentLoaded', () => {
    let currentQuestionIndex = 0;
    let selectedSubject = "";

    // Funktionen för att starta quizet
    document.getElementById('startQuiz').addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('input[name="subject"]');
        selectedSubject = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        if (selectedSubject.length > 0) {
            document.querySelector('.subject').style.display = 'none';
            document.getElementById('quizContainer').style.display = 'block';
            showQuestion();
        } else {
            alert('Vänligen välj minst ett ämne.');
        }
    });

    // Funktionen för att visa frågor
    function showQuestion() {
        const questionData = quizData[selectedSubject[0]][currentQuestionIndex]; // Hämta den aktuella frågan
        document.getElementById('question').innerText = questionData.question;

        const answersContainer = document.getElementById('answers');
        answersContainer.innerHTML = ''; // Rensa tidigare svar

        questionData.answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.innerHTML = `
                <input type="radio" name="answer" value="${index}" id="answer${index}">
                <label for="answer${index}">${answer}</label>
            `;
            answersContainer.appendChild(answerElement);
        });

        // Döljer "Next Question"-knappen tills en svarsalternativ är valt
        document.getElementById('nextQuestion').classList.add('hidden');

        // Lägg till en event listener på radioknapparna
        const radios = document.getElementsByName('answer');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                document.getElementById('nextQuestion').classList.remove('hidden');
            });
        });
    }

    // Nästa fråga
    document.getElementById('nextQuestion').addEventListener('click', function() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) return; // Gör inget om inget svar har valts

        const answerIndex = parseInt(selectedAnswer.value);
        const questionData = quizData[selectedSubject[0]][currentQuestionIndex];

        if (answerIndex === questionData.correct) {
            alert("Rätt svar!");
        } else {
            alert("Fel svar. Rätt svar är: " + questionData.answers[questionData.correct]);
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < quizData[selectedSubject[0]].length) {
            showQuestion();
        } else {
            alert('Quizet är slut!');
            // Återställ quizet eller visa resultat
            currentQuestionIndex = 0; // Återställ för nästa quiz
            document.getElementById('quizContainer').style.display = 'none';
            document.querySelector('.subject').style.display = 'block';
        }
    });
});
