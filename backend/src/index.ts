import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import categoryRoutes from './routes/categories';
import quizRoutes from './routes/quizzes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/quizzes', quizRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'PopQuest API is running!'});
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});