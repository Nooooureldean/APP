
let form = document.querySelector('.start-quiz');
let categoryMenu = document.getElementById('categoryMenu');
let difficultyOptions = document.getElementById('difficultyOptions');
let questionsNumber = document.getElementById('questionsNumber');
let startQuiz = document.getElementById('startQuiz');
let mYRow = document.querySelector('.questions .container .row');
let myQuiz;
let result;

startQuiz.addEventListener('click', async function() {
    let category = categoryMenu.value;
    let difficulty = difficultyOptions.value;
    let number = questionsNumber.value;
    myQuiz = new Quiz(category, difficulty, number);

    result = await myQuiz.getAllQuestions();
    console.log(result);
    let myQs = new Question(0);
    myQs.display();
    form.classList.replace('d-flex', 'd-none');
});

class Quiz {
    constructor(category, difficulty, number) {
        this.category = category;
        this.difficulty = difficulty;
        this.number = number;
        this.score = 0;
    }
    getApi() {
        return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`;
    }
    async getAllQuestions() {
        let res = await fetch(this.getApi());
        let data = await res.json();
        return data.results;
    }
}

class Question {
    constructor(index) {
        this.index = index;
        this.category = result[index].category;
        this.question = result[index].question;
        this.incorrect_answers = result[index].incorrect_answers;
        this.correct_answer = result[index].correct_answer;
        this.is_Answer=false;
    }

    getAllAnswers() {
        let allAnswers = [...this.incorrect_answers, this.correct_answer];
        allAnswers.sort();
        return allAnswers;
    }

    display() {
        const questionMarkUp = `
        <div class="question shadow-lg col-lg-6 offset-lg-3 p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
            <div class="w-100 d-flex justify-content-between">
                <span class="btn btn-category">${this.category}</span>
                <span class="fs-6 btn btn-questions">${this.index + 1} of ${result.length}</span>
            </div>
            <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
            <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
                ${this.getAllAnswers().map((answer) => `<li>${answer}</li>`).join('')}
            </ul>
            <h2 class="text-capitalize text-center score-color h3 fw-bold">
                <i class="bi bi-emoji-laughing"></i> Score: ${myQuiz.score}
            </h2>        
        </div>
        `;

        mYRow.innerHTML = questionMarkUp;

        let allChoices = document.querySelectorAll('.choices li');
        allChoices.forEach((li) => {
            li.addEventListener('click', () => {
                this.checkAnswer(li);
                this.nextQuestion();
            });
        });
    }

    checkAnswer(li) {
        if(!this.is_Answer)
            {
                this.is_Answer=true;
                if (li.innerHTML === this.correct_answer) {
                    li.classList.add('correct' ,'animate__animated', 'animate__shakeY');
                    myQuiz.score++;
                } else {
                    li.classList.add('wrong', 'animate__animated', 'animate__shakeX');
                    this.highlightCorrectAnswer();
                }
            }
        
       
    }

    highlightCorrectAnswer() {
        let allChoices = document.querySelectorAll('.choices li');
        allChoices.forEach((li) => {
            if (li.innerHTML === this.correct_answer) {
                li.classList.add('correct', 'animate__animated', 'animate__shakeY');
            }
        });
    }
    nextQuestion() {
        this.index++;
        if (this.index < result.length) {
            setTimeout(() => {
                let newQ = new Question(this.index);
                newQ.display();
            }, 2000);
        } else {
            // Display final score or any other end of quiz logic here
            mYRow.innerHTML = `
            <div class="nour col-lg-6 offset-lg-3 text-center">
                <h2 class="text-capitalize h4">Quiz Finished!</h2>
                <p>Your final score is: ${myQuiz.score}</p>
                <button class="btn btn-primary" onclick="location.reload()">Restart Quiz</button>
            </div>
            `;
        }
    }
}
