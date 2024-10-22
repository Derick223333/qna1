// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyCMvXjShy3qvhI1YDYUFoeqllAAUuVgtWE",
    authDomain: "qna12-dfe1c.firebaseapp.com",
    projectId: "qna12-dfe1c",
    storageBucket: "qna12-dfe1c.appspot.com",
    messagingSenderId: "123361561242",
    appId: "1:123361561242:web:31f6359517aeedae4aed23"
};

// Firebase 초기화
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 질문 불러오기
function loadQuestions() {
    db.collection("questions").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            displayQuestion(data.text, doc.id, data.answers);
        });
    });
}

// 질문 표시 함수
function displayQuestion(questionText, questionId, answers) {
    const questionsList = document.getElementById('questionsList');
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question', 'border', 'rounded', 'p-3');
    questionDiv.textContent = questionText;

    // 답변 추가 버튼
    const answerButton = document.createElement('button');
    answerButton.textContent = '답변하기';
    answerButton.classList.add('btn', 'btn-secondary', 'ml-2');
    questionDiv.appendChild(answerButton);

    // 답변 입력 필드
    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.placeholder = '답변을 입력하세요';
    answerInput.classList.add('form-control', 'mt-2');
    answerInput.style.display = 'none'; // 처음에는 숨김
    questionDiv.appendChild(answerInput);

    // 답변 추가 기능
    answerButton.addEventListener('click', function() {
        answerInput.style.display = answerInput.style.display === 'none' ? 'block' : 'none';
        answerButton.textContent = answerButton.textContent === '답변하기' ? '답변 취소' : '답변하기';
    });

    answerInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && answerInput.value) {
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answer');
            answerDiv.textContent = answerInput.value;
            questionDiv.appendChild(answerDiv);
            
            // Firestore에 답변 저장
            db.collection("questions").doc(questionId).update({
                answers: firebase.firestore.FieldValue.arrayUnion(answerInput.value)
            }).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '답변이 등록되었습니다!',
                    text: '답변이 성공적으로 추가되었습니다.',
                });
            });

            answerInput.value = '';
            answerInput.style.display = 'none';
            answerButton.textContent = '답변하기';
        }
    });

    // 기존 답변 표시
    if (answers) {
        answers.forEach(answer => {
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answer');
            answerDiv.textContent = answer;
            questionDiv.appendChild(answerDiv);
        });
    }

    questionsList.appendChild(questionDiv);
}

// 질문 등록 및 Firestore에 저장
document.getElementById('questionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const questionInput = document.getElementById('questionInput');
    const questionText = questionInput.value;

    if (questionText) {
        db.collection("questions").add({
            text: questionText,
            answers: []
        }).then((docRef) => {
            displayQuestion(questionText, docRef.id, []);
            questionInput.value = '';
        });
    }
});

// 페이지 로드 시 질문 불러오기
loadQuestions();
