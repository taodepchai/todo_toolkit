import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addTask, fetchTasks } from "../store/reducer/taskSlice";
import store, { RootState } from "../store/store";
import TaskItem from "./TaskItem";
import "./style.scss";

const TodoApp: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [newTaskName, setNewTaskName] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    store.dispatch(fetchTasks());
  }, [store.dispatch]);

  const handleAddTask = () => {
    if (newTaskName.trim() === "") {
      alert("Task name cannot be empty");
      return;
    }
    if (tasks.find((task) => task.name === newTaskName.trim())) {
      alert("Task name already exists");
      return;
    }
    store.dispatch(
      addTask({ id: Date.now(), name: newTaskName, completed: false })
    );
    setNewTaskName("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className="todo-app">
      <div className="input-section">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Nhập tên công việc"
        />
        <button onClick={handleAddTask}>Thêm</button>
      </div>
      <div className="filter-tabs">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Đã hoàn thành
        </button>
        <button
          className={filter === "incomplete" ? "active" : ""}
          onClick={() => setFilter("incomplete")}
        >
          Chưa hoàn thành
        </button>
      </div>
      <div className="task-list">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
