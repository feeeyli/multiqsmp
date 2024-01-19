'use client';

// Libs Imports
import { useTranslations } from '@/hooks/useTranslations';
import Markdown from 'react-markdown';

// Components Imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

type Q = 0 | 1 | 2 | 3 | 4 | 5;

const q: Q[] = [0, 1, 2, 3, 4, 5];

export const FAQDialog = () => {
  const t = useTranslations('faq-dialog');
  const bt = useTranslations('button-titles');

  return (
    <Dialog>
      <Tooltip title={bt('aside.faq-dialog')}>
        <DialogTrigger asChild>
          <Button className="px-3" size="sm">
            <HelpCircle size="1rem" className="block text-secondary" />
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Accordion type="single" collapsible>
          {q.map((quest) => {
            return (
              <AccordionItem value={'question-' + quest} key={quest}>
                <AccordionTrigger>
                  {t(`faq-list.${quest}.title`)}
                </AccordionTrigger>
                <AccordionContent>
                  <Markdown
                    components={{
                      a(props) {
                        return (
                          <Link
                            href={props.href || '#'}
                            className="text-primary hover:underline"
                            target="_blank"
                          >
                            {props.children}
                          </Link>
                        );
                      },
                    }}
                    className="[&_li_p]:-ml-2 [&_li_p]:inline [&_ul]:list-inside [&_ul]:list-disc"
                  >
                    {t(`faq-list.${quest}.content`)}
                  </Markdown>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
};
/*

*/
