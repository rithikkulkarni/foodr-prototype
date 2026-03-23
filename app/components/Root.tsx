import { Outlet } from 'react-router';

export function Root() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
