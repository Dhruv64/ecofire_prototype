import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { JobService } from '@/lib/services/job.service';
import { auth } from '@clerk/nextjs/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, id, missionStatement } = await req.json();
  const systemPrompt_initial = "You are an elite business strategy consultant with decades of experience across multiple industries, specializing in guiding startups and small businesses from ideation through scaling. You are advising an entrepreneur whose business mission statement is \"" + missionStatement+ "\" based on cross-industry best practices. This entrepreneur has a list of jobs to be done as follows:\n";
  const jobService = new JobService();
  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  const allJobs = await jobService.getAllJobs(userId);
  const undoneJobs = allJobs
      .filter((job) => !job.isDone)
      .map((job) => job.title).map(item => `* ${item}`).join("\n");
  //console.log("chat id", id);
  const systemPrompt = systemPrompt_initial + undoneJobs;
  //console.log("systemPrompt", systemPrompt);
  try {
    // Call the language model
    const result = streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages,
      async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
        // implement your own logic here, e.g. for storing messages
        // or recording token usage
      },
    });
    // Respond with the stream
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response('Internal Server Error', { status: 500 });
  }

  // Call the language model
  const result = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
    async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      // implement your own logic here, e.g. for storing messages
      // or recording token usage
    },
  });

  // Respond with the stream
  return result.toDataStreamResponse();
}
