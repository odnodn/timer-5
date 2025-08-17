import React from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { DEFAULT_COMMENT_OPTIONS } from '@/lib/task';
import { X } from 'lucide-react';

interface CommentSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (comment: string) => void;
  onStart: () => void;
  lastComment?: string; // Suggest the last used comment
}

export function CommentSelectionDialog({ 
  isOpen, 
  onClose, 
  onSelect, 
  onStart,
  lastComment
}: CommentSelectionDialogProps) {
  const [selectedComment, setSelectedComment] = React.useState<string>('');

  // Set the last comment as selected when dialog opens
  React.useEffect(() => {
    if (isOpen && lastComment && DEFAULT_COMMENT_OPTIONS.includes(lastComment as any)) {
      setSelectedComment(lastComment);
    }
  }, [isOpen, lastComment]);

  const handleCommentSelect = (comment: string) => {
    setSelectedComment(comment);
  };

  const handleStart = () => {
    onSelect(selectedComment);
    onStart();
    onClose();
    setSelectedComment('');
  };

  const handleStartWithoutComment = () => {
    onSelect('');
    onStart();
    onClose();
    setSelectedComment('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Select Session Comment</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {DEFAULT_COMMENT_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={selectedComment === option ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleCommentSelect(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleStartWithoutComment}
            >
              Start without comment
            </Button>
            <Button 
              className="flex-1"
              onClick={handleStart}
              disabled={!selectedComment}
            >
              Start with comment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}