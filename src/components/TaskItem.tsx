import React from "react";
import { Button, Card } from "react-bootstrap";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import { Task } from "../types";
import { PRIORITY_COLORS, getEffectivePriority } from "../utils/taskUtils";

interface TaskItemProps {
  task: Task;
  onMarkDone: (id: number) => void;
  onRemove: (id: number) => void;
  attentionAnimation?: string;
  isShaking: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onMarkDone,
  onRemove,
  attentionAnimation = "",
  isShaking,
}) => {
  const priority = getEffectivePriority(task);
  const animationClasses = [
    attentionAnimation,
    isShaking ? "shake-active" : "",
  ].filter(Boolean).join(" ");

  return (
    <Card
      className={`mb-2 ${animationClasses}`}
      style={{ backgroundColor: PRIORITY_COLORS[priority] }}
    >
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <h5
            className={
              task.done ? "text-muted text-decoration-line-through" : ""
            }
          >
            {task.text}
          </h5>
          {task.date && (
            <small className="text-muted">
              Due: {dayjs(task.date).format("MMM D, YYYY")}
            </small>
          )}
        </div>
        <div>
          {!task.done && (
            <Button
              variant="outline-success"
              className="me-2"
              onClick={() => onMarkDone(task.id)}
            >
              <FaCheckCircle />
            </Button>
          )}
          <Button
            variant="outline-danger"
            onClick={() => onRemove(task.id)}
          >
            <FaTrash />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}; 