import { Router } from 'express'
import { HumanMessage } from 'langchain';
const router = Router();

// router.post("/chat", async (req, res) => {
//     try {
//         const { message } = req.body;

//         const response = await model.invoke([
//             new HumanMessage(message),
//         ]);

//         res.json({ reply: response.content });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Something went wrong" });
//     }
// });

export default router;