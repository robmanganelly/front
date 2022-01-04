import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class AssetsService{
    assetsUrl = 'http://127.0.0.1:3000'

    constructor() {}

    buildAsset(chunk: string| null | undefined): string{
        if (!chunk){
            return ''
        }
        if (chunk.startsWith(this.assetsUrl)){
            return chunk;
        }
        return `${this.assetsUrl}/${chunk}`
    }

}
