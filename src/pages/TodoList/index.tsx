import { useEffect, useState } from 'react';
import './index.less';

// Kiểu dữ liệu của 1 todo
interface Todo {
  id: number;
  title: string;
}

const STORAGE_KEY = 'todo_list';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  // Đọc dữ liệu từ localStorage khi component load
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      setTodos(JSON.parse(data));
    }
  }, []);

  // Lưu todo vào localStorage
  const saveToLocalStorage = (list: Todo[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setTodos(list);
  };

  // Thêm mới hoặc cập nhật todo
  const handleAddOrUpdate = () => {
    if (!input.trim()) return;

    // Chỉnh sửa
    if (editId !== null) {
      const newList = todos.map((t) =>
        t.id === editId ? { ...t, title: input } : t
      );
      saveToLocalStorage(newList);
      setEditId(null);
    } else {
      // Thêm mới
      const newTodo: Todo = {
        id: Date.now(),
        title: input,
      };
      saveToLocalStorage([...todos, newTodo]);
    }

    setInput('');
  };

  // Xóa todo
  const handleDelete = (id: number) => {
    const newList = todos.filter((t) => t.id !== id);
    saveToLocalStorage(newList);
  };

  // Bắt đầu chỉnh sửa
  const handleEdit = (todo: Todo) => {
    setInput(todo.title);
    setEditId(todo.id);
  };

  return (
    <div className="todo-container">
      <h2>Todo List</h2>

      <div className="todo-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập công việc..."
        />
        <button onClick={handleAddOrUpdate}>
          {editId ? 'Cập nhật' : 'Thêm'}
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <div className="actions">
              <button className="edit" onClick={() => handleEdit(todo)}>
                Sửa
              </button>
              <button className="delete" onClick={() => handleDelete(todo.id)}>
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
