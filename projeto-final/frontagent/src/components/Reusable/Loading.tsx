function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <svg
        className="w-16 h-16 text-blue-600 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 2v4m0 12v4m10-10h-4m-12 0H2m16.243 7.757l-2.828-2.828M6.343 6.343L3.515 3.515m12.728 0l-2.828 2.828M6.343 17.657l-2.828 2.828"
        />
      </svg>
      <span className="text-2xl font-medium text-gray-800 dark:text-white">
        Carregando...
      </span>
    </div>
  );
}

export default Loading;
