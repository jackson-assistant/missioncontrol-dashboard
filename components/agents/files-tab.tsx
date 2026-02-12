"use client";

import { useState, useEffect } from "react";
import { useAgentFiles } from "@/lib/hooks";
import type { WorkspaceFile } from "@/lib/agent-profile-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText, ChevronDown } from "lucide-react";

export function FilesTab({ agentId }: { agentId: string }) {
  const { workspace, files, isLoading } = useAgentFiles(agentId);
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState(false);

  // Auto-select first file when loaded
  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      setSelectedFile(files[0]);
    }
  }, [files, selectedFile]);

  if (isLoading && files.length === 0) {
    return (
      <Panel padding="none" className="flex h-[calc(100vh-280px)] min-h-[400px] overflow-hidden">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        </div>
      </Panel>
    );
  }

  return (
    <Panel padding="none" className="flex h-[calc(100vh-280px)] min-h-[400px] flex-col overflow-hidden md:flex-row">
      {/* File List Sidebar - collapsible on mobile */}
      <div className="flex shrink-0 flex-col border-b border-dashed md:w-[220px] md:border-b-0 md:border-r">
        {/* Header - clickable on mobile to toggle list */}
        <button
          className="flex w-full items-center justify-between border-b border-dashed px-3 py-2.5 md:pointer-events-none"
          onClick={() => setMobileListOpen(!mobileListOpen)}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Workspace Files
            </p>
            <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
              {workspace}/
            </p>
          </div>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform md:hidden ${mobileListOpen ? "rotate-180" : ""}`} />
        </button>

        {/* File list - always visible on desktop, toggle on mobile */}
        <div className={`${mobileListOpen ? "block" : "hidden"} max-h-[200px] overflow-hidden md:block md:flex-1 md:max-h-none`}>
          <ScrollArea className="h-full">
            <div className="p-1.5">
              {files.map((file: WorkspaceFile) => {
                const isSelected = selectedFile?.name === file.name;
                return (
                  <button
                    key={file.name}
                    onClick={() => {
                      setSelectedFile(file);
                      setMobileListOpen(false);
                    }}
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
      </div>

      {/* File Content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {selectedFile ? (
          <>
            <div className="flex flex-col gap-1 border-b border-dashed px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-foreground">
                  {selectedFile.name}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
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
              <pre className="p-4 font-mono text-xs leading-relaxed text-subtle whitespace-pre-wrap break-words md:whitespace-pre">
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
