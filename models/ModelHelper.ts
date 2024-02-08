import { globalValuesObject } from "../helpers/valuesHelper";

export default abstract class ModelHelper {
    public index: number | null;

    protected indexField: string

    constructor() {
        this.indexField = globalValuesObject.indexField;
        this.index = null;
    }

    protected setIndex(reqQuery: any) {
        let reqIndex : any = reqQuery.index;

        if (reqIndex === null || reqIndex == 0) {
            this.index = 0;
        } else if (typeof reqIndex === 'string' && Number(reqIndex) > 0) {
            this.index = Number(reqIndex) * 10;
        }
    }
}