import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, PlayCircle, FileText, BookOpen, Code } from 'lucide-react';
import type { CourseContent } from '@/types';

interface CourseContentViewerProps {
  contents: CourseContent[];
  completedContents: string[];
  onContentComplete: (contentId: string) => void;
}

export function CourseContentViewer({ contents, completedContents, onContentComplete }: CourseContentViewerProps) {
  const [selectedContent, setSelectedContent] = useState<CourseContent | null>(null);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'document':
        return <BookOpen className="w-4 h-4" />;
      case 'interactive':
        return <Code className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const isContentCompleted = (contentId: string) => completedContents.includes(contentId);

  const handleMarkComplete = () => {
    if (selectedContent && !isContentCompleted(selectedContent.id)) {
      onContentComplete(selectedContent.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Content List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Course Content</CardTitle>
            <CardDescription>
              {completedContents.length} of {contents.length} completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {contents.map((content) => {
              const completed = isContentCompleted(content.id);
              const isSelected = selectedContent?.id === content.id;
              return (
                <button
                  key={content.id}
                  onClick={() => setSelectedContent(content)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getContentIcon(content.type)}
                        <span className="text-sm font-medium truncate">{content.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {content.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{content.duration}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Content Viewer */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>{selectedContent?.title || 'Select content to view'}</span>
              {selectedContent && (
                <Badge variant={isContentCompleted(selectedContent.id) ? 'default' : 'secondary'}>
                  {isContentCompleted(selectedContent.id) ? 'Completed' : 'In Progress'}
                </Badge>
              )}
            </CardTitle>
            {selectedContent?.description && (
              <CardDescription>{selectedContent.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedContent ? (
              <div className="space-y-4">
                {selectedContent.type === 'video' ? (
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={selectedContent.url}
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedContent.title}
                    />
                  </div>
                ) : selectedContent.type === 'article' || selectedContent.type === 'document' ? (
                  <div className="relative w-full" style={{ height: '500px' }}>
                    <iframe
                      src={selectedContent.url}
                      className="w-full h-full rounded-lg border"
                      title={selectedContent.title}
                    />
                  </div>
                ) : selectedContent.type === 'interactive' ? (
                  <div className="relative w-full" style={{ height: '600px' }}>
                    <iframe
                      src={selectedContent.url}
                      className="w-full h-full rounded-lg border"
                      title={selectedContent.title}
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                ) : null}

                {!isContentCompleted(selectedContent.id) && (
                  <Button onClick={handleMarkComplete} className="w-full">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center space-y-2">
                  <PlayCircle className="w-12 h-12 mx-auto opacity-50" />
                  <p>Select a content item to start learning</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
