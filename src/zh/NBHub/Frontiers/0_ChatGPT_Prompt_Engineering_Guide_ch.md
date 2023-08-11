# ChatGPT Prompt Engineering

::: info 📖 <b>来源</b><br/>
本文档来自吴恩达老师的课程——”ChatGPT Prompt Engineering for Developers“。有关更多信息，请点击<a href='https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/'>这里</a>查看。
:::

## 1. 安装 bohrium-sdk


```bash
pip install -Uqq bohrium-sdk -i https://pypi.org/project
```

```python
from bohriumsdk.client import Client
c = Client()
```

## 2. 提示原则
- **原则1：编写清晰明确的指示**
- **原则2：给模型时间去“思考”**

### 原则 1：编写清晰明确的提示

#### 策略1：使用分隔符清晰地表示输入的不同部分
- 分隔符可以是：```, """, < >, `<tag> </tag>`, `:`


```python
text = f"""
您应该通过提供尽可能清晰和具体的说明，表达出您希望模型执行的操作。\
这将引导模型朝着期望的输出，减少接收到无关或错误回应的机会。\
不要将编写清晰提示与编写简短提示混淆。\
在许多情况下，较长的提示为模型提供了更多的清晰度和上下文，\
可以导致更详细和相关的输出。
"""
prompt = f"""
将由三个反引号分隔的文本总结为一句话。
```{text}```
"""
# c.access_key = "c30c4ca1bf354404301cd892be0f5008"
response = c.chat(prompt)
print(response)
```

```text:no-line-numbers
编写清晰提示可以减少无关或错误回应的机会，较长的提示可以为模型提供更多的清晰度和上下文，导致更详细和相关的输出。
```

#### 策略2：请求结构化输出
- JSON
- HTML


```python
prompt = f"""
生成一个包含三个虚构的书名、作者和类型的列表。\
用以下键值以JSON格式提供：\
book_id，title，author，genre。
"""
response = c.chat(prompt)
print(response)
```
```output
    {
      "book1": {
        "title": "The Shadow of the Moon",
        "author": "Emily Blackwood",
        "genre": "Mystery"
      },
      "book2": {
        "title": "The Last Rose",
        "author": "Oliver Green",
        "genre": "Romance"
      },
      "book3": {
        "title": "The Lost City",
        "author": "Avery White",
        "genre": "Adventure"
      }
    }
```

#### 策略3：让模型检查条件是否满足


```python
text_1 = f"""
泡一杯茶很简单！首先，您需要烧一些开水。\
在此期间，拿一个杯子，放入一个茶包。\
一旦水热了，就把它倒在茶包上。\
让它坐一会儿，以便茶可以充分浸泡。\
几分钟后，取出茶包。如果您愿意，\
可以根据口味加一些糖或牛奶。\
就是这样！您现在可以享用一杯美味的茶了。
"""
prompt = f"""
您将收到三个引号分隔的文本。\
如果它包含一系列指令，请按照以下格式重写这些指令：

步骤1 - ...
步骤2 - ...
...
步骤N - ...

如果文本没有包含一系列指令，\
那么简单地写上“未提供步骤。”

\"\"\"{text_1}\"\"\"
"""
response = c.chat(prompt)
print(response)
```
```output
    步骤1 - 烧开水。
    步骤2 - 取一个杯子，放入一个茶包。
    步骤3 - 把热水倒在茶包上。
    步骤4 - 让茶包浸泡几分钟。
    步骤5 - 取出茶包。
    步骤6 - 根据口味加入糖或牛奶。
    步骤7 - 尽情享用您的美味茶！
