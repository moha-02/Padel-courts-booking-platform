export default function Button({
  className,
  children,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [x: string]: any;
}) {
  if (className) {
    return (
      <button
        className={`${className}`}
        type="submit"
        {...props}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      className="mt-10 w-full p-3 px-4 text-md bg-gray-900 text-white  rounded-full hover:opacity-80"
      type="submit"
    >
      {children}
    </button>
  );
}
