// Chat functionality
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');

// Sample AI responses for demonstration
const aiResponses = {
    'hello': "Hi there! 👋 How can I help you with your studies today?",
    'help': "I can help you with:\n📚 Subject explanations\n📝 Homework assistance\n💡 Study tips\n🎯 Exam preparation\nWhat would you like to know?",
    'math': "Math is the language of the universe! 📐 Ask me about algebra, geometry, calculus, or any other math topic.",
    'science': "Science is fascinating! 🔬 I can help with physics, chemistry, biology, and more. What's your question?",
    'history': "History shows us where we've been! 📖 Ask me about any historical period or event.",
    'english': "Language and literature are powerful! 📚 Need help with writing, grammar, or literature analysis?",
    'default': "That's an interesting question! 🤔 Could you provide more details so I can give you a better answer?"
};

function sendMessage() {
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Simulate AI response delay
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessage(response, 'bot');
    }, 800);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for keyword matches
    for (const [key, response] of Object.entries(aiResponses)) {
        if (message.includes(key)) {
            return response;
        }
    }
    
    // Random responses for unmatched queries
    const responses = [
        "Great question! 💭 Can you tell me more about what you'd like to know?",
        "Interesting! Let me help you understand this better. What aspect would you like me to focus on?",
        "That's a good inquiry! 🎯 I'm here to help. Please provide more context so I can give you a detailed answer.",
        "Absolutely! 🚀 I'd love to help. Could you be more specific about your question?",
        "That's worth exploring! 📚 Tell me more details and I'll provide a comprehensive explanation."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function scrollToChat() {
    const chatSection = document.getElementById('chat');
    chatSection.scrollIntoView({ behavior: 'smooth' });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    const submitButton = contactForm.querySelector('.submit-button');
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        const inputs = contactForm.querySelectorAll('.form-input');
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                isValid = false;
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (isValid) {
            alert('✅ Thank you for your message! We will get back to you soon.');
            inputs.forEach(input => input.value = '');
        } else {
            alert('⚠️ Please fill in all fields.');
        }
    });
}

// Add initial greeting message on page load
window.addEventListener('load', () => {
    const greeting = "👋 Welcome to Goat AI! I'm here to help with your studies. Feel free to ask me anything about subjects, homework, study tips, or exam preparation!";
    addMessage(greeting, 'bot');
});

// Theme toggle (optional enhancement)
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

initializeTheme();