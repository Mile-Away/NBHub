# ABACUS 中的单元测试

🎯 <b style='color:purple'>本教程旨在<u>快速熟悉</u> ABACUS中单元测试的编译，运行和添加。</b>

* 一键运行，您可以快速在实践中检验你的想法。

* 丰富完善的注释，对于入门者友好。

* 在 [Bohrium Notebook](https://bohrium-doc.dp.tech/docs/userguide/Notebook) 界面，您可以点击界面上方蓝色按钮 `开始连接`，选择 `abacus-gnu-notebook:v1.0` 镜像及任何一款节点配置，稍等片刻即可运行。

* 本文面向ABACUS初级开发者，因ABACUS安装和测试时间较长，建议使用 c16_m32_cpu 类型的Bohrium机器。

<div style="width:auto; height:2px; background:linear-gradient(244deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 50%,rgba(0,0,0,1) 100%)"></div>

## 目标

> **上手熟悉ABACUS中单元测试的编译，运行及添加**

在学习本教程后，您将能够：

- 编译ABACUS及其单元测试
- 运行ABACUS中的单元测试
- 检查ABACUS的代码覆盖率
- 为ABACUS添加单元测试

**阅读该教程【最多】约需 20 分钟，让我们开始吧！**

## 目录

* [背景](#background)
* [编译ABACUS及其单元测试](#1)
    * [下载ABACUS软件包](#1-1)
    * [编译ABACUS及其单元测试](#1-2)
    * [查看ABACUS的单元测试](#1-3)
    * [单独编译单元测试](#1-4)
* [运行ABACUS中的单元测试](#2)
    * [运行第一个单元测试](#2-1)
    * [运行一个模块的单元测试](#2-2)
* [检查ABACUS的代码覆盖率](#3)
    * [生成代码覆盖率报告](#3-1)
    * [查看代码覆盖率](#3-2)
* [为ABACUS添加单元测试](#4)
    * [添加第一个单元测试](#4-1)
    * [迭代更新单元测试](#4-2)
    * [检查代码覆盖率](#4-3)
* [练习题](#5)
* [进一步阅读](#furtherreading)

## 背景 <a id ='background'></a>

ABACUS（原子算筹）是一款国内开源密度泛函（DFT）软件，自加入DeepModeling社区后得以持续有效进化。这部分得益于ABACUS的CI（Continuous Integration）测试，特别是单元测试的完善。另一方面，随着社区关注的增加，社区涌现出越来越多愿为国产开源DFT软件做贡献的开发者。从单元测试开始上手，也是成长为深度开发者的一条不错路径。本文就将向大家介绍ABACUS中单元测试的编译，运行及添加。

## 1. 编译ABACUS及其单元测试 <a id ='1'></a>

### 1.1 下载ABACUS软件包<a id ='1-1'></a>

在DeepModeling社区，ABACUS的Github仓库网址为：https://gitee.com/deepmodeling/abacus-develop.git 
。国内gitee仓库与其同步：https://gitee.com/deepmodeling/abacus-develop.git
。为了快速下载，这里建议大家使用gitee来拉取ABACUS软件包。

** 实测用户目录（这里为/root）比默认的/data目录编译更快，这里先进入用户目录 **


```python
cd ~
```

    /root



```python
!git clone https://gitee.com/deepmodeling/abacus-develop.git
```

    fatal: destination path 'abacus-develop' already exists and is not an empty directory.


进入abacus-develop目录


```python
cd abacus-develop
```

    /root/abacus-develop


查看abacus-develop目录下的内容


```python
ls
```

    [0m[01;36mCITATIONS.md[0m@   Dockerfile.cuda   LICENSE    [01;34mcmake[0m/  [01;34mdocs[0m/      [01;34mtests[0m/
    CMakeLists.txt  Dockerfile.gnu    README.md  [01;34mconda[0m/  [01;34mexamples[0m/  [01;34mtools[0m/
    Dockerfile      Dockerfile.intel  [01;34mbuild[0m/     [01;34mdeps[0m/   [01;34msource[0m/


### 1.2 编译ABACUS及其单元测试 <a id ='1-2'></a>

为了后续能够直接检查代码覆盖率，这里在编译前我们把准备好的3个必要cmake文件复制到abacus-develop/cmake目录下（这一步并非必须）


```python
cp ~/Find*.cmake ./cmake
```


```python
!cmake -B build -DBUILD_TESTING=ON -DENABLE_COVERAGE=ON -DENABLE_LIBXC=ON -DCOMMIT_INFO=OFF
```

    -- Found Libxc: version 5.1.7
    -- Configuring done
    -- Generating done
    -- Build files have been written to: /root/abacus-develop/build


编译比较费时，大约需要6分钟。镜像已经编译过abacus-develop，所以这里会很快完成这一步


```python
!cmake --build build -j8
```

下面这一步可将单元测试依赖的文件放入build目录，以确保单元测试可以运行成功


```python
!cmake --install build
```


### 1.3 查看ABACUS的单元测试 <a id ='1-3'></a>

进入abacus-develop/build目录


```python
cd ~/abacus-develop/build
```

    /root/abacus-develop/build



```python
!ctest -N
```

### 1.4 单独编译单元测试 <a id ='1-4'></a>

以ABACUS的一个单元测试cell_unitcell_test为例，下面的命令可以单独编译该单元测试。


```python
cd ~/abacus-develop/
```

    /root/abacus-develop



```python
!cmake --build build -j8 --target cell_unitcell_test
```

    Built target device
    Built target base
    Built target cell_unitcell_test


## 2. 运行ABACUS中的单元测试 <a id ='2'></a>

### 2.1 运行第一个单元测试 <a id ='2-1'></a>


```python
cd ~/abacus-develop/build
```

    /root/abacus-develop/build



```python
!ctest -R cell_unitcell_test -V
```

### 2.2 运行一个模块的单元测试 <a id ='2-2'></a>


```python
!ctest -R cell -V
``` 

## 3. 检查ABACUS的代码覆盖率 <a id ='3'></a>

### 3.1 生成代码覆盖率报告 <a id ='3-1'></a>


```python
ls
```

这一步比较费时，大约需要2分钟


```python
!make lcov
```


### 3.2 查看代码覆盖率 <a id ='3-2'></a>


```python
ls
```

```python
cd lcov
```

    /root/abacus-develop/build/lcov



```python
ls
```


```python
cd data
```

    /root/abacus-develop/build/lcov/data



```python
ls
```



```python
cd capture
```

    /root/abacus-develop/build/lcov/data/capture



```python
ls
```

    Base_Kernels_UTs.info                     elecstate_occupy.info.raw
    Base_Kernels_UTs.info.raw                 elecstate_print.info
    Base_Libm_UTs.info                        elecstate_print.info.raw
    Base_Libm_UTs.info.raw                    elecstate_pw.info
    Elecstate_Op_UTs.info                     elecstate_pw.info.raw
    Elecstate_Op_UTs.info.raw                 esolver.info
    HSolver_LCAO.info                         esolver.info.raw
    HSolver_LCAO.info.raw                     esolver_dp_test.info
    HSolver_base.info                         esolver_dp_test.info.raw
    HSolver_base.info.raw                     ewald_dnrm2.info
    HSolver_cg.info                           ewald_dnrm2.info.raw
    HSolver_cg.info.raw                       genelpa.info
    HSolver_cg_float.info                     genelpa.info.raw
    HSolver_cg_float.info.raw                 gint.info
    HSolver_dav.info                          gint.info.raw
    HSolver_dav.info.raw                      hamilt_general.info
    HSolver_dav_float.info                    hamilt_general.info.raw
    HSolver_dav_float.info.raw                hamilt_lcao.info
    HSolver_pw.info                           hamilt_lcao.info.raw
    HSolver_pw.info.raw                       hamilt_ofdft.info
    HSolver_sdft.info                         hamilt_ofdft.info.raw
    HSolver_sdft.info.raw                     hamilt_pwdft.info
    Hamilt_Kernels_UTs.info                   hamilt_pwdft.info.raw
    Hamilt_Kernels_UTs.info.raw               hamilt_stodft.info
    Module_Psi_UTs.info                       hamilt_stodft.info.raw
    Module_Psi_UTs.info.raw                   hcontainer.info
    ORB_atomic_lm_test.info                   hcontainer.info.raw
    ORB_atomic_lm_test.info.raw               hsolver.info
    ORB_nonlocal_lm_test.info                 hsolver.info.raw
    ORB_nonlocal_lm_test.info.raw             io_basic.info
    ORB_nonlocal_test.info                    io_basic.info.raw
    ORB_nonlocal_test.info.raw                io_bessel_basis_test.info
    ORB_read_test.info                        io_bessel_basis_test.info.raw
    ORB_read_test.info.raw                    io_cal_dos.info
    ORB_table_alpha_test.info                 io_cal_dos.info.raw
    ORB_table_alpha_test.info.raw             io_dm_io.info
    ORB_table_phi_test.info                   io_dm_io.info.raw
    ORB_table_phi_test.info.raw               io_input_conv.info
    PW_Kernels_UTs.info                       io_input_conv.info.raw
    PW_Kernels_UTs.info.raw                   io_input_test.info
    Test_Read_Paw.info                        io_input_test.info.raw
    Test_Read_Paw.info.raw                    io_input_test_para.info
    Test_SphBes_Func.info                     io_input_test_para.info.raw
    Test_SphBes_Func.info.raw                 io_nscf_band.info
    Test_SphBes_Transform.info                io_nscf_band.info.raw
    Test_SphBes_Transform.info.raw            io_output_log_test.info
    abacus.info                               io_output_log_test.info.raw
    abacus.info.raw                           io_output_test.info
    all_targets.info                          io_output_test.info.raw
    all_targets.info.raw                      io_parse_args.info
    atomic_radials.info                       io_parse_args.info.raw
    atomic_radials.info.raw                   io_print_info.info
    base.info                                 io_print_info.info.raw
    base.info.raw                             io_read_wfc_nao_test.info
    base_ParaCommon.info                      io_read_wfc_nao_test.info.raw
    base_ParaCommon.info.raw                  io_rho_io.info
    base_ParaGlobal.info                      io_rho_io.info.raw
    base_ParaGlobal.info.raw                  io_single_R_test.info
    base_ParaReduce.info                      io_single_R_test.info.raw
    base_ParaReduce.info.raw                  io_winput_test.info
    base_abfs-vector3_order.info              io_winput_test.info.raw
    base_abfs-vector3_order.info.raw          io_write_dos_pw.info
    base_blacs_connector.info                 io_write_dos_pw.info.raw
    base_blacs_connector.info.raw             io_write_input_test.info
    base_blas_connector.info                  io_write_input_test.info.raw
    base_blas_connector.info.raw              io_write_istate_info_test.info
    base_complexarray.info                    io_write_istate_info_test.info.raw
    base_complexarray.info.raw                io_write_orb_info.info
    base_complexmatrix.info                   io_write_orb_info.info.raw
    base_complexmatrix.info.raw               io_write_wfc_nao.info
    base_container.info                       io_write_wfc_nao.info.raw
    base_container.info.raw                   ions_move_basic_test.info
    base_element_basis_index.info             ions_move_basic_test.info.raw
    base_element_basis_index.info.raw         ions_move_bfgs_test.info
    base_global_file.info                     ions_move_bfgs_test.info.raw
    base_global_file.info.raw                 ions_move_cg_test.info
    base_global_function.info                 ions_move_cg_test.info.raw
    base_global_function.info.raw             ions_move_methods_test.info
    base_gram_schmidt_orth.info               ions_move_methods_test.info.raw
    base_gram_schmidt_orth.info.raw           ions_move_sd_test.info
    base_intarray.info                        ions_move_sd_test.info.raw
    base_intarray.info.raw                    lattice_change_basic_test.info
    base_integral.info                        lattice_change_basic_test.info.raw
    base_integral.info.raw                    lattice_change_cg_test.info
    base_inverse_matrix.info                  lattice_change_cg_test.info.raw
    base_inverse_matrix.info.raw              lattice_change_methods_test.info
    base_math_bspline.info                    lattice_change_methods_test.info.raw
    base_math_bspline.info.raw                md.info
    base_math_chebyshev.info                  md.info.raw
    base_math_chebyshev.info.raw              md_LJ_pot.info
    base_math_polyint.info                    md_LJ_pot.info.raw
    base_math_polyint.info.raw                md_fire.info
    base_math_sphbes.info                     md_fire.info.raw
    base_math_sphbes.info.raw                 md_func.info
    base_mathzone.info                        md_func.info.raw
    base_mathzone.info.raw                    md_lgv.info
    base_mathzone_add1.info                   md_lgv.info.raw
    base_mathzone_add1.info.raw               md_msst.info
    base_matrix.info                          md_msst.info.raw
    base_matrix.info.raw                      md_nhc.info
    base_matrix3.info                         md_nhc.info.raw
    base_matrix3.info.raw                     md_verlet.info
    base_memory.info                          md_verlet.info.raw
    base_memory.info.raw                      neighbor.info
    base_mymath.info                          neighbor.info.raw
    base_mymath.info.raw                      numerical_atomic_orbitals.info
    base_opt_CG.info                          numerical_atomic_orbitals.info.raw
    base_opt_CG.info.raw                      numerical_radial.info
    base_opt_TN.info                          numerical_radial.info.raw
    base_opt_TN.info.raw                      operator_ks_lcao.info
    base_realarray.info                       operator_ks_lcao.info.raw
    base_realarray.info.raw                   operator_ks_pw.info
    base_sph_bessel_recursive.info            operator_ks_pw.info.raw
    base_sph_bessel_recursive.info.raw        orb.info
    base_timer.info                           orb.info.raw
    base_timer.info.raw                       orbital_equal_test.info
    base_tool_check.info                      orbital_equal_test.info.raw
    base_tool_check.info.raw                  paw.info
    base_tool_quit.info                       paw.info.raw
    base_tool_quit.info.raw                   planewave.info
    base_tool_threading.info                  planewave.info.raw
    base_tool_threading.info.raw              potentials_base.info
    base_tool_title.info                      potentials_base.info.raw
    base_tool_title.info.raw                  potentials_new.info
    base_vector3.info                         potentials_new.info.raw
    base_vector3.info.raw                     psi.info
    base_ylm.info                             psi.info.raw
    base_ylm.info.raw                         psi_UT.info
    base_ylmreal.info                         psi_UT.info.raw
    base_ylmreal.info.raw                     pw_test.info
    basis_pw_k_serial.info                    pw_test.info.raw
    basis_pw_k_serial.info.raw                pwdft_soc.info
    basis_pw_serial.info                      pwdft_soc.info.raw
    basis_pw_serial.info.raw                  radial_collection.info
    beta_radials.info                         radial_collection.info.raw
    beta_radials.info.raw                     relax.info
    bfgs_basic_test.info                      relax.info.raw
    bfgs_basic_test.info.raw                  relax_new_line_search.info
    binstream_test.info                       relax_new_line_search.info.raw
    binstream_test.info.raw                   relax_new_relax.info
    cell.info                                 relax_new_relax.info.raw
    cell.info.raw                             spherical_bessel_transformer.info
    cell_ParaKpoints.info                     spherical_bessel_transformer.info.raw
    cell_ParaKpoints.info.raw                 sum_BAND_CHG_H2.info
    cell_atom_pseudo.info                     sum_BAND_CHG_H2.info.raw
    cell_atom_pseudo.info.raw                 sum_BAND_CHG_H2_cube.info
    cell_atom_spec.info                       sum_BAND_CHG_H2_cube.info.raw
    cell_atom_spec.info.raw                   sum_ENV_H2.info
    cell_klist_test.info                      sum_ENV_H2.info.raw
    cell_klist_test.info.raw                  sum_ENV_H2_cube.info
    cell_klist_test_para1.info                sum_ENV_H2_cube.info.raw
    cell_klist_test_para1.info.raw            surchem.info
    cell_neighbor_sltk_adjacent_set.info      surchem.info.raw
    cell_neighbor_sltk_adjacent_set.info.raw  surchem_atom_in.info
    cell_neighbor_sltk_atom.info              surchem_atom_in.info.raw
    cell_neighbor_sltk_atom.info.raw          surchem_cal_epsilon.info
    cell_neighbor_sltk_atom_arrange.info      surchem_cal_epsilon.info.raw
    cell_neighbor_sltk_atom_arrange.info.raw  surchem_cal_pseudo.info
    cell_neighbor_sltk_grid.info              surchem_cal_pseudo.info.raw
    cell_neighbor_sltk_grid.info.raw          surchem_cal_totn.info
    cell_pseudo_nc.info                       surchem_cal_totn.info.raw
    cell_pseudo_nc.info.raw                   surchem_cal_vcav.info
    cell_read_pp.info                         surchem_cal_vcav.info.raw
    cell_read_pp.info.raw                     surchem_cal_vel.info
    cell_unitcell_test.info                   surchem_cal_vel.info.raw
    cell_unitcell_test.info.raw               symmetry.info
    cell_unitcell_test_para.info              symmetry.info.raw
    cell_unitcell_test_para.info.raw          symmetry_analysis.info
    cell_unitcell_test_pw.info                symmetry_analysis.info.raw
    cell_unitcell_test_pw.info.raw            symmetry_symtrz.info
    cell_unitcell_test_readpp.info            symmetry_symtrz.info.raw
    cell_unitcell_test_readpp.info.raw        tddft.info
    cell_unitcell_test_setupcell.info         tddft.info.raw
    cell_unitcell_test_setupcell.info.raw     tddft_bandenergy_test.info
    charge_mixing.info                        tddft_bandenergy_test.info.raw
    charge_mixing.info.raw                    tddft_middle_hamilt_test.info
    charge_test.info                          tddft_middle_hamilt_test.info.raw
    charge_test.info.raw                      tddft_norm_psi_test.info
    cubic_spline.info                         tddft_norm_psi_test.info.raw
    cubic_spline.info.raw                     tddft_propagator_test.info
    dftu.info                                 tddft_propagator_test.info.raw
    dftu.info.raw                             tddft_upsi_test.info
    driver.info                               tddft_upsi_test.info.raw
    driver.info.raw                           test_hcontainer.info
    elecstate.info                            test_hcontainer.info.raw
    elecstate.info.raw                        test_hcontainer_complex.info
    elecstate_base.info                       test_hcontainer_complex.info.raw
    elecstate_base.info.raw                   test_hcontainer_cost.info
    elecstate_energy.info                     test_hcontainer_cost.info.raw
    elecstate_energy.info.raw                 vdw.info
    elecstate_fp_energy.info                  vdw.info.raw
    elecstate_fp_energy.info.raw              vdwTest.info
    elecstate_magnetism.info                  vdwTest.info.raw
    elecstate_magnetism.info.raw              xc_.info
    elecstate_occupy.info                     xc_.info.raw



```python
!lcov --help
```

    Usage: lcov [OPTIONS]
    
    Use lcov to collect coverage data from either the currently running Linux
    kernel or from a user space application. Specify the --directory option to
    get coverage data for a user space program.
    
    Misc:
      -h, --help                      Print this help, then exit
      -v, --version                   Print version number, then exit
      -q, --quiet                     Do not print progress messages
    
    Operation:
      -z, --zerocounters              Reset all execution counts to zero
      -c, --capture                   Capture coverage data
      -a, --add-tracefile FILE        Add contents of tracefiles
      -e, --extract FILE PATTERN      Extract files matching PATTERN from FILE
      -r, --remove FILE PATTERN       Remove files matching PATTERN from FILE
      -l, --list FILE                 List contents of tracefile FILE
          --diff FILE DIFF            Transform tracefile FILE according to DIFF
          --summary FILE              Show summary coverage data for tracefiles
    
    Options:
      -i, --initial                   Capture initial zero coverage data
      -t, --test-name NAME            Specify test name to be stored with data
      -o, --output-file FILENAME      Write data to FILENAME instead of stdout
      -d, --directory DIR             Use .da files in DIR instead of kernel
      -f, --follow                    Follow links when searching .da files
      -k, --kernel-directory KDIR     Capture kernel coverage data only from KDIR
      -b, --base-directory DIR        Use DIR as base directory for relative paths
          --convert-filenames         Convert filenames when applying diff
          --strip DEPTH               Strip initial DEPTH directory levels in diff
          --path PATH                 Strip PATH from tracefile when applying diff
          --(no-)checksum             Enable (disable) line checksumming
          --(no-)compat-libtool       Enable (disable) libtool compatibility mode
          --gcov-tool TOOL            Specify gcov tool location
          --ignore-errors ERRORS      Continue after ERRORS (gcov, source, graph)
          --no-recursion              Exclude subdirectories from processing
          --to-package FILENAME       Store unprocessed coverage data in FILENAME
          --from-package FILENAME     Capture from unprocessed data in FILENAME
          --no-markers                Ignore exclusion markers in source code
          --derive-func-data          Generate function data from line data
          --list-full-path            Print full path during a list operation
          --(no-)external             Include (ignore) data for external files
          --config-file FILENAME      Specify configuration file location
          --rc SETTING=VALUE          Override configuration file setting
          --compat MODE=on|off|auto   Set compat MODE (libtool, hammer, split_crc)
          --include PATTERN           Include files matching PATTERN
          --exclude PATTERN           Exclude files matching PATTERN
    
    For more information see: http://ltp.sourceforge.net/coverage/lcov.php



```python
!lcov --summary all_targets.info
```

    Reading tracefile all_targets.info
    Summary coverage rate:
      lines......: 10.1% (8410 of 83617 lines)
      functions..: 9.9% (939 of 9487 functions)
      branches...: no data found



```python
!lcov --summary cell_unitcell_test.info
```

    Reading tracefile cell_unitcell_test.info
    Summary coverage rate:
      lines......: 54.8% (2565 of 4681 lines)
      functions..: 77.2% (261 of 338 functions)
      branches...: no data found



```python
!lcov --list cell_unitcell_test.info
```

    Reading tracefile cell_unitcell_test.info
                                              |Lines       |Functions  |Branches    
    Filename                                  |Rate     Num|Rate    Num|Rate     Num
    ================================================================================
    [/root/abacus-develop/source/]
    module_base/complexmatrix.h               | 0.0%      3| 0.0%     1|    -      0
    module_base/global_function.h             |85.7%     21|72.7%    11|    -      0
    module_base/mathzone.h                    | 100%     41| 100%     2|    -      0
    module_base/matrix.h                      |14.3%      7|33.3%     3|    -      0
    module_base/matrix3.h                     | 100%      8| 100%     2|    -      0
    module_base/realarray.h                   | 0.0%      8| 0.0%     4|    -      0
    module_base/vector3.h                     |89.5%     38|82.4%    17|    -      0
    module_cell/atom_pseudo.cpp               | 6.0%    133|50.0%     4|    -      0
    module_cell/atom_spec.cpp                 |38.7%    142|50.0%     6|    -      0
    module_cell/pseudo_nc.cpp                 |14.4%    208|20.0%    10|    -      0
    module_cell/read_atoms.cpp                |93.4%    681| 100%     7|    -      0
    module_cell/read_cell_pseudopots.cpp      |14.3%     63|50.0%     2|    -      0
    module_cell/read_pp.cpp                   | 0.0%    233| 0.0%     8|    -      0
    module_cell/read_pp_blps.cpp              | 0.0%     62| 0.0%     1|    -      0
    module_cell/read_pp_upf100.cpp            | 0.0%    230| 0.0%    10|    -      0
    module_cell/read_pp_upf201.cpp            | 0.0%    321| 0.0%     6|    -      0
    module_cell/read_pp_vwr.cpp               | 0.0%    220| 0.0%     1|    -      0
    module_cell/test/prepare_unitcell.h       |98.9%    187|80.0%     5|    -      0
    module_cell/test/unitcell_test.cpp        |99.6%   1130|98.5%   195|    -      0
    module_cell/unitcell.cpp                  |43.2%    842|48.1%    27|    -      0
    module_cell/unitcell.h                    | 100%     32| 100%     7|    -      0
    module_io/output.cpp                      |15.1%     53|20.0%     5|    -      0
    module_io/output.h                        |55.6%     18|50.0%     4|    -      0
    ================================================================================
                                        Total:|54.8%   4681|77.2%   338|    -      0


在abacus-develop目录下运行命令：OMP_NUM_THREADS=1 cmake --build build --target test ARGS="-V --timeout 21600"

即可运行ABACUS的所有CI测试，并生成完整的代码覆盖率报告。

这里为了节省时间，在镜像中准备了一个完整单元测试代码覆盖率报告结果，可将其复制到/data目录之后，下载到本地查看结果。


```python
cp ~/ABACUS-Lcov_UT.tgz /data/
```

依次打开lcov-ut/html/all_targets/目录

双击index.html，用浏览器打开查看代码覆盖率报告。

## 4. 为ABACUS添加单元测试 <a id ='4'></a>

至此，您已熟悉了在ABACUS中怎样编译和运行单元测试，接下来就可以尝试为ABACUS添加单元测试了！

下面我们以一个简单的例子来演示为ABACUS添加单元测试的过程。

我们查看module_cell/unitcell.cpp中的setup函数，了解到它的功能是设置晶胞的类型名，元素种类，元素最大角量子数，是否设置原子初速度，以及是否固定晶格矢量。


```python
cd ~/abacus-develop/source
```

    /root/abacus-develop/source



```python
!sed -n '1122,1206p' module_cell/unitcell.cpp
```

    void UnitCell::setup(const std::string &latname_in,
    	const int &ntype_in,
    	const int &lmaxmax_in,
    	const bool &init_vel_in,
    	const std::string &fixed_axes_in)
    {
    	this->latName = latname_in;
    	this->ntype = ntype_in;
    	this->lmaxmax = lmaxmax_in;
    	this->init_vel = init_vel_in;
    	// pengfei Li add 2018-11-11
    	if (fixed_axes_in == "None")
    	{
    		this->lc[0] = 1;
    		this->lc[1] = 1;
    		this->lc[2] = 1;
    	}
    	else if (fixed_axes_in == "volume")
    	{
    		this->lc[0] = 1;
    		this->lc[1] = 1;
    		this->lc[2] = 1;
    		if(!GlobalV::relax_new)
    		{
    			ModuleBase::WARNING_QUIT("Input","there are bugs in the old implementation; set relax_new to be 1 for fixed_volume relaxation");
    		}
    	}
    	else if (fixed_axes_in == "shape")
    	{
    		if(!GlobalV::relax_new)
    		{
    			ModuleBase::WARNING_QUIT("Input","set relax_new to be 1 for fixed_shape relaxation");
    		}
    		this->lc[0] = 1;
    		this->lc[1] = 1;
    		this->lc[2] = 1;
    	}
    	else if (fixed_axes_in == "a")
    	{
    		this->lc[0] = 0;
    		this->lc[1] = 1;
    		this->lc[2] = 1;
    	}
    	else if (fixed_axes_in == "b")
    	{
    		this->lc[0] = 1;
    		this->lc[1] = 0;
    		this->lc[2] = 1;
    	}
    	else if (fixed_axes_in == "c")
    	{
    		this->lc[0] = 1;
    		this->lc[1] = 1;
    		this->lc[2] = 0;
    	}
    	else if (fixed_axes_in == "ab")
    	{
    		this->lc[0] = 0;
    		this->lc[1] = 0;
    		this->lc[2] = 1;
    	}
    	else if (fixed_axes_in == "ac")
    	{
    		this->lc[0] = 0;
    		this->lc[1] = 1;
    		this->lc[2] = 0;
    	}
    	else if (fixed_axes_in == "bc")
    	{
    		this->lc[0] = 1;
    		this->lc[1] = 0;
    		this->lc[2] = 0;
    	}
    	else if (fixed_axes_in == "abc")
    	{
    		this->lc[0] = 0;
    		this->lc[1] = 0;
    		this->lc[2] = 0;
    	}
    	else
    	{
    		ModuleBase::WARNING_QUIT("Input", "fixed_axes should be None,volume,shape,a,b,c,ab,ac,bc or abc!");
    	}
    	return;
    }


其单元测试在test/unitcell_test.cpp中，通过阅读Setup，SetupWarningQuit1， SetupWarningQuit2 这3个相关的测试，我们发现 fixed_axes_in 为任意类型的异常并没有被测试。


```python
!cat -n module_cell/test/unitcell_test.cpp
```


### 4.1 添加第一个单元测试 <a id ='4-1'></a>

为此，我们编写了一个名为SetupWarningQuit3的单元测试，并在其中将fixed_axes_in设置为"arbitrary"。  
我们首先不添加任何断言，而是尝试来触发错误： 


```python
!cat ~/SetupWarningQuit3_trigger_error
```

    TEST_F(UcellDeathTest,SetupWarningQuit3)
    {
    	std::string latname_in = "bcc";
    	int ntype_in = 1;
    	int lmaxmax_in = 2;
    	bool init_vel_in = false;
    	GlobalV::relax_new = false;
    	std::string fixed_axes_in = "arbitrary";
    	ucell->setup(latname_in,ntype_in,lmaxmax_in,init_vel_in,fixed_axes_in);
    }
    



```python
ls
```



```python
!sed -i "280 r /root/SetupWarningQuit3_trigger_error" module_cell/test/unitcell_test.cpp
```


```python
!cat -n module_cell/test/unitcell_test.cpp
```



重新编译cell_unitcell_test


```python
cd ~/abacus-develop
```

    /root/abacus-develop



```python
!cmake --build build -j8 --target cell_unitcell_test
```

    Built target device
    Built target base
    [32mBuilding CXX object source/module_cell/test/CMakeFiles/cell_unitcell_test.dir/unitcell_test.cpp.o[0m
    [32m[1mLinking CXX executable cell_unitcell_test[0m
    Built target cell_unitcell_test


运行cell_unitcell_test


```python
cd ~/abacus-develop/build
```

    /root/abacus-develop/build



```python
!ctest -R cell_unitcell_test -V
```



我们看到SetupWarningQuit3成功出发了以下错误：  

67:  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  
67:                          NOTICE                             
67:  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  
67:    
67:  fixed_axes should be None,volume,shape,a,b,c,ab,ac,bc or abc!  
67:  CHECK IN FILE : warning.log  
67:    
67:  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  
67:                          NOTICE                             
67:  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   

### 4.2 迭代更新单元测试 <a id ='4-2'></a>

接下来只需将屏幕输出的warning信息改写成断言形式即可：


```python
!cat ~/SetupWarningQuit3_add_assertion
```

    TEST_F(UcellDeathTest,SetupWarningQuit3)
    {
    	std::string latname_in = "bcc";
    	int ntype_in = 1;
    	int lmaxmax_in = 2;
    	bool init_vel_in = false;
    	GlobalV::relax_new = false;
    	std::string fixed_axes_in = "arbitrary";
    	testing::internal::CaptureStdout();
    	EXPECT_EXIT(ucell->setup(latname_in,ntype_in,lmaxmax_in,init_vel_in,fixed_axes_in),
    			::testing::ExitedWithCode(0),"");
    	output = testing::internal::GetCapturedStdout();
    	EXPECT_THAT(output,testing::HasSubstr("fixed_axes should be None,volume,shape,a,b,c,ab,ac,bc or abc!"));
    }
    



```python
cd ~/abacus-develop/source
```

    /root/abacus-develop/source



```python
!git checkout module_cell/test/unitcell_test.cpp
```

    Updated 1 path from the index



```python
!sed -i "280 r /root/SetupWarningQuit3_add_assertion" module_cell/test/unitcell_test.cpp
```


```python
!cat -n module_cell/test/unitcell_test.cpp
```


重新编译和运行


```python
cd ~/abacus-develop
```

    /root/abacus-develop



```python
!cmake --build build -j8 --target cell_unitcell_test
```



```python
cd ~/abacus-develop/build
```

    /root/abacus-develop/build



```python
!ctest -R cell_unitcell_test -V
```


### 4.3 检查代码覆盖率 <a id ='4-3'></a>


```python
cd ~/abacus-develop/build
```

    /root/abacus-develop/build



```python
!make lcov
```


```python
!lcov --summary lcov/data/capture/cell_unitcell_test.info
```

    Reading tracefile lcov/data/capture/cell_unitcell_test.info
    Summary coverage rate:
      lines......: 54.9% (2578 of 4693 lines)
      functions..: 77.5% (265 of 342 functions)
      branches...: no data found



```python
!lcov --list lcov/data/capture/cell_unitcell_test.info
```

    Reading tracefile lcov/data/capture/cell_unitcell_test.info
                                              |Lines       |Functions  |Branches    
    Filename                                  |Rate     Num|Rate    Num|Rate     Num
    ================================================================================
    [/root/abacus-develop/source/]
    module_base/complexmatrix.h               | 0.0%      3| 0.0%     1|    -      0
    module_base/global_function.h             |85.7%     21|72.7%    11|    -      0
    module_base/mathzone.h                    | 100%     41| 100%     2|    -      0
    module_base/matrix.h                      |14.3%      7|33.3%     3|    -      0
    module_base/matrix3.h                     | 100%      8| 100%     2|    -      0
    module_base/realarray.h                   | 0.0%      8| 0.0%     4|    -      0
    module_base/vector3.h                     |89.5%     38|82.4%    17|    -      0
    module_cell/atom_pseudo.cpp               | 6.0%    133|50.0%     4|    -      0
    module_cell/atom_spec.cpp                 |38.7%    142|50.0%     6|    -      0
    module_cell/pseudo_nc.cpp                 |14.4%    208|20.0%    10|    -      0
    module_cell/read_atoms.cpp                |93.4%    681| 100%     7|    -      0
    module_cell/read_cell_pseudopots.cpp      |14.3%     63|50.0%     2|    -      0
    module_cell/read_pp.cpp                   | 0.0%    233| 0.0%     8|    -      0
    module_cell/read_pp_blps.cpp              | 0.0%     62| 0.0%     1|    -      0
    module_cell/read_pp_upf100.cpp            | 0.0%    230| 0.0%    10|    -      0
    module_cell/read_pp_upf201.cpp            | 0.0%    321| 0.0%     6|    -      0
    module_cell/read_pp_vwr.cpp               | 0.0%    220| 0.0%     1|    -      0
    module_cell/test/prepare_unitcell.h       |98.9%    187|80.0%     5|    -      0
    module_cell/test/unitcell_test.cpp        |99.6%   1142|98.5%   199|    -      0
    module_cell/unitcell.cpp                  |43.3%    842|48.1%    27|    -      0
    module_cell/unitcell.h                    | 100%     32| 100%     7|    -      0
    module_io/output.cpp                      |15.1%     53|20.0%     5|    -      0
    module_io/output.h                        |55.6%     18|50.0%     4|    -      0
    ================================================================================
                                        Total:|54.9%   4693|77.5%   342|    -      0


分析代码覆盖率结果，看到module_cell/unitcell.cpp的行覆盖率从43.2%变为43.3%。  
您也可以下载lcov目录下的html文件格式的代码覆盖率报告来查看最终结果。

## 5. 练习题 <a id ='5'></a>

以下提供两个练习题供您参考：

1. 请阅读并运行ABACUS中的一个单元测试，充分理解被测函数的功能之后依据ABACUS对代码注释格式的要求 [Comment style for documentation](http://abacus.deepmodeling.com/en/latest/CONTRIBUTING.html#comment-style-for-documentation)，为相应的被测函数添加注释（如果该函数的注释还未被添加），并在Github上提交Pull Request。

2. 根据您的兴趣，为您关注的一个函数添加一个单元测试。该函数可以是已有函数，这时您的单元测试应该与已有单元测试不同，比如测试不同的边界条件以防止可能的BUG出现。当然，该函数也可能是您重构代码之后产生的函数。请完成其单元测试并在Github上提交Pull Request。

## 进一步阅读 <a id='furtherreading'></a>

如果您希望更深度参与ABACUS开发，本节提供有关该主题的更多资源。

- [ABACUS Documentation](http://abacus.deepmodeling.com/en/latest/)：ABACUS的线上文档里有一个专栏（Community）是为社区开发者准备的，您可以通过阅读该栏目来熟悉ABACUS的开发流程。同时欢迎您通过DeepModeling社区与我们联系。

- [ABACUS on Github](https://github.com/deepmodeling/abacus-develop)：Github的Issue栏目有更多开发者的讨论，欢迎您的加入！

- [GoogleTest](https://google.github.io/googletest/)：本文仅演示了怎样添加简单的单元测试，更多单元测试添加方法请查阅GoogleTest说明文档。



