document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const startBtn = document.getElementById('start-btn');
    const categoryScreen = document.getElementById('category-screen');
    const questionsScreen = document.getElementById('questions-screen');
    const resultsScreen = document.getElementById('results-screen');
    const questionContainer = document.getElementById('question-container');
    const userAnswer = document.getElementById('user-answer');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const progressBar = document.querySelector('.progress-bar');
    const recommendationsContainer = document.getElementById('recommendations-container');
    
    // Переменные состояния
    let currentCategory = null;
    let currentQuestionIndex = 0;
    let userResponses = [];
    
    // База данных вопросов и рекомендаций
    const questionsData = {
        books: {
            questions: [
                "Какой жанр книг вы предпочитаете? (Например: фантастика, детектив, классика)",
                "Какая последняя книга вам понравилась?",
                "Какой атмосферы вы ищете в книге? (Например: легкая, напряженная, вдохновляющая)",
                "Как много времени вы готовы уделять чтению? (Например: быстрое чтение, длинный роман)"
            ],
            recommendations: [
                {
                    title: "1984",
                    author: "Джордж Оруэлл",
                    genre: "Антиутопия",
                    description: "Классика антиутопической литературы, исследующая тоталитаризм и контроль над сознанием.",
                    rating: "4.7/5"
                },
                {
                    title: "Мастер и Маргарита",
                    author: "Михаил Булгаков",
                    genre: "Магический реализм",
                    description: "Философский роман, сочетающий сатиру, фантастику и глубокие размышления о добре и зле.",
                    rating: "4.8/5"
                },
                {
                    title: "Три товарища",
                    author: "Эрих Мария Ремарк",
                    genre: "Классика",
                    description: "Трогательная история дружбы и любви на фоне послевоенной Германии.",
                    rating: "4.6/5"
                }
            ]
        },
        movies: {
            questions: [
                "Какой жанр фильмов вы предпочитаете? (Например: комедия, драма, научная фантастика)",
                "Какой последний фильм вам понравился?",
                "Какой продолжительности фильм вы ищете? (Например: короткометражка, стандартный, эпический)",
                "Какой атмосферы вы ждете от фильма? (Например: легкий, напряженный, вдохновляющий)"
            ],
            recommendations: [
                {
                    title: "Интерстеллар",
                    director: "Кристофер Нолан",
                    genre: "Научная фантастика",
                    description: "Эпическое космическое путешествие, исследующее любовь, время и выживание человечества.",
                    rating: "8.6/10"
                },
                {
                    title: "Побег из Шоушенка",
                    director: "Фрэнк Дарабонт",
                    genre: "Драма",
                    description: "История надежды и дружбы в условиях тюремного заключения.",
                    rating: "9.3/10"
                },
                {
                    title: "Начало",
                    director: "Кристофер Нолан",
                    genre: "Фантастический триллер",
                    description: "Захватывающий фильм о проникновении в сны и манипуляции сознанием.",
                    rating: "8.8/10"
                }
            ]
        },
        courses: {
            questions: [
                "Какую область знаний вас интересует? (Например: программирование, дизайн, маркетинг)",
                "Какой уровень сложности вы ищете? (Например: начальный, средний, продвинутый)",
                "Какой формат обучения предпочитаете? (Например: видео, текстовый, интерактивный)",
                "Сколько времени вы готовы уделять обучению в неделю?"
            ],
            recommendations: [
                {
                    title: "Основы Python",
                    platform: "Coursera",
                    duration: "4 недели",
                    description: "Идеальный курс для начинающих изучать программирование на Python.",
                    rating: "4.8/5"
                },
                {
                    title: "Веб-дизайн для начинающих",
                    platform: "Udemy",
                    duration: "6 недель",
                    description: "Полное руководство по созданию современных веб-сайтов с нуля.",
                    rating: "4.7/5"
                },
                {
                    title: "Искусство переговоров",
                    platform: "Stepik",
                    duration: "3 недели",
                    description: "Научитесь эффективно вести переговоры в бизнесе и жизни.",
                    rating: "4.9/5"
                }
            ]
        }
    };
    
    // Обработчики событий
    startBtn.addEventListener('click', showCategoryScreen);
    
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentCategory = this.getAttribute('data-category');
            startQuestionnaire();
        });
    });
    
    nextBtn.addEventListener('click', processAnswer);
    restartBtn.addEventListener('click', restartQuestionnaire);
    userAnswer.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processAnswer();
        }
    });
    
    // Функции
    function showCategoryScreen() {
        document.querySelector('.screen.active').classList.remove('active');
        categoryScreen.classList.add('active');
    }
    
    function startQuestionnaire() {
        categoryScreen.classList.remove('active');
        questionsScreen.classList.add('active');
        currentQuestionIndex = 0;
        userResponses = [];
        showQuestion();
    }
    
    function showQuestion() {
        const questions = questionsData[currentCategory].questions;
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        
        progressBar.style.width = `${progress}%`;
        
        questionContainer.innerHTML = `
            <div class="question">${questions[currentQuestionIndex]}</div>
        `;
        
        userAnswer.value = '';
        userAnswer.focus();
    }
    
    function processAnswer() {
        const answer = userAnswer.value.trim();
        
        if (!answer) {
            alert('Пожалуйста, введите ответ');
            return;
        }
        
        userResponses.push(answer);
        currentQuestionIndex++;
        
        const questions = questionsData[currentCategory].questions;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }
    
    function showResults() {
        questionsScreen.classList.remove('active');
        resultsScreen.classList.add('active');
        
        // Генерация рекомендаций на основе ответов
        generateRecommendations();
    }
    
    function generateRecommendations() {
        const recommendations = questionsData[currentCategory].recommendations;
        
        recommendationsContainer.innerHTML = '';
        
        recommendations.forEach(item => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            
            let cardContent = `<h3>${item.title}</h3>`;
            
            if (item.author) cardContent += `<p><strong>Автор:</strong> ${item.author}</p>`;
            if (item.director) cardContent += `<p><strong>Режиссер:</strong> ${item.director}</p>`;
            if (item.platform) cardContent += `<p><strong>Платформа:</strong> ${item.platform}</p>`;
            
            cardContent += `
                <p><strong>Жанр:</strong> ${item.genre}</p>
                <p>${item.description}</p>
                <p class="rating"><strong>Рейтинг:</strong> ${item.rating}</p>
            `;
            
            card.innerHTML = cardContent;
            recommendationsContainer.appendChild(card);
        });
    }
    
    function restartQuestionnaire() {
        resultsScreen.classList.remove('active');
        document.getElementById('welcome-screen').classList.add('active');
    }
});