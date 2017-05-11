import {PageElement} from './page-element'

export class Page {
    public content:PageElement[];
    public last:boolean;
    public totalElements: number;
    public totalPages: number;
    public size: number;
    public number: number;
    public sort: boolean;
    public first: boolean;
    public numberOfElements: number;
}
