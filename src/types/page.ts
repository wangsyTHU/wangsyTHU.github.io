export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text' | 'list' | 'sectioned';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface ListItem {
    date: string;
    content: string;
}

export interface ListPageConfig extends BasePageConfig {
    type: 'list';
    items: ListItem[];
}

export interface MarkdownSectionConfig {
    id?: string;
    type: 'markdown';
    title?: string;
    source?: string;
    content?: string;
}

export interface ListSectionConfig {
    id?: string;
    type: 'list';
    title?: string;
    items?: ListItem[];
    source?: string;
}

export type SectionConfig = MarkdownSectionConfig | ListSectionConfig;

export interface SectionedPageConfig extends BasePageConfig {
    type: 'sectioned';
    sections: SectionConfig[];
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}
