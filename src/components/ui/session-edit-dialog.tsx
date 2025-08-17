import React from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Session, DEFAULT_COMMENT_OPTIONS } from '@/lib/task';
import { useAppStore } from '@/store/app-store';
import { formatDate } from '@/lib/format';
import { X, Save } from 'lucide-react';

interface SessionEditDialogProps {
  session: Session;
  sessionIndex: number;
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SessionEditDialog({ 
  session, 
  sessionIndex, 
  taskId, 
  isOpen, 
  onClose 
}: SessionEditDialogProps) {
  const { editSession } = useAppStore();
  
  const [startDate, setStartDate] = React.useState(() => 
    new Date(session.start).toISOString().slice(0, 16)
  );
  const [endDate, setEndDate] = React.useState(() => 
    session.end ? new Date(session.end).toISOString().slice(0, 16) : ''
  );
  const [comment, setComment] = React.useState(session.comment || '');

  const handleSave = () => {
    const start = new Date(startDate).getTime();
    const end = endDate ? new Date(endDate).getTime() : undefined;
    
    // Validation
    if (start >= Date.now()) {
      alert('Start time cannot be in the future');
      return;
    }
    
    if (end && end <= start) {
      alert('End time must be after start time');
      return;
    }

    const updatedSession: Session = {
      start,
      end,
      comment: comment || undefined,
    };

    editSession(taskId, sessionIndex, updatedSession);
    onClose();
  };

  const handleCommentSelect = (selectedComment: string) => {
    setComment(selectedComment);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Edit Session</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Start Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Time</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium">End Time</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave empty if still running"
            />
            <p className="text-xs text-gray-600">
              Leave empty if the session is still running
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Comment</label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter custom comment or select below"
            />
          </div>

          {/* Predefined Comments */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Comments</label>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_COMMENT_OPTIONS.map((option) => (
                <Button
                  key={option}
                  variant={comment === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCommentSelect(option)}
                  className="text-xs"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Current Values Display */}
          <div className="p-3 bg-gray-50 rounded-md text-xs space-y-1">
            <p><strong>Original:</strong></p>
            <p>Start: {formatDate(new Date(session.start))}</p>
            {session.end && <p>End: {formatDate(new Date(session.end))}</p>}
            {session.comment && <p>Comment: {session.comment}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}