import { useState } from 'react';
import './App.css';
import { List, Typography, Input, Button, Checkbox, Modal, Select } from 'antd';
import example from "./fileแยก/exampleInfo";
import { formatDate } from './fileแยก/time';
interface Task {
  id: number;
  text: string;
  status: boolean;
  createdAt: number;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(example);
  const [newTask, setNewTask] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [filter, setFilter] = useState<string>('all'); //มี3state unfinish finish all ค่าตั้งต้นเป็น state all(เราเป็นคนกำหนดเอง)

  // Modal states
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [isAddTaskModal, setIsAddTaskModal] = useState<boolean>(false);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        status: false,
        createdAt: Date.now(),
      };
      setTasks([newTaskObj, ...tasks]);
      setNewTask('');
      setIsAddTaskModal(false); // Close modal after adding the task
    }
  };

  const handleDeleteTask = (task: Task) => { // เอาไว้เรียกใช้จากปุ่ม ให้ทำตามeffectด้านล่าง โดยรับข้อมูลจากด้านนอกมาด้วย parameter ถ้าไม่มีบรรทัดถัดไปจะไม่ทำงานเพราะไม่มีtaskให้ใช้
    setTaskToDelete(task);                   //เปลี่ยนค่าให้เป็น task ที่จะลบ จากตอนแรกเป็นnull ก็จะสามารถระบุได้ว่าจะลบตัวไหน
    setIsDeleteModal(true);                  //ไว้แสดง modalตอนกดdelete ..
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {                                              //.filter() ใช้เพื่อเลือกแค่บางรายการจาก array ที่ตรงตามเงื่อนไขที่กำหนด 
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));   //ถ้าตรงตามเงื่อนไขก็จะจับtaskทั้งหมดที่ IDไม่ตรงกับ tasktoDeleteทั้งหมดออกมาเรียงใหม่ ตัวตรงเลยโดนลบ (หยิบ taskที่idไม่่ตรงกับidของtasktodeleteออกมาเรียง)
      setIsDeleteModal(false); //ปิดmordal ให้เลิกแสดงผล
      setTaskToDelete(null);  //resetค่า idกลับมาเพื่อรอรับid ใหม่
    }
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(tasks.map(task =>                                   //map taskออกมา ถ้าtask idตรง ให้คือค่าทุกอย่างของtaskออกมา(...task) แต่เปลี่ยนค่าstatusให้เป็นตรงข้าม ถ้าไม่ตรงคืนtaskปกติออกมา
      task.id === id ? { ...task, status: !task.status } : task  
    ));
  };

  const startEditing = (id: number, text: string) => {         //ปุ่มจะเรียกใช้ตัวนี้ ส่วนด้านล่างจะเป็น effectที่จะเกิดขึ้นเมื่อเรียกปุ่ม
    setEditingTaskId(id);                                      //set id เป็นid ของtaskที่เรากำลังแก้ไข      
    setEditText(text);                                         //set text ในช่องEdit ให้ตรงกับที่เรากำลังแก้ไข
    setIsEditModal(true);                                      //เปิดmordal
  };

  const cancelEditing = () => {
    setIsEditModal(false);
    setEditingTaskId(null);
    setEditText('');                                          //เป็นtextใน modal edit text. พอกด cancelก็จะเปลียนค่าตามบรรทัดนี้
  };

  const saveTaskEdit = () => {
    setTasks(tasks.map(task =>
      task.id === editingTaskId ? { ...task, text: editText } : task
    ));
    setIsEditModal(false);
    setEditingTaskId(null);
    setEditText('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'unfinished') return !task.status;    // เราตั้งค่าของมันไว้ ใน value ของoption
    if (filter === 'finished') return task.status;
    return true; // 'all'
  });

  const handleFilterChange = (value: string) => {        //รับค่าvalueมา แล้ว set valueให้เป็นตามที่เลือก จากonchange ซึ่งจะโดนเรียกเมื่อfilterมีการเปลี่ยนแปลง หรือ onchangeนั่นเอง
    setFilter(value);                                    // เป็นข้อมูล ของoption  บรรทัดนี้ทำหน้าที่ set ให้filterมีค่าตรงกับoption
  };

  return (
    <div className='bg' style={{
      width: '100vw', height: '100vh', backgroundColor: '#f8f9ff',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <div id='big' style={{
        display: 'flex', flexDirection: 'column', height: '100%', width: 1058, justifyContent: 'center', position: 'relative',
        maxHeight: '100vh',
        overflow: 'auto',
      }}>
        <div id='headline' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', fontSize: 60, fontWeight: 'bold', color: '#656479', margin: 20, }}>
          TO DO LIST
        </div>
        <div id='option_bar' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '70.5%' }}>
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <Button
              type="primary"
              onClick={() => setIsAddTaskModal(true)} // Open the Add Task Modal
              style={{height: '50px', width: '130px', borderRadius: 10, fontSize: 21 }}
            >
              Add Task
            </Button>
          </div>
          <div id='filter_bar' style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Select
              defaultValue="all"
              style={{ height: '50px', width: 180, borderRadius: 10, display: 'flex', alignContent: 'flex-start', /*fontSize: 24*/ }}
              onChange={handleFilterChange}
              options={[
                { value: 'all', label: 'All' },
                { value: 'unfinished', label: 'Unfinished' },
                { value: 'finished', label: 'Finished' },
              ]}
            />
          </div>
        </div>
        <div id='main' style={{
          display: 'flex', flexDirection: 'column', backgroundColor: '#ebecf2',
          overflow: 'auto',
          maxHeight: 'calc(100vh - 200px)',
          borderRadius: 15,
          padding: 10,
        }}>
          <List
            bordered
            dataSource={filteredTasks}
            style={{ border: 'none', }}
            renderItem={(item) => (
              <List.Item
                style={{ margin: '15px', background: 'white', borderRadius: 4, }}
                key={item.id}
                actions={[
                  <Button type="link" onClick={() => handleDeleteTask(item)} style={{height: '40px', width: '40px', backgroundColor:'#eeeeee'}}>
                    <img src="./src/fileแยก/bin.svg" style={{ width: '30px', height: '30px' }}/>
                    {/* Delete */}
                  </Button>,
                  <Button type="link" onClick={() => startEditing(item.id, item.text)} style={{height: '40px', width: '40px', backgroundColor:'#eeeeee'}}>
                    <img src="./src/fileแยก/edit.svg" style={{ width: '30px', height: '30px' }}/>
                    {/* Edit */}
                    </Button>
                ]}>
                <div style={{ display: 'flex', alignItems: 'center', height: 50 }}>
                  <Checkbox
                    className='checkbox'
                    checked={item.status}
                    onChange={() => toggleTaskStatus(item.id)}
                    style={{ transform: 'scale(2)' }}
                  />
                  <div style={{ marginLeft: '10px' }}>
                    <Typography.Text
                      style={{
                        textDecoration: item.status ? 'line-through' : 'none',
                        marginLeft: '10px',
                        fontSize: 19,
                      }}
                    >
                      {item.text}
                    </Typography.Text>
                    <Typography.Text
                      type="secondary"
                      style={{
                        display: 'block',
                        // marginTop: '5px',
                        fontSize: '14px',
                        paddingLeft: '10px',
                      }}
                    >
                      {formatDate(item.createdAt)} {/* Use the formatDate function here */}
                      {/* {new Date(item.createdAt).toLocaleString()} */}
                    </Typography.Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* Edit Task Modal */}
      <Modal
        title="Edit Task"
        visible={isEditModal}
        onOk={saveTaskEdit}
        onCancel={cancelEditing}
      >
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
      </Modal>

      {/* Delete Confirmation Modal  */}
      <Modal
        title="Delete Task"
        visible={isDeleteModal}
        onOk={confirmDeleteTask}
        onCancel={() => setIsDeleteModal(false)}
        okText="OK"
        cancelText="Cancel"
        closable={false}
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        title="Add New Task"
        visible={isAddTaskModal}
        onOk={handleAddTask}
        onCancel={() => {setIsAddTaskModal(false);setNewTask("")}}   //ปีกกาใส่เพิ่มสำหรับมีfunction มากกว่าหนึ่งตัว //set new task เอามาลบข้อความในmodalที่ค้างไว้
        okText="Add Task"
        cancelText="Cancel"
      >
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task description"
        />
      </Modal>
    </div>
  );
}

export default App;
