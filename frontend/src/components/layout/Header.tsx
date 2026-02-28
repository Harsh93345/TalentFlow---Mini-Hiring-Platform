import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">TF</span>
            </div>
          <h1 className="text-xl font-semibold text-foreground">TalentFlow</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search candidates, jobs..."
            className="w-80 pl-10"
          />
        </div> */}
        
        <Button variant="outline" size="icon">
          <Bell className="w-4 h-4" />
        </Button>
        
        <Button variant="outline" size="icon">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}