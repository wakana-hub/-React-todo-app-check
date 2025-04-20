import React, { useState } from 'react';
import "./style.css"
import { v4 as uuidv4 } from 'uuid';

type Status = '未着手' | '進行中' | '完了';

type Todo = {
  id: string;
  title: string;
  status: Status;
};


function App() {
  const [newTodo,setNewTodo] = useState<string>(""); 
  const [incompleteTodos,setIncompleteTodos] =useState<Todo[]>([
    { id: uuidv4(), title: "掃除",status: '未着手' },
    { id: uuidv4(), title: "料理" ,status: '未着手'}]); 
  const [completeTodos,setCompleteTodos] = useState<Todo[]>([
    { id: uuidv4(), title: "買い出し" ,status: '完了'},
    { id: uuidv4(), title: "宿題" ,status: '完了'}
  ]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>(""); 
  const [filterStatus, setFilterStatus] = useState<Status | "全て">("全て");

  const handleAddTodo = () => {
    if (newTodo.trim() === "") return;
    const newTask: Todo = { id: uuidv4(), title: newTodo ,status: '未着手'};

    setIncompleteTodos([...incompleteTodos,newTask]);
    setNewTodo("");
  }
  
  const handleCompleteTodo = (id:string)=>{
    const todo = incompleteTodos.find((t) => t.id === id);
    if (!todo) return;
        const updatedTodo = { ...todo, status: '完了' as Status };
    setIncompleteTodos((prevIncompleteTodos) =>prevIncompleteTodos.filter((t) => t.id !== id)); 
    setCompleteTodos((prevCompleteTodos) => [...prevCompleteTodos, updatedTodo]);
    };

  const handleDeleteTodo = (id:string) => {
    setIncompleteTodos(incompleteTodos.filter((t) => t.id !==id));
  }

   const handleUndoTodo = (id: string) => { 
    const todo = completeTodos.find((t) => t.id === id);
    if (!todo) return;
    setCompleteTodos(completeTodos.filter((t) => t.id !== id));
        setIncompleteTodos([...incompleteTodos, todo]);
  };

  const handleEdit = (index: number, todo: string) => {
    setEditIndex(index);
    setEditText(todo);
  };

  const handleSave = (index: number) => {
    const updatedTodos = [...incompleteTodos];
    updatedTodos[index].title = editText;
    setIncompleteTodos(updatedTodos);
    setEditIndex(null);
    setEditText("");
  };
  
  const handleChangeStatus = (id:string, newStatus:Todo["status"]) => {
    setIncompleteTodos(
      incompleteTodos.map((todo) => 
        todo.id === id? {...todo, status:newStatus} : todo)
    )
  };

  const filteredIncompleteTodos = filterStatus === "全て"
  ? incompleteTodos 
  : incompleteTodos.filter(todo => todo.status === filterStatus); 

  return (
    <div className='todo'>
      <input 
        placeholder='TODO入力欄'
        value={newTodo} 
        onChange={(e) => setNewTodo(e.target.value)}
        />
      <button onClick={handleAddTodo} >追加</button>  
      <div className="filter">
        <label>ステータスで絞り込み：</label> 
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Status | "全て")}
        > 
          <option value="全て">全て</option>
          <option value="未着手">未着手</option>
          <option value="進行中">進行中</option>
          <option value="完了">完了</option>
        </select>
      </div>  
      <div className='incompletetodos'>
        <h1 className='title'>- TODOリスト -</h1>
        <ul>
        {filteredIncompleteTodos.map((todo,index)=>(
          <li key={todo.id}> 
           {editIndex === index ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleSave(index)}>保存</button>
                  <button onClick={() => setEditIndex(null)}>キャンセル</button>
                </>
              ) :(
                <>
                    <p className='todo-item'>{todo.title}</p>
                    <select 
                      className='select'
                      value={todo.status}
                      onChange={(e) => handleChangeStatus(todo.id, e.target.value as Todo['status'])}
                       >
                      <option value="未着手">未着手</option>
                      <option value="進行中">進行中</option>
                      <option value="完了">完了</option>
                    </select>  
                    <button  onClick={()=> handleEdit(index, todo.title)}>編集</button>
                    <button  onClick={() => handleCompleteTodo(todo.id)}>完了</button> 
                    <button onClick={() => handleDeleteTodo(todo.id)}>削除</button>
                </>
               )} 
          </li>
        ))}
        </ul>
      </div>
      <div className='completetodos'>  
        <h1 className='title'>- 完了済み -</h1>
        <ul>
        {completeTodos.map((todo,index)=>(
          <li key={index}>
            <p className='todo-item'>{todo.title}</p>
            <button onClick={() => handleUndoTodo(todo.id)}>戻す</button>
          </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
