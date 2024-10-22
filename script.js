// Firebase 설정
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyC-kOmuFcDfaOrsjrrFvTBUEDniEXoUP40",
    authDomain: "pras-83751.firebaseapp.com",
    projectId: "pras-83751",
    storageBucket: "pras-83751.appspot.com",
    messagingSenderId: "699303791904",
    appId: "1:699303791904:web:455bcfab27c8088a8f9b45",
    measurementId: "G-V5BZVFZYNH"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 질문 불러오기
async function loadQuestions() {
    const querySnapshot = await getDocs(collection(db, "questions"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        displayQuestion(data.text, doc.id, data.answers);
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

    answerInput.addEventListener('keypress', async function(event) {
        if (event.key === 'Enter' && answerInput.value) {
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answer');
            answerDiv.textContent = answerInput.value;
            questionDiv.appendChild(answerDiv);
            
            // Firestore에 답변 저장
            await updateDoc(doc(db, "questions", questionId), {
                answers: arrayUnion(answerInput.value)
            });

            Swal.fire({
                icon: 'success',
                title: '답변이 등록되었습니다!',
                text: '답변이 성공적으로 추가되었습니다.',
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
document.getElementById('questionForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const questionInput = document.getElementById('questionInput');
    const questionText = questionInput.value;

    if (questionText) {
        const docRef = await addDoc(collection(db, "questions"), {
            text: questionText,
            answers: []
        });
        displayQuestion(questionText, docRef.id, []);
        questionInput.value = ''; // 입력 필드 초기화
    }
});

// 페이지 로드 시 질문 불러오기
window.onload = function() {
    loadQuestions();
};
