---
title: '一个脑子，装不下'
titleEn: 'One Brain Is Not Enough'
description: '从极简 agent 到多 agent 蜂群，复杂性从未消失——只是换了门牌号。'
descriptionEn: 'From minimalist agents to multi-agent swarms, complexity never disappears — it just moves.'
date: 2026-03-07
tags: ['agent', 'multi-agent', 'context-engineering', 'thinking']
---

<div data-lang="zh">

极简主义赢了。赢了大概半年。

上一篇说，模型变强之后监工下岗了，一份 Markdown 就能指挥一个 agent。轻装上阵，清爽利落。

然后现实追上来了。

不是模型变笨了。是活变大了。同时搜三个数据库、比对两份合同、调四个外部 API，再把结果整合成一份报告——agent 不是不想做，是上下文窗口装不下。

不是聪不聪明的问题。是空间的问题。

## 天花板

Karpathy 说 LLM 是 CPU，上下文窗口是 RAM。这个比喻比表面看起来深得多。

你不可能把硬盘上所有文件同时加载进内存。不是内存不够大的问题——128K、200K、1M，token 数涨得好看——是计算机体系结构六十年前就想明白的事：CPU 处理不过来。上下文窗口也一样。

有人量过这个天花板具体在哪。

2023 年斯坦福做了一组实验，把关键信息放在上下文的不同位置，看模型能不能找到。结果是一条 U 型曲线——开头记得住，结尾记得住，中间那段，系统性地丢。不是偶尔遗漏，是稳定地看不见。关键信息放在正中间时，模型的表现甚至不如闭卷测试。

多出来的不是弹药，是噪音。

还有一个更狠的数字。二十多万次模拟对话的研究显示，多轮交互中模型性能平均下降 39%。不是模型在变笨，是每轮对话往上下文里堆东西，淤泥越积越厚，信号就被埋了。工程经验给了个粗略的刻度：上下文饱和度过四成，性能断崖式下跌。

四成。剩下六成是它假装在读的摆设。

单个 agent 的极简时代，相当于只有一块内存条，所有东西往里塞。塞到四成就开始出错。

天花板怎么破？

等不起。拆。

## 分身

把一个大任务拆成几个小任务，每个交给独立的子 agent。每个子 agent 拥有干净的上下文——一张白纸，没有历史包袱。在自己的空间里搜索、试错、探索，用完即销毁。最后只把浓缩的结果交给主控。

这就是 Anthropic 的 orchestrator-worker 模式。子 agent 用几万个 token 的空间去干脏活，只返回一两千 token 的精华。主控的上下文始终干净。

性能提升 90%。

同一个模型，同样的能力。唯一变了的是上下文的组织方式。

子 agent 做的事，说穿了不是"帮忙干活"。是帮主控过滤噪音。一万个 token 的原始信息经过它的消化，变成两千 token 的信号。搜索即压缩。用隔离换清晰。

这个思路听着耳熟。

操作系统教科书第三章：父进程 fork 出子进程，子进程在独立的地址空间里运行，算完把结果通过 IPC 传回来。父进程的内存不被子进程污染。虚拟内存、页面置换、缓存分层——我们不是在发明新的计算机科学，是在 LLM 层重新推导六十年前的基本原理。

但有一道裂缝。

操作系统的子进程传回数据是无损的。一个字节都不会变。agent 的"传回"是自然语言摘要——子 agent 用一万 token 做了调研，压缩成两千 token 交给主控。信息一定会丢。而且你不知道丢的是哪一块。经典 CS 管理的是比特：精确、可验证、可还原。我们管理的是自然语言：模糊、有歧义、靠语境撑着。

同样的工具箱，管理对象从钢铁换成了流沙。

经典分布式系统的错误率白纸黑字——丢包率、超时率，测得出来。多 agent 系统的错误率本身就是模糊的。你不知道子 agent 的摘要丢了什么，你甚至不知道你不知道。每一次 agent 之间的信息传递，增加的不只是延迟，是歧义。歧义不可测量，不可回滚。

工具箱是现成的。只是这次你拧的不是螺丝，是一团水。

渐进式披露是同一思路的变体。不在开局把所有信息一股脑塞进上下文——像搬家时把全部家当一次性堆进卡车——而是用到什么加载什么。Anthropic 的实际案例：上下文从 15 万 token 压到 2000。省了 98.7%。

不是信息不重要了。是信息出现在错的时间，比没有更糟。

