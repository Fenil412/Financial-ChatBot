/**
 * Sidebar Component
 * Shows list of conversations and navigation
 */

import { Plus, MessageSquare, Trash2, X } from 'lucide-react';

const Sidebar = ({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onClose,
}) => {

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-30 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200/50
          transform transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold gradient-text">
                  FinChatBot
                </h2>
              </div>
              <button
                onClick={onClose}
                className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* New Chat Button */}
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-semibold transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>New Conversation</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-400 mt-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No conversations yet</p>
                <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`
                      group flex items-center gap-3 p-4 rounded-xl cursor-pointer
                      transition-all duration-200
                      ${
                        currentConversationId === conv._id
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 border-2 border-blue-200 shadow-md'
                          : 'hover:bg-gray-50 text-gray-700 border-2 border-transparent hover:border-gray-200'
                      }
                    `}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      currentConversationId === conv._id 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <MessageSquare className={`w-5 h-5 ${
                        currentConversationId === conv._id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div
                      onClick={() => onSelectChat(conv._id)}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-sm truncate font-semibold">{conv.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(conv.updatedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(conv._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200/50 bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center">
              <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                FinChatBot v2.0
              </p>
              <p className="text-xs text-gray-500 mt-1">Financial AI Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
