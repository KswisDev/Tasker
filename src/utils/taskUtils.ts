import { differenceInDays, isAfter } from "date-fns";
import { Task } from "../types";

export const PRIORITY_COLORS = {
  high: "rgba(255, 0, 0, 0.1)", // High Priority (red)
  medium: "rgba(255, 165, 0, 0.1)", // Medium Priority (orange)
  low: "rgba(0, 255, 0, 0.1)", // Low Priority (green)
  none: "rgba(169, 169, 169, 0.1)", // No Priority (gray)
};

export const getEffectivePriority = (task: Task): string => {
  const now = new Date();
  if (task.done) return "none";
  if (task.date) {
    if (isAfter(now, new Date(task.date))) return "high";
  } else if (differenceInDays(now, new Date(task.createdAt)) > 60) {
    return "high";
  }
  return task.priority || "none";
};

export const shouldReassess = (): boolean => {
  const lastReassessed = localStorage.getItem("lastReassessed");
  const now = new Date();

  if (!lastReassessed) {
    return true;
  }

  return now.getTime() - new Date(lastReassessed).getTime() > 24 * 60 * 60 * 1000;
};

export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const priorityOrder = ["high", "medium", "low", "none"];
    const priorityComparison =
      priorityOrder.indexOf(getEffectivePriority(a)) -
      priorityOrder.indexOf(getEffectivePriority(b));

    if (priorityComparison === 0 && a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    return priorityComparison;
  });
}; 