拆，是目前唯一能突破天花板的工程手段。

但拆了之后，新的问题来了。

## 蜂群的代价

到这里你可能觉得答案已经有了：上多 agent 就完事了。

没这么便宜。

Google DeepMind 今年初干了一件狠事——不是又造一个多 agent 框架，而是老老实实拿 180 种配置控制变量跑了个遍。

结论冷得很。

好消息先说。并行可分解的任务——比如同时搜五个数据库再汇总——中心化协调最高提升 80.9%。蜂群在这类场景下确实碾压。

然后是坏消息。顺序推理任务——一步依赖上一步的那种——多 agent 变体性能下降 39% 到 70%。

七成。不是提升。

道理不复杂。顺序推理需要一条连贯的思维链。拆给多个 agent，等于把一根绳子剪成几段分给不同的人各拉各的。每段都拉得很用力，方向早就散了。而且每一刀下去，切的都是自然语言——前面说过，这东西剪一次就变形一次。信息在 agent 之间每传递一手，丢一层语境，添一层歧义。

工具超过 16 个时，协调税不成比例地暴涨。不是工具本身难用，是描述和管理这些工具的上下文太长了——又绕回了老问题：窗口装不下。

最致命的是错误放大。独立并行的多 agent 系统，错误放大 17.2 倍。有中心化 orchestrator 能压到 4.4 倍——好了不少，但仍然是单体的四倍多。

手术刀在对的场景下救命，拿来切面包只会把桌子砍烂。

## 谁来看管主控

蜂群最深的问题不是效率。是信任。

Orchestrator——统管所有子 agent 的主控——自己也是大模型。也会幻觉。

将军看错了地图，士兵越听话，败得越整齐。

加一个评估者 agent 审查主控？评估者也是大模型，也会幻觉。谁来评估评估者？再套一层？每一层都是概率性的，用概率系统审计概率系统，就像拿自己的记忆去验证自己的记忆准不准。永远在系统内部打转。

套娃可以无限套下去。但越套越深，错得越整齐。

这不是工程能力不够。这是逻辑问题。概率系统不能自证可靠，就像一把尺子量不出自己的误差。

怎么办？截断递归。不靠更好的 prompt，不靠更多的 agent。靠概率系统之外的东西：测试、类型系统、沙箱、权限控制、审计日志。通过就是通过，不通过就是不通过。没有"大概率通过"这回事。

套娃的最底层，必须站着一个不会幻觉的东西。一套硬编码的规则，或者一个人。

## 复杂性搬去了哪

回头看这条线：单 agent 有天花板，拆成多 agent 是唯一出路，但多 agent 带来协调税、错误放大、信任困境。

越想越觉得眼熟。

上一篇结尾我说，复杂性从来不会消失，只会被重新安置。LangChain 时代的复杂性住在框架里——五六层 Python 类，700 个集成。极简时代把它赶走了，搬进了 Markdown 文件和规则树。现在多 agent 时代，复杂性又搬家了。

搬去了哪？

MCP 把工具连接标准化了，A2A 让不同框架的 agent 能互相对话——过去那 700 个集成说白了就是 700 个手写的适配器，现在有了开放协议，连接不再是框架的负担，是基础设施。Orchestrator 要制定策略、分配子 agent、管信息的路由和压缩。谁能调用什么、结果要不要审核、出了错怎么兜底——这些问题以前藏在代码里，现在搬进了协议和策略层。

复杂性换了门牌号。没走。

每搬一次家，抽象层往上抬一级。管理的对象从代码逻辑，到信息流，到认知状态，到组织关系。每抬一级，复杂性就变得更难看见。框架代码的复杂性是显性的——行数摆在那里。协议层的复杂性半隐半现。信任层的复杂性几乎不可见。

问题不是在缩小。是在变得更难被发现。

## 第三圈

第一圈：模型弱，重型框架补能力。框架太笨重，崩了。

第二圈：模型强了，极简主义。撑了半年，任务复杂度追上来了。

第三圈正在开始。多 agent、协议标准、规则文件——新的编排体系正在成型。但这次编排的不再是执行逻辑，而是更滑溜的东西：记忆、认知、上下文的边界。

仔细看，每一圈转的都是同一个轴心——我们怎么管理塞给模型的那些文字。框架管的是文字的拼接顺序，极简管的是文字的外置方式，蜂群管的是文字在多个窗口之间的分配和流动。

形式一直在变。问题从来没变。

