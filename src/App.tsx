import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Task } from "./types";
import { TaskForm } from "./components/TaskForm";
import { TaskItem } from "./components/TaskItem";
import { CelebrationOverlay } from "./components/CelebrationOverlay";
import { FlyingAnimal } from "./components/FlyingAnimal";
import { shouldReassess, sortTasks, getEffectivePriority } from "./utils/taskUtils";

const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

// List of attention-grabbing animations to cycle through
const ATTENTION_ANIMATIONS = [
  "pulse-active",
  "bounce-active",
  "flash-active",
  "wiggle-active",
  "rubberband-active",
  "jello-active",
  "swing-active",
];

// Weighted animal list: [emoji, weight]
const ANIMAL_DATA: [string, number][] = [
  ["🐱", 30], // Cat
  ["🐶", 30], // Dog
  ["🦊", 10], // Fox
  ["🐧", 5],  // Penguin
  ["🦄", 2],  // Unicorn (ultra rare)
  ["🐸", 8],  // Frog
  ["🐢", 6],  // Turtle
  ["🦉", 6],  // Owl
  ["🦁", 5],  // Lion
  ["🐼", 5],  // Panda
  ["🐨", 5],  // Koala
  ["🦥", 3],  // Sloth
  ["🦔", 3],  // Hedgehog
  ["🦩", 2],  // Flamingo
  ["🦄", 2],  // Unicorn (ultra rare, again for more chance)
];

function getRandomAnimal(isHighPriority: boolean) {
  // If high priority, boost unicorn odds
  const data = ANIMAL_DATA.map(([emoji, weight]) =>
    emoji === "🦄" && isHighPriority ? [emoji, weight + 18] : [emoji, weight]
  );
  const total = data.reduce((sum, [, w]) => sum + (w as number), 0);
  let rand = Math.random() * total;
  for (const [animal, weight] of data) {
    if (rand < (weight as number)) return { animal };
    rand -= (weight as number);
  }
  const [animal] = data[0]; // fallback
  return { animal };
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>(storedTasks);
  const [celebrate, setCelebrate] = useState(false);
  const [flyingAnimal, setFlyingAnimal] = useState<string>("");
  const [showAnimal, setShowAnimal] = useState(false);
  const [attentionTaskIds, setAttentionTaskIds] = useState<number[]>([]);
  const [attentionAnimation, setAttentionAnimation] = useState(ATTENTION_ANIMATIONS[0]);
  const [shakeTaskIds, setShakeTaskIds] = useState<number[]>([]);
  const [animationIndex, setAnimationIndex] = useState(0);

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "done">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      done: false,
    };
    const updatedTasks = sortTasks([...tasks, newTask]);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const markDone = (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: true } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setCelebrate(true);
    // Determine if this is a high priority task
    const completedTask = tasks.find((task) => task.id === id);
    const isHighPriority = completedTask && getEffectivePriority(completedTask) === "high";
    // Pick a random animal and show it
    const { animal } = getRandomAnimal(!!isHighPriority);
    setFlyingAnimal(String(animal));
    setShowAnimal(true);
    setTimeout(() => setCelebrate(false), 2000);
    setTimeout(() => setShowAnimal(false), 2500);
  };

  const removeTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const reassessTasksOrder = () => {
    const updatedTasks = sortTasks(tasks);
    setTasks(updatedTasks);
    localStorage.setItem("lastReassessed", new Date().toISOString());
  };

  useEffect(() => {
    if (shouldReassess()) {
      reassessTasksOrder();
    }

    const interval = setInterval(() => {
      if (shouldReassess()) {
        reassessTasksOrder();
      }
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  useEffect(() => {
    // Cycle through attention animations for high priority tasks every 8 seconds
    const attentionInterval = setInterval(() => {
      setAttentionTaskIds(
        tasks
          .filter(task => !task.done && getEffectivePriority(task) === "high")
          .map(task => task.id)
      );
      // Cycle to the next animation
      setAnimationIndex((prev) => (prev + 1) % ATTENTION_ANIMATIONS.length);
      setTimeout(() => setAttentionTaskIds([]), 2000);
    }, 8000);

    // Shake animation for all undone tasks every 30 seconds
    const shakeInterval = setInterval(() => {
      setShakeTaskIds(
        tasks
          .filter(task => !task.done)
          .map(task => task.id)
      );
      setTimeout(() => setShakeTaskIds([]), 1000);
    }, 30000);

    return () => {
      clearInterval(attentionInterval);
      clearInterval(shakeInterval);
    };
  }, [tasks]);

  // Update the current animation class for attention
  useEffect(() => {
    setAttentionAnimation(ATTENTION_ANIMATIONS[animationIndex]);
  }, [animationIndex]);

  return (
    <div className="container py-4">
      <h1 className="mb-4">To Do List</h1>
      <TaskForm onAddTask={addTask} />
      
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onMarkDone={markDone}
          onRemove={removeTask}
          attentionAnimation={attentionTaskIds.includes(task.id) ? attentionAnimation : ""}
          isShaking={shakeTaskIds.includes(task.id)}
        />
      ))}

      <CelebrationOverlay show={celebrate} />
      <FlyingAnimal animal={flyingAnimal} show={showAnimal} />
    </div>
  );
}
