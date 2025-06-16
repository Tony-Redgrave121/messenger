import ApiError from "../error/ApiError"
import {NextFunction, Request, Response} from "express"
import UserService from "../service/userService"
import ensureRequiredFields from "../shared/validation/ensureRequiredFields";
import validateQueryParams from "../shared/validation/validateQueryParams";

class UserController {
    public getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            ensureRequiredFields([user_id])

            const profile = await UserService.getProfile(user_id)
            res.json(profile)
        } catch (e) {
            next(e)
        }
    };

    public putProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            const {user_name, user_bio} = req.body
            ensureRequiredFields([user_id, user_name])

            const profile = await UserService.putProfile(user_id, user_name, user_bio, req.files)
            res.json(profile)
        } catch (e) {
            next(e)
        }
    };

    public putPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            const {user_password, user_password_new} = req.body
            ensureRequiredFields([user_id, user_password, user_password_new])

            const password = await UserService.putPassword(user_id, user_password, user_password_new)

            res.json(password)
        } catch (e) {
            next(e)
        }
    };

    public getContacts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            ensureRequiredFields([user_id])

            const contacts = await UserService.fetchContacts(user_id)
            res.json(contacts)
        } catch (e) {
            return next(e)
        }
    };

    public postContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            const {contact_id} = req.body
            ensureRequiredFields([user_id, contact_id])

            const contact = await UserService.postContact(user_id, contact_id)
            res.json(contact)
        } catch (e) {
            return next(e)
        }
    };

    public deleteContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            ensureRequiredFields([user_id])

            const validatedData = validateQueryParams(req.query, ['contact_id'])
            if (validatedData instanceof ApiError) return next(validatedData)

            const {contact_id} = validatedData

            await UserService.deleteContact(user_id, contact_id)
            res.sendStatus(200)
        } catch (e) {
            return next(e)
        }
    };
}

export default UserController