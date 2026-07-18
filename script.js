// script.js

let balance = 0;
const rewardHistoryList = document.getElementById('reward-history-list');
const balanceElement = document.getElementById('balance');

// Define the tasks and their respective rewards
const tasks = {
    1: {
        description: "Solve 5 + 3",
        reward: 10,  // Reward for this task
        complete: function () {
            const answer = prompt("What is 5 + 3?");
            return answer === '8';
        }
    },
    2: {
        description: "Answer: What is the capital of France?",
        reward: 15,  // Reward for this task
        complete: function () {
            const answer = prompt("What is the capital of France?");
            return answer.toLowerCase() === 'paris';
        }
    },
    3: {
        description: "Complete a random task",
        reward: Math.floor(Math.random() * 20) + 1,  // Random reward between 1 and 20
        complete: function () {
            alert("You completed a random task!");
            return true;
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
        rewardHistory.forEach(reward => {
            const rewardItem = document.createElement('li');
            rewardItem.textContent = reward;
            rewardHistoryList.appendChild(rewardItem);
        });
    }
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
    rewardHistoryList.innerHTML = '';  // Clear reward history
    alert('Progress cleared!');
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
    rewardItem.textContent = `Task ${taskId} completed. Reward: ${reward} coins`;
    rewardHistoryList.appendChild(rewardItem);
    
    saveProgress(); // Save progress after completing a task
}

// Tab switching logic with Glitch Effect
function openTab(event, tabId) {
    // 1. Trigger the screen glitch animation on the body
    document.body.classList.add('glitch-active');

    // 2. Hide all tab content
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active-tab');
    });

    // 3. Remove active class from all tab links
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.classList.remove('active');
    });

    // 4. Show the selected tab and make its link active
    document.getElementById(tabId).classList.add('active-tab');
    event.currentTarget.classList.add('active');
    
    // 5. Clean up the class after the 0.6s animation completes (Changed from 250 to 600)
    setTimeout(() => {
        document.body.classList.remove('glitch-active');
    }, 600);
}

// Load progress on page load
window.onload = function () {
    loadProgress();
};

// Attach clear progress button listener
document.getElementById('clear-progress-btn').addEventListener('click', clearProgress);
