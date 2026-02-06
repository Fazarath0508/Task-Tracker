import { useState } from "react";

function TaskForm({ onAdd }) {
    const [text, setText] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [category, setCategory] = useState("Personal");
    const [dueDate, setDueDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() === "") return;
        onAdd(text, priority, category, dueDate);
        setText("");
        setPriority("Medium");
        setCategory("Personal");
        setDueDate("");
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter a task..."
                className="task-input"
            />
            <div className="form-controls">
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="task-select"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="task-select"
                >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Study">Study</option>
                    <option value="Shopping">Shopping</option>
                </select>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="task-select task-date"
                />
            </div>
            <button type="submit" className="btn btn-add">
                Add Task
            </button>
        </form>
    );
}

export default TaskForm;
