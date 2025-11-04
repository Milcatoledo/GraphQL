require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const { createLoaders } = require('./utils/loaders');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (process.env.NODE_ENV !== 'production') return callback(null, true);

        const allowed = [FRONTEND_URL];
        try {
            const urlObj = new URL(origin);
            const originHost = `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? `:${urlObj.port}` : ''}`;
            if (allowed.indexOf(originHost) !== -1) return callback(null, true);
        } catch (e) {
            
        }

        const localhostRegex = /^(https?:\/\/)?(localhost|127\.0\.0\.1|host\.docker\.internal)(:\d+)?$/i;
        if (localhostRegex.test(origin)) return callback(null, true);

        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
};


app.use(cors(corsOptions));
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://toledo:123@mongo:27017/TallerMilca?authSource=admin';

mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000
})
.then(() => console.log('Conectado a MongoDB - Base de datos'))
.catch(e => console.error('Error conexión MongoDB:', e));

const handleValidationError = (error) => {
    const errors = {};
    Object.keys(error.errors).forEach(key => {
        errors[key] = {
            message: error.errors[key].message
        };
    });
    return errors;
};

const { getStats } = require('./utils/usageMonitor');
app.get('/monitor/usage', (req, res) => {
    try {
        res.json(getStats());
    } catch (e) {
        res.status(500).json({ message: 'Error obteniendo estadísticas.' });
    }
});


const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

async function startApollo() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const authHeader = req.headers['authorization'] || '';
            const token = authHeader && authHeader.split(' ')[1];
            let payload = null;
            let authError = null;
            if (!token) {
                authError = 'Token requerido';
            } else {
                try {
                    payload = jwt.verify(token, JWT_SECRET);
                } catch (err) {
                    authError = 'Token inválido';
                    payload = null;
                }
            }
            const loaders = createLoaders();
            try {
                const { incrementGraphql } = require('./utils/usageMonitor');
                let opName = null;
                if (req.body && req.body.operationName) opName = req.body.operationName;
                else if (req.body && req.body.query) {
                    const m = /(?:query|mutation)\s+([A-Za-z0-9_]+)/i.exec(req.body.query);
                    if (m && m[1]) opName = m[1];
                }
                incrementGraphql(opName || 'anonymous');
            } catch (e) {
                
            }

            return { user: payload, loaders, authError };
        }
    });

    await server.start();
    
    server.applyMiddleware({ app, path: '/graphql', cors: corsOptions });
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const HOST = '0.0.0.0';

async function init() {
    try {
        await startApollo();
    
        app.listen(PORT, HOST, () => {
            console.log(`Servidor corriendo en http://${HOST}:${PORT}/`);
        });
    } catch (err) {
        console.error('Error iniciando servidor:', err);
        process.exit(1);
    }
}

init();