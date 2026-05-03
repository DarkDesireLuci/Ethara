import { Calendar, User, GripVertical } from 'lucide-react';
import './TaskCard.css';

export default function TaskCard({ task, onClick }) {
  const isHighPriority = task.priority === 'High';
  const isMediumPriority = task.priority === 'Medium';
  const isLowPriority = task.priority === 'Low';

  const priorityClass = isHighPriority ? 'badge-high' : isMediumPriority ? 'badge-medium' : 'badge-low';

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const formattedDate = formatDate(task.dueDate);

  return (
    <div className="task-card card" onClick={() => onClick(task)}>
      <div className="task-drag-handle">
        <GripVertical size={14} />
      </div>
      <div className="task-content">
        <div className="task-header">
          <span className={`badge ${priorityClass}`}>{task.priority}</span>
        </div>
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-desc line-clamp-2">{task.description}</p>
        )}
        <div className="task-footer">
          {formattedDate && (
            <div className="task-meta" title="Due Date">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
          )}
          {task.assignee && (
            <div className="task-assignee" title={`Assigned to ${task.assignee.name}`}>
              <div className="assignee-avatar">
                {task.assignee.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          {!task.assignee && (
             <div className="task-assignee unassigned" title="Unassigned">
             <div className="assignee-avatar">
               <User size={12} />
             </div>
           </div>
          )}
        </div>
      </div>
    </div>
  );
}
