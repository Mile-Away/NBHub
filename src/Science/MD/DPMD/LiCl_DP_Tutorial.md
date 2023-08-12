# 从 DFT 到 MD｜超详细「深度势能」材料计算上手指南

<a href="https://bohrium.dp.tech/notebook/879b6a3a9d394448913ca1ce7de257ec" target="_blank"><img src="https://cdn.dp.tech/bohrium/web/static/images/open-in-bohrium.svg" alt="Open In Bohrium"/></a>

::: tip 
这是目前最完整地覆盖从第一性原理计算到分子动力学模拟的超详细「深度势能」材料计算上手指南，主要面向需要入门深度势能材料计算的零基础用户。
:::
或者你仅需要 10 分钟快速了解 DeePMD-kit，可戳 👉 [DeePMD-kit｜快速开始](https://bohrium.dp.tech/notebook/759614d6c6314dee84a127f11dfc4723)

**在 [Bohrium Notebook](https://bohrium-doc.dp.tech/docs/userguide/Notebook) 界面，你可以点击界面上方蓝色按钮 `开始连接`，选择 `abacus3.2.1-deepmd` 镜像及 `c32_m128_CPU` 节点配置，稍等片刻即可运行。**

## 背景

<img src="https://ars.els-cdn.com/content/image/1-s2.0-S1005030220309075-fx1_lrg.jpg" alt="LiCl" width="600">

在本教程中，我们将以 LiCl 熔体为例，详细介绍深度势能（Deep Potential）模型的训练和应用。深度势能模型是一种基于机器学习的方法，用于精确描述原子间相互作用的势能面。通过训练这种模型，我们可以高效地模拟材料的结构、动力学和热力学性质。具体包括以下示例：

* 章节 1: LAMMPS 经典分子动力学模拟
* 章节 2: ABACUS 第一性原理计算
* 章节 3: DeePMD-kit 深度势能模型训练
* 章节 4: DP-GEN 构建训练数据并生成深度势模型
* 章节 5: LAMMPS 深度势能分子动力学研究

总的来说，通过结合经典分子动力学模拟（如 LAMMPS）、第一性原理计算（如 ABACUS）和深度势能模型构建（DeePMD-kit 和 DP-GEN），我们可以多角度地研究 LiCl 熔体的性质。这些方法和工具的组合为研究复杂材料系统提供了强大的支持，帮助我们更好地理解材料在不同条件下的性能。

### 开始之前

我们很热切地希望与你分享我们的知识，但是现在：

**你不需要了解所有事（至少目前是）。** 你的目标是从头到尾完成本教程并获得结果。你不需要在第一次尝试时就了解所有内容。边学习边写下你的问题。使用丰富的 API 文档来了解你正在使用的所有功能。

**你不需要知道算法是如何工作的。** 了解各种计算模拟的优点和局限性以及如何配置材料计算参数非常重要。但是学习可以稍后进行。你需要在很长一段时间内慢慢建立这种计算模拟知识，并且你可以阅读大量教程来复习材料计算项目的步骤。今天，首先要熟悉这个平台。

了解以下基础概念可以帮助你更快速地理解本文：

* 分子动力学 (Molecular Dynamics, MD)，如果你尚未了解，推荐阅读：
    * [快速了解分子动力学](https://bohrium.dp.tech/notebook/e46f760ebd5f49dba710f5000c1c5eb0)
* 密度泛函理论 (Density Fuctional Theory，DFT)，如果你尚未了解，推荐阅读：
    * [快速了解密度泛函理论](https://bohrium.dp.tech/notebook/abf9976766a645eaab46ae497d08fa64)

## 章节 1：LAMMPS 经典分子动力学模拟

对于 LiCl 熔体，可以使用 LAMMPS（Large-scale Atomic/Molecular Massively Parallel Simulator）软件进行经典分子动力学模拟。[LAMMPS](https://www.lammps.org) 是一个高度灵活且可扩展的分子动力学模拟软件，支持多种原子间势和模拟条件。在这个示例中，我们使用经典 BMH 势函数模拟 LiCl 熔体的结构和动力学性质。

本章节采用 DeePMD-kit(2.2.1) 软件包中预置的 LAMMPS 程序完成。

### 本章节目标

在学习本章节后，你将能够：

- 了解 LAMMPS 的输入和输出文件；
- 能够为 LiCl 熔体撰写 LAMMPS MD 模拟输入文件；
- 计算 LiCl 熔体的微观结构和扩散性质。

### 1.1 下载教程资源

在本章节中，我们以 LiCl 熔体分子为例，进行 LAMMPS 经典分子动力学模拟。我们已经在 *LiCl_DP_Tutorial_Example/chapter1* 中准备了需要的文件，使用以下命令下载：


```python
# 下载教程文件
! if ! [ -e LiCl_DP_Tutorial_Example ]; then wget https://bohrium-example.oss-cn-zhangjiakou.aliyuncs.com/notebook/LiCl_DP_Tutorial/LiCl_DP_Tutorial_Example.zip && unzip LiCl_DP_Tutorial_Example.zip && rm -r LiCl_DP_Tutorial_Example.zip; fi;
```
:::details Output
    --2023-05-21 11:24:38--  https://bohrium-example.oss-cn-zhangjiakou.aliyuncs.com/notebook/LiCl_DP_Tutorial/LiCl_DP_Tutorial_Example.zip
    Resolving ga.dp.tech (ga.dp.tech)... 10.255.255.41
    Connecting to ga.dp.tech (ga.dp.tech)|10.255.255.41|:8118... connected.
    Proxy request sent, awaiting response... 200 OK
    Length: 96716975 (92M) [application/zip]
    Saving to: ‘LiCl_DP_Tutorial_Example.zip’
    
    LiCl_DP_Tutorial_Ex 100%[===================>]  92.24M  20.4MB/s    in 4.7s    
    
    2023-05-21 11:24:44 (19.8 MB/s) - ‘LiCl_DP_Tutorial_Example.zip’ saved [96716975/96716975]
    
    Archive:  LiCl_DP_Tutorial_Example.zip
       creating: LiCl_DP_Tutorial_Example/
       creating: LiCl_DP_Tutorial_Example/chapter1/
       creating: LiCl_DP_Tutorial_Example/chapter5/
       creating: LiCl_DP_Tutorial_Example/chapter2/
       creating: LiCl_DP_Tutorial_Example/chapter3/
       creating: LiCl_DP_Tutorial_Example/chapter4/
      inflating: LiCl_DP_Tutorial_Example/chapter1/msd.png  
      inflating: LiCl_DP_Tutorial_Example/chapter1/licl.data  
      inflating: LiCl_DP_Tutorial_Example/chapter1/licl.in  
      inflating: LiCl_DP_Tutorial_Example/chapter1/licl.rdf  
      inflating: LiCl_DP_Tutorial_Example/chapter1/licl.dump  
      inflating: LiCl_DP_Tutorial_Example/chapter1/ave_rdf.txt  
      inflating: LiCl_DP_Tutorial_Example/chapter1/rdf.png  
      inflating: LiCl_DP_Tutorial_Example/chapter1/licl.msd  
      inflating: LiCl_DP_Tutorial_Example/chapter1/log.lammps  
       creating: LiCl_DP_Tutorial_Example/chapter5/00.npt/
       creating: LiCl_DP_Tutorial_Example/chapter5/01.nvt/
       creating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/
       creating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/
       creating: LiCl_DP_Tutorial_Example/chapter3/01.train/
       creating: LiCl_DP_Tutorial_Example/chapter3/00.data/
       creating: LiCl_DP_Tutorial_Example/chapter3/02.lmp/
      inflating: LiCl_DP_Tutorial_Example/chapter4/dpgen.log  
      inflating: LiCl_DP_Tutorial_Example/chapter4/param_abacus.json  
      inflating: LiCl_DP_Tutorial_Example/chapter4/max-devi-f.png  
      inflating: LiCl_DP_Tutorial_Example/chapter4/machine.json  
       creating: LiCl_DP_Tutorial_Example/chapter4/abacus/
      inflating: LiCl_DP_Tutorial_Example/chapter5/00.npt/licl.data  
      inflating: LiCl_DP_Tutorial_Example/chapter5/00.npt/licl.in  
      inflating: LiCl_DP_Tutorial_Example/chapter5/01.nvt/licl.in  
      inflating: LiCl_DP_Tutorial_Example/chapter5/01.nvt/msd_all_temperatures.png  
      inflating: LiCl_DP_Tutorial_Example/chapter5/01.nvt/rdf_all_temperatures.png  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/Li_gga_8au_100Ry_4s1p.orb  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/Cl_gga_8au_100Ry_2s2p1d.orb  
       creating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/INPUT  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/STRU  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/gr_Cl-Cl  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/Li_ONCV_PBE-1.2.upf  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/Cl_ONCV_PBE-1.2.upf  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/KPT  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/gr_Li-Cl  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/gr_Li-Li  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/abacus_md_rdf.png  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/Li_gga_8au_100Ry_4s1p.orb  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/Cl_gga_8au_100Ry_2s2p1d.orb  
       creating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/OUT.ABACUS/
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/INPUT  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/STRU  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/Li_ONCV_PBE-1.2.upf  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/Cl_ONCV_PBE-1.2.upf  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/KPT  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/licl.pb  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/lcurve.png  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/checkpoint  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/input_v2_compat.json  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/input.json  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/results.e_peratom.out  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/lcurve.out  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/results.v_peratom.out  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/compress.json  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/licl-compress.pb  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/results.e.out  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/results.f.out  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/DP&DFT.png  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/results.v.out  
       creating: LiCl_DP_Tutorial_Example/chapter3/01.train/model-compression/
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/out.json  
       creating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/
       creating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/
      inflating: LiCl_DP_Tutorial_Example/chapter3/02.lmp/64_dpmd_rdf.png  
      inflating: LiCl_DP_Tutorial_Example/chapter3/02.lmp/licl.data  
      inflating: LiCl_DP_Tutorial_Example/chapter3/02.lmp/licl.in  
      inflating: LiCl_DP_Tutorial_Example/chapter3/02.lmp/licl-compress.pb  
      inflating: LiCl_DP_Tutorial_Example/chapter3/02.lmp/licl.rdf  
      inflating: LiCl_DP_Tutorial_Example/chapter3/02.lmp/licl.dump  
      inflating: LiCl_DP_Tutorial_Example/chapter3/02.lmp/ave_rdf.txt  
      inflating: LiCl_DP_Tutorial_Example/chapter3/02.lmp/log.lammps  
      inflating: LiCl_DP_Tutorial_Example/chapter4/abacus/Li_gga_8au_100Ry_4s1p.orb  
      inflating: LiCl_DP_Tutorial_Example/chapter4/abacus/Cl_gga_8au_100Ry_2s2p1d.orb  
      inflating: LiCl_DP_Tutorial_Example/chapter4/abacus/Li_ONCV_PBE-1.2.upf  
      inflating: LiCl_DP_Tutorial_Example/chapter4/abacus/Cl_ONCV_PBE-1.2.upf  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/Restart_md.dat  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/MD_dump  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/STRU_READIN_ADJUST.cif  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/istate.info  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/INPUT  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/gr_Cl-Cl  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/running_md.log  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/gr_Li-Cl  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/gr_Li-Li  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/warning.log  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/kpoints  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/OUT.ABACUS/STRU_READIN_ADJUST.cif  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/OUT.ABACUS/istate.info  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/OUT.ABACUS/INPUT  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/OUT.ABACUS/warning.log  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/OUT.ABACUS/kpoints  
      inflating: LiCl_DP_Tutorial_Example/chapter2/abacus_scf/OUT.ABACUS/running_scf.log  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/model-compression/model.ckpt.meta  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/model-compression/checkpoint  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/model-compression/model.ckpt.index  
      inflating: LiCl_DP_Tutorial_Example/chapter3/01.train/model-compression/model.ckpt.data-00000-of-00001  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/type_map.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/box.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/force.raw  
       creating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/set.000/
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/type.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/energy.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/virial.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/coord.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/type_map.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/box.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/force.raw  
       creating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/set.000/
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/type.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/energy.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/virial.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/coord.raw  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/set.000/box.npy  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/set.000/force.npy  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/set.000/energy.npy  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/set.000/coord.npy  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/training_data/set.000/virial.npy  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/set.000/box.npy  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/set.000/force.npy  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/set.000/energy.npy  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/set.000/coord.npy  
      inflating: LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data/set.000/virial.npy  
:::

在 *LiCl_DP_Tutorial_Example/chapter1* 文件夹包含以下文件：

- `licl.in`: LAMMPS 输入文件，用于控制 LAMMPS MD 模拟的细节；
- `licl.data`: 用于存放 MD 模拟的初始构型；

### 1.2 LAMMPS 输入文件

输入文件的作用是告诉 LAMMPS 软件其应该如何计算。通常将文件命名为“input.in”，其中“input”可以是任何描述性名称，以便于识别该模拟的类型或参数。

下面是一个 LiCl 熔体 LAMMPS 分子动力学模拟输入文件的示例：

```
# this input script is for simulating a 3d LiCl melt at 900K using LAMMPS.

# initialize simulation settings
units           metal
boundary        p p p
atom_style      charge

# define the simulation cell
read_data       licl.data
group           Li  type 1
group           Cl  type 2
set             type 1 charge 1
set             type 2 charge -1

# set force field
pair_style      born/coul/long 7
pair_coeff      1 1 0.4225000 0.3425 1.632 0.045625 0.01875
pair_coeff      1 2 0.2904688 0.3425 2.401 1.250000 1.50000
pair_coeff      2 2 0.1584375 0.3425 3.170 69.37500 139.375
kspace_style    ewald 1.0e-6 	

# nvt simulation  
velocity        all create 900 23456789
fix             1 all nvt temp 900 900 0.5
timestep        0.001

# rdf calculation 
compute         rdf all rdf 100 1 1 1 2 2 2
fix             2 all ave/time 100 1 100 c_rdf[*] file licl.rdf mode vector

# msd calculation
compute         msd1 Li msd
compute         msd2 Cl msd
fix             3 all ave/time 100 1 100 c_msd1[4] c_msd2[4] file licl.msd

# output
thermo_style    custom step temp pe ke etotal press lx ly lz vol
thermo          1000
dump            1 all custom 1000 licl.dump id type x y z 

log             ./LiCl_DP_Tutorial_Example/Chapter1/Outputs/log.lammps
run             500000
```

让我们来看一下各输入文件中各参数的含义：

- `units metal`：用于设置模拟中使用的单位系统。对于 metal，时间的单位是皮秒（ps），长度的单位是埃（Å），质量的单位是原子质量单位（amu），能量的单位是电子伏特（eV），温度的单位是开尔文（K），压力的单位是巴（bar），速度的单位是埃/皮秒（Å/ps）。

- `boundary p p p`：用于设置模拟的边界条件。在本教程情况下，我们在 x, y, z 三个方向上均使用周期性（periodic）边界条件。p 表示周期性，f (fixed) 表示固定边界条件。

- `atom_style charge`：用于设置原子类型和属性。在这个示例中，我们使用带电原子模型，因此使用了 charge 类型。

- `read_data licl.data`：用于读取数据文件 licl.data，同时也是该案例中 MD 模拟所使用的初始构型。

- `group Li type 1` 和 `group Cl type 2`：用于根据原子类型创建两个组，分别包含元素类型为 1（Li）和元素类型为 2（Cl）的所有原子。

- `set type 1 charge 1` 和 `set type 2 charge -1`：用于设置原子类型 1 和 2 的电荷。在这个示例中，元素类型 1（Li）的原子被设置为带有 +1 电荷，元素类型 2（Cl）的原子被设置为带有 -1 电荷。

- `pair_style born/coul/long 7`：该命令用于设置原子之间的相互作用势函数。在这个示例中，我们使用 Born−Mayer−Huggins 势函数：

$$ U_{i j}(r)=\frac{q_i q_j}{r}+A_{i j} b \exp \left(\frac{\sigma_{i j}-r}{\rho}\right)-\frac{C_{i j}}{r^6}-\frac{D_{i j}}{r^8} $$

其中第一项描述了离子之间的静电相互作用，$q_i$ 是离子电荷（$q_{Li}$= +1，$q_{Cl}$=-1）；第二项描述由于电子云的重叠引起的短程斥力，$A_{i j}$ 是 Pauling 因子（$A_{Li Li}$=2.00，$A_{Li Cl}$=1.375，$A_{Cl Cl}$=0.75），b 是一个常数（$b=0.338 \times 10^{-19} \mathrm{~J}$），$σ_{i j}$ 是晶体离子半径，而 ρ 是硬度参数 ($ρ_{LiCl}$ = 0.3425 Å)；最后两项对应于偶极-偶极和偶极-四极子色散相互作用，其中 $C_{i j}$和$D_{i j}$ 是色散参数。$r$ 是截断距离（cutoff distance），单位为 Å，超过这个距离的原子间作用将被忽略。

|    |$A_{i j}b$(eV)|$σ_{i j}$(Å)|$C_{i j}$(eV)|$D_{i j}$(eV)|
|----|--------------|------------|-------------|-------------| 
| ++ | 0.4225000    | 1.632      |0.045625     |0.01875      |
| +- | 0.2904688    | 2.401      |1.250000     |1.50000      |
| -- | 0.1584375    | 3.170      |69.37500     |139.375      |

- `pair_coeff`：这些命令用于为相互作用势函数设置参数。每个 pair_coeff 命令将相互作用势函数中的原子类型之间的参数设置为指定值。在这个示例中，我们设置了 1 1、1 2 和 2 2 之间的参数。

- `kspace_style ewald 1.0e-6`：该命令用于设置 Ewald 方法计算长程库仑相互作用。在这个示例中，我们使用了Ewald方法，使用了 1.0e-6 的精度。

- `velocity all create 900 23456789`：该命令用于为模拟系统中的所有原子设置随机速度。

- `fix 1 all nvt temp 900 900 0.5`：该命令用于对模拟系统进行 NVT （等温-等体积）模拟。在这个示例中，我们将模拟系统保持在 900K 的恒定温度下，并使用Nose-Hoover 算法进行温度控制。0.5 是温度阻尼系数。

- `timestep 0.001`：该命令用于设置模拟的时间步长。在这个示例中，时间步长为 0.001 皮秒。（1 秒 = 10^3 毫秒 = 10^6 微秒 = 10^9 纳秒 = 10^12 皮秒）

- `compute rdf all rdf 100 1 1 1 2 2 2`：该命令用于计算模拟系统中两种原子之间的径向分布函数（RDF）。100 表示分 100 个统计区间，1 1 表示 Li-Li RDF，1 2表示Li-Cl RDF，2 2 表示 Cl-Cl RDF。

- `fix 2 all ave/time 100 1 100 c_rdf[*] file licl.rdf mode vector`：该命令用于对计算的RDF数据进行时间平均，并将结果输出到文件中。使用 fix 2 对RDF 数据进行时间平均，100 1 100 分别为 Nevery (每100步计算1次 rdf)，Nrepeat(平均最近1次的计算的 rdf，用于输出)和 Nfrequency(每 100 步输出一次 rdf)， 在这个案例中会每 100 步会输出一次 rdf。使用 c_rdf[*] 表示平均所有 RDF 分量，使用 file licl.rdf 表示将结果输出到名为 licl.rdf 的文件中，使用 mode vector 表示输出向量格式的数据。

- `compute msd1 Li msd` 和 `compute msd2 Cl msd`：这些命令用于计算两种原子在模拟过程中的平均平方位移（MSD）。在这个示例中，我们使用 compute msd1 计算 Li 原子的 MSD，使用compute msd2 计算 Cl 原子的 MSD。

- `fix 3 all ave/time 100 1 100 c_msd1[4] c_msd2[4] file licl.msd`：该命令用于对计算的 MSD 数据进行时间平均，并将结果输出到文件中。使用 fix 3 对 MSD 数据进行时间平均，使用 c_msd1[4] 和 c_msd2[4] 表示平均两种原子的MSD, 使用 file licl.msd 表示将结果输出到名为licl.msd的文件中。

- `thermo_style custom step temp pe ke etotal press lx ly lz vol`：该命令用于设置 LAMMPS 在模拟过程中输出的热力学信息。在这个示例中，我们使用`thermo_style custom` 表示使用自定义的输出格式，使用 `step temp pe ke etotal press lx ly lz vol` 表示要输出的信息，包括模拟步数、温度、势能、动能、总能量、压强以及模拟盒子的尺寸和体积。

- `thermo 1000`：该命令用于设置输出热力学信息的频率。在这个示例中，我们将每 1000 步输出一次热力学信息。

- `dump 1 all custom 1000 licl.dump id type x y z`：该命令用于在模拟过程中输出原子的坐标信息。在这个示例中，使用 `dump 1 all` 表示输出模拟系统中的所有原子，使用 `custom` 表示使用自定义的输出格式，使用 `1000` 表示输出频率，使用 `licl.dump` 表示输出文件的名称，使用 `id type x y z` 表示输出的原子信息，包括原子的 ID、类型以及在 x、y、z 方向上的坐标。

- `run 500000` 命令用于运行 LAMMPS 模拟，进行一定步数的时间演化。在这个示例中，该命令将模拟系统进行 500000 步时间演化。在每个时间步长中，LAMMPS 会根据当前的原子位置、速度和势能计算新的位置、速度和势能。通过这个过程，我们可以观察模拟系统的时间演化行为，比如温度、压力和分子运动轨迹等。需要注意的是，run 命令需要根据实际情况进行设置，以保证模拟过程的充分和准确。

你可以通过以下命令查看你刚才下载的 LAMMPS 案例的输入文件，与上述示例比较一下，有什么发现？


```python
! cd ./LiCl_DP_Tutorial_Example/chapter1/ && cat licl.in
```

    # this input script is for simulating a 3d LiCl melt at 900K using LAMMPS.
    
    # initialize simulation settings
    units           metal
    boundary        p p p
    atom_style      charge
    
    # define the simulation cell
    read_data	licl.data
    group		Li  type 1
    group		Cl  type 2
    set 		type 1 charge 1
    set 		type 2 charge -1
    
    # set force field
    pair_style      born/coul/long 7
    pair_coeff	1 1 0.4225000 0.3425 1.632 0.045625 0.01875
    pair_coeff	1 2 0.2904688 0.3425 2.401 1.250000 1.50000
    pair_coeff	2 2 0.1584375 0.3425 3.170 69.37500 139.375
    kspace_style	ewald 1.0e-6 	
    
    # nvt  
    velocity        all create 900 23456789
    fix             1 all nvt temp 900 900 0.5
    timestep        0.001
    
    # rdf calculation 
    compute 	 rdf all rdf 100 1 1 1 2 2 2
    fix 		 2 all ave/time 100 1 100 c_rdf[*] file licl.rdf mode vector
    
    # msd calculation
    compute          msd1 Li msd
    compute          msd2 Cl msd
    fix              3 all ave/time 100 1 100 c_msd1[4] c_msd2[4] file licl.msd
    
    # output
    thermo_style    custom step temp pe ke etotal press lx ly lz vol
    thermo          1000
    dump		1 all custom 1000 licl.dump id type x y z 
    
    run             200000


为了缩短运行所需的时间，我们适当降低了运行步数。你有新的想法吗？不要犹豫，快速试试你的新想法。

如果你没有偷懒的话，你已经仔细阅读了 2～3 遍 LAMMPS 输入文件，相信你已经对输入文件有了初步的了解。

还有许多疑惑？不用担心，这是正常的。你需要在接下来的时间里慢慢建立知识。[LAMMPS Commands 官方文档](https://docs.lammps.org/Commands.html) 提供了全面、详细的解释，在需要的时候不要忘了它。

### 1.3 LAMMPS 初始构型文件

下面是一个 LiCl 熔体 LAMMPS MD 模拟初始构型的示例：

```
# LAMMPS data file 
108 atoms
2 atom types
0.0 13.4422702789 xlo xhi
0.0 13.4422702789 ylo yhi
0.0 13.4422702789 zlo zhi

Masses

1 6.941  # Li
2 35.453  # Cl

Atoms  # charge

1 1 0.0 9.10297966 1.4528499842 12.3941898346  
2 1 0.0 11.53647995 2.3037500381 1.6365799904
3 1 0.0 1.3658800125 9.3088798523 4.9590802193
...
106 2 0.0 5.8468399048 2.629529953 3.9059700966
107 2 0.0 7.0047798157 5.3034000397 10.0816297531
108 2 0.0 4.4860801697 11.4718704224 13.3586997986
```

该文件描述模拟系统（LiCl）的基本信息和初始状态。

首先是模拟系统的基本信息：模拟系统中有 108 个原子，两种类型的原子（Li 和 Cl），模拟系统在 x、y、z 三个方向上的盒子大小分别是 0.0 到 13.4422702789，两种类型的原子的质量分别是 6.941 和 35.453。

后面一部分是原子的位置和电荷信息：每行依次表示原子的 ID、类型、电荷以及在 x、y、z 三个方向上的坐标。注意，此处电荷都是 0.0，我们可以在 *licl.in* 中重新规定电荷。

同样地，你可以通过以下命令查看你刚才下载的 LAMMPS 案例的构型数据文件。<span style="color:purple; font-weight:bold">自己动手试一下。</span>

```bash
cat ./LiCl_DP_Tutorial_Example/chapter1/licl.data
```

### 1.4 运行 LAMMPS 经典分子动力学模拟

经典分子动力学（Classical Molecular Dynamics，CMD）使用牛顿力学描述原子或分子间的相互作用。

在了解 licl.in 和 licl.data 文件后，我们可以执行以下命令以启动 LiCl 熔体的 LAMMPS 分子动力学模拟：


```python
# 以下命令判断该环境中是否存在所需模块，如果没有，则使用 pip 快速安装。
! ! if ! pip show deepmd-kit > /dev/null; then pip install deepmd-kit[gpu,cu11,lmp]; fi;
```


```python
# ############### Time Warning: 3 mins 35 secs ################### 
! cd ./LiCl_DP_Tutorial_Example/chapter1/ && lmp -i licl.in
```
:::details Output
    Warning:
    This LAMMPS executable is in a conda environment, but the environment has
    not been activated. Libraries may fail to load. To activate this environment
    please see https://conda.io/activation.
    LAMMPS (23 Jun 2022 - Update 1)
    OMP_NUM_THREADS environment is not set. Defaulting to 1 thread. (src/comm.cpp:98)
      using 1 OpenMP thread(s) per MPI task
    Loaded 1 plugins from /opt/deepmd-kit-2.2.1/lib/deepmd_lmp
    Reading data file ...
      orthogonal box = (0 0 0) to (13.44227 13.44227 13.44227)
      1 by 1 by 1 MPI processor grid
      reading atoms ...
      108 atoms
      read_data CPU = 0.033 seconds
    54 atoms in group Li
    54 atoms in group Cl
    Setting atom values ...
      54 settings made for charge
    Setting atom values ...
      54 settings made for charge
    Ewald initialization ...
      using 12-bit tables for long-range coulomb (src/kspace.cpp:342)
      G vector (1/distance) = 0.4944418
      estimated absolute RMS force accuracy = 1.4603535e-05
      estimated relative force accuracy = 1.0141594e-06
      KSpace vectors: actual max1d max3d = 1054 8 2456
                      kxmax kymax kzmax  = 8 8 8
    Generated 0 of 1 mixed pair_coeff terms from geometric mixing rule
    Neighbor list info ...
      update every 1 steps, delay 10 steps, check yes
      max neighbors/atom: 2000, page size: 100000
      master list distance cutoff = 9
      ghost atom cutoff = 9
      binsize = 4.5, bins = 3 3 3
      2 neighbor lists, perpetual/occasional/extra = 1 1 0
      (1) pair born/coul/long, perpetual
          attributes: half, newton on
          pair build: half/bin/atomonly/newton
          stencil: half/bin/3d
          bin: standard
      (2) compute rdf, occasional, copy from (1)
          attributes: half, newton on
          pair build: copy
          stencil: none
          bin: none
    Setting up Verlet run ...
      Unit style    : metal
      Current step  : 0
      Time step     : 0.001
    Per MPI rank memory allocation (min/avg/max) = 19.04 | 19.04 | 19.04 Mbytes
       Step          Temp          PotEng         KinEng         TotEng         Press            Lx             Ly             Lz           Volume    
             0   900           -440.62097      12.447752     -428.17322     -1521.1289      13.44227       13.44227       13.44227       2428.9461    
          1000   968.13503     -446.75864      13.390116     -433.36852      9597.5075      13.44227       13.44227       13.44227       2428.9461    
          2000   799.37501     -446.68596      11.056024     -435.62994      8193.9962      13.44227       13.44227       13.44227       2428.9461    
          3000   1055.152      -447.36257      14.593633     -432.76893      11403.113      13.44227       13.44227       13.44227       2428.9461    
          4000   942.59913     -447.06653      13.036933     -434.02959      8839.626       13.44227       13.44227       13.44227       2428.9461    
          5000   932.98321     -447.92318      12.903937     -435.01924      9611.9418      13.44227       13.44227       13.44227       2428.9461    
          6000   962.5954      -447.64155      13.313499     -434.32805      7867.1085      13.44227       13.44227       13.44227       2428.9461    
          7000   1029.0803     -446.70018      14.233041     -432.46714      8821.9229      13.44227       13.44227       13.44227       2428.9461    
          8000   804.74153     -446.89508      11.130248     -435.76483      9897.7414      13.44227       13.44227       13.44227       2428.9461    
          9000   968.94865     -447.30266      13.401369     -433.90129      7578.9257      13.44227       13.44227       13.44227       2428.9461    
         10000   853.03493     -449.26907      11.798186     -437.47089      4303.6631      13.44227       13.44227       13.44227       2428.9461    
         11000   949.03035     -448.79576      13.125883     -435.66988      6921.9392      13.44227       13.44227       13.44227       2428.9461    
         12000   1019.3028     -447.97287      14.097809     -433.87506      7439.8101      13.44227       13.44227       13.44227       2428.9461    
         13000   866.33976     -448.59725      11.982203     -436.61505      3645.5216      13.44227       13.44227       13.44227       2428.9461    
         14000   881.02097     -448.12247      12.185256     -435.93721      5532.0359      13.44227       13.44227       13.44227       2428.9461    
         15000   1010.6473     -448.61779      13.978097     -434.6397       2001.8255      13.44227       13.44227       13.44227       2428.9461    
         16000   859.14143     -448.23488      11.882644     -436.35223      4184.2035      13.44227       13.44227       13.44227       2428.9461    
         17000   832.33933     -450.00984      11.511948     -438.49789      4760.8295      13.44227       13.44227       13.44227       2428.9461    
         18000   758.53076     -445.65033      10.491114     -435.15922      10261.657      13.44227       13.44227       13.44227       2428.9461    
         19000   978.13123     -448.43327      13.528372     -434.9049       3920.768       13.44227       13.44227       13.44227       2428.9461    
         20000   922.91518     -450.61153      12.764688     -437.84685      6338.3806      13.44227       13.44227       13.44227       2428.9461    
         21000   792.15579     -449.75475      10.956176     -438.79858      2586.8977      13.44227       13.44227       13.44227       2428.9461    
         22000   850.74729     -446.89796      11.766546     -435.13141      10089.477      13.44227       13.44227       13.44227       2428.9461    
         23000   981.62229     -447.76538      13.576656     -434.18873      4595.2063      13.44227       13.44227       13.44227       2428.9461    
         24000   840.42983     -447.37612      11.623847     -435.75227      8734.1244      13.44227       13.44227       13.44227       2428.9461    
         25000   762.77107     -447.12438      10.549761     -436.57462      7349.5293      13.44227       13.44227       13.44227       2428.9461    
         26000   874.86752     -445.31886      12.100149     -433.21871      5652.4325      13.44227       13.44227       13.44227       2428.9461    
         27000   841.99527     -447.2667       11.645498     -435.6212       7022.4019      13.44227       13.44227       13.44227       2428.9461    
         28000   803.09407     -447.34821      11.107462     -436.24075      8183.1314      13.44227       13.44227       13.44227       2428.9461    
         29000   1015.8598     -449.13998      14.05019      -435.08979      4561.5234      13.44227       13.44227       13.44227       2428.9461    
         30000   869.36995     -447.74387      12.024113     -435.71976      8731.7835      13.44227       13.44227       13.44227       2428.9461    
         31000   865.67141     -447.69156      11.972959     -435.7186       5631.2005      13.44227       13.44227       13.44227       2428.9461    
         32000   1072.8189     -447.57728      14.837981     -432.7393       8334.566       13.44227       13.44227       13.44227       2428.9461    
         33000   778.19103     -447.0946       10.763032     -436.33157      7617.1961      13.44227       13.44227       13.44227       2428.9461    
         34000   897.67633     -447.46617      12.415614     -435.05056      8298.9541      13.44227       13.44227       13.44227       2428.9461    
         35000   907.33876     -446.45274      12.549253     -433.90349      11690.195      13.44227       13.44227       13.44227       2428.9461    
         36000   871.2225      -449.90596      12.049735     -437.85623      5878.1909      13.44227       13.44227       13.44227       2428.9461    
         37000   925.28988     -447.76226      12.797532     -434.96472      10973.765      13.44227       13.44227       13.44227       2428.9461    
         38000   965.44168     -448.47937      13.352865     -435.1265       7130.6017      13.44227       13.44227       13.44227       2428.9461    
         39000   791.02189     -448.77284      10.940494     -437.83234      5283.7909      13.44227       13.44227       13.44227       2428.9461    
         40000   836.15353     -446.80314      11.564702     -435.23844      5927.6367      13.44227       13.44227       13.44227       2428.9461    
         41000   915.52667     -446.82918      12.662499     -434.16668      6456.9301      13.44227       13.44227       13.44227       2428.9461    
         42000   813.43728     -449.08152      11.250517     -437.83101      7797.7577      13.44227       13.44227       13.44227       2428.9461    
         43000   852.21244     -447.65953      11.78681      -435.87272      4858.4925      13.44227       13.44227       13.44227       2428.9461    
         44000   952.43823     -447.37362      13.173016     -434.20061      6664.4747      13.44227       13.44227       13.44227       2428.9461    
         45000   908.93391     -449.79151      12.571315     -437.22019      6270.6965      13.44227       13.44227       13.44227       2428.9461    
         46000   748.50279     -447.51898      10.352419     -437.16656      7144.0906      13.44227       13.44227       13.44227       2428.9461    
         47000   881.68235     -446.21433      12.194404     -434.01993      10070.238      13.44227       13.44227       13.44227       2428.9461    
         48000   815.76098     -445.96865      11.282656     -434.686        7309.0874      13.44227       13.44227       13.44227       2428.9461    
         49000   789.00182     -448.35397      10.912554     -437.44141      9432.5533      13.44227       13.44227       13.44227       2428.9461    
         50000   804.70742     -446.36177      11.129776     -435.232        7342.0588      13.44227       13.44227       13.44227       2428.9461    
         51000   909.22121     -447.41009      12.575289     -434.8348       10285.45       13.44227       13.44227       13.44227       2428.9461    
         52000   761.63008     -446.96042      10.53398      -436.42644      5602.6415      13.44227       13.44227       13.44227       2428.9461    
         53000   808.76919     -449.85284      11.185954     -438.66688      6119.577       13.44227       13.44227       13.44227       2428.9461    
         54000   833.51029     -447.03276      11.528144     -435.50462      12510.642      13.44227       13.44227       13.44227       2428.9461    
         55000   944.50633     -446.31011      13.063312     -433.2468       14246.873      13.44227       13.44227       13.44227       2428.9461    
         56000   936.78474     -445.96572      12.956516     -433.00921      12465.188      13.44227       13.44227       13.44227       2428.9461    
         57000   841.71263     -447.53963      11.641589     -435.89804      10386.921      13.44227       13.44227       13.44227       2428.9461    
         58000   928.5016      -446.7878       12.841953     -433.94584      8404.4477      13.44227       13.44227       13.44227       2428.9461    
         59000   855.13954     -446.0453       11.827294     -434.21801      11876.025      13.44227       13.44227       13.44227       2428.9461    
         60000   936.57819     -448.48445      12.953659     -435.53079      13667.54       13.44227       13.44227       13.44227       2428.9461    
         61000   1035.5138     -447.46839      14.322022     -433.14637      8984.2872      13.44227       13.44227       13.44227       2428.9461    
         62000   896.91385     -448.50798      12.405068     -436.10291      12145.891      13.44227       13.44227       13.44227       2428.9461    
         63000   835.23576     -447.57915      11.552008     -436.02715      8294.6728      13.44227       13.44227       13.44227       2428.9461    
         64000   884.41734     -446.38607      12.232231     -434.15384      6173.496       13.44227       13.44227       13.44227       2428.9461    
         65000   818.15033     -448.157        11.315703     -436.84129      6905.2238      13.44227       13.44227       13.44227       2428.9461    
         66000   725.98462     -447.7929       10.040974     -437.75192      5460.9135      13.44227       13.44227       13.44227       2428.9461    
         67000   948.22967     -447.88104      13.114809     -434.76623      10022.118      13.44227       13.44227       13.44227       2428.9461    
         68000   819.77685     -447.2582       11.338199     -435.92         5861.8161      13.44227       13.44227       13.44227       2428.9461    
         69000   799.74646     -448.13799      11.061162     -437.07683      11270.452      13.44227       13.44227       13.44227       2428.9461    
         70000   940.84634     -446.90068      13.012691     -433.88799      11233.827      13.44227       13.44227       13.44227       2428.9461    
         71000   1030.332      -448.14601      14.250353     -433.89566      11380.668      13.44227       13.44227       13.44227       2428.9461    
         72000   924.79288     -449.3942       12.790658     -436.60354      3679.2325      13.44227       13.44227       13.44227       2428.9461    
         73000   855.75624     -446.06831      11.835824     -434.23249      7583.462       13.44227       13.44227       13.44227       2428.9461    
         74000   819.55186     -444.9279       11.335087     -433.59282      7307.3214      13.44227       13.44227       13.44227       2428.9461    
         75000   829.77483     -448.61772      11.476479     -437.14125      5820.9788      13.44227       13.44227       13.44227       2428.9461    
         76000   923.30868     -448.54104      12.77013      -435.77091      10937.125      13.44227       13.44227       13.44227       2428.9461    
         77000   965.26945     -447.10734      13.350483     -433.75686      6684.5996      13.44227       13.44227       13.44227       2428.9461    
         78000   886.29645     -448.7182       12.25822      -436.45998      6548.4903      13.44227       13.44227       13.44227       2428.9461    
         79000   852.03157     -448.05997      11.784308     -436.27566      6440.6704      13.44227       13.44227       13.44227       2428.9461    
         80000   885.15846     -445.99723      12.242481     -433.75475      8354.7332      13.44227       13.44227       13.44227       2428.9461    
         81000   981.8257      -448.77065      13.57947      -435.19118      9891.3852      13.44227       13.44227       13.44227       2428.9461    
         82000   792.07444     -448.20065      10.955051     -437.2456       5660.0712      13.44227       13.44227       13.44227       2428.9461    
         83000   932.15942     -447.70841      12.892544     -434.81586      7665.5227      13.44227       13.44227       13.44227       2428.9461    
         84000   923.48756     -446.51455      12.772604     -433.74194      2378.3956      13.44227       13.44227       13.44227       2428.9461    
         85000   741.22754     -447.1757       10.251796     -436.92391      2958.1244      13.44227       13.44227       13.44227       2428.9461    
         86000   1021.5647     -449.32353      14.129093     -435.19444      7298.1944      13.44227       13.44227       13.44227       2428.9461    
         87000   918.67946     -446.57546      12.706105     -433.86935      5031.0923      13.44227       13.44227       13.44227       2428.9461    
         88000   1002.299      -448.45785      13.862633     -434.59522      11126.938      13.44227       13.44227       13.44227       2428.9461    
         89000   821.8597      -447.11641      11.367006     -435.74941      6371.4778      13.44227       13.44227       13.44227       2428.9461    
         90000   994.76606     -446.98255      13.758446     -433.22411      11702.708      13.44227       13.44227       13.44227       2428.9461    
         91000   764.33716     -446.11499      10.571422     -435.54357      9183.5927      13.44227       13.44227       13.44227       2428.9461    
         92000   895.78488     -447.91216      12.389453     -435.52271      7647.0962      13.44227       13.44227       13.44227       2428.9461    
         93000   1060.9308     -446.85838      14.67356      -432.18482      3372.0891      13.44227       13.44227       13.44227       2428.9461    
         94000   857.15014     -445.69073      11.855103     -433.83563      9168.0177      13.44227       13.44227       13.44227       2428.9461    
         95000   826.68792     -447.14606      11.433785     -435.71227      3120.7142      13.44227       13.44227       13.44227       2428.9461    
         96000   907.58973     -448.32895      12.552724     -435.77623      5548.4105      13.44227       13.44227       13.44227       2428.9461    
         97000   790.39244     -446.5355       10.931788     -435.60371      8705.077       13.44227       13.44227       13.44227       2428.9461    
         98000   904.00759     -445.80326      12.50318      -433.30008      9231.0483      13.44227       13.44227       13.44227       2428.9461    
         99000   848.35203     -448.24554      11.733417     -436.51212      8870.4366      13.44227       13.44227       13.44227       2428.9461    
        100000   858.85781     -447.97588      11.878721     -436.09715      3816.5981      13.44227       13.44227       13.44227       2428.9461    
        101000   837.52185     -445.8777       11.583627     -434.29407      7015.7058      13.44227       13.44227       13.44227       2428.9461    
        102000   825.36683     -446.08522      11.415513     -434.66971      10060.208      13.44227       13.44227       13.44227       2428.9461    
        103000   861.1587      -447.80968      11.910544     -435.89913      7846.5612      13.44227       13.44227       13.44227       2428.9461    
        104000   966.62836     -446.84957      13.369278     -433.4803       6433.8448      13.44227       13.44227       13.44227       2428.9461    
        105000   947.66633     -449.38361      13.107017     -436.2766       7423.6998      13.44227       13.44227       13.44227       2428.9461    
        106000   860.22459     -448.20013      11.897625     -436.30251      6778.849       13.44227       13.44227       13.44227       2428.9461    
        107000   975.8158      -446.38747      13.496348     -432.89112      12796.098      13.44227       13.44227       13.44227       2428.9461    
        108000   819.33558     -448.13407      11.332096     -436.80197      5369.3216      13.44227       13.44227       13.44227       2428.9461    
        109000   895.67954     -447.08332      12.387996     -434.69532      6592.9186      13.44227       13.44227       13.44227       2428.9461    
        110000   956.55719     -447.06299      13.229985     -433.83301      5643.5402      13.44227       13.44227       13.44227       2428.9461    
        111000   871.19517     -448.54648      12.049357     -436.49712      8604.1522      13.44227       13.44227       13.44227       2428.9461    
        112000   840.40436     -447.07744      11.623495     -435.45395      10547.689      13.44227       13.44227       13.44227       2428.9461    
        113000   1029.3846     -447.43078      14.237249     -433.19353      8856.9606      13.44227       13.44227       13.44227       2428.9461    
        114000   988.7004      -449.66188      13.674553     -435.98733      7988.7498      13.44227       13.44227       13.44227       2428.9461    
        115000   975.6549      -448.66092      13.494122     -435.1668       6001.9213      13.44227       13.44227       13.44227       2428.9461    
        116000   1013.1805     -446.55507      14.013132     -432.54194      12339.786      13.44227       13.44227       13.44227       2428.9461    
        117000   951.80343     -449.65437      13.164237     -436.49014      6460.0683      13.44227       13.44227       13.44227       2428.9461    
        118000   866.11795     -447.42654      11.979135     -435.4474       10188.576      13.44227       13.44227       13.44227       2428.9461    
        119000   900.53134     -445.98984      12.455101     -433.53474      6230.6033      13.44227       13.44227       13.44227       2428.9461    
        120000   749.33637     -446.96925      10.363948     -436.6053       12284.467      13.44227       13.44227       13.44227       2428.9461    
        121000   830.91376     -447.46308      11.492232     -435.97085      8476.8902      13.44227       13.44227       13.44227       2428.9461    
        122000   963.08154     -446.92419      13.320222     -433.60397      12047.404      13.44227       13.44227       13.44227       2428.9461    
        123000   822.13312     -448.07144      11.370788     -436.70065      8694.1516      13.44227       13.44227       13.44227       2428.9461    
        124000   917.32545     -448.74012      12.687377     -436.05274      5075.294       13.44227       13.44227       13.44227       2428.9461    
        125000   921.10219     -446.57636      12.739613     -433.83674      10109.19       13.44227       13.44227       13.44227       2428.9461    
        126000   876.40984     -446.45556      12.12148      -434.33408      9319.9786      13.44227       13.44227       13.44227       2428.9461    
        127000   817.7293      -448.35213      11.309879     -437.04225      9416.5937      13.44227       13.44227       13.44227       2428.9461    
        128000   822.26552     -445.75579      11.372619     -434.38317      9522.1448      13.44227       13.44227       13.44227       2428.9461    
        129000   915.89964     -446.54872      12.667657     -433.88107      4919.1352      13.44227       13.44227       13.44227       2428.9461    
        130000   818.94898     -448.18933      11.326749     -436.86258      7526.0556      13.44227       13.44227       13.44227       2428.9461    
        131000   929.11986     -449.46307      12.850504     -436.61256      8950.3404      13.44227       13.44227       13.44227       2428.9461    
        132000   862.45175     -447.07155      11.928428     -435.14312      10325.189      13.44227       13.44227       13.44227       2428.9461    
        133000   1003.9721     -448.37695      13.885773     -434.49118      9293.3913      13.44227       13.44227       13.44227       2428.9461    
        134000   816.49259     -448.08859      11.292775     -436.79582      5700.869       13.44227       13.44227       13.44227       2428.9461    
        135000   800.45494     -447.08512      11.070961     -436.01416      7268.921       13.44227       13.44227       13.44227       2428.9461    
        136000   991.29708     -447.45599      13.710467     -433.74552      9704.8549      13.44227       13.44227       13.44227       2428.9461    
        137000   906.86916     -448.65115      12.542758     -436.1084       2813.3224      13.44227       13.44227       13.44227       2428.9461    
        138000   736.7968      -449.78277      10.190515     -439.59226      1631.9435      13.44227       13.44227       13.44227       2428.9461    
        139000   844.24781     -450.05149      11.676653     -438.37484      7716.5954      13.44227       13.44227       13.44227       2428.9461    
        140000   807.56359     -446.48045      11.169279     -435.31117      8733.9129      13.44227       13.44227       13.44227       2428.9461    
        141000   923.35263     -446.52203      12.770738     -433.75129      6457.0609      13.44227       13.44227       13.44227       2428.9461    
        142000   793.11393     -448.1535       10.969428     -437.18407      6008.6258      13.44227       13.44227       13.44227       2428.9461    
        143000   881.25764     -447.92144      12.18853      -435.73291      4117.1976      13.44227       13.44227       13.44227       2428.9461    
        144000   967.61068     -448.95923      13.382864     -435.57637      8184.5555      13.44227       13.44227       13.44227       2428.9461    
        145000   768.46996     -449.04589      10.628582     -438.4173       3551.6168      13.44227       13.44227       13.44227       2428.9461    
        146000   847.79377     -447.25021      11.725696     -435.52451      6861.9653      13.44227       13.44227       13.44227       2428.9461    
        147000   941.86992     -447.26683      13.026848     -434.23998      11022.249      13.44227       13.44227       13.44227       2428.9461    
        148000   888.92088     -445.14616      12.294518     -432.85164      9285.372       13.44227       13.44227       13.44227       2428.9461    
        149000   868.59899     -447.77784      12.01345      -435.76439      7841.3668      13.44227       13.44227       13.44227       2428.9461    
        150000   869.94163     -447.88066      12.03202      -435.84864      6666.5273      13.44227       13.44227       13.44227       2428.9461    
        151000   1025.9435     -446.9241       14.189655     -432.73444      11561.02       13.44227       13.44227       13.44227       2428.9461    
        152000   820.44005     -446.85938      11.347371     -435.51201      5526.6729      13.44227       13.44227       13.44227       2428.9461    
        153000   838.9451      -447.83716      11.603312     -436.23385      8319.0259      13.44227       13.44227       13.44227       2428.9461    
        154000   803.85304     -445.55584      11.117959     -434.43788      6618.0311      13.44227       13.44227       13.44227       2428.9461    
        155000   893.20948     -446.74828      12.353833     -434.39445      5277.4573      13.44227       13.44227       13.44227       2428.9461    
        156000   840.30348     -446.53082      11.622099     -434.90872      2929.223       13.44227       13.44227       13.44227       2428.9461    
        157000   837.11447     -446.61864      11.577993     -435.04065      8329.4129      13.44227       13.44227       13.44227       2428.9461    
        158000   805.23492     -446.47885      11.137072     -435.34177      10512.463      13.44227       13.44227       13.44227       2428.9461    
        159000   969.3103      -445.50776      13.406371     -432.10139      12530.411      13.44227       13.44227       13.44227       2428.9461    
        160000   918.63819     -447.56984      12.705534     -434.8643       8536.2361      13.44227       13.44227       13.44227       2428.9461    
        161000   969.33864     -448.7203       13.406763     -435.31353      8937.9252      13.44227       13.44227       13.44227       2428.9461    
        162000   903.2513      -448.1911       12.49272      -435.69838      6702.4355      13.44227       13.44227       13.44227       2428.9461    
        163000   795.79596     -449.16258      11.006523     -438.15606      4923.056       13.44227       13.44227       13.44227       2428.9461    
        164000   806.73504     -446.44735      11.15782      -435.28953      9302.5683      13.44227       13.44227       13.44227       2428.9461    
        165000   950.94286     -446.89904      13.152334     -433.74671      9966.2733      13.44227       13.44227       13.44227       2428.9461    
        166000   982.43252     -445.50258      13.587863     -431.91472      10636.754      13.44227       13.44227       13.44227       2428.9461    
        167000   894.11295     -448.1689       12.366329     -435.80257      8273.6357      13.44227       13.44227       13.44227       2428.9461    
        168000   940.05823     -447.84592      13.001791     -434.84412      7811.2249      13.44227       13.44227       13.44227       2428.9461    
        169000   954.60066     -446.44533      13.202925     -433.2424       8525.8779      13.44227       13.44227       13.44227       2428.9461    
        170000   891.02694     -447.11949      12.323647     -434.79584      6315.9767      13.44227       13.44227       13.44227       2428.9461    
        171000   820.64023     -446.65828      11.35014      -435.30814      6700.267       13.44227       13.44227       13.44227       2428.9461    
        172000   927.36112     -447.73684      12.826179     -434.91066      3356.1483      13.44227       13.44227       13.44227       2428.9461    
        174000   805.34588     -448.50089      11.138606     -437.36228      7259.0081      13.44227       13.44227       13.44227       2428.9461    
        175000   917.57253     -447.48652      12.690795     -434.79572      3965.3925      13.44227       13.44227       13.44227       2428.9461    
        176000   862.45248     -447.17391      11.928438     -435.24547      7410.1343      13.44227       13.44227       13.44227       2428.9461    
        177000   888.26593     -449.31061      12.28546      -437.02515      5133.7781      13.44227       13.44227       13.44227       2428.9461    
        178000   928.01925     -447.60273      12.835282     -434.76745      13497.351      13.44227       13.44227       13.44227       2428.9461    
        179000   928.5132      -446.12937      12.842113     -433.28725      7682.4814      13.44227       13.44227       13.44227       2428.9461    
        180000   780.09732     -447.65732      10.789398     -436.86793      4828.3269      13.44227       13.44227       13.44227       2428.9461    
        181000   954.91969     -447.30681      13.207337     -434.09948      7164.5291      13.44227       13.44227       13.44227       2428.9461    
        182000   967.69326     -446.67474      13.384006     -433.29073      53.98061       13.44227       13.44227       13.44227       2428.9461    
        183000   907.37937     -448.33498      12.549815     -435.78517      10026.747      13.44227       13.44227       13.44227       2428.9461    
        184000   961.35453     -449.32723      13.296336     -436.0309       6793.7497      13.44227       13.44227       13.44227       2428.9461    
        185000   898.7912      -444.98736      12.431033     -432.55633      11057.089      13.44227       13.44227       13.44227       2428.9461    
        186000   872.1631      -445.83323      12.062744     -433.77049      3163.7455      13.44227       13.44227       13.44227       2428.9461    
        187000   953.9991      -447.79383      13.194605     -434.59923      7799.4581      13.44227       13.44227       13.44227       2428.9461    
        188000   853.70051     -446.79945      11.807391     -434.99205      7155.6164      13.44227       13.44227       13.44227       2428.9461    
        189000   904.16233     -447.27755      12.505321     -434.77223      6458.5134      13.44227       13.44227       13.44227       2428.9461    
        190000   955.38615     -445.88396      13.213789     -432.67017      13407.872      13.44227       13.44227       13.44227       2428.9461    
        191000   868.84979     -446.47419      12.016919     -434.45727      5605.3551      13.44227       13.44227       13.44227       2428.9461    
        192000   946.62224     -449.23223      13.092577     -436.13965      7425.6747      13.44227       13.44227       13.44227       2428.9461    
        193000   991.6896      -446.31754      13.715896     -432.60165      12463.628      13.44227       13.44227       13.44227       2428.9461    
        194000   971.45787     -446.87584      13.436074     -433.43977      9789.9933      13.44227       13.44227       13.44227       2428.9461    
        195000   853.58226     -447.38632      11.805756     -435.58057      3902.412       13.44227       13.44227       13.44227       2428.9461    
        196000   742.65661     -448.30093      10.271561     -438.02936      4160.0535      13.44227       13.44227       13.44227       2428.9461    
        197000   961.42026     -448.80947      13.297245     -435.51223      6976.6933      13.44227       13.44227       13.44227       2428.9461    
        198000   953.8282      -447.17925      13.192241     -433.98701      9963.9553      13.44227       13.44227       13.44227       2428.9461    
        199000   867.81204     -448.32292      12.002566     -436.32036      7735.4293      13.44227       13.44227       13.44227       2428.9461    
        200000   767.00712     -447.3289       10.608349     -436.72055      8036.8208      13.44227       13.44227       13.44227       2428.9461    
    Loop time of 222.888 on 1 procs for 200000 steps with 108 atoms
    
    Performance: 77.528 ns/day, 0.310 hours/ns, 897.312 timesteps/s
    99.9% CPU use with 1 MPI tasks x 1 OpenMP threads
    
    MPI task timing breakdown:
    Section |  min time  |  avg time  |  max time  |%varavg| %total
    ---------------------------------------------------------------
    Pair    | 34.665     | 34.665     | 34.665     |   0.0 | 15.55
    Kspace  | 183.53     | 183.53     | 183.53     |   0.0 | 82.34
    Neigh   | 1.6978     | 1.6978     | 1.6978     |   0.0 |  0.76
    Comm    | 1.2218     | 1.2218     | 1.2218     |   0.0 |  0.55
    Output  | 0.044502   | 0.044502   | 0.044502   |   0.0 |  0.02
    Modify  | 1.4818     | 1.4818     | 1.4818     |   0.0 |  0.66
    Other   |            | 0.2509     |            |       |  0.11
    
    Nlocal:            108 ave         108 max         108 min
    Histogram: 1 0 0 0 0 0 0 0 0 0
    Nghost:           1249 ave        1249 max        1249 min
    Histogram: 1 0 0 0 0 0 0 0 0 0
    Neighs:           7292 ave        7292 max        7292 min
    Histogram: 1 0 0 0 0 0 0 0 0 0
    
    Total # of neighbors = 7292
    Ave neighs/atom = 67.518519
    Neighbor list builds = 5707
    Dangerous builds = 0
    Total wall time: 0:03:43
:::

### 1.5 LAMMPS 分子动力学模拟结果与分析

运行完成后，我们可以看到在当前文件夹下生成了以下几个文件：

- log.lammps：日志文件，记录了模拟过程中的各种输出信息，包括初始系统状态、MD过程中的能量、温度、压力等物理量，以及各种计算的结果。
- licl.dump：轨迹文件，记录了模拟系统在每个时间步长中所有原子的位置、速度等信息。
- licl.rdf：径向分布函数（RDF）文件，记录了每 Nfrequency 步数输出的 RDF。
- licl.msd：均方位移（MSD）文件，记录了模拟系统中离子的均方位移随时间的变化。


对于 licl.dump 文件，我们可以使用 OVITO 等软件对完整轨迹进行可视化。在这里，我们使用 ASE 仅查看最后一帧的图像。了解 ASE 的使用，请阅读[《快速开始 ASE》](https://bohrium.dp.tech/notebook/4918f71cdc61483389e060abfb04d324)


```python
# 以下命令判断该环境中是否存在所需模块，如果没有，则使用 pip 快速安装。
! if ! /opt/mamba/bin/pip show ase > /dev/null; then /opt/mamba/bin/pip install --upgrade --user ase; fi;
```


```python
from ase.io import lammpsrun
from ase.visualize import view
from ase import Atoms
import nglview

# 导入轨迹文件
traj = lammpsrun.read_lammps_dump('./LiCl_DP_Tutorial_Example/chapter1/licl.dump')

# 定义元素名称列表
elements = ['Li', 'Cl']

# 将元素名称分配给轨迹的原子
# 根据原子类型设置原子名称
for atom in traj:
    atom_type = atom.number - 1  # 原子类型从1开始，而列表索引从0开始
    atom.symbol = elements[atom_type]

print(traj)

view(traj, viewer='x3d')  # 该可视化需要运行后查看
```


    Atoms(symbols='Cl54Li54', pbc=True, cell=[13.4422702789, 13.4422702789, 13.4422702789])



对于 licl.rdf 文件，我们可以利用如下 Python 脚本进行进一步处理和绘图：

让我们先来 **了解一下什么是径向分布函数？为什么分子动力学中要计算径向分布函数？**

径向分布函数（Radial Distribution Function，RDF）是一种描述在固体、液体和气体等多原子系统中，原子或分子间相对位置和距离分布的统计量。它可以用来表示从一个选定的原子或分子出发，与其距离为 r 的其他原子或分子的概率密度。径向分布函数 g(r) 可以表示为：

$$
g(r) = \frac{N}{V} \times \frac{1}{\rho} \times \frac{dN}{dr}
$$

其中，N 是距离 r 范围内的原子或分子数，V 是体积，ρ 是原子或分子的平均密度，$(\frac{dN}{dr})$ 是在距离 r 附近的原子或分子数增加率。

我们以氧气为例。在氧气中，氧分子之间主要通过范德华力相互作用。我们可以计算氧分子间的径向分布函数来分析这种相互作用。

考虑氧气中的一个氧分子，以其为中心，计算距离 r 内其他氧分子的概率密度。径向分布函数 g(r) 描述了在距离 r 处找到另一个氧分子的概率密度，相对于在完全随机分布的情况下找到另一个氧分子的概率密度。

在氧气中计算氧分子之间的径向分布函数 g(r)，我们可以观察到：

1. 当 r 很小时，g(r) 接近 0，这意味着氧分子不可能位于非常接近的位置，这是由于它们之间的排斥力。

2. 随着 r 的增加，g(r) 的值会出现一个峰值，这个峰值对应于氧分子间最可能的距离，即范德华力最强的距离。

3. 当 r 继续增加时，g(r) 将逐渐趋于 1，这意味着在较大的距离范围内，氧分子的分布接近随机分布。

当 r 增加时，g(r) 趋近于1的原因是，g(r) 是相对于完全随机分布的概率密度。在距离很远时，原子或分子之间的相互作用变得微弱，分子分布趋近于随机。

当我们提到 g(r) 趋近于1时，我们是在描述这样一个现象：在较大的距离范围内，分子之间的相互作用变得不那么重要，因此它们的分布接近于随机分布。在这种情况下，实际系统中找到一个分子的概率与随机分布中找到一个分子的概率相近，因此 g(r) 接近1。

需要注意的是，g(r) 本身并不是概率，而是概率密度。在径向分布函数 g(r) 的情况下，它表示的是在距离 r 附近找到另一个分子的相对可能性，因此是一个概率密度函数。g(r) 的值并不直接反映在某个距离 r 处找到分子的概率，而是相对于随机分布的概率密度。因此，当 r 增加时，g(r) 不会无限增大，而是趋于一个稳定值，即 1。这表明分子分布在远离中心分子的区域趋近于随机。

从这个简单的例子中，我们可以看到径向分布函数是如何帮助我们了解氧分子间相互作用和分布的。同样的方法也可以应用于其他气体系统，以揭示其原子或分子间的相互作用和结构性质。

在分子动力学（Molecular Dynamics，MD）模拟中，径向分布函数是一种重要的工具，因为它可以提供关于系统的结构信息，帮助我们了解原子或分子间的相互作用和系统的组织方式。计算径向分布函数可以帮助我们：

1. 描述和量化原子或分子之间的距离分布，进而分析分子之间的相互作用和有序性；
2. 分析系统的相变过程，例如液体 - 固体相变、液体 - 气体相变等；
3. 了解系统的局部结构，例如液体中的簇形成、气体中的原子或分子分布规律等；
4. 与实验数据（如 X 射线衍射、中子散射等）进行对比，验证模拟结果的准确性。

因此，在分子动力学模拟中计算径向分布函数对于分析和解释模拟结果具有重要意义。


```python
# 以下命令判断该环境中是否存在所需模块，如果没有，则使用 pip 快速安装。
! if ! pip show matplotlib > /dev/null; then pip install matplotlib; fi;
```


```python
import numpy as np
import matplotlib.pyplot as plt

nbins = 100 # define the number of bins in the RDF

with open("./LiCl_DP_Tutorial_Example/chapter1/licl.rdf", "r") as f: # read the licl.rdf file
    lines = f.readlines()
    lines = lines[3:]

    data = np.zeros((nbins, 7))  
    count = 0  

    for line in lines:  
        nums = line.split()      
        if len(nums) == 8:  
            for i in range(1, 8):  
                data[int(nums[0])-1, i-1] += float(nums[i])  # accumulatie data for each bin  
        if len(nums) == 2:  
            count += 1                                       # count the number of accumulations for each bin
       
ave_rdf = data / count                                       # calculate the averaged RDF data
np.savetxt('./LiCl_DP_Tutorial_Example/chapter1/ave_rdf.txt', ave_rdf)

labels = ['Li-Li', 'Li-Cl', 'Cl-Cl']
colors = ['orange', 'purple', 'green']
for i, label, color in zip(range(1, 7, 2), labels, colors):
    plt.plot(ave_rdf[:, 0], ave_rdf[:, i], color=color, label=label)
plt.title('RDF')
plt.xlabel('r/Å')
plt.ylabel('g(r)')
plt.legend()
plt.savefig('./LiCl_DP_Tutorial_Example/chapter1/rdf.png', dpi=300)
plt.show()

```


    
![png](output_29_0.png)
    


对于 licl.msd 文件，我们可以利用如下 Python 脚本进行进一步处理计算得到扩散系数 D 和绘图：

**我们如何通过均方位移（MSD）来计算扩散系数呢？**

我们可以通过均方位移（MSD）计算扩散系数，因为它们之间存在直接的数学关系。扩散系数是一个衡量粒子在物质中传播的速度的物理量，它与粒子的均方位移（MSD）相关。

在扩散过程中，粒子的运动符合随机游走或布朗运动模型。对于三维随机游走，粒子在每个方向上的位移是独立的，我们可以将总的均方位移表示为三个方向的位移平方和的平均值：

$$
\operatorname{MSD}(t)=\left\langle\left|\Delta r_i(t)\right|^2\right\rangle=\frac{1}{N}\left\langle\sum_i\left|r_i(t)-r_i(0)\right|^2\right\rangle
$$

根据爱因斯坦关系（Einstein Relation）和菲克定律（Fick's Law），我们可以得到扩散系数（D）和均方位移之间的关系：

$$
D=\frac{1}{6} \lim _{t \rightarrow \infty} \frac{\mathrm{d}(\text { MSD })}{\mathrm{d} t}
$$

在这个公式中，$t$ 是时间，$D$ 是扩散系数。公式表明，MSD 随时间线性增长，其斜率与扩散系数成正比。因此，我们可以通过对 MSD 数据进行线性拟合，计算出 MSD 与时间的线性关系，从而获得扩散系数。

需要注意的是，这种方法基于扩散过程中粒子的运动是随机的、无记忆的假设。在某些情况下，这种假设可能不成立，比如在有长程相互作用或有序晶格中的粒子运动。在这种情况下，我们需要采用其他方法来计算扩散系数。然而，在许多实际应用中，尤其是液体和气体中的粒子扩散，使用 MSD 计算扩散系数是一种非常有效的方法。


```python
import numpy as np
import matplotlib.pyplot as plt

data = np.loadtxt('./LiCl_DP_Tutorial_Example/chapter1/licl.msd', skiprows=2)

time = data[:, 0]
msd1 = data[:, 1]
msd2 = data[:, 2]

plt.plot(time/1000, msd1, 'b-', label='$Li^+$') # 1fs= 1/1000ps
plt.plot(time/1000, msd2, 'r-', label='$Cl^-$')
plt.xlabel('time(ps)') 
plt.ylabel('$MSD(A^2)$')
plt.title('msd')
plt.legend()
plt.savefig('./LiCl_DP_Tutorial_Example/chapter1/msd.png', dpi=300)
plt.show()

# 计算扩散系数
slope1, residuals = np.polyfit(time, msd1, 1)  # 使用 numpy 的 polyfit 函数对 Li+ 和 Cl- 离子的均方位移数据进行一阶多项式（线性）拟合得到斜率
slope2, residuals = np.polyfit(time, msd2, 1)  # 这里，我们假设 MSD 与时间成线性关系，即 MSD(t) = 6*D*t，其中 D 是扩散系数。

Diff1 = slope1/6 * 1e-5  # D=1/6*slope; 1 A^2/fs = 1e-5 m^2/s
Diff2 = slope2/6 * 1e-5

print(f"Diffusion Coefficients of Li+: {Diff1} m^2/s")
print(f"Diffusion Coefficients of Cl-: {Diff2} m^2/s")
```


    
![png](output_33_0.png)
    


    Diffusion Coefficients of Li+: 7.543639618987788e-09 m^2/s
    Diffusion Coefficients of Cl-: 3.5602726197335397e-09 m^2/s


以及从均方位移导出的扩散系数的数值：
```
Diffusion Coefficients of Li+: 7.543639618987788e-09 m^2/s
Diffusion Coefficients of Cl-: 3.5602726197335397e-09 m^2/s
```

注意：扩散系数的值可能和[文献](https://doi.org/10.1021/jp5050332)报道存在差异。我们可以考虑以下几个方面，以获得更准确的值：

- 首先在 NPT 系综进行模拟，将压力固定在 0 GPa，获得平衡体积。然后在平衡体积下进行 NVT 模拟。
- 使用更大的模拟盒子。
- 设置更长的模拟时间。

## 章节 2：ABACUS 第一性原理计算

对于 LiCl 熔体，我们还可以使用 ABACUS (Atomic-orbital Based Ab-initio Computation at UStc) 软件进行第一性原理计算。ABACUS 是一个基于密度泛函理论（DFT）的材料模拟软件，可以准确地计算原子间相互作用。通过使用 ABACUS，我们可以从电子结构层面研究 LiCl 熔体的性质。

### 本章节目标

在学习本章节后，你能够：

- 熟悉 ABACUS 软件的输入和输出文件；
- 为 LiCl 熔体编写 ABACUS SCF 计算输入文件并进行计算；
- 为 LiCl 熔体编写 ABACUS MD 计算输入文件并进行计算；

### 2.1 下载教程资源

在本章节中，我们以 LiCl 熔体分子为例,进行 ABACUS 第一性原理计算。我们已经在 *LiCl_DP_Tutorial_Example/chapter2* 中准备了需要的文件，使用以下命令下载：

本教程采用 ABACUS v3.1.0 完成。


```python
! if ! [ -e LiCl_DP_Tutorial_Example ]; then wget https://bohrium-example.oss-cn-zhangjiakou.aliyuncs.com/notebook/LiCl_DP_Tutorial/LiCl_DP_Tutorial_Example.zip && unzip LiCl_DP_Tutorial_Example.zip; fi;
```

在 *LiCl_DP_Tutorial_Example/chapter2* 文件夹中存在如下 5 种文件：

- `INPUT`：包含了计算过程中所需的各种参数，定义和控制计算任务；
- `STRU`：结构文件，包含了原子种类、原子位置、晶格常数以及晶格向量等信息；
- `KPT`：包含了布里渊区积分所需的k点信息；
- `*.upf`：包含了原子的赝势信息；
- `*.orb`：包含了原子轨道的数值表示；

### 2.2 ABACUS 自洽计算

首先，我们将使用 ABACUS 软件为 LiCl 熔体执行自洽计算。

自洽，是自洽场计算(SCF, self-consistent field calculation)的简称，它是密度泛函理论（DFT）算法的基础，也是 DFT 被称为第一性原理方法的原因。

从自洽场计算中我们可以得到一个体系的**基态结构**和**基态能量**。

基态结构使得我们可以得到体系的结构参数，例如晶胞参数，化学键键长键角等，而基态能量使得我们可以进一步得到原子受力和晶体材料的应力-应变性质等。

因此自洽场计算是开始做 DFT 计算的基础。

#### 2.2.1 ABACUS 自洽计算输入文件

你刚才下载了我们为本案例准备的 ABACUS 输入文件，让我们来通过以下命令查看。

1. *INPUT* 文件。INPUT 文件包含了与 LiCl 熔体 SCF 计算的相关参数：


```python
! cd ./LiCl_DP_Tutorial_Example/chapter2/abacus_scf && cat INPUT
```

    INPUT_PARAMETERS
    
    #Parameters (1.General)
    ntype                   2
    symmetry                0
    vdw_method              d3_bj
    
    #Parameters (2.Iteration)
    ecutwfc                 100
    scf_thr                 1e-7
    scf_nmax                120
    
    #Parameters (3.Basis)
    basis_type              lcao
    
    #Parameters (4.Smearing)
    smearing_method         gauss
    smearing_sigma          0.002
    
    #Parameters (5.Mixing)
    mixing_type             pulay
    mixing_beta             0.4
    
    #Parameters (6.sfc)
    calculation             scf
    cal_force               1
    cal_stress              1

对 INPUT 中各参数的介绍如下：

```
INPUT_PARAMETERS

#Parameters (1.General)
ntype                   2           # 原子种类的数量，这里设置为 2
symmetry                0           # 是否使用晶体对称性，0 表示不使用
vdw_method              d3_bj       # 范德华力的计算方法，这里选择 D3 方法，使用 Becke-Johnson 阻尼函数（d3_bj）

#Parameters (2.Iteration)
ecutwfc                 100         # 平面波基组截断能，这里设为 100 Ry
scf_thr                 1e-7        # 自洽场收敛阈值，设为 1.0e-7
scf_nmax                120         # 自洽场迭代的最大步数，设为 120

#Parameters (3.Basis)
basis_type              lcao        # 基组类型，这里选择线性组合原子轨道（LCAO）                     

#Parameters (4.Smearing)
smearing_method         gauss       # 展宽方法，这里选择高斯展宽（gauss）
smearing_sigma          0.002       # 展宽参数，这里设为 0.002 Ry

#Parameters (5.Mixing)
mixing_type             pulay       # 电荷密度混合方法，这里选择 Pulay 混合
mixing_beta             0.4         # 混合参数，设为 0.4

#Parameters (6.sfc)
calculation             scf                
cal_force               1           # 是否计算原子受力，设为 1 表示计算
cal_stress              1           # 是否计算应力，设为 1 表示计算
```

2. *STRU* 文件。STRU 文件包含了 LiCl 熔体的原子种类、原子位置、晶格常数以及晶格向量等信息。考虑到 DFT 计算成本相对较高，这里设计了一个较小的计算体系（64原子）：


```python
! cd ./LiCl_DP_Tutorial_Example/chapter2/abacus_scf && cat STRU
```

    ATOMIC_SPECIES
    Li 6.941 Li_ONCV_PBE-1.2.upf
    Cl 35.453 Cl_ONCV_PBE-1.2.upf
    
    NUMERICAL_ORBITAL
    Li_gga_8au_100Ry_4s1p.orb
    Cl_gga_8au_100Ry_2s2p1d.orb
    
    LATTICE_CONSTANT
    1.8897261246257702
    
    LATTICE_VECTORS
    11.858 0.0 0.0 
    0.0 11.858 0.0 
    0.0 0.0 11.858 
    
    ATOMIC_POSITIONS
    Cartesian    # Cartesian(Unit is LATTICE_CONSTANT)
    Li
    0.0
    32
    3.01682  1.77597  4.37873  1  1  1
    3.47660  5.23243  2.05957  1  1  1
    0.90851  3.90744  4.56133  1  1  1
    1.45547  -0.05347  0.89671  1  1  1
    9.58599  4.38419  1.31575  1  1  1
    5.33635  11.08600  4.46604  1  1  1
    7.53108  3.19151  10.88540  1  1  1
    6.20144  2.27490  2.29226  1  1  1
    10.86000  11.28090  4.03153  1  1  1
    8.72296  1.91404  5.01236  1  1  1
    0.56714  5.94286  11.29220  1  1  1
    4.56436  1.51683  10.93970  1  1  1
    6.47417  6.48432  2.26679  1  1  1
    2.67649  9.86711  5.62938  1  1  1
    10.52500  6.89521  4.55821  1  1  1
    7.31791  10.82390  10.75460  1  1  1
    9.98168  8.34648  1.34799  1  1  1
    8.55005  9.02160  5.95048  1  1  1
    0.22956  2.27927  10.61770  1  1  1
    5.35174  4.64974  5.89709  1  1  1
    2.77623  2.83912  8.65057  1  1  1
    0.72266  0.78088  7.23018  1  1  1
    9.32377  4.62855  7.16868  1  1  1
    7.04620  1.65735  7.19938  1  1  1
    9.46563  0.30375  0.94568  1  1  1
    0.33212  9.50630  8.83283  1  1  1
    2.15335  5.79070  7.99947  1  1  1
    3.67904  11.03680  8.96262  1  1  1
    5.68956  7.47681  6.72704  1  1  1
    4.38374  7.94229  10.64750  1  1  1
    9.46514  7.37079  8.86447  1  1  1
    9.83567  11.76610  9.57714  1  1  1
    Cl
    0.0
    32
    2.40263  3.44380  3.15593  1  1  1
    4.71432  5.62464  3.99601  1  1  1
    5.02722  1.62164  4.70153  1  1  1
    2.01218  2.40381  6.74421  1  1  1
    11.34250  5.35053  5.74131  1  1  1
    5.73025  3.70554  0.70594  1  1  1
    8.40485  2.87640  2.43455  1  1  1
    10.28650  2.52149  11.26940  1  1  1
    8.49700  7.00646  2.73858  1  1  1
    11.20110  0.08803  2.05881  1  1  1
    4.15535  7.02362  0.82488  1  1  1
    2.06075  10.42340  7.60314  1  1  1
    2.84183  11.23460  4.03930  1  1  1
    5.11946  9.46550  6.20652  1  1  1
    6.79921  0.74965  -0.06418  1  1  1
    11.24310  6.60439  0.79167  1  1  1
    10.99020  8.95220  4.58075  1  1  1
    2.66309  1.24239  11.46430  1  1  1
    1.50200  4.24863  10.00090  1  1  1
    4.58981  1.26528  8.80842  1  1  1
    4.17519  5.64115  7.14293  1  1  1
    7.53446  3.25664  6.13640  1  1  1
    8.18598  0.50707  8.64081  1  1  1
    10.58380  1.54594  5.84851  1  1  1
    0.05259  0.20666  9.59310  1  1  1
    1.53699  7.84114  9.74525  1  1  1
    5.13504  9.58460  9.80476  1  1  1
    9.50581  10.09210  11.41870  1  1  1
    8.14839  10.98370  4.15793  1  1  1
    10.36210  9.23839  8.34472  1  1  1
    9.08894  5.61878  9.58466  1  1  1
    8.15206  7.23734  6.57717  1  1  1


STRU 文件介绍如下：

```
ATOMIC_SPECIES
Li 6.941 Li_ONCV_PBE-1.2.upf           # 元素，原子质量，使用的赝势文件
Cl 35.453 Cl_ONCV_PBE-1.2.upf

NUMERICAL_ORBITAL
Li_gga_8au_100Ry_4s1p.orb              # 数值轨道文件
Cl_gga_8au_100Ry_2s2p1d.orb

LATTICE_CONSTANT
1.889726                               # 1.889726 Bohr =  1.0 Angstrom

LATTICE_VECTORS
11.858 0.0 0.0                         # 晶格向量
0.0 11.858 0.0 
0.0 0.0 11.858 

ATOMIC_POSITIONS
Cartesian                              # 以笛卡尔坐标表示（Cartesian），单位为晶格常数
Li                                     # 元素名称
0.0                                    # 元素磁性
32                                     # 原子个数
3.01682  1.77597  4.37873  1  1  1     # 每个原子x，y，z方向的坐标和约束条件（1表示允许在该方向上移动，0表示固定）
3.47660  5.23243  2.05957  1  1  1
0.90851  3.90744  4.56133  1  1  1
...（省略）
Cl
0.0
32
2.40263  3.44380  3.15593  1  1  1
4.71432  5.62464  3.99601  1  1  1
5.02722  1.62164  4.70153  1  1  1
...（省略）

```

3. *KPT* 文件。KPT 文件包含了 LiCl 熔体 SCF 计算的 k 点设置：


```python
! cd ./LiCl_DP_Tutorial_Example/chapter2/abacus_scf && cat KPT
```

    K_POINTS
    0
    Gamma
    1 1 1 0 0 0


4. `*.upf` 和 `*.orb` 文件。对于 Li 和 Cl，分别采用 Li_ONCV_PBE-1.2.upf 和 Cl_ONCV_PBE-1.2.upf，以及 Li_gga_8au_100Ry_4s1p.orb 和 Cl_gga_8au_100Ry_2s2p1d.orb。各原子的 upf 和 orb 文件可以从 ABACUS 官网下载。

#### 2.2.2 运行 ABACUS 自洽计算

准备好以上所有输入文件后，我们可以执行 LiCl 熔体的 SCF 计算。例如，使用命令行：

- 在此镜像中，由于 ABACUS 是基于 intel oneapi 的环境安装的，我们运行 abacus 之前需要使用命令
`. /opt/intel/oneapi/setvars.sh` 装载相应的环境。
- 设置 `OMP_NUM_THREADS=1` 使用单线程进行计算。
- `abacus` 为 ABACUS 可执行程序的命令。


```python
# ############### Time Warning: 1 minute ###################
! cd ./LiCl_DP_Tutorial_Example/chapter2/abacus_scf && . /opt/intel/oneapi/setvars.sh && OMP_NUM_THREADS=1 mpirun -np 32 abacus
```

     
    :: initializing oneAPI environment ...
       dash: SH_VERSION = unknown
       args: Using "$@" for setvars.sh arguments: 
    :: compiler -- latest
    :: debugger -- latest
    :: dev-utilities -- latest
    :: mkl -- latest
    :: mpi -- latest
    :: tbb -- latest
    :: vtune -- latest
    :: oneAPI environment initialized ::
     
                                                                                         
                                  ABACUS v3.1                                            
    
                   Atomic-orbital Based Ab-initio Computation at UStc                    
    
                         Website: http://abacus.ustc.edu.cn/                             
                   Documentation: https://abacus.deepmodeling.com/                       
                      Repository: https://github.com/abacusmodeling/abacus-develop       
                                  https://github.com/deepmodeling/abacus-develop         
    
     Sun May 21 16:12:48 2023
     MAKE THE DIR         : OUT.ABACUS/
    
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
     Warning: number valence electrons > 1 for Li: [He] 2s1
     Please make sure the pseudopotential file is what you need
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    
     UNIFORM GRID DIM     : 144 * 144 * 144
     UNIFORM GRID DIM(BIG): 48 * 48 * 48
     DONE(0.283338   SEC) : SETUP UNITCELL
     DONE(0.298388   SEC) : INIT K-POINTS
     ---------------------------------------------------------
     Self-consistent calculations for electrons
     ---------------------------------------------------------
     SPIN    KPOINTS         PROCESSORS  NBASE       
     1       1               32          640         
     ---------------------------------------------------------
     Use Systematically Improvable Atomic bases
     ---------------------------------------------------------
     ELEMENT ORBITALS        NBASE       NATOM       XC          
     Li      4s1p-8au        7           32          
     Cl      2s2p1d-8au      13          32          
     ---------------------------------------------------------
     Initial plane wave basis and FFT box
     ---------------------------------------------------------
     -------------------------------------------
     SELF-CONSISTENT : 
     -------------------------------------------
     START CHARGE      : atomic
     DONE(5.31355    SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944585e+04  0.000000e+00   1.040e-01  3.060e+00  
     GE2    -1.944795e+04  -2.106730e+00  4.813e-02  2.738e+00  
     GE3    -1.944810e+04  -1.467778e-01  2.243e-02  2.775e+00  
     GE4    -1.944812e+04  -2.553504e-02  2.190e-03  2.537e+00  
     GE5    -1.944812e+04  -6.356405e-04  7.985e-04  2.908e+00  
     GE6    -1.944812e+04  -3.915076e-05  1.419e-04  2.598e+00  
     GE7    -1.944812e+04  -4.710544e-06  2.405e-05  2.538e+00  
     GE8    -1.944812e+04  -8.613139e-08  8.159e-06  2.616e+00  
     GE9    -1.944812e+04  -1.534414e-08  1.821e-06  2.708e+00  
     GE10   -1.944812e+04  -3.217321e-10  5.889e-07  2.618e+00  
     GE11   -1.944812e+04  -8.971375e-11  7.240e-08  2.713e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     1.431e+01      6.895e-02      -1.646e+00     
     6.895e-02      6.743e+00      -3.705e+00     
     -1.646e+00     -3.705e+00     5.271e+00      
     TOTAL-PRESSURE: 8.776e+00 KBAR
    
      |CLASS_NAME---------|NAME---------------|TIME(Sec)-----|CALLS----|AVG------|PER%-------
                           total               43.246         7         6.2       1e+02     %
       Driver              driver_line         43.17          1         43        1e+02     %
       PW_Basis            setup_struc_factor  0.21911        1         0.22      0.51      %
       ORB_control         read_orb_first      0.24099        1         0.24      0.56      %
       LCAO_Orbitals       Read_Orbitals       0.24098        1         0.24      0.56      %
       ORB_control         set_orb_tables      3.4965         1         3.5       8.1       %
       ORB_gen_tables      gen_tables          3.4965         1         3.5       8.1       %
       ORB_table_phi       init_Table          2.0207         1         2         4.7       %
       ORB_table_phi       cal_ST_Phi12_R      1.9999         178       0.011     4.6       %
       ORB_table_beta      init_Table_Beta     0.81573        1         0.82      1.9       %
       ORB_table_beta      VNL_PhiBeta_R       0.81111        96        0.0084    1.9       %
       ppcell_vl           init_vloc           0.153          1         0.15      0.35      %
       ESolver_KS_LCAO     Run                 30.543         1         31        71        %
       ESolver_KS_LCAO     beforescf           0.7139         1         0.71      1.7       %
       Vdwd3               cal_energy          0.11785        1         0.12      0.27      %
       ESolver_KS_LCAO     beforesolver        0.16884        1         0.17      0.39      %
       ESolver_KS_LCAO     set_matrix_grid     0.15355        1         0.15      0.36      %
       Charge              atomic_rho          0.18988        1         0.19      0.44      %
       PW_Basis            recip2real          0.5243         65        0.0081    1.2       %
       PW_Basis            gathers_scatterp    0.30265        65        0.0047    0.7       %
       Potential           init_pot            0.19875        1         0.2       0.46      %
       Potential           update_from_charge  2.4095         12        0.2       5.6       %
       Potential           cal_v_eff           2.3999         12        0.2       5.5       %
       H_Hartree_pw        v_hartree           0.2392         12        0.02      0.55      %
       PW_Basis            real2recip          0.75115        100       0.0075    1.7       %
       PW_Basis            gatherp_scatters    0.40534        100       0.0041    0.94      %
       PotXC               cal_v_eff           2.1488         12        0.18      5         %
       XC_Functional       v_xc                2.1412         12        0.18      5         %
       HSolverLCAO         solve               27.088         11        2.5       63        %
       HamiltLCAO          updateHk            12.089         11        1.1       28        %
       OperatorLCAO        init                11.552         22        0.53      27        %
       Veff                contributeHk        11.551         11        1.1       27        %
       Gint_interface      cal_gint            21.876         23        0.95      51        %
       Gint_interface      cal_gint_vlocal     8.8795         11        0.81      21        %
       Gint_Tools          cal_psir_ylm        4.9551         101376    4.9e-05   11        %
       Gint_k              folding_vl_k        2.6715         11        0.24      6.2       %
       Gint_k              Distri              2.6232         11        0.24      6.1       %
       Nonlocal<LCAO>      contributeHR        0.13104        1         0.13      0.3       %
       LCAO_gen_fixedH     b_NL_mu_new         0.30996        2         0.15      0.72      %
       OperatorLCAO        folding_fixed       0.3156         11        0.029     0.73      %
       LCAO_nnr            folding_fixedH      0.3129         11        0.028     0.72      %
       HSolverLCAO         hamiltSolvePsiK     2.0622         11        0.19      4.8       %
       DiagoElpa           elpa_solve          1.9847         11        0.18      4.6       %
       ElecStateLCAO       psiToRho            12.937         11        1.2       30        %
       elecstate           cal_dm              0.15879        12        0.013     0.37      %
       psiMulPsiMpi        pdgemm              0.15738        12        0.013     0.36      %
       LCAO_Charge         cal_dk_k            1.7925         11        0.16      4.1       %
       Gint_interface      cal_gint_rho        8.6049         11        0.78      20        %
       Charge              mix_rho             0.26864        10        0.027     0.62      %
       Charge              Pulay_mixing        0.25845        10        0.026     0.6       %
       Force_Stress_LCAO   getForceStress      8.0874         1         8.1       19        %
       Forces              cal_force_loc       0.1893         1         0.19      0.44      %
       Forces              cal_force_ew        0.17528        1         0.18      0.41      %
       Forces              cal_force_scc       0.34962        1         0.35      0.81      %
       Stress_Func         stress_loc          0.23114        1         0.23      0.53      %
       Stress_Func         stress_ewa          0.29553        1         0.3       0.68      %
       Force_LCAO_k        ftable_k            6.0508         1         6.1       14        %
       Force_LCAO_k        allocate_k          0.34505        1         0.35      0.8       %
       Force_LCAO_k        cal_fvl_dphi_k      4.392          1         4.4       10        %
       Gint_interface      cal_gint_force      4.392          1         4.4       10        %
       Gint_Tools          cal_dpsir_ylm       2.5395         4608      0.00055   5.9       %
       Gint_Tools          cal_dpsirr_ylm      0.31787        4608      6.9e-05   0.74      %
       Force_LCAO_k        cal_fvnl_dbeta_k_new0.33316        1         0.33      0.77      %
       Vdwd3               cal_force           0.36799        1         0.37      0.85      %
       Vdwd3               cal_stress          0.29476        1         0.29      0.68      %
     ----------------------------------------------------------------------------------------
    
     START  Time  : Sun May 21 16:12:48 2023
     FINISH Time  : Sun May 21 16:13:31 2023
     TOTAL  Time  : 43
     SEE INFORMATION IN : OUT.ABACUS/


#### 2.2.3 结果与分析

主要的计算信息被储存在文件 *OUT.ABACUS/running_scf.log* 中

我们可以使用 `cat LiCl_DP_Tutorial_Example/chapter2/OUT.ABACUS/running_scf.log` 查看该文件。


在这里，我们提供一个示例来聚焦于重要内容：

```

                                                                                     
                             WELCOME TO ABACUS v3.0                                  
                                                                                     
               'Atomic-orbital Based Ab-initio Computation at UStc'                  
                                                                                     
                     Website: http://abacus.ustc.edu.cn/                             
                                                                                     
    Version: Parallel, in development
    Processor Number is 16
    Start Time is Fri Mar 17 11:12:54 2023
                                                                                     
 ------------------------------------------------------------------------------------

...（省略）

 LCAO ALGORITHM --------------- ION=   1  ELEC=   1--------------------------------

 Density error is 0.104045211662

       Energy                       Rydberg                            eV
   E_KohnSham                 -1429.2427444                 -19445.845149
     E_Harris                -1430.40301784                 -19461.631479
      E_Fermi              +0.0524155151601               +0.713149669783

...（省略）

 LCAO ALGORITHM --------------- ION=   1  ELEC=  11--------------------------------
 Memory of pvpR : 2.89599609375 MB

 Density error is 7.23978511026e-08

       Energy                       Rydberg                            eV
   E_KohnSham                -1429.41030086                -19448.1248715
     E_Harris                -1429.41030086                -19448.1248715
       E_band                -310.415111989                -4223.41426836
   E_one_elec                -849.674984163                -11560.4212327
    E_Hartree                +459.864819535                +6256.78185542
         E_xc                -294.061400137                -4000.91060373
      E_Ewald                -744.876355072                -10134.5627344
      E_demet            -3.01381081966e-88            -4.10049998414e-87
      E_descf                            +0                            +0
      E_vdwD3                -0.66238101901                -9.01215610558
        E_exx                            +0                            +0
      E_Fermi              +0.0508640615939                 +0.6920410611

 charge density convergence is achieved
 final etot is -19448.1248715 eV

...（省略）

```

可以看到，经过 11 次迭代后，电荷密度收敛，密度误差达到 7.23978511026e-08，最终总能量为 -19448.1248715 eV。

**在这个练习中，我们熟悉了 ABACUS 软件的输入文件，学会了如何为 LiCl 熔体编写 ABACUS SCF计算输入文件，执行计算并查看计算收敛情况。**

### 2.3 ABACUS 量子分子动力学计算

量子分子动力学（Quantum Molecular Dynamics，QMD）：将量子力学的原理应用于分子动力学中，考虑电子的波动性和粒子性。

除了 1.4 与 2.3 中提到的两种分子动力学外，还有如：

- 蒙特卡罗分子动力学（Monte Carlo Molecular Dynamics，MCMD）：使用随机模拟的方法来模拟分子的运动，通过统计模拟得到分子系统的状态。

- 多尺度分子动力学（Multiscale Molecular Dynamics，MMD）：将不同尺度的分子动力学方法结合起来，以提高模拟效率和准确性。

- 拉格朗日分子动力学（Lagrangian Molecular Dynamics，LMD）：采用拉格朗日力学的方法来描述分子系统的运动。

- **基于机器学习的分子动力学（Machine Learning Molecular Dynamics，MLMD）：利用机器学习方法来辅助分子动力学模拟，以提高模拟效率和准确性。**

在这篇教程中即将学习的 DeePMD-kit 即为基于机器学习的分子动力学。

#### 2.3.1 ABACUS MD 计算输入文件

ABACUS MD 计算所需的输入文件与上述 ABACUS SCF 计算的输入文件相似。

我们仅需要修改 INPUT 文件，而其他文件无需更改。修改后的 INPUT 文件示例如下：

```
INPUT_PARAMETERS

#Parameters (1.General)
ntype           2              
symmetry        0                      
vdw_method      d3_bj          

#Parameters (2.Iteration)
ecutwfc         100            
scf_thr         1.0e-7         
scf_nmax        120            

#Parameters (3.Basis)        
basis_type      lcao           
          
#Parameters (4.Smearing)
smearing_method	gauss          
smearing_sigma	0.002          

#Parameters (5.Mixing)
mixing_type	pulay          
mixing_beta	0.4            

#Parameters (6.md)
calculation     md             # calculation：计算类型，这里选择分子动力学（md）
cal_force       1              
cal_stress      1              
md_nstep        500            # md_nstep：分子动力学模拟的总步数，设为 500
md_type         1              # md_type：模拟类型，这里选择 NVT 系综
md_dt           1              # md_dt：时间步长，设为 1
md_tfirst       900            # md_tfirst：目标温度，设为 900 K
md_restart      0              # md_restart：是否为续算，设为 0 表示不是续算
md_dumpfreq     1              # md_dumpfreq：输出分子动力学信息的频率，设为 1 表示每一步都输出
out_stru        1              # out_stru：输出结构信息的选项，设为 1 表示输出
```
INPUT 文件定义了 LiCl 熔体的分子动力学（MD）模拟。与之前的 LAMMPS MD 一致，模拟在 NVT 系综下进行，时间步长 $1 fs$，温度为 900 K。

在 *LiCl_DP_Tutorial_Example/chapter2/abacus_md/* 文件夹中我们为你准备好了本次计算所需的输入文件。

考虑到 DFT 计算成本相对较高，这里模拟时间为 $0.5 ps$ ($1 ps = 1000 fs = 10^{-12} s$)。

注意：使用 LCAO 基组计算时，通常需测试能量、力、应力对不同轨道半径截断值和不同 k 点（k_spacing）设置的收敛性。出于简化教程的目的，这里我们没有做这样的测试。

#### 2.3.2 运行 ABACUS MD 计算

准备好以上所有输入文件后，我们可以执行 LiCl 熔体的MD计算。例如，使用命令行：

**注意：** 由于我们需要的 ABACUS 版本为 ABACUS 3.1，这一步需将镜像更换为`abacus:3.1.4-toolkit-notebook`。


```python
# ############ Time Warning: 9 h 30 mins 58 secs ############
# 该命令的输出极长，你可以右键单击输出内容，选择滚动模式查看输出，或直接点击左侧蓝条隐藏输出。
! cd ./LiCl_DP_Tutorial_Example/chapter2/abacus_md && . /opt/intel/oneapi/setvars.sh && OMP_NUM_THREADS=1 mpirun -np 32 abacus
```

::: details Output 
    :: initializing oneAPI environment ...
       dash: SH_VERSION = unknown
       args: Using "$@" for setvars.sh arguments: 
    :: compiler -- latest
    :: debugger -- latest
    :: dev-utilities -- latest
    :: mkl -- latest
    :: mpi -- latest
    :: tbb -- latest
    :: vtune -- latest
    :: oneAPI environment initialized ::
     
                                                                                         
                                  ABACUS v3.1                                            
    
                   Atomic-orbital Based Ab-initio Computation at UStc                    
    
                         Website: http://abacus.ustc.edu.cn/                             
                   Documentation: https://abacus.deepmodeling.com/                       
                      Repository: https://github.com/abacusmodeling/abacus-develop       
                                  https://github.com/deepmodeling/abacus-develop         
    
     Sun May 21 16:17:00 2023
     MAKE THE DIR         : OUT.ABACUS/
     MAKE THE STRU DIR    : OUT.ABACUS/STRU/
    
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
     Warning: number valence electrons > 1 for Li: [He] 2s1
     Please make sure the pseudopotential file is what you need
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    
     UNIFORM GRID DIM     : 144 * 144 * 144
     UNIFORM GRID DIM(BIG): 48 * 48 * 48
     DONE(0.274503   SEC) : SETUP UNITCELL
     DONE(0.311294   SEC) : INIT K-POINTS
     ---------------------------------------------------------
     Molecular Dynamics simulations
     ---------------------------------------------------------
     ENSEMBLE                 : NVT
     Time interval(fs)        : 1
     ---------------------------------------------------------
     SPIN    KPOINTS         PROCESSORS  NBASE       
     1       1               32          640         
     ---------------------------------------------------------
     Use Systematically Improvable Atomic bases
     ---------------------------------------------------------
     ELEMENT ORBITALS        NBASE       NATOM       XC          
     Li      4s1p-8au        7           32          
     Cl      2s2p1d-8au      13          32          
     ---------------------------------------------------------
     Initial plane wave basis and FFT box
     ---------------------------------------------------------
    --------------------------------- INITVEL DONE ------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 0
     -------------------------------------------
     START CHARGE      : atomic
     DONE(5.22409    SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944585e+04  0.000000e+00   1.040e-01  2.936e+00  
     GE2    -1.944795e+04  -2.106730e+00  4.813e-02  2.802e+00  
     GE3    -1.944810e+04  -1.467778e-01  2.243e-02  2.767e+00  
     GE4    -1.944812e+04  -2.553504e-02  2.190e-03  2.674e+00  
     GE5    -1.944812e+04  -6.356405e-04  7.985e-04  2.663e+00  
     GE6    -1.944812e+04  -3.915076e-05  1.419e-04  2.667e+00  
     GE7    -1.944812e+04  -4.710544e-06  2.405e-05  2.760e+00  
     GE8    -1.944812e+04  -8.613139e-08  8.159e-06  2.564e+00  
     GE9    -1.944812e+04  -1.534414e-08  1.821e-06  2.662e+00  
     GE10   -1.944812e+04  -3.217321e-10  5.889e-07  2.671e+00  
     GE11   -1.944812e+04  -8.971375e-11  7.240e-08  2.646e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     1.431e+01      6.895e-02      -1.646e+00     
     6.895e-02      6.743e+00      -3.705e+00     
     -1.646e+00     -3.705e+00     5.271e+00      
     TOTAL-PRESSURE: 8.776e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.147e+02          2.693e-01           9.000e+02           1.347e+01           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 1
     -------------------------------------------
     DONE(4.392e+01  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944810e+04  0.000000e+00   1.950e-03  2.775e+00  
     GE2    -1.944810e+04  -2.394310e-03  1.049e-03  2.654e+00  
     GE3    -1.944810e+04  -1.650769e-04  1.406e-04  2.562e+00  
     GE4    -1.944810e+04  -6.853193e-06  4.312e-05  2.556e+00  
     GE5    -1.944810e+04  -3.459177e-07  1.551e-05  2.749e+00  
     GE6    -1.944810e+04  -3.788704e-08  2.513e-06  2.756e+00  
     GE7    -1.944810e+04  -2.298528e-09  7.767e-07  2.588e+00  
     GE8    -1.944810e+04  -9.899448e-11  1.436e-07  2.830e+00  
     GE9    -1.944810e+04  -3.093578e-11  4.251e-08  2.646e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     1.370e+01      4.028e-01      -1.439e+00     
     4.028e-01      6.940e+00      -4.174e+00     
     -1.439e+00     -4.174e+00     5.615e+00      
     TOTAL-PRESSURE: 8.750e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.147e+02          2.685e-01           8.971e+02           1.343e+01           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 2
     -------------------------------------------
     DONE(7.707e+01  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944815e+04  0.000000e+00   1.949e-03  2.779e+00  
     GE2    -1.944815e+04  -2.395884e-03  1.050e-03  2.667e+00  
     GE3    -1.944815e+04  -1.639592e-04  1.408e-04  2.564e+00  
     GE4    -1.944815e+04  -6.894248e-06  4.275e-05  3.052e+00  
     GE5    -1.944815e+04  -3.300600e-07  1.551e-05  2.691e+00  
     GE6    -1.944815e+04  -3.672077e-08  2.547e-06  2.665e+00  
     GE7    -1.944815e+04  7.517393e-10   7.821e-07  2.567e+00  
     GE8    -1.944815e+04  -1.206495e-10  1.464e-07  2.549e+00  
     GE9    -1.944815e+04  -6.187155e-12  4.274e-08  2.736e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     1.282e+01      7.260e-01      -1.140e+00     
     7.260e-01      6.946e+00      -4.601e+00     
     -1.140e+00     -4.601e+00     5.802e+00      
     TOTAL-PRESSURE: 8.523e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.147e+02          2.703e-01           9.033e+02           1.323e+01           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 3
     -------------------------------------------
     DONE(1.102e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944827e+04  0.000000e+00   1.970e-03  3.191e+00  
     GE2    -1.944827e+04  -2.418738e-03  1.060e-03  2.843e+00  
     GE3    -1.944827e+04  -1.681375e-04  1.442e-04  2.664e+00  
     GE4    -1.944827e+04  -7.310124e-06  4.274e-05  2.718e+00  
     GE5    -1.944827e+04  -3.347622e-07  1.571e-05  2.585e+00  
     GE6    -1.944827e+04  -3.635882e-08  2.627e-06  2.904e+00  
     GE7    -1.944827e+04  7.393650e-10   7.969e-07  2.808e+00  
     GE8    -1.944827e+04  -1.237431e-10  1.492e-07  2.655e+00  
     GE9    -1.944827e+04  -3.093578e-12  4.328e-08  2.624e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     1.173e+01      1.030e+00      -7.603e-01     
     1.030e+00      6.748e+00      -4.969e+00     
     -7.603e-01     -4.969e+00     5.829e+00      
     TOTAL-PRESSURE: 8.104e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.147e+02          2.747e-01           9.181e+02           1.289e+01           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 4
     -------------------------------------------
     DONE(1.445e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944845e+04  0.000000e+00   2.009e-03  2.897e+00  
     GE2    -1.944846e+04  -2.462904e-03  1.077e-03  2.568e+00  
     GE3    -1.944846e+04  -1.772813e-04  1.506e-04  2.760e+00  
     GE4    -1.944846e+04  -8.043961e-06  4.312e-05  2.669e+00  
     GE5    -1.944846e+04  -3.507993e-07  1.607e-05  2.755e+00  
     GE6    -1.944846e+04  -3.917088e-08  2.740e-06  2.563e+00  
     GE7    -1.944846e+04  -9.002311e-10  8.192e-07  2.659e+00  
     GE8    -1.944846e+04  -1.082752e-10  1.517e-07  2.658e+00  
     GE9    -1.944846e+04  -2.784220e-11  4.412e-08  2.532e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     1.049e+01      1.308e+00      -3.162e-01     
     1.308e+00      6.347e+00      -5.267e+00     
     -3.162e-01     -5.267e+00     5.703e+00      
     TOTAL-PRESSURE: 7.513e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.147e+02          2.815e-01           9.406e+02           1.242e+01           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 5
     -------------------------------------------
     DONE(1.778e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944869e+04  0.000000e+00   2.058e-03  2.982e+00  
     GE2    -1.944869e+04  -2.544136e-03  1.100e-03  2.602e+00  
     GE3    -1.944869e+04  -1.903247e-04  1.590e-04  2.563e+00  
     GE4    -1.944869e+04  -8.997967e-06  4.388e-05  2.553e+00  
     GE5    -1.944869e+04  -3.817846e-07  1.654e-05  2.558e+00  
     GE6    -1.944869e+04  -4.287698e-08  2.873e-06  2.665e+00  
     GE7    -1.944869e+04  -1.011600e-09  8.460e-07  2.763e+00  
     GE8    -1.944869e+04  -1.330238e-10  1.540e-07  2.757e+00  
     GE9    -1.944869e+04  -6.187155e-12  4.522e-08  2.849e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     9.128e+00      1.555e+00      1.724e-01      
     1.555e+00      5.759e+00      -5.490e+00     
     1.724e-01      -5.490e+00     5.437e+00      
     TOTAL-PRESSURE: 6.775e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.147e+02          2.900e-01           9.691e+02           1.183e+01           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 6
     -------------------------------------------
     DONE(2.110e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944896e+04  0.000000e+00   2.114e-03  2.903e+00  
     GE2    -1.944896e+04  -2.644982e-03  1.126e-03  2.579e+00  
     GE3    -1.944896e+04  -2.058803e-04  1.685e-04  2.667e+00  
     GE4    -1.944896e+04  -1.004807e-05  4.500e-05  2.894e+00  
     GE5    -1.944896e+04  -4.152262e-07  1.704e-05  2.875e+00  
     GE6    -1.944896e+04  -4.498990e-08  3.014e-06  2.663e+00  
     GE7    -1.944896e+04  -1.039442e-09  8.751e-07  2.676e+00  
     GE8    -1.944896e+04  -1.361174e-10  1.566e-07  2.888e+00  
     GE9    -1.944896e+04  -1.856147e-11  4.657e-08  2.643e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     7.702e+00      1.771e+00      6.832e-01      
     1.771e+00      5.016e+00      -5.640e+00     
     6.832e-01      -5.640e+00     5.053e+00      
     TOTAL-PRESSURE: 5.924e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.147e+02          2.998e-01           1.002e+03           1.115e+01           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 7
     -------------------------------------------
     DONE(2.450e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944924e+04  0.000000e+00   2.174e-03  3.030e+00  
     GE2    -1.944925e+04  -2.751073e-03  1.153e-03  2.724e+00  
     GE3    -1.944925e+04  -2.223695e-04  1.784e-04  2.614e+00  
     GE4    -1.944925e+04  -1.105829e-05  4.636e-05  2.838e+00  
     GE5    -1.944925e+04  -4.534195e-07  1.754e-05  2.691e+00  
     GE6    -1.944925e+04  -5.115230e-08  3.153e-06  2.671e+00  
     GE7    -1.944925e+04  -1.058004e-09  9.042e-07  2.837e+00  
     GE8    -1.944925e+04  -1.453981e-10  1.597e-07  2.840e+00  
     GE9    -1.944925e+04  -2.165504e-11  4.808e-08  2.982e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     6.265e+00      1.958e+00      1.194e+00      
     1.958e+00      4.162e+00      -5.726e+00     
     1.194e+00      -5.726e+00     4.576e+00      
     TOTAL-PRESSURE: 5.001e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.147e+02          3.102e-01           1.037e+03           1.041e+01           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 8
     -------------------------------------------
     DONE(2.791e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944953e+04  0.000000e+00   2.232e-03  3.084e+00  
     GE2    -1.944953e+04  -2.848622e-03  1.179e-03  2.765e+00  
     GE3    -1.944953e+04  -2.383912e-04  1.878e-04  2.560e+00  
     GE4    -1.944953e+04  -1.198808e-05  4.781e-05  2.676e+00  
     GE5    -1.944953e+04  -4.913591e-07  1.801e-05  2.747e+00  
     GE6    -1.944953e+04  -5.432632e-08  3.282e-06  2.659e+00  
     GE7    -1.944953e+04  -1.302396e-09  9.321e-07  2.647e+00  
     GE8    -1.944953e+04  -2.103633e-10  1.632e-07  2.678e+00  
     GE9    -1.944953e+04  -2.474862e-11  4.964e-08  2.573e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     4.863e+00      2.120e+00      1.684e+00      
     2.120e+00      3.244e+00      -5.761e+00     
     1.684e+00      -5.761e+00     4.033e+00      
     TOTAL-PRESSURE: 4.047e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.206e-01           1.071e+03           9.635e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 9
     -------------------------------------------
     DONE(3.125e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944980e+04  0.000000e+00   2.283e-03  2.883e+00  
     GE2    -1.944980e+04  -2.949410e-03  1.202e-03  2.666e+00  
     GE3    -1.944980e+04  -2.526952e-04  1.960e-04  2.682e+00  
     GE4    -1.944980e+04  -1.276600e-05  4.922e-05  2.642e+00  
     GE5    -1.944980e+04  -5.398571e-07  1.841e-05  2.892e+00  
     GE6    -1.944980e+04  -5.609275e-08  3.396e-06  2.662e+00  
     GE7    -1.944980e+04  -1.036348e-09  9.574e-07  2.762e+00  
     GE8    -1.944980e+04  -2.382055e-10  1.667e-07  2.759e+00  
     GE9    -1.944980e+04  1.237431e-11   5.113e-08  2.536e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     3.530e+00      2.265e+00      2.136e+00      
     2.265e+00      2.312e+00      -5.759e+00     
     2.136e+00      -5.759e+00     3.449e+00      
     TOTAL-PRESSURE: 3.097e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.302e-01           1.103e+03           8.853e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 10
     -------------------------------------------
     DONE(3.463e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945004e+04  0.000000e+00   2.326e-03  2.771e+00  
     GE2    -1.945004e+04  -3.033916e-03  1.222e-03  2.573e+00  
     GE3    -1.945005e+04  -2.642710e-04  2.027e-04  2.560e+00  
     GE4    -1.945005e+04  -1.336743e-05  5.051e-05  2.560e+00  
     GE5    -1.945005e+04  -5.785330e-07  1.873e-05  2.657e+00  
     GE6    -1.945005e+04  -5.996591e-08  3.490e-06  2.729e+00  
     GE7    -1.945005e+04  -9.992256e-10  9.794e-07  2.576e+00  
     GE8    -1.945005e+04  -2.382055e-10  1.702e-07  2.561e+00  
     GE9    -1.945005e+04  -4.021651e-11  5.247e-08  2.575e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     2.293e+00      2.398e+00      2.535e+00      
     2.398e+00      1.409e+00      -5.736e+00     
     2.535e+00      -5.736e+00     2.848e+00      
     TOTAL-PRESSURE: 2.183e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.387e-01           1.132e+03           8.088e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 11
     -------------------------------------------
     DONE(3.788e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945024e+04  0.000000e+00   2.358e-03  2.979e+00  
     GE2    -1.945025e+04  -3.094563e-03  1.237e-03  2.871e+00  
     GE3    -1.945025e+04  -2.725062e-04  2.076e-04  2.786e+00  
     GE4    -1.945025e+04  -1.376412e-05  5.159e-05  2.570e+00  
     GE5    -1.945025e+04  -6.142422e-07  1.897e-05  2.582e+00  
     GE6    -1.945025e+04  -5.773544e-08  3.562e-06  2.774e+00  
     GE7    -1.945025e+04  -9.621026e-10  9.977e-07  2.759e+00  
     GE8    -1.945025e+04  -2.815156e-10  1.736e-07  2.669e+00  
     GE9    -1.945025e+04  -1.856147e-11  5.363e-08  2.542e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     1.175e+00      2.530e+00      2.872e+00      
     2.530e+00      5.756e-01      -5.707e+00     
     2.872e+00      -5.707e+00     2.247e+00      
     TOTAL-PRESSURE: 1.333e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.456e-01           1.155e+03           7.357e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 12
     -------------------------------------------
     DONE(4.122e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945040e+04  0.000000e+00   2.378e-03  2.869e+00  
     GE2    -1.945040e+04  -3.162837e-03  1.247e-03  2.576e+00  
     GE3    -1.945040e+04  -2.769466e-04  2.106e-04  2.682e+00  
     GE4    -1.945040e+04  -1.394947e-05  5.241e-05  2.788e+00  
     GE5    -1.945040e+04  -6.401571e-07  1.911e-05  2.665e+00  
     GE6    -1.945040e+04  -6.184371e-08  3.609e-06  2.799e+00  
     GE7    -1.945040e+04  -9.497283e-10  1.012e-06  2.663e+00  
     GE8    -1.945040e+04  -2.567669e-10  1.765e-07  2.651e+00  
     GE9    -1.945040e+04  -5.259082e-11  5.453e-08  2.750e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     1.937e-01      2.667e+00      3.140e+00      
     2.667e+00      -1.601e-01     -5.682e+00     
     3.140e+00      -5.682e+00     1.663e+00      
     TOTAL-PRESSURE: 5.655e-01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.507e-01           1.172e+03           6.679e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 13
     -------------------------------------------
     DONE(4.455e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945050e+04  0.000000e+00   2.385e-03  2.866e+00  
     GE2    -1.945050e+04  -3.207836e-03  1.252e-03  2.668e+00  
     GE3    -1.945050e+04  -2.777287e-04  2.117e-04  2.575e+00  
     GE4    -1.945050e+04  -1.392725e-05  5.294e-05  2.663e+00  
     GE5    -1.945050e+04  -6.576637e-07  1.915e-05  2.562e+00  
     GE6    -1.945050e+04  -6.260473e-08  3.630e-06  2.584e+00  
     GE7    -1.945050e+04  -9.806641e-10  1.022e-06  2.604e+00  
     GE8    -1.945050e+04  -3.279192e-10  1.789e-07  2.688e+00  
     GE9    -1.945050e+04  -1.856147e-11  5.517e-08  2.643e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -6.389e-01     2.813e+00      3.336e+00      
     2.813e+00      -7.810e-01     -5.668e+00     
     3.336e+00      -5.668e+00     1.103e+00      
     TOTAL-PRESSURE: -1.056e-01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.538e-01           1.182e+03           6.062e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 14
     -------------------------------------------
     DONE(4.783e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945056e+04  0.000000e+00   2.382e-03  2.912e+00  
     GE2    -1.945056e+04  -3.203606e-03  1.252e-03  2.694e+00  
     GE3    -1.945056e+04  -2.750142e-04  2.111e-04  2.682e+00  
     GE4    -1.945056e+04  -1.374313e-05  5.316e-05  2.560e+00  
     GE5    -1.945056e+04  -6.605964e-07  1.909e-05  2.793e+00  
     GE6    -1.945056e+04  -6.427217e-08  3.625e-06  2.564e+00  
     GE7    -1.945056e+04  -2.338745e-09  1.028e-06  2.964e+00  
     GE8    -1.945056e+04  -3.124513e-10  1.807e-07  2.747e+00  
     GE9    -1.945056e+04  -9.280733e-12  5.553e-08  2.756e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.319e+00     2.972e+00      3.461e+00      
     2.972e+00      -1.282e+00     -5.667e+00     
     3.461e+00      -5.667e+00     5.737e-01      
     TOTAL-PRESSURE: -6.759e-01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.549e-01           1.186e+03           5.511e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 15
     -------------------------------------------
     DONE(5.124e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945057e+04  0.000000e+00   2.368e-03  2.865e+00  
     GE2    -1.945057e+04  -3.185011e-03  1.247e-03  2.794e+00  
     GE3    -1.945057e+04  -2.690460e-04  2.089e-04  2.680e+00  
     GE4    -1.945057e+04  -1.339163e-05  5.308e-05  2.857e+00  
     GE5    -1.945057e+04  -6.533698e-07  1.894e-05  2.655e+00  
     GE6    -1.945057e+04  -6.221803e-08  3.596e-06  2.760e+00  
     GE7    -1.945057e+04  -2.116007e-09  1.031e-06  2.637e+00  
     GE8    -1.945057e+04  -3.464807e-10  1.820e-07  2.556e+00  
     GE9    -1.945057e+04  -2.784220e-11  5.564e-08  2.648e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.852e+00     3.145e+00      3.518e+00      
     3.145e+00      -1.667e+00     -5.679e+00     
     3.518e+00      -5.679e+00     7.424e-02      
     TOTAL-PRESSURE: -1.148e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.543e-01           1.184e+03           5.028e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 16
     -------------------------------------------
     DONE(5.459e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945054e+04  0.000000e+00   2.345e-03  3.075e+00  
     GE2    -1.945054e+04  -3.166572e-03  1.239e-03  2.569e+00  
     GE3    -1.945054e+04  -2.604727e-04  2.053e-04  2.568e+00  
     GE4    -1.945054e+04  -1.293899e-05  5.270e-05  2.565e+00  
     GE5    -1.945054e+04  -6.324541e-07  1.870e-05  2.563e+00  
     GE6    -1.945054e+04  -6.252739e-08  3.545e-06  2.773e+00  
     GE7    -1.945054e+04  -2.329464e-09  1.029e-06  2.575e+00  
     GE8    -1.945054e+04  -3.341064e-10  1.825e-07  2.571e+00  
     GE9    -1.945054e+04  -2.474862e-11  5.546e-08  2.935e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.247e+00     3.329e+00      3.514e+00      
     3.329e+00      -1.953e+00     -5.699e+00     
     3.514e+00      -5.699e+00     -3.987e-01     
     TOTAL-PRESSURE: -1.533e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.521e-01           1.177e+03           4.605e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 17
     -------------------------------------------
     DONE(5.791e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945048e+04  0.000000e+00   2.315e-03  2.898e+00  
     GE2    -1.945048e+04  -3.112721e-03  1.227e-03  2.869e+00  
     GE3    -1.945048e+04  -2.502851e-04  2.006e-04  2.674e+00  
     GE4    -1.945048e+04  -1.240596e-05  5.207e-05  2.552e+00  
     GE5    -1.945048e+04  -6.138060e-07  1.840e-05  2.753e+00  
     GE6    -1.945048e+04  -5.790249e-08  3.475e-06  2.658e+00  
     GE7    -1.945048e+04  -7.115228e-10  1.024e-06  2.530e+00  
     GE8    -1.945048e+04  -2.784220e-10  1.824e-07  2.756e+00  
     GE9    -1.945048e+04  -7.733944e-11  5.506e-08  3.265e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.518e+00     3.518e+00      3.457e+00      
     3.518e+00      -2.161e+00     -5.720e+00     
     3.457e+00      -5.720e+00     -8.508e-01     
     TOTAL-PRESSURE: -1.843e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.486e-01           1.165e+03           4.234e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 18
     -------------------------------------------
     DONE(6.131e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945040e+04  0.000000e+00   2.280e-03  2.876e+00  
     GE2    -1.945040e+04  -3.047571e-03  1.213e-03  2.567e+00  
     GE3    -1.945040e+04  -2.389958e-04  1.949e-04  2.763e+00  
     GE4    -1.945040e+04  -1.185042e-05  5.124e-05  2.682e+00  
     GE5    -1.945040e+04  -5.789259e-07  1.804e-05  2.576e+00  
     GE6    -1.945040e+04  -5.907186e-08  3.390e-06  2.581e+00  
     GE7    -1.945040e+04  -2.100539e-09  1.015e-06  2.691e+00  
     GE8    -1.945040e+04  -3.217321e-10  1.812e-07  2.694e+00  
     GE9    -1.945040e+04  -2.784220e-11  5.446e-08  2.671e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.681e+00     3.704e+00      3.358e+00      
     3.704e+00      -2.321e+00     -5.733e+00     
     3.358e+00      -5.733e+00     -1.290e+00     
     TOTAL-PRESSURE: -2.098e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.443e-01           1.151e+03           3.904e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 19
     -------------------------------------------
     DONE(6.466e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945031e+04  0.000000e+00   2.244e-03  3.014e+00  
     GE2    -1.945031e+04  -2.992306e-03  1.198e-03  2.587e+00  
     GE3    -1.945031e+04  -2.271575e-04  1.886e-04  2.612e+00  
     GE4    -1.945031e+04  -1.132285e-05  5.029e-05  2.785e+00  
     GE5    -1.945031e+04  -5.389631e-07  1.765e-05  2.569e+00  
     GE6    -1.945031e+04  -5.494812e-08  3.292e-06  2.798e+00  
     GE7    -1.945031e+04  -7.053357e-10  1.003e-06  2.552e+00  
     GE8    -1.945031e+04  -2.877027e-10  1.790e-07  2.730e+00  
     GE9    -1.945031e+04  -6.805871e-11  5.368e-08  2.726e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.752e+00     3.875e+00      3.232e+00      
     3.875e+00      -2.462e+00     -5.725e+00     
     3.232e+00      -5.725e+00     -1.727e+00     
     TOTAL-PRESSURE: -2.314e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.395e-01           1.134e+03           3.604e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 20
     -------------------------------------------
     DONE(6.801e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945021e+04  0.000000e+00   2.209e-03  2.945e+00  
     GE2    -1.945022e+04  -2.914355e-03  1.183e-03  2.759e+00  
     GE3    -1.945022e+04  -2.156079e-04  1.823e-04  2.859e+00  
     GE4    -1.945022e+04  -1.082106e-05  4.930e-05  2.569e+00  
     GE5    -1.945022e+04  -5.060784e-07  1.724e-05  2.580e+00  
     GE6    -1.945022e+04  -5.236808e-08  3.188e-06  2.781e+00  
     GE7    -1.945022e+04  -7.269907e-10  9.887e-07  2.572e+00  
     GE8    -1.945022e+04  -2.629541e-10  1.762e-07  2.574e+00  
     GE9    -1.945022e+04  -3.402935e-11  5.281e-08  2.749e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.749e+00     4.021e+00      3.091e+00      
     4.021e+00      -2.614e+00     -5.687e+00     
     3.091e+00      -5.687e+00     -2.167e+00     
     TOTAL-PRESSURE: -2.510e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.345e-01           1.118e+03           3.322e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 21
     -------------------------------------------
     DONE(7.138e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945013e+04  0.000000e+00   2.176e-03  2.873e+00  
     GE2    -1.945013e+04  -2.833309e-03  1.168e-03  2.773e+00  
     GE3    -1.945013e+04  -2.052380e-04  1.764e-04  2.680e+00  
     GE4    -1.945013e+04  -1.041275e-05  4.837e-05  2.661e+00  
     GE5    -1.945013e+04  -4.642037e-07  1.684e-05  2.652e+00  
     GE6    -1.945013e+04  -5.127295e-08  3.081e-06  2.560e+00  
     GE7    -1.945013e+04  -6.341834e-10  9.731e-07  2.738e+00  
     GE8    -1.945013e+04  -3.062642e-10  1.727e-07  2.675e+00  
     GE9    -1.945013e+04  3.093578e-12   5.186e-08  2.527e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.686e+00     4.129e+00      2.951e+00      
     4.129e+00      -2.802e+00     -5.608e+00     
     2.951e+00      -5.608e+00     -2.620e+00     
     TOTAL-PRESSURE: -2.703e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.144e+02          -7.148e+02          3.298e-01           1.102e+03           3.046e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 22
     -------------------------------------------
     DONE(7.471e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945006e+04  0.000000e+00   2.148e-03  2.881e+00  
     GE2    -1.945006e+04  -2.767474e-03  1.156e-03  2.684e+00  
     GE3    -1.945006e+04  -1.968148e-04  1.714e-04  2.568e+00  
     GE4    -1.945006e+04  -1.008307e-05  4.754e-05  2.669e+00  
     GE5    -1.945006e+04  -4.370080e-07  1.648e-05  3.069e+00  
     GE6    -1.945006e+04  -4.847017e-08  2.970e-06  2.858e+00  
     GE7    -1.945006e+04  8.507338e-10   9.568e-07  3.179e+00  
     GE8    -1.945006e+04  -2.846091e-10  1.684e-07  2.787e+00  
     GE9    -1.945006e+04  -4.331009e-11  5.085e-08  2.542e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.578e+00     4.188e+00      2.826e+00      
     4.188e+00      -3.048e+00     -5.480e+00     
     2.826e+00      -5.480e+00     -3.091e+00     
     TOTAL-PRESSURE: -2.906e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.255e-01           1.088e+03           2.769e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 23
     -------------------------------------------
     DONE(7.812e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945001e+04  0.000000e+00   2.126e-03  2.908e+00  
     GE2    -1.945001e+04  -2.710485e-03  1.146e-03  2.571e+00  
     GE3    -1.945001e+04  -1.904627e-04  1.675e-04  2.666e+00  
     GE4    -1.945001e+04  -9.866251e-06  4.685e-05  2.583e+00  
     GE5    -1.945001e+04  -4.161604e-07  1.614e-05  2.584e+00  
     GE6    -1.945001e+04  -4.449493e-08  2.862e-06  2.689e+00  
     GE7    -1.945001e+04  -2.171691e-09  9.410e-07  2.784e+00  
     GE8    -1.945001e+04  -2.753284e-10  1.638e-07  2.581e+00  
     GE9    -1.945001e+04  -3.712293e-11  4.981e-08  2.850e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.436e+00     4.192e+00      2.727e+00      
     4.192e+00      -3.368e+00     -5.298e+00     
     2.727e+00      -5.298e+00     -3.581e+00     
     TOTAL-PRESSURE: -3.129e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.220e-01           1.076e+03           2.484e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 24
     -------------------------------------------
     DONE(8.144e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944998e+04  0.000000e+00   2.110e-03  2.768e+00  
     GE2    -1.944999e+04  -2.657417e-03  1.138e-03  2.692e+00  
     GE3    -1.944999e+04  -1.863924e-04  1.650e-04  2.877e+00  
     GE4    -1.944999e+04  -9.753209e-06  4.632e-05  2.648e+00  
     GE5    -1.944999e+04  -3.972339e-07  1.586e-05  2.560e+00  
     GE6    -1.944999e+04  -4.110746e-08  2.764e-06  2.663e+00  
     GE7    -1.944999e+04  -6.249027e-10  9.265e-07  2.861e+00  
     GE8    -1.944999e+04  -2.938899e-10  1.591e-07  2.607e+00  
     GE9    -1.944999e+04  -1.546789e-11  4.874e-08  2.748e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.269e+00     4.136e+00      2.664e+00      
     4.136e+00      -3.768e+00     -5.059e+00     
     2.664e+00      -5.059e+00     -4.092e+00     
     TOTAL-PRESSURE: -3.376e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.191e-01           1.066e+03           2.187e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 25
     -------------------------------------------
     DONE(8.480e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.944998e+04  0.000000e+00   2.101e-03  2.879e+00  
     GE2    -1.944998e+04  -2.619929e-03  1.133e-03  2.756e+00  
     GE3    -1.944998e+04  -1.846545e-04  1.636e-04  2.676e+00  
     GE4    -1.944998e+04  -9.725122e-06  4.596e-05  2.549e+00  
     GE5    -1.944998e+04  -3.822270e-07  1.565e-05  2.690e+00  
     GE6    -1.944998e+04  -4.174474e-08  2.684e-06  2.857e+00  
     GE7    -1.944998e+04  7.857687e-10   9.138e-07  2.758e+00  
     GE8    -1.944998e+04  -2.753284e-10  1.542e-07  2.666e+00  
     GE9    -1.944998e+04  -3.402935e-11  4.762e-08  2.662e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.083e+00     4.022e+00      2.642e+00      
     4.022e+00      -4.250e+00     -4.767e+00     
     2.642e+00      -4.767e+00     -4.620e+00     
     TOTAL-PRESSURE: -3.651e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.171e-01           1.060e+03           1.877e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 26
     -------------------------------------------
     DONE(8.816e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945000e+04  0.000000e+00   2.099e-03  2.765e+00  
     GE2    -1.945000e+04  -2.595889e-03  1.132e-03  2.566e+00  
     GE3    -1.945000e+04  -1.850262e-04  1.632e-04  2.681e+00  
     GE4    -1.945000e+04  -9.747674e-06  4.581e-05  2.683e+00  
     GE5    -1.945000e+04  -3.817970e-07  1.552e-05  2.882e+00  
     GE6    -1.945000e+04  -3.988859e-08  2.631e-06  2.586e+00  
     GE7    -1.945000e+04  -6.310898e-10  9.037e-07  2.800e+00  
     GE8    -1.945000e+04  -3.093578e-10  1.494e-07  2.789e+00  
     GE9    -1.945000e+04  9.280733e-12   4.649e-08  2.561e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.883e+00     3.852e+00      2.663e+00      
     3.852e+00      -4.808e+00     -4.427e+00     
     2.663e+00      -4.427e+00     -5.162e+00     
     TOTAL-PRESSURE: -3.951e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.158e-01           1.055e+03           1.554e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 27
     -------------------------------------------
     DONE(9.150e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945003e+04  0.000000e+00   2.100e-03  2.964e+00  
     GE2    -1.945004e+04  -2.590409e-03  1.132e-03  2.774e+00  
     GE3    -1.945004e+04  -1.868595e-04  1.635e-04  2.575e+00  
     GE4    -1.945004e+04  -9.792658e-06  4.582e-05  2.763e+00  
     GE5    -1.945004e+04  -3.834706e-07  1.548e-05  2.657e+00  
     GE6    -1.945004e+04  -3.777568e-08  2.611e-06  2.658e+00  
     GE7    -1.945004e+04  -6.465577e-10  8.976e-07  2.681e+00  
     GE8    -1.945004e+04  -3.279192e-10  1.456e-07  2.549e+00  
     GE9    -1.945004e+04  -1.237431e-11  4.557e-08  2.538e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.672e+00     3.638e+00      2.723e+00      
     3.638e+00      -5.425e+00     -4.049e+00     
     2.723e+00      -4.049e+00     -5.710e+00     
     TOTAL-PRESSURE: -4.269e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.150e-01           1.053e+03           1.222e+00           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 28
     -------------------------------------------
     DONE(9.480e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945008e+04  0.000000e+00   2.101e-03  2.770e+00  
     GE2    -1.945008e+04  -2.601781e-03  1.132e-03  2.664e+00  
     GE3    -1.945008e+04  -1.894875e-04  1.640e-04  2.700e+00  
     GE4    -1.945008e+04  -9.818666e-06  4.595e-05  2.752e+00  
     GE5    -1.945008e+04  -3.863755e-07  1.551e-05  2.693e+00  
     GE6    -1.945008e+04  -3.782827e-08  2.622e-06  2.546e+00  
     GE7    -1.945008e+04  -6.898678e-10  8.958e-07  2.546e+00  
     GE8    -1.945008e+04  -2.722348e-10  1.438e-07  2.773e+00  
     GE9    -1.945008e+04  -6.187155e-12  4.517e-08  2.550e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.451e+00     3.390e+00      2.817e+00      
     3.390e+00      -6.085e+00     -3.644e+00     
     2.817e+00      -3.644e+00     -6.257e+00     
     TOTAL-PRESSURE: -4.598e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.146e-01           1.051e+03           8.869e-01           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 29
     -------------------------------------------
     DONE(9.807e+02  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945013e+04  0.000000e+00   2.100e-03  2.972e+00  
     GE2    -1.945014e+04  -2.607016e-03  1.131e-03  2.690e+00  
     GE3    -1.945014e+04  -1.922340e-04  1.645e-04  2.550e+00  
     GE4    -1.945014e+04  -9.807940e-06  4.616e-05  2.665e+00  
     GE5    -1.945014e+04  -3.862734e-07  1.560e-05  2.869e+00  
     GE6    -1.945014e+04  -3.875943e-08  2.657e-06  2.653e+00  
     GE7    -1.945014e+04  -2.211908e-09  8.974e-07  2.539e+00  
     GE8    -1.945014e+04  -2.938899e-10  1.440e-07  2.755e+00  
     GE9    -1.945014e+04  -2.165504e-11  4.538e-08  2.884e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.223e+00     3.121e+00      2.935e+00      
     3.121e+00      -6.767e+00     -3.226e+00     
     2.935e+00      -3.226e+00     -6.796e+00     
     TOTAL-PRESSURE: -4.929e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.144e-01           1.051e+03           5.519e-01           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 30
     -------------------------------------------
     DONE(1.014e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945019e+04  0.000000e+00   2.096e-03  2.861e+00  
     GE2    -1.945019e+04  -2.610190e-03  1.130e-03  2.545e+00  
     GE3    -1.945019e+04  -1.946072e-04  1.648e-04  2.798e+00  
     GE4    -1.945019e+04  -9.726233e-06  4.643e-05  2.645e+00  
     GE5    -1.945019e+04  -3.994922e-07  1.572e-05  2.647e+00  
     GE6    -1.945019e+04  -3.819640e-08  2.706e-06  2.549e+00  
     GE7    -1.945019e+04  -7.238971e-10  9.014e-07  2.558e+00  
     GE8    -1.945019e+04  -2.969834e-10  1.457e-07  2.756e+00  
     GE9    -1.945019e+04  -2.165504e-11  4.594e-08  2.757e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -9.892e-01     2.843e+00      3.065e+00      
     2.843e+00      -7.456e+00     -2.807e+00     
     3.065e+00      -2.807e+00     -7.318e+00     
     TOTAL-PRESSURE: -5.254e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.141e-01           1.050e+03           2.218e-01           
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 31
     -------------------------------------------
     DONE(1.047e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945024e+04  0.000000e+00   2.088e-03  2.961e+00  
     GE2    -1.945024e+04  -2.626805e-03  1.127e-03  2.540e+00  
     GE3    -1.945024e+04  -1.963077e-04  1.647e-04  2.604e+00  
     GE4    -1.945024e+04  -9.576157e-06  4.673e-05  2.760e+00  
     GE5    -1.945024e+04  -4.034953e-07  1.585e-05  2.715e+00  
     GE6    -1.945024e+04  -4.050421e-08  2.760e-06  2.678e+00  
     GE7    -1.945024e+04  -7.950494e-10  9.063e-07  2.641e+00  
     GE8    -1.945024e+04  -2.629541e-10  1.478e-07  2.643e+00  
     GE9    -1.945024e+04  -4.331009e-11  4.655e-08  2.635e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -7.558e-01     2.570e+00      3.196e+00      
     2.570e+00      -8.132e+00     -2.397e+00     
     3.196e+00      -2.397e+00     -7.816e+00     
     TOTAL-PRESSURE: -5.568e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.137e-01           1.048e+03           -9.920e-02          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 32
     -------------------------------------------
     DONE(1.080e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945028e+04  0.000000e+00   2.078e-03  3.181e+00  
     GE2    -1.945029e+04  -2.640383e-03  1.122e-03  2.652e+00  
     GE3    -1.945029e+04  -1.971267e-04  1.641e-04  2.660e+00  
     GE4    -1.945029e+04  -9.341685e-06  4.703e-05  2.856e+00  
     GE5    -1.945029e+04  -4.153313e-07  1.598e-05  2.548e+00  
     GE6    -1.945029e+04  -3.806338e-08  2.812e-06  2.622e+00  
     GE7    -1.945029e+04  -8.352659e-10  9.115e-07  2.644e+00  
     GE8    -1.945029e+04  -2.412990e-10  1.498e-07  2.744e+00  
     GE9    -1.945029e+04  -4.021651e-11  4.711e-08  2.534e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -5.307e-01     2.309e+00      3.317e+00      
     2.309e+00      -8.783e+00     -2.006e+00     
     3.317e+00      -2.006e+00     -8.285e+00     
     TOTAL-PRESSURE: -5.866e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.130e-01           1.046e+03           -4.093e-01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 33
     -------------------------------------------
     DONE(1.114e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945032e+04  0.000000e+00   2.066e-03  2.860e+00  
     GE2    -1.945032e+04  -2.646226e-03  1.117e-03  2.552e+00  
     GE3    -1.945033e+04  -1.971103e-04  1.631e-04  2.711e+00  
     GE4    -1.945033e+04  -9.038583e-06  4.734e-05  2.748e+00  
     GE5    -1.945033e+04  -4.117335e-07  1.610e-05  2.545e+00  
     GE6    -1.945033e+04  -4.232942e-08  2.853e-06  2.845e+00  
     GE7    -1.945033e+04  -8.816696e-10  9.161e-07  2.646e+00  
     GE8    -1.945033e+04  -2.815156e-10  1.512e-07  2.856e+00  
     GE9    -1.945033e+04  -2.784220e-11  4.755e-08  2.545e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -3.243e-01     2.069e+00      3.415e+00      
     2.069e+00      -9.401e+00     -1.644e+00     
     3.415e+00      -1.644e+00     -8.720e+00     
     TOTAL-PRESSURE: -6.148e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.120e-01           1.043e+03           -7.090e-01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 34
     -------------------------------------------
     DONE(1.147e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945035e+04  0.000000e+00   2.050e-03  2.922e+00  
     GE2    -1.945036e+04  -2.643438e-03  1.110e-03  2.573e+00  
     GE3    -1.945036e+04  -1.962214e-04  1.617e-04  2.650e+00  
     GE4    -1.945036e+04  -8.695564e-06  4.762e-05  2.661e+00  
     GE5    -1.945036e+04  -4.070251e-07  1.620e-05  2.558e+00  
     GE6    -1.945036e+04  -4.671611e-08  2.882e-06  2.756e+00  
     GE7    -1.945036e+04  -9.095118e-10  9.198e-07  2.846e+00  
     GE8    -1.945036e+04  -2.815156e-10  1.521e-07  2.553e+00  
     GE9    -1.945036e+04  -2.474862e-11  4.791e-08  2.529e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.486e-01     1.853e+00      3.479e+00      
     1.853e+00      -9.982e+00     -1.314e+00     
     3.479e+00      -1.314e+00     -9.117e+00     
     TOTAL-PRESSURE: -6.416e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.107e-01           1.038e+03           -9.989e-01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 35
     -------------------------------------------
     DONE(1.180e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945038e+04  0.000000e+00   2.034e-03  2.880e+00  
     GE2    -1.945038e+04  -2.635525e-03  1.103e-03  2.920e+00  
     GE3    -1.945038e+04  -1.946600e-04  1.599e-04  2.574e+00  
     GE4    -1.945038e+04  -8.331057e-06  4.788e-05  2.552e+00  
     GE5    -1.945038e+04  -4.058959e-07  1.628e-05  2.627e+00  
     GE6    -1.945038e+04  -4.464342e-08  2.898e-06  2.870e+00  
     GE7    -1.945038e+04  -9.095118e-10  9.228e-07  2.566e+00  
     GE8    -1.945038e+04  -2.536734e-10  1.525e-07  2.778e+00  
     GE9    -1.945038e+04  -4.640366e-11  4.818e-08  2.533e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.603e-02     1.661e+00      3.503e+00      
     1.661e+00      -1.052e+01     -1.022e+00     
     3.503e+00      -1.022e+00     -9.473e+00     
     TOTAL-PRESSURE: -6.671e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.092e-01           1.033e+03           -1.281e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 36
     -------------------------------------------
     DONE(1.214e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945040e+04  0.000000e+00   2.017e-03  3.264e+00  
     GE2    -1.945041e+04  -2.622631e-03  1.095e-03  2.675e+00  
     GE3    -1.945041e+04  -1.926136e-04  1.581e-04  2.656e+00  
     GE4    -1.945041e+04  -7.970661e-06  4.810e-05  2.642e+00  
     GE5    -1.945041e+04  -4.049276e-07  1.635e-05  2.769e+00  
     GE6    -1.945041e+04  -4.447327e-08  2.903e-06  2.756e+00  
     GE7    -1.945041e+04  -9.342604e-10  9.249e-07  2.661e+00  
     GE8    -1.945041e+04  -2.598605e-10  1.527e-07  2.656e+00  
     GE9    -1.945041e+04  -2.165504e-11  4.838e-08  2.538e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     5.885e-02      1.493e+00      3.477e+00      
     1.493e+00      -1.103e+01     -7.696e-01     
     3.477e+00      -7.696e-01     -9.787e+00     
     TOTAL-PRESSURE: -6.918e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.075e-01           1.028e+03           -1.558e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 37
     -------------------------------------------
     DONE(1.247e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945042e+04  0.000000e+00   2.001e-03  2.862e+00  
     GE2    -1.945043e+04  -2.602614e-03  1.088e-03  2.565e+00  
     GE3    -1.945043e+04  -1.904359e-04  1.563e-04  2.744e+00  
     GE4    -1.945043e+04  -7.636261e-06  4.829e-05  2.643e+00  
     GE5    -1.945043e+04  -3.991581e-07  1.640e-05  2.556e+00  
     GE6    -1.945043e+04  -4.464032e-08  2.898e-06  2.686e+00  
     GE7    -1.945043e+04  -9.435412e-10  9.265e-07  2.569e+00  
     GE8    -1.945043e+04  -2.443926e-10  1.527e-07  2.656e+00  
     GE9    -1.945043e+04  -3.093578e-12  4.851e-08  2.544e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     6.247e-02      1.345e+00      3.398e+00      
     1.345e+00      -1.149e+01     -5.582e-01     
     3.398e+00      -5.582e-01     -1.006e+01     
     TOTAL-PRESSURE: -7.163e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.057e-01           1.022e+03           -1.834e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 38
     -------------------------------------------
     DONE(1.280e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945045e+04  0.000000e+00   1.986e-03  2.776e+00  
     GE2    -1.945045e+04  -2.572913e-03  1.082e-03  2.845e+00  
     GE3    -1.945045e+04  -1.884949e-04  1.548e-04  2.756e+00  
     GE4    -1.945045e+04  -7.356336e-06  4.846e-05  2.555e+00  
     GE5    -1.945045e+04  -3.908457e-07  1.642e-05  2.652e+00  
     GE6    -1.945045e+04  -4.384837e-08  2.884e-06  2.666e+00  
     GE7    -1.945045e+04  -1.194121e-09  9.277e-07  2.646e+00  
     GE8    -1.945045e+04  -2.443926e-10  1.528e-07  2.558e+00  
     GE9    -1.945045e+04  -2.784220e-11  4.855e-08  2.635e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.693e-02     1.213e+00      3.263e+00      
     1.213e+00      -1.193e+01     -3.874e-01     
     3.263e+00      -3.874e-01     -1.028e+01     
     TOTAL-PRESSURE: -7.410e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.039e-01           1.016e+03           -2.112e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 39
     -------------------------------------------
     DONE(1.313e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945047e+04  0.000000e+00   1.975e-03  2.853e+00  
     GE2    -1.945048e+04  -2.540491e-03  1.078e-03  2.541e+00  
     GE3    -1.945048e+04  -1.868474e-04  1.536e-04  2.758e+00  
     GE4    -1.945048e+04  -7.158155e-06  4.863e-05  2.539e+00  
     GE5    -1.945048e+04  -3.877830e-07  1.643e-05  2.740e+00  
     GE6    -1.945048e+04  -4.546631e-08  2.866e-06  2.638e+00  
     GE7    -1.945048e+04  -9.590090e-10  9.289e-07  2.664e+00  
     GE8    -1.945048e+04  -2.289247e-10  1.529e-07  2.550e+00  
     GE9    -1.945048e+04  0.000000e+00   4.854e-08  2.798e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.861e-01     1.090e+00      3.071e+00      
     1.090e+00      -1.234e+01     -2.560e-01     
     3.071e+00      -2.560e-01     -1.046e+01     
     TOTAL-PRESSURE: -7.663e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.022e-01           1.010e+03           -2.395e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 40
     -------------------------------------------
     DONE(1.345e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945050e+04  0.000000e+00   1.967e-03  2.854e+00  
     GE2    -1.945050e+04  -2.503239e-03  1.074e-03  2.605e+00  
     GE3    -1.945051e+04  -1.856419e-04  1.528e-04  2.599e+00  
     GE4    -1.945051e+04  -7.020735e-06  4.882e-05  2.733e+00  
     GE5    -1.945051e+04  -3.819083e-07  1.641e-05  2.540e+00  
     GE6    -1.945051e+04  -4.830312e-08  2.843e-06  2.663e+00  
     GE7    -1.945051e+04  -9.249797e-10  9.302e-07  2.658e+00  
     GE8    -1.945051e+04  -2.382055e-10  1.530e-07  2.743e+00  
     GE9    -1.945051e+04  -6.187155e-12  4.848e-08  2.624e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -4.471e-01     9.694e-01      2.827e+00      
     9.694e-01      -1.273e+01     -1.616e-01     
     2.827e+00      -1.616e-01     -1.059e+01     
     TOTAL-PRESSURE: -7.924e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          3.006e-01           1.004e+03           -2.684e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 41
     -------------------------------------------
     DONE(1.378e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945054e+04  0.000000e+00   1.963e-03  2.950e+00  
     GE2    -1.945054e+04  -2.476801e-03  1.072e-03  2.882e+00  
     GE3    -1.945054e+04  -1.850849e-04  1.525e-04  2.552e+00  
     GE4    -1.945054e+04  -6.976611e-06  4.904e-05  2.531e+00  
     GE5    -1.945054e+04  -3.689153e-07  1.638e-05  2.543e+00  
     GE6    -1.945054e+04  -4.587466e-08  2.817e-06  2.634e+00  
     GE7    -1.945054e+04  -9.404476e-10  9.325e-07  2.635e+00  
     GE8    -1.945054e+04  -2.258312e-10  1.533e-07  2.546e+00  
     GE9    -1.945054e+04  -1.546789e-11  4.838e-08  2.531e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.012e-01     8.450e-01      2.535e+00      
     8.450e-01      -1.311e+01     -1.007e-01     
     2.535e+00      -1.007e-01     -1.068e+01     
     TOTAL-PRESSURE: -8.196e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.992e-01           9.996e+02           -2.981e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 42
     -------------------------------------------
     DONE(1.411e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945058e+04  0.000000e+00   1.966e-03  2.980e+00  
     GE2    -1.945058e+04  -2.444909e-03  1.073e-03  2.556e+00  
     GE3    -1.945058e+04  -1.850764e-04  1.527e-04  2.743e+00  
     GE4    -1.945058e+04  -7.000454e-06  4.926e-05  2.566e+00  
     GE5    -1.945058e+04  -3.670839e-07  1.634e-05  2.554e+00  
     GE6    -1.945058e+04  -4.514148e-08  2.793e-06  2.543e+00  
     GE7    -1.945058e+04  -9.373540e-10  9.362e-07  2.547e+00  
     GE8    -1.945058e+04  -2.072697e-10  1.538e-07  2.786e+00  
     GE9    -1.945058e+04  -6.187155e-12  4.828e-08  2.667e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.243e+00     7.105e-01      2.205e+00      
     7.105e-01      -1.346e+01     -6.855e-02     
     2.205e+00      -6.855e-02     -1.073e+01     
     TOTAL-PRESSURE: -8.479e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.979e-01           9.953e+02           -3.287e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 43
     -------------------------------------------
     DONE(1.444e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945062e+04  0.000000e+00   1.971e-03  2.854e+00  
     GE2    -1.945062e+04  -2.426640e-03  1.076e-03  2.536e+00  
     GE3    -1.945062e+04  -1.855734e-04  1.533e-04  2.553e+00  
     GE4    -1.945062e+04  -7.088593e-06  4.949e-05  2.636e+00  
     GE5    -1.945062e+04  -3.615433e-07  1.630e-05  2.623e+00  
     GE6    -1.945062e+04  -4.712756e-08  2.771e-06  2.624e+00  
     GE7    -1.945062e+04  -9.404476e-10  9.406e-07  2.636e+00  
     GE8    -1.945062e+04  -2.041761e-10  1.544e-07  2.636e+00  
     GE9    -1.945062e+04  -6.187155e-12  4.817e-08  2.655e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.763e+00     5.614e-01      1.846e+00      
     5.614e-01      -1.381e+01     -6.049e-02     
     1.846e+00      -6.049e-02     -1.074e+01     
     TOTAL-PRESSURE: -8.770e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.967e-01           9.913e+02           -3.598e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 44
     -------------------------------------------
     DONE(1.476e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945067e+04  0.000000e+00   1.976e-03  3.068e+00  
     GE2    -1.945067e+04  -2.409948e-03  1.078e-03  2.773e+00  
     GE3    -1.945067e+04  -1.864239e-04  1.541e-04  2.640e+00  
     GE4    -1.945067e+04  -7.202065e-06  4.971e-05  2.642e+00  
     GE5    -1.945067e+04  -3.705982e-07  1.628e-05  2.658e+00  
     GE6    -1.945067e+04  -4.673158e-08  2.753e-06  2.532e+00  
     GE7    -1.945067e+04  -2.645009e-09  9.456e-07  2.620e+00  
     GE8    -1.945067e+04  -2.072697e-10  1.550e-07  2.717e+00  
     GE9    -1.945067e+04  0.000000e+00   4.805e-08  2.512e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.344e+00     3.939e-01      1.470e+00      
     3.939e-01      -1.414e+01     -7.154e-02     
     1.470e+00      -7.154e-02     -1.071e+01     
     TOTAL-PRESSURE: -9.064e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.955e-01           9.876e+02           -3.913e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 45
     -------------------------------------------
     DONE(1.510e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945071e+04  0.000000e+00   1.981e-03  2.851e+00  
     GE2    -1.945072e+04  -2.398847e-03  1.080e-03  2.539e+00  
     GE3    -1.945072e+04  -1.873897e-04  1.549e-04  3.031e+00  
     GE4    -1.945072e+04  -7.337913e-06  4.991e-05  2.727e+00  
     GE5    -1.945072e+04  -3.646276e-07  1.626e-05  2.524e+00  
     GE6    -1.945072e+04  -4.553127e-08  2.736e-06  2.633e+00  
     GE7    -1.945072e+04  -8.445467e-10  9.505e-07  2.534e+00  
     GE8    -1.945072e+04  -2.412990e-10  1.556e-07  2.628e+00  
     GE9    -1.945072e+04  4.331009e-11   4.794e-08  2.510e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -2.971e+00     2.062e-01      1.088e+00      
     2.062e-01      -1.445e+01     -9.658e-02     
     1.088e+00      -9.658e-02     -1.066e+01     
     TOTAL-PRESSURE: -9.360e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.944e-01           9.838e+02           -4.227e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 46
     -------------------------------------------
     DONE(1.542e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945076e+04  0.000000e+00   1.984e-03  3.041e+00  
     GE2    -1.945076e+04  -2.368001e-03  1.082e-03  2.722e+00  
     GE3    -1.945076e+04  -1.883447e-04  1.557e-04  2.627e+00  
     GE4    -1.945076e+04  -7.451513e-06  5.007e-05  2.521e+00  
     GE5    -1.945076e+04  -3.710313e-07  1.626e-05  2.624e+00  
     GE6    -1.945076e+04  -4.414226e-08  2.726e-06  2.521e+00  
     GE7    -1.945076e+04  -8.631081e-10  9.555e-07  2.631e+00  
     GE8    -1.945076e+04  -1.763339e-10  1.564e-07  2.555e+00  
     GE9    -1.945076e+04  1.237431e-11   4.787e-08  2.521e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -3.629e+00     -2.473e-03     7.134e-01      
     -2.473e-03     -1.475e+01     -1.309e-01     
     7.134e-01      -1.309e-01     -1.057e+01     
     TOTAL-PRESSURE: -9.651e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.932e-01           9.799e+02           -4.540e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 47
     -------------------------------------------
     DONE(1.575e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945080e+04  0.000000e+00   1.985e-03  2.731e+00  
     GE2    -1.945080e+04  -2.356315e-03  1.083e-03  2.622e+00  
     GE3    -1.945080e+04  -1.891143e-04  1.562e-04  2.744e+00  
     GE4    -1.945080e+04  -7.541001e-06  5.020e-05  2.524e+00  
     GE5    -1.945080e+04  -3.673190e-07  1.626e-05  2.749e+00  
     GE6    -1.945080e+04  -4.649338e-08  2.722e-06  2.540e+00  
     GE7    -1.945080e+04  -9.930384e-10  9.602e-07  2.543e+00  
     GE8    -1.945080e+04  -1.856147e-10  1.571e-07  2.519e+00  
     GE9    -1.945080e+04  -3.093578e-11  4.784e-08  2.493e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -4.296e+00     -2.313e-01     3.570e-01      
     -2.313e-01     -1.504e+01     -1.700e-01     
     3.570e-01      -1.700e-01     -1.046e+01     
     TOTAL-PRESSURE: -9.933e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.919e-01           9.755e+02           -4.845e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 48
     -------------------------------------------
     DONE(1.608e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945084e+04  0.000000e+00   1.984e-03  2.733e+00  
     GE2    -1.945084e+04  -2.341584e-03  1.083e-03  2.512e+00  
     GE3    -1.945084e+04  -1.895443e-04  1.565e-04  2.930e+00  
     GE4    -1.945084e+04  -7.595212e-06  5.029e-05  2.530e+00  
     GE5    -1.945084e+04  -3.739578e-07  1.628e-05  2.751e+00  
     GE6    -1.945084e+04  -4.646553e-08  2.727e-06  2.756e+00  
     GE7    -1.945084e+04  -7.455522e-10  9.642e-07  2.542e+00  
     GE8    -1.945084e+04  -2.010825e-10  1.576e-07  2.555e+00  
     GE9    -1.945084e+04  -1.546789e-11  4.786e-08  2.709e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -4.952e+00     -4.796e-01     2.975e-02      
     -4.796e-01     -1.531e+01     -2.101e-01     
     2.975e-02      -2.101e-01     -1.034e+01     
     TOTAL-PRESSURE: -1.020e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.904e-01           9.705e+02           -5.138e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 49
     -------------------------------------------
     DONE(1.640e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945087e+04  0.000000e+00   1.980e-03  3.027e+00  
     GE2    -1.945087e+04  -2.329213e-03  1.082e-03  2.626e+00  
     GE3    -1.945087e+04  -1.897587e-04  1.564e-04  2.644e+00  
     GE4    -1.945087e+04  -7.583107e-06  5.035e-05  2.829e+00  
     GE5    -1.945087e+04  -3.756902e-07  1.631e-05  2.716e+00  
     GE6    -1.945087e+04  -4.471148e-08  2.739e-06  2.613e+00  
     GE7    -1.945087e+04  1.918018e-10   9.672e-07  2.825e+00  
     GE8    -1.945087e+04  -1.856147e-10  1.579e-07  2.524e+00  
     GE9    -1.945087e+04  3.093578e-12   4.794e-08  2.511e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -5.583e+00     -7.458e-01     -2.589e-01     
     -7.458e-01     -1.556e+01     -2.480e-01     
     -2.589e-01     -2.480e-01     -1.021e+01     
     TOTAL-PRESSURE: -1.045e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.887e-01           9.646e+02           -5.417e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 50
     -------------------------------------------
     DONE(1.674e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945089e+04  0.000000e+00   1.974e-03  2.940e+00  
     GE2    -1.945090e+04  -2.303122e-03  1.080e-03  2.529e+00  
     GE3    -1.945090e+04  -1.896402e-04  1.559e-04  2.769e+00  
     GE4    -1.945090e+04  -7.533298e-06  5.038e-05  2.723e+00  
     GE5    -1.945090e+04  -3.764265e-07  1.634e-05  2.598e+00  
     GE6    -1.945090e+04  -4.582516e-08  2.758e-06  2.808e+00  
     GE7    -1.945090e+04  -7.053357e-10  9.692e-07  2.514e+00  
     GE8    -1.945090e+04  -2.351119e-10  1.580e-07  2.503e+00  
     GE9    -1.945090e+04  -3.712293e-11  4.805e-08  2.798e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -6.178e+00     -1.028e+00     -5.015e-01     
     -1.028e+00     -1.578e+01     -2.827e-01     
     -5.015e-01     -2.827e-01     -1.007e+01     
     TOTAL-PRESSURE: -1.068e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.866e-01           9.578e+02           -5.681e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 51
     -------------------------------------------
     DONE(1.707e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945091e+04  0.000000e+00   1.966e-03  2.828e+00  
     GE2    -1.945091e+04  -2.286117e-03  1.077e-03  2.629e+00  
     GE3    -1.945091e+04  -1.890387e-04  1.550e-04  2.622e+00  
     GE4    -1.945091e+04  -7.433718e-06  5.038e-05  2.710e+00  
     GE5    -1.945091e+04  -3.752324e-07  1.636e-05  2.633e+00  
     GE6    -1.945091e+04  -4.593653e-08  2.777e-06  2.536e+00  
     GE7    -1.945091e+04  -6.898678e-10  9.695e-07  2.528e+00  
     GE8    -1.945091e+04  -2.072697e-10  1.577e-07  2.713e+00  
     GE9    -1.945091e+04  -2.784220e-11  4.820e-08  2.759e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -6.721e+00     -1.323e+00     -6.927e-01     
     -1.323e+00     -1.599e+01     -3.133e-01     
     -6.927e-01     -3.133e-01     -9.937e+00     
     TOTAL-PRESSURE: -1.088e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.843e-01           9.500e+02           -5.926e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 52
     -------------------------------------------
     DONE(1.740e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945092e+04  0.000000e+00   1.956e-03  2.836e+00  
     GE2    -1.945092e+04  -2.275582e-03  1.073e-03  2.616e+00  
     GE3    -1.945092e+04  -1.879463e-04  1.538e-04  2.497e+00  
     GE4    -1.945092e+04  -7.296101e-06  5.033e-05  2.708e+00  
     GE5    -1.945092e+04  -3.796469e-07  1.637e-05  2.502e+00  
     GE6    -1.945092e+04  -4.605100e-08  2.799e-06  2.627e+00  
     GE7    -1.945092e+04  -6.651192e-10  9.686e-07  2.532e+00  
     GE8    -1.945092e+04  -2.505798e-10  1.573e-07  2.615e+00  
     GE9    -1.945092e+04  2.474862e-11   4.838e-08  2.602e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -7.202e+00     -1.628e+00     -8.282e-01     
     -1.628e+00     -1.617e+01     -3.399e-01     
     -8.282e-01     -3.399e-01     -9.811e+00     
     TOTAL-PRESSURE: -1.106e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.817e-01           9.412e+02           -6.151e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 53
     -------------------------------------------
     DONE(1.773e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945091e+04  0.000000e+00   1.944e-03  2.712e+00  
     GE2    -1.945092e+04  -2.261697e-03  1.068e-03  2.509e+00  
     GE3    -1.945092e+04  -1.864210e-04  1.523e-04  2.513e+00  
     GE4    -1.945092e+04  -7.117150e-06  5.024e-05  2.712e+00  
     GE5    -1.945092e+04  -3.738527e-07  1.636e-05  2.522e+00  
     GE6    -1.945092e+04  -4.635107e-08  2.818e-06  2.709e+00  
     GE7    -1.945092e+04  -6.867742e-10  9.663e-07  2.506e+00  
     GE8    -1.945092e+04  -1.763339e-10  1.566e-07  2.614e+00  
     GE9    -1.945092e+04  3.093578e-12   4.859e-08  2.605e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -7.618e+00     -1.942e+00     -9.064e-01     
     -1.942e+00     -1.633e+01     -3.640e-01     
     -9.064e-01     -3.640e-01     -9.697e+00     
     TOTAL-PRESSURE: -1.121e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.787e-01           9.313e+02           -6.356e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 54
     -------------------------------------------
     DONE(1.805e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945090e+04  0.000000e+00   1.930e-03  3.077e+00  
     GE2    -1.945091e+04  -2.250166e-03  1.061e-03  2.535e+00  
     GE3    -1.945091e+04  -1.844150e-04  1.506e-04  2.643e+00  
     GE4    -1.945091e+04  -6.915423e-06  5.009e-05  2.707e+00  
     GE5    -1.945091e+04  -3.759470e-07  1.633e-05  2.610e+00  
     GE6    -1.945091e+04  -4.739051e-08  2.832e-06  2.689e+00  
     GE7    -1.945091e+04  -6.249027e-10  9.625e-07  2.523e+00  
     GE8    -1.945091e+04  -2.165504e-10  1.557e-07  2.607e+00  
     GE9    -1.945091e+04  9.280733e-12   4.878e-08  2.483e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -7.969e+00     -2.261e+00     -9.263e-01     
     -2.261e+00     -1.646e+01     -3.878e-01     
     -9.263e-01     -3.878e-01     -9.597e+00     
     TOTAL-PRESSURE: -1.134e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.754e-01           9.203e+02           -6.541e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 55
     -------------------------------------------
     DONE(1.838e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945088e+04  0.000000e+00   1.915e-03  2.739e+00  
     GE2    -1.945089e+04  -2.236561e-03  1.053e-03  2.623e+00  
     GE3    -1.945089e+04  -1.818565e-04  1.488e-04  2.549e+00  
     GE4    -1.945089e+04  -6.699566e-06  4.988e-05  2.615e+00  
     GE5    -1.945089e+04  -3.804605e-07  1.626e-05  2.517e+00  
     GE6    -1.945089e+04  -4.493112e-08  2.841e-06  2.702e+00  
     GE7    -1.945089e+04  -6.249027e-10  9.574e-07  2.813e+00  
     GE8    -1.945089e+04  -2.072697e-10  1.545e-07  2.616e+00  
     GE9    -1.945089e+04  1.546789e-11   4.896e-08  2.799e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.252e+00     -2.584e+00     -8.889e-01     
     -2.584e+00     -1.657e+01     -4.143e-01     
     -8.889e-01     -4.143e-01     -9.512e+00     
     TOTAL-PRESSURE: -1.144e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.719e-01           9.085e+02           -6.704e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 56
     -------------------------------------------
     DONE(1.871e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945086e+04  0.000000e+00   1.898e-03  2.809e+00  
     GE2    -1.945086e+04  -2.228099e-03  1.045e-03  2.607e+00  
     GE3    -1.945086e+04  -1.790204e-04  1.470e-04  2.502e+00  
     GE4    -1.945086e+04  -6.488531e-06  4.963e-05  2.505e+00  
     GE5    -1.945086e+04  -3.751272e-07  1.618e-05  2.616e+00  
     GE6    -1.945086e+04  -4.666971e-08  2.843e-06  2.617e+00  
     GE7    -1.945086e+04  4.454752e-10   9.508e-07  2.606e+00  
     GE8    -1.945086e+04  -1.856147e-10  1.531e-07  2.624e+00  
     GE9    -1.945086e+04  1.079659e-09   4.913e-08  2.600e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.470e+00     -2.908e+00     -7.968e-01     
     -2.908e+00     -1.665e+01     -4.468e-01     
     -7.968e-01     -4.468e-01     -9.440e+00     
     TOTAL-PRESSURE: -1.152e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.681e-01           8.957e+02           -6.847e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 57
     -------------------------------------------
     DONE(1.903e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945082e+04  0.000000e+00   1.881e-03  2.981e+00  
     GE2    -1.945083e+04  -2.214761e-03  1.036e-03  2.715e+00  
     GE3    -1.945083e+04  -1.760117e-04  1.451e-04  2.610e+00  
     GE4    -1.945083e+04  -6.260321e-06  4.934e-05  2.627e+00  
     GE5    -1.945083e+04  -3.723956e-07  1.607e-05  2.603e+00  
     GE6    -1.945083e+04  -4.371844e-08  2.841e-06  2.606e+00  
     GE7    -1.945083e+04  -1.865427e-09  9.431e-07  2.619e+00  
     GE8    -1.945083e+04  -2.041761e-10  1.515e-07  2.511e+00  
     GE9    -1.945083e+04  -1.330238e-09  4.924e-08  2.482e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.630e+00     -3.231e+00     -6.542e-01     
     -3.231e+00     -1.671e+01     -4.879e-01     
     -6.542e-01     -4.879e-01     -9.382e+00     
     TOTAL-PRESSURE: -1.157e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.640e-01           8.823e+02           -6.971e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 58
     -------------------------------------------
     DONE(1.935e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945078e+04  0.000000e+00   1.862e-03  2.704e+00  
     GE2    -1.945078e+04  -2.204980e-03  1.026e-03  2.520e+00  
     GE3    -1.945078e+04  -1.727993e-04  1.432e-04  2.608e+00  
     GE4    -1.945078e+04  -6.055168e-06  4.899e-05  2.520e+00  
     GE5    -1.945078e+04  -3.724822e-07  1.595e-05  2.650e+00  
     GE6    -1.945078e+04  -4.373081e-08  2.835e-06  2.617e+00  
     GE7    -1.945078e+04  -1.815930e-09  9.345e-07  2.612e+00  
     GE8    -1.945078e+04  -2.041761e-10  1.497e-07  2.816e+00  
     GE9    -1.945078e+04  9.280733e-12   4.934e-08  2.592e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.743e+00     -3.550e+00     -4.656e-01     
     -3.550e+00     -1.675e+01     -5.406e-01     
     -4.656e-01     -5.406e-01     -9.333e+00     
     TOTAL-PRESSURE: -1.161e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.598e-01           8.682e+02           -7.079e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 59
     -------------------------------------------
     DONE(1.968e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945074e+04  0.000000e+00   1.842e-03  2.920e+00  
     GE2    -1.945074e+04  -2.197028e-03  1.015e-03  2.615e+00  
     GE3    -1.945074e+04  -1.691824e-04  1.413e-04  2.509e+00  
     GE4    -1.945074e+04  -5.866592e-06  4.858e-05  2.823e+00  
     GE5    -1.945074e+04  -3.639161e-07  1.580e-05  2.812e+00  
     GE6    -1.945074e+04  -4.403089e-08  2.825e-06  2.662e+00  
     GE7    -1.945074e+04  -5.723118e-10  9.250e-07  2.513e+00  
     GE8    -1.945074e+04  -2.227376e-10  1.478e-07  2.502e+00  
     GE9    -1.945074e+04  3.093578e-12   4.941e-08  2.591e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.819e+00     -3.864e+00     -2.373e-01     
     -3.864e+00     -1.677e+01     -6.067e-01     
     -2.373e-01     -6.067e-01     -9.292e+00     
     TOTAL-PRESSURE: -1.163e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.555e-01           8.537e+02           -7.173e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 60
     -------------------------------------------
     DONE(2.000e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945069e+04  0.000000e+00   1.822e-03  2.823e+00  
     GE2    -1.945069e+04  -2.195287e-03  1.004e-03  2.631e+00  
     GE3    -1.945069e+04  -1.652659e-04  1.394e-04  2.517e+00  
     GE4    -1.945069e+04  -5.690342e-06  4.813e-05  2.530e+00  
     GE5    -1.945069e+04  -3.603337e-07  1.566e-05  2.740e+00  
     GE6    -1.945069e+04  -4.434334e-08  2.814e-06  2.643e+00  
     GE7    -1.945069e+04  -5.784990e-10  9.154e-07  2.534e+00  
     GE8    -1.945069e+04  -1.979890e-10  1.459e-07  2.623e+00  
     GE9    -1.945069e+04  1.546789e-11   4.944e-08  2.484e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.868e+00     -4.170e+00     2.351e-02      
     -4.170e+00     -1.677e+01     -6.881e-01     
     2.351e-02      -6.881e-01     -9.255e+00     
     TOTAL-PRESSURE: -1.163e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.145e+02          -7.148e+02          2.510e-01           8.388e+02           -7.256e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 61
     -------------------------------------------
     DONE(2.033e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945063e+04  0.000000e+00   1.802e-03  2.923e+00  
     GE2    -1.945064e+04  -2.175794e-03  9.927e-04  2.499e+00  
     GE3    -1.945064e+04  -1.613435e-04  1.374e-04  2.615e+00  
     GE4    -1.945064e+04  -5.530472e-06  4.763e-05  2.710e+00  
     GE5    -1.945064e+04  -3.602502e-07  1.552e-05  2.504e+00  
     GE6    -1.945064e+04  -4.392880e-08  2.803e-06  2.505e+00  
     GE7    -1.945064e+04  -2.320183e-10  9.055e-07  2.602e+00  
     GE8    -1.945064e+04  -2.320183e-10  1.438e-07  2.806e+00  
     GE9    -1.945064e+04  -2.474862e-11  4.944e-08  2.575e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.902e+00     -4.464e+00     3.093e-01      
     -4.464e+00     -1.676e+01     -7.851e-01     
     3.093e-01      -7.851e-01     -9.218e+00     
     TOTAL-PRESSURE: -1.163e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.465e-01           8.238e+02           -7.330e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 62
     -------------------------------------------
     DONE(2.065e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945058e+04  0.000000e+00   1.784e-03  3.025e+00  
     GE2    -1.945058e+04  -2.162929e-03  9.821e-04  2.613e+00  
     GE3    -1.945058e+04  -1.574920e-04  1.355e-04  2.715e+00  
     GE4    -1.945058e+04  -5.380298e-06  4.707e-05  2.615e+00  
     GE5    -1.945058e+04  -3.542518e-07  1.539e-05  2.500e+00  
     GE6    -1.945058e+04  -4.183136e-08  2.791e-06  2.747e+00  
     GE7    -1.945058e+04  -5.537504e-10  8.954e-07  2.721e+00  
     GE8    -1.945058e+04  -1.577725e-10  1.418e-07  2.594e+00  
     GE9    -1.945058e+04  -2.784220e-11  4.943e-08  2.731e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.932e+00     -4.745e+00     6.128e-01      
     -4.745e+00     -1.674e+01     -8.976e-01     
     6.128e-01      -8.976e-01     -9.179e+00     
     TOTAL-PRESSURE: -1.162e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.421e-01           8.088e+02           -7.398e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 63
     -------------------------------------------
     DONE(2.098e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945052e+04  0.000000e+00   1.765e-03  2.900e+00  
     GE2    -1.945052e+04  -2.154359e-03  9.717e-04  2.658e+00  
     GE3    -1.945052e+04  -1.535341e-04  1.337e-04  2.614e+00  
     GE4    -1.945052e+04  -5.245421e-06  4.651e-05  2.814e+00  
     GE5    -1.945052e+04  -3.526555e-07  1.526e-05  2.713e+00  
     GE6    -1.945052e+04  -3.914922e-08  2.779e-06  2.625e+00  
     GE7    -1.945052e+04  -5.166275e-10  8.847e-07  2.502e+00  
     GE8    -1.945052e+04  -2.010825e-10  1.398e-07  2.714e+00  
     GE9    -1.945052e+04  -6.187155e-12  4.939e-08  2.495e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.974e+00     -5.008e+00     9.264e-01      
     -5.008e+00     -1.671e+01     -1.025e+00     
     9.264e-01      -1.025e+00     -9.138e+00     
     TOTAL-PRESSURE: -1.161e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.376e-01           7.941e+02           -7.466e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 64
     -------------------------------------------
     DONE(2.131e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945047e+04  0.000000e+00   1.747e-03  2.929e+00  
     GE2    -1.945047e+04  -2.165852e-03  9.615e-04  2.701e+00  
     GE3    -1.945047e+04  -1.496829e-04  1.320e-04  2.606e+00  
     GE4    -1.945047e+04  -5.108183e-06  4.593e-05  2.761e+00  
     GE5    -1.945047e+04  -3.467220e-07  1.515e-05  2.574e+00  
     GE6    -1.945047e+04  -4.302238e-08  2.768e-06  2.769e+00  
     GE7    -1.945047e+04  -5.011596e-10  8.740e-07  2.604e+00  
     GE8    -1.945047e+04  -1.515853e-10  1.378e-07  2.704e+00  
     GE9    -1.945047e+04  -4.021651e-11  4.935e-08  2.582e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -9.036e+00     -5.251e+00     1.242e+00      
     -5.251e+00     -1.667e+01     -1.165e+00     
     1.242e+00      -1.165e+00     -9.097e+00     
     TOTAL-PRESSURE: -1.160e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.333e-01           7.797e+02           -7.535e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 65
     -------------------------------------------
     DONE(2.164e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945042e+04  0.000000e+00   1.729e-03  2.825e+00  
     GE2    -1.945042e+04  -2.153957e-03  9.515e-04  2.698e+00  
     GE3    -1.945042e+04  -1.459209e-04  1.303e-04  2.707e+00  
     GE4    -1.945042e+04  -4.976292e-06  4.536e-05  2.616e+00  
     GE5    -1.945042e+04  -3.410051e-07  1.503e-05  2.628e+00  
     GE6    -1.945042e+04  -3.959779e-08  2.755e-06  2.619e+00  
     GE7    -1.945042e+04  1.061097e-09   8.629e-07  2.598e+00  
     GE8    -1.945042e+04  -1.670532e-10  1.359e-07  2.514e+00  
     GE9    -1.945042e+04  -1.546789e-11  4.929e-08  2.537e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -9.124e+00     -5.469e+00     1.551e+00      
     -5.469e+00     -1.663e+01     -1.315e+00     
     1.551e+00      -1.315e+00     -9.057e+00     
     TOTAL-PRESSURE: -1.160e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.292e-01           7.660e+02           -7.608e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 66
     -------------------------------------------
     DONE(2.197e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945037e+04  0.000000e+00   1.711e-03  2.718e+00  
     GE2    -1.945037e+04  -2.126893e-03  9.422e-04  2.608e+00  
     GE3    -1.945037e+04  -1.420406e-04  1.288e-04  2.810e+00  
     GE4    -1.945037e+04  -4.825059e-06  4.483e-05  2.601e+00  
     GE5    -1.945037e+04  -3.368597e-07  1.493e-05  2.499e+00  
     GE6    -1.945037e+04  -3.695588e-08  2.739e-06  2.603e+00  
     GE7    -1.945037e+04  7.517393e-10   8.515e-07  2.497e+00  
     GE8    -1.945037e+04  -1.515853e-10  1.341e-07  2.518e+00  
     GE9    -1.945037e+04  -6.187155e-12  4.923e-08  2.577e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -9.244e+00     -5.660e+00     1.846e+00      
     -5.660e+00     -1.659e+01     -1.471e+00     
     1.846e+00      -1.471e+00     -9.025e+00     
     TOTAL-PRESSURE: -1.162e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.254e-01           7.531e+02           -7.689e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 67
     -------------------------------------------
     DONE(2.229e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945033e+04  0.000000e+00   1.694e-03  2.729e+00  
     GE2    -1.945033e+04  -2.097776e-03  9.334e-04  2.797e+00  
     GE3    -1.945033e+04  -1.382157e-04  1.274e-04  2.505e+00  
     GE4    -1.945033e+04  -4.662192e-06  4.435e-05  2.497e+00  
     GE5    -1.945033e+04  -3.369679e-07  1.483e-05  2.705e+00  
     GE6    -1.945033e+04  -3.799841e-08  2.721e-06  2.489e+00  
     GE7    -1.945033e+04  -4.795045e-10  8.402e-07  2.621e+00  
     GE8    -1.945033e+04  -1.237431e-10  1.324e-07  2.602e+00  
     GE9    -1.945033e+04  -2.474862e-11  4.918e-08  2.679e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -9.402e+00     -5.820e+00     2.117e+00      
     -5.820e+00     -1.654e+01     -1.631e+00     
     2.117e+00      -1.631e+00     -9.010e+00     
     TOTAL-PRESSURE: -1.165e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.219e-01           7.414e+02           -7.782e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 68
     -------------------------------------------
     DONE(2.262e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945030e+04  0.000000e+00   1.678e-03  2.801e+00  
     GE2    -1.945030e+04  -2.065981e-03  9.255e-04  2.511e+00  
     GE3    -1.945030e+04  -1.347177e-04  1.261e-04  2.495e+00  
     GE4    -1.945030e+04  -4.503516e-06  4.393e-05  2.713e+00  
     GE5    -1.945030e+04  -3.336887e-07  1.473e-05  2.496e+00  
     GE6    -1.945030e+04  -3.618248e-08  2.699e-06  2.508e+00  
     GE7    -1.945030e+04  -4.795045e-10  8.293e-07  2.597e+00  
     GE8    -1.945030e+04  -1.144624e-10  1.308e-07  2.539e+00  
     GE9    -1.945030e+04  -3.093578e-12  4.917e-08  2.575e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -9.604e+00     -5.947e+00     2.358e+00      
     -5.947e+00     -1.649e+01     -1.789e+00     
     2.358e+00      -1.789e+00     -9.023e+00     
     TOTAL-PRESSURE: -1.170e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.188e-01           7.311e+02           -7.891e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 69
     -------------------------------------------
     DONE(2.293e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945028e+04  0.000000e+00   1.662e-03  2.907e+00  
     GE2    -1.945029e+04  -2.033862e-03  9.185e-04  2.698e+00  
     GE3    -1.945029e+04  -1.318304e-04  1.248e-04  2.501e+00  
     GE4    -1.945029e+04  -4.353251e-06  4.357e-05  2.701e+00  
     GE5    -1.945029e+04  -3.376485e-07  1.463e-05  2.594e+00  
     GE6    -1.945029e+04  -3.498218e-08  2.672e-06  2.488e+00  
     GE7    -1.945029e+04  -4.485687e-10  8.191e-07  2.801e+00  
     GE8    -1.945029e+04  -1.732403e-10  1.295e-07  2.678e+00  
     GE9    -1.945029e+04  2.474862e-11   4.918e-08  2.615e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -9.851e+00     -6.039e+00     2.561e+00      
     -6.039e+00     -1.644e+01     -1.943e+00     
     2.561e+00      -1.943e+00     -9.074e+00     
     TOTAL-PRESSURE: -1.179e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.162e-01           7.226e+02           -8.018e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 70
     -------------------------------------------
     DONE(2.326e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945028e+04  0.000000e+00   1.648e-03  2.836e+00  
     GE2    -1.945028e+04  -2.004274e-03  9.126e-04  2.496e+00  
     GE3    -1.945028e+04  -1.294220e-04  1.238e-04  2.589e+00  
     GE4    -1.945028e+04  -4.218736e-06  4.328e-05  2.689e+00  
     GE5    -1.945028e+04  -3.353469e-07  1.455e-05  2.688e+00  
     GE6    -1.945028e+04  -3.591953e-08  2.642e-06  2.526e+00  
     GE7    -1.945028e+04  -4.485687e-10  8.105e-07  2.601e+00  
     GE8    -1.945028e+04  -1.361174e-10  1.285e-07  2.702e+00  
     GE9    -1.945028e+04  1.546789e-11   4.922e-08  2.786e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.014e+01     -6.093e+00     2.720e+00      
     -6.093e+00     -1.639e+01     -2.090e+00     
     2.720e+00      -2.090e+00     -9.174e+00     
     TOTAL-PRESSURE: -1.190e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.143e-01           7.159e+02           -8.166e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 71
     -------------------------------------------
     DONE(2.359e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945029e+04  0.000000e+00   1.637e-03  2.726e+00  
     GE2    -1.945029e+04  -1.983641e-03  9.085e-04  2.912e+00  
     GE3    -1.945029e+04  -1.275566e-04  1.229e-04  2.502e+00  
     GE4    -1.945029e+04  -4.109329e-06  4.305e-05  2.516e+00  
     GE5    -1.945029e+04  -3.382332e-07  1.447e-05  2.490e+00  
     GE6    -1.945029e+04  -3.647328e-08  2.609e-06  2.596e+00  
     GE7    -1.945029e+04  -4.300073e-10  8.043e-07  2.581e+00  
     GE8    -1.945029e+04  -1.237431e-10  1.280e-07  2.696e+00  
     GE9    -1.945029e+04  2.165504e-11   4.931e-08  2.477e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.047e+01     -6.110e+00     2.832e+00      
     -6.110e+00     -1.633e+01     -2.228e+00     
     2.832e+00      -2.228e+00     -9.333e+00     
     TOTAL-PRESSURE: -1.205e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.129e-01           7.114e+02           -8.334e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 72
     -------------------------------------------
     DONE(2.391e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945032e+04  0.000000e+00   1.631e-03  2.701e+00  
     GE2    -1.945032e+04  -1.958602e-03  9.070e-04  2.583e+00  
     GE3    -1.945032e+04  -1.267011e-04  1.223e-04  2.514e+00  
     GE4    -1.945032e+04  -4.046802e-06  4.286e-05  2.696e+00  
     GE5    -1.945032e+04  -3.407668e-07  1.442e-05  2.988e+00  
     GE6    -1.945032e+04  -3.277955e-08  2.577e-06  2.881e+00  
     GE7    -1.945032e+04  -3.897908e-10  8.005e-07  2.595e+00  
     GE8    -1.945032e+04  -8.043302e-11  1.280e-07  2.690e+00  
     GE9    -1.945032e+04  0.000000e+00   4.946e-08  2.562e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.083e+01     -6.090e+00     2.894e+00      
     -6.090e+00     -1.628e+01     -2.355e+00     
     2.894e+00      -2.355e+00     -9.558e+00     
     TOTAL-PRESSURE: -1.222e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.122e-01           7.090e+02           -8.525e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 73
     -------------------------------------------
     DONE(2.424e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945036e+04  0.000000e+00   1.632e-03  2.900e+00  
     GE2    -1.945036e+04  -1.929550e-03  9.087e-04  2.493e+00  
     GE3    -1.945036e+04  -1.269079e-04  1.220e-04  2.995e+00  
     GE4    -1.945036e+04  -4.035290e-06  4.273e-05  2.510e+00  
     GE5    -1.945036e+04  -3.359316e-07  1.438e-05  2.501e+00  
     GE6    -1.945036e+04  -3.470994e-08  2.546e-06  2.499e+00  
     GE7    -1.945036e+04  2.109820e-09   7.996e-07  2.583e+00  
     GE8    -1.945036e+04  -4.640366e-11  1.286e-07  2.508e+00  
     GE9    -1.945036e+04  -3.712293e-11  4.969e-08  2.749e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.123e+01     -6.034e+00     2.907e+00      
     -6.034e+00     -1.622e+01     -2.472e+00     
     2.907e+00      -2.472e+00     -9.851e+00     
     TOTAL-PRESSURE: -1.243e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.121e-01           7.087e+02           -8.735e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 74
     -------------------------------------------
     DONE(2.457e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945042e+04  0.000000e+00   1.639e-03  2.818e+00  
     GE2    -1.945042e+04  -1.924379e-03  9.131e-04  2.717e+00  
     GE3    -1.945042e+04  -1.276183e-04  1.222e-04  3.001e+00  
     GE4    -1.945042e+04  -4.068961e-06  4.266e-05  2.532e+00  
     GE5    -1.945042e+04  -3.408287e-07  1.437e-05  2.637e+00  
     GE6    -1.945042e+04  -3.454907e-08  2.517e-06  2.487e+00  
     GE7    -1.945042e+04  7.610201e-10   8.014e-07  2.500e+00  
     GE8    -1.945042e+04  -9.590090e-11  1.297e-07  2.482e+00  
     GE9    -1.945042e+04  0.000000e+00   4.998e-08  2.602e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.164e+01     -5.944e+00     2.873e+00      
     -5.944e+00     -1.616e+01     -2.578e+00     
     2.873e+00      -2.578e+00     -1.021e+01     
     TOTAL-PRESSURE: -1.267e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.126e-01           7.102e+02           -8.963e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 75
     -------------------------------------------
     DONE(2.489e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945048e+04  0.000000e+00   1.650e-03  2.905e+00  
     GE2    -1.945049e+04  -1.912619e-03  9.193e-04  2.506e+00  
     GE3    -1.945049e+04  -1.292513e-04  1.227e-04  2.504e+00  
     GE4    -1.945049e+04  -4.157706e-06  4.267e-05  2.604e+00  
     GE5    -1.945049e+04  -3.373392e-07  1.436e-05  2.711e+00  
     GE6    -1.945049e+04  -3.223198e-08  2.491e-06  2.497e+00  
     GE7    -1.945049e+04  -3.928844e-10  8.056e-07  2.693e+00  
     GE8    -1.945049e+04  -4.640366e-11  1.313e-07  2.620e+00  
     GE9    -1.945049e+04  -3.093578e-12  5.035e-08  2.473e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.207e+01     -5.823e+00     2.799e+00      
     -5.823e+00     -1.609e+01     -2.676e+00     
     2.799e+00      -2.676e+00     -1.062e+01     
     TOTAL-PRESSURE: -1.293e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.135e-01           7.134e+02           -9.205e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 76
     -------------------------------------------
     DONE(2.522e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945056e+04  0.000000e+00   1.662e-03  2.847e+00  
     GE2    -1.945056e+04  -1.900396e-03  9.262e-04  2.510e+00  
     GE3    -1.945056e+04  -1.316004e-04  1.234e-04  2.694e+00  
     GE4    -1.945056e+04  -4.276874e-06  4.274e-05  2.686e+00  
     GE5    -1.945056e+04  -3.367514e-07  1.436e-05  2.490e+00  
     GE6    -1.945056e+04  -3.163183e-08  2.462e-06  2.586e+00  
     GE7    -1.945056e+04  -3.557614e-10  8.107e-07  2.605e+00  
     GE8    -1.945056e+04  -3.402935e-11  1.329e-07  2.506e+00  
     GE9    -1.945056e+04  -2.165504e-11  5.069e-08  2.555e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.250e+01     -5.674e+00     2.689e+00      
     -5.674e+00     -1.601e+01     -2.765e+00     
     2.689e+00      -2.765e+00     -1.108e+01     
     TOTAL-PRESSURE: -1.320e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.148e-01           7.177e+02           -9.454e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 77
     -------------------------------------------
     DONE(2.554e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945064e+04  0.000000e+00   1.673e-03  2.749e+00  
     GE2    -1.945064e+04  -1.909927e-03  9.332e-04  2.788e+00  
     GE3    -1.945064e+04  -1.340448e-04  1.242e-04  2.484e+00  
     GE4    -1.945064e+04  -4.376342e-06  4.284e-05  2.597e+00  
     GE5    -1.945064e+04  -3.379579e-07  1.435e-05  2.515e+00  
     GE6    -1.945064e+04  -3.750035e-08  2.433e-06  2.599e+00  
     GE7    -1.945064e+04  -4.083522e-10  8.167e-07  2.510e+00  
     GE8    -1.945064e+04  -2.474862e-11  1.344e-07  2.497e+00  
     GE9    -1.945064e+04  1.237431e-11   5.101e-08  2.573e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.293e+01     -5.500e+00     2.551e+00      
     -5.500e+00     -1.592e+01     -2.848e+00     
     2.551e+00      -2.848e+00     -1.158e+01     
     TOTAL-PRESSURE: -1.348e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.163e-01           7.228e+02           -9.705e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 78
     -------------------------------------------
     DONE(2.586e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945072e+04  0.000000e+00   1.684e-03  2.816e+00  
     GE2    -1.945073e+04  -1.907720e-03  9.396e-04  2.707e+00  
     GE3    -1.945073e+04  -1.364702e-04  1.250e-04  2.597e+00  
     GE4    -1.945073e+04  -4.491377e-06  4.296e-05  2.627e+00  
     GE5    -1.945073e+04  -3.404513e-07  1.433e-05  2.607e+00  
     GE6    -1.945073e+04  -3.423044e-08  2.405e-06  2.617e+00  
     GE7    -1.945073e+04  -3.681357e-10  8.231e-07  2.799e+00  
     GE8    -1.945073e+04  -1.218870e-09  1.358e-07  2.698e+00  
     GE9    -1.945073e+04  -2.784220e-11  5.128e-08  2.453e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.334e+01     -5.305e+00     2.393e+00      
     -5.305e+00     -1.583e+01     -2.924e+00     
     2.393e+00      -2.924e+00     -1.208e+01     
     TOTAL-PRESSURE: -1.375e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.179e-01           7.282e+02           -9.953e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 79
     -------------------------------------------
     DONE(2.619e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945081e+04  0.000000e+00   1.693e-03  2.806e+00  
     GE2    -1.945081e+04  -1.907710e-03  9.451e-04  2.606e+00  
     GE3    -1.945081e+04  -1.389166e-04  1.255e-04  2.489e+00  
     GE4    -1.945081e+04  -4.566817e-06  4.309e-05  2.705e+00  
     GE5    -1.945081e+04  -3.429571e-07  1.429e-05  2.492e+00  
     GE6    -1.945081e+04  -3.659702e-08  2.372e-06  2.582e+00  
     GE7    -1.945081e+04  -3.557614e-10  8.281e-07  2.700e+00  
     GE8    -1.945081e+04  -1.856147e-11  1.365e-07  2.492e+00  
     GE9    -1.945081e+04  -3.402935e-11  5.141e-08  2.704e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.374e+01     -5.091e+00     2.221e+00      
     -5.091e+00     -1.573e+01     -2.994e+00     
     2.221e+00      -2.994e+00     -1.260e+01     
     TOTAL-PRESSURE: -1.402e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.196e-01           7.337e+02           -1.019e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 80
     -------------------------------------------
     DONE(2.652e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945088e+04  0.000000e+00   1.699e-03  2.703e+00  
     GE2    -1.945089e+04  -1.917483e-03  9.495e-04  2.582e+00  
     GE3    -1.945089e+04  -1.409046e-04  1.258e-04  2.584e+00  
     GE4    -1.945089e+04  -4.612719e-06  4.323e-05  2.689e+00  
     GE5    -1.945089e+04  -3.381992e-07  1.424e-05  2.669e+00  
     GE6    -1.945089e+04  -3.580507e-08  2.341e-06  2.616e+00  
     GE7    -1.945089e+04  -3.650422e-10  8.321e-07  2.491e+00  
     GE8    -1.945089e+04  -1.856147e-11  1.367e-07  2.516e+00  
     GE9    -1.945089e+04  -3.093578e-12  5.140e-08  2.459e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.411e+01     -4.863e+00     2.042e+00      
     -4.863e+00     -1.562e+01     -3.057e+00     
     2.042e+00      -3.057e+00     -1.310e+01     
     TOTAL-PRESSURE: -1.428e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.211e-01           7.388e+02           -1.042e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 81
     -------------------------------------------
     DONE(2.683e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945096e+04  0.000000e+00   1.704e-03  2.798e+00  
     GE2    -1.945096e+04  -1.929565e-03  9.527e-04  2.483e+00  
     GE3    -1.945096e+04  -1.423169e-04  1.259e-04  2.701e+00  
     GE4    -1.945096e+04  -4.631414e-06  4.336e-05  2.490e+00  
     GE5    -1.945096e+04  -3.328225e-07  1.418e-05  2.493e+00  
     GE6    -1.945096e+04  -3.607730e-08  2.312e-06  2.563e+00  
     GE7    -1.945096e+04  -3.712293e-10  8.352e-07  2.834e+00  
     GE8    -1.945096e+04  9.280733e-12   1.365e-07  2.715e+00  
     GE9    -1.945096e+04  6.187155e-12   5.123e-08  2.563e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.445e+01     -4.623e+00     1.861e+00      
     -4.623e+00     -1.551e+01     -3.111e+00     
     1.861e+00      -3.111e+00     -1.357e+01     
     TOTAL-PRESSURE: -1.451e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.225e-01           7.434e+02           -1.064e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 82
     -------------------------------------------
     DONE(2.716e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945102e+04  0.000000e+00   1.706e-03  3.000e+00  
     GE2    -1.945103e+04  -1.928910e-03  9.547e-04  2.480e+00  
     GE3    -1.945103e+04  -1.434670e-04  1.258e-04  2.586e+00  
     GE4    -1.945103e+04  -4.617418e-06  4.350e-05  2.828e+00  
     GE5    -1.945103e+04  -3.414969e-07  1.410e-05  2.682e+00  
     GE6    -1.945103e+04  -3.466972e-08  2.284e-06  2.484e+00  
     GE7    -1.945103e+04  -3.588550e-10  8.365e-07  2.474e+00  
     GE8    -1.945103e+04  2.165504e-11   1.358e-07  2.677e+00  
     GE9    -1.945103e+04  -1.546789e-11  5.085e-08  2.446e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.476e+01     -4.375e+00     1.682e+00      
     -4.375e+00     -1.540e+01     -3.154e+00     
     1.682e+00      -3.154e+00     -1.403e+01     
     TOTAL-PRESSURE: -1.473e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.237e-01           7.475e+02           -1.083e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 83
     -------------------------------------------
     DONE(2.748e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945109e+04  0.000000e+00   1.706e-03  2.998e+00  
     GE2    -1.945109e+04  -1.936338e-03  9.558e-04  2.488e+00  
     GE3    -1.945109e+04  -1.441599e-04  1.255e-04  2.481e+00  
     GE4    -1.945109e+04  -4.590761e-06  4.365e-05  2.580e+00  
     GE5    -1.945109e+04  -3.400708e-07  1.403e-05  2.604e+00  
     GE6    -1.945109e+04  -3.660940e-08  2.264e-06  2.630e+00  
     GE7    -1.945109e+04  -3.186385e-10  8.373e-07  2.685e+00  
     GE8    -1.945109e+04  0.000000e+00   1.348e-07  2.675e+00  
     GE9    -1.945109e+04  2.165504e-11   5.029e-08  2.565e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.504e+01     -4.122e+00     1.508e+00      
     -4.122e+00     -1.529e+01     -3.183e+00     
     1.508e+00      -3.183e+00     -1.445e+01     
     TOTAL-PRESSURE: -1.493e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.248e-01           7.511e+02           -1.101e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 84
     -------------------------------------------
     DONE(2.781e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945114e+04  0.000000e+00   1.705e-03  2.702e+00  
     GE2    -1.945114e+04  -1.946485e-03  9.562e-04  2.578e+00  
     GE3    -1.945114e+04  -1.444445e-04  1.252e-04  2.596e+00  
     GE4    -1.945114e+04  -4.545288e-06  4.381e-05  2.487e+00  
     GE5    -1.945114e+04  -3.447390e-07  1.398e-05  2.907e+00  
     GE6    -1.945114e+04  -3.635882e-08  2.251e-06  2.570e+00  
     GE7    -1.945114e+04  -3.433871e-10  8.375e-07  2.480e+00  
     GE8    -1.945114e+04  -9.961320e-10  1.336e-07  2.575e+00  
     GE9    -1.945114e+04  -5.320953e-10  4.960e-08  2.653e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.529e+01     -3.867e+00     1.340e+00      
     -3.867e+00     -1.519e+01     -3.196e+00     
     1.340e+00      -3.196e+00     -1.483e+01     
     TOTAL-PRESSURE: -1.510e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.257e-01           7.543e+02           -1.117e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 85
     -------------------------------------------
     DONE(2.813e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945120e+04  0.000000e+00   1.704e-03  2.695e+00  
     GE2    -1.945120e+04  -1.955397e-03  9.562e-04  2.593e+00  
     GE3    -1.945120e+04  -1.446730e-04  1.250e-04  3.008e+00  
     GE4    -1.945120e+04  -4.505016e-06  4.398e-05  2.816e+00  
     GE5    -1.945120e+04  -3.436563e-07  1.393e-05  2.674e+00  
     GE6    -1.945120e+04  -3.809122e-08  2.246e-06  2.487e+00  
     GE7    -1.945120e+04  -3.402935e-10  8.377e-07  2.589e+00  
     GE8    -1.945120e+04  -6.187155e-12  1.324e-07  2.679e+00  
     GE9    -1.945120e+04  2.784220e-11   4.890e-08  2.574e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.550e+01     -3.614e+00     1.182e+00      
     -3.614e+00     -1.509e+01     -3.190e+00     
     1.182e+00      -3.190e+00     -1.518e+01     
     TOTAL-PRESSURE: -1.526e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.266e-01           7.571e+02           -1.131e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 86
     -------------------------------------------
     DONE(2.846e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945125e+04  0.000000e+00   1.702e-03  2.682e+00  
     GE2    -1.945125e+04  -1.961967e-03  9.559e-04  2.681e+00  
     GE3    -1.945125e+04  -1.446889e-04  1.249e-04  2.685e+00  
     GE4    -1.945125e+04  -4.483169e-06  4.417e-05  2.691e+00  
     GE5    -1.945125e+04  -3.510870e-07  1.392e-05  2.607e+00  
     GE6    -1.945125e+04  -3.758697e-08  2.250e-06  2.479e+00  
     GE7    -1.945125e+04  -3.619486e-10  8.386e-07  2.597e+00  
     GE8    -1.945125e+04  1.546789e-11   1.313e-07  2.696e+00  
     GE9    -1.945125e+04  2.165504e-11   4.839e-08  2.754e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.568e+01     -3.367e+00     1.033e+00      
     -3.367e+00     -1.500e+01     -3.164e+00     
     1.033e+00      -3.164e+00     -1.550e+01     
     TOTAL-PRESSURE: -1.539e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.274e-01           7.598e+02           -1.143e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 87
     -------------------------------------------
     DONE(2.879e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945130e+04  0.000000e+00   1.702e-03  2.835e+00  
     GE2    -1.945130e+04  -1.969872e-03  9.558e-04  2.685e+00  
     GE3    -1.945130e+04  -1.447830e-04  1.251e-04  2.480e+00  
     GE4    -1.945130e+04  -4.475664e-06  4.436e-05  2.884e+00  
     GE5    -1.945130e+04  -3.462146e-07  1.394e-05  2.487e+00  
     GE6    -1.945130e+04  -3.894814e-08  2.262e-06  2.469e+00  
     GE7    -1.945130e+04  -3.743229e-10  8.409e-07  2.775e+00  
     GE8    -1.945130e+04  5.259082e-11   1.306e-07  2.499e+00  
     GE9    -1.945130e+04  -9.280733e-12  4.825e-08  2.676e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.583e+01     -3.129e+00     8.954e-01      
     -3.129e+00     -1.492e+01     -3.117e+00     
     8.954e-01      -3.117e+00     -1.578e+01     
     TOTAL-PRESSURE: -1.551e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.282e-01           7.625e+02           -1.153e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 88
     -------------------------------------------
     DONE(2.911e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945135e+04  0.000000e+00   1.702e-03  2.688e+00  
     GE2    -1.945135e+04  -1.987446e-03  9.560e-04  2.697e+00  
     GE3    -1.945135e+04  -1.450211e-04  1.256e-04  2.795e+00  
     GE4    -1.945135e+04  -4.490161e-06  4.457e-05  2.567e+00  
     GE5    -1.945135e+04  -3.438883e-07  1.399e-05  2.564e+00  
     GE6    -1.945135e+04  -3.862022e-08  2.280e-06  2.473e+00  
     GE7    -1.945135e+04  -3.526678e-10  8.442e-07  2.469e+00  
     GE8    -1.945135e+04  4.949724e-11   1.302e-07  2.571e+00  
     GE9    -1.945135e+04  -1.546789e-11  4.840e-08  2.439e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.596e+01     -2.904e+00     7.681e-01      
     -2.904e+00     -1.486e+01     -3.049e+00     
     7.681e-01      -3.049e+00     -1.603e+01     
     TOTAL-PRESSURE: -1.562e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.291e-01           7.654e+02           -1.162e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 89
     -------------------------------------------
     DONE(2.943e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945140e+04  0.000000e+00   1.705e-03  2.683e+00  
     GE2    -1.945140e+04  -2.000532e-03  9.568e-04  2.690e+00  
     GE3    -1.945140e+04  -1.455843e-04  1.265e-04  2.570e+00  
     GE4    -1.945140e+04  -4.525279e-06  4.477e-05  2.701e+00  
     GE5    -1.945140e+04  -3.423910e-07  1.406e-05  2.482e+00  
     GE6    -1.945140e+04  -3.855835e-08  2.305e-06  2.695e+00  
     GE7    -1.945140e+04  -3.402935e-10  8.484e-07  2.576e+00  
     GE8    -1.945140e+04  2.165504e-11   1.301e-07  2.470e+00  
     GE9    -1.945140e+04  -6.187155e-12  4.870e-08  2.461e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.606e+01     -2.696e+00     6.506e-01      
     -2.696e+00     -1.481e+01     -2.961e+00     
     6.506e-01      -2.961e+00     -1.624e+01     
     TOTAL-PRESSURE: -1.571e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.300e-01           7.686e+02           -1.170e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 90
     -------------------------------------------
     DONE(2.975e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945145e+04  0.000000e+00   1.708e-03  2.982e+00  
     GE2    -1.945146e+04  -2.027940e-03  9.578e-04  2.497e+00  
     GE3    -1.945146e+04  -1.464647e-04  1.277e-04  2.771e+00  
     GE4    -1.945146e+04  -4.591014e-06  4.498e-05  2.668e+00  
     GE5    -1.945146e+04  -3.421373e-07  1.416e-05  2.458e+00  
     GE6    -1.945146e+04  -4.184064e-08  2.332e-06  2.479e+00  
     GE7    -1.945146e+04  -3.990715e-10  8.533e-07  2.675e+00  
     GE8    -1.945146e+04  4.640366e-11   1.304e-07  2.465e+00  
     GE9    -1.945146e+04  -9.280733e-12  4.904e-08  2.759e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.614e+01     -2.508e+00     5.418e-01      
     -2.508e+00     -1.478e+01     -2.855e+00     
     5.418e-01      -2.855e+00     -1.642e+01     
     TOTAL-PRESSURE: -1.578e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.311e-01           7.721e+02           -1.175e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 91
     -------------------------------------------
     DONE(3.008e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945151e+04  0.000000e+00   1.713e-03  2.798e+00  
     GE2    -1.945151e+04  -2.051682e-03  9.592e-04  2.591e+00  
     GE3    -1.945151e+04  -1.477455e-04  1.291e-04  2.578e+00  
     GE4    -1.945151e+04  -4.691191e-06  4.519e-05  2.674e+00  
     GE5    -1.945151e+04  -3.346942e-07  1.428e-05  2.470e+00  
     GE6    -1.945151e+04  -4.097134e-08  2.360e-06  2.566e+00  
     GE7    -1.945151e+04  -4.145394e-10  8.582e-07  2.971e+00  
     GE8    -1.945151e+04  4.021651e-11   1.308e-07  2.466e+00  
     GE9    -1.945151e+04  6.187155e-12   4.927e-08  2.479e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.620e+01     -2.342e+00     4.405e-01      
     -2.342e+00     -1.477e+01     -2.733e+00     
     4.405e-01      -2.733e+00     -1.656e+01     
     TOTAL-PRESSURE: -1.584e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.322e-01           7.759e+02           -1.180e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 92
     -------------------------------------------
     DONE(3.040e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945156e+04  0.000000e+00   1.719e-03  2.770e+00  
     GE2    -1.945157e+04  -2.086007e-03  9.610e-04  2.680e+00  
     GE3    -1.945157e+04  -1.492653e-04  1.308e-04  2.668e+00  
     GE4    -1.945157e+04  -4.835404e-06  4.543e-05  2.777e+00  
     GE5    -1.945157e+04  -3.318388e-07  1.440e-05  2.594e+00  
     GE6    -1.945157e+04  -4.009895e-08  2.389e-06  2.486e+00  
     GE7    -1.945157e+04  -4.176330e-10  8.632e-07  2.559e+00  
     GE8    -1.945157e+04  3.402935e-11   1.314e-07  2.496e+00  
     GE9    -1.945157e+04  1.237431e-11   4.941e-08  2.460e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.624e+01     -2.201e+00     3.455e-01      
     -2.201e+00     -1.478e+01     -2.598e+00     
     3.455e-01      -2.598e+00     -1.665e+01     
     TOTAL-PRESSURE: -1.589e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.334e-01           7.800e+02           -1.182e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 93
     -------------------------------------------
     DONE(3.073e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945162e+04  0.000000e+00   1.727e-03  2.691e+00  
     GE2    -1.945162e+04  -2.119875e-03  9.631e-04  2.469e+00  
     GE3    -1.945162e+04  -1.511723e-04  1.325e-04  2.479e+00  
     GE4    -1.945162e+04  -4.998996e-06  4.568e-05  2.672e+00  
     GE5    -1.945162e+04  -3.333020e-07  1.453e-05  2.700e+00  
     GE6    -1.945162e+04  -4.077026e-08  2.414e-06  2.482e+00  
     GE7    -1.945162e+04  -4.423816e-10  8.681e-07  2.465e+00  
     GE8    -1.945162e+04  6.187155e-11   1.322e-07  2.480e+00  
     GE9    -1.945162e+04  9.280733e-12   4.945e-08  2.484e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.626e+01     -2.086e+00     2.549e-01      
     -2.086e+00     -1.479e+01     -2.452e+00     
     2.549e-01      -2.452e+00     -1.670e+01     
     TOTAL-PRESSURE: -1.592e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.347e-01           7.843e+02           -1.183e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 94
     -------------------------------------------
     DONE(3.104e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945168e+04  0.000000e+00   1.736e-03  2.795e+00  
     GE2    -1.945168e+04  -2.150750e-03  9.654e-04  2.495e+00  
     GE3    -1.945168e+04  -1.531626e-04  1.343e-04  2.474e+00  
     GE4    -1.945168e+04  -5.168103e-06  4.595e-05  2.486e+00  
     GE5    -1.945168e+04  -3.339177e-07  1.465e-05  2.577e+00  
     GE6    -1.945168e+04  -4.126832e-08  2.437e-06  2.681e+00  
     GE7    -1.945168e+04  -4.547559e-10  8.728e-07  2.848e+00  
     GE8    -1.945168e+04  3.093578e-11   1.331e-07  2.467e+00  
     GE9    -1.945168e+04  0.000000e+00   4.940e-08  2.575e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.627e+01     -1.998e+00     1.671e-01      
     -1.998e+00     -1.482e+01     -2.298e+00     
     1.671e-01      -2.298e+00     -1.669e+01     
     TOTAL-PRESSURE: -1.593e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.360e-01           7.887e+02           -1.181e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 95
     -------------------------------------------
     DONE(3.137e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945173e+04  0.000000e+00   1.746e-03  2.674e+00  
     GE2    -1.945174e+04  -2.181159e-03  9.680e-04  2.596e+00  
     GE3    -1.945174e+04  -1.552938e-04  1.359e-04  2.763e+00  
     GE4    -1.945174e+04  -5.331700e-06  4.623e-05  2.467e+00  
     GE5    -1.945174e+04  -3.375093e-07  1.477e-05  2.467e+00  
     GE6    -1.945174e+04  -4.302857e-08  2.456e-06  2.576e+00  
     GE7    -1.945174e+04  -4.856917e-10  8.770e-07  2.595e+00  
     GE8    -1.945174e+04  1.237431e-11   1.340e-07  2.472e+00  
     GE9    -1.945174e+04  1.252899e-09   4.928e-08  2.449e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.626e+01     -1.935e+00     8.048e-02      
     -1.935e+00     -1.485e+01     -2.140e+00     
     8.048e-02      -2.140e+00     -1.664e+01     
     TOTAL-PRESSURE: -1.591e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.373e-01           7.930e+02           -1.178e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 96
     -------------------------------------------
     DONE(3.169e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945179e+04  0.000000e+00   1.755e-03  2.685e+00  
     GE2    -1.945179e+04  -2.211864e-03  9.708e-04  2.478e+00  
     GE3    -1.945179e+04  -1.572272e-04  1.374e-04  2.458e+00  
     GE4    -1.945179e+04  -5.494089e-06  4.650e-05  2.466e+00  
     GE5    -1.945179e+04  -3.398388e-07  1.488e-05  2.840e+00  
     GE6    -1.945179e+04  -4.464651e-08  2.473e-06  2.682e+00  
     GE7    -1.945179e+04  -4.578495e-10  8.810e-07  2.679e+00  
     GE8    -1.945179e+04  7.424586e-11   1.350e-07  2.752e+00  
     GE9    -1.945179e+04  -3.402935e-11  4.912e-08  2.546e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.623e+01     -1.897e+00     -6.424e-03     
     -1.897e+00     -1.488e+01     -1.981e+00     
     -6.424e-03     -1.981e+00     -1.652e+01     
     TOTAL-PRESSURE: -1.588e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.385e-01           7.970e+02           -1.172e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 97
     -------------------------------------------
     DONE(3.201e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945183e+04  0.000000e+00   1.763e-03  2.671e+00  
     GE2    -1.945184e+04  -2.246841e-03  9.733e-04  2.575e+00  
     GE3    -1.945184e+04  -1.591642e-04  1.387e-04  2.551e+00  
     GE4    -1.945184e+04  -5.630757e-06  4.674e-05  2.746e+00  
     GE5    -1.945184e+04  -3.426354e-07  1.498e-05  2.557e+00  
     GE6    -1.945184e+04  -4.393499e-08  2.487e-06  2.443e+00  
     GE7    -1.945184e+04  -4.609431e-10  8.847e-07  2.551e+00  
     GE8    -1.945184e+04  5.568440e-11   1.361e-07  2.462e+00  
     GE9    -1.945184e+04  -2.474862e-11  4.895e-08  2.748e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.618e+01     -1.882e+00     -9.531e-02     
     -1.882e+00     -1.490e+01     -1.823e+00     
     -9.531e-02     -1.823e+00     -1.634e+01     
     TOTAL-PRESSURE: -1.581e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.396e-01           8.006e+02           -1.163e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 98
     -------------------------------------------
     DONE(3.233e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945188e+04  0.000000e+00   1.771e-03  2.705e+00  
     GE2    -1.945188e+04  -2.281197e-03  9.753e-04  2.759e+00  
     GE3    -1.945188e+04  -1.608975e-04  1.396e-04  2.579e+00  
     GE4    -1.945188e+04  -5.732696e-06  4.697e-05  2.609e+00  
     GE5    -1.945188e+04  -3.429695e-07  1.506e-05  2.474e+00  
     GE6    -1.945188e+04  -4.426909e-08  2.496e-06  2.893e+00  
     GE7    -1.945188e+04  -3.402935e-10  8.876e-07  2.567e+00  
     GE8    -1.945188e+04  8.043302e-11   1.369e-07  2.566e+00  
     GE9    -1.945188e+04  -1.546789e-11  4.874e-08  2.532e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.611e+01     -1.885e+00     -1.874e-01     
     -1.885e+00     -1.491e+01     -1.670e+00     
     -1.874e-01     -1.670e+00     -1.610e+01     
     TOTAL-PRESSURE: -1.571e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.405e-01           8.036e+02           -1.151e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 99
     -------------------------------------------
     DONE(3.266e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945191e+04  0.000000e+00   1.776e-03  2.793e+00  
     GE2    -1.945191e+04  -2.310627e-03  9.766e-04  2.663e+00  
     GE3    -1.945191e+04  -1.622265e-04  1.403e-04  2.664e+00  
     GE4    -1.945191e+04  -5.795041e-06  4.719e-05  2.468e+00  
     GE5    -1.945191e+04  -3.464250e-07  1.512e-05  2.555e+00  
     GE6    -1.945191e+04  -4.310900e-08  2.501e-06  2.688e+00  
     GE7    -1.945191e+04  -4.702238e-10  8.893e-07  2.577e+00  
     GE8    -1.945191e+04  5.259082e-11   1.375e-07  2.882e+00  
     GE9    -1.945191e+04  3.093578e-12   4.849e-08  2.480e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.601e+01     -1.905e+00     -2.839e-01     
     -1.905e+00     -1.491e+01     -1.524e+00     
     -2.839e-01     -1.524e+00     -1.579e+01     
     TOTAL-PRESSURE: -1.557e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.411e-01           8.058e+02           -1.137e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 100
     -------------------------------------------
     DONE(3.298e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945194e+04  0.000000e+00   1.780e-03  2.697e+00  
     GE2    -1.945194e+04  -2.343607e-03  9.770e-04  2.573e+00  
     GE3    -1.945194e+04  -1.630427e-04  1.406e-04  2.464e+00  
     GE4    -1.945194e+04  -5.787691e-06  4.736e-05  2.676e+00  
     GE5    -1.945194e+04  -3.498434e-07  1.516e-05  2.818e+00  
     GE6    -1.945194e+04  -4.334102e-08  2.504e-06  2.760e+00  
     GE7    -1.945194e+04  2.657383e-09   8.901e-07  2.681e+00  
     GE8    -1.945194e+04  3.712293e-11   1.377e-07  2.566e+00  
     GE9    -1.945194e+04  6.187155e-12   4.822e-08  2.449e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.589e+01     -1.938e+00     -3.855e-01     
     -1.938e+00     -1.488e+01     -1.391e+00     
     -3.855e-01     -1.391e+00     -1.543e+01     
     TOTAL-PRESSURE: -1.540e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.416e-01           8.072e+02           -1.119e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 101
     -------------------------------------------
     DONE(3.331e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945196e+04  0.000000e+00   1.781e-03  2.670e+00  
     GE2    -1.945196e+04  -2.371872e-03  9.764e-04  2.565e+00  
     GE3    -1.945196e+04  -1.634061e-04  1.406e-04  2.466e+00  
     GE4    -1.945196e+04  -5.748903e-06  4.749e-05  2.775e+00  
     GE5    -1.945196e+04  -3.534412e-07  1.519e-05  2.574e+00  
     GE6    -1.945196e+04  -4.423816e-08  2.504e-06  2.672e+00  
     GE7    -1.945196e+04  2.258312e-10   8.896e-07  2.497e+00  
     GE8    -1.945196e+04  5.568440e-11   1.377e-07  2.684e+00  
     GE9    -1.945196e+04  1.546789e-11   4.793e-08  2.482e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.575e+01     -1.980e+00     -4.922e-01     
     -1.980e+00     -1.484e+01     -1.272e+00     
     -4.922e-01     -1.272e+00     -1.500e+01     
     TOTAL-PRESSURE: -1.520e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.417e-01           8.076e+02           -1.098e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 102
     -------------------------------------------
     DONE(3.363e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945197e+04  0.000000e+00   1.781e-03  2.778e+00  
     GE2    -1.945197e+04  -2.388681e-03  9.749e-04  2.556e+00  
     GE3    -1.945197e+04  -1.632198e-04  1.403e-04  2.566e+00  
     GE4    -1.945197e+04  -5.672251e-06  4.760e-05  2.588e+00  
     GE5    -1.945197e+04  -3.586230e-07  1.520e-05  2.489e+00  
     GE6    -1.945197e+04  -4.197985e-08  2.502e-06  2.604e+00  
     GE7    -1.945197e+04  -4.331009e-10  8.880e-07  2.581e+00  
     GE8    -1.945197e+04  4.021651e-11   1.372e-07  2.670e+00  
     GE9    -1.945197e+04  3.093578e-12   4.758e-08  2.727e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.558e+01     -2.028e+00     -6.037e-01     
     -2.028e+00     -1.477e+01     -1.172e+00     
     -6.037e-01     -1.172e+00     -1.452e+01     
     TOTAL-PRESSURE: -1.496e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.415e-01           8.071e+02           -1.074e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 103
     -------------------------------------------
     DONE(3.396e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945197e+04  0.000000e+00   1.778e-03  2.957e+00  
     GE2    -1.945197e+04  -2.403662e-03  9.722e-04  2.587e+00  
     GE3    -1.945197e+04  -1.627626e-04  1.396e-04  2.465e+00  
     GE4    -1.945197e+04  -5.559774e-06  4.766e-05  2.694e+00  
     GE5    -1.945197e+04  -3.642100e-07  1.519e-05  2.761e+00  
     GE6    -1.945197e+04  -4.349879e-08  2.496e-06  2.573e+00  
     GE7    -1.945197e+04  1.447794e-09   8.854e-07  2.571e+00  
     GE8    -1.945197e+04  3.712293e-11   1.364e-07  2.573e+00  
     GE9    -1.945197e+04  6.187155e-12   4.719e-08  2.568e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.538e+01     -2.077e+00     -7.192e-01     
     -2.077e+00     -1.467e+01     -1.093e+00     
     -7.192e-01     -1.093e+00     -1.400e+01     
     TOTAL-PRESSURE: -1.468e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.411e-01           8.057e+02           -1.048e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 104
     -------------------------------------------
     DONE(3.428e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945197e+04  0.000000e+00   1.774e-03  2.769e+00  
     GE2    -1.945197e+04  -2.423174e-03  9.688e-04  2.801e+00  
     GE3    -1.945197e+04  -1.619964e-04  1.387e-04  2.788e+00  
     GE4    -1.945197e+04  -5.396718e-06  4.769e-05  2.448e+00  
     GE5    -1.945197e+04  -3.648411e-07  1.517e-05  2.629e+00  
     GE6    -1.945197e+04  -4.574473e-08  2.488e-06  2.563e+00  
     GE7    -1.945197e+04  -4.207265e-10  8.815e-07  2.577e+00  
     GE8    -1.945197e+04  6.187155e-11   1.354e-07  2.447e+00  
     GE9    -1.945197e+04  -6.187155e-12  4.678e-08  2.445e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.515e+01     -2.125e+00     -8.370e-01     
     -2.125e+00     -1.455e+01     -1.038e+00     
     -8.370e-01     -1.038e+00     -1.343e+01     
     TOTAL-PRESSURE: -1.438e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.405e-01           8.035e+02           -1.018e+01          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 105
     -------------------------------------------
     DONE(3.460e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945195e+04  0.000000e+00   1.768e-03  2.797e+00  
     GE2    -1.945196e+04  -2.438118e-03  9.648e-04  2.568e+00  
     GE3    -1.945196e+04  -1.608148e-04  1.376e-04  2.729e+00  
     GE4    -1.945196e+04  -5.214395e-06  4.767e-05  2.563e+00  
     GE5    -1.945196e+04  -3.760398e-07  1.514e-05  2.479e+00  
     GE6    -1.945196e+04  -4.537660e-08  2.479e-06  2.552e+00  
     GE7    -1.945196e+04  -4.547559e-10  8.766e-07  2.445e+00  
     GE8    -1.945196e+04  4.640366e-11   1.341e-07  2.490e+00  
     GE9    -1.945196e+04  2.474862e-11   4.634e-08  2.471e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.490e+01     -2.169e+00     -9.551e-01     
     -2.169e+00     -1.441e+01     -1.010e+00     
     -9.551e-01     -1.010e+00     -1.282e+01     
     TOTAL-PRESSURE: -1.404e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.396e-01           8.006e+02           -9.866e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 106
     -------------------------------------------
     DONE(3.492e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945194e+04  0.000000e+00   1.762e-03  3.070e+00  
     GE2    -1.945194e+04  -2.442892e-03  9.607e-04  2.446e+00  
     GE3    -1.945194e+04  -1.595310e-04  1.363e-04  2.853e+00  
     GE4    -1.945194e+04  -5.010893e-06  4.762e-05  2.555e+00  
     GE5    -1.945194e+04  -3.773020e-07  1.510e-05  2.558e+00  
     GE6    -1.945194e+04  -4.439284e-08  2.466e-06  2.541e+00  
     GE7    -1.945194e+04  -4.083522e-10  8.706e-07  2.653e+00  
     GE8    -1.945194e+04  3.093578e-11   1.326e-07  2.637e+00  
     GE9    -1.945194e+04  -1.856147e-11  4.586e-08  2.433e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.462e+01     -2.205e+00     -1.071e+00     
     -2.205e+00     -1.425e+01     -1.010e+00     
     -1.071e+00     -1.010e+00     -1.220e+01     
     TOTAL-PRESSURE: -1.369e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.386e-01           7.971e+02           -9.528e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 107
     -------------------------------------------
     DONE(3.524e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945191e+04  0.000000e+00   1.755e-03  2.848e+00  
     GE2    -1.945192e+04  -2.439479e-03  9.563e-04  2.541e+00  
     GE3    -1.945192e+04  -1.580986e-04  1.348e-04  2.459e+00  
     GE4    -1.945192e+04  -4.787364e-06  4.753e-05  2.455e+00  
     GE5    -1.945192e+04  -3.816330e-07  1.505e-05  2.543e+00  
     GE6    -1.945192e+04  -4.407111e-08  2.452e-06  2.445e+00  
     GE7    -1.945192e+04  -4.300073e-10  8.640e-07  2.660e+00  
     GE8    -1.945192e+04  1.856147e-11   1.310e-07  2.540e+00  
     GE9    -1.945192e+04  -3.093578e-12  4.537e-08  2.422e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.431e+01     -2.230e+00     -1.182e+00     
     -2.230e+00     -1.407e+01     -1.037e+00     
     -1.182e+00     -1.037e+00     -1.155e+01     
     TOTAL-PRESSURE: -1.331e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.374e-01           7.933e+02           -9.175e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 108
     -------------------------------------------
     DONE(3.556e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945189e+04  0.000000e+00   1.748e-03  2.768e+00  
     GE2    -1.945189e+04  -2.436072e-03  9.520e-04  2.577e+00  
     GE3    -1.945189e+04  -1.567369e-04  1.334e-04  2.623e+00  
     GE4    -1.945189e+04  -4.574185e-06  4.741e-05  2.526e+00  
     GE5    -1.945189e+04  -3.840305e-07  1.498e-05  2.544e+00  
     GE6    -1.945189e+04  -4.252432e-08  2.436e-06  2.655e+00  
     GE7    -1.945189e+04  -3.743229e-10  8.571e-07  2.669e+00  
     GE8    -1.945189e+04  1.856147e-11   1.296e-07  2.579e+00  
     GE9    -1.945189e+04  3.093578e-11   4.488e-08  2.451e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.399e+01     -2.244e+00     -1.286e+00     
     -2.244e+00     -1.388e+01     -1.092e+00     
     -1.286e+00     -1.092e+00     -1.091e+01     
     TOTAL-PRESSURE: -1.293e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.362e-01           7.893e+02           -8.809e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 109
     -------------------------------------------
     DONE(3.589e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945187e+04  0.000000e+00   1.743e-03  2.689e+00  
     GE2    -1.945187e+04  -2.431674e-03  9.488e-04  2.710e+00  
     GE3    -1.945187e+04  -1.553880e-04  1.320e-04  2.608e+00  
     GE4    -1.945187e+04  -4.380976e-06  4.725e-05  2.469e+00  
     GE5    -1.945187e+04  -3.884172e-07  1.492e-05  2.620e+00  
     GE6    -1.945187e+04  -4.462486e-08  2.419e-06  2.426e+00  
     GE7    -1.945187e+04  1.160092e-09   8.499e-07  2.537e+00  
     GE8    -1.945187e+04  5.259082e-11   1.283e-07  2.729e+00  
     GE9    -1.945187e+04  -1.546789e-11  4.440e-08  2.404e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.365e+01     -2.244e+00     -1.380e+00     
     -2.244e+00     -1.368e+01     -1.173e+00     
     -1.380e+00     -1.173e+00     -1.027e+01     
     TOTAL-PRESSURE: -1.253e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.350e-01           7.852e+02           -8.435e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 110
     -------------------------------------------
     DONE(3.621e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945184e+04  0.000000e+00   1.738e-03  2.688e+00  
     GE2    -1.945184e+04  -2.423288e-03  9.461e-04  2.634e+00  
     GE3    -1.945184e+04  -1.541224e-04  1.308e-04  2.658e+00  
     GE4    -1.945184e+04  -4.194121e-06  4.707e-05  2.424e+00  
     GE5    -1.945184e+04  -3.862579e-07  1.484e-05  2.465e+00  
     GE6    -1.945184e+04  -4.191488e-08  2.401e-06  2.432e+00  
     GE7    -1.945184e+04  -3.866972e-10  8.427e-07  2.653e+00  
     GE8    -1.945184e+04  0.000000e+00   1.271e-07  2.546e+00  
     GE9    -1.945184e+04  1.856147e-11   4.392e-08  2.467e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.329e+01     -2.230e+00     -1.464e+00     
     -2.230e+00     -1.348e+01     -1.277e+00     
     -1.464e+00     -1.277e+00     -9.639e+00     
     TOTAL-PRESSURE: -1.213e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.338e-01           7.812e+02           -8.059e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 111
     -------------------------------------------
     DONE(3.652e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945181e+04  0.000000e+00   1.734e-03  3.076e+00  
     GE2    -1.945182e+04  -2.417216e-03  9.440e-04  2.438e+00  
     GE3    -1.945182e+04  -1.530547e-04  1.296e-04  2.537e+00  
     GE4    -1.945182e+04  -4.042616e-06  4.688e-05  2.527e+00  
     GE5    -1.945182e+04  -3.892556e-07  1.477e-05  2.555e+00  
     GE6    -1.945182e+04  -4.176639e-08  2.383e-06  2.538e+00  
     GE7    -1.945182e+04  -3.928844e-10  8.359e-07  2.437e+00  
     GE8    -1.945182e+04  3.093578e-11   1.263e-07  2.447e+00  
     GE9    -1.945182e+04  3.093578e-11   4.347e-08  2.517e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.291e+01     -2.201e+00     -1.535e+00     
     -2.201e+00     -1.327e+01     -1.401e+00     
     -1.535e+00     -1.401e+00     -9.035e+00     
     TOTAL-PRESSURE: -1.174e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.327e-01           7.774e+02           -7.682e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 112
     -------------------------------------------
     DONE(3.684e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945179e+04  0.000000e+00   1.730e-03  2.680e+00  
     GE2    -1.945179e+04  -2.404232e-03  9.427e-04  2.455e+00  
     GE3    -1.945179e+04  -1.520902e-04  1.287e-04  2.670e+00  
     GE4    -1.945179e+04  -3.926180e-06  4.668e-05  2.636e+00  
     GE5    -1.945179e+04  -3.904342e-07  1.469e-05  2.525e+00  
     GE6    -1.945179e+04  -4.146631e-08  2.362e-06  2.647e+00  
     GE7    -1.945179e+04  1.079659e-09   8.295e-07  2.518e+00  
     GE8    -1.945179e+04  3.093578e-11   1.256e-07  2.434e+00  
     GE9    -1.945179e+04  -6.187155e-12  4.306e-08  2.515e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.252e+01     -2.158e+00     -1.592e+00     
     -2.158e+00     -1.306e+01     -1.540e+00     
     -1.592e+00     -1.540e+00     -8.459e+00     
     TOTAL-PRESSURE: -1.135e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.316e-01           7.740e+02           -7.310e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 113
     -------------------------------------------
     DONE(3.716e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945177e+04  0.000000e+00   1.728e-03  2.655e+00  
     GE2    -1.945177e+04  -2.398244e-03  9.421e-04  2.550e+00  
     GE3    -1.945177e+04  -1.513821e-04  1.278e-04  2.549e+00  
     GE4    -1.945177e+04  -3.841122e-06  4.648e-05  2.552e+00  
     GE5    -1.945177e+04  -3.969926e-07  1.461e-05  2.529e+00  
     GE6    -1.945177e+04  -3.739826e-08  2.342e-06  2.533e+00  
     GE7    -1.945177e+04  -3.557614e-10  8.238e-07  2.453e+00  
     GE8    -1.945177e+04  -1.856147e-11  1.254e-07  2.436e+00  
     GE9    -1.945177e+04  1.237431e-11   4.270e-08  2.511e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.213e+01     -2.100e+00     -1.636e+00     
     -2.100e+00     -1.286e+01     -1.691e+00     
     -1.636e+00     -1.691e+00     -7.918e+00     
     TOTAL-PRESSURE: -1.097e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.308e-01           7.711e+02           -6.944e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 114
     -------------------------------------------
     DONE(3.747e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945175e+04  0.000000e+00   1.726e-03  2.756e+00  
     GE2    -1.945176e+04  -2.386506e-03  9.416e-04  2.535e+00  
     GE3    -1.945176e+04  -1.508584e-04  1.271e-04  2.637e+00  
     GE4    -1.945176e+04  -3.790892e-06  4.629e-05  2.533e+00  
     GE5    -1.945176e+04  -3.986755e-07  1.455e-05  2.748e+00  
     GE6    -1.945176e+04  -3.831705e-08  2.322e-06  2.440e+00  
     GE7    -1.945176e+04  -7.362715e-10  8.184e-07  2.539e+00  
     GE8    -1.945176e+04  4.021651e-11   1.254e-07  2.426e+00  
     GE9    -1.945176e+04  6.187155e-12   4.242e-08  2.627e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.172e+01     -2.029e+00     -1.666e+00     
     -2.029e+00     -1.265e+01     -1.848e+00     
     -1.666e+00     -1.848e+00     -7.416e+00     
     TOTAL-PRESSURE: -1.060e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.300e-01           7.686e+02           -6.588e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 115
     -------------------------------------------
     DONE(3.779e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945174e+04  0.000000e+00   1.722e-03  2.977e+00  
     GE2    -1.945174e+04  -2.371117e-03  9.409e-04  2.570e+00  
     GE3    -1.945174e+04  -1.503990e-04  1.265e-04  2.538e+00  
     GE4    -1.945174e+04  -3.776670e-06  4.611e-05  2.429e+00  
     GE5    -1.945174e+04  -3.979578e-07  1.449e-05  2.450e+00  
     GE6    -1.945174e+04  -3.905951e-08  2.302e-06  2.629e+00  
     GE7    -1.945174e+04  -3.124513e-10  8.133e-07  2.741e+00  
     GE8    -1.945174e+04  -4.083522e-10  1.257e-07  2.452e+00  
     GE9    -1.945174e+04  -6.187155e-12  4.223e-08  2.633e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.132e+01     -1.947e+00     -1.683e+00     
     -1.947e+00     -1.245e+01     -2.007e+00     
     -1.683e+00     -2.007e+00     -6.955e+00     
     TOTAL-PRESSURE: -1.024e+01 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.295e-01           7.667e+02           -6.243e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 116
     -------------------------------------------
     DONE(3.811e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945173e+04  0.000000e+00   1.718e-03  2.942e+00  
     GE2    -1.945173e+04  -2.362179e-03  9.404e-04  2.427e+00  
     GE3    -1.945173e+04  -1.498953e-04  1.261e-04  2.431e+00  
     GE4    -1.945173e+04  -3.790242e-06  4.592e-05  2.425e+00  
     GE5    -1.945173e+04  -3.973515e-07  1.444e-05  2.522e+00  
     GE6    -1.945173e+04  -3.843770e-08  2.283e-06  2.528e+00  
     GE7    -1.945173e+04  -3.372000e-10  8.087e-07  2.545e+00  
     GE8    -1.945173e+04  0.000000e+00   1.263e-07  2.526e+00  
     GE9    -1.945173e+04  -2.165504e-11  4.212e-08  2.731e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.092e+01     -1.856e+00     -1.687e+00     
     -1.856e+00     -1.226e+01     -2.161e+00     
     -1.687e+00     -2.161e+00     -6.536e+00     
     TOTAL-PRESSURE: -9.905e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.291e-01           7.654e+02           -5.912e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 117
     -------------------------------------------
     DONE(3.842e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945172e+04  0.000000e+00   1.714e-03  2.635e+00  
     GE2    -1.945172e+04  -2.346484e-03  9.399e-04  2.523e+00  
     GE3    -1.945172e+04  -1.495351e-04  1.257e-04  2.728e+00  
     GE4    -1.945172e+04  -3.828262e-06  4.573e-05  2.533e+00  
     GE5    -1.945172e+04  -3.903291e-07  1.439e-05  2.635e+00  
     GE6    -1.945172e+04  -3.944621e-08  2.268e-06  2.422e+00  
     GE7    -1.945172e+04  1.225057e-09   8.047e-07  2.433e+00  
     GE8    -1.945172e+04  1.856147e-11   1.270e-07  2.419e+00  
     GE9    -1.945172e+04  -2.784220e-11  4.213e-08  2.515e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.054e+01     -1.757e+00     -1.678e+00     
     -1.757e+00     -1.206e+01     -2.307e+00     
     -1.678e+00     -2.307e+00     -6.161e+00     
     TOTAL-PRESSURE: -9.588e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.289e-01           7.648e+02           -5.598e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 118
     -------------------------------------------
     DONE(3.874e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945172e+04  0.000000e+00   1.710e-03  2.751e+00  
     GE2    -1.945172e+04  -2.347711e-03  9.395e-04  2.896e+00  
     GE3    -1.945172e+04  -1.494796e-04  1.255e-04  2.452e+00  
     GE4    -1.945172e+04  -3.890208e-06  4.554e-05  2.514e+00  
     GE5    -1.945172e+04  -3.852432e-07  1.437e-05  2.610e+00  
     GE6    -1.945172e+04  -3.739826e-08  2.257e-06  2.505e+00  
     GE7    -1.945172e+04  -3.279192e-10  8.020e-07  2.518e+00  
     GE8    -1.945172e+04  1.856147e-11   1.280e-07  2.501e+00  
     GE9    -1.945172e+04  9.280733e-12   4.225e-08  2.590e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -1.017e+01     -1.654e+00     -1.658e+00     
     -1.654e+00     -1.188e+01     -2.439e+00     
     -1.658e+00     -2.439e+00     -5.827e+00     
     TOTAL-PRESSURE: -9.292e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.289e-01           7.648e+02           -5.303e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 119
     -------------------------------------------
     DONE(3.906e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945172e+04  0.000000e+00   1.707e-03  2.726e+00  
     GE2    -1.945172e+04  -2.345555e-03  9.396e-04  2.524e+00  
     GE3    -1.945172e+04  -1.495334e-04  1.254e-04  2.399e+00  
     GE4    -1.945172e+04  -3.976420e-06  4.535e-05  2.509e+00  
     GE5    -1.945172e+04  -3.915572e-07  1.436e-05  2.695e+00  
     GE6    -1.945172e+04  -3.365503e-08  2.252e-06  2.509e+00  
     GE7    -1.945172e+04  -3.402935e-10  8.003e-07  2.522e+00  
     GE8    -1.945172e+04  -1.237431e-11  1.291e-07  2.804e+00  
     GE9    -1.945172e+04  -1.856147e-11  4.246e-08  2.390e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -9.834e+00     -1.548e+00     -1.628e+00     
     -1.548e+00     -1.169e+01     -2.556e+00     
     -1.628e+00     -2.556e+00     -5.534e+00     
     TOTAL-PRESSURE: -9.021e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.291e-01           7.655e+02           -5.027e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 120
     -------------------------------------------
     DONE(3.938e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945173e+04  0.000000e+00   1.707e-03  3.036e+00  
     GE2    -1.945173e+04  -2.340206e-03  9.404e-04  2.701e+00  
     GE3    -1.945173e+04  -1.497363e-04  1.254e-04  2.603e+00  
     GE4    -1.945173e+04  -4.082229e-06  4.518e-05  2.511e+00  
     GE5    -1.945173e+04  -3.829292e-07  1.438e-05  2.615e+00  
     GE6    -1.945173e+04  -3.506570e-08  2.253e-06  2.599e+00  
     GE7    -1.945173e+04  -3.217321e-10  7.991e-07  2.417e+00  
     GE8    -1.945173e+04  -2.474862e-11  1.303e-07  2.622e+00  
     GE9    -1.945173e+04  6.187155e-12   4.270e-08  2.413e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -9.527e+00     -1.441e+00     -1.590e+00     
     -1.441e+00     -1.151e+01     -2.654e+00     
     -1.590e+00     -2.654e+00     -5.280e+00     
     TOTAL-PRESSURE: -8.773e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.295e-01           7.668e+02           -4.773e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 121
     -------------------------------------------
     DONE(3.970e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945174e+04  0.000000e+00   1.709e-03  2.844e+00  
     GE2    -1.945174e+04  -2.328789e-03  9.419e-04  2.720e+00  
     GE3    -1.945174e+04  -1.499805e-04  1.257e-04  2.600e+00  
     GE4    -1.945174e+04  -4.203395e-06  4.502e-05  2.725e+00  
     GE5    -1.945174e+04  -3.794706e-07  1.441e-05  2.410e+00  
     GE6    -1.945174e+04  -3.762100e-08  2.260e-06  2.410e+00  
     GE7    -1.945174e+04  -2.815156e-10  7.986e-07  2.600e+00  
     GE8    -1.945174e+04  -3.712293e-11  1.316e-07  2.528e+00  
     GE9    -1.945174e+04  -1.856147e-11  4.296e-08  2.590e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -9.257e+00     -1.333e+00     -1.545e+00     
     -1.333e+00     -1.133e+01     -2.736e+00     
     -1.545e+00     -2.736e+00     -5.060e+00     
     TOTAL-PRESSURE: -8.549e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.300e-01           7.687e+02           -4.539e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 122
     -------------------------------------------
     DONE(4.001e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945175e+04  0.000000e+00   1.712e-03  2.734e+00  
     GE2    -1.945175e+04  -2.312328e-03  9.441e-04  2.600e+00  
     GE3    -1.945175e+04  -1.502913e-04  1.261e-04  2.510e+00  
     GE4    -1.945175e+04  -4.323411e-06  4.489e-05  2.617e+00  
     GE5    -1.945175e+04  -3.827189e-07  1.447e-05  2.711e+00  
     GE6    -1.945175e+04  -3.628766e-08  2.273e-06  2.521e+00  
     GE7    -1.945175e+04  -3.310128e-10  7.987e-07  2.611e+00  
     GE8    -1.945175e+04  -5.568440e-11  1.329e-07  2.477e+00  
     GE9    -1.945175e+04  -9.280733e-12  4.322e-08  2.685e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -9.028e+00     -1.223e+00     -1.497e+00     
     -1.223e+00     -1.115e+01     -2.802e+00     
     -1.497e+00     -2.802e+00     -4.874e+00     
     TOTAL-PRESSURE: -8.350e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.308e-01           7.712e+02           -4.327e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 123
     -------------------------------------------
     DONE(4.033e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945177e+04  0.000000e+00   1.718e-03  2.722e+00  
     GE2    -1.945177e+04  -2.304091e-03  9.470e-04  2.411e+00  
     GE3    -1.945177e+04  -1.506827e-04  1.266e-04  2.597e+00  
     GE4    -1.945177e+04  -4.432843e-06  4.475e-05  2.405e+00  
     GE5    -1.945177e+04  -3.854072e-07  1.452e-05  2.390e+00  
     GE6    -1.945177e+04  -3.888008e-08  2.289e-06  2.612e+00  
     GE7    -1.945177e+04  -3.310128e-10  7.992e-07  2.450e+00  
     GE8    -1.945177e+04  -4.640366e-11  1.342e-07  2.716e+00  
     GE9    -1.945177e+04  -4.021651e-11  4.346e-08  2.583e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.841e+00     -1.111e+00     -1.450e+00     
     -1.111e+00     -1.097e+01     -2.857e+00     
     -1.450e+00     -2.857e+00     -4.719e+00     
     TOTAL-PRESSURE: -8.176e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.317e-01           7.741e+02           -4.138e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 124
     -------------------------------------------
     DONE(4.064e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945178e+04  0.000000e+00   1.723e-03  2.822e+00  
     GE2    -1.945179e+04  -2.296743e-03  9.501e-04  2.598e+00  
     GE3    -1.945179e+04  -1.512767e-04  1.271e-04  2.388e+00  
     GE4    -1.945179e+04  -4.546495e-06  4.462e-05  2.495e+00  
     GE5    -1.945179e+04  -3.819981e-07  1.458e-05  2.393e+00  
     GE6    -1.945179e+04  -3.364266e-08  2.305e-06  2.403e+00  
     GE7    -1.945179e+04  -3.372000e-10  7.996e-07  2.531e+00  
     GE8    -1.945179e+04  -4.949724e-11  1.354e-07  2.529e+00  
     GE9    -1.945179e+04  1.237431e-11   4.364e-08  2.406e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.694e+00     -9.949e-01     -1.407e+00     
     -9.949e-01     -1.078e+01     -2.908e+00     
     -1.407e+00     -2.908e+00     -4.596e+00     
     TOTAL-PRESSURE: -8.024e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.326e-01           7.774e+02           -3.969e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 125
     -------------------------------------------
     DONE(4.096e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945180e+04  0.000000e+00   1.728e-03  2.795e+00  
     GE2    -1.945181e+04  -2.276798e-03  9.531e-04  2.504e+00  
     GE3    -1.945181e+04  -1.518864e-04  1.275e-04  2.494e+00  
     GE4    -1.945181e+04  -4.639305e-06  4.447e-05  2.501e+00  
     GE5    -1.945181e+04  -3.760986e-07  1.463e-05  2.587e+00  
     GE6    -1.945181e+04  -3.823971e-08  2.321e-06  2.639e+00  
     GE7    -1.945181e+04  -1.806649e-09  8.007e-07  2.622e+00  
     GE8    -1.945181e+04  -9.899448e-11  1.364e-07  2.499e+00  
     GE9    -1.945181e+04  0.000000e+00   4.377e-08  2.501e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.583e+00     -8.721e-01     -1.369e+00     
     -8.721e-01     -1.060e+01     -2.961e+00     
     -1.369e+00     -2.961e+00     -4.504e+00     
     TOTAL-PRESSURE: -7.894e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.337e-01           7.810e+02           -3.820e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 126
     -------------------------------------------
     DONE(4.128e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945182e+04  0.000000e+00   1.732e-03  2.720e+00  
     GE2    -1.945183e+04  -2.263628e-03  9.559e-04  2.715e+00  
     GE3    -1.945183e+04  -1.522849e-04  1.278e-04  2.536e+00  
     GE4    -1.945183e+04  -4.726779e-06  4.432e-05  2.611e+00  
     GE5    -1.945183e+04  -3.697630e-07  1.466e-05  2.408e+00  
     GE6    -1.945183e+04  -3.565657e-08  2.335e-06  2.628e+00  
     GE7    -1.945183e+04  -3.681357e-10  8.019e-07  2.609e+00  
     GE8    -1.945183e+04  -1.608660e-09  1.373e-07  2.508e+00  
     GE9    -1.945183e+04  9.280733e-12   4.385e-08  2.496e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.501e+00     -7.411e-01     -1.340e+00     
     -7.411e-01     -1.041e+01     -3.026e+00     
     -1.340e+00     -3.026e+00     -4.444e+00     
     TOTAL-PRESSURE: -7.786e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.349e-01           7.848e+02           -3.692e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 127
     -------------------------------------------
     DONE(4.160e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945184e+04  0.000000e+00   1.735e-03  2.829e+00  
     GE2    -1.945185e+04  -2.254206e-03  9.585e-04  2.494e+00  
     GE3    -1.945185e+04  -1.526142e-04  1.280e-04  2.700e+00  
     GE4    -1.945185e+04  -4.804147e-06  4.415e-05  2.611e+00  
     GE5    -1.945185e+04  -3.691009e-07  1.469e-05  2.901e+00  
     GE6    -1.945185e+04  -3.354057e-08  2.347e-06  2.708e+00  
     GE7    -1.945185e+04  -3.866972e-10  8.029e-07  2.411e+00  
     GE8    -1.945185e+04  -7.115228e-11  1.379e-07  2.400e+00  
     GE9    -1.945185e+04  -3.093578e-11  4.384e-08  2.394e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.444e+00     -6.003e-01     -1.320e+00     
     -6.003e-01     -1.023e+01     -3.110e+00     
     -1.320e+00     -3.110e+00     -4.420e+00     
     TOTAL-PRESSURE: -7.699e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.361e-01           7.888e+02           -3.584e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 128
     -------------------------------------------
     DONE(4.192e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945186e+04  0.000000e+00   1.738e-03  2.761e+00  
     GE2    -1.945187e+04  -2.255006e-03  9.609e-04  2.515e+00  
     GE3    -1.945187e+04  -1.530584e-04  1.282e-04  2.630e+00  
     GE4    -1.945187e+04  -4.872805e-06  4.398e-05  2.555e+00  
     GE5    -1.945187e+04  -3.626539e-07  1.470e-05  2.525e+00  
     GE6    -1.945187e+04  -3.517398e-08  2.357e-06  2.511e+00  
     GE7    -1.945187e+04  -3.650422e-10  8.041e-07  2.730e+00  
     GE8    -1.945187e+04  -1.113688e-10  1.385e-07  2.808e+00  
     GE9    -1.945187e+04  1.546789e-11   4.379e-08  2.610e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.403e+00     -4.494e-01     -1.311e+00     
     -4.494e-01     -1.006e+01     -3.222e+00     
     -1.311e+00     -3.222e+00     -4.433e+00     
     TOTAL-PRESSURE: -7.632e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.373e-01           7.929e+02           -3.496e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 129
     -------------------------------------------
     DONE(4.225e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945188e+04  0.000000e+00   1.740e-03  2.622e+00  
     GE2    -1.945188e+04  -2.256413e-03  9.633e-04  2.409e+00  
     GE3    -1.945188e+04  -1.535121e-04  1.285e-04  2.398e+00  
     GE4    -1.945188e+04  -4.934037e-06  4.381e-05  2.510e+00  
     GE5    -1.945188e+04  -3.627343e-07  1.470e-05  2.391e+00  
     GE6    -1.945188e+04  -3.495433e-08  2.367e-06  2.516e+00  
     GE7    -1.945188e+04  -4.052587e-10  8.055e-07  2.630e+00  
     GE8    -1.945188e+04  -9.590090e-11  1.390e-07  2.518e+00  
     GE9    -1.945188e+04  0.000000e+00   4.368e-08  2.479e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.372e+00     -2.896e-01     -1.310e+00     
     -2.896e-01     -9.899e+00     -3.366e+00     
     -1.310e+00     -3.366e+00     -4.486e+00     
     TOTAL-PRESSURE: -7.586e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.385e-01           7.970e+02           -3.428e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 130
     -------------------------------------------
     DONE(4.256e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945190e+04  0.000000e+00   1.745e-03  2.614e+00  
     GE2    -1.945190e+04  -2.252741e-03  9.661e-04  2.466e+00  
     GE3    -1.945190e+04  -1.537122e-04  1.289e-04  2.440e+00  
     GE4    -1.945190e+04  -5.004286e-06  4.363e-05  2.399e+00  
     GE5    -1.945190e+04  -3.606709e-07  1.469e-05  2.598e+00  
     GE6    -1.945190e+04  -3.529463e-08  2.377e-06  2.572e+00  
     GE7    -1.945190e+04  -4.361944e-10  8.071e-07  2.611e+00  
     GE8    -1.945190e+04  -9.899448e-11  1.394e-07  2.401e+00  
     GE9    -1.945190e+04  -1.237431e-11  4.353e-08  2.583e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.345e+00     -1.233e-01     -1.317e+00     
     -1.233e-01     -9.756e+00     -3.548e+00     
     -1.317e+00     -3.548e+00     -4.578e+00     
     TOTAL-PRESSURE: -7.560e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.398e-01           8.012e+02           -3.380e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 131
     -------------------------------------------
     DONE(4.288e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945192e+04  0.000000e+00   1.754e-03  2.910e+00  
     GE2    -1.945192e+04  -2.252746e-03  9.694e-04  2.402e+00  
     GE3    -1.945192e+04  -1.538343e-04  1.295e-04  2.454e+00  
     GE4    -1.945192e+04  -5.090247e-06  4.347e-05  2.497e+00  
     GE5    -1.945192e+04  -3.592974e-07  1.467e-05  2.495e+00  
     GE6    -1.945192e+04  -3.570298e-08  2.387e-06  2.396e+00  
     GE7    -1.945192e+04  -4.733174e-10  8.089e-07  2.509e+00  
     GE8    -1.945192e+04  -1.175559e-10  1.396e-07  2.400e+00  
     GE9    -1.945192e+04  2.165504e-11   4.335e-08  2.388e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.317e+00     4.567e-02      -1.328e+00     
     4.567e-02      -9.634e+00     -3.767e+00     
     -1.328e+00     -3.767e+00     -4.711e+00     
     TOTAL-PRESSURE: -7.554e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.410e-01           8.054e+02           -3.352e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 132
     -------------------------------------------
     DONE(4.319e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945193e+04  0.000000e+00   1.764e-03  2.780e+00  
     GE2    -1.945194e+04  -2.264822e-03  9.730e-04  2.657e+00  
     GE3    -1.945194e+04  -1.539630e-04  1.303e-04  2.514e+00  
     GE4    -1.945194e+04  -5.158494e-06  4.332e-05  2.825e+00  
     GE5    -1.945194e+04  -3.578001e-07  1.464e-05  2.402e+00  
     GE6    -1.945194e+04  -3.457073e-08  2.397e-06  2.531e+00  
     GE7    -1.945194e+04  -4.609431e-10  8.108e-07  2.502e+00  
     GE8    -1.945194e+04  -1.392110e-10  1.397e-07  2.509e+00  
     GE9    -1.945194e+04  1.856147e-11   4.314e-08  2.393e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.285e+00     2.118e-01      -1.340e+00     
     2.118e-01      -9.535e+00     -4.019e+00     
     -1.340e+00     -4.019e+00     -4.882e+00     
     TOTAL-PRESSURE: -7.567e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.423e-01           8.096e+02           -3.344e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 133
     -------------------------------------------
     DONE(4.350e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945195e+04  0.000000e+00   1.774e-03  2.614e+00  
     GE2    -1.945195e+04  -2.265327e-03  9.763e-04  2.507e+00  
     GE3    -1.945195e+04  -1.541460e-04  1.310e-04  2.430e+00  
     GE4    -1.945195e+04  -5.217306e-06  4.320e-05  2.598e+00  
     GE5    -1.945195e+04  -3.477429e-07  1.459e-05  2.503e+00  
     GE6    -1.945195e+04  -3.377877e-08  2.407e-06  2.617e+00  
     GE7    -1.945195e+04  -2.057229e-09  8.128e-07  2.599e+00  
     GE8    -1.945195e+04  -1.237431e-10  1.398e-07  2.808e+00  
     GE9    -1.945195e+04  -3.093578e-12  4.295e-08  2.496e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.250e+00     3.680e-01      -1.349e+00     
     3.680e-01      -9.464e+00     -4.298e+00     
     -1.349e+00     -4.298e+00     -5.087e+00     
     TOTAL-PRESSURE: -7.600e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.435e-01           8.137e+02           -3.356e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 134
     -------------------------------------------
     DONE(4.383e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945196e+04  0.000000e+00   1.781e-03  2.641e+00  
     GE2    -1.945197e+04  -2.269829e-03  9.786e-04  2.504e+00  
     GE3    -1.945197e+04  -1.539232e-04  1.316e-04  2.428e+00  
     GE4    -1.945197e+04  -5.298800e-06  4.311e-05  2.495e+00  
     GE5    -1.945197e+04  -3.375031e-07  1.453e-05  2.500e+00  
     GE6    -1.945197e+04  -3.247638e-08  2.412e-06  2.501e+00  
     GE7    -1.945197e+04  -5.166275e-10  8.139e-07  2.400e+00  
     GE8    -1.945197e+04  -6.187155e-11  1.397e-07  2.587e+00  
     GE9    -1.945197e+04  -1.546789e-11  4.279e-08  2.479e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.211e+00     5.068e-01      -1.348e+00     
     5.068e-01      -9.425e+00     -4.595e+00     
     -1.348e+00     -4.595e+00     -5.322e+00     
     TOTAL-PRESSURE: -7.653e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.447e-01           8.177e+02           -3.387e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 135
     -------------------------------------------
     DONE(4.414e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945198e+04  0.000000e+00   1.784e-03  2.813e+00  
     GE2    -1.945198e+04  -2.276426e-03  9.795e-04  2.459e+00  
     GE3    -1.945198e+04  -1.533366e-04  1.318e-04  2.410e+00  
     GE4    -1.945198e+04  -5.347595e-06  4.303e-05  2.509e+00  
     GE5    -1.945198e+04  -3.401853e-07  1.444e-05  2.610e+00  
     GE6    -1.945198e+04  -3.012216e-08  2.410e-06  2.414e+00  
     GE7    -1.945198e+04  -5.166275e-10  8.141e-07  2.398e+00  
     GE8    -1.945198e+04  -9.899448e-11  1.395e-07  2.419e+00  
     GE9    -1.945198e+04  -2.784220e-11  4.268e-08  2.492e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.175e+00     6.204e-01      -1.334e+00     
     6.204e-01      -9.420e+00     -4.897e+00     
     -1.334e+00     -4.897e+00     -5.583e+00     
     TOTAL-PRESSURE: -7.726e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.459e-01           8.218e+02           -3.439e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 136
     -------------------------------------------
     DONE(4.445e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945199e+04  0.000000e+00   1.784e-03  2.699e+00  
     GE2    -1.945199e+04  -2.287144e-03  9.791e-04  2.588e+00  
     GE3    -1.945199e+04  -1.527164e-04  1.318e-04  2.397e+00  
     GE4    -1.945199e+04  -5.389476e-06  4.299e-05  2.427e+00  
     GE5    -1.945199e+04  -3.315975e-07  1.433e-05  2.385e+00  
     GE6    -1.945199e+04  -3.585147e-08  2.401e-06  2.735e+00  
     GE7    -1.945199e+04  8.074237e-10   8.133e-07  2.422e+00  
     GE8    -1.945199e+04  -1.051816e-10  1.391e-07  2.512e+00  
     GE9    -1.945199e+04  -1.856147e-11  4.264e-08  2.402e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.144e+00     7.022e-01      -1.302e+00     
     7.022e-01      -9.451e+00     -5.195e+00     
     -1.302e+00     -5.195e+00     -5.866e+00     
     TOTAL-PRESSURE: -7.820e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.472e-01           8.260e+02           -3.511e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 137
     -------------------------------------------
     DONE(4.476e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945200e+04  0.000000e+00   1.780e-03  2.625e+00  
     GE2    -1.945201e+04  -2.294613e-03  9.774e-04  2.423e+00  
     GE3    -1.945201e+04  -1.521656e-04  1.318e-04  2.483e+00  
     GE4    -1.945201e+04  -5.435230e-06  4.302e-05  2.608e+00  
     GE5    -1.945201e+04  -3.226385e-07  1.422e-05  2.582e+00  
     GE6    -1.945201e+04  -3.193191e-08  2.386e-06  2.406e+00  
     GE7    -1.945201e+04  -4.856917e-10  8.114e-07  2.591e+00  
     GE8    -1.945201e+04  -7.733944e-11  1.386e-07  2.399e+00  
     GE9    -1.945201e+04  -1.237431e-11  4.262e-08  2.478e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.124e+00     7.473e-01      -1.246e+00     
     7.473e-01      -9.522e+00     -5.475e+00     
     -1.246e+00     -5.475e+00     -6.167e+00     
     TOTAL-PRESSURE: -7.938e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.486e-01           8.306e+02           -3.605e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 138
     -------------------------------------------
     DONE(4.508e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945202e+04  0.000000e+00   1.776e-03  2.934e+00  
     GE2    -1.945203e+04  -2.294677e-03  9.752e-04  2.420e+00  
     GE3    -1.945203e+04  -1.517031e-04  1.318e-04  2.688e+00  
     GE4    -1.945203e+04  -5.459580e-06  4.311e-05  2.418e+00  
     GE5    -1.945203e+04  -3.209525e-07  1.409e-05  2.511e+00  
     GE6    -1.945203e+04  -3.136578e-08  2.363e-06  2.530e+00  
     GE7    -1.945203e+04  -5.135339e-10  8.079e-07  2.546e+00  
     GE8    -1.945203e+04  2.617167e-09   1.379e-07  2.547e+00  
     GE9    -1.945203e+04  3.093578e-12   4.265e-08  2.430e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.122e+00     7.529e-01      -1.164e+00     
     7.529e-01      -9.634e+00     -5.728e+00     
     -1.164e+00     -5.728e+00     -6.485e+00     
     TOTAL-PRESSURE: -8.080e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.501e-01           8.357e+02           -3.721e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 139
     -------------------------------------------
     DONE(4.540e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945205e+04  0.000000e+00   1.774e-03  2.737e+00  
     GE2    -1.945205e+04  -2.293588e-03  9.733e-04  2.449e+00  
     GE3    -1.945205e+04  -1.514685e-04  1.321e-04  2.510e+00  
     GE4    -1.945205e+04  -5.495113e-06  4.329e-05  2.703e+00  
     GE5    -1.945205e+04  -3.204142e-07  1.398e-05  2.505e+00  
     GE6    -1.945205e+04  -3.285070e-08  2.339e-06  2.592e+00  
     GE7    -1.945205e+04  -4.918788e-10  8.031e-07  2.408e+00  
     GE8    -1.945205e+04  -1.330238e-10  1.369e-07  2.532e+00  
     GE9    -1.945205e+04  2.784220e-11   4.264e-08  2.633e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.143e+00     7.190e-01      -1.052e+00     
     7.190e-01      -9.787e+00     -5.947e+00     
     -1.052e+00     -5.947e+00     -6.819e+00     
     TOTAL-PRESSURE: -8.250e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.148e+02          2.518e-01           8.415e+02           -3.860e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 140
     -------------------------------------------
     DONE(4.572e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945208e+04  0.000000e+00   1.777e-03  2.724e+00  
     GE2    -1.945208e+04  -2.302788e-03  9.730e-04  2.398e+00  
     GE3    -1.945208e+04  -1.517882e-04  1.328e-04  2.502e+00  
     GE4    -1.945208e+04  -5.541519e-06  4.352e-05  2.513e+00  
     GE5    -1.945208e+04  -3.259239e-07  1.390e-05  2.404e+00  
     GE6    -1.945208e+04  -3.294660e-08  2.322e-06  2.506e+00  
     GE7    -1.945208e+04  -3.341064e-10  7.981e-07  2.510e+00  
     GE8    -1.945208e+04  -7.115228e-11  1.359e-07  2.412e+00  
     GE9    -1.945208e+04  -9.280733e-12  4.266e-08  2.379e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.190e+00     6.489e-01      -9.111e-01     
     6.489e-01      -9.980e+00     -6.125e+00     
     -9.111e-01     -6.125e+00     -7.168e+00     
     TOTAL-PRESSURE: -8.446e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.149e+02          2.538e-01           8.481e+02           -4.022e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 141
     -------------------------------------------
     DONE(4.603e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945211e+04  0.000000e+00   1.783e-03  2.900e+00  
     GE2    -1.945212e+04  -2.306102e-03  9.746e-04  2.411e+00  
     GE3    -1.945212e+04  -1.525096e-04  1.337e-04  2.885e+00  
     GE4    -1.945212e+04  -5.598240e-06  4.383e-05  2.520e+00  
     GE5    -1.945212e+04  -3.341682e-07  1.387e-05  2.501e+00  
     GE6    -1.945212e+04  -3.225055e-08  2.317e-06  2.705e+00  
     GE7    -1.945212e+04  -4.764109e-10  7.948e-07  2.509e+00  
     GE8    -1.945212e+04  -1.113688e-10  1.349e-07  2.558e+00  
     GE9    -1.945212e+04  6.187155e-12   4.266e-08  2.491e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.266e+00     5.482e-01      -7.417e-01     
     5.482e-01      -1.021e+01     -6.262e+00     
     -7.417e-01     -6.262e+00     -7.535e+00     
     TOTAL-PRESSURE: -8.670e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.149e+02          2.561e-01           8.557e+02           -4.206e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 142
     -------------------------------------------
     DONE(4.635e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945216e+04  0.000000e+00   1.789e-03  2.603e+00  
     GE2    -1.945216e+04  -2.320619e-03  9.773e-04  2.420e+00  
     GE3    -1.945216e+04  -1.536648e-04  1.349e-04  2.692e+00  
     GE4    -1.945216e+04  -5.677154e-06  4.420e-05  2.693e+00  
     GE5    -1.945216e+04  -3.336578e-07  1.391e-05  2.403e+00  
     GE6    -1.945216e+04  -3.069448e-08  2.330e-06  2.526e+00  
     GE7    -1.945216e+04  -1.695281e-09  7.940e-07  2.692e+00  
     GE8    -1.945216e+04  -1.268367e-10  1.340e-07  2.504e+00  
     GE9    -1.945216e+04  1.237431e-11   4.270e-08  2.373e+00  
     ><><><><><><><><><><><><><><><><><><><><><><
     TOTAL-STRESS (KBAR):
     ><><><><><><><><><><><><><><><><><><><><><><
     -8.373e+00     4.247e-01      -5.470e-01     
     4.247e-01      -1.046e+01     -6.357e+00     
     -5.470e-01     -6.357e+00     -7.918e+00     
     TOTAL-PRESSURE: -8.919e+00 KBAR
     ------------------------------------------------------------------------------------------------
     Energy              Potential           Kinetic             Temperature         Pressure (KBAR)     
     -7.146e+02          -7.149e+02          2.586e-01           8.643e+02           -4.410e+00          
     ------------------------------------------------------------------------------------------------
     -------------------------------------------
     STEP OF MOLECULAR DYNAMICS : 143
     -------------------------------------------
     DONE(4.666e+03  SEC) : INIT SCF
     ITER   ETOT(eV)       EDIFF(eV)      DRHO       TIME(s)    
     GE1    -1.945221e+04  0.000000e+00   1.797e-03  2.848e+00  
     GE2    -1.945221e+04  -2.339829e-03  9.807e-04  2.617e+00  
     GE3    -1.945221e+04  -1.555546e-04  1.364e-04  2.396e+00  
     GE4    -1.945221e+04  -5.777550e-06  4.462e-05  2.504e+00  
     GE5    -1.945221e+04  -3.501682e-07  1.401e-05  2.599e+00  
     GE6    -1.945221e+04  -3.210515e-08  2.363e-06  2.597e+00  
     GE7    -1.945221e+04  -1.522040e-09  7.963e-07  2.900e+00  
:::

可以看到，即使**计算步数仅为** LAMMPS 经典分子动力学计算的 $500/200000 = 1/400$，

ABACUS 量子分子动力学计算所需要的时间也是 LAMMPS 经典分子动力学计算的$9 h 30 mins 58 secs \div 3 min 35 secs = 159.33$ 倍！

成本比高达约 63732 倍！

**第一性原理计算十分昂贵！**

#### 2.3.3 结果与分析

上面已经介绍，主要的计算信息被储存在文件 *OUT.ABACUS/running_scf.log* 中。除此之外，MD 模拟的轨迹被存储在文件 *OUT.ABACUS/MD_dump* 中。

*MD_dump* 文件内容如下：
```
MDSTEP:  0
LATTICE_CONSTANT: 1.889726124626
LATTICE_VECTORS
  11.858000000000  0.000000000000  0.000000000000
  0.000000000000  11.858000000000  0.000000000000
  0.000000000000  0.000000000000  11.858000000000
VIRIAL (KBAR)
  14.314395848598  0.068950391132  -1.646206932245
  0.068950391132  6.742623812696  -3.705349135941
  -1.646206932245  -3.705349135941  5.270646592369
INDEX    LABEL    POSITIONS    FORCE (eV/Angstrom)
  0  Li  3.016819999993  1.775969999997  4.378729999996  -0.812213164484  -0.585472450641  0.311819994732
  1  Li  3.476600000010  5.232430000004  2.059570000010  0.352252495274  -0.175519926585  0.080617217948
  2  Li  0.908510000006  3.907440000006  4.561330000000  -0.649106916034  0.039426589767  0.878683371838
  ...
  61  Cl  10.362100000004  9.238389999995  8.344720000004  -2.421125883128  0.103626611523  -1.137264969726
  62  Cl  9.088940000007  5.618780000000  9.584660000001  -0.546302523476  -2.531252034211  0.628161793135
  63  Cl  8.152059999999  7.237340000007  6.577169999999  -0.867749328458  -2.567100713260  0.810628619279
```


该文件记录了分子动力学模拟的信息。包括：
- MD的步数（MDSTEP）
- 晶格常数（LATTICE_CONSTANT）和晶格矢量（LATTICE_VECTORS）。
- 应力张量（VIRIAL），单位 KBAR。
- 每个原子的索引、标签、坐标位置（POSITIONS）和受到的力（FORCE），力的单位 eV/Angstrom。

这里提供了一个 Python 脚本，可以提取原子坐标，计算 RDF 并将 RDF 数据保存到名为 *gr_Li-Cl*、*gr_Li-Li* 和 *gr_Cl-Cl* 文件。



```python
import numpy as np
import matplotlib.pyplot as plt

def get_atom_positions(file_path, nLi, nCl):
    Li, Cl = [], []
    with open(file_path, 'r') as file:
        for line in file:
            if 'Li' in line:
                Li.append([float(line.split()[2]), float(line.split()[3]), float(line.split()[4])])
            if 'Cl' in line:
                Cl.append([float(line.split()[2]), float(line.split()[3]), float(line.split()[4])])
    return np.array(Li).reshape(-1, nLi, 3), np.array(Cl).reshape(-1, nCl, 3)

def get_gr(x, y, L): 
    batchsize, n, dim = x.shape[0], x.shape[1], x.shape[2]
    
    i,j = np.triu_indices(n, k=1)
    rij = (np.reshape(x, (-1, n, 1, dim)) - np.reshape(y, (-1, 1, n, dim)))[:,i,j]
    rij = rij - L*np.rint(rij/L)
    dist = np.linalg.norm(rij, axis=-1) # (batchsize, n*(n-1)/2)
   
    hist, bin_edges = np.histogram(dist.reshape(-1,), range=[0, L/2], bins=200)
    dr = bin_edges[1] - bin_edges[0]
    hist = hist*2/(n * batchsize)

    rmesh = np.arange(hist.shape[0])*dr
    
    h_id = 4/3*np.pi*n/(L**3)* ((rmesh+dr)**3 - rmesh**3 )
    return rmesh, hist/h_id

L = 11.858
nLi, nCl = 32, 32
Li, Cl = get_atom_positions('./LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/MD_dump', nLi, nCl)

atom_pairs = {'Li-Cl': (Li, Cl),'Li-Li': (Li, Li),'Cl-Cl': (Cl, Cl)}

plt.figure(figsize=(10, 8))
colors = ['purple', 'orange', 'green']
for (label, (x, y)), color in zip(atom_pairs.items(), colors):
    rmesh, gr = get_gr(x, y, L)
    plt.plot(rmesh, gr, label=label, color=color)
    np.savetxt(f'./LiCl_DP_Tutorial_Example/chapter2/abacus_md/OUT.ABACUS/gr_{label}', np.column_stack((rmesh, gr)))
    
plt.legend()
plt.title('abacus_md_rdf')
plt.savefig('./LiCl_DP_Tutorial_Example/chapter2/abacus_md/abacus_md_rdf.png', dpi=300)
plt.show()
```


    
![png](output_68_0.png)
    


从 ABACUS MD计算的 RDF 如图。我们可以观察 ABACUS 和 LAMMPS MD 获得的 900K 下的 LiCl 熔体的 RDF 是否存在差异。注意，由于模拟体系较小和模拟时间较短，ABACUS MD 计算的 RDF 曲线并不光滑，更大的模拟体系或者更长的模拟时间将有助于改善这一情况。

**在这个练习中，我们学习了如何为 LiCl 熔体编写 ABACUS MD 计算输入文件，执行计算，和 MD 轨迹处理。**

## 章节 3：DeePMD-kit 深度势能 (DP) 模型训练

对于 LiCl 熔体，我们可以使用 DeePMD-kit 软件包，为其训练一个深度势能模型。DeePMD-kit 是一个基于深度学习的分子动力学模拟工具，可以根据第一性原理数据训练高精度的 DP 模型。在这个示例中，我们可以利用 ABACUS 第一性原理数据和 DeePMD-kit 训练一个 LiCl 熔体的 深度势能 (DP) 模型。

DeePMD-kit 的详细原理是：通过建立深度学习模型来学习高成本第一性原理计算获得的数据，得到的深度势能模型，并将该模型应用于后续的分子动力学模型中，用于控制分子间势，这即是「深度势能分子动力学」名称的由来。

DeePMD-kit 深度势能分子动力学方法大大节省了量子分子动力学所需的计算成本，将分子动力学模拟的规模从以往的几千原子提升至上亿原子的级别，同时也保留了显著优于经典分子动力学的模拟精度。相关成果曾获2020年度⾼性能计算领域最⾼奖 ACM 戈登贝尔奖。

### 本章节目标

学习完本章节后，你将能够：

- 掌握 DeePMD-kit 输入文件编写
- 能够进行数据准备、训练/冻结/压缩/测试和分子动力学任务



### 下载教程资源

在本章节中，我们以 LiCl 熔体分子为例,训练深度势能模型。我们已经在 *./LiCl_DP_Tutorial_Example/chapter3* 中准备了需要的文件。


```python
! if ! [ -e LiCl_DP_Tutorial_Example ]; then wget https://bohrium-example.oss-cn-zhangjiakou.aliyuncs.com/notebook/LiCl_DP_Tutorial/LiCl_DP_Tutorial_Example.zip && unzip LiCl_DP_Tutorial_Example.zip; fi;
```

在 *./LiCl_DP_Tutorial_Example/chapter3* 文件夹下有 00.data，01.train 和 02.lmp 共 3 个子文件夹。

- *00.data* 文件夹用于存放训练和测试数据，
- *01.train* 包含使用 DeePMD-kit 训练模型的示例脚本，
- *02.lmp* 包含用于分子动力学模拟的 LAMMPS 示例脚本。

本教程采用 DeePMD-kit(2.2.1)程序完成。


### 3.1 准备训练数据

在 2.3 中已经执行了ABACUS MD 计算。你可以使用如下 Python 脚本，其中调用 [dpdata](https://github.com/deepmodeling/dpdata) 的工具，将 ABACUS MD 生成的数据（数据格式abacus/md）转换为 DeePMD-kit 训练所需的数据格式（NumPy数组）。


```python
import dpdata 
import numpy as np

# 加载 abacus/md 格式数据
data = dpdata.LabeledSystem('./LiCl_DP_Tutorial_Example/chapter2/abacus_md', fmt = 'abacus/md')        

# 随机选择100个索引，用于生成验证集;其他的索引，用于生成测试集
index_validation = np.random.choice(len(data),size=100,replace=False)    
index_training = list(set(range(len(data)))-set(index_validation)) 

# 创建子数据集：训练集,测试集      
data_training = data.sub_system(index_training)                          
data_validation = data.sub_system(index_validation)

# 导出训练集,测试集（deepmd/npy格式）                     
data_training.to_deepmd_npy('./LiCl_DP_Tutorial_Example/chapter3/00.data/training_data')                                                       
data_validation.to_deepmd_npy('./LiCl_DP_Tutorial_Example/chapter3/00.data/validation_data')                         

print('# 数据包含 %d frames' % len(data))     
print('# 训练数据包含 %d frames' % len(data_training)) 
print('# 验证数据包含 %d frames' % len(data_validation))
```

    # 数据包含 501 frames
    # 训练数据包含 401 frames
    # 验证数据包含 100 frames


我们可以看到 *abacus_md* 文件包含 501 帧数据。 我们随机选取 100 帧作为验证数据，其余的401帧作为训练数据。在开始训练之前，我们可以先检查 *training_data* 或 *validation_data* 文件夹。


```python
! cd ./LiCl_DP_Tutorial_Example/chapter3/00.data/ && ls training_data
```

    box.raw    energy.raw  set.000	 type_map.raw
    coord.raw  force.raw   type.raw  virial.raw


这些文件的作用如下：

1. `set.000`：是一个目录，包含压缩格式的数据（NumPy压缩数组）。所有训练数据应首先转换为此格式，然后在 DeePMD-kit 中使用。该数据格式在 DeePMD-kit 手册中有详细解释，可以在 [DeePMD-kit Data Introduction](https://github.com/deepmodeling/deepmd-kit/blob/edb4e6951f3300b8669e73fb34832f90c02c25f3/doc/data/index.md) 中找到。
2. `type.raw`：是一个文件，包含原子的类型（以整数表示）。
3. `type_map.raw`：是一个文件，包含原子的类型名称。

让我们来看一下这些文件：


```python
! cd ./LiCl_DP_Tutorial_Example/chapter3/00.data/ && cat training_data/type.raw 
```

    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1
    1


这告诉我们这个例子中有 108 个原子，其中 54 个原子由类型"0"表示，54 个原子由类型"1"表示。有时需要将整数类型映射到原子名称。映射可以通过文件`type_map.raw`给出。

由于系统中的所有帧都具有相同的原子类型和原子序号，因此我们只需为整个系统指定一次类型信息。


```python
! cd ./LiCl_DP_Tutorial_Example/chapter3/00.data/ && cat training_data/type_map.raw
```

    Li
    Cl


其中原子 Li 被赋予类型 0，原子 Cl 被赋予类型 1。

### 3.2 准备输入脚本

训练数据准备完成后，接下来就可以进行训练。让我们进入训练目录看一下运行所需的脚本：


```python
! cd ./LiCl_DP_Tutorial_Example/chapter3/01.train/ && cat input.json
```

    {
        "_comment": " model parameters",
        "model": {
    	"type_map":	["Li", "Cl"],
    	"descriptor" :{
    	    "type":		"se_e2_a",
    	    "sel":		[128, 128],
    	    "rcut_smth":	0.50,
    	    "rcut":		7.00,
    	    "neuron":		[20, 40, 80],
    	    "resnet_dt":	false,
    	    "axis_neuron":	4,
    	    "seed":		1,
    	    "_comment":		" that's all"
    	},
    	"fitting_net" : {
    	    "neuron":		[200, 200, 200],
    	    "resnet_dt":	true,
    	    "seed":		1,
    	    "_comment":		" that's all"
    	},
    	"_comment":	" that's all"
        },
    
        "learning_rate" :{
    	"type":		"exp",
    	"decay_steps":	5000,
    	"start_lr":	0.001,	
    	"stop_lr":	3.51e-8,
    	"_comment":	"that's all"
        },
    
        "loss" :{
    	"type":		"ener",
    	"start_pref_e":	0.02,
    	"limit_pref_e":	1,
    	"start_pref_f":	1000,
    	"limit_pref_f":	1,
    	"start_pref_v":	0,
    	"limit_pref_v":	0,
    	"_comment":	" that's all"
        },
    
        "training" : {
    	"training_data": {
    	    "systems":     ["../00.data/training_data"],
    	    "batch_size":  "auto",
    	    "_comment":	   "that's all"
    	},
    	"validation_data":{
    	    "systems":	   ["../00.data/validation_data"],
    	    "batch_size":  "auto",
    	    "numb_btch":   1,
    	    "_comment":	   "that's all"
    	},
    	"numb_steps":	400000,
    	"seed":		10,
    	"disp_file":	"lcurve.out",
    	"disp_freq":	1000,
    	"save_freq":	10000,
    	"_comment":	"that's all"
        },    
    
        "_comment":		"that's all"
    }
    



input.json 包含了 DP 模型训练过程中所需的各种参数，定义和控制训练任务。这些参数在 DeePMD-kit 手册中有详细的解释，所以这里只做简单介绍。

在 model 模块, 指定嵌入和拟合网络的参数。
```
    "model":{
    "type_map":    ["Li", "Cl"],                         # 元素名称
    "descriptor":{
        "type":            "se_e2_a",                    # 描述符类型
        "rcut":            7.00,                         # 截止半径
        "rcut_smth":       0.50,                         # 光滑截止半径
        "sel":             [128, 128],                   # 原子的选定邻居数
        "neuron":          [20, 40, 80],                 # 嵌入网络尺寸
        "resnet_dt":       false,
        "axis_neuron":     12,                           # 嵌入子网络横向尺寸
        "seed":            1,
        "_comment":        "that's all"
    },
    "fitting_net":{
        "neuron":          [200, 200, 200],              # 拟合网络尺寸
        "resnet_dt":       true,
        "seed":            1,
        "_comment":        "that's all"
    },
    "_comment":    "that's all"'
},
```
描述符 `se_e2_a` 用于 DP 模型的训练。将嵌入和拟合神经网络的大小分别设置为 [20, 40, 80] 和 [200, 200, 200]。 $\tilde{\mathcal{R}}^{i}$里的成分会从 0.5 到 7 Å 平滑地趋于 0。

下面的参数指定学习效率和损失函数：
```
    "learning_rate" :{
        "type":                "exp",
        "decay_steps":         5000,                      # 学习率下降间隔
        "start_lr":            0.001,                     # 起始学习率   
        "stop_lr":             3.51e-8,                   # 结束学习率 
        "_comment":            "that's all"
    },
    "loss" :{
        "type":                "ener",
        "start_pref_e":        0.02,                      # 能量起始权重
        "limit_pref_e":        1,                         # 能量最终权重
        "start_pref_f":        1000,                      # 力起始权重
        "limit_pref_f":        1,                         # 力最终权重
        "start_pref_v":        0,                         # 维里
        "limit_pref_v":        0,
        "_comment":            "that's all"
    },
```

在损失函数中，${pref\_e}$ 从 0.02 逐渐增加到 1 ${eV}^{-2}$，而 ${pref\_f}$ 从 1000 逐渐减小到 1 ${Å}^2 {eV}^{-2}$，这意味着力项在开始时占主导地位，而能量项和维里项在结束时变得重要。这种策略非常有效，并且减少了总训练时间。${pref\_v}$ 设为 0 ${eV}^{-2}$，这表明训练过程中不包含任何维里数据。将起始学习率、停止学习率和衰减步长分别设置为 0.001，3.51e-8，和 5000。模型训练步数为 $10^6$。


训练参数如下：
```
    "training" : {
        "training_data": {
            "systems":            ["../00.data/training_data"],         # 训练数据路径
            "batch_size":         "auto",                               # 自动确定，natoms*batch_size≥32
            "_comment":           "that's all"
        },
        "validation_data":{
            "systems":            ["../00.data/validation_data/"],
            "batch_size":         "auto",				
            "numb_btch":          1,                                    # 测试帧数
            "_comment":           "that's all"
        },
        "numb_steps":             400000,                               # 训练步数
        "seed":                   10,
        "disp_file":              "lcurve.out",                         # 写入学习曲线到文件
        "disp_freq":              1000,                                 # 写入学习曲线的频率
        "save_freq":              10000,                                # 保存模型相关文件频率
    },
```


### 3.3 模型训练

准备好训练脚本后，我们可以用 DeePMD-kit 开始训练，只需运行:


```python
# ############## Time Warning: 7 hours ##################
! cd ./LiCl_DP_Tutorial_Example/chapter3/01.train/ && dp train input.json
```


在 train.log 可以看到数据系统的信息
```
DEEPMD INFO      ----------------------------------------------------------------------------------------------------
DEEPMD INFO      ---Summary of DataSystem: training     -------------------------------------------------------------
DEEPMD INFO      found 1 system(s):
DEEPMD INFO                              system        natoms        bch_sz        n_bch          prob        pbc
DEEPMD INFO           ../00.data/training_data/            64             1          401         1.000          T
DEEPMD INFO      -----------------------------------------------------------------------------------------------------
DEEPMD INFO      ---Summary of DataSystem: validation   --------------------------------------------------------------
DEEPMD INFO      found 1 system(s):
DEEPMD INFO                               system       natoms        bch_sz        n_bch          prob        pbc
DEEPMD INFO          ../00.data/validation_data/           64             1          100         1.000          T
```


以及本次训练的开始和最终学习率
```
DEEPMD INFO      start training at lr 1.00e-03 (== 1.00e-03), decay_step 5000, decay_rate 0.950006, final lr will be 3.51e-08
```


如果一切正常，将在屏幕上看到每 1000 步打印一次的信息，例如
```
DEEPMD INFO    batch    1000 training time 69.23 s, testing time 0.06 s
DEEPMD INFO    batch    2000 training time 68.00 s, testing time 0.06 s
DEEPMD INFO    batch    3000 training time 67.80 s, testing time 0.06 s
DEEPMD INFO    batch    4000 training time 69.92 s, testing time 0.07 s
DEEPMD INFO    batch    5000 training time 67.98 s, testing time 0.06 s
```
 在第 10000 步结束时，模型保存在 TensorFlow 的检查点文件 model.ckpt 中。 同时，训练和测试错误显示在文件 lcurve.out 中。



```python
! head -n 3 ./LiCl_DP_Tutorial_Example/chapter3/01.train/lcurve.out && tail -n 2 ./LiCl_DP_Tutorial_Example/chapter3/01.train/lcurve.out

'''
#  step      rmse_val    rmse_trn    rmse_e_val  rmse_e_trn    rmse_f_val  rmse_f_trn         lr
      0      1.41e+01    1.27e+01      3.50e-01    3.35e-01      4.45e-01    4.02e-01    1.0e-03
...
 399000      1.57e-02    1.55e-02      8.17e-05    4.88e-04      1.53e-02    1.47e-02    4.0e-08
 400000      1.55e-02    1.54e-02      2.68e-04    4.64e-04      1.51e-02    1.47e-02    3.5e-08
'''

```

    #  step      rmse_val    rmse_trn    rmse_e_val  rmse_e_trn    rmse_f_val  rmse_f_trn         lr
          0      1.59e+01    1.52e+01      3.66e-01    3.41e-01      5.01e-01    4.80e-01    1.0e-03
       1000      1.60e+00    1.51e+00      5.06e-02    4.82e-02      5.07e-02    4.78e-02    1.0e-03
     399000      1.44e-02    1.61e-02      1.82e-04    4.83e-05      1.41e-02    1.58e-02    4.0e-08
     400000      1.61e-02    1.44e-02      5.06e-04    5.25e-04      1.53e-02    1.36e-02    3.5e-08





    '\n#  step      rmse_val    rmse_trn    rmse_e_val  rmse_e_trn    rmse_f_val  rmse_f_trn         lr\n      0      1.41e+01    1.27e+01      3.50e-01    3.35e-01      4.45e-01    4.02e-01    1.0e-03\n...\n 399000      1.57e-02    1.55e-02      8.17e-05    4.88e-04      1.53e-02    1.47e-02    4.0e-08\n 400000      1.55e-02    1.54e-02      2.68e-04    4.64e-04      1.51e-02    1.47e-02    3.5e-08\n'



第 4、5 和 6、7 列分别介绍了能量和力的训练和测试误差。 经过 4000,00 步训练，能量测试误差小于 1 meV，力测试误差小于 20 meV/Å。可以通过简单的 Python 脚本对该文件进行可视化：



```python
import numpy as np
import matplotlib.pyplot as plt

data = np.genfromtxt("./LiCl_DP_Tutorial_Example/chapter3/01.train/lcurve.out", names=True)
for name in data.dtype.names[1:-1]:
    plt.plot(data['step'], data[name], label=name)
plt.legend()
plt.xlabel('Step')
plt.ylabel('Loss')
plt.yscale('log')
plt.show()

```


    
![png](output_95_0.png)
    


当训练过程异常停止时，我们可以从提供的检查点重新开始训练，只需运行


```python
! cd ./LiCl_DP_Tutorial_Example/chapter3/01.train/ && dp train --restart model.ckpt input.json
```

需要注意的是 *input.json* 需要和上一个保持一致。



### 3.4 冻结和压缩模型

在训练结束时，保存在 TensorFlow 的 checkpoint 文件中的模型参数通常需要冻结为一个以扩展名 .pb 结尾的模型文件。 只需执行：



```python
# 该步骤需要您运行完毕上述训练步骤，产生运行中间文件后方可运行。
! cd ./LiCl_DP_Tutorial_Example/chapter3/01.train/ && dp freeze -o licl.pb
```

    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/compat/v2_compat.py:107: disable_resource_variables (from tensorflow.python.ops.variable_scope) is deprecated and will be removed in a future version.
    Instructions for updating:
    non-resource variables are not supported in the long term
    WARNING:root:To get the best performance, it is recommended to adjust the number of threads by setting the environment variables OMP_NUM_THREADS, TF_INTRA_OP_PARALLELISM_THREADS, and TF_INTER_OP_PARALLELISM_THREADS. See https://deepmd.rtfd.io/parallelism/ for more information.
    WARNING:root:Environment variable KMP_BLOCKTIME is empty. Use the default value 0
    WARNING:root:Environment variable KMP_AFFINITY is empty. Use the default value granularity=fine,verbose,compact,1,0
    /opt/deepmd-kit-2.2.1/lib/python3.10/importlib/__init__.py:169: UserWarning: The NumPy module was reloaded (imported a second time). This can in some cases result in small but subtle issues and is discouraged.
      _bootstrap._exec(spec, module)
    2023-04-26 13:04:57.131671: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcuda.so.1'; dlerror: /usr/lib/x86_64-linux-gnu/libcuda.so.1: file too short; LD_LIBRARY_PATH: /opt/intel/oneapi/tbb/2021.5.1/env/../lib/intel64/gcc4.8:/opt/intel/oneapi/mpi/2021.5.1//libfabric/lib:/opt/intel/oneapi/mpi/2021.5.1//lib/release:/opt/intel/oneapi/mpi/2021.5.1//lib:/opt/intel/oneapi/mkl/2022.0.2/lib/intel64:/opt/intel/oneapi/debugger/2021.5.0/gdb/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/libipt/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/dep/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/x64:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/oclfpga/host/linux64/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/compiler/lib/intel64_lin:/opt/intel/oneapi/tbb/2021.5.1/env/../lib/intel64/gcc4.8:/opt/intel/oneapi/mpi/2021.5.1//libfabric/lib:/opt/intel/oneapi/mpi/2021.5.1//lib/release:/opt/intel/oneapi/mpi/2021.5.1//lib:/opt/intel/oneapi/mkl/2022.0.2/lib/intel64:/opt/intel/oneapi/debugger/2021.5.0/gdb/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/libipt/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/dep/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/x64:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/oclfpga/host/linux64/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/compiler/lib/intel64_lin
    2023-04-26 13:04:57.131707: W tensorflow/stream_executor/cuda/cuda_driver.cc:269] failed call to cuInit: UNKNOWN ERROR (303)
    DEEPMD INFO    The following nodes will be frozen: ['model_type', 'descrpt_attr/rcut', 'descrpt_attr/ntypes', 'model_attr/tmap', 'model_attr/model_type', 'model_attr/model_version', 'train_attr/min_nbor_dist', 'train_attr/training_script', 'o_energy', 'o_force', 'o_virial', 'o_atom_energy', 'o_atom_virial', 'fitting_attr/dfparam', 'fitting_attr/daparam']
    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/deepmd/entrypoints/freeze.py:354: convert_variables_to_constants (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
    Instructions for updating:
    Use `tf.compat.v1.graph_util.convert_variables_to_constants`
    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/deepmd/entrypoints/freeze.py:354: convert_variables_to_constants (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
    Instructions for updating:
    Use `tf.compat.v1.graph_util.convert_variables_to_constants`
    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/framework/convert_to_constants.py:925: extract_sub_graph (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
    Instructions for updating:
    Use `tf.compat.v1.graph_util.extract_sub_graph`
    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/framework/convert_to_constants.py:925: extract_sub_graph (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
    Instructions for updating:
    Use `tf.compat.v1.graph_util.extract_sub_graph`
    DEEPMD INFO    1211 ops in the final graph.


它将在当前目录中输出一个名为 graph.pb 的模型文件。 压缩 DP 模型通常会将基于 DP 的计算速度提高一个数量级，并且消耗更少的内存。 licl.pb 可以通过以下方式压缩：



```python
! cd ./LiCl_DP_Tutorial_Example/chapter3/01.train/ && dp compress -i licl.pb -o licl-compress.pb
```

    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/compat/v2_compat.py:107: disable_resource_variables (from tensorflow.python.ops.variable_scope) is deprecated and will be removed in a future version.
    Instructions for updating:
    non-resource variables are not supported in the long term
    WARNING:root:To get the best performance, it is recommended to adjust the number of threads by setting the environment variables OMP_NUM_THREADS, TF_INTRA_OP_PARALLELISM_THREADS, and TF_INTER_OP_PARALLELISM_THREADS. See https://deepmd.rtfd.io/parallelism/ for more information.
    WARNING:root:Environment variable KMP_BLOCKTIME is empty. Use the default value 0
    WARNING:root:Environment variable KMP_AFFINITY is empty. Use the default value granularity=fine,verbose,compact,1,0
    /opt/deepmd-kit-2.2.1/lib/python3.10/importlib/__init__.py:169: UserWarning: The NumPy module was reloaded (imported a second time). This can in some cases result in small but subtle issues and is discouraged.
      _bootstrap._exec(spec, module)
    2023-04-26 13:06:05.348719: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcuda.so.1'; dlerror: /usr/lib/x86_64-linux-gnu/libcuda.so.1: file too short; LD_LIBRARY_PATH: /opt/intel/oneapi/tbb/2021.5.1/env/../lib/intel64/gcc4.8:/opt/intel/oneapi/mpi/2021.5.1//libfabric/lib:/opt/intel/oneapi/mpi/2021.5.1//lib/release:/opt/intel/oneapi/mpi/2021.5.1//lib:/opt/intel/oneapi/mkl/2022.0.2/lib/intel64:/opt/intel/oneapi/debugger/2021.5.0/gdb/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/libipt/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/dep/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/x64:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/oclfpga/host/linux64/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/compiler/lib/intel64_lin:/opt/intel/oneapi/tbb/2021.5.1/env/../lib/intel64/gcc4.8:/opt/intel/oneapi/mpi/2021.5.1//libfabric/lib:/opt/intel/oneapi/mpi/2021.5.1//lib/release:/opt/intel/oneapi/mpi/2021.5.1//lib:/opt/intel/oneapi/mkl/2022.0.2/lib/intel64:/opt/intel/oneapi/debugger/2021.5.0/gdb/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/libipt/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/dep/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/x64:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/oclfpga/host/linux64/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/compiler/lib/intel64_lin
    2023-04-26 13:06:05.348757: W tensorflow/stream_executor/cuda/cuda_driver.cc:269] failed call to cuInit: UNKNOWN ERROR (303)
    DEEPMD INFO    
    
    
    DEEPMD INFO    stage 1: compress the model
    DEEPMD INFO     _____               _____   __  __  _____           _     _  _   
    DEEPMD INFO    |  __ \             |  __ \ |  \/  ||  __ \         | |   (_)| |  
    DEEPMD INFO    | |  | |  ___   ___ | |__) || \  / || |  | | ______ | | __ _ | |_ 
    DEEPMD INFO    | |  | | / _ \ / _ \|  ___/ | |\/| || |  | ||______|| |/ /| || __|
    DEEPMD INFO    | |__| ||  __/|  __/| |     | |  | || |__| |        |   < | || |_ 
    DEEPMD INFO    |_____/  \___| \___||_|     |_|  |_||_____/         |_|\_\|_| \__|
    DEEPMD INFO    Please read and cite:
    DEEPMD INFO    Wang, Zhang, Han and E, Comput.Phys.Comm. 228, 178-184 (2018)
    DEEPMD INFO    installed to:         /home/conda/feedstock_root/build_artifacts/deepmd-kit_1678943793317/work/_skbuild/linux-x86_64-3.10/cmake-install
    DEEPMD INFO    source :              v2.2.1
    DEEPMD INFO    source brach:         HEAD
    DEEPMD INFO    source commit:        3ac8c4c7
    DEEPMD INFO    source commit at:     2023-03-16 12:33:24 +0800
    DEEPMD INFO    build float prec:     double
    DEEPMD INFO    build variant:        cuda
    DEEPMD INFO    build with tf inc:    /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/include;/opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/../../../../include
    DEEPMD INFO    build with tf lib:    
    DEEPMD INFO    ---Summary of the training---------------------------------------
    DEEPMD INFO    running on:           bohrium-14076-1014964
    DEEPMD INFO    computing device:     cpu:0
    DEEPMD INFO    CUDA_VISIBLE_DEVICES: unset
    DEEPMD INFO    Count of visible GPU: 0
    DEEPMD INFO    num_intra_threads:    0
    DEEPMD INFO    num_inter_threads:    0
    DEEPMD INFO    -----------------------------------------------------------------
    DEEPMD INFO    training without frame parameter
    DEEPMD INFO    training data with lower boundary: [-0.24472768 -0.24716247]
    DEEPMD INFO    training data with upper boundary: [10.1033889  10.30164264]
    OMP: Info #155: KMP_AFFINITY: Initial OS proc set respected: 0-31
    OMP: Info #216: KMP_AFFINITY: decoding x2APIC ids.
    OMP: Info #157: KMP_AFFINITY: 32 available OS procs
    OMP: Info #158: KMP_AFFINITY: Uniform topology
    OMP: Info #287: KMP_AFFINITY: topology layer "LL cache" is equivalent to "core".
    OMP: Info #287: KMP_AFFINITY: topology layer "L2 cache" is equivalent to "core".
    OMP: Info #287: KMP_AFFINITY: topology layer "L1 cache" is equivalent to "core".
    OMP: Info #192: KMP_AFFINITY: 1 socket x 16 cores/socket x 2 threads/core (16 total cores)
    OMP: Info #218: KMP_AFFINITY: OS proc to physical thread map:
    OMP: Info #172: KMP_AFFINITY: OS proc 0 maps to socket 0 core 0 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 1 maps to socket 0 core 0 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 2 maps to socket 0 core 1 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 3 maps to socket 0 core 1 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 4 maps to socket 0 core 2 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 5 maps to socket 0 core 2 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 6 maps to socket 0 core 3 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 7 maps to socket 0 core 3 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 8 maps to socket 0 core 4 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 9 maps to socket 0 core 4 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 10 maps to socket 0 core 5 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 11 maps to socket 0 core 5 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 12 maps to socket 0 core 6 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 13 maps to socket 0 core 6 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 14 maps to socket 0 core 7 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 15 maps to socket 0 core 7 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 16 maps to socket 0 core 8 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 17 maps to socket 0 core 8 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 18 maps to socket 0 core 9 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 19 maps to socket 0 core 9 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 20 maps to socket 0 core 10 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 21 maps to socket 0 core 10 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 22 maps to socket 0 core 11 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 23 maps to socket 0 core 11 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 24 maps to socket 0 core 12 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 25 maps to socket 0 core 12 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 26 maps to socket 0 core 13 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 27 maps to socket 0 core 13 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 28 maps to socket 0 core 14 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 29 maps to socket 0 core 14 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 30 maps to socket 0 core 15 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 31 maps to socket 0 core 15 thread 1 
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9021 thread 0 bound to OS proc set 0
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9158 thread 1 bound to OS proc set 2
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9159 thread 2 bound to OS proc set 4
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9160 thread 3 bound to OS proc set 6
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9161 thread 4 bound to OS proc set 8
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9162 thread 5 bound to OS proc set 10
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9163 thread 6 bound to OS proc set 12
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9164 thread 7 bound to OS proc set 14
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9165 thread 8 bound to OS proc set 16
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9166 thread 9 bound to OS proc set 18
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9167 thread 10 bound to OS proc set 20
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9168 thread 11 bound to OS proc set 22
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9169 thread 12 bound to OS proc set 24
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9170 thread 13 bound to OS proc set 26
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9171 thread 14 bound to OS proc set 28
    OMP: Info #254: KMP_AFFINITY: pid 9021 tid 9172 thread 15 bound to OS proc set 30
    DEEPMD INFO    built lr
    DEEPMD INFO    built network
    DEEPMD INFO    built training
    WARNING:root:To get the best performance, it is recommended to adjust the number of threads by setting the environment variables OMP_NUM_THREADS, TF_INTRA_OP_PARALLELISM_THREADS, and TF_INTER_OP_PARALLELISM_THREADS. See https://deepmd.rtfd.io/parallelism/ for more information.
    DEEPMD INFO    initialize model from scratch
    DEEPMD INFO    finished compressing
    DEEPMD INFO    
    
    
    DEEPMD INFO    stage 2: freeze the model
    DEEPMD INFO    The following nodes will be frozen: ['model_type', 'descrpt_attr/rcut', 'descrpt_attr/ntypes', 'model_attr/tmap', 'model_attr/model_type', 'model_attr/model_version', 'train_attr/min_nbor_dist', 'train_attr/training_script', 'o_energy', 'o_force', 'o_virial', 'o_atom_energy', 'o_atom_virial', 'fitting_attr/dfparam', 'fitting_attr/daparam']
    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/deepmd/entrypoints/freeze.py:354: convert_variables_to_constants (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
    Instructions for updating:
    Use `tf.compat.v1.graph_util.convert_variables_to_constants`
    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/deepmd/entrypoints/freeze.py:354: convert_variables_to_constants (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
    Instructions for updating:
    Use `tf.compat.v1.graph_util.convert_variables_to_constants`
    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/framework/convert_to_constants.py:925: extract_sub_graph (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
    Instructions for updating:
    Use `tf.compat.v1.graph_util.extract_sub_graph`
    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/framework/convert_to_constants.py:925: extract_sub_graph (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
    Instructions for updating:
    Use `tf.compat.v1.graph_util.extract_sub_graph`
    DEEPMD INFO    847 ops in the final graph.


将输出一个名为 licl-compress.pb 的模型文件。



### 3.5 模型测试
我们可以通过运行如下命令检查训练模型的质量



```python
! cd ./LiCl_DP_Tutorial_Example/chapter3/01.train/ && dp test -m licl-compress.pb -s ../00.data/validation_data -n 100 -d results
```

    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/tensorflow/python/compat/v2_compat.py:107: disable_resource_variables (from tensorflow.python.ops.variable_scope) is deprecated and will be removed in a future version.
    Instructions for updating:
    non-resource variables are not supported in the long term
    WARNING:root:To get the best performance, it is recommended to adjust the number of threads by setting the environment variables OMP_NUM_THREADS, TF_INTRA_OP_PARALLELISM_THREADS, and TF_INTER_OP_PARALLELISM_THREADS. See https://deepmd.rtfd.io/parallelism/ for more information.
    WARNING:root:Environment variable KMP_BLOCKTIME is empty. Use the default value 0
    WARNING:root:Environment variable KMP_AFFINITY is empty. Use the default value granularity=fine,verbose,compact,1,0
    /opt/deepmd-kit-2.2.1/lib/python3.10/importlib/__init__.py:169: UserWarning: The NumPy module was reloaded (imported a second time). This can in some cases result in small but subtle issues and is discouraged.
      _bootstrap._exec(spec, module)
    2023-04-26 13:06:37.982105: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcuda.so.1'; dlerror: /usr/lib/x86_64-linux-gnu/libcuda.so.1: file too short; LD_LIBRARY_PATH: /opt/intel/oneapi/tbb/2021.5.1/env/../lib/intel64/gcc4.8:/opt/intel/oneapi/mpi/2021.5.1//libfabric/lib:/opt/intel/oneapi/mpi/2021.5.1//lib/release:/opt/intel/oneapi/mpi/2021.5.1//lib:/opt/intel/oneapi/mkl/2022.0.2/lib/intel64:/opt/intel/oneapi/debugger/2021.5.0/gdb/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/libipt/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/dep/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/x64:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/oclfpga/host/linux64/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/compiler/lib/intel64_lin:/opt/intel/oneapi/tbb/2021.5.1/env/../lib/intel64/gcc4.8:/opt/intel/oneapi/mpi/2021.5.1//libfabric/lib:/opt/intel/oneapi/mpi/2021.5.1//lib/release:/opt/intel/oneapi/mpi/2021.5.1//lib:/opt/intel/oneapi/mkl/2022.0.2/lib/intel64:/opt/intel/oneapi/debugger/2021.5.0/gdb/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/libipt/intel64/lib:/opt/intel/oneapi/debugger/2021.5.0/dep/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/x64:/opt/intel/oneapi/compiler/2022.0.2/linux/lib/oclfpga/host/linux64/lib:/opt/intel/oneapi/compiler/2022.0.2/linux/compiler/lib/intel64_lin
    2023-04-26 13:06:37.982140: W tensorflow/stream_executor/cuda/cuda_driver.cc:269] failed call to cuInit: UNKNOWN ERROR (303)
    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/deepmd/utils/batch_size.py:61: is_gpu_available (from tensorflow.python.framework.test_util) is deprecated and will be removed in a future version.
    Instructions for updating:
    Use `tf.config.list_physical_devices('GPU')` instead.
    WARNING:tensorflow:From /opt/deepmd-kit-2.2.1/lib/python3.10/site-packages/deepmd/utils/batch_size.py:61: is_gpu_available (from tensorflow.python.framework.test_util) is deprecated and will be removed in a future version.
    Instructions for updating:
    Use `tf.config.list_physical_devices('GPU')` instead.
    DEEPMD WARNING You can use the environment variable DP_INFER_BATCH_SIZE tocontrol the inference batch size (nframes * natoms). The default value is 1024.
    DEEPMD INFO    # ---------------output of dp test--------------- 
    DEEPMD INFO    # testing system : ../00.data/validation_data
    OMP: Info #155: KMP_AFFINITY: Initial OS proc set respected: 0-31
    OMP: Info #216: KMP_AFFINITY: decoding x2APIC ids.
    OMP: Info #157: KMP_AFFINITY: 32 available OS procs
    OMP: Info #158: KMP_AFFINITY: Uniform topology
    OMP: Info #287: KMP_AFFINITY: topology layer "LL cache" is equivalent to "core".
    OMP: Info #287: KMP_AFFINITY: topology layer "L2 cache" is equivalent to "core".
    OMP: Info #287: KMP_AFFINITY: topology layer "L1 cache" is equivalent to "core".
    OMP: Info #192: KMP_AFFINITY: 1 socket x 16 cores/socket x 2 threads/core (16 total cores)
    OMP: Info #218: KMP_AFFINITY: OS proc to physical thread map:
    OMP: Info #172: KMP_AFFINITY: OS proc 0 maps to socket 0 core 0 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 1 maps to socket 0 core 0 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 2 maps to socket 0 core 1 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 3 maps to socket 0 core 1 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 4 maps to socket 0 core 2 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 5 maps to socket 0 core 2 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 6 maps to socket 0 core 3 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 7 maps to socket 0 core 3 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 8 maps to socket 0 core 4 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 9 maps to socket 0 core 4 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 10 maps to socket 0 core 5 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 11 maps to socket 0 core 5 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 12 maps to socket 0 core 6 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 13 maps to socket 0 core 6 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 14 maps to socket 0 core 7 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 15 maps to socket 0 core 7 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 16 maps to socket 0 core 8 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 17 maps to socket 0 core 8 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 18 maps to socket 0 core 9 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 19 maps to socket 0 core 9 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 20 maps to socket 0 core 10 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 21 maps to socket 0 core 10 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 22 maps to socket 0 core 11 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 23 maps to socket 0 core 11 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 24 maps to socket 0 core 12 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 25 maps to socket 0 core 12 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 26 maps to socket 0 core 13 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 27 maps to socket 0 core 13 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 28 maps to socket 0 core 14 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 29 maps to socket 0 core 14 thread 1 
    OMP: Info #172: KMP_AFFINITY: OS proc 30 maps to socket 0 core 15 thread 0 
    OMP: Info #172: KMP_AFFINITY: OS proc 31 maps to socket 0 core 15 thread 1 
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9250 thread 1 bound to OS proc set 2
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9255 thread 2 bound to OS proc set 4
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9257 thread 4 bound to OS proc set 8
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9256 thread 3 bound to OS proc set 6
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9258 thread 5 bound to OS proc set 10
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9259 thread 6 bound to OS proc set 12
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9260 thread 7 bound to OS proc set 14
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9261 thread 8 bound to OS proc set 16
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9262 thread 9 bound to OS proc set 18
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9263 thread 10 bound to OS proc set 20
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9264 thread 11 bound to OS proc set 22
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9265 thread 12 bound to OS proc set 24
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9266 thread 13 bound to OS proc set 26
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9267 thread 14 bound to OS proc set 28
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9268 thread 15 bound to OS proc set 30
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9269 thread 16 bound to OS proc set 1
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9270 thread 17 bound to OS proc set 3
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9271 thread 18 bound to OS proc set 5
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9272 thread 19 bound to OS proc set 7
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9273 thread 20 bound to OS proc set 9
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9274 thread 21 bound to OS proc set 11
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9275 thread 22 bound to OS proc set 13
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9276 thread 23 bound to OS proc set 15
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9277 thread 24 bound to OS proc set 17
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9278 thread 25 bound to OS proc set 19
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9279 thread 26 bound to OS proc set 21
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9280 thread 27 bound to OS proc set 23
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9281 thread 28 bound to OS proc set 25
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9282 thread 29 bound to OS proc set 27
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9283 thread 30 bound to OS proc set 29
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9284 thread 31 bound to OS proc set 31
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9285 thread 32 bound to OS proc set 0
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9249 thread 33 bound to OS proc set 2
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9286 thread 34 bound to OS proc set 4
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9287 thread 35 bound to OS proc set 6
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9289 thread 37 bound to OS proc set 10
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9288 thread 36 bound to OS proc set 8
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9290 thread 38 bound to OS proc set 12
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9291 thread 39 bound to OS proc set 14
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9292 thread 40 bound to OS proc set 16
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9293 thread 41 bound to OS proc set 18
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9294 thread 42 bound to OS proc set 20
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9295 thread 43 bound to OS proc set 22
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9296 thread 44 bound to OS proc set 24
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9297 thread 45 bound to OS proc set 26
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9298 thread 46 bound to OS proc set 28
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9299 thread 47 bound to OS proc set 30
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9300 thread 48 bound to OS proc set 1
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9301 thread 49 bound to OS proc set 3
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9302 thread 50 bound to OS proc set 5
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9303 thread 51 bound to OS proc set 7
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9304 thread 52 bound to OS proc set 9
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9305 thread 53 bound to OS proc set 11
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9306 thread 54 bound to OS proc set 13
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9307 thread 55 bound to OS proc set 15
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9308 thread 56 bound to OS proc set 17
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9309 thread 57 bound to OS proc set 19
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9310 thread 58 bound to OS proc set 21
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9311 thread 59 bound to OS proc set 23
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9312 thread 60 bound to OS proc set 25
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9313 thread 61 bound to OS proc set 27
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9314 thread 62 bound to OS proc set 29
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9315 thread 63 bound to OS proc set 31
    OMP: Info #254: KMP_AFFINITY: pid 9184 tid 9316 thread 64 bound to OS proc set 0
    DEEPMD INFO    # number of test data : 100 
    DEEPMD INFO    Energy MAE         : 1.515137e-02 eV
    DEEPMD INFO    Energy RMSE        : 1.903659e-02 eV
    DEEPMD INFO    Energy MAE/Natoms  : 2.367401e-04 eV
    DEEPMD INFO    Energy RMSE/Natoms : 2.974467e-04 eV
    DEEPMD INFO    Force  MAE         : 1.190493e-02 eV/A
    DEEPMD INFO    Force  RMSE        : 1.486900e-02 eV/A
    DEEPMD INFO    Virial MAE         : 1.852568e+00 eV
    DEEPMD INFO    Virial RMSE        : 3.063258e+00 eV
    DEEPMD INFO    Virial MAE/Natoms  : 2.894638e-02 eV
    DEEPMD INFO    Virial RMSE/Natoms : 4.786341e-02 eV
    DEEPMD INFO    # ----------------------------------------------- 


在屏幕上，可以看到验证数据的预测误差信息。

它将在当前目录中输出名为 results.e.out 和 results.f.out 的文件。类似地，可以通过简单的 Python 脚本对该文件进行可视化：



```python
import numpy as np
import matplotlib.pyplot as plt

# 定义绘制散点图和对角线的函数
def plot(ax, data, key, xlabel, ylabel, min_val, max_val):
    data_key = f'data_{key}'
    pred_key = f'pred_{key}'
    ax.scatter(data[data_key], data[pred_key], label=key, s=6)
    ax.legend()
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.set_xlim(min_val, max_val)
    ax.set_ylim(min_val, max_val)
    ax.plot([min_val, max_val], [min_val, max_val], 'r', lw=1)

# 读取数据，并对e数据进行原子化处理
natom = 64
data_e = np.genfromtxt("./LiCl_DP_Tutorial_Example/chapter3/01.train/results.e.out", names=["data_e", "pred_e"])
data_f = np.genfromtxt("./LiCl_DP_Tutorial_Example/chapter3/01.train/results.f.out", names=["data_fx", "data_fy", "data_fz", "pred_fx", "pred_fy", "pred_fz"])

for col in ['data_e', 'pred_e']:
    data_e[col] /= natom

# 计算e和f的最小值和最大值
data_e_stacked = np.column_stack((data_e['data_e'], data_e['pred_e']))
data_f_stacked = np.column_stack((data_f['data_fx'], data_f['data_fy'], data_f['data_fz'], data_f['pred_fx'], data_f['pred_fy'], data_f['pred_fz']))

min_val_e, max_val_e = np.min(data_e_stacked), np.max(data_e_stacked)
min_val_f, max_val_f = np.min(data_f_stacked), np.max(data_f_stacked)

# 绘制散点图并保存结果
fig, axs = plt.subplots(1, 2, figsize=(12, 5))
plot(axs[0], data_e, 'e', 'DFT energy (eV/atom)', 'DP energy (eV/atom)', min_val_e, max_val_e)
for force_direction in ['fx', 'fy', 'fz']:
    plot(axs[1], data_f, force_direction, 'DFT force (eV/Å)', 'DP force (eV/Å)', min_val_f, max_val_f)
plt.show()
```


    
![png](output_107_0.png)
    


### 3.6 使用 LAMMPS 运行深度势能分子动力学


首先，我们将 *01.train* 目录中的 DP 模型复制到 *02.lmp* 目录


```python
! cd ./LiCl_DP_Tutorial_Example/chapter3/02.lmp/ && cp ../01.train/licl-compress.pb ./
```

让我们查看一下 *02.lmp* 目录下的文件：


```python
! cd ./LiCl_DP_Tutorial_Example/chapter3/02.lmp/ && ls
```

    64_dpmd_rdf.png  licl-compress.pb  licl.dump  licl.rdf
    ave_rdf.txt	 licl.data	   licl.in    log.lammps



其中 licl.data 给出了 LiCl 熔体 MD 模拟的初始配置，文件 licl.in 是 lammps 输入脚本。 可以检查 licl.in 并发现它是一个用于 MD 模拟的相当标准的 LAMMPS 输入文件，与章节 1 中的 licl.in 文件相比，在原子类型和势函数参数设置上略有不同：

```
atom_style  atomic
```
和

```
pair_style  licl-compress.pb
pair_coeff  * *
```

其中调用 pair style deepmd 并提供模型文件 licl-compress.pb，这意味着原子间相互作用将由名为 licl-compress.pb 的 DP 模型计算。可以以标准方式执行：



```python
# ###### Time Warning: 19 minutes 16 seconds #####################
! cd ./LiCl_DP_Tutorial_Example/chapter3/02.lmp/ && lmp -i licl.in
```

稍等片刻，MD 模拟结束，生成 log.lammps 和 licl.dump 文件。 它们分别存储热力学信息和分子的轨迹，我们可以使用 chapter1 中提供的 Python 脚本计算 RDF。


```python
import numpy as np
import matplotlib.pyplot as plt

nbins = 100 # define the number of bins in the RDF

with open("./LiCl_DP_Tutorial_Example/chapter3/02.lmp/licl.rdf", "r") as f: # read the licl.rdf file
    lines = f.readlines()
    lines = lines[3:]

    data = np.zeros((nbins, 7))  
    count = 0  

    for line in lines:  
        nums = line.split()      
        if len(nums) == 8:  
            for i in range(1, 8):  
                data[int(nums[0])-1, i-1] += float(nums[i])  # accumulatie data for each bin  
        if len(nums) == 2:  
            count += 1         # count the number of accumulations for each bin
       
ave_rdf = data / count  # calculate the averaged RDF data
np.savetxt('./LiCl_DP_Tutorial_Example/chapter3/02.lmp/ave_rdf.txt', ave_rdf)

labels = ['Li-Li', 'Li-Cl', 'Cl-Cl']
colors = ['orange', 'purple', 'green']

for i, label, color in zip(range(1, 7, 2), labels, colors):
    plt.plot(ave_rdf[:, 0], ave_rdf[:, i], label=label, color=color)
plt.xlabel('r/Å')
plt.ylabel('g(r)')
plt.legend()
plt.savefig('./LiCl_DP_Tutorial_Example/chapter3/02.lmp/64_dpmd_rdf.png', dpi=300)
plt.show()
```


    
![png](output_116_0.png)
    


让我们来对比一下由经典分子动力学、量子分子动力学、深度势能分子动力学计算得到的 rdf 曲线：


```python
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

# 读取图片
cmd_rdf = mpimg.imread('./LiCl_DP_Tutorial_Example/chapter1/rdf.png')
qmd_rdf = mpimg.imread('./LiCl_DP_Tutorial_Example/chapter2/abacus_md/abacus_md_rdf.png')
dpmd_rdf = mpimg.imread('./LiCl_DP_Tutorial_Example/chapter3/02.lmp/64_dpmd_rdf.png')

# 设置画布大小
fig, axd = plt.subplot_mosaic([['upleft', 'right'],
                               ['lowleft', 'right']], figsize=(10,8), dpi=300)

# 添加子图1
axd['upleft'].set_title('LAMMPS CMD')
axd['upleft'].imshow(cmd_rdf)
axd['upleft'].axis('off')

# 添加子图2
axd['right'].set_title('ABACUS QMD')
axd['right'].imshow(qmd_rdf)
axd['right'].axis('off')

# 添加子图3
axd['lowleft'].set_title('DeePMD-kit DPMD')
axd['lowleft'].imshow(dpmd_rdf)
axd['lowleft'].axis('off')

# 显示图片
plt.savefig('./LiCl_DP_Tutorial_Example/chapter3/02.lmp/all_rdf.png')
plt.show()
```


    
![png](output_118_0.png)
    


可以发现，相对于 LAMMPS 经典分子动力学计算得到的结果，由 DeePMD-kit 深度势能分子动力学计算得到的结果更接近 ABACUS 量子分子动力学得到的结果，具有更高的准确度。

而在模拟步数为量子分子动力学的 1000000/500 = 200 倍的情况下，时间仅为 19 mins / 9 h 30 mins = 0.03。在保证较高精度的前提下，大大降低了计算成本。



接下来，我们将使用 DP-GEN 工作流进一步优化我们的深度势能分子动力学模拟。在更大空间和时间尺度上研究 LiCl 熔体的结构、动力学和热力学性质。

## 章节 4：DP-GEN 构建训练数据并生成深度势模型

为了构建高质量的LiCl熔体深度势能模型的训练数据集，我们可以使用 DP-GEN(Deep Potential GENerator) 软件。DP-GEN 是一个自动化的训练数据集生成工具，可以根据预设的参数和条件搜索材料的结构和相态空间。

本教程采用DeePMD-kit(2.2.1),ABACUS(3.2.0)和DP-GEN(0.11.0)程序完成。

### 本章节目标：

在学习本章节后，你将能够：

- 掌握 DP-GEN 输入文件（param.json 和 machine.json） 中主要关键词的设置；
- 利用 DP-GEN 为 LiCl 熔体构建训练数据并生成深度势模型；
- 分析和解读 DP-GEN 迭代过程中的结果和输出文件，以便更好地理解模型训练的过程和效果。


### 4.1 下载教程资源

在本教程中，我们以 LiCl 熔体分子为例，构建训练数据并生成深度势模型。我们已经在 *LiCl_DP_Tutorial_Example/chapter4* 中准备了需要的文件。


```python
! if ! pip show dpgen > /dev/null; then pip install dpgen; fi;
```

    /usr/bin/sh: 1: pip: not found
    /usr/bin/sh: 1: pip: not found



```python
! if ! [ -e LiCl_DP_Tutorial_Example ]; then wget https://bohrium-example.oss-cn-zhangjiakou.aliyuncs.com/notebook/LiCl_DP_Tutorial/LiCl_DP_Tutorial_Example.zip && unzip LiCl_DP_Tutorial_Example.zip; fi;
```

让我们来查看一下 LiCl_DP_Tutorial_Example/chapter4 中所含的文件。


```python
! tree LiCl_DP_Tutorial_Example/chapter4 -L 2
```

- `*.upf` 和 `*.orb` 是 ABACUS 的输入文件
- `param.json` 是运行当前任务的 DP-GEN 设置。
- `machine.json` 是一个任务调度程序，其中设置了计算机环境和资源要求。

### 4.2 DP-GEN 输入文件

DP-GEN 运行过程包含一系列连续迭代，按顺序进行，例如将系统加热到特定温度。每次迭代由三个步骤组成：
* 探索 (Exploration)
* 标记 (Labeling)
* 训练 (Training)。

首先，介绍 DP-GEN 运行过程所需的输入文件。


#### param.json

`param.json` 中的关键字可以分为 4 个部分：

- 系统和数据 (System and Data)：用于指定原子类型、初始数据等。
- 训练 (Training)：主要用于指定训练步骤中的任务;
- 探索 (Exploration)：主要用于在探索步骤中指定任务;
- 标记 (Labeling)：主要用于指定标记步骤中的任务。

这里我们以 LiCl 熔体为例，介绍 `param.json` 中的主要关键词。


```python
! cat LiCl_DP_Tutorial_Example/chapter4/param_abacus.json
```

    {
         "type_map": ["Li","Cl"],
         "mass_map": [6.941,35.453],
         "init_data_prefix": "../ex3",
         "init_data_sys": ["00.data/training_data"],
         "sys_format": "abacus/stru",
         "sys_configs_prefix": "../ex2",
         "sys_configs": [["01.md/STRU"]],
         "_comment": " that's all ",
    
         "numb_models": 4,
         "default_training_param": {
             "model": {
                 "type_map": ["Li","Cl"],
                 "descriptor": {
                     "type": "se_e2_a",
                     "sel": [128,128],                
                     "rcut_smth": 0.5,
                     "rcut": 7.0,
                     "neuron": [20,40,80],
                     "resnet_dt": false,
                     "axis_neuron": 12,
                     "seed": 1
                 },
                 "fitting_net": {
                     "neuron": [200,200,200],
                     "resnet_dt": true,
                     "seed": 1
                 }
             },
             "learning_rate": {
                 "type": "exp",
                 "start_lr": 0.001,
                 "decay_steps": 5000
             },
             "loss": {
                 "start_pref_e": 0.02,
                 "limit_pref_e": 1,
                 "start_pref_f": 1000,
                 "limit_pref_f": 1,
                 "start_pref_v": 0,
                 "limit_pref_v": 0
             },
             "training": {
                 "numb_steps": 400000,
                 "disp_file": "lcurve.out",
                 "disp_freq": 1000,
                 "numb_test": 1,
                 "save_freq": 10000,
                 "save_ckpt": "model.ckpt",
                 "disp_training": true,
                 "time_training": true,
                 "profiling": false,
                 "profiling_file": "timeline.json",
                 "_comment": "that's all"
             }
         },
    
         "model_devi_dt": 0.001,
         "model_devi_skip": 0,
         "model_devi_f_trust_lo": 0.08,
         "model_devi_f_trust_hi": 0.18,
         "model_devi_merge_traj": true,
         "model_devi_clean_traj": false,
         "model_devi_jobs":  [
            {"sys_idx": [0],"temps": [900,1000,1100,1200],"press": [0,10,100,1000,10000], "trj_freq": 10, "nsteps": 100000,"ensemble": "npt", "_idx": "00"},
            {"sys_idx": [0],"temps": [900,1000,1100,1200],"press": [0,10,100,1000,10000], "trj_freq": 10, "nsteps": 100000,"ensemble": "npt", "_idx": "01"},
            {"sys_idx": [0],"temps": [900,1000,1100,1200],"press": [0,10,100,1000,10000], "trj_freq": 10, "nsteps": 100000,"ensemble": "npt", "_idx": "02"}   
         ],
    
        "fp_style": "abacus",
        "shuffle_poscar": false,
        "fp_task_max": 200,
        "fp_task_min": 50,
        "fp_pp_path": "./abacus",
        "fp_pp_files": ["Li_ONCV_PBE-1.2.upf","Cl_ONCV_PBE-1.2.upf"],   
        "fp_orb_files": ["Li_gga_8au_100Ry_4s1p.orb","Cl_gga_8au_100Ry_2s2p1d.orb"],  
        "k_points":[1, 1, 1, 0, 0, 0],  
        "user_fp_params":{  
        "ntype": 2, 
        "symmetry": 0,
        "vdw_method":"d3_bj",
        "ecutwfc": 100,      
        "scf_thr":1e-7,
        "scf_nmax":120, 
        "basis_type":"lcao", 
        "smearing_method": "gauss",
        "smearing_sigma": 0.002,
        "mixing_type": "pulay",
        "mixing_beta": 0.4,
        "cal_force":1,
        "cal_stress":1
        }
    }


##### 系统和数据 (System and Data)

系统和数据相关内容：

```
{
     "type_map": ["Li","Cl"],
     "mass_map": [6.941,35.453],
     "init_data_prefix": "../chapter3",
     "init_data_sys": ["00.data/training_data"],
     "sys_format": "abacus/stru",
     "sys_configs_prefix": "../ex2",
     "sys_configs": [["01.md/STRU"]],
     "_comment": " that's all ",

```

关键词描述：

| 键词                  | 字段类型      | 描述                                                     |
|-----------------------|--------------|----------------------------------------------------------|
| "type_map"            | list         | 元素列表，这里是Li和Cl                                    |
| "mass_map"            | list         | 原子质量列表                                              |
| "init_data_prefix"    | str          | initial data 的前置路径                                   |
| "init_data_sys"       | list         | 初始训练数据文件的路径列表。可以使用绝对路径或相对路径        |
| "sys_format"	        | str          | 指定构型的格式                                            |
| "sys_configs_prefix"  | str          | sys_configs 的前置路径                                    |
| "sys_configs"         | list         | 构型文件的路径列表，此处支持通配符                          |

案例说明：

“type_map”和“mass_map”给出了元素类型和原子质量。在这里，系统包含锂（Li）和氯（Cl）两种，质量分别为6.941和35.453。

“init_data_prefix”和“init_data_sys”关键词共同指定了初始训练数据的位置。

“sys_configs_prefix”和“sys_configs”共同指定了探索的构型的位置。

“sys_format”指定了构型的格式。

在这里，训练数据位于 ./LiCl_DP_Tutorial_Example/chapter3/00.data/training_data目录下。

构型文件位于../ex2/01.md/STRU目录下，采用ABACUS软件的abacus/stru格式

--- 


##### 训练(Training)

与训练相关的内容如下：

```
     "numb_models": 4,
     "default_training_param": {
         "model": {
             "type_map": ["Li","Cl"],
             "descriptor": {
                 "type": "se_e2_a",
                 "sel": [128,128],                
                 "rcut_smth": 0.5,
                 "rcut": 7.0,
                 "neuron": [20,40,80],
                 "resnet_dt": false,
                 "axis_neuron": 12,
                 "seed": 1
             },
             "fitting_net": {
                 "neuron": [200,200,200],
                 "resnet_dt": true,
                 "seed": 1
             }
         },
         "learning_rate": {
             "type": "exp",
             "start_lr": 0.001,
             "decay_steps": 5000
         },
         "loss": {
             "start_pref_e": 0.02,
             "limit_pref_e": 1,
             "start_pref_f": 1000,
             "limit_pref_f": 1,
             "start_pref_v": 0,
             "limit_pref_v": 0
         },
         "training": {
             "numb_steps": 400000,
             "disp_file": "lcurve.out",
             "disp_freq": 1000,
             "numb_test": 1,
             "save_freq": 10000,
             "save_ckpt": "model.ckpt",
             "disp_training": true,
             "time_training": true,
             "profiling": false,
             "profiling_file": "timeline.json",
             "_comment": "that's all"
         }
     },
```

关键词描述：

| 键词                      | 字段类型  | 描述                          |
|---------------------------|----------|-------------------------------|
| "numb_models"             | int      | 在 00.train 中训练的模型数量。  |
| "default_training_param"  | dict     | DeePMD-kit 的训练参数          |

案例说明：

训练相关键指定训练任务的详细信息。`numb_models`指定要训练的模型数量。`default_training_param`指定了 DeePMD-kit 的训练参数。在这里，将训练 4 个 DP 模型。

DP-GEN 的训练部分由 DeePMD-kit 执行，因此此处的关键字与 DeePMD-kit 的关键字相同，此处不再赘述。有关这些关键字的详细说明，请访问[DeePMD-kit 文档](https://deepmd.readthedocs.io/)。

---

##### 探索 (Exploration) 

与探索相关的内容如下：

```
     "model_devi_dt": 0.001,
     "model_devi_skip": 0,
     "model_devi_f_trust_lo": 0.08,
     "model_devi_f_trust_hi": 0.18,
     "model_devi_merge_traj": true,
     "model_devi_clean_traj": false,
     "model_devi_jobs":  [
        {"sys_idx": [0],"temps": [900,1000,1100,1200],"press": [0,10,100,1000,10000], "trj_freq": 10, "nsteps": 100000,"ensemble": "npt", "_idx": "00"},
        {"sys_idx": [0],"temps": [900,1000,1100,1200],"press": [0,10,100,1000,10000], "trj_freq": 10, "nsteps": 100000,"ensemble": "npt", "_idx": "01"},
        {"sys_idx": [0],"temps": [900,1000,1100,1200],"press": [0,10,100,1000,10000], "trj_freq": 10, "nsteps": 100000,"ensemble": "npt", "_idx": "02"}   
     ],
```

关键词描述：

| 键词                      | 字段类型                    | 描述   |
|--------------------------|-------------------------|---------------|
| "model_devi_dt"          | float  | MD 的时间步长                                                                                                                                                                                                                                |
| "model_devi_skip"        | int    | 每个 MD 中为 fp 跳过的结构数                                                                                                                                                                                                |
| "model_devi_f_trust_lo"  | float  | 选择的力下限。如果为 List，则应分别为每个索引设置sys_configs。                                                                                                                                 |
| "model_devi_f_trust_hi"  | int    | 选择的力上限。如果为 List，则应分别为每个索引设置sys_configs。                                                                                                                                  |                                                                                         |
| "model_devi_clean_traj"  | bool or int    | 如果model_devi_clean_traj的类型是布尔类型，则表示是否清理MD中的traj文件。如果是 Int 类型，则将保留 traj 文件夹的最新 n 次迭代，其他迭代将被删除。  |
| "model_devi_clean_traj"  | bool           | 控制在模型偏差（model_devi）阶段是否合并生成的轨迹文件|
| "model_devi_jobs"        | list            | 01.model_devi 中的探索设置。列表中的每个字典对应于一次迭代。model_devi_jobs 的索引与迭代的索引完全一致                                               |
| &nbsp;&nbsp;&nbsp;&nbsp;"sys_idx"   | List of integer         | 选择系统作为MD的初始结构并进行探索。序列与“sys_configs”完全对应。 |
| &nbsp;&nbsp;&nbsp;&nbsp;"temps" | list  | 分子动力学模拟的温度 (K)
| &nbsp;&nbsp;&nbsp;&nbsp;"press" | list  | 分子动力学模拟的压力 (Bar) 
| &nbsp;&nbsp;&nbsp;&nbsp;"trj_freq"   | int          | MD中轨迹的保存频率。                  |
| &nbsp;&nbsp;&nbsp;&nbsp;"nsteps"     | int          | 分子动力学运行步数                                 |
| &nbsp;&nbsp;&nbsp;&nbsp;"ensembles"  | str          | 决定在 MD 中选择的集成算法，选项包括 “npt” ， “nvt”等. |

案例说明

在在“model_devi_jobs”中设置了三次迭代。

对于每次迭代，在不同的温度（900, 1000, 1100和1200 K）和压力条件（0, 0.1, 1, 10和100 GPa）下，使用 NPT 系综和“sys_configs_prefix”和“sys_configs”指定的构型进行 100000 步模拟，时间步长为0.001 ps。

我们选择保存 MD 轨迹文件，并将保存频率“trj_freq”设置为 10。如果轨迹中构型的“max_devi_f”介于 0.08 和 0.18 之间，DP-GEN 会将该结构视为候选结构。

如果要保存 traj 文件夹的最近 n 次迭代，可以将“model_devi_clean_traj”设置为整数。

---

##### 标记 (Labeling)

与标记相关的内容如下：

```
    "fp_style": "abacus",
    "shuffle_poscar": false,
    "fp_task_max": 200,
    "fp_task_min": 50,
    "fp_pp_path": "./abacus",
    "fp_pp_files": ["Li_ONCV_PBE-1.2.upf","Cl_ONCV_PBE-1.2.upf"],
    "fp_orb_files": ["Li_gga_8au_100Ry_4s1p.orb","Cl_gga_8au_100Ry_2s2p1d.orb"],
    "k_points":[1, 1, 1, 0, 0, 0],
    "user_fp_params":{
    "ntype": 2, 
    "symmetry": 0,
    "vdw_method":"d3_bj",
    "ecutwfc": 100,
    "scf_thr":1e-7,
    "scf_nmax":120, 
    "basis_type":"lcao", 
    "smearing_method": "gauss",
    "smearing_sigma": 0.002,
    "mixing_type": "pulay",
    "mixing_beta": 0.4,
    "cal_force":1,
    "cal_stress":1
```

关键词描述：

| 键词               | 字段类型            | 描述                                                                                                              |
|-------------------|-----------------|---------------------------------------------------------------------|
| "fp_style"        | String          | 第一性原理软件软件。到目前为止，选项包括ABACUS, VASP等。                |
| "shuffle_poscar"  | Boolean         |                                                                     |
| "fp_task_max"     | Integer         | 每次迭代 在 02.fp 中要计算的最大结构。                                 |
| "fp_task_min"     | Integer         | 每次迭代 在 02.fp 中要计算的最小结构。                                 |
| "fp_pp_path"      | String          | 用于 02.fp 的赝势文件路径。                                           |
| "fp_pp_files"     | List of string  | 用于 02.fp 的赝势文件。请注意，元素的顺序应与 type_map 中的顺序相对应。  |
| "fp_orb_files"    | List of string  | 用于 02.fp 的轨道文件。请注意，元素的顺序应与 type_map 中的顺序相对应。  |
| "k_points"        | List of Integer | 用于生成 ABACUS KPT 文件。                                                    |
| "user_fp_params"  | dict            | 用于生成 ABACUS INPUT 文件。如果"user_fp_params"中指定了 kspacing，可以不设置"k_points"。   |

案例说明：

标记相关键词指定标记任务的详细信息。 

在这里，最少 50 个和最多 200 个结构将使用 ABACUS 代码进行标记，在每次迭代中，INPUT 文件依据“user_fp_params”生成，KPT文件依据 “k_points”生成。

请注意，"fp_pp_files" 和 "fp_orb_files" 中元素的顺序应与 `type_map` 中的顺序相对应。

#### machine.json

DP-GEN 运行过程中的每次迭代都由三个步骤组成：探索、标注和训练。因此，machine.json 由三个步骤组成：**train**、**model_devi** 和 **fp**。每个步骤都是字典列表。每个字典都可以被视为一个独立的计算环境。

在本节中，我们将向您展示如何在 Bohrium 上执行`train`, `model_devi`和`fp` 步骤。 对于每个步骤，需要三种类型的关键词：

- 命令 (Command)：提供用于执行每个步骤的命令。
- 机器 (Machine)：指定机器环境（本地工作站、本地或远程集群或云服务器）。
- 资源 (Resources)：指定组、节点、CPU 和 GPU 的数量;启用虚拟环境。

在此示例中，我们在Bohrium上执行`train`步骤。

```json
{
  "api_version": "1.0",
  "deepmd_version": "2.1.5",
  "train" :[
    {
      "command": "dp",
      "machine": {
        "batch_type": "Lebesgue",
        "context_type": "LebesgueContext",
        "local_root" : "./",
        "remote_profile":{
          "email": "xxx", 
          "password": "xxx", 
          "program_id": xxx,
            "keep_backup":true,
            "input_data":{
                "job_type": "container",
                "log_file": "00*/train.log",
                "grouped":true,
                "job_name": "dpgen_train_job",
                "disk_size": 100,
                "scass_type":"c12_m92_1 * NVIDIA V100",
                "checkpoint_files":["00*/checkpoint","00*/model.ckpt*"],
                "checkpoint_time":5,
                "platform": "ali",
                "image_name":"registry.dp.tech/dptech/deepmd-kit:2.1.5-cuda11.6",
                "on_demand":0
            }
        }
      },
      "resources": {
        "local_root":"./",
        "group_size": 1
      }
    }],
  "model_devi":
    [{
      "command": "export LAMMPS_PLUGIN_PATH=/opt/deepmd-kit-2.1.5/lib/deepmd_lmp && lmp -i input.lammps -v restart 0",
      "machine": {
        "batch_type": "Lebesgue",
        "context_type": "LebesgueContext",
        "local_root" : "./",
        "remote_profile":{
          "email": "xxx", 
          "password": "xxx", 
          "program_id": xxx,
            "keep_backup":true,
            "input_data":{
              "job_type": "container",
              "log_file": "task*/model_devi.out",
              "grouped":true,
              "job_name": "dpgen_model_devi_job",
              "disk_size": 200,
              "scass_type":"c12_m92_1 * NVIDIA V100",
              "platform": "ali",
              "image_name":"registry.dp.tech/dptech/deepmd-kit:2.1.5-cuda11.6",
              "checkpoint_files": "sync_files",
              "checkpoint_time":5,
              "on_demand":0
            }
        }
      },
      "resources": {
        "local_root":"./",
        "group_size": 1
      }
    }],
  "fp":
    [{
      "command": "OMP_NUM_THREADS=1 mpirun -np 4 abacus",
      "machine": {
        "batch_type": "Lebesgue",
        "context_type": "LebesgueContext",
        "local_root" : "./",
        "remote_profile":{
          "email": "xxx", 
          "password": "xxx", 
          "program_id": xxx,
            "keep_backup":true,
            "input_data":{
              "log_file": "task*/output",
              "grouped":true,
              "job_name": "dpgen_fp_job",
              "checkpoint_files": "sync_files",
              "checkpoint_time":5,
              "scass_type":"c8_m64_cpu",
              "platform": "ali",
              "image_name":"registry.dp.tech/dptech/abacus:3.1.0",
              "job_type": "container",
              "on_demand":0
            }
        }
      },
      "resources": {
        "group_size": 2,
        "local_root":"./",
        "source_list": []
      }
    }
  ]
}
```

案例说明：

在 command 参数中，`train`，`model_devi`和`fp`步骤使用的程序分别为 DeePMD-kit，LAMMPS 和 ABACUS，其相应的调用命令分别为
```bash
dp
```
```bash
export LAMMPS_PLUGIN_PATH=/opt/deepmd-kit-2.1.5/lib/deepmd_lmp && lmp -i input.lammps -v restart 0 
```
```bash
OMP_NUM_THREADS=1 mpirun -np 4 abacus
```

在 machine 参数中，"scass_type"指定训练使用的机型。

> 对于`train`和`model_devi`步骤，建议使用GPU机型，这里使用的机型为“c12_m92_1 * NVIDIA V100”。
> 
> 对于`fp`步骤，建议使用CPU机型，这里使用的机型为“c8_m64_cpu”。

在 resources 参数中，“group_size”指定了一个 group 中任务的数量。

> 对于`train`和`model_devi`步骤，由于任务数量较少（分别为4和20），我们可以将“group_size”设置为 1, 使所有任务同时执行。
> 对于`fp`步骤，由于任务数量较多（200），我们可以将“group_size”设置为 2, 使100个任务同时执行。

注意：用户需要填入自己的 Bohrium 账户邮箱，密码和项目ID（共三处）。其他参数通常不需修改。

### 4.3 运行DP-GEN

准备好了 `param.json` 和 `machine.json`，我们就可以通过以下方式轻松运行 DP-GEN：


```python
import json
import getpass
from monty.serialization import loadfn, dumpfn

file_path = './LiCl_DP_Tutorial_Example/chapter4/machine.json'
j = loadfn(file_path)

email = input('请输入你的 Bohrium 账户： ')
password = getpass.getpass('请输入你的 Bohrium 密码： ')
program_id = int(input('请输入你的 Bohrium 项目 ID【请输入整数】：'))

dpgen_steps = ['train', 'model_devi', 'fp']

for i in dpgen_steps:
    j[i][0]['machine']['remote_profile']['email'] = email
    j[i][0]['machine']['remote_profile']['password'] = password
    j[i][0]['machine']['remote_profile']['program_id'] = program_id
    
with open(file_path, 'w') as f: 
    json.dump(j, f, indent=4)
```

    请输入你的 Bohrium 账户：  quehaohui@dp.tech
    请输入你的 Bohrium 密码：  ········
    请输入你的 Bohrium 项目 ID【请输入整数】： 12788


<p style='color:red; font-weight:bold; font-size:2rem'>修改配置文件后，配置文件中携带你的个人账户信息，请注意保密！</p>
通常情况下，该文件不会被分享，你可以运行本文档附录的代码以初始化该配置文件。


```python
# ################# Time Warning: 9 hours ##################
! cd LiCl_DP_Tutorial_Example/chapter4/ && dpgen run param_abacus.json machine.json
```

    /usr/bin/sh: 1: cd: can't cd to LiCl_DP_Tutorial_Example/chapter4/


成功运行 DP-GEN 之后，在 LiCl_DP_Tutorial_Example/chapter4 下，可以发现生成了一个文件夹和两个文件：

- iter.000000 文件夹：包含 DP-GEN 迭代过程中第一次迭代的主要结果；
- dpgen.log 文件：主要记录时间和迭代信息；
- record.dpgen 文件：记录迭代过程的当前阶段。

如果 DP-GEN 的进程由于某种原因停止，DP-GEN 将通过 `record.dpgen`文件自动恢复主进程。我们也可以根据自己的目的手动更改它，例如删除上次迭代并从一个检查点恢复。

`record.dpgen`文件每行包含两个数字：第一个是迭代的索引，第二个是 0 到 9 之间的数字，记录每个迭代中的哪个阶段当前正在运行。

| Index of iterations  | Stage in each iteration     | Process          |
|----------------------|-----------------------------|------------------|
| 0                    | 0                           | make_train       |
| 0                    | 1                           | run_train        |
| 0                    | 2                           | post_train       |
| 0                    | 3                           | make_model_devi  |
| 0                    | 4                           | run_model_devi   |
| 0                    | 5                           | post_model_devi  |
| 0                    | 6                           | make_fp          |
| 0                    | 7                           | run_fp           |
| 0                    | 8                           | post_fp          |

### 4.4 结果分析

第一次迭代完成后，iter.000000 的文件夹结构如下，主要是 3 个文件夹:


```python
! cd LiCl_DP_Tutorial_Example/chapter4 && tree iter.000000/ -L 1 
```

    /usr/bin/sh: 1: cd: can't cd to LiCl_DP_Tutorial_Example/chapter4


- 00.train 文件夹：主要是基于现有数据训练的多个 DP 模型（默认是 4 个）；
- 01.model_devi 文件夹：使用 00.train 中得到的 DP 模型进行 MD 模拟，产生新的构型；
- 02.fp 文件夹：对选定的构型进行第一原理计算，并将计算结果转换成训练数据


首先，我们来查看 `iter.000000`/ `00.train`。


```python
! cd LiCl_DP_Tutorial_Example/chapter4 && tree iter.000000/00.train -L 1
```


- 文件夹 00x 包含 DeePMD-kit 的输入和输出文件，其中训练了模型。
- graph.00x.pb ，链接到 00x/frozen.pb，是 DeePMD-kit 生成的模型。这些模型之间的唯一区别是神经网络初始化的随机种子。

让我们随机选择其中之一查看，例如 000。


```python
! cd LiCl_DP_Tutorial_Example/chapter4 && tree iter.000000/00.train/000 -L 1
```

    iter.000000/00.train/000  [error opening dir]
    
    0 directories, 0 files


- `input.json` 是当前任务的 DeePMD-kit 的设置。
- `checkpoint`用于重新开始训练。
- `model.ckpt*` 是与模型相关的文件。
- `frozen_model.pb`是冻结模型。
- `lcurve.out`记录能量和力的训练精度。
- `train.log`包括版本、数据、硬件信息、时间等。


然后，我们来查看`iter.000000/01.model_devi`。


```python
! cd LiCl_DP_Tutorial_Example/chapter4 && tree iter.000000/01.model_devi -L 1
```

- 文件夹 confs 包含从您在 param.json 的“sys_configs”中设置的 STRU 转换而来的 LAMMPS MD 的初始配置。
- 文件夹 task.000.00000x 包含 LAMMPS 的输入和输出文件。我们可以随机选择其中之一，例如 task.000.000000。


```python
! cd LiCl_DP_Tutorial_Example/chapter4 && tree iter.000000/01.model_devi/task.000.000001
```

- `conf.lmp`，链接到文件夹 confs 中的“000.0001.lmp”，作为 MD 的初始配置。
- `input.lammps` 是 LAMMPS 的输入文件。
- `model_devi.out` 记录在 MD 训练中相关的标签，能量和力的模型偏差。它是选择结构和进行第一性原理计算的标准。
- `traj` 存储LAMMPS MD轨迹。

通过查看 `model_devi.out` 的前几行, 您会看到:


```python
! cd LiCl_DP_Tutorial_Example/chapter4 && head -n 5 ./iter.000000/01.model_devi/task.000.000001/model_devi.out
```

想一下，我们将“trj_freq”设置为10，因此每10个步骤保存结构。

是否选择结构取决于其`“max_devi_f”`。如果它介于`“model_devi_f_trust_lo”`（0.08）和`“model_devi_f_trust_hi”`（0.18）之间，DP-GEN 会将该结构视为候选结构。

对于0，10，20 和 30 步保存结构，其`“max_devi_f”`均小于 0.08，所以不会被视为候选结构。

最后，我们来查看 `iter.000000/02.fp` 。


```python
! cd LiCl_DP_Tutorial_Example/chapter4 && tree iter.000000/02.fp
```

- `candidate.shuffle.000.out` 记录将从最后一步 01.model_devi 中选择哪些结构。 候选的数量总是远远超过您一次期望计算的最大值。在这种情况下，DP-GEN将随机选择最多`fp_task_max`结构并形成文件夹任务。
- `rest_accurate.shuffle.000.out` 记录了我们的模型准确的其他结构（`max_devi_f`小于`model_devi_f_trust_lo`），
- `rest_failed.shuffled.000.out` 记录了我们的模型太不准确的其他结构，这些结构通常是非物理的（大于 `model_devi_f_trust_hi`）。
- `data.000`：经过ABACUS SCF计算后，DP-GEN 将收集这些数据并将其更改为 DeePMD-kit 所需的格式。在下一次迭代的“00.train”中，这些数据将与初始数据一起训练。

通过 `cat candidate.shuffled.000.out | grep task.000.000000`， 你将会看到从task.000.000000中收集的候选构型：


```python
! cd LiCl_DP_Tutorial_Example/chapter4 && cat ./iter.000000/02.fp/candidate.shuffled.000.out | grep task.000.000000
```

    Usage: grep [OPTION]... PATTERNS [FILE]...
    Try 'grep --help' for more information.
    cat: ./iter.000000/02.fp/candidate.shuffled.000.out: No such file or directory


在第一次迭代之后，我们检查 dpgen.log 的内容。


```python
! cd LiCl_DP_Tutorial_Example/chapter4 && cat dpgen.log
```

可以发现，在 iter.000000 中生成了 200020 个结构，其中候选构型21098个，挑选了 200 个结构进行ABACUS SCF计算，且全部成功收敛。


在所有迭代结束之后，我们来检查 `LiCl_DP_Tutorial_Example/chapter4` 的文件结构：


```python
! cd LiCl_DP_Tutorial_Example/chapter4 && tree -L 2
```

以及 `dpgen.log` 的内容：


```python
! cd LiCl_DP_Tutorial_Example/chapter4 && cat cat dpgen.log | grep system
```

可以发现，仅在三个iteration后accurate_ratio接近100.00 %。在 'iter.000002' 中收集了 9 个候选结构，小于param.json中`fp_task_min`关键词指定的50。因此，模型不会在 iter.000003/00.train 中更新。

为了更直观监测迭代过程，我们提供了提供了一个名为max_devi_f.py的python脚本，用于统计每个iteration中所有构型max_devi_f的分布


```python
import os
import numpy as np
import matplotlib.pyplot as plt

for i in range(0,3):    # Specify the number of iterations
    max_devi_f_values = []
    for j in range(20):    # 20 LAMMPS tasks in iter*/01.model_devi
        directory = "./LiCl_DP_Tutorial_Example/chapter4/iter.{:06d}/01.model_devi/task.000.{:06d}".format(i, j%20)
        file_path = os.path.join(directory, "model_devi.out")
        data = np.genfromtxt(file_path, skip_header=1, usecols=4)
        max_devi_f_values.append(data)

    # Convert the list to a numpy array
    max_devi_f_values = np.concatenate(max_devi_f_values)

    # Use numpy.histogram() to calculate the frequency of each value
    hist, bin_edges = np.histogram(max_devi_f_values, range=(0, 0.2), bins=100)

    # Normalize the frequency to percentage
    hist = hist / len(max_devi_f_values) * 100

    # Use matplotlib.pyplot.plot() to plot the frequency of each value
    plt.plot(bin_edges[:-1], hist,label = 'iter{:02d}'.format(i))
    plt.legend()
    plt.xlabel("max_devi_f eV/Å")
    plt.ylabel("Distribution %")

    with open(f'./iter{i:02d}_dist-max-devi-f.txt'.format(i), 'w') as f:
        f.write("{:>12} {:>12}\n".format("bin_edges", "hist"))
        for x, y in zip(bin_edges[:-1], hist):
            f.write('{:>12.3f} {:>12.3f}\n'.format(x, y))

plt.savefig('./LiCl_DP_Tutorial_Example/chapter4/max-devi-f.png',dpi=300)
plt.show()
```

至此，我们应该已经了解了如何使用 DP-GEN 生成和训练深度势模型，以及如何分析输出结果。

## 章节 5：LAMMPS 深度势能分子动力学研究

在训练好DP模型后，我们可以将其应用于 LAMMPS 软件中，以便更高效地模拟 LiCl 熔体的性质。这使得我们能够在大尺度和长时间尺度上研究 LiCl 熔体的结构、动力学和热力学性质，从而获得关于材料行为的更深入理解。

### 本章节目标：

学习完本课程后，你将能够：

- 能够利用循环方式进行 LAMMPS 模拟；
- 能够进行 LiCl 熔体的 NPT 和 NVT 计算。

NPT: 

### 5.1 下载教程资源

在本教程中，我们以 LiCl 熔体分子为例，构建训练数据并生成深度势模型。我们已经在 *LiCl_DP_Tutorial_Example/chapter4* 中准备了需要的文件。


```python
! if ! [ -e LiCl_DP_Tutorial_Example ]; then wget https://bohrium-example.oss-cn-zhangjiakou.aliyuncs.com/notebook/LiCl_DP_Tutorial/LiCl_DP_Tutorial_Example.zip && unzip LiCl_DP_Tutorial_Example.zip; fi;
```

首先，使用 `tree` 命令查看 `LiCl_DP_Tutorial_Example/chapter5` 文件夹。



```python
! tree ./LiCl_DP_Tutorial_Example/chapter5 -L 2  

```

- `licl.in` 和 `licl.data` 是 LAMMPS 的输入文件

本教程采用 DeePMD-kit(2.1.5)软件包中预置的 LAMMSP 程序完成。

### 5.2 NPT-MD模拟



我们在 ex4/iter.000002/01.train/* 文件夹中可以找到最终的4个 DP 模型。通过 `dp compress` 命令，可以将模型压缩，并命名压缩后的模型为 licl_compress_0.pb 到 licl_compress_3.pb。将压缩后的模型分别复制到 00.npt 和 01.nvt 文件夹。接下来，我们进行 LAMMPS NPT-MD 模拟，以预测 LiCl 熔体的密度。LiCl 熔体LAMMPS NPT-MD 的控制文件如下：

```json
variable        a loop 4 pad
variable        b equal $a-1
variable        f equal $b*100
variable        t equal 900+$f

log             log$t.lammps

units           metal
boundary        p p p
atom_style      atomic

read_data       licl.data
replicate       2 2 2 
mass            1 6.94
mass            2 35.45

pair_style      deepmd ./licl_compress_0.pb ./licl_compress_1.pb ./licl_compress_2.pb ./licl_compress_3.pb  out_freq 100 out_file model_devi$t.out
pair_coeff  	* *	


velocity        all create $t 23456789

fix             1 all npt temp $t $t 0.1 iso 0 0 0.5
timestep        0.001

thermo_style    custom step temp pe ke etotal press density lx ly lz vol
thermo          100 

run             1000000
write_data      licl.data$t

clear
next            a
jump            in.licl_npt
```

与 Chapter1 的 licl.in 相比，有几点需要解释：

`variable a loop 4 pad`：创建一个名为a的变量，并通过loop命令在脚本中循环4次。变量 a 将在循环过程中依次取值 1, 2, 3 和 4。

`variable b equal $a-1`：创建一个名为b的变量，其值等于a减1。这意味着在循环中，b的值将从0开始，直到3。

`variable f equal $b*100`：创建一个名为f的变量，其值等于b乘以100。在循环过程中，f的值将是0、100、200和300。

`variable t equal 900+$f`：创建一个名为t的变量，其值等于900加上f。在循环过程中，t的值将是900、1000、1100和1200。

`replicate`  2 2 2：表示沿x、y和z方向将原始系统复制一次。这将使得模拟体系由64原子增大至512原子。

`pair_style  deepmd ./licl_compress_0.pb ./licl_compress_1.pb ./licl_compress_2.pb ./licl_compress_3.pb  out_freq 100 out_file model_devi$t.out`: 加载了4个神经网络模型,每100个时间步输出一次模型偏差到名为model_devi$t.out的文件，其中$t表示温度。

`thermo_style custom step temp pe ke etotal press density lx ly lz vol`: 在thermo_style中增加了density，便于计算模拟体系的密度。

`write_data licl$t.data`: 每次模拟结束时，将模拟体系的信息写入名为 `licl$t.data` 的文件中。

`jump in.licl_npt`: 每次模拟结束后，脚本会清除之前的设置，并跳回到输入文件的开头，准备开始下一次模拟。

我们提供了一个名为 log_lammps.py 的 Python 脚本，可以从 LAMMPS NPT 中获取盒子边长和密度信息。




```python
import numpy as np

def calculate_mean(file_name, column_name):
    with open(file_name, 'r') as file:
        lines = file.readlines()

    step_line = next(i for i, line in enumerate(lines) if 'Step' in line)
    loop_line = next(i for i, line in enumerate(lines) if 'Loop' in line)

    column_index = lines[step_line].split().index(column_name)
    data = [float(line.split()[column_index]) for line in lines[step_line+1:loop_line]]

    mean = sum(data[2001:]) / len(data[2001:])      #skip the first 200000 md steps

    return mean

temps=[900,1000,1100,1200]
for temp in temps:
    mean_density = calculate_mean(f'log{temp}.lammps', 'Density')          
    mean_Lx = calculate_mean(f'log{temp}.lammps', 'Lx')
    print(round(mean_density,3), round(mean_Lx,15))

```

预测密度如下：

表5.1 不同温度下，LiCl熔体的计算密度和相应模拟盒子的边长。

| T(K) |Density(g/cm3)|     Lx           |
|------|--------------|------------------| 
| 900  | 1.602        |22.405256609375005|
| 1000 | 1.562        |22.596664576249935|
| 1100 | 1.523        |22.789268989874945|
| 1200 | 1.485        |22.981117881750063|

### 5.3 NVT-MD 模拟

根据表 5.1 中 Lx 的数值调整 LAMMPS NPT-MD 模拟产生的 licl.data 文件中模拟盒子的边长。接下来，进行 LAMMPS NVT-MD 模拟，以预测 LiCl 熔体的结构信息和离子扩散系数。LiCl 熔体 LAMMPS NVT-MD 的控制文件如下：


```
variable        a loop 4 pad
variable        b equal $a-1
variable        f equal $b*100
variable        t equal 900+$f

log             log$t.lammps

units           metal
boundary        p p p
atom_style      atomic

read_data	licl$t.data
#replicate       2 2 2 
mass 		1 6.94
mass		2 35.45
group		Li  type 1
group		Cl  type 2


pair_style	deepmd ./licl_compress_0.pb ./licl_compress_1.pb ./licl_compress_2.pb ./licl_compress_3.pb  out_freq 100 out_file model_devi$t.out
pair_coeff  	* *	

velocity        all create $t 23456789

fix             1 all nvt temp $t $t 0.5
timestep        0.001

#rdf calculation 
compute 	 rdf all rdf 100 1 1 1 2 2 2
fix 		 2 all ave/time 100 1 100 c_rdf[*] file licl$t.rdf mode vector

#msd calculation
compute          msd1 Li msd
compute          msd2 Cl msd
fix              3 all ave/time 100 1 100 c_msd1[4] c_msd2[4] file licl$t.msd

thermo_style    custom step temp pe ke etotal press density lx ly lz vol
thermo          100 

dump		1 all custom 100 licl$t.dump id type x y z

run             1000000

clear
next            a
jump            licl.in
```


我们可以利用 chapter1 中提供的 Python 脚本，从 licl.rdf 和 licl.msd 中获得径向分布函数和离子自扩散系数。

预测径向分布函数如下：
![rdf_all_temperatures.png](attachment:35302fbd-8e3f-44ff-8be8-18e802e8877c.png)

表5.2 不同温度下，LiCl熔体的中Li-Li，Li-Cl和Cl-Cl离子对径向分布函数第一峰的位置。
| T(K) |Li-Li   |Li-Cl   |Cl-Cl   |
|------|--------|--------|--------| 
| 900  | 3.605  |2.345   |3.675   |
| 1000 | 3.605  |2.345   |3.675   |
| 1100 | 3.605  |2.345   |3.745   |
| 1200 | 3.605  |2.345   |3.745   |

预测均方位移和离子扩散系数如下：
![msd_all_temperatures.png](attachment:c68d0cea-c93a-4c23-b4f2-78e4c39182a6.png)

表5.3 不同温度下，LiCl 熔体的中 $Li^{+}$ 和 $Cl^{-}$ 离子的扩散系数 $\left(m^2/s \times 10^{-9}\right)$。
| T(K) |$D_{Li^{+}}$ | $D_{Cl^{-}}$|
|------|------------------------------------------------|----------------------------------------------| 
| 900  | 8.48          |3.28  |
| 1000 | 10.78        |4.59  |
| 1100 | 12.54        |5.96  |
| 1200 | 18.07        |8.75  |

我们可以将计算结果和文献[1]进行比较，可以看到计算结构和文献基本吻合。

## 结语

在这项工作中，我们通过新训练的深度势（DPs）研究了典型碱金属氯化物 LiCl 的局部结构和输运特性。我们从从头算分子动力学（AIMD）计算中提取数据集，并用这些数据来训练和验证 DPs。我们在比 AIMD 更广泛的温度范围内进行了大规模、长时间的分子动力学模拟，以确认 DPs 的可靠性和通用性。我们证明了生成的 DPs 模型可以作为模拟碱金属氯化物的有力工具；DPs 还提供了与 AIMD 相当的准确性和与经验势相似的效率。使用 DPs 预测的部分径向分布函数和角分布函数与从 AIMD 得到的结果非常接近。这项工作为 DPs 可用于探索其他系统（包括氯化物混合物或完全不同的盐类）提供了信心。

## 参考文献

[1] Journal of Materials Science & Technology 75 (2021) 78–85

---

<a href="https://bohrium.dp.tech/notebook/879b6a3a9d394448913ca1ce7de257ec" target="_blank"><img src="https://cdn.dp.tech/bohrium/web/static/images/open-in-bohrium.svg" alt="Open In Bohrium"/></a>

## 附录：


```python
# 运行以下代码以初始化 machine.json 配置文件

import json
import getpass
from monty.serialization import loadfn, dumpfn

file_path = './LiCl_DP_Tutorial_Example/chapter4/machine.json'
j = loadfn(file_path)

dpgen_steps = ['train', 'model_devi', 'fp']

for i in dpgen_steps:
    j[i][0]['machine']['remote_profile']['email'] = 'email'
    j[i][0]['machine']['remote_profile']['password'] = 'password'
    j[i][0]['machine']['remote_profile']['program_id'] = 12345
    
with open(file_path, 'w') as f: 
    json.dump(j, f, indent=4)
    print('初始化配置文件完成！')
```

    初始化配置文件完成！



```python
# ########### 注意，以下操作会删除本 Notebook 所有输出。
# ! if ! pip show nbstripout > /dev/null; then pip install nbstripout; fi;
# ! nbstripout LiCl_DP_Tutoria.ipynb
```

---
