import getCompletion from '../ai/getCompletion';
import { Task, TaskManager } from './Task';

export async function handleTasks(tasks: Task[]) {
  const taskManager = new TaskManager(tasks);
  return taskManager.run();
}

export async function getTranslatedAnswer(prompt: string) {
  const inputTask = new Task({
    name: 'polish original prompt',
    handler: () => {
      return getCompletion(
        `translate the content in 「」from chinese into english:「${prompt}」, output translated content only`,
      );
    },
  });

  const answerTask = new Task({
    name: 'answer',
    handler: (input) => getCompletion(input[inputTask.id]),
  });

  const outputTask = new Task({
    name: 'transfer original output',
    handler: (input) => {
      return getCompletion(
        `translate the content in 「」 into chinese:「${input[answerTask.id]}」, output translated content only`,
      );
    },
  });

  answerTask.dependsOn(inputTask);
  outputTask.dependsOn(answerTask);

  const result = await handleTasks([inputTask, answerTask, outputTask]);

  return result?.[outputTask.id] ?? 'No output';
}
