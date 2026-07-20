// script.js

let balance = 0;
let completedTasks = []; // Track solved task IDs
const rewardHistoryList = document.getElementById('reward-history-list');
const balanceElement = document.getElementById('balance');

// Task Configuration
const tasks = {
    1: {
        description: "Prove that you are the saintess",
        reward: 10,
        message: "Enter the hidden passcode of the order (Hint: saintess):",
        validate: function (answer) {
            return answer && answer.toLowerCase() === 'saintess';
        }
    },
    2: {
        description: "How is your temper",
        reward: 20,
        message: "Are you calm, angry, or volatile?",
        validate: function (answer) {
            return answer && answer.toLowerCase() === 'calm';
        }
    },
    3: {
        description: "Whats the age difference again",
        reward: 30,
        message: "What is the secret difference variable? (Enter a number):",
        validate: function (answer) {
            return answer && answer.trim() === '0'; 
        }
    },
    4: {
        description: "Whats the blood again",
        reward: 20,
        message: "What is the liquid variable? (Enter group):",
        validate: function (answer) {
            return answer && answer.toLowerCase() === 'o'; 
        }
    }
};

// Custom graphic dialog controller
function showCustomPrompt(messageText, taskValidator) {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-prompt-modal');
        const modalBox = document.getElementById('modal-box');
        const msgContainer = document.getElementById('modal-message');
        const inputField = document.getElementById('modal-input');
        const errorField = document.getElementById('modal-error');
        const submitBtn = document.getElementById('modal-submit-btn');
        const cancelBtn = document.getElementById('modal-cancel-btn');

        msgContainer.textContent = messageText;
        inputField.value = '';
        if (errorField) errorField.textContent = '';
        inputField.style.borderColor = '#622A50';
        modal.style.display = 'flex';
        inputField.focus();

        function handleSubmit() {
            const val = inputField.value;
            if (taskValidator(val)) {
                cleanup();
                resolve(true);
            } else {
                if (errorField) errorField.textContent = '[ ERROR: ACCESS DENIED ]';
                inputField.style.borderColor = '#ff4444';
                
                if (modalBox) {
                    modalBox.style.transform = 'translateX(-6px)';
                    setTimeout(() => modalBox.style.transform = 'translateX(6px)', 50);
                    setTimeout(() => modalBox.style.transform = 'translateX(0)', 100);
                }
            }
        }

        function handleCancel() {
            cleanup();
            resolve(false);
        }

        function handleKeyDown(e) {
            if (e.key === 'Enter') handleSubmit();
        }

        function cleanup() {
            modal.style.display = 'none';
            submitBtn.removeEventListener('click', handleSubmit);
            cancelBtn.removeEventListener('click', handleCancel);
            inputField.removeEventListener('keydown', handleKeyDown);
        }

        submitBtn.addEventListener('click', handleSubmit);
        cancelBtn.addEventListener('click', handleCancel);
        inputField.addEventListener('keydown', handleKeyDown);
    });
}

// Load progress from localStorage
function loadProgress() {
    const savedBalance = localStorage.getItem('balance');
    const savedHistory = localStorage.getItem('rewardHistory');
    const savedCompleted = localStorage.getItem('completedTasks');

    if (savedBalance !== null) {
        balance = parseInt(savedBalance, 10);
        balanceElement.textContent = balance;
    }

    if (savedHistory !== null) {
        const rewardHistory = JSON.parse(savedHistory);
        rewardHistoryList.innerHTML = '';
        rewardHistory.forEach(reward => {
            const rewardItem = document.createElement('li');
            rewardItem.textContent = reward;
            rewardHistoryList.appendChild(rewardItem);
        });
    }

    // Restore completed buttons state
    if (savedCompleted !== null) {
        completedTasks = JSON.parse(savedCompleted);
        completedTasks.forEach(taskId => {
            disableTaskButton(taskId);
        });
    }

    updateSecretsTab();
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('balance', balance);
    const rewardHistoryItems = Array.from(rewardHistoryList.children).map(item => item.textContent);
    localStorage.setItem('rewardHistory', JSON.stringify(rewardHistoryItems));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Helper function to lock button visually and functionally
function disableTaskButton(taskId) {
    const btn = document.getElementById(`task-btn-${taskId}`);
    if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        if (!btn.innerText.includes('[ BYPASSED ]')) {
            btn.innerText += " [ BYPASSED ]";
        }
    }
}

// Clear all progress and unlock buttons back
function clearProgress() {
    localStorage.removeItem('balance');
    localStorage.removeItem('rewardHistory');
    localStorage.removeItem('completedTasks');
    
    // Reset completed tasks array & re-enable all task buttons
    completedTasks.forEach(taskId => {
        const btn = document.getElementById(`task-btn-${taskId}`);
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.innerText = btn.innerText.replace(" [ BYPASSED ]", "");
        }
    });

    completedTasks = [];
    balance = 0;
    balanceElement.textContent = balance;
    rewardHistoryList.innerHTML = '';  
    updateSecretsTab();
    alert('Log entries successfully purged!');
}

// Task completion logic
function completeTask(taskId) {
    const task = tasks[taskId];
    const reward = task ? task.reward : 0;
    
    balance += reward;
    balanceElement.textContent = balance;
    
    const rewardItem = document.createElement('li');
    rewardItem.textContent = `Trial ${taskId} bypassed. +${reward} fragments gathered.`;
    rewardHistoryList.appendChild(rewardItem);
    
    // Mark as completed and update button state
    if (!completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
    }
    disableTaskButton(taskId);

    saveProgress(); 
    updateSecretsTab();
}

// Asynchronous button router
async function handleTaskClick(taskId) {
    // Prevent execution if already completed
    if (completedTasks.includes(taskId)) return;

    const task = tasks[taskId];
    if (!task) return;

    const passed = await showCustomPrompt(task.message, task.validate);
    
    if (passed) {
        completeTask(taskId);
    }
}

// Dynamic decryption logic for the Secrets tab
function updateSecretsTab() {
    const secretStatus = document.getElementById('secret-status');
    if (!secretStatus) return;

    if (balance >= 50) {
        secretStatus.innerHTML = "<span style='color: #bc3a80; font-weight: bold;'>[ UNLOCKED TRANSMISSION ]</span><br><br>\"They know you unlocked the gates. Run.\"";
    } else {
        secretStatus.innerHTML = `[ TERMINAL LOCKED ]<br><br>Requires 50 fragments to decode data.<br>(Current: ${balance} / 50)`;
    }
}

// Tab switching logic
function openTab(event, tabId) {
    const gateContainer = document.getElementById('gate-container');

    gateContainer.className = 'gate-shut';

    setTimeout(() => {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            tab.classList.remove('active-tab');
        });

        const tabLinks = document.querySelectorAll('.tab-link');
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });

        document.getElementById(tabId).classList.add('active-tab');
        event.currentTarget.classList.add('active');

    }, 300);

    setTimeout(() => {
        gateContainer.className = 'gate-open';
    }, 700); 
}

// Load progress on page load
window.onload = function () {
    loadProgress();
};

// Attach clear progress button listener
document.getElementById('clear-progress-btn').addEventListener('click', clearProgress);