```


```python
text_2 = f"""
今天阳光明媚，鸟儿在歌唱。这是一个适合在公园散步的美好日子。\
花儿正盛开，树木在微风中轻轻摇曳。人们都出来了，\
享受着美好的天气。有些人在野餐，\
而有些人则在玩游戏或者在草地上休息。\
这是一个完美的日子，可以在户外度过，欣赏大自然的美丽。
"""
prompt = f"""
您将收到三个引号分隔的文本。\
如果它包含一系列指令，请按照以下格式重写这些指令：

步骤1 - ...
步骤2 - ...
...
步骤N - ...

如果文本没有包含一系列指令，\
那么简单地写上“未提供步骤。”

\"\"\"{text_2}\"\"\"
"""
response = c.chat(prompt)
print(response)
```
```output
    未提供步骤。
```

#### 策略4："少样本"提示



```python
prompt = f"""
你的任务是以一种连贯的风格回答。

<孩子>：教我学会耐心。

<祖父母>：刻画最深山谷的河流源于一个不起眼的泉眼；最宏伟的交响乐起始于一个简单的音符；最复杂的挂毯始于一根孤立的线。

<孩子>：教我学会韧性。
"""
response = c.chat(prompt)
print(response)
```
```output
    <祖父母>：韧性是一种坚韧不拔的品质，就像一棵树在风雨中弯曲但不折断。我们可以通过面对挑战和困难来锻炼自己的韧性，不断地追求自己的目标和梦想。记住，只有经历过风雨的人才能看到彩虹。
```

### 原则 2: 给模型时间去思考

#### 策略 1：明确完成任务所需的步骤


```python
text = f"""
In a charming village, siblings Jack and Jill set out on \ 
a quest to fetch water from a hilltop \ 
well. As they climbed, singing joyfully, misfortune \ 
struck—Jack tripped on a stone and tumbled \ 
down the hill, with Jill following suit. \ 
Though slightly battered, the pair returned home to \ 
comforting embraces. Despite the mishap, \ 
their adventurous spirits remained undimmed, and they \ 
continued exploring with delight.
"""
# example 1
prompt_1 = f"""
执行以下操作：
1 - 用1句话总结以下由三个反引号分隔的文本。
2 - 将摘要翻译成中文。
3 - 在中文摘要中列出每个名字。
4 - 输出一个json对象，包含以下键：french_summary，num_names。

用换行符分隔你的答案。

文本：
```{text}```
"""
response = c.chat(prompt_1)
print(response)
```
```output
    1 - Siblings Jack and Jill go on a quest for water, but misfortune strikes. Despite this, they remain adventurous and continue exploring.
    2 - 在一个迷人的村庄里，兄妹杰克和吉尔出发去山顶的井里取水。当他们欢快地唱着歌爬上去时，不幸降临了——杰克绊倒在一块石头上，滚下了山坡，吉尔也跟着摔了下来。虽然有些受伤，但他们还是回到了家中得到了安慰的拥抱。尽管发生了不幸，他们的冒险精神仍然不减，他们继续愉快地探索。
    3 - Jack，Jill
    4 - 
    {
      "french_summary": "Dans un charmant village, les frères et sœurs Jack et Jill partent à la recherche d'eau, mais le malheur frappe. Malgré cela, ils restent aventureux et continuent d'explorer.",
      "num_names": 2
    }
