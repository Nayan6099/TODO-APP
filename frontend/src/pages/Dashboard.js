import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { fetchTasks, addTask, updateTask, deleteTask } from "../api/tasks";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Add task form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [adding, setAdding] = useState(false);

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      const { data } = await fetchTasks();
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks.");
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Task title cannot be empty.");
      return;
    }
    setAdding(true);
    try {
      const { data } = await addTask({ title: newTitle.trim(), description: newDesc.trim() });
      setTasks((prev) => [data, ...prev]);
      setNewTitle("");
      setNewDesc("");
      setShowAddForm(false);
      toast.success("Task added!");
    } catch {
      toast.error("Failed to add task.");
    } finally {
      setAdding(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const { data } = await updateTask(task._id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    } catch {
      toast.error("Failed to update task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted.");
    } catch {
      toast.error("Failed to delete task.");
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }
    try {
      const { data } = await updateTask(id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
      });
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      setEditId(null);
      toast.success("Task updated.");
    } catch {
      toast.error("Failed to update task.");
    }
  };

  const cancelEdit = () => setEditId(null);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loadingTasks) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-large"></div>
        <span>Loading your tasks...</span>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <div className="navbar-logo-icon">✦</div>
            <span className="navbar-title">TaskFlow</span>
          </div>
          <div className="navbar-right">
            <p className="navbar-greeting">
              Hey, <span>{user?.name?.split(" ")[0]}</span>
            </p>
            <button className="btn-logout" onClick={logout}>
              <span>↩</span> Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-value">{tasks.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-value green">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value yellow">{pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="add-task-card">
            <p className="add-task-title">New Task</p>
            <form onSubmit={handleAddTask}>
              <div className="task-inputs">
                <input
                  type="text"
                  className="task-input"
                  placeholder="Task title *"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                />
                <input
                  type="text"
                  className="task-input"
                  placeholder="Description (optional)"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
              <div className="task-form-actions">
                <button type="submit" className="btn-add" disabled={adding}>
                  {adding ? "Adding..." : "Add Task"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTitle("");
                    setNewDesc("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Toolbar */}
        <div className="tasks-toolbar">
          <div className="filter-tabs">
            {["all", "pending", "completed"].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {!showAddForm && (
            <button
              className="btn-new-task"
              onClick={() => setShowAddForm(true)}
            >
              + New Task
            </button>
          )}
        </div>

        {/* Task List */}
        <div className="tasks-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                {filter === "completed" ? "🎯" : filter === "pending" ? "⏳" : "📋"}
              </div>
              <h3>
                {filter === "all"
                  ? "No tasks yet"
                  : `No ${filter} tasks`}
              </h3>
              <p>
                {filter === "all"
                  ? "Click '+ New Task' to get started."
                  : `You have no ${filter} tasks right now.`}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className={`task-card ${task.completed ? "completed" : ""}`}
              >
                {/* Checkbox */}
                <button
                  className={`task-checkbox ${task.completed ? "checked" : ""}`}
                  onClick={() => handleToggleComplete(task)}
                  title={task.completed ? "Mark as pending" : "Mark as done"}
                />

                {/* Body */}
                <div className="task-body">
                  {editId === task._id ? (
                    <>
                      <input
                        className="edit-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Task title"
                        autoFocus
                      />
                      <input
                        className="edit-input"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description (optional)"
                      />
                      <div className="edit-actions">
                        <button className="btn-save" onClick={() => handleSaveEdit(task._id)}>
                          Save
                        </button>
                        <button className="btn-discard" onClick={cancelEdit}>
                          Discard
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={`task-title-text ${task.completed ? "done" : ""}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="task-desc">{task.description}</p>
                      )}
                      <p className="task-meta">Added {formatDate(task.createdAt)}</p>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                {editId !== task._id && (
                  <div className="task-actions">
                    <button
                      className="icon-btn edit"
                      onClick={() => startEdit(task)}
                      title="Edit task"
                    >
                      ✎
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(task._id)}
                      title="Delete task"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
