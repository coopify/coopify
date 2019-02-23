import * as bodyParser from 'body-parser'
import * as express from 'express'
import { createServer as createHttpServer, Server as httpServer } from 'http'
import { createServer as createHttpsServer, Server as httpsServer } from 'https'
import { router } from './routes'
import { logger, initExternalServices } from './services'
import * as cors from 'cors'
import * as helmet from 'helmet'

export const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: '*/*' }))

//app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
const corsOptions = {
  methods : 'GET,PUT,POST,DELETE,OPTIONS',
  origin: '*',
  allowedHeaders : ['Content-Type', 'Authorization'],
  exposedHeaders : ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions))
app.use('/api', router)
export default async function listen(port: number): Promise<httpServer | httpsServer> {
  const server = createHttpServer(app)
  await initExternalServices()
  server.listen(port)
  logger.info(`Server => Listening on port ${process.env.PORT}`)
  return server
}
