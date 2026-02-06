import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Toaster, toast } from 'sonner';
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            return JSON.parse(savedTasks);
        }
        return [];
    });

    // Undo State
    const [deletedTask, setDeletedTask] = useState(null);

    const [currentTime, setCurrentTime] = useState(new Date());

    // Dark Mode State
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode === "true";
    });

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [darkMode]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const addTask = (text, priority, category, dueDate) => {
        setTasks([
            ...tasks,
            { id: Date.now(), name: text, done: false, priority, category, dueDate }
        ]);
    };

    const editTask = (id, updatedTask) => {
        setTasks(
            tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t))
        );
    };

    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const toggleTask = (id) => {
        setTasks(
            tasks.map((t) =>
                t.id === id ? { ...t, done: !t.done } : t
            )
        );
    };

    const deleteTask = (id) => {
        const taskToDelete = tasks.find((t) => t.id === id);
        setDeletedTask(taskToDelete);
        setTasks(tasks.filter((t) => t.id !== id));

        toast("Task deleted", {
            action: {
                label: 'Undo',
                onClick: () => {
                    setTasks((prev) => [...prev, taskToDelete]);
                },
            },
        });
    };

    const clearCompleted = () => {
        setTasks(tasks.filter((t) => !t.done));
    };

    const exportTasks = () => {
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'tasks.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const importTasks = (event) => {
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = e => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    setTasks(importedTasks);
                } else {
                    alert("Invalid JSON format");
                }
            } catch (err) {
                alert("Error parsing JSON file");
            }
        };
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesFilter =
            filter === "All"
                ? true
                : filter === "Completed"
                    ? task.done
                    : !task.done;
        const matchesSearch = task.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const onDragEnd = (result) => {
        if (!result.destination) return;

        // Only allow reordering if we are viewing "All" tasks without search
        // Otherwise the index mapping is confusing
        if (filter !== "All" || search !== "") return;

        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTasks(items);
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.done).length;
    const pendingTasks = totalTasks - completedTasks;

    const highTasks = tasks.filter((t) => !t.done && t.priority === "High").length;
    const mediumTasks = tasks.filter((t) => !t.done && t.priority === "Medium").length;
    const lowTasks = tasks.filter((t) => !t.done && t.priority === "Low").length;

    const data = [
        { name: 'Completed', value: completedTasks },
        { name: 'High', value: highTasks },
        { name: 'Medium', value: mediumTasks },
        { name: 'Low', value: lowTasks },
    ].filter(item => item.value > 0);

    // Colors: Green (Done), Red (High), Yellow (Medium), Blue (Low)
    const COLORS = ['#52c41a', '#f5222d', '#faad14', '#1890ff'];

    const getChartColor = (name) => {
        switch (name) {
            case 'Completed': return '#52c41a';
            case 'High': return '#f5222d';
            case 'Medium': return '#faad14';
            case 'Low': return '#1890ff';
            default: return '#888';
        }
    };

    const formatDate = (date) => {
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${dayName} ${day}/${month}/${year}`;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    };

    return (
        <div className="container">
            <Toaster position="bottom-center" theme={darkMode ? 'dark' : 'light'} />
            <div className="header-actions">
                <h1 className="app-title">Task Tracker</h1>
                <button onClick={() => setDarkMode(!darkMode)} className="btn-toggle-theme">
                    {darkMode ? "☀️" : "🌙"}
                </button>
            </div>

            <div className="clock-container">
                <span className="clock-time">{formatTime(currentTime)}</span>
                <span className="clock-date">{formatDate(currentTime)}</span>
            </div>

            <div className="dashboard-grid">
                <div className="stats-container">
                    <div className="stat-card">
                        <h3>Total</h3>
                        <p>{totalTasks}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pending</h3>
                        <p>{pendingTasks}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Completed</h3>
                        <p>{completedTasks}</p>
                    </div>
                </div>
                {totalTasks > 0 && (
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={100}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={25}
                                    outerRadius={40}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getChartColor(entry.name)} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            <TaskForm onAdd={addTask} />

            <div className="controls">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <div className="filter-buttons">
                    {["All", "Pending", "Completed"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`btn-filter ${filter === f ? "active" : ""}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <TaskList
                    tasks={filteredTasks}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    isDragEnabled={filter === "All" && search === ""}
                />
            </DragDropContext>

            <div className="footer-actions">
                {tasks.some((t) => t.done) && (
                    <button
                        onClick={clearCompleted}
                        className="btn btn-clear-completed"
                    >
                        Clear Completed
                    </button>
                )}

                <div className="io-actions">
                    <button onClick={exportTasks} className="btn-secondary">Export JSON</button>
                    <label className="btn-secondary btn-upload">
                        Import JSON
                        <input type="file" accept=".json" onChange={importTasks} hidden />
                    </label>
                </div>
            </div>
        </div>
    );
}

export default App;
