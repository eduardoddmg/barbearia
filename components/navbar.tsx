import { ModeToggle } from './theme/mode-toggle';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <span className="text-md font-bold">Barbearia</span>
      </div>
      <ModeToggle />
    </nav>
  );
};
