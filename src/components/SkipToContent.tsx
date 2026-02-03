import { Button } from '@/components/ui/button';

interface SkipToContentProps {
  contentId?: string;
}

const SkipToContent = ({ contentId = 'main-content' }: SkipToContentProps) => {
  const handleSkip = () => {
    const mainContent = document.getElementById(contentId);
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] bg-primary text-primary-foreground"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSkip();
        }
      }}
    >
      Skip to main content
    </Button>
  );
};

export default SkipToContent;
