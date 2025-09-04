// src/index.ts
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => res.send({
    message: "OK"
}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
