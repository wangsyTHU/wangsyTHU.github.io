import { notFound } from 'next/navigation';
import { getPageConfig, getMarkdownContent, getBibtexContent } from '@/lib/content';
import { getConfig } from '@/lib/config';
import { parseBibTeX } from '@/lib/bibtexParser';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import ListPage from '@/components/pages/ListPage';
import SectionPage, { ResolvedSection } from '@/components/pages/SectionPage';
import {
    BasePageConfig,
    PublicationPageConfig,
    TextPageConfig,
    CardPageConfig,
    ListPageConfig,
    SectionedPageConfig,
    SectionConfig,
    ListSectionConfig,
    MarkdownSectionConfig,
} from '@/types/page';

import { Metadata } from 'next';

export function generateStaticParams() {
    const config = getConfig();
    return config.navigation
        .filter(nav => nav.type === 'page' && nav.target !== 'about') // 'about' is handled by root page
        .map(nav => ({
            slug: nav.target,
        }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const pageConfig = getPageConfig(slug) as BasePageConfig | null;

    if (!pageConfig) {
        return {};
    }

    return {
        title: pageConfig.title,
        description: pageConfig.description,
    };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pageConfig = getPageConfig(slug) as BasePageConfig | null;

    if (!pageConfig) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {pageConfig.type === 'publication' && (
                <PublicationPage config={pageConfig as PublicationPageConfig} />
            )}
            {pageConfig.type === 'text' && (
                <TextPageWrapper config={pageConfig as TextPageConfig} />
            )}
            {pageConfig.type === 'card' && (
                <CardPage config={pageConfig as CardPageConfig} />
            )}
            {pageConfig.type === 'list' && (
                <ListPage config={pageConfig as ListPageConfig} />
            )}
            {pageConfig.type === 'sectioned' && (
                <SectionPageWrapper config={pageConfig as SectionedPageConfig} />
            )}
        </div>
    );
}

function PublicationPage({ config }: { config: PublicationPageConfig }) {
    const bibtex = getBibtexContent(config.source);
    const publications = parseBibTeX(bibtex);
    return <PublicationsList config={config} publications={publications} />;
}

function TextPageWrapper({ config }: { config: TextPageConfig }) {
    const content = getMarkdownContent(config.source);
    return <TextPage config={config} content={content} />;
}

function resolveSections(sections: SectionConfig[]): ResolvedSection[] {
    return (sections || []).map((section) => {
        if (!section || typeof section !== 'object') {
            return { type: 'markdown', content: '' } as ResolvedSection;
        }
        if (section.type === 'markdown') {
            const markdownSection = section as MarkdownSectionConfig;
            const content = markdownSection.content ?? (markdownSection.source ? getMarkdownContent(markdownSection.source) : '');
            const resolved: ResolvedSection = { ...markdownSection, type: 'markdown', content };
            return resolved;
        }

        if (section.type === 'list') {
            const listSection = section as ListSectionConfig;
            const resolved: ResolvedSection = { ...listSection, type: 'list', items: listSection.items || [] };
            return resolved;
        }

        // Fallback: coerce to markdown with empty content to satisfy type
        return { type: 'markdown', content: '' } as ResolvedSection;
    });
}

function SectionPageWrapper({ config }: { config: SectionedPageConfig }) {
    const sections = resolveSections(config.sections);
    return <SectionPage title={config.title} description={config.description} sections={sections} />;
}