我有时候想，这种螺旋会不会有尽头。大概不会。只要模型还在吃文字、吐文字，我们就得一直跟这个问题周旋。

下一篇，聊聊这个"文字"本身。

---

*下一篇预告：当一切都是 prompt。*

</div>

<div data-lang="en">

Minimalism won. For about six months.

The last post said: once models got strong enough, the foreman was let go. A single Markdown file could run an agent. Lean, clean, no baggage.

Then reality caught up.

The models didn't get dumber. The work got bigger. Search three databases at once, cross-reference two contracts, call four external APIs, synthesize the results into one report — the agent wasn't unwilling. The context window just couldn't hold it all.

Not a matter of intelligence. A matter of space.

## The Ceiling

Karpathy said the LLM is a CPU and the context window is RAM. That analogy runs deeper than it looks.

You can't load every file on your hard drive into memory at once. Not because memory isn't big enough — 128K, 200K, 1M, the token counts keep climbing — but because it's something computer architecture figured out sixty years ago: the CPU can't keep up. The context window is the same.

Someone measured exactly where this ceiling sits.

In 2023, Stanford ran an experiment: they placed critical information at different positions in the context and watched whether models could find it. The result was a U-shaped curve — strong recall at the start, strong at the end, and the middle? Systematically gone. Not occasional misses — reliably invisible. When key information was placed dead center, models performed worse than on a closed-book test with no context at all.

The extra tokens aren't ammunition. They're noise.

There's a harder number. A study of over 200,000 simulated conversations found that model performance drops an average of 39% across multi-turn interactions. Not because models get dumber — because every turn piles more into the context, silt accumulating until the signal is buried. Engineering experience gives a rough threshold: once context saturation crosses forty percent, performance falls off a cliff.

Forty percent. The other sixty is furniture it pretends to read.

The minimalist era of single agents was like having one stick of RAM and stuffing everything in. Past forty percent, things start breaking.

How do you break through the ceiling?

Can't wait. Split.

## Splitting

Break a large task into smaller ones, each handed to an independent sub-agent. Each sub-agent gets a clean context — a blank page, no history. It searches, experiments, and explores in its own space, then gets discarded. Only the concentrated results go back to the orchestrator.

This is Anthropic's orchestrator-worker pattern. A sub-agent uses tens of thousands of tokens to do the dirty work, then returns only one or two thousand tokens of signal. The orchestrator's context stays clean.

90% performance improvement.

Same model. Same capabilities. The only thing that changed was how the context was organized.

What sub-agents actually do, stripped down, isn't "helping with tasks." It's filtering noise for the orchestrator. Ten thousand tokens of raw information, digested, compressed to two thousand tokens of signal. Search is compression. Isolation for clarity.

The idea sounds familiar.

Operating systems textbook, chapter three: a parent process forks a child process, the child runs in its own address space, completes its work, passes results back through IPC. The parent's memory isn't polluted by the child. Virtual memory, page replacement, cache tiering — we're not inventing new computer science. We're re-deriving sixty-year-old fundamentals at the LLM layer.

But there's a crack in the foundation.

An OS child process returns data losslessly. Not a single byte changes. An agent's "return" is a natural language summary — the sub-agent spent ten thousand tokens on research, compressed it to two thousand for the orchestrator. Information will be lost. And you won't know which parts. Classical CS manages bits: precise, verifiable, reversible. We manage natural language: ambiguous, context-dependent, held together by interpretation.

Same toolkit. The material changed from steel to sand.

Classical distributed systems have error rates in black and white — packet loss, timeouts, measurable. Multi-agent error rates are themselves fuzzy. You don't know what the sub-agent's summary dropped. You don't even know you don't know. Every handoff between agents adds not just latency, but ambiguity. Ambiguity can't be measured. Can't be rolled back.

The toolkit is ready. You're just not tightening screws anymore — you're wringing water.

Progressive disclosure is a variation on the same idea. Instead of loading all information into context at the start — like moving house by dumping everything into the truck at once — load only what you need when you need it. A real Anthropic case: context compressed from 150,000 tokens to 2,000. A 98.7% reduction.

The information didn't stop mattering. It's that information arriving at the wrong time is worse than no information at all.

Splitting is currently the only engineering method that can break through the ceiling.

But after you split, new problems arrive.

## The Cost of the Swarm

By now you might think you have the answer: just add more agents.

Not that simple.

Google DeepMind did something serious earlier this year — not building yet another multi-agent framework, but methodically running 180 configurations with controlled variables.

