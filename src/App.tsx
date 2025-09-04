import { useState, useMemo } from "react";
import './App.css';

type Task = {
    text: string;
    done: boolean;
};

type FilterType = 'all' | 'active' | 'completed';

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [input, setInput] = useState("");
    const [filter, setFilter] = useState<FilterType>('all');

    //add
    const addTask = () => {
        if (input.trim() === "") return;
        setTasks([...tasks, { text: input, done: false }]);
        setInput("");
    };

    //del
    const deleteTask = (index: number) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    //toggle
    const toggleTask = (index: number) => {
        const newTasks = [...tasks];
        newTasks[index].done = !newTasks[index].done;
        setTasks(newTasks);
    };

    //filter
    const filteredTasks = useMemo(() => {
        switch (filter) {
            case 'active':
                return tasks.filter(task => !task.done);
            case 'completed':
                return tasks.filter(task => task.done);
            case 'all':
            default:
                return tasks;
        }
    }, [tasks, filter]);

    //statistics
    const stats = {
        total: tasks.length,
        active: tasks.filter(task => !task.done).length,
        completed: tasks.filter(task => task.done).length
    };

    return (
        <div className="title">
            <h1>ToDo App</h1>
        <div className="input-area">
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='タスクを入力'
            />
            <button onClick={addTask}>タスクを追加</button>
        </div>

            {/* filterbutton */}
            <div className="filter-buttons">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    すべて ({stats.total})
                </button>
                <button
                    className={filter === 'active' ? 'active' : ''}
                    onClick={() => setFilter('active')}
                >
                    未完了 ({stats.active})
                </button>
                <button
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={() => setFilter('completed')}
                >
                    完了済み ({stats.completed})
                </button>
            </div>

            <ul>
                {filteredTasks.map((task) => {
                    const originalIndex = tasks.findIndex(t => t === task);

                    return (
                        <li key={originalIndex} className="taskmap">
                            <div className="task-content">
                                <div
                                    className="checkbox"
                                    onClick={() => toggleTask(originalIndex)}
                                >
                                    {task.done ? (
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <circle cx="10" cy="10" r="9" fill="black" stroke="black" strokeWidth="2"/>
                                            <path d="M7 10L9 12L13 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <circle cx="10" cy="10" r="9" fill="none" stroke="black" strokeWidth="2"/>
                                        </svg>
                                    )}
                                </div>
                                <span
                                    className={`task-text ${task.done ? 'completed' : ''}`}
                                >
                  {task.text}
                </span>
                            </div>
                            <button className="del" onClick={() => deleteTask(originalIndex)} >
                                ×
                            </button>
                        </li>
                    )
                })}
            </ul>

            {/* 統計表示 */}
            {tasks.length > 0 && (
                <div className="stats">
                    <p>表示中: {filteredTasks.length} / 全体: {stats.total}</p>
                </div>
            )}
        </div>
    );
}

export default App