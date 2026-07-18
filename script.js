// script.js

let balance = 0;
const rewardHistoryList = document.getElementById('reward-history-list');
const balanceElement = document.getElementById('balance');

// Updated to map your story-driven questions precisely
const tasks = {
    1: {
        description: "Prove that you are the saintess",
        reward: 10,
        complete: function () {
            const answer = prompt("Enter the hidden passcode of the order (Hint: saintess):");
            return answer && answer.toLowerCase() === 'saintess';
        }
    },
    2: {
        description: "How is your temper",
        reward: 20,
        complete: function () {
            const answer = prompt("Are you calm, angry, or volatile?");
            return answer && answer.toLowerCase() === 'calm';
        }
    },
    3: {
        description: "Whats the age difference again",
        reward: 30,
        complete: function () {
            const answer = prompt("What is the secret difference variable? (Enter a number):");
            return answer === '0'; 
        }
    }
};

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
    const rewards = {
        1: 10,
        2: 20,
        3: 30
    };
    
    const reward = rewards[taskId] || 0;
    balance += reward;
    balanceElement.textContent = balance;
    
    const rewardItem = document.createElement('li');
    rewardItem.textContent = `Trial ${taskId} bypassed. +${reward} fragments gathered.`;
    rewardHistoryList.appendChild(rewardItem);
    
    saveProgress(); 
    updateSecretsTab(); // Check if newly updated balance unlocks the terminal
}

// Interactive task handler linked from button clicks
function handleTaskClick(taskId) {
    const task = tasks[taskId];
    if (task && task.complete()) {
        completeTask(taskId);
    } else {
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
