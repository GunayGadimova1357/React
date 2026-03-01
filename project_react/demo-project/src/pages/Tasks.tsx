import { useTranslation } from "react-i18next";
import { TaskItem } from "@/components/TaskItem";
import useIsMobile from "@/hooks/useIsMobile";

const mockTasks = [
  { id: 1, title: "Finish React project" },
  { id: 2, title: "Write documentation" },
  { id: 3, title: "Learn Firebase basics" },
];

export default function Tasks() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className={`p-6 space-y-4 ${isMobile ? "pb-20" : ""}`}>
      <h1 className="text-2xl font-semibold text-gray-100">
        {t("tasks.title")}
      </h1>

      {mockTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}