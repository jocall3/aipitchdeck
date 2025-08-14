
import React, { useState, useCallback } from 'react';
import { FileInfo } from '../types';

interface FileUploadProps {
  onFileChange: (files: FileInfo[]) => void;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['text/plain', 'application/json', 'text/markdown', 'application/pdf']; // PDF added for type checking, actual content reading might be text only.

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (!files.length) return;

    setFileErrors([]);
    const newProcessedFiles: FileInfo[] = [];
    const currentErrors: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        currentErrors.push(`File "${file.name}" is too large (max ${MAX_FILE_SIZE_MB}MB).`);
        continue;
      }
      // Note: MIME type checking can be unreliable. For simplicity, we mostly rely on extension or user honesty.
      // Actual content type validation for Gemini would happen server-side or via more robust client-side checks if needed.
      // For this example, we focus on reading text from common types. PDFs would typically need a library to extract text,
      // here we'll just pass its name and a placeholder if it's not a text type we can easily read.
      
      try {
        let content = `File content for "${file.name}" (type: ${file.type}):\n`;
        if (file.type === 'text/plain' || file.type === 'application/json' || file.type === 'text/markdown') {
          content += await file.text();
        } else if (file.type === 'application/pdf') {
          // Simplified: In a real app, you might use a library like pdf.js or inform the user to paste text.
          // For now, we'll just indicate it's a PDF and maybe Gemini can be told to infer based on title/context.
          // Or, better, ask the user to provide a summary or text content.
          // For this exercise, Gemini will receive the filename and this placeholder note.
          content += `[PDF Content not directly readable in browser. Consider summarizing or extracting text manually if needed for AI processing.]`;
        } else {
           content += `[Unsupported file type: ${file.type}. Content not extracted.]`;
        }
        
        newProcessedFiles.push({
          name: file.name,
          type: file.type,
          content: content,
        });
      } catch (err) {
        console.error("Error reading file:", file.name, err);
        currentErrors.push(`Error reading file "${file.name}".`);
      }
    }
    
    setSelectedFiles(files); // Keep track of File objects for display if needed
    onFileChange(newProcessedFiles); // Pass processed FileInfo objects
    if (currentErrors.length > 0) {
      setFileErrors(currentErrors);
    }

  }, [onFileChange]);

  const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );

  return (
    <div className="space-y-3">
      <label className="block w-full">
        <span className="sr-only">Choose files</span>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          accept=".txt,.json,.md,.pdf" // Guide user, but validation is key
          className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-indigo-50 hover:file:bg-indigo-700 transition-colors cursor-pointer"
        />
      </label>
      {fileErrors.length > 0 && (
        <div className="mt-2 space-y-1">
          {fileErrors.map((err, idx) => (
            <p key={idx} className="text-xs text-red-400">{err}</p>
          ))}
        </div>
      )}
      {selectedFiles.length > 0 && (
        <div className="mt-2 text-sm text-slate-300">
          <p className="font-medium">Selected files:</p>
          <ul className="list-disc list-inside ml-4">
            {selectedFiles.map(file => (
              <li key={file.name} className="truncate" title={file.name}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
    