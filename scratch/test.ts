import { generateAIResponse } from '../backend/services/aiRouter';
import dotenv from 'dotenv';
dotenv.config(); // loads from cwd

async function test() {
  const res = await generateAIResponse({
    task: 'TEST',
    userPrompt: 'Say hello world'
  });
  console.log(res);
}
test();
