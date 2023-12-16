import ai, { History } from '@/lib/ai';

export function getCompletion(prompt: string) {
  return ai.completion<string>(prompt);
}

export async function getTasks(prompt1: string) {
  const abilities = await formatAbilities();
  const prompt = 'make audio file based on english content';
  let json = await ai.chat<string>(`Abilities: ${abilities}. Task: ${prompt}`, history);

  json = json.replace(/^```(json|)/gi, '');
  json = json.replace(/```$/gi, '');

  return JSON.parse(json);
}

const history: History[] = [
  {
    role: 'user',
    parts:
      'You are coder who is good at planning. I will tell you what abilities i learnt, and tag them with identifier. Then I post a task, you will help me to break it down into a plan, and output a json format answer to show the plan.',
  },
  {
    role: 'model',
    parts: 'Sure, I will see what I can do',
  },
  {
    role: 'user',
    parts: `Abilities: [{"id":"aaa","desc":"translate english into chinese"},{"id":"bbb","desc":"draw a picture based on content in chinese"},{"id":"ccc","desc":"transfer chinese text content into file of mp3 format"}]. Task: draw a picture based on english content`,
  },
  {
    role: 'model',
    parts: '[{"task":"aaa","dependencies":[]},{"task":"bbb","dependencies":["aaa"]}]',
  },
  {
    role: 'user',
    parts:
      'The json you provided is right. You understand to use ability aaa to translate english content into chinese first, then use ability bbb to draw a picture on the translated content. It is smart to realize that ability ccc is irrelevant in this task. And you also did a great job for only outputting a json to indicate the sequence of tasks and dependencies between them.',
  },
  {
    role: 'model',
    parts: 'Thanks. You want to try another task breaking down?',
  },
];

async function formatAbilities() {
  const abilities = [
    {
      id: 'translate',
      desc: 'translate english into chinese',
    },
    {
      id: 'draw',
      desc: 'draw a picture based on content in chinese',
    },
    {
      id: 'speech to text',
      desc: 'transfer chinese text content into file of mp3 format',
    },
  ];

  // TODO 任务处理
  // const abilityTasks = abilities.map(
  //   ({ desc }) => {
  //     return new Task({ name: desc, })
  //   }
  // );

  return JSON.stringify(abilities);
}
