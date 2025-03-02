const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const loadFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];

// To-Do Logic
let tasks = loadFromStorage('tasks');
let currentFilter = 'all';
const renderTasks = () => {
    const filtered = tasks.filter(task => 
        currentFilter === 'all' ? true :
        currentFilter === 'active' ? !task.completed : task.completed
    );
    document.getElementById('taskList').innerHTML = filtered.map(task => `
        <li class="task-item d-flex align-items-center p-2 mb-2 bg-light rounded" data-id="${task.id}">
            <input class="form-check-input me-2" type="checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleComplete(${task.id})">
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="btn btn-danger btn-sm ms-auto" 
                onclick="deleteTask(${task.id})">&times;</button>
        </li>
    `).join('');
    
    document.getElementById('counter').textContent = `Remaining tasks: ${tasks.filter(t => !t.completed).length}`;
};

const addTask = (e) => {
    e.preventDefault();
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text) {
        tasks.push({ id: Date.now(), text, completed: false });
        input.value = '';
        saveToStorage('tasks', tasks);
        renderTasks();
    }
};

const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveToStorage('tasks', tasks);
    renderTasks();
};

const toggleComplete = (id) => {
    tasks = tasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
    );
    saveToStorage('tasks', tasks);
    renderTasks();
};

const filterTasks = (filter) => {
    currentFilter = filter;
    renderTasks();
document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
e.target.classList.add('active');
};

// Notes Logic
let notes = loadFromStorage('notes');
let editingNoteId = null;

const displayNotes = () => {
    document.getElementById('notesContainer').innerHTML = notes.map(note => `
        <div class="col-12 note-card p-3 mb-3 bg-light rounded" data-id="${note.id}">
            <h3 class="h6 mb-2">${note.title}</h3>
            <p class="text-muted small mb-2">${note.content}</p>
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">${new Date(note.id).toLocaleDateString('en-US')}</small>
                <div>
                    <button class="btn btn-warning btn-sm me-2" 
                        onclick="editNote(${note.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" 
                        onclick="deleteNote(${note.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
};

const saveNote = (e) => {
    e.preventDefault();
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title || !content) return;

    const newNote = {
        id: editingNoteId || Date.now(),
        title,
        content,
        date: new Date().toLocaleString('en-US')
    };

    if (editingNoteId) {
        notes = notes.map(note => note.id === editingNoteId ? newNote : note);
        editingNoteId = null;
    } else {
        notes.push(newNote);
    }

    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    saveToStorage('notes', notes);
    displayNotes();
};

const deleteNote = (id) => {
    notes = notes.filter(note => note.id !== id);
    saveToStorage('notes', notes);
    displayNotes();
};

const editNote = (id) => {
    const note = notes.find(n => n.id === id);
    editingNoteId = id;
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
};
document.addEventListener('DOMContentLoaded', () => {
  const setValidationMessages = () => {
      document.querySelectorAll('[required]').forEach(field => {
          field.title = "This field is required";
          field.oninvalid = (e) => {
              e.target.setCustomValidity('Please fill out this field');
          };
          field.oninput = (e) => {
              e.target.setCustomValidity('');
          };
      });
  };
  setValidationMessages();
});

document.querySelectorAll('.search-input').forEach(input => {
  input.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const items = e.target.closest('section').querySelectorAll('.note-card, .task-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
  });
});

const TaskManager = (() => {
  let tasks = [];
  let currentFilter = 'all';

  const init = () => {
    tasks = loadFromStorage('tasks');
    render();
  };

  const render = () => {
  };

  return {
    addTask,
    deleteTask,
    toggleComplete,
    init
  };
})();

TaskManager.init();
const deadlineManager = {
  setDeadline(taskId, date) {
    tasks = tasks.map(task => 
      task.id === taskId ? {...task, deadline: date} : task
    );
    this.checkDeadlines();
  },
  
  checkDeadlines() {
    tasks.forEach(task => {
      if (task.deadline && new Date(task.deadline) < new Date()) {
        this.sendReminder(task);
      }
    });
  }
};
const optimizedRender = () => {
  const fragment = document.createDocumentFragment();
  filteredTasks.forEach(task => {
    const element = createTaskElement(task);
    fragment.appendChild(element);
  });
  taskList.innerHTML = '';
  taskList.appendChild(fragment);
};

const debounceSearch = (func, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};
const syncWithCloud = async () => {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'POST',
      body: JSON.stringify({tasks, notes})
    });
    if (!response.ok) throw new Error('Sync failed');
    showNotification('Data synced successfully');
  } catch (error) {
    handleError(error);
  }
};

setInterval(syncWithCloud, 300000); 
const errorHandler = {
  log(error) {
    console.error(`[${new Date().toISOString()}] Error:`, error);
    this.displayUserMessage(error);
  },
  
  displayUserMessage(error) {
    const alert = document.createElement('div');
    alert.className = 'error-alert';
    alert.textContent = this.getFriendlyMessage(error);
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
  },
  
  getFriendlyMessage(error) {
    const messages = {
      'QuotaExceededError': 'Storage is full. Please clear some data',
      'NetworkError': 'Internet connection lost'
    };
    return messages[error.name] || 'Something went wrong';
  }
};
const exportData = () => {
  const data = JSON.stringify({tasks, notes}, null, 2);
  const blob = new Blob([data], {type: 'application/json'});
  saveAs(blob, 'productivity-data.json');
};
const showStatistics = () => {
  const completed = tasks.filter(t => t.completed).length;
  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [completed, tasks.length - completed]
      }]
    }
  });
};