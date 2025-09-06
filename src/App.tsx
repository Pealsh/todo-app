import {useState, useMemo, useEffect} from "react";
import './App.css';

type Task = {
    text: string;
    category: string;
    priority: number;
    done: boolean;
};

type FilterType = 'all' | 'active' | 'completed';

function App() {
    const initializeTasks = (): Task[] => {
        try {
            const savedtasks = localStorage.getItem("todotasks");
            return savedtasks ? JSON.parse(savedtasks) : [];
        } catch (error) {
            console.error('読み込みエラー', error);
            return [];
        }

    };
    const [tasks, setTasks] = useState<Task[]>(initializeTasks);
    const [input, setInput] = useState("");
    const [filter, setFilter] = useState<FilterType>('all');
    const [selectedCategory, setSelectedCategory] = useState('仕事');
    const [selectedPriority, setSelectedPriority] = useState(2);

    useEffect(() => {
        try {
            localStorage.setItem("todotasks", JSON.stringify(tasks));
        } catch (error) {
            console.log(error);
        }
    }, [tasks]);
    //add
    const addTask = () => {
        if (input.trim() === "") return;
        setTasks([...tasks, { text: input, done: false, category:selectedCategory, priority:selectedPriority}]);
        setInput("");
    };

    //del
    const deleteTask = (index: number) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    //delall
    const deleteAllTasks = () => {
        if (window.confirm('全部消すの？')) {
            setTasks([])
        }
    };

    //toggle
    const toggleTask = (index: number) => {
        const newTasks = [...tasks];
        newTasks[index].done = !newTasks[index].done;
        setTasks(newTasks);
    };

    //filter
    const filteredTasks = useMemo(() => {
        if (filter === 'active') {
            return tasks.filter(task => !task.done);
        } else if (filter === 'completed') {
            return tasks.filter(task => task.done);
        } else {
            return tasks;
        }
    }, [tasks, filter]);

    //category

    //priority

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
                <div className="input-row">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='タスクを入力'
                    />
                    <button onClick={addTask}>タスクを追加</button>
                </div>

                <div className="options-row">
                    <div className="category-section">
                        <label>カテゴリー:</label>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="仕事">仕事</option>
                            <option value="プライベート">プライベート</option>
                            <option value="買い物">買い物</option>
                            <option value="その他">その他</option>
                        </select>
                    </div>

                    <div className="priority-section">
                        <label>優先度:</label>
                        <div className="priority-buttons">
                            <button
                                className={selectedPriority === 3 ? 'active' : ''}
                                onClick={() => setSelectedPriority(3)}>高
                            </button>
                            <button
                                className={selectedPriority === 2 ? 'active' : ''}
                                onClick={() => setSelectedPriority(2)}>中
                            </button>
                            <button
                                className={selectedPriority === 1 ? 'active' : ''}
                                onClick={() => setSelectedPriority(1)}>低
                            </button>
                        </div>
                    </div>
                </div>
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

                    const getPriority = (priority: number) => {
                        if (priority ===3) return {label: '高', color: 'red'};
                        if (priority ===2) return {label: '中', color: '#FFC800'};
                        if (priority ===1) return {label: '低', color: 'gray'};
                        return {label: '低', color: 'gray'};
                    };

                    const priorityInfo = getPriority(task.priority);
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
                                className="priority"
                                style={{
                                    backgroundColor: priorityInfo.color,
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    marginRight: '8px'
                                }}>
                                    {priorityInfo.label}
                                </span>
                                <span
                                    className={`task-text ${task.done ? 'completed' : ''}`}
                                >
                  {task.text}
                </span>
                                <span className="categorydisp" style={{ marginLeft: 'auto', color: '#666'}}>
                                    {task.category}
                                </span>
                            </div>
                            <button className="del" onClick={() => deleteTask(originalIndex)} >
                                ×
                            </button>
                        </li>
                    )
                })}
            </ul>

            {/* delall */}
            {tasks.length > 0 && (
                <div className="stats">
                    <p className="delallbut" onClick={deleteAllTasks}>delete all</p>
                </div>
            )}

        </div>
    );
}

export default App