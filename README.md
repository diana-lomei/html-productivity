# html-productivity
`# Productivity Manager (To-Do & Notes) 📈

A lightweight web app for task management and notes with local-first architecture. Built with modern web technologies.

## 🛠️ Tech Stack
- **Core**: Vanilla JavaScript (ES6+)
- **Storage**: `localStorage` with JSON serialization
- **UI**: Bootstrap 5 components
- **Charts**: Chart.js integration
- **Optimizations**: Debounce, DOM fragments
- **Error Handling**: Custom error handler with user feedback

## ✨ Key Features
### To-Do Module
- 📌 CRUD operations with instant localStorage sync
- 🎚️ Dynamic filtering (All/Active/Completed)
- ⏳ Deadline tracking with background checks
- 📊 Auto-updated task statistics

### Notes System
- 📝 Rich text notes with titles
- 🔍 Real-time search (debounced 300ms)
- ✏️ Edit-in-place functionality
- 📅 Automatic timestamping

## 🖥️ How It Works
1. **Data Flow**- All operations trigger `localStorage` updates via unified API:
   ```js
   const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));`

1. **State Management**
    - Module-specific state containers (`tasks[]`, `notes[]`)
    - Immutable updates with array methods (`map`, `filter`)
2. **Rendering Engine**
    - Template literals for HTML generation
    - Batch DOM updates using document fragments
    
    js
    
    Copy
    
    ```
    const fragment = document.createDocumentFragment();
    filteredTasks.forEach(task => fragment.appendChild(createTaskElement(task)));
    ```
    
3. **Network Layer**
    - Background sync every 5 minutes:
    
    js
    
    Copy
    
    ```
    setInterval(syncWithCloud, 300000);
    ```
    
    - Error handling for offline scenarios

## 🚀 Getting Started

1. Clone repo:

bash

Copy

```
git clone https://github.com/yourrepo/productivity-manager.git
```

1. Open `index.html` in modern browser

Or open this https://diana-lomei.github.io/html-productivity/

## ⚡ Performance Optimizations

- **Debounced Search**: Reduces render cycles
- **Selective Rerendering**: Only affected components update
- **Memory Management**: Automatic data cleanup
- **Lazy Statistics**: Chart.js renders on demand

## 🌐 Compatibility

- Modern browsers (Chrome 90+, Firefox 88+)
- Mobile-responsive design
- Offline-first capability
