import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import router from './app/routes/index.js';
import globalErrorHandlers from './app/middlewares/globalErrorHandlers.js';
import notFound from './app/middlewares/notFound.js';
import cookieParser from 'cookie-parser';

const app : Application = express();

app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true
}))

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1', router )

app.get('/', (req: Request, res: Response) => {
    res.send(
        {
            message: 'Welcome to Healthcare Management System Backend'
        }
    )
})

app.use(globalErrorHandlers);
app.use(notFound);

export default app;