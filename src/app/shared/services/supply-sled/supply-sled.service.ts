import {Injectable} from '@angular/core';

// requests
import {environment} from '../../../../environments/environment';

@Injectable()
export class SupplySledService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = environment.apiUrl;
    }
}
