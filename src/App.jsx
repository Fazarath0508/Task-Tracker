import { useState } from "react";

function App() {
    const [tasks, setTasks] = useState([]);
    const [text, setText] = useState("");

    return (
        <div style={{ padding: "20px" }}>
            <h1>Task Tracker</h1>

            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter a task"
            />

            <button onClick={() => {
                if (text.trim() === "") return;

                setTasks([
                    ...tasks,
                    { id: Date.now(), name: text, done: false }
                ]);

                setText("");
            }}>
                Add
            </button>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id} style={{ marginBottom: "8px" }}>
                        <span
                            onClick={() => {
                                setTasks(
                                    tasks.map((t) =>
                                        t.id === task.id
                                            ? { ...t, done: !t.done }
                                            : t
                                    )
                                );
                            }}
                            style={{
                                textDecoration: task.done ? "line-through" : "none",
                                cursor: "pointer",
                                marginRight: "10px"
                        }}
                        >
                            {task.name}
                        </span>

                        <button
                            onClick={() =>
                                setTasks(tasks.filter((t) => t.id !== task.id))
                            }
                        >
                            Delete
                        </button>
                    </li>


                ))}
            </ul>
        </div>


    );
}

export default App;
