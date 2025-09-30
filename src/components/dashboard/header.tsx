import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CrowdCompassLogo } from '@/components/icons';

export function Header() {
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <CrowdCompassLogo className="h-7 w-7 text-primary" />
        <h1 className="font-headline text-2xl font-bold text-foreground">
          CrowdCompass
        </h1>
      </div>
      <div className="ml-auto">
        <Avatar>
          {userAvatar && (
            <AvatarImage 
              src={userAvatar.imageUrl} 
              alt={userAvatar.description} 
              data-ai-hint={userAvatar.imageHint} 
            />
          )}
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
