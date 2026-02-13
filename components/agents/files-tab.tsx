"use client";

import { useState, useEffect } from "react";
import { useAgentFiles } from "@/lib/hooks";
import type { WorkspaceFile } from "@/lib/agent-profile-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText } from "lucide-react";

export function FilesTab({ agentId }: { agentId: string }) {
  const { workspace, files, isLoading } = useAgentFiles(agentId);
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(null);

  // Auto-select first file when loaded
  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      setSelectedFile(files[0]);
    }
  }, [files, selectedFile]);

  if (isLoading && files.length === 0) {
    return (
      <Panel padding="none" className="flex h-[calc(100vh-280px)] overflow-hidden">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        </div>
      </Panel>
    );
  }

  return (
    <Panel padding="none" className="flex h-[calc(100vh-280px)] overflow-hidden">
      {/* File List Sidebar */}
      <div className="w-[220px] shrink-0 border-r border-dashed">
        <div className="border-b border-dashed px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Workspace Files
          </p>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            {workspace}/
          </p>
        </div>
        <ScrollArea className="h-[calc(100%-52px)]">
          <div className="p-1.5">
            {files.map((file: WorkspaceFile) => {
              const isSelected = selectedFile?.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
                    isSelected
                      ? "bg-muted"
                      : "hover:bg-stone-50 dark:hover:bg-zinc-700/50"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs font-medium ${
                        isSelected ? "text-foreground" : "text-dim"
                      }`}
                    >
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {file.size} &middot; {file.lastModified}
                    </p>
                  </div>
                </button>
              );
            })}
            {files.length === 0 && (
              <EmptyState message="No files found" className="py-4" />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* File Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between border-b border-dashed px-4 py-2.5">
              <div>
                <p className="text-xs font-bold text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {selectedFile.path}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{selectedFile.size}</span>
                <span>&middot;</span>
                <span>Modified {selectedFile.lastModified}</span>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <pre className="p-4 font-mono text-xs leading-relaxed text-subtle">
                {selectedFile.content}
              </pre>
            </ScrollArea>
          </>
        ) : (
          <EmptyState message="Select a file to view" className="flex-1" />
        )}
      </div>
    </Panel>
  );
}
