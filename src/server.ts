import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Prisma } from '@prisma/client'
import swaggerUi from 'swagger-ui-express'
import { managementRoutes } from './Routes/management.routes'
import { reportRoutes } from './Routes/report.routes'
import { swaggerDocument } from './swagger'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(managementRoutes)
app.use(reportRoutes)

const handleError: express.ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof TypeError || error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: error.message })
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Record not found.' })
    if (error.code === 'P2002') return res.status(409).json({ error: 'Email or code already exists.' })
    if (error.code === 'P2003') return res.status(400).json({ error: 'Related record does not exist.' })
  }
  console.error(error)
  return res.status(500).json({ error: 'Internal server error.' })
}

app.use(handleError)

const port = Number(process.env.PORT || 3000)
app.listen(port, process.env.HOST || '127.0.0.1', () => console.log('Server running at http://localhost:' + port))
