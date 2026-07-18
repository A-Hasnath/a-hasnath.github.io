// script.js

let balance = 0;
const rewardHistoryList = document.getElementById('reward-history-list');
const balanceElement = document.getElementById('balance');

// Reconfigured tasks architecture using custom strings & modal parameters
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
            return answer === '0'; 
        }
    },
    4: {
        description: "Whats the blood again",
        reward: 20,
        message: "What is the liquid variable? (Enter group):",
        validate: function (answer) {
            return answer === 'o'; 
        }
    }
};


// Custom graphic dialog controller using modern Promises
function showCustomPrompt(messageText) {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-prompt-modal');
        const msgContainer = document.getElementById('modal-message');
        const inputField = document.getElementById('modal-input');
        const submitBtn = document.getElementById('modal-submit-btn');
        const cancelBtn = document.getElementById('modal-cancel-btn');

        // Setup texts and reset fields
        msgContainer.textContent = messageText;
        inputField.value = '';
        modal.style.display = 'flex';
        inputField.focus();

        // Event scoping handlers
        function handleSubmit() {
            cleanup();
            resolve(inputField.value);
        }

        function handleCancel() {
            cleanup();
            resolve(null);
        }

        function cleanup() {
            modal.style.display = 'none';
            submitBtn.removeEventListener('click', handleSubmit);
            cancelBtn.removeEventListener('click', handleCancel);
        }

        submitBtn.addEventListener('click', handleSubmit);
        cancelBtn.addEventListener('click', handleCancel);
    });
}

// Load progress from localStorage when the app loads
function loadProgress() {
    const savedBalance = localStorage.getItem('balance');
    const savedHistory = localStorage.getItem('rewardHistory');

    // Load balance if it exists
    if (savedBalance !== null) {
        balance = parseInt(savedBalance, 10);
        balanceElement.textContent = balance;
    }

    // Load reward history if it exists
    if (savedHistory !== null) {
        const rewardHistory = JSON.parse(savedHistory);
        rewardHistoryList.innerHTML = ''; // Clear fallback mockup HTML items
        rewardHistory.forEach(reward => {
            const rewardItem = document.createElement('li');
            rewardItem.textContent = reward;
            rewardHistoryList.appendChild(rewardItem);
        });
    }
    // Update the locked terminal message based on current balance
    updateSecretsTab();
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('balance', balance);
    const rewardHistoryItems = Array.from(rewardHistoryList.children).map(item => item.textContent);
    localStorage.setItem('rewardHistory', JSON.stringify(rewardHistoryItems));
}

// Function to clear progress
function clearProgress() {
    localStorage.removeItem('balance');
    localStorage.removeItem('rewardHistory');
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
    
    saveProgress(); 
    updateSecretsTab(); // Check if newly updated balance unlocks the terminal
}

// Asynchronous button router to intercept interaction cleanly
async function handleTaskClick(taskId) {
    const task = tasks[taskId];
    if (!task) return;

    // Await the custom styled terminal popup response smoothly
    const userInput = await showCustomPrompt(task.message);
    
    // Evaluate input results using the clean popup framework
    if (userInput !== null && task.validate(userInput)) {
        completeTask(taskId);
        alert("Verification successful. Access granted.");
    } else if (userInput !== null) {
        alert("Verification failed. Access Denied.");
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

// Tab switching logic with Premium Clean Industrial Blast Gate Transition
function openTab(event, tabId) {
    const gateContainer = document.getElementById('gate-container');

    // STEP 1: Trigger the full mechanical sequence
    gateContainer.className = 'gate-shut';

    // Wait exactly 300ms for the gates to be fully closed, then swap active layouts underneath
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

    }, 300); // 300ms matches the "Hold solid" phase in the CSS

    // STEP 3: Reset the gate classes after the 700ms animation completely finishes
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
