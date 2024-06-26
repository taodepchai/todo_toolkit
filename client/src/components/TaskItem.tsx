import React from "react";
import { Task } from "../interface/types";
import { deleteTask, updateTask } from "../store/reducer/taskSlice";
import store from "../store/store";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const handleToggleComplete = () => {
    store.dispatch(updateTask({ ...task, completed: !task.completed }));
  };

  const handleDelete = () => {
    store.dispatch(deleteTask(task.id));
  };

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggleComplete}
      />
      <span>{task.name}</span>
      <button onClick={handleDelete}>Xóa</button>
    </div>
  );
};

export default TaskItem;
