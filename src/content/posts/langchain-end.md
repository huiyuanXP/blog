---
title: 'LangChain LangGraph 复杂框架的末路'
titleEn: 'The End of the Road for LangChain and LangGraph'
description: '从重型编排到极简主义，再到 Context Engineering——AI 框架的兴衰揭示了一个更深层的规律。'
descriptionEn: 'From heavy orchestration to minimalism to Context Engineering — the rise and fall of AI frameworks reveals a deeper pattern.'
date: 2026-03-06
tags: ['agent', 'langchain', 'context-engineering', 'thinking']
---

<div data-lang="zh">

你有没有注意到一件事？

打开任何一个 AI 开发社区，搜 LangChain 或 LangGraph——教程停更了，讨论帖沉底了，那些曾经标着"LangChain 最佳实践"的收藏夹链接，点进去是 404。两年前面试必问、项目必用的东西，现在大家绕着走，连吐槽的兴趣都没了。

不是被骂死的，是被无视死的。

但我越想越觉得，这不只是一个框架过气的故事。它暴露了我们一直在犯的一个错误。

## 用确定性约束不确定性

说句公道话，LangChain 在它出现的那个时间点，做的事情是对的。

2022 年底的大模型是真的笨。不是那种"聪明但不听话"的笨，是实打实的能力不足——让它调个函数，输出格式一会儿对一会儿错；让它做多步推理，走到第三步就开始胡说；让它输出个 JSON，三次里能有一次格式正确就谢天谢地了。

在那个阶段，你不用框架约束它，它就是不能用。

LangChain 做的事情本质上是：**用确定性的工作流去约束一个不确定的模型**。输出不稳定？加重试。格式不对？加解析器。推理链断了？加检查点。每一步都用代码逻辑钉死，确保就算模型犯了错，整个流程也能兜住。

这不是过度工程，这是当时的刚需。框架充当了一个严格的监工，因为工人确实还不熟练。

LangChain 膨胀到 700 多个集成，抽象层叠了五六层。是复杂，但在模型能力不够的年代，这些复杂性就是生产环境的安全网。

## 不是框架不好了，是模型不需要监工了

转折不是某个发布会上的高光时刻，而是一个安静的过程：模型的输出变得确定了。

GPT-4o 来了，Claude 3.5 来了。这些模型给个 JSON Schema 就能稳定吐结构化数据，不用你写正则去捞。函数调用不再是碰运气，原生就会，而且几乎不出错。重试逻辑？不需要了，因为第一次就对了。

更关键的变化是——模型的理解力到了一个质变的临界点。你给它一份 `CLAUDE.md` 或 `Agent.md`，用自然语言描述它应该做什么、怎么做、边界在哪里，它就真的能理解并执行。不需要代码级的约束，不需要链式的流程编排，一份 Markdown 文档就够了。

这才是 LangChain 消亡的真正原因。不是被竞争对手干掉的，不是被社区骂走的——是它存在的前提条件消失了。你不再需要用确定性的工作流去约束模型，因为模型自己的输出已经足够确定。你不再需要框架来提示模型该干什么，因为模型已经能读懂你的意图了。

监工存在的前提是工人不熟练。工人成长为大师之后，监工就是多余的。

HuggingFace 的 smolagents 只有大约 1000 行代码，做到了 LangChain 几万行做的事——LLM 调用次数还少了 30%。OpenAI 的 Swarm 更极端，连状态持久化都不要，就是最简单的 agent 之间传递上下文。

从"用代码框架教模型怎么做"变成了"用一份文档告诉模型它的工作是什么"。一句话的区别，但整个行业翻了个面。

## 从代码链到信息链

现在开发 AI 应用的人，工作方式已经完全变了。

在 Cursor 里，一个 `.cursorrules` 文件就定义了 AI 的行为边界。在 Claude Code 里，一个 `CLAUDE.md` 就是整个项目的长期记忆。复杂的子 agent？几行 Markdown 声明的 SKILL 文件搞定。MCP 协议让模型直接跟外部数据源对话，不再需要中间层翻译。

Andrej Karpathy 给了一个精准的类比：LLM 是 CPU，上下文窗口是 RAM。

这句话值得停下来想一想。

CPU 本来就会算，你不需要教它怎么计算。工程的活儿在内存管理——什么信息在什么时候加载进 RAM，什么时候该清理，什么该压缩，什么该隔离。

这就是 Context Engineering，上下文工程。

它跟 Prompt Engineering 不是一回事。Prompt 是给演员的台词本，Context 是整个舞台——灯光、道具、其他演员的走位，全算在内。一行 prompt 只定了方向，真正决定 agent 表现的，是你塞给它的整个信息环境。

换句话说，我们从"控制模型的行为"转向了"塑造模型的认知"。不再告诉它怎么走，而是设计它看到的世界——看到什么、看不到什么、先看什么后看什么。

你的 agent 在第三步就忘了自己要干什么？大概率不是模型笨。是你的上下文管理在第二步就已经崩了。

