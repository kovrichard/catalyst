/**
 * Dashboard component that renders a centered welcome screen.
 *
 * @returns A JSX element containing a vertically centered heading and subheading with a welcome message and an authentication confirmation.
 */
export default function Dashboard() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="font-bold text-6xl">Welcome here!</h1>
      <h2 className="font-medium text-xl">
        If you see this, you successfully authenticated.
      </h2>
    </div>
  );
}