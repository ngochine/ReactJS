import { useState, useMemo, useEffect, useRef } from "react";
import { Button, Input, Pagination } from "antd";
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import "./App.css";

/* Todo interface
  - id: number
  - todo: string
  - completed: boolean
  - createdAt: string
*/

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  "asc" || "desc";
  const [pagination, setPagination] = useState({limit: 10, skip: 0});
  const [total, setTotal] = useState(0)

  useEffect(()=>{
    // console.log(pagination)
    fetch('https://dummyjson.com/todos?limit=' + pagination.limit + '&skip=' + pagination.skip)
    .then(res => res.json())
    .then(data => {
      setTodos(data.todos)
      setTotal(data.total)
    });
  }, [pagination])

  function handleAddTodo() {
    const newTodos = [...todos];
    const maxId = todos.reduce(
      (maxId, currentTodo) => (currentTodo.id > maxId ? currentTodo.id : maxId),
      0,
    );

    newTodos.push({
      id: maxId + 1,
      todo: newTodo,
      completed: false,
      createdAt: new Date().toLocaleString(),
    });

    setTodos(newTodos);
    setNewTodo("");
  }

  function handleInputChange(event) {
    setNewTodo(event.target.value);
  }

  function handleDeleteTodo(id) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  }

  function handleCheckboxChange(id) {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );
    setTodos(newTodos);
    setNewTodo("");
  }

  const sortedTodos = useMemo(() => {
    return [...todos].sort((todo1, todo2) => {
      if (sortDirection === "asc") {
        return new Date(todo1.createdAt) - new Date(todo2.createdAt);
      } else {
        return new Date(todo2.createdAt) - new Date(todo1.createdAt);
      }
    });
  }, [todos, sortDirection]);

  function handleSort() {
    switch (sortDirection) {
      case "asc":
        setSortDirection("desc");
        break;
      case "desc":
        setSortDirection("asc");
        break;
      default:
        break;
    }
  }

  function handleDeleteAll() {
    setTodos([]);
  }
  
  function handlePaginationChange(page, pageSize){
    setPagination({
      ...pagination ,skip: (page-1) * pageSize 
    })
  }

  function handleShowSizeChange(_, size){
    setPagination(p=>({
      limit: size, skip:0
    }))
    console.log(size)
  }

  return (
    <div className="flex flex-col items-center mt-8 gap-8">
      <h1 className="text-3xl font-bold">Todo List</h1>
      <div className="w-[70%] m-auto p-4 border border-neutral-300 shadow-md rounded-lg">
        {sortedTodos.length ? (
          sortedTodos.map((todo, idx) => (
            <div
              key={todo.id}
              className="m-4 p-4 flex justify-between items-center"
            >
              <div className="flex">
                <p>{todo.id}.</p>
                <div className="ml-2">
                  <p className={`${todo.completed && "line-through"}`}>
                    {todo.todo}
                    {todo.completed && (
                      <CheckCircleTwoTone
                        className="ml-2"
                        twoToneColor="#299B43"
                      />
                    )}
                  </p>
                  <p className="text-[12px] text-neutral-500 italic">
                    {todo.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleCheckboxChange(todo.id)}>
                  {todo.completed ? "Mark as Undone" : "Mark as Done"}
                </Button>
                <Button danger onClick={() => handleDeleteTodo(todo.id)}>
                  <DeleteOutlined />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center my-4">No todo left. Well done!</p>
        )}
        <div className="flex justify-center gap-4">
          <Input value={newTodo} type="text" onChange={handleInputChange} />
          <Button disabled={!newTodo.length} onClick={handleAddTodo}>
            Add
          </Button>
        </div>
        <div className="text-center mt-8 flex justify-center gap-4">
          <Button
            icon={
              sortDirection === "asc" ? (
                <SortDescendingOutlined />
              ) : (
                <SortAscendingOutlined />
              )
            }
            onClick={handleSort}
          >
            Sort
          </Button>
          <Button danger onClick={handleDeleteAll}>
            Delete All
          </Button>
        </div>
        <div className="flex justify-center mt-8">
            <Pagination
              pageSize={pagination.limit}
              current={(pagination.skip / pagination.limit) +1}
              
              total={total}
              pageSizeOptions={[10, 20, 50, 100]}
              onChange={handlePaginationChange}
              onShowSizeChange={handleShowSizeChange}
            ></Pagination>
        </div>
      </div>
    </div>
  );
}

export default App;