## 复杂性从来不会消失

如果故事在这里结束——"框架死了，极简主义赢了，轻装上阵"——那这篇文章就不用写了。

真实的情况有趣得多。

看看现在正在发生什么。斯坦福和 SambaNova 搞出了 ACE 框架，用 Generator-Reflector-Curator 三个角色组成自我改进循环。换个名字，换套术语，骨子里还是编排系统。MCP 协议让 agent 可以连接任意数据源——但谁来管理这些连接的发现、过滤和路由？渐进式信息披露把上下文分成三层按需加载——这难道不是在做架构设计？

**复杂性从来不会被消除，只会被重新安置。**

过去，LangChain 用 Python 类管理 agent 的执行步骤和 prompt 拼接。现在，Cursor 和 Claude Code 用纯文本规则树管理上下文状态和系统边界。形式变了，手里攥着的问题没变：怎么让一个概率性的系统在复杂任务中保持连贯。

这是一个更根本的矛盾——软件工程追求确定性，而大模型的本质是概率性的。每一代"解决方案"都是在不同的抽象层上尝试调和这个矛盾。LangChain 试图在执行层强加确定性，失败了。Context Engineering 试图在信息层引导确定性，目前看起来好一些，但本质上是同一场战争的新战线。

管理的对象从"代码链"挪到了"信息链"。从管模型的行为，变成了管模型的认知。

## 螺旋上升

历史不走直线。

第一圈：模型弱，重型框架补能力，框架太笨重，崩。
第二圈：模型强了，极简主义，够用一阵子，任务复杂度再次超出。
第三圈正在开始。

当 agent 不再单打独斗，而是组团协作呢？五个、十个 agent 分工合作，上下文怎么共享？信息在传递中怎么防止失真？一个 agent 的轻微偏差，在团队里会不会像传话游戏一样越传越离谱——这就是所谓的"幻觉漂移"，一个小错被放大成系统性崩溃。

这些问题，跟当年 LangChain 试图解决的问题在结构上是同构的。只是抽象层更高了。当年管的是"一个模型的输入输出流"，接下来要管的是"一群智能体的认知状态和协作关系"。

新的编排工具一定会出现。但这次它编排的不再是执行逻辑，而是更滑溜的东西——记忆、认知、上下文的边界。

## 下一个故事

这篇文章有一句话没说完。

我说历史是螺旋上升的。但更准确地说，AI 的历史是一个圈。不只是框架从复杂到简单再到复杂，而是每一次我们觉得"这次不一样了"的时候，同样的结构性矛盾都会换一张脸回来。

Agent teams，蜂群 agent，多智能体协作——这些词正在变热。它们会不会重走 LangChain 的老路？

这是下一篇要聊的事。

---

*下一篇《AI 的历史是个圈》——为什么每一代 AI 工程师都注定要重新发明轮子，以及这件事本身为什么不是坏事。*

</div>

<div data-lang="en">

Have you noticed something?

Open any AI developer community and search for LangChain or LangGraph — tutorials have stopped updating, discussion threads have sunk to the bottom, and those bookmarked links once tagged "LangChain Best Practices" now lead to 404 pages. Something that was a must-know for interviews and a must-have for projects just two years ago — people now avoid it entirely. They've even lost interest in complaining about it.

It wasn't killed by criticism. It was killed by indifference.

But the more I think about it, the more I realize this isn't just a story about a framework falling out of fashion. It exposes a mistake we've been making all along.

## Constraining Uncertainty with Determinism

To be fair, LangChain was doing the right thing at the right time.

Large models in late 2022 were genuinely dumb. Not "smart but disobedient" dumb — genuinely incapable. Ask one to call a function and the output format would be right sometimes, wrong other times. Ask for multi-step reasoning and it would start hallucinating by step three. Ask for JSON output and you'd be lucky if the format was correct one time out of three.

Without a framework to constrain it, the model simply wasn't usable.

What LangChain did was essentially this: **use deterministic workflows to constrain an indeterminate model.** Unstable outputs? Add retries. Wrong format? Add parsers. Broken reasoning chain? Add checkpoints. Every step nailed down with code logic, ensuring the pipeline could catch errors even when the model stumbled.

This wasn't over-engineering. It was a genuine necessity. The framework served as a strict foreman, because the worker genuinely wasn't skilled yet.

LangChain grew to over 700 integrations with five or six layers of abstraction. Complex, yes — but in an era when model capabilities were insufficient, that complexity was the safety net for production environments.

## The Model Didn't Need a Foreman Anymore

The turning point wasn't some flashy moment at a launch event. It was a quiet process: the model's outputs became reliable.

GPT-4o arrived. Claude 3.5 arrived. Give these models a JSON Schema and they'd reliably produce structured data — no regex needed. Function calling wasn't a coin flip anymore; it worked natively, almost flawlessly. Retry logic? Unnecessary, because the first attempt was correct.

