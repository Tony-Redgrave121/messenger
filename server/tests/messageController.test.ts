import {NextFunction, Request, Response} from "express"
import MessageController from "../src/controllers/message.controller"

describe('MessageController', () => {
    let controller: MessageController
    let mockMessageService: any
    let mockReq: Partial<Request>
    let mockRes: Partial<Response>
    let mockNext: NextFunction

    beforeEach(() => {
        mockMessageService = {
            fetchMessage: jest.fn(),
            postMessage: jest.fn(),
            deleteMessage: jest.fn(),
        }

        controller = new MessageController(mockMessageService)

        mockRes = {
            json: jest.fn()
        }

        mockNext = jest.fn()
    })

    describe('fetchMessage', () => {
        it('should fetch Message and return it', async () => {
            const fakeMessage = {id: '123', content: 'Hello'}
            mockMessageService.fetchMessage.mockResolvedValue(fakeMessage)

            mockReq = {
                query: {
                    message_id: '123',
                    messenger_id: '456'
                }
            }

            await controller.fetchMessage(mockReq as Request, mockRes as Response, mockNext)

            expect(mockMessageService.fetchMessage).toHaveBeenCalledWith('123', '456')
            expect(mockRes.json).toHaveBeenCalledWith(fakeMessage)
        })
    })

    describe('postMessage', () => {
        it('should post Message and return data', async () => {
            const fakeData = {id: '999', message_text: 'Hi there'}
            mockMessageService.postMessage.mockResolvedValue(fakeData)

            mockReq = {
                body: {
                    user_id: '1',
                    messenger_id: '2',
                    reply_id: null,
                    post_id: null,
                    message_text: 'Hi there',
                    message_type: 'text',
                    recipient_user_id: '3'
                }
            }

            await controller.postMessage(mockReq as Request, mockRes as Response, mockNext)

            expect(mockMessageService.postMessage).toHaveBeenCalledWith(
                {
                    user_id: '1',
                    messenger_id: '2',
                    reply_id: null,
                    post_id: null,
                    message_text: 'Hi there',
                    message_type: 'text',
                    recipient_user_id: '3',
                },
                undefined
            )
            expect(mockRes.json).toHaveBeenCalledWith(fakeData)
        })
    })

    describe('deleteMessage', () => {
        it('should delete Message and return message_id', async () => {
            mockReq = {
                params: {message_id: 'abc123'}
            }

            await controller.deleteMessage(mockReq as Request, mockRes as Response, mockNext)

            expect(mockMessageService.deleteMessage).toHaveBeenCalledWith('abc123')
            expect(mockRes.json).toHaveBeenCalledWith('abc123')
        })
    })
})