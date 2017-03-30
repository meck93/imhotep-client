import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable()
export class SupplySledService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = environment.apiUrl;
    }

}