import { requiredIsNull, requiredNumberIsNull, valueExceedsLength } from "../helpers/modelHelper";
import { maxLenghValue, maxLengthsObject, notANumberValue, requiredValue, rolesValuesObject } from "../helpers/valuesHelper";
import ModelHelper from "./ModelHelper";

export default class Role extends ModelHelper {
    //#region Private Fields
    private readonly roleIdField: string;
    private readonly roleNameField: string;
    private readonly descriptionField: string;
    //#endregion

    //#region Public Properites
    public roleId: number | undefined | null;
    public roleName: string | undefined | null;
    public description: string | undefined | null;
    //#endregion

    //#region Constructors
    constructor() {
        super();

        this.roleIdField = rolesValuesObject.roleId;
        this.roleNameField = rolesValuesObject.roleName;
        this.descriptionField = rolesValuesObject.description;
    }
    //#endregion

    //#region Public Methods
    public create(reqBody: any): void {
        this.roleName = reqBody.roleName;
        this.description = reqBody.description;

        if (requiredIsNull(this.roleName)) {
            this.errors.push(requiredValue(this.roleNameField));
        } else {
            this.roleName = String(this.roleName);
        }

        if (requiredIsNull(this.description)) {
            this.errors.push(requiredValue(this.descriptionField));
        } else {
            this.description = String(this.description);
        }

        if (typeof this.roleName === 'string' && valueExceedsLength(this.roleName, maxLengthsObject.defaultStringMaxLength)) {
            this.errors.push(maxLenghValue(this.roleNameField, maxLengthsObject.defaultStringMaxLength));
        }

        if (typeof this.description === 'string' && valueExceedsLength(this.description, maxLengthsObject.defaultStringMaxLength)) {
            this.errors.push(maxLenghValue(this.descriptionField, maxLengthsObject.defaultStringMaxLength));
        }
    }

    public update(reqBody: any, id: any) {
        this.create(reqBody);
        this.roleId = id;

        if (requiredNumberIsNull(this.roleId)) {
            this.errors.push(requiredValue(this.roleIdField));
        } else if (isNaN(Number(this.roleId))) {
            this.errors.push(notANumberValue(this.roleIdField));
        }
    }

    public setCreateData(data: any): void {
        this.roleId = Number(data.role_id);
        this.createDate = new Date(String(data.create_date));
        this.setCreateDate();
        this.isEdited = false;
    }

    public setUpdateData(data: any): void {
        this.updateDate = new Date(String(data.update_date));
        this.createDate = new Date(String(data.create_date));
        this.setCreateDate();
        this.isEdited = true;
    }
    //#endregion
}