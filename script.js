 let tasks = [];
        let currentFilter = 'all';
        let selectedPriority = 'medium';

        // Priority button selection
        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedPriority = this.dataset.priority;
            });
        });

        // Filter button selection
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                renderTasks();
            });
        });

        // Add task function
        function addTask() {
            const title = document.getElementById('taskTitle').value.trim();
            const desc = document.getElementById('taskDesc').value.trim();

            if (!title) {
                alert('Please enter a task title!');
                return;
            }

            const task = {
                id: Date.now(),
                title: title,
                description: desc,
                priority: selectedPriority,
                completed: false,
                date: new Date().toLocaleDateString()
            };

            tasks.unshift(task);
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDesc').value = '';
            
            renderTasks();
            updateStats();
        }

        // Toggle task completion
        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                renderTasks();
                updateStats();
            }
        }

        // Delete task
        function deleteTask(id) {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(t => t.id !== id);
                renderTasks();
                updateStats();
            }
        }

        // Render tasks
        function renderTasks() {
            const container = document.getElementById('tasksContainer');
            let filteredTasks = tasks;

            // Apply filter
            if (currentFilter === 'active') {
                filteredTasks = tasks.filter(t => !t.completed);
            } else if (currentFilter === 'completed') {
                filteredTasks = tasks.filter(t => t.completed);
            } else if (currentFilter === 'high' || currentFilter === 'medium' || currentFilter === 'low') {
                filteredTasks = tasks.filter(t => t.priority === currentFilter);
            }

            if (filteredTasks.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>No tasks found!</h3>
                        <p>Try changing your filter or add a new task</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = filteredTasks.map(task => `
                <div class="task-item ${task.priority} ${task.completed ? 'completed' : ''}">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''}
                        onchange="toggleTask(${task.id})"
                    />
                    <div class="task-content">
                        <h3>${task.title}</h3>
                        ${task.description ? `<p>${task.description}</p>` : ''}
                    </div>
                    <div class="task-meta">
                        <span class="priority-badge ${task.priority}">
                            ${task.priority.toUpperCase()}
                        </span>
                        <span class="task-date">${task.date}</span>
                        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        // Update statistics
        function updateStats() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;
            const pending = total - completed;

            document.getElementById('totalTasks').textContent = total;
            document.getElementById('completedTasks').textContent = completed;
            document.getElementById('pendingTasks').textContent = pending;
        }

        // Allow Enter key to add task
        document.getElementById('taskTitle').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        document.getElementById('taskDesc').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        // Initial render
        updateStats();