import ModelHelper from '../models/ModelHelper';
import { currentUser } from "../helpers/jwtHelper";

var getAllSql: string;
var getallParams: [any];
var tableLetter: string;
var whereClause: string;

export function generateGetAllSql(model: ModelHelper, table: string, likedSql: string, limitValue: number, dataField: string): void {
    tableLetter = table.charAt(3);
    whereClause = '';
    getAllSql = '';
    getallParams = [''];

    getallParams.splice(0, 1);

    getAllSql = `SELECT ${tableLetter}.*`;
    getAllSql += likedSql;
    if (typeof model.userId !== 'number') {
        getallParams.push(currentUser.userId);
    } else {
        getallParams.push(model.userId);
    }


    getAllSql += `FROM ${table} ${tableLetter}`;


    if (typeof model.search === 'string') {
        whereClause += `${tableLetter}.${dataField} LIKE ?`;
        getallParams.push(model.search);
    }

    if (typeof model.userId === 'number') {
        if (whereClause !== '') {
            whereClause += ' AND ';
        }

        whereClause += `${tableLetter}.user_id = ?`;
        getallParams.push(model.userId);
    }

    if (model.isEdited !== null) {
        if (whereClause !== '') {
            whereClause += ' AND ';
        }

        whereClause += `${tableLetter}.update_date IS NOT NULL`;
    }

    if (whereClause !== '') {
        getAllSql += ' WHERE ';
        getAllSql += whereClause;
    }

    getAllSql += ` LIMIT ? OFFSET ?`;
    getallParams.push(limitValue, model.index);
}

export {
    getAllSql,
    getallParams
}