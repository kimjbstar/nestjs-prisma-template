import { Session as ExpressSession } from 'express-session'

export type SessionData<ExtendData = {}> = ExpressSession & Partial<ExtendData>
