let tasks = [];
let score = 0;
let level = 1;
const pointsPerLevel = 100;

const pointsMap = {
  Low: 2,
  Medium: 5,
  High: 10
};

function addTask() {
  const input = document.getElementById("taskInput");
  const category = document.getElementById("categorySelect").value;
  const priority = document.getElementById("prioritySelect").value;

  if (input.value.trim() === "") return;

  tasks.push({ text: input.value, completed: false, category, priority });
  input.value = "";
  renderTasks();
  updateProgress();
}

function toggleTask(index) {
  const task = tasks[index];
  const wasCompleted = task.completed;
  task.completed = !task.completed;

  if (!wasCompleted && task.completed) {
    const points = pointsMap[task.priority];
    score += points;
    animateScore(points);
    checkLevelUp();
  }

  renderTasks();
  updateProgress();

  if (tasks.every(t => t.completed)) {
    celebrateCompletion();
  }
}

function deleteTask(index) {
  if (tasks[index].completed) return;

  const li = document.querySelectorAll("#taskList li")[index];
  li.classList.add("removing");
  setTimeout(() => {
    tasks.splice(index, 1);
    renderTasks();
    updateProgress();
  }, 300);
}

function editTask(index) {
  const task = tasks[index];
  const newText = prompt("Edit task:", task.text);
  if (newText === null || newText.trim() === "") return;

  const newCategory = prompt("Edit category (Study/Work/Personal/Other):", task.category);
  if (!["Study", "Work", "Personal", "Other"].includes(newCategory)) return;

  const newPriority = prompt("Edit priority (Low/Medium/High):", task.priority);
  if (!["Low", "Medium", "High"].includes(newPriority)) return;

  task.text = newText.trim();
  task.category = newCategory;
  task.priority = newPriority;
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `category-${task.category} priority-${task.priority}`;
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-info">
        <span class="task-text" onclick="toggleTask(${index})">${task.text}</span>
        <div class="task-meta">${task.category} • ${task.priority} Priority</div>
      </div>
      <div class="task-actions">
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    list.appendChild(li);
    setTimeout(() => li.classList.add("added"), 10);
  });
}

function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = `${percentage}%`;
  document.getElementById("progressText").textContent = `${percentage}% Complete`;
}

function animateScore(points) {
  const scoreEl = document.getElementById("score");
  const currentScore = parseInt(scoreEl.textContent);
  scoreEl.textContent = currentScore + points;

  // Simple animation
  scoreEl.style.transform = "scale(1.2)";
  setTimeout(() => scoreEl.style.transform = "scale(1)", 200);
}

function checkLevelUp() {
  const requiredScore = level * pointsPerLevel;
  if (score >= requiredScore) {
    level++;
    document.getElementById("level").textContent = level;
    showLevelUp();
  }
}

function showLevelUp() {
  const levelUpEl = document.createElement("div");
  levelUpEl.className = "level-up";
  levelUpEl.textContent = `🎉 Level Up! You're now Level ${level}! 🎉`;
  document.body.appendChild(levelUpEl);

  setTimeout(() => {
    levelUpEl.remove();
  }, 3000);
}

function celebrateCompletion() {
  const confettiContainer = document.createElement("div");
  confettiContainer.className = "confetti";
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 100; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.animationDelay = Math.random() * 3 + "s";
    piece.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confettiContainer.appendChild(piece);
  }

  setTimeout(() => {
    confettiContainer.remove();
  }, 5000);
}

function clearAllTasks() {
  tasks = [];
  renderTasks();
  updateProgress();
}

// Initialize
updateProgress();