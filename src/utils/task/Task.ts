import { randomUUID } from 'crypto';

export class Task {
  private name: string;
  private options: any;

  public id: string;
  public handler?: (input: Record<string, any>) => any;
  public output: any;
  public dependencies: Task[];

  constructor({
    name,
    handler,
    options,
  }: {
    name: string;
    handler?: (input: Record<string, any>) => any;
    options?: {
      logger: any;
      shouldLog: boolean;
    };
  }) {
    this.id = randomUUID();
    this.name = name;
    this.handler = handler;

    this.dependencies = [];
    this.output = null;

    this.options = Object.assign({ logger: console.log, shouldLog: false }, options);
  }

  async run() {
    this.log(`[Task ${this.name}] start ------`);

    const input = this.getInput();
    this.log(`[Task ${this.name}] input:`, input);

    const output = await this.handler?.(input);
    this.log(`[Task ${this.name}] output:`, output);

    this.output = output;
  }

  log(...args: any) {
    if (this.options?.shouldLog) {
      this.options?.logger(...args);
    }
  }

  getInput() {
    return this.dependencies.reduce((map, dep) => {
      return Object.assign(map, { [dep.id]: dep.output });
    }, {});
  }

  dependsOn(deps: Task | Task[]) {
    if (!Array.isArray(deps)) {
      if (!(deps instanceof Task)) throw new Error('invalid deps');
      deps = [deps];
    }

    const map = formatListToMap(this.dependencies);

    for (const dep of deps) {
      if (map[dep.id]) continue;

      map[dep.id] = dep;
      this.dependencies.push(dep);
    }
  }

  isDependOn(dep: Task) {
    return this.dependencies.includes(dep);
  }
}

export class TaskManager {
  private tasks: Task[] = [];

  constructor(tasks: Task[]) {
    if (!this.validateTasks(tasks)) {
      throw new Error('Invalid relation');
    }

    this.tasks = tasks;
  }

  async run() {
    const queue = this.initializeQueue(this.tasks);

    for (const taskGroup of queue) {
      try {
        await Promise.all(taskGroup.map((task) => task.run()));
      } catch (err) {
        console.log('Group error', err, taskGroup);
        break;
      }
    }

    return this.getOutput(queue);
  }

  getOutput(queue: Task[][]) {
    if (!queue?.length) return null;
    return queue[queue.length - 1].reduce(
      (map, dep) => Object.assign(map, { [dep.id]: dep.output }),
      {} as Record<string, any>,
    );
  }

  addRelation(target: Task, deps: Task[]) {
    const tasks = this.tasks.slice();
    const taskMap = formatListToMap(tasks);

    if (!(target instanceof Task) || !Array.isArray(deps) || deps.includes(target)) {
      throw new Error('invalid relation tot add');
    }

    if (!taskMap[target.id]) {
      tasks.push(target);
    }

    for (const dep of deps) {
      if (taskMap[dep.id]) continue;

      taskMap[dep.id] = dep;
      tasks.push(dep);
    }

    if (!this.validateTasks(tasks)) {
      throw new Error('Invalid relation');
    }

    this.tasks = tasks;
    target.dependsOn(deps);
  }

  initializeQueue(tasks: Task[]) {
    const result = [];
    let remainingTasks = tasks.slice();

    while (remainingTasks.length > 0) {
      const { executableTasks, remainingTasks: rest } = this.splitExecutableTasks(remainingTasks);
      if (!executableTasks?.length) break;

      result.push(executableTasks);
      remainingTasks = rest;
    }

    return result;
  }

  splitExecutableTasks(tasks: Task[]) {
    const executableTasks = [];
    const remainingTasks = [];

    const taskMap = formatListToMap(tasks);

    for (const task of tasks) {
      const noDeps = Boolean(!task.dependencies?.length);
      if (noDeps) {
        executableTasks.push(task);
        continue;
      }

      const allDepsResolvedBefore = task.dependencies.every((dep) => !taskMap[dep.id]);
      if (allDepsResolvedBefore) {
        executableTasks.push(task);
        continue;
      }

      remainingTasks.push(task);
    }

    return { executableTasks, remainingTasks };
  }

  validateTasks(tasks: Task[]) {
    // TODO
    return true;
  }

  showGraph() {
    // TODO
  }
}

function formatListToMap<T>(list: T[], key = 'id' as keyof T) {
  return (
    list?.reduce(
      (map, item) => {
        map[item[key] as unknown as string] = item;
        return map;
      },
      {} as Record<string, T>,
    ) ?? []
  );
}
