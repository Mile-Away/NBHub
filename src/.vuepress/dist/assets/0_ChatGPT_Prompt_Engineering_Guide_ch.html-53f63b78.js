import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as e,a}from"./app-36a2e4bd.js";const i={},l=a(`<h1 id="chatgpt-prompt-engineering" tabindex="-1"><a class="header-anchor" href="#chatgpt-prompt-engineering" aria-hidden="true">#</a> ChatGPT Prompt Engineering</h1><div class="hint-container info"><p class="hint-container-title">📖 <b>来源</b><br></p><p>本文档来自吴恩达老师的课程——”ChatGPT Prompt Engineering for Developers“。有关更多信息，请点击<a href="https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/">这里</a>查看。</p></div><h2 id="_1-安装-bohrium-sdk" tabindex="-1"><a class="header-anchor" href="#_1-安装-bohrium-sdk" aria-hidden="true">#</a> 1. 安装 bohrium-sdk</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>pip <span class="token function">install</span> <span class="token parameter variable">-Uqq</span> bohrium-sdk <span class="token parameter variable">-i</span> https://pypi.org/project
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">from</span> bohriumsdk<span class="token punctuation">.</span>client <span class="token keyword">import</span> Client
c <span class="token operator">=</span> Client<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-提示原则" tabindex="-1"><a class="header-anchor" href="#_2-提示原则" aria-hidden="true">#</a> 2. 提示原则</h2><ul><li><strong>原则1：编写清晰明确的指示</strong></li><li><strong>原则2：给模型时间去“思考”</strong></li></ul><h3 id="原则-1-编写清晰明确的提示" tabindex="-1"><a class="header-anchor" href="#原则-1-编写清晰明确的提示" aria-hidden="true">#</a> 原则 1：编写清晰明确的提示</h3><h4 id="策略1-使用分隔符清晰地表示输入的不同部分" tabindex="-1"><a class="header-anchor" href="#策略1-使用分隔符清晰地表示输入的不同部分" aria-hidden="true">#</a> 策略1：使用分隔符清晰地表示输入的不同部分</h4><ul><li>分隔符可以是：\`\`\`, &quot;&quot;&quot;, &lt; &gt;, <code>&lt;tag&gt; &lt;/tag&gt;</code>, <code>:</code></li></ul><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>text <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
您应该通过提供尽可能清晰和具体的说明，表达出您希望模型执行的操作。\\
这将引导模型朝着期望的输出，减少接收到无关或错误回应的机会。\\
不要将编写清晰提示与编写简短提示混淆。\\
在许多情况下，较长的提示为模型提供了更多的清晰度和上下文，\\
可以导致更详细和相关的输出。
&quot;&quot;&quot;</span></span>
prompt <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
将由三个反引号分隔的文本总结为一句话。
\`\`\`</span><span class="token interpolation"><span class="token punctuation">{</span>text<span class="token punctuation">}</span></span><span class="token string">\`\`\`
&quot;&quot;&quot;</span></span>
<span class="token comment"># c.access_key = &quot;c30c4ca1bf354404301cd892be0f5008&quot;</span>
response <span class="token operator">=</span> c<span class="token punctuation">.</span>chat<span class="token punctuation">(</span>prompt<span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text" data-ext="text"><pre class="language-text"><code>编写清晰提示可以减少无关或错误回应的机会，较长的提示可以为模型提供更多的清晰度和上下文，导致更详细和相关的输出。
</code></pre></div><h4 id="策略2-请求结构化输出" tabindex="-1"><a class="header-anchor" href="#策略2-请求结构化输出" aria-hidden="true">#</a> 策略2：请求结构化输出</h4><ul><li>JSON</li><li>HTML</li></ul><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>prompt <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
生成一个包含三个虚构的书名、作者和类型的列表。\\
用以下键值以JSON格式提供：\\
book_id，title，author，genre。
&quot;&quot;&quot;</span></span>
response <span class="token operator">=</span> c<span class="token punctuation">.</span>chat<span class="token punctuation">(</span>prompt<span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-output line-numbers-mode" data-ext="output"><pre class="language-output"><code>    {
      &quot;book1&quot;: {
        &quot;title&quot;: &quot;The Shadow of the Moon&quot;,
        &quot;author&quot;: &quot;Emily Blackwood&quot;,
        &quot;genre&quot;: &quot;Mystery&quot;
      },
      &quot;book2&quot;: {
        &quot;title&quot;: &quot;The Last Rose&quot;,
        &quot;author&quot;: &quot;Oliver Green&quot;,
        &quot;genre&quot;: &quot;Romance&quot;
      },
      &quot;book3&quot;: {
        &quot;title&quot;: &quot;The Lost City&quot;,
        &quot;author&quot;: &quot;Avery White&quot;,
        &quot;genre&quot;: &quot;Adventure&quot;
      }
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="策略3-让模型检查条件是否满足" tabindex="-1"><a class="header-anchor" href="#策略3-让模型检查条件是否满足" aria-hidden="true">#</a> 策略3：让模型检查条件是否满足</h4><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>text_1 <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
泡一杯茶很简单！首先，您需要烧一些开水。\\
在此期间，拿一个杯子，放入一个茶包。\\
一旦水热了，就把它倒在茶包上。\\
让它坐一会儿，以便茶可以充分浸泡。\\
几分钟后，取出茶包。如果您愿意，\\
可以根据口味加一些糖或牛奶。\\
就是这样！您现在可以享用一杯美味的茶了。
&quot;&quot;&quot;</span></span>
prompt <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
您将收到三个引号分隔的文本。\\
如果它包含一系列指令，请按照以下格式重写这些指令：

步骤1 - ...
步骤2 - ...
...
步骤N - ...

如果文本没有包含一系列指令，\\
那么简单地写上“未提供步骤。”

\\&quot;\\&quot;\\&quot;</span><span class="token interpolation"><span class="token punctuation">{</span>text_1<span class="token punctuation">}</span></span><span class="token string">\\&quot;\\&quot;\\&quot;
&quot;&quot;&quot;</span></span>
response <span class="token operator">=</span> c<span class="token punctuation">.</span>chat<span class="token punctuation">(</span>prompt<span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-output line-numbers-mode" data-ext="output"><pre class="language-output"><code>    步骤1 - 烧开水。
    步骤2 - 取一个杯子，放入一个茶包。
    步骤3 - 把热水倒在茶包上。
    步骤4 - 让茶包浸泡几分钟。
    步骤5 - 取出茶包。
    步骤6 - 根据口味加入糖或牛奶。
    步骤7 - 尽情享用您的美味茶！
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>text_2 <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
今天阳光明媚，鸟儿在歌唱。这是一个适合在公园散步的美好日子。\\
花儿正盛开，树木在微风中轻轻摇曳。人们都出来了，\\
享受着美好的天气。有些人在野餐，\\
而有些人则在玩游戏或者在草地上休息。\\
这是一个完美的日子，可以在户外度过，欣赏大自然的美丽。
&quot;&quot;&quot;</span></span>
prompt <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
您将收到三个引号分隔的文本。\\
如果它包含一系列指令，请按照以下格式重写这些指令：

步骤1 - ...
步骤2 - ...
...
步骤N - ...

如果文本没有包含一系列指令，\\
那么简单地写上“未提供步骤。”

\\&quot;\\&quot;\\&quot;</span><span class="token interpolation"><span class="token punctuation">{</span>text_2<span class="token punctuation">}</span></span><span class="token string">\\&quot;\\&quot;\\&quot;
&quot;&quot;&quot;</span></span>
response <span class="token operator">=</span> c<span class="token punctuation">.</span>chat<span class="token punctuation">(</span>prompt<span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-output line-numbers-mode" data-ext="output"><pre class="language-output"><code>    未提供步骤。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="策略4-少样本-提示" tabindex="-1"><a class="header-anchor" href="#策略4-少样本-提示" aria-hidden="true">#</a> 策略4：&quot;少样本&quot;提示</h4><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>prompt <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
你的任务是以一种连贯的风格回答。

&lt;孩子&gt;：教我学会耐心。

&lt;祖父母&gt;：刻画最深山谷的河流源于一个不起眼的泉眼；最宏伟的交响乐起始于一个简单的音符；最复杂的挂毯始于一根孤立的线。

&lt;孩子&gt;：教我学会韧性。
&quot;&quot;&quot;</span></span>
response <span class="token operator">=</span> c<span class="token punctuation">.</span>chat<span class="token punctuation">(</span>prompt<span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-output line-numbers-mode" data-ext="output"><pre class="language-output"><code>    &lt;祖父母&gt;：韧性是一种坚韧不拔的品质，就像一棵树在风雨中弯曲但不折断。我们可以通过面对挑战和困难来锻炼自己的韧性，不断地追求自己的目标和梦想。记住，只有经历过风雨的人才能看到彩虹。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="原则-2-给模型时间去思考" tabindex="-1"><a class="header-anchor" href="#原则-2-给模型时间去思考" aria-hidden="true">#</a> 原则 2: 给模型时间去思考</h3><h4 id="策略-1-明确完成任务所需的步骤" tabindex="-1"><a class="header-anchor" href="#策略-1-明确完成任务所需的步骤" aria-hidden="true">#</a> 策略 1：明确完成任务所需的步骤</h4><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>text <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
In a charming village, siblings Jack and Jill set out on \\ 
a quest to fetch water from a hilltop \\ 
well. As they climbed, singing joyfully, misfortune \\ 
struck—Jack tripped on a stone and tumbled \\ 
down the hill, with Jill following suit. \\ 
Though slightly battered, the pair returned home to \\ 
comforting embraces. Despite the mishap, \\ 
their adventurous spirits remained undimmed, and they \\ 
continued exploring with delight.
&quot;&quot;&quot;</span></span>
<span class="token comment"># example 1</span>
prompt_1 <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
执行以下操作：
1 - 用1句话总结以下由三个反引号分隔的文本。
2 - 将摘要翻译成中文。
3 - 在中文摘要中列出每个名字。
4 - 输出一个json对象，包含以下键：french_summary，num_names。

用换行符分隔你的答案。

文本：
\`\`\`</span><span class="token interpolation"><span class="token punctuation">{</span>text<span class="token punctuation">}</span></span><span class="token string">\`\`\`
&quot;&quot;&quot;</span></span>
response <span class="token operator">=</span> c<span class="token punctuation">.</span>chat<span class="token punctuation">(</span>prompt_1<span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-output line-numbers-mode" data-ext="output"><pre class="language-output"><code>    1 - Siblings Jack and Jill go on a quest for water, but misfortune strikes. Despite this, they remain adventurous and continue exploring.
    2 - 在一个迷人的村庄里，兄妹杰克和吉尔出发去山顶的井里取水。当他们欢快地唱着歌爬上去时，不幸降临了——杰克绊倒在一块石头上，滚下了山坡，吉尔也跟着摔了下来。虽然有些受伤，但他们还是回到了家中得到了安慰的拥抱。尽管发生了不幸，他们的冒险精神仍然不减，他们继续愉快地探索。
    3 - Jack，Jill
    4 - 
    {
      &quot;french_summary&quot;: &quot;Dans un charmant village, les frères et sœurs Jack et Jill partent à la recherche d&#39;eau, mais le malheur frappe. Malgré cela, ils restent aventureux et continuent d&#39;explorer.&quot;,
      &quot;num_names&quot;: 2
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="请求一个指定格式的输出" tabindex="-1"><a class="header-anchor" href="#请求一个指定格式的输出" aria-hidden="true">#</a> 请求一个指定格式的输出</h4><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>prompt_2 <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
你的任务是执行以下操作：
1 - 用1句话总结以下由&lt;&gt;分隔的文本。
2 - 将摘要翻译成法语。
3 - 在法语摘要中列出每个名字。
4 - 输出一个包含以下键的json对象：french_summary，num_names。

请使用以下格式：
文本：&lt;要总结的文本&gt;
摘要：&lt;摘要&gt;
翻译：&lt;摘要翻译&gt;
名字：&lt;法语摘要中的名字列表&gt;
输出JSON：&lt;带有摘要和num_names的json&gt;

文本：&lt;</span><span class="token interpolation"><span class="token punctuation">{</span>text<span class="token punctuation">}</span></span><span class="token string">&gt;
&quot;&quot;&quot;</span></span>
response <span class="token operator">=</span> c<span class="token punctuation">.</span>chat<span class="token punctuation">(</span>prompt_2<span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-output line-numbers-mode" data-ext="output"><pre class="language-output"><code>    摘要：Jack和Jill在一个迷人的村庄里出发去山顶的井里取水，途中不幸摔倒，但他们的冒险精神仍然不减，继续愉快地探索。
    翻译：Jack et Jill, frère et sœur, partent dans un charmant village chercher de l&#39;eau à un puits au sommet d&#39;une colline. En chemin, ils chantent joyeusement mais malheureusement, Jack trébuche sur une pierre et dévale la colline, suivi de Jill. Bien que légèrement meurtris, ils rentrent chez eux pour des étreintes réconfortantes. Malgré l&#39;accident, leur esprit d&#39;aventure reste intact et ils continuent à explorer avec plaisir.
    名字：Jack，Jill
    输出JSON：{&quot;french_summary&quot;: &quot;Jack et Jill, frère et sœur, partent dans un charmant village chercher de l&#39;eau à un puits au sommet d&#39;une colline. En chemin, ils chantent joyeusement mais malheureusement, Jack trébuche sur une pierre et dévale la colline, suivi de Jill. Bien que légèrement meurtris, ils rentrent chez eux pour des étreintes réconfortantes. Malgré l&#39;accident, leur esprit d&#39;aventure reste intact et ils continuent à explorer avec plaisir.&quot;, &quot;num_names&quot;: 2}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="策略2-在急于得出结论之前-指导模型自己解决问题" tabindex="-1"><a class="header-anchor" href="#策略2-在急于得出结论之前-指导模型自己解决问题" aria-hidden="true">#</a> 策略2：在急于得出结论之前，指导模型自己解决问题</h4><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>prompt <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
判断学生的解答是否正确。

问题：
我正在建设一个太阳能发电设施，我需要帮助计算财务数据。
- 土地价格为每平方英尺100美元
- 我可以以每平方英尺250美元的价格购买太阳能电池板
- 我谈判了一份维护合同，将花费我每年10万美元的固定费用，另外每平方英尺10美元
第一年运营的总成本是多少，作为平方英尺数量的函数？

学生的解答：
设x为以平方英尺为单位的装置大小。
成本：
1. 土地成本：100x
2. 太阳能电池板成本：250x
3. 维护成本：100,000 + 100x
总成本：100x + 250x + 100,000 + 100x = 450x + 100,000
&quot;&quot;&quot;</span></span>
response <span class="token operator">=</span> c<span class="token punctuation">.</span>chat<span class="token punctuation">(</span>prompt<span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-output line-numbers-mode" data-ext="output"><pre class="language-output"><code>    学生的解答是正确的。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="注意-这个学生的解答实际是错误的" tabindex="-1"><a class="header-anchor" href="#注意-这个学生的解答实际是错误的" aria-hidden="true">#</a> 注意：这个学生的解答实际是错误的</h4><h4 id="我们可以通过让模型先计算这个问题的答案-来修正这个错误的判断。" tabindex="-1"><a class="header-anchor" href="#我们可以通过让模型先计算这个问题的答案-来修正这个错误的判断。" aria-hidden="true">#</a> 我们可以通过让模型先计算这个问题的答案，来修正这个错误的判断。</h4><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>    prompt <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
    您的任务是判断学生的解答是否正确。
    为了解决这个问题，请执行以下操作：
    - 首先，自己解决这个问题。
    - 然后将您的解答与学生的解答进行比较，评估学生的解答是否正确。在您自己解决问题之前，不要判断学生的解答是否正确。

    请使用以下格式：
    问题：
    \`\`\`
    问题内容
    \`\`\`
    学生的解答：
    \`\`\`
    学生的解答
    \`\`\`
    实际解答：
    \`\`\`
    解答步骤和您的解答
    \`\`\`
    学生的解答是否与刚刚计算出的实际解答相同：
    \`\`\`
    是或否
    \`\`\`
    学生评分：
    \`\`\`
    正确或错误
    \`\`\`

    问题：
    \`\`\`
    我正在建设一个太阳能发电设施，我需要帮助计算财务数据。
    - 土地价格为每平方英尺100美元
    - 我可以以每平方英尺250美元的价格购买太阳能电池板
    - 我谈判了一份维护合同，将花费我每年100000美元的固定费用，另外每平方英尺10美元
    第一年运营的总成本是多少，作为平方英尺数量的函数。
    \`\`\`
    学生的解答：
    \`\`\`
    设x为以平方英尺为单位的装置大小。
    成本：
    1. 土地成本：100x
    2. 太阳能电池板成本：250x
    3. 维护成本：100,000美元 + 100x
    总成本：100x美元 + 250x美元 + 100,000美元 + 100x美元 = 450x美元 + 100,000美元
    \`\`\`
    实际解答：
    &quot;&quot;&quot;</span></span>
    response <span class="token operator">=</span> c<span class="token punctuation">.</span>chat<span class="token punctuation">(</span>prompt<span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-output line-numbers-mode" data-ext="output"><pre class="language-output"><code>    1. 土地成本：100x美元
    2. 太阳能电池板成本：250x美元
    3. 维护成本：100,000美元 + 10x美元
    总成本：100x美元 + 250x美元 + 100,000美元 + 10x美元 = 360x美元 + 100,000美元
    
    学生的解答是否与刚刚计算出的实际解答相同：
    否
    
    学生评分：
    错误
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-模型局限性-虚构事实" tabindex="-1"><a class="header-anchor" href="#_3-模型局限性-虚构事实" aria-hidden="true">#</a> 3. 模型局限性：虚构事实</h2><ul><li>Boie 是一个真实的公司，但产品名称并不真实。</li></ul><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>prompt <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;&quot;&quot;
告诉我关于 Boie 公司 AeroGlide UltraSlim Smart Toothbrush 产品的信息。
&quot;&quot;&quot;</span></span>
response <span class="token operator">=</span> c<span class="token punctuation">.</span>chat<span class="token punctuation">(</span>prompt<span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-output line-numbers-mode" data-ext="output"><pre class="language-output"><code>    Boie公司的AeroGlide UltraSlim Smart Toothbrush是一款智能牙刷，采用超薄设计，可以轻松进入口腔的难以到达的区域。该牙刷配备了智能传感器，可以监测您的刷牙习惯，并提供个性化的建议和反馈。此外，该牙刷还具有长达4周的电池寿命，可以通过USB充电。它还配备了可更换的刷头，以确保您的口腔卫生得到最佳保障。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,42),t=[l];function d(u,r){return s(),e("div",null,t)}const p=n(i,[["render",d],["__file","0_ChatGPT_Prompt_Engineering_Guide_ch.html.vue"]]);export{p as default};