The conclusions were cold.

Good news first. For parallelizable tasks — searching five databases simultaneously and summarizing — centralized coordination improved performance by up to 80.9%. The swarm genuinely dominates in these scenarios.

Then the bad news. Sequential reasoning tasks — where each step depends on the previous one — showed multi-agent performance drops of 39% to 70%.

Seventy percent. Not an improvement.

The reason isn't complicated. Sequential reasoning requires a continuous chain of thought. Splitting it across multiple agents is like cutting a rope into segments and handing them to different people pulling in different directions. Each segment pulls hard; the direction was lost long ago. And every cut goes through natural language — as established, it deforms a little more each time it's sliced. Every handoff between agents drops a layer of context and adds a layer of ambiguity.

When tools exceed 16, coordination overhead spikes disproportionately. Not because the tools are hard to use — because the context required to describe and manage them gets too long. Back to the old problem: the window can't hold it.

The most devastating finding: error amplification. Independent parallel multi-agent systems amplify errors 17.2 times. A centralized orchestrator can compress that to 4.4 times — much better, but still four times worse than a single agent.

A scalpel saves lives in the right situation. Use it to cut bread and you'll destroy the table.

## Who Watches the Orchestrator

The deepest problem with the swarm isn't efficiency. It's trust.

The orchestrator — the master controlling all sub-agents — is itself a large language model. It can hallucinate too.

If the general misread the map, the more obedient the soldiers, the more uniformly they fail.

Add an evaluator agent to audit the orchestrator? The evaluator is also a language model. It can hallucinate. Who evaluates the evaluator? Add another layer? Every layer is probabilistic — using a probabilistic system to audit a probabilistic system is like using your own memory to verify whether your memory is accurate. You're always spinning inside the system.

The nesting can go infinitely deep. But the deeper the nesting, the more uniformly things fail.

This isn't insufficient engineering. This is a logic problem. A probabilistic system can't verify its own reliability, just as a ruler can't measure its own error.

The solution? Cut the recursion. Not with better prompts, not with more agents. With something outside the probabilistic system: tests, type systems, sandboxes, permission controls, audit logs. Pass or fail. No "probably passes."

At the bottom of the nesting, there must be something that cannot hallucinate. A hardcoded set of rules, or a human.

## Where Did Complexity Go

Trace the line: single agents hit a ceiling, splitting into multiple agents is the only way through, but multi-agents bring coordination overhead, error amplification, and the trust problem.

The more I think about it, the more familiar it looks.

I said at the end of the last post: complexity never disappears, it just gets relocated. The complexity of the LangChain era lived in the framework — five or six layers of Python classes, 700 integrations. The minimalist era drove it out, into Markdown files and rule trees. Now in the multi-agent era, complexity has moved again.

Where did it go?

MCP standardized tool connections. A2A lets agents from different frameworks talk to each other. Those 700 old integrations were just 700 handwritten adapters — now there are open protocols, and connections are infrastructure instead of framework overhead. The orchestrator sets strategy, allocates sub-agents, manages routing and compression of information. Who can call what, whether results need review, how to handle failures — these questions used to hide in code. Now they live in the protocol and policy layer.

Complexity got a new address. It didn't leave.

Every move raises the abstraction layer one level. The object of management shifts from code logic, to information flow, to cognitive state, to organizational relationships. Each level up, complexity becomes harder to see. Code complexity is explicit — line counts are right there. Protocol complexity is half-hidden. Trust-layer complexity is nearly invisible.

The problem isn't shrinking. It's becoming harder to find.

## The Third Loop

First loop: models were weak, heavy frameworks compensated. Frameworks got too rigid, collapsed.

Second loop: models got stronger, minimalism. Held for six months, then task complexity caught up.

The third loop is beginning. Multi-agent, protocol standards, rule files — a new orchestration layer is taking shape. But this time it's not orchestrating execution logic. It's orchestrating something slipperier: memory, cognition, the boundaries of context.

Look closely: every loop turns on the same axis — how we manage the text we feed the model. Frameworks managed how text was assembled. Minimalism managed how text was externalized. Swarms manage how text is distributed and flows across multiple windows.

The form keeps changing. The problem never does.

I sometimes wonder if this spiral has an end. Probably not. As long as models are eating text and producing text, we'll be wrestling with this same question.

Next time: the text itself.

---

*Next: When everything is a prompt.*

</div>
