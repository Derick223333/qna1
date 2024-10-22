document.getElementById('questionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const questionInput = document.getElementById('questionInput');
    const questionText = questionInput.value;

    if (questionText) {
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
                
                // SweetAlert2 알림
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

        questionsList.appendChild(questionDiv);
        questionInput.value = '';
    }
});
