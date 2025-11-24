import { Gavel, BookOpen, Library } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NavigationBar = () => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Link to="/legislacao">
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-card hover:bg-accent hover:shadow-md transition-all duration-200 px-6 py-6"
        >
          <Gavel className="h-5 w-5" />
          <span className="font-medium">Legislação</span>
        </Button>
      </Link>

      <Link to="/manual">
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-card hover:bg-accent hover:shadow-md transition-all duration-200 px-6 py-6"
        >
          <BookOpen className="h-5 w-5" />
          <span className="font-medium">Manual</span>
        </Button>
      </Link>

      <Link to="/biblioteca-recursos">
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-card hover:bg-accent hover:shadow-md transition-all duration-200 px-6 py-6"
        >
          <Library className="h-5 w-5" />
          <span className="font-medium">Biblioteca de Recursos</span>
        </Button>
      </Link>
    </div>
  );
};

export default NavigationBar;
