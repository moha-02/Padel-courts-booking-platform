export default function CloseButton({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
