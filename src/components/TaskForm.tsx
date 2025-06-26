import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Task } from "../types";

interface TaskFormProps {
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "done">) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newPriority, setNewPriority] = useState("none");

  const handleSubmit = () => {
    if (!newTask.trim()) return;

    onAddTask({
      text: newTask,
      date: newDate,
      priority: newPriority !== "none" ? newPriority : null,
    });

    // Reset form
    setNewTask("");
    setNewDate(null);
    setNewPriority("none");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Form className="mb-4">
        <InputGroup className="mb-2">
          <Form.Control
            placeholder="New task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </InputGroup>
        <div className="mb-2">
          <DatePicker
            label="Pick a date"
            value={newDate ? dayjs(newDate) : null}
            onChange={(date) => setNewDate(date ? date.toDate() : null)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </div>
        <Form.Select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          className="mb-2"
        >
          <option value="none">No Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Form.Select>
        <Button variant="primary" onClick={handleSubmit}>
          Add Task
        </Button>
      </Form>
    </LocalizationProvider>
  );
}; 