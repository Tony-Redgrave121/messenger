import ApiError from "../error/ApiError"
import {NextFunction, Request, Response} from "express"
import AuthController from "../controller/authController"

describe('AuthController', () => {
    let controller: AuthController
    let mockAuthService: any
    let mockReq: Partial<Request>
    let mockRes: Partial<Response>
    let mockNext: NextFunction

    beforeEach(() => {
        mockAuthService = {
            registration: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            deleteAccount: jest.fn(),
        }

        controller = new AuthController(mockAuthService)

        mockRes = {
            json: jest.fn(),
            sendStatus: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn(),
        }

        mockNext = jest.fn()
    })

    describe('registration', () => {
        it('should return result and set cookie', async () => {
            const fakeResult = {refreshToken: 'token123', user: {id: 1}}

            mockAuthService.registration.mockResolvedValue(fakeResult)
            mockReq = {
                body: {
                    user_name: 'John',
                    user_email: 'john@example.com',
                    user_password: 'secret',
                    user_bio: 'bio'
                }
            }

            await controller.registration(
                mockReq as Request,
                mockRes as Response,
                mockNext
            )

            expect(mockAuthService.registration).toHaveBeenCalledWith(
                'John',
                'john@example.com',
                'secret',
                'bio',
                undefined
            )
            expect(mockRes.cookie).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(fakeResult)
        })
    })

    describe('login', () => {
        it('should call login service and return result', async () => {
            const fakeResult = {refreshToken: 'token456', user: {id: 2}}

            mockAuthService.login.mockResolvedValue(fakeResult)
            mockReq = {
                body: {
                    user_email: 'john@example.com',
                    user_password: 'secret'
                }
            }

            await controller.login(
                mockReq as Request,
                mockRes as Response,
                mockNext
            )

            expect(mockAuthService.login).toHaveBeenCalledWith('john@example.com', 'secret')
            expect(mockRes.cookie).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(fakeResult)
        })

        it('should not set cookie if result is ApiError', async () => {
            const error = new ApiError(400, 'Invalid credentials')
            mockAuthService.login.mockResolvedValue(error)

            mockReq = {
                body: {
                    user_email: 'bad@example.com',
                    user_password: 'wrong'
                }
            }

            await controller.login(
                mockReq as Request,
                mockRes as Response,
                mockNext
            )

            expect(mockRes.cookie).not.toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(error)
        })
    })

    describe('logout', () => {
        it('should clear cookie and return 204', async () => {
            mockReq = {cookies: {refreshToken: 'refresh123'}}

            await controller.logout(
                mockReq as Request,
                mockRes as Response,
                mockNext
            )

            expect(mockAuthService.logout).toHaveBeenCalledWith('refresh123')
            expect(mockRes.clearCookie).toHaveBeenCalled()
            expect(mockRes.sendStatus).toHaveBeenCalledWith(204)
        })
    })

    describe('deleteAccount', () => {
        it('should call deleteAccount and return 204', async () => {
            mockReq = {
                cookies: {refreshToken: 'refresh123'},
                body: {user_id: 10}
            }

            await controller.deleteAccount(
                mockReq as Request,
                mockRes as Response,
                mockNext
            )

            expect(mockAuthService.deleteAccount).toHaveBeenCalledWith('refresh123', 10)
            expect(mockRes.clearCookie).toHaveBeenCalled()
            expect(mockRes.sendStatus).toHaveBeenCalledWith(204)
        })
    })
})
