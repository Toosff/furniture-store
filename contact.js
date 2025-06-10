// Функция для валидации email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Функция для валидации телефона
function isValidPhone(phone) {
    const phoneRegex = /^\+?[0-9\s-()]{10,}$/;
    return phoneRegex.test(phone);
}

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    // Удаляем предыдущее уведомление, если оно есть
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Добавляем иконку в зависимости от типа уведомления
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="close-notification">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Добавляем уведомление на страницу
    document.body.appendChild(notification);

    // Добавляем обработчик для кнопки закрытия
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.remove();
    });

    // Автоматически скрываем уведомление через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Функция для отправки данных формы
async function sendFormData(formData) {
    try {
        // В реальном проекте здесь был бы запрос к серверу
        // Имитируем задержку отправки
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Имитируем успешную отправку
        return {
            success: true,
            message: 'Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.'
        };
    } catch (error) {
        return {
            success: false,
            message: 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.'
        };
    }
}

// Обработчик отправки формы
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('.submit-button');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Получаем данные формы
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim()
        };

        // Валидация данных
        if (formData.name.length < 2) {
            showNotification('Пожалуйста, введите корректное имя', 'error');
            return;
        }

        if (!isValidEmail(formData.email)) {
            showNotification('Пожалуйста, введите корректный email', 'error');
            return;
        }

        if (!isValidPhone(formData.phone)) {
            showNotification('Пожалуйста, введите корректный номер телефона', 'error');
            return;
        }

        if (!formData.subject) {
            showNotification('Пожалуйста, выберите тему сообщения', 'error');
            return;
        }

        if (formData.message.length < 10) {
            showNotification('Сообщение должно содержать не менее 10 символов', 'error');
            return;
        }

        // Блокируем кнопку отправки и меняем её текст
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

        // Отправляем данные
        const result = await sendFormData(formData);

        // Разблокируем кнопку и возвращаем исходный текст
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить';

        // Показываем результат
        showNotification(result.message, result.success ? 'success' : 'error');

        // Если отправка успешна, очищаем форму
        if (result.success) {
            form.reset();
        }
    });

    // Добавляем маску для телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = value.substring(1);
            }
            const matches = value.match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !matches[2] ? `+7 ${matches[1]}` : 
                           !matches[3] ? `+7 ${matches[1]} ${matches[2]}` :
                           !matches[4] ? `+7 ${matches[1]} ${matches[2]}-${matches[3]}` :
                           `+7 ${matches[1]} ${matches[2]}-${matches[3]}-${matches[4]}`;
        }
    });
}); 