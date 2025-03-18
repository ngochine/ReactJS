import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from 'antd';
import { Input } from 'antd';
import { Checkbox } from "antd";
import { DatePicker } from "antd";

// import dayjs from "dayjs";

/*
id: string
content: string
isDone: boolean
*/

function App() {
  const now= new Date()
  const [presentDate, setPresentDate] = useState(`${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`)
  // const [todos, setTodos] = useState([
  //   { id: 1, content: "hehe", isDone: false, ngayTao: presentDate },
  //   { id: 2, content: "haha", isDone: false, ngayTao: presentDate },
  // ]);
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem("todos")))
  localStorage.setItem("todos", JSON.stringify(todos))

  // const todoss = JSON.parse(localStorage.getItem("todos"))
  // setTodos(todoss)
  const [newTodo, setNewTodo] = useState('');
  const [thongBao, setThongBao] = useState('');
  const [status, setStatus] = useState(false)
  const [arrReset, setArrReset] = useState(todos)

  function addTodo() {
    const newTodos = [...todos];
    const todoMaxId= todos.reduce((a,b)=>b.id > a.id?b:a,{id:0})
    setPresentDate(`${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`)
    // newTodos.push({ id: todos[todos.length-1].id +1 , content: newTodo, isDone: false });
    newTodos.push({ id: todoMaxId.id +1 , content: newTodo, isDone: false, ngayTao: presentDate });
    setTodos(newTodos);
    !todos.length ? setThongBao("") :
    setNewTodo('');
    setArrReset(newTodos)
    // setTodos(todoss)
  }
  
  function handleInputChange(event){
    setNewTodo(event.target.value)
  }

  function deleteTodo(id){
    const newTodos = todos.filter(todo=>
      todo.id!==id
    );
    setTodos(newTodos);
  }

  function handleCheckboxChange(id){
    const newTodos = todos.map(todo=>
        todo.id===id ? {...todo, isDone: !todo.isDone} : todo
    );
    setTodos(newTodos)
  }
  
  function handleSortTodo(status){
    const newTodos= [...todos].sort((todo1, todo2)=>
      status? (todo1.content.length - todo2.content.length): - (todo1.content.length - todo2.content.length)
    )
    setStatus(!status)
    setTodos(newTodos)
  }

  function handleDeleteAll(){
    !todos.length? setThongBao("Không còn gì để xoá") : 
    setTodos([])
  }
  function handleReset(){
    setTodos(arrReset)
  }

  return (
    <div>
      <h1 className="text-center text-3xl font-bold">TODO LIST</h1>
      <p>{thongBao}</p>
      <div className="w-[70%] m-auto p-4 border border-solid border-regal-blue rounded-lg">
        {todos.map((todo, index) => (
          <div className="m-4 p-4 flex justify-between rounded-lg">
            <span className="text-[12px]">{todo.ngayTao}</span>
            <Checkbox onChange={()=> handleCheckboxChange(todo.id)}/>
            <span>
              {todo.id}. {todo.content} {todo.isDone ? "(Đã done)":''}
            </span>
            <Button className="btnDelete" onClick={()=> deleteTodo(todo.id)}>DELETE</Button>
          </div>
        ))}
        <div className="flex justify-center gap-4">
          <Input value={newTodo} type="text" onChange={handleInputChange} />
          <Button disabled={!newTodo.length} onClick={addTodo}>Add</Button>
        </div>
        <div className="text-center mt-8 flex justify-center gap-4">
          <Button onClick={()=>handleSortTodo(status)}>Sắp xếp</Button>
          <Button onClick={handleDeleteAll}>Xoá tất cả</Button>
          <Button onClick={handleReset}>RESET</Button>
        </div>
      </div>

    </div>
  );
}

export default App;