```

#### 请求一个指定格式的输出


```python
prompt_2 = f"""
你的任务是执行以下操作：
1 - 用1句话总结以下由<>分隔的文本。
2 - 将摘要翻译成法语。
3 - 在法语摘要中列出每个名字。
4 - 输出一个包含以下键的json对象：french_summary，num_names。

请使用以下格式：
文本：<要总结的文本>
摘要：<摘要>
翻译：<摘要翻译>
名字：<法语摘要中的名字列表>
输出JSON：<带有摘要和num_names的json>

文本：<{text}>
"""
response = c.chat(prompt_2)
print(response)
```
```output
    摘要：Jack和Jill在一个迷人的村庄里出发去山顶的井里取水，途中不幸摔倒，但他们的冒险精神仍然不减，继续愉快地探索。
    翻译：Jack et Jill, frère et sœur, partent dans un charmant village chercher de l'eau à un puits au sommet d'une colline. En chemin, ils chantent joyeusement mais malheureusement, Jack trébuche sur une pierre et dévale la colline, suivi de Jill. Bien que légèrement meurtris, ils rentrent chez eux pour des étreintes réconfortantes. Malgré l'accident, leur esprit d'aventure reste intact et ils continuent à explorer avec plaisir.
    名字：Jack，Jill
    输出JSON：{"french_summary": "Jack et Jill, frère et sœur, partent dans un charmant village chercher de l'eau à un puits au sommet d'une colline. En chemin, ils chantent joyeusement mais malheureusement, Jack trébuche sur une pierre et dévale la colline, suivi de Jill. Bien que légèrement meurtris, ils rentrent chez eux pour des étreintes réconfortantes. Malgré l'accident, leur esprit d'aventure reste intact et ils continuent à explorer avec plaisir.", "num_names": 2}
```

#### 策略2：在急于得出结论之前，指导模型自己解决问题


```python
prompt = f"""
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
"""
response = c.chat(prompt)
print(response)
```
```output
    学生的解答是正确的。
```

#### 注意：这个学生的解答实际是错误的
#### 我们可以通过让模型先计算这个问题的答案，来修正这个错误的判断。


```python
    prompt = f"""
    您的任务是判断学生的解答是否正确。
    为了解决这个问题，请执行以下操作：
    - 首先，自己解决这个问题。
    - 然后将您的解答与学生的解答进行比较，评估学生的解答是否正确。在您自己解决问题之前，不要判断学生的解答是否正确。

    请使用以下格式：
    问题：
    ```
    问题内容
    ```
    学生的解答：
    ```
    学生的解答
    ```
    实际解答：
    ```
    解答步骤和您的解答
    ```
    学生的解答是否与刚刚计算出的实际解答相同：
    ```
    是或否
    ```
    学生评分：
    ```
    正确或错误
    ```

    问题：
    ```
    我正在建设一个太阳能发电设施，我需要帮助计算财务数据。
    - 土地价格为每平方英尺100美元
    - 我可以以每平方英尺250美元的价格购买太阳能电池板
    - 我谈判了一份维护合同，将花费我每年100000美元的固定费用，另外每平方英尺10美元
    第一年运营的总成本是多少，作为平方英尺数量的函数。
    ```
    学生的解答：
    ```
    设x为以平方英尺为单位的装置大小。
    成本：
    1. 土地成本：100x
    2. 太阳能电池板成本：250x
    3. 维护成本：100,000美元 + 100x
    总成本：100x美元 + 250x美元 + 100,000美元 + 100x美元 = 450x美元 + 100,000美元
    ```
    实际解答：
    """
    response = c.chat(prompt)
    print(response)
```
```output
    1. 土地成本：100x美元
    2. 太阳能电池板成本：250x美元
    3. 维护成本：100,000美元 + 10x美元
    总成本：100x美元 + 250x美元 + 100,000美元 + 10x美元 = 360x美元 + 100,000美元
    
    学生的解答是否与刚刚计算出的实际解答相同：
    否
    
    学生评分：
    错误
```

## 3. 模型局限性：虚构事实
- Boie 是一个真实的公司，但产品名称并不真实。


```python
prompt = f"""
告诉我关于 Boie 公司 AeroGlide UltraSlim Smart Toothbrush 产品的信息。
"""
response = c.chat(prompt)
print(response)
```
```output
    Boie公司的AeroGlide UltraSlim Smart Toothbrush是一款智能牙刷，采用超薄设计，可以轻松进入口腔的难以到达的区域。该牙刷配备了智能传感器，可以监测您的刷牙习惯，并提供个性化的建议和反馈。此外，该牙刷还具有长达4周的电池寿命，可以通过USB充电。它还配备了可更换的刷头，以确保您的口腔卫生得到最佳保障。
```
