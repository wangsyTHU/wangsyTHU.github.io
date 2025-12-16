'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title = 'News' }: NewsProps) {
    const safeItems = Array.isArray(items) ? items : [];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div className="space-y-3">
                {safeItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="text-sm font-medium text-neutral-500 mt-1 w-20 flex-shrink-0">{item.date}</span>
                        <div className="text-base text-neutral-800 dark:text-neutral-200">
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="m-0">{children}</p>,
                                    strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                                    em: ({ children }) => <em className="italic text-neutral-600">{children}</em>,
                                }}
                            >
                                {item.content || ''}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
