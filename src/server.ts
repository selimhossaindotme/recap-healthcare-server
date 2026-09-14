import { Server } from "http";
import app from "./app.js";
import { envVars } from "./app/config/index.js";


async function startServer() {
    let server: Server;

    try {
        
        server = app.listen(envVars.port, () => {
            console.log('Healthcare Management system backend is running on port 5000');
        })

        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log(' Server  Closed gracefully');
                    process.exit(1);
                })
            }
            else {
                process.exit(1);
            }
        }

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (error) => {
            console.error('Unhandled Promise Rejection Occurred: ', error);
            exitHandler();
        })

    } catch (error) {   
     console.error('Error starting the server:', error);
     process.exit(1);   
    }
}

startServer()