import { Menu, X, Search, Bell, MessageCircle, Users, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="md:hidden">
      {showSearch ? (
        <div className="flex items-center w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 pr-10"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)} className="ml-1">
            <X className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              TalentIn
            </span>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
              <Search className="w-5 h-5" />
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">John Doe</h3>
                        <p className="text-sm text-muted-foreground">View Profile</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    <nav className="space-y-4">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                        <Users className="w-5 h-5 mr-3" />
                        Network
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                        <TrendingUp className="w-5 h-5 mr-3" />
                        Investments
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                        <Heart className="w-5 h-5 mr-3" />
                        Donations
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                        <MessageCircle className="w-5 h-5 mr-3" />
                        Messages
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                        <Bell className="w-5 h-5 mr-3" />
                        Notifications
                      </Button>
                    </nav>
                  </div>
                  <div className="p-4 border-t">
                    <Button variant="outline" className="w-full">Sign Out</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;