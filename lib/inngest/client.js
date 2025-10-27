import { Inngest } from "inngest";
export const inngest = new Inngest({ 
    id: "buget-brain" ,
    name: "Budget Brain",
    retryFunction: async (attempt) => ({
        delay:Math.pow(2, attempt) * 1000,
        maxAttempts:2
    })
});