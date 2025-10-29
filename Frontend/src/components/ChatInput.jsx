/**
 * Chat Input Component
 * Input field for sending messages and uploading files
 */

import { useState } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

const ChatInput = ({ input, setInput, onSend, isLoading, onFileUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend();
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleFileUploadClick = () => {
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
      setSelectedFiles([]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg text-sm shadow-sm border border-gray-200"
            >
              <span className="truncate max-w-[150px] text-gray-700">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="hover:text-red-500 transition-colors text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={handleFileUploadClick}
            disabled={isLoading}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Upload {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* File Upload Button */}
        <label className="flex-shrink-0">
          <input
            type="file"
            multiple
            accept=".pdf,.xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />
          <div
            className={`
              p-3 rounded-lg border cursor-pointer
              transition-colors shadow-sm
              ${
                isLoading
                  ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                  : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }
            `}
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </div>
        </label>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your documents..."
            disabled={isLoading}
            rows={1}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400 shadow-sm"
            style={{
              minHeight: '48px',
              maxHeight: '120px',
            }}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex-shrink-0 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </form>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};

export default ChatInput;
