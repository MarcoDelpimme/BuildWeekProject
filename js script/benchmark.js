const questions = [
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What does CPU stand for?",
    correct_answer: "Central Processing Unit",
    incorrect_answers: ["Central Process Unit", "Computer Personal Unit", "Central Processor Unit"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "In the programming language Java, which of these keywords would you put on a variable to make sure it doesnt get modified?",
    correct_answer: "Final",
    incorrect_answers: ["Static", "Private", "Public"],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question: "The logo for Snapchat is a Bell.",
    correct_answer: "False",
    incorrect_answers: ["True"],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question: "Pointers were not used in the original C programming language; they were added later on in C++.",
    correct_answer: "False",
    incorrect_answers: ["True"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What is the most preferred image format used for logos in the Wikimedia database?",
    correct_answer: ".svg",
    incorrect_answers: [".png", ".jpeg", ".gif"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "In web design, what does CSS stand for?",
    correct_answer: "Cascading Style Sheet",
    incorrect_answers: ["Counter Strike: Source", "Corrective Style Sheet", "Computer Style Sheet"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What is the code name for the mobile operating system Android 7.0?",
    correct_answer: "Nougat",
    incorrect_answers: ["Ice Cream Sandwich", "Jelly Bean", "Marshmallow"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "On Twitter, what is the character limit for a Tweet?",
    correct_answer: "140",
    incorrect_answers: ["120", "160", "100"],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question: "Linux was first created as an alternative to Windows XP.",
    correct_answer: "False",
    incorrect_answers: ["True"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "Which programming language shares its name with an island in Indonesia?",
    correct_answer: "Java",
    incorrect_answers: ["Python", "C", "Jakarta"],
  },
];

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: 10,
  },
  alert: {
    color: "red",
    threshold: 5,
  },
};

const THE_LIMIT = 60; //timer
const TIME_LIMIT = 60; //timer

const container = document.getElementById("container-questions"); //container question
let indexQuestion = 0;
let quizCompleted = false;
let timePassed = 0; //timer
let timeLeft = THE_LIMIT; // Tempo iniziale
let timerInterval = null; //timer
let remainingPathColor = COLOR_CODES.info.color; //timer
let currentSelectedAnswer = null;

function questionStep() {
  const obj = questions[indexQuestion];
  container.innerHTML = "";
  const question = document.createElement("div");
  question.classList.add("divpg2");
  question.innerText = obj.question;
  container.appendChild(question);

  const form = document.createElement("form");
  form.classList.add("formpg2");
  const options = obj.incorrect_answers.concat(obj.correct_answer);
  shuffleQuestion(options);
  const divAll = document.createElement("div");
  divAll.classList.add("divAll");

  options.forEach((option) => {
    const div = document.createElement("div");
    div.classList.add("divInputPg2");
    const button = document.createElement("button");
    button.classList.add("inputpg2");

    button.innerText = option;
    button.addEventListener("click", function () {
      selectAnswer(option, button);
    });

    div.appendChild(button);
    container.appendChild(divAll);
    divAll.appendChild(div);
  });
}

function shuffleQuestion(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function nextQuestion() {
  let selectedAnswer = null;
  indexQuestion++;
  quizCompleted = false;
  if (indexQuestion < questions.length) {
    dataAnswer(selectedAnswer);
    selectedAnswer = null;
    questionStep();
    clearInterval(timerInterval);
    timePassed = 0;
    timeLeft = THE_LIMIT;
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);
    startTimer();
  } else {
    const lastPage = document.getElementById("lastpage");
    container.style.display = "none";
    const timer = document.getElementById("app");
    timer.style.display = "none";
    const buttonNext = document.getElementById("next-question-btn");
    buttonNext.style.display = "none";
    lastPage.innerHTML = `<canvas id="chartId" aria-label="chart" height="350" width="580"></canvas>`;
    clearInterval(timerInterval);
    generatePieChart();
    wrong.length = 0;
    correct.length = 0;
  }
  if (!quizCompleted) {
    dataAnswer(null);
  }
}

const nextQuestionBtn = document.getElementById("next-question-btn");
nextQuestionBtn.addEventListener("click", function () {
  dataAnswer(null);
  nextQuestion();
});

const wrong = [];
const correct = [];

function selectAnswer(option, button) {
  if (quizCompleted || timeLeft === 0) {
    return;
  }

  if (currentSelectedAnswer !== null) {
    const prevSelectedButton = Array.from(document.querySelectorAll(".inputpg2")).find(
      (btn) => btn.innerText === currentSelectedAnswer
    );

    if (prevSelectedButton) {
      prevSelectedButton.style.backgroundColor = "";
    }
  }

  button.style.backgroundColor = "#c2128d";
  currentSelectedAnswer = option;
}

function cleanse() {
  const buttons = document.querySelectorAll(".inputpg2");
  buttons.forEach((button) => {
    button.style.backgroundColor = "";
  });
}

function dataAnswer() {
  console.log("selected question", currentSelectedAnswer);
  const currentQuestion = questions[indexQuestion];

  const answerData = {
    question: currentQuestion.question,
    selectedQuestion: currentSelectedAnswer,
    correct_answer: currentQuestion.correct_answer,
  };
  console.log("answer data", answerData);

  if (currentSelectedAnswer === currentQuestion.correct_answer) {
    correct.push(answerData);
  } else if (currentSelectedAnswer !== null) {
    wrong.push(answerData);
  }
  console.log("correct", correct);
  console.log("wrong", wrong);
}

function onTimesUp() {
  clearInterval(timerInterval);
  quizCompleted = true;
  nextQuestion();
  dataAnswer(null);
}

function generatePieChart() {
  const totalQuestions = questions.length;
  const answeredQuestions = correct.length + wrong.length;
  const unansweredQuestions = totalQuestions - answeredQuestions;

  const correctPercentage = (correct.length / totalQuestions) * 100;
  const wrongPercentage = (wrong.length / totalQuestions) * 100;

  const realPercentageWrong = (unansweredQuestions / totalQuestions) * 100 + (wrong.length / totalQuestions) * 100;
  if (correctPercentage <= 60) {
    const containerResult = document.getElementById("result-message");
    const p = document.createElement("p");

    p.innerText = "Hai fallito il test";
    p.style.color = "red";

    containerResult.appendChild(p);
  } else {
    const containerResult = document.getElementById("result-message");
    const p = document.createElement("p");

    p.innerText = "Hai superato il test";
    p.style.color = "green";

    containerResult.appendChild(p);
  }
  const percentualecorrette = document.getElementById("percentualecorrette");
  percentualecorrette.innerHTML = "CORRETTE" + " " + correctPercentage + "%";
  percentualecorrette.style.color = "white";
  percentualecorrette.classList.add("correctpercent");

  const percentualescorrette = document.getElementById("percentualescorrette");
  percentualescorrette.innerHTML = "SBAGLIATE" + " " + realPercentageWrong + "%";
  percentualescorrette.style.color = "white";
  percentualescorrette.classList.add("wrongpercent");

  const buttonpage2 = document.getElementById("container-btn2");
  const buttonInput = document.createElement("button");
  buttonInput.innerText = "RATE US";
  buttonInput.value = "a";
  buttonInput.classList.add("btnpage2");
  const anchor = document.createElement("a");
  anchor.href = "../feedback.html";
  anchor.appendChild(buttonInput);
  buttonpage2.appendChild(anchor);

  var chrt = document.getElementById("chartId").getContext("2d");
  var chartId = new Chart(chrt, {
    type: "doughnut",
    data: {
      labels: ["SBAGLIATE", "CORRETTE"],
      datasets: [
        {
          data: [realPercentageWrong, correctPercentage],
          backgroundColor: ["red", "green"],
          hoverOffset: 5,
        },
      ],
    },
    options: {
      responsive: false,
    },
  });
}

document.getElementById("app").innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>
    </div>
    `;

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 15;
const ALERT_THRESHOLD = 5;

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  const pathElement = document.getElementById("base-timer-path-remaining");

  pathElement.classList.remove(alert.color, warning.color, info.color);

  if (timeLeft <= alert.threshold) {
    pathElement.classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    pathElement.classList.add(warning.color);
  } else {
    pathElement.classList.add(info.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / THE_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
  document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = THE_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

startTimer();
questionStep();
setRemainingPathColor(timeLeft);
setCircleDasharray();
