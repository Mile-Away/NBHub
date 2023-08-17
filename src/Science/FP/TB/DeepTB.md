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

其中$i$, $j$ 是site指标。$l$ 和 $m$ 是 angular and magnetic quantum number。 DeePTB的方法的目标就是通过学习DFT的电子能量本征值，利用神经网络预测给定结构的哈密顿量矩阵元。但是，由于哈密顿量本身具有规范变化自由度，因此电子能量本征值并不能完全决定哈密顿量。因此我们这里选取了传统的 Slater-Koster (SK) 参数化的哈密顿量，即:所有的哈密顿量跃迁矩阵元可以从规范无关的参数SK键积分: $h_{ss\sigma}, h_{sp\sigma}, h_{pp\sigma}, h_{pp\pi}, \cdots$等来表示。根据这些键积分，我们可以构建变换到哈密顿量矩阵元，即:

$$
\begin{equation}
	H_{i,j}^{lm,l^\prime m^\prime} = \sum_{\zeta} \Big[ \mathcal{U}_{\zeta}(\hat{r}_{ij}) \ h_{ll^\prime \zeta} \Big]_{mm^\prime}
\end{equation}
$$

