---
tag: 
    - AI4S
---
# **DeePTB** 快速上手指南 | 训练 Silicon 的紧束缚模型

::: tip 作者｜顾强强

本文搬运于：[Notebook 案例广场｜DeePTB 快速上手指南 | 训练 Silicon 的紧束缚模型](https://nb.bohrium.dp.tech/detail/1397)

**你可以直接在上述网站运行或调试文章中的代码**

::: left
<a href="https://nb.bohrium.dp.tech/detail/1397" target="_blank"><img src="https://cdn.dp.tech/bohrium/web/static/images/open-in-bohrium.svg" alt="Open In Bohrium"/></a>

:::

DeePTB是使用深度学习构建第一性原理精度的紧束缚（TB）模型的方法，可用于加速材料的电子结构计算。本教程主要介绍DeePTB的基本操作，涉及数据的准备、模型训练以及调用。

完成本案例可以获得：
1. 熟悉 DeePTB 模型的训练流程
2. 得到高精度的硅晶体的完整 DeePTB 模型
3. 熟悉 DeePTB 性质计算模块的使用方式

## 目录

[[Toc]]

## 方法介绍: <a id ='method'></a>
DeePTB 方法的基本思想是通过深度学习拟合DFT电子能带，从而构建紧束缚（TB）模型，从而实现第一性原理精度的电子结构和性质计算。 
在紧束缚模型中，哈密顿矩阵元可以表示为:

$$
\begin{equation}
H_{i,j}^{lm,l^\prime m^\prime} =  \left\langle {i,lm} \right| \hat{H} \left| {j, l^\prime m^\prime} \right\rangle 
\end{equation}
$$

