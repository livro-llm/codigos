interface TopicPanelProps {
  className?: string;
}

export default function TopicPanel({ className = "" }: TopicPanelProps) {
  return (
    <aside
      className={`w-80 bg-white dark:bg-black text-black dark:text-white p-4 flex flex-col border-l border-gray-200 dark:border-gray-700 ${className}`}
    >
      <h2 className="font-semibold mb-2">Topic List</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Click the button on the left to save the current conversation as a
        historical topic and start a new conversation.
      </p>
      <button
        className="mt-auto p-2 rounded 
      bg-gray-200 hover:bg-gray-300 text-black 
      dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
      >
        + New Topic
      </button>
    </aside>
  );
}
