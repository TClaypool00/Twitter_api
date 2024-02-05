export function getJSONObject(jsonObject: any) : any {
    let JSONValue = JSON.stringify(jsonObject);

    return JSON.parse(JSONValue);
}