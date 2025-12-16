'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ListItem, SectionConfig } from '@/types/page';

export type ResolvedSection =
    | ({ type: 'markdown'; content: string } & Omit<SectionConfig, 'type' | 'content'>)
    | ({ type: 'list'; items: ListItem[] } & Omit<SectionConfig, 'type' | 'items'>);

interface SectionPageProps {
    title: string;
    description?: string;
    sections: ResolvedSection[];
    embedded?: boolean;
}

export default function SectionPage({ title, description, sections, embedded = false }: SectionPageProps) {
    const safeSections = Array.isArray(sections) ? sections : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={embedded ? "" : "max-w-3xl mx-auto"}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{title}</h1>
                {description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
                        {description}
                    </p>
                )}
            </div>

            <div className="space-y-8">
                {safeSections.map((section, idx) => (
                    <div key={section.id ?? idx} className="space-y-3">
                        {section.title && (
                            <h2 className="text-2xl font-serif font-bold text-primary">{section.title}</h2>
                        )}

                        {section.type === 'markdown' && (
                            <div className="text-neutral-700 dark:text-neutral-200 leading-relaxed">
                                <ReactMarkdown
                                    rehypePlugins={[rehypeRaw]}
                                    skipHtml={false}
                                    components={{
                                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                        ul: ({ children }) => <ul className="list-disc list-outside mb-4 space-y-1 ml-6">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal list-outside mb-4 space-y-1 ml-6">{children}</ol>,
                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-400">{children}</em>,
                                    }}
                                >
                                    {section.content || ''}
                                </ReactMarkdown>
                            </div>
                        )}

                        {section.type === 'list' && (
                            <div className="space-y-4">
                                {(section.items || []).map((item, i) => (
                                    <div key={i} className="flex items-start space-x-3">
                                        <span className="text-sm font-medium text-neutral-500 mt-1 w-36 flex-shrink-0">{item.date}</span>
                                        <div className="text-base text-neutral-800 dark:text-neutral-200">
                                            <ReactMarkdown
                                                rehypePlugins={[rehypeRaw]}
                                                skipHtml={false}
                                                components={{
                                                    p: ({ children }) => <p className="m-0">{children}</p>,
                                                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                                    em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-400">{children}</em>,
                                                }}
                                            >
                                                {item.content || ''}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
