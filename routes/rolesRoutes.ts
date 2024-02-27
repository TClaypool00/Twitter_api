import express from 'express';
import { authenticateAdminRole, authenticateToken } from '../helpers/jwtHelper';
import { getStatus } from '../helpers/globalFunctions';
import Role from '../models/Role';
import { insertRole, roleDescriptionExists, roleExistsById, roleNameExists, updateRole } from '../data_access/roleService';
import { rolesValuesObject } from '../helpers/valuesHelper';
import { roleObject } from '../helpers/modelHelper';

const router = express.Router();

router.post('/', authenticateToken, authenticateAdminRole, async (req, resp) => {
    try {
        let role = new Role();
        role.create(req.body);

        if (role.errors.length > 0) {
            resp.status(400)
            .json(getStatus(role.errors));

            return;
        }

        if (await roleNameExists(role)) {
            resp.status(400)
            .json(getStatus(rolesValuesObject.nameExistsMessage));

            return;
        }

        if (await roleDescriptionExists(role)) {
            resp.status(400)
            .json(getStatus(rolesValuesObject.descriptionExistsMessage));

            return;
        }

        role = await insertRole(role);
        
        resp.status(201)
        .json(getStatus(roleObject(role, rolesValuesObject.createdOKMessage)))

    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

router.put('/:id', authenticateToken, authenticateToken, async (req, resp) => {
    try {
        let role = new Role();
        role.update(req.body, req.params.id);

        if (role.errors.length > 0) {
            resp.status(400)
            .json(getStatus(role.errors));

            return;
        }

        if (!await roleExistsById(role)) {
            resp.status(404)
            .json(getStatus(rolesValuesObject.notFoundMessage));
        }

        if (await roleNameExists(role)) {
            resp.status(400)
            .json(getStatus(rolesValuesObject.nameExistsMessage));

            return;
        }

        if (await roleDescriptionExists(role)) {
            resp.status(400)
            .json(getStatus(rolesValuesObject.descriptionExistsMessage));

            return;
        }

        role = await updateRole(role);

        resp.status(200)
        .json(getStatus(roleObject(role, rolesValuesObject.updatedOKMessage)));


    } catch (error: any) {
        resp.status(500)
        .json(getStatus(error));
    }
});

export default router;