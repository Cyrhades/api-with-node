import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

const app = express();

// pour permettre le chargement des variables d'environnement
dotenv.config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' });


// permet de parser le contenu du body des requêtes, 
// l'option extended true permet de parser les objets
app.use(express.urlencoded({ extended: true }));
//--------------------------------------------------------------------
//      Chargement de MongoDB
//--------------------------------------------------------------------
mongoose.connect(
    process.env.MONGODB_URI, 
    {connectTimeoutMS : 3000, socketTimeoutMS: 20000, useNewUrlParser: true, useUnifiedTopology: true }
);

//--------------------------------------------------------------------
//      Chargement des routes liées à l'API
//--------------------------------------------------------------------
import apiRoutes from './api/routes.js';
app.use('/api', apiRoutes);

//--------------------------------------------------------------------
//     Ecoute du serveur HTTP
//--------------------------------------------------------------------
app.listen(process.env.PORT, () => {
    console.log(`Le serveur est démarré : http://localhost:${process.env.PORT}`);
});

export default app;