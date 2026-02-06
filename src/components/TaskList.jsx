import { Droppable, Draggable } from "@hello-pangea/dnd";
import { AnimatePresence, motion } from "framer-motion";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggle, onDelete, onEdit, isDragEnabled }) {
    return (
        <Droppable droppableId="tasks">
            {(provided) => (
                <ul
                    className="task-list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    <AnimatePresence>
                        {tasks.map((task, index) => (
                            <Draggable
                                key={task.id}
                                draggableId={task.id.toString()}
                                index={index}
                                isDragDisabled={!isDragEnabled}
                            >
                                {(provided) => (
                                    <TaskItem
                                        task={task}
                                        onToggle={onToggle}
                                        onDelete={onDelete}
                                        onEdit={onEdit}
                                        innerRef={provided.innerRef}
                                        draggableProps={provided.draggableProps}
                                        dragHandleProps={provided.dragHandleProps}
                                    />
                                )}
                            </Draggable>
                        ))}
                    </AnimatePresence>
                    {provided.placeholder}
                </ul>
            )}
        </Droppable>
    );
}

export default TaskList;