The more critical shift was that models crossed a threshold in comprehension. Give one a `CLAUDE.md` or `Agent.md` file describing what it should do, how to do it, and where the boundaries are — in plain natural language — and it would actually understand and execute. No code-level constraints needed, no chain-based orchestration, just a Markdown document.

This is the real reason LangChain died. It wasn't killed by competitors. It wasn't driven away by community backlash. The preconditions for its existence simply vanished. You no longer needed deterministic workflows to constrain the model, because the model's own outputs were already deterministic enough. You no longer needed a framework to tell the model what to do, because the model could now read and understand your intent directly.

A foreman exists because the worker is unskilled. Once the worker becomes a master, the foreman is redundant.

HuggingFace's smolagents achieved what LangChain's tens of thousands of lines did — in roughly 1,000 lines of code, with 30% fewer LLM calls. OpenAI's Swarm was even more extreme, discarding state persistence entirely in favor of the simplest possible pattern for passing context between agents.

From "using code frameworks to teach the model how to work" to "using a document to tell the model what its job is." One sentence of difference, but the entire industry flipped.

## From Chains of Code to Chains of Information

The way people build AI applications has completely changed.

In Cursor, a single `.cursorrules` file defines the AI's behavioral boundaries. In Claude Code, a `CLAUDE.md` file serves as the project's long-term memory. Complex sub-agents? A few lines of Markdown in a SKILL file. The MCP protocol lets models talk directly to external data sources, no middleware translation needed.

Andrej Karpathy offered a precise analogy: the LLM is a CPU, and the context window is RAM.

That's worth pausing to think about.

A CPU already knows how to compute — you don't need to teach it arithmetic. The engineering work is in memory management — what information gets loaded into RAM at what time, when to clear it, what to compress, what to isolate.

That's Context Engineering.

It's not the same thing as Prompt Engineering. A prompt is the actor's script. Context is the entire stage — lighting, props, the blocking of every other actor. A single line of prompt sets the direction, but what truly determines an agent's performance is the entire information environment you feed it.

In other words, we've shifted from "controlling the model's behavior" to "shaping the model's cognition." No longer telling it how to walk, but designing the world it sees — what it can see, what it can't, what it sees first and what it sees later.

Your agent forgot what it was doing at step three? Most likely it's not that the model is dumb. Your context management already collapsed at step two.

## Complexity Never Disappears

If the story ended here — "frameworks died, minimalism won, travel light" — this article wouldn't need to exist.

The reality is far more interesting.

Look at what's happening right now. Stanford and SambaNova created the ACE framework, using a Generator-Reflector-Curator trio to form a self-improving loop. Different name, different jargon, but at its core — still an orchestration system. MCP lets agents connect to any data source — but who manages the discovery, filtering, and routing of those connections? Progressive disclosure splits context into three tiers loaded on demand — isn't that architecture design?

**Complexity is never eliminated. It's only relocated.**

In the past, LangChain used Python classes to manage agent execution steps and prompt assembly. Now, Cursor and Claude Code use plain-text rule trees to manage context state and system boundaries. The form changed; the problem in hand didn't: how to keep a probabilistic system coherent across complex tasks.

This is a more fundamental tension — software engineering seeks determinism, while large models are inherently probabilistic. Each generation of "solutions" attempts to reconcile this tension at a different layer of abstraction. LangChain tried to impose determinism at the execution layer and failed. Context Engineering tries to guide determinism at the information layer — it looks better so far, but it's essentially a new front in the same war.

The object of management moved from "chains of code" to "chains of information." From managing the model's behavior to managing the model's cognition.

## The Spiral

History doesn't move in straight lines.

First loop: models were weak, heavy frameworks compensated, frameworks became too rigid, collapse.
Second loop: models got stronger, minimalism emerged, worked for a while, then task complexity outgrew it again.
The third loop is beginning.

What happens when agents stop working solo and start collaborating? Five, ten agents dividing labor — how do they share context? How do you prevent information from degrading as it passes between them? Could one agent's slight deviation snowball through the team like a game of telephone — this is what's called "hallucination drift," where a small error amplifies into systemic collapse.

These problems are structurally isomorphic to what LangChain was trying to solve. Just at a higher level of abstraction. Back then it was managing "one model's input-output flow." Next up: managing "the cognitive states and collaborative relationships of a swarm of intelligent agents."

New orchestration tools will inevitably emerge. But this time they won't be orchestrating execution logic — they'll be orchestrating something far more slippery: memory, cognition, the boundaries of context.

## The Next Story

There's a sentence in this article I left unfinished.

I said history spirals upward. But more precisely, the history of AI is a circle. It's not just frameworks going from complex to simple to complex again — it's that every time we think "this time is different," the same structural contradictions come back wearing a new face.

Agent teams, swarm agents, multi-agent collaboration — these terms are heating up. Will they repeat LangChain's journey?

That's what the next post is about.

---

*Next: "The History of AI Is a Circle" — why every generation of AI engineers is destined to reinvent the wheel, and why that's not necessarily a bad thing.*

</div>
