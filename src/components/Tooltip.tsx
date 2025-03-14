import * as Popover from '@radix-ui/react-popover';
import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <div className="opacity-60 hover:opacity-100 transition-opacity">
          {children}
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="data-[state=open]:data-[side=top]:animate-slideDownAndFade 
                   data-[state=open]:data-[side=right]:animate-slideLeftAndFade 
                   data-[state=open]:data-[side=left]:animate-slideRightAndFade 
                   data-[state=open]:data-[side=bottom]:animate-slideUpAndFade 
                   select-none rounded-lg bg-govuk-blue px-5 py-3 text-sm leading-none 
                   text-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] 
                   will-change-[transform,opacity] z-50 max-w-[300px]"
          sideOffset={5}
          align="center"
        >
          {content}
          <Popover.Arrow className="fill-govuk-blue" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
