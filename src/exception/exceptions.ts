import { BaseException } from "../lib/exception";

export class activityDoNotDoException extends BaseException{
    constructor(msg:string){
        super(msg)
    }
}
