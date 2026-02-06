import { useState } from "react";
import { motion } from "framer-motion";

function TaskItem({ task, onToggle, onDelete, onEdit, innerRef, draggableProps, dragHandleProps }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(task.name);
    const [editedPriority, setEditedPriority] = useState(task.priority || "Medium");
    const [editedCategory, setEditedCategory] = useState(task.category || "Personal");
    const [editedDueDate, setEditedDueDate] = useState(task.dueDate || "");

    const handleSave = () => {
        if (editedName.trim() === "") return;
        onEdit(task.id, {
            name: editedName,
            priority: editedPriority,
            category: editedCategory,
            dueDate: editedDueDate
        });
        setIsEditing(false);
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0) && !task.done;

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: -50 }
    };

    if (isEditing) {
        return (
            <motion.li
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                className="task-item editing"
                ref={innerRef}
                {...draggableProps}
                {...dragHandleProps}
            >
                <div className="edit-form">
                    <input
                        className="edit-input"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                    />
                    <div className="edit-controls-row">
                        <select
                            className="edit-select"
                            value={editedPriority}
                            onChange={(e) => setEditedPriority(e.target.value)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <select
                            className="edit-select"
                            value={editedCategory}
                            onChange={(e) => setEditedCategory(e.target.value)}
                        >
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Study">Study</option>
                            <option value="Shopping">Shopping</option>
                        </select>
                        <input
                            type="date"
                            className="edit-select"
                            value={editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value)}
                        />
                    </div>
                    <div className="edit-actions">
                        <button onClick={handleSave} className="btn btn-save">Save</button>
                        <button onClick={() => setIsEditing(false)} className="btn btn-cancel">Cancel</button>
                    </div>
                </div>
            </motion.li>
        );
    }

    return (
        <motion.li
            layout
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className={`task-item ${task.done ? "done" : ""} ${isOverdue ? "overdue" : ""}`}
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
        >
            <span
                onClick={() => onToggle(task.id)}
                className="task-text"
            >
                {task.name}
            </span>
            <div className="task-info">
                {task.dueDate && (
                    <span className="date-badge">
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                )}
                <span className={`priority-badge priority-${task.priority?.toLowerCase()}`}>
                    {task.priority || "Medium"}
                </span>
                <span className="category-badge">
                    {task.category || "General"}
                </span>
            </div>
            <div className="action-buttons">
                <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-edit"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="btn btn-delete"
                >
                    Delete
                </button>
            </div>
        </motion.li>
    );
}

export default TaskItem;
