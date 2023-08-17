# Hugging Face AI 生成炫酷二维码

<a href="https://bohrium.dp.tech/notebook/138792d0773a4fa0bc85134f2ac8a383" target="_blank"><img src="https://cdn.dp.tech/bohrium/web/static/images/open-in-bohrium.svg" alt="Open In Bohrium"/></a>

Stable Diffusion 是发布于 2022 年的开源深度学习文字转图片扩散模型。ControlNet 是一种控制扩散模型的网络结构。将 Stable Diffusion 和 ControlNet相结合，即可以在 Stable Diffusion 所用的提示词之外，额外地给模型添加限制条件，以控制生成结果的特征。

利用这种方法，今年6月，nhciao 在 reddit 上发表了生成艺术化二维码的文章。后经社区的探索和迭代，衍生出二维码专用的 ControlNet 模型，以及基于这个模型生成艺术化二维码的方法。如果参数调整得当的话，生成的结果可以达到“看上去不像是二维码”，却能够成功被正确识别的效果。

接下来，本文将一步步引导您快速掌握运用 Hugging Face 生成一张艺术化的二维码的方法。

## 第一步：加载 ControlNet 模型


```python
# 安装所需的依赖
# !conda install "python=3.10" -y
!pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
!pip install "diffusers==0.18.2" qrcode accelerate safetensors transformers --upgrade
!pip install "ipywidgets<8" --upgrade
```

下面这个代码块加载了示例所使用的模型，运行大约需要5分钟，请您耐心等待。如果你使用的是**qrcode-diffusion: 2023-7-17**镜像的话，那么模型已经下载好，这个代码块将会被自动跳过。如果你需要用到其他模型的话，直接在后续的代码中修改即可，diffusers会自动下载。


```bash
%%bash
# 加载示例所使用的模型
if ! [ -e /opt/hub ]; then
    echo "正在下载..."
    wget -q https://bohrium-example.oss-cn-zhangjiakou.aliyuncs.com/notebook/hub.tar.gz -O /tmp/hub.tar.gz
    echo "下载完成，开始解压"
    tar xzvf /tmp/hub.tar.gz -C /opt > /dev/null
    echo "解压完成"
    rm /tmp/hub.tar.gz
fi
echo "模型已加载"
```

    模型已加载



```python
import os

import qrcode
import torch
from diffusers import ControlNetModel, StableDiffusionControlNetPipeline
from PIL import Image as PilImage
```

加载 ControlNet 模型。如果没有运行前面的代码块加载模型的话，需要下载数据并加载，需要花费约5分钟，请耐心等待。

control_v1p_sd15_brightness 用于明暗控制，它可以对灰度图片进行着色或者对生成的图片着色。使用这个模型可以让所生成的图片的明暗与原二维码匹配，使得结果更可能能够被识别。


```python
controlnet_brightness = ControlNetModel.from_pretrained(
    "ioclab/control_v1p_sd15_brightness",
    torch_dtype=torch.float16,
    use_safetensors=True,
    cache_dir="/opt/hub"
).to("cuda")
```

    The config attributes {'dropout': 0.0, 'sample_size': 32} were passed to ControlNetModel, but are not expected and will be ignored. Please verify your config.json configuration file.


control_v1p_sd15_qrcode_monster 是专门为生成二维码训练的模型，使用它可以使得生成的图像包含二维码信息，又富有艺术性。


```python
controlnet_qrcode = ControlNetModel.from_pretrained(
    "monster-labs/control_v1p_sd15_qrcode_monster",
    torch_dtype=torch.float16,
    use_safetensors=True,
    cache_dir="/opt/hub"
).to("cuda")
```

## 第二步：加载 Stable Diffusion 模型

在这一步中，将会下载并加载 Stable Diffusion 模型并创建数据管道。如果没有运行前面的代码块加载模型的话，这个过程大约需要10分钟，请耐心等待。

根据 Stable Diffusion 网络结构，使用不同的数据集进行训练，产生了多种不同效果的模型。其中 *stable-diffusion-v1-5* 具有写实的风格，而 *anything-v5*、*DreamShaper*、*ghostmix* 等具有动漫化的风格。根据不同需求，可以选择使用不同的模型。

`StableDiffusionControlNetPipline`数据管道可以方便地将 Stable Diffusion 模型和多个 ControlNet 模型结合。我们可以将提示词等参数传入这个数据管道，即可自动完成推理步骤，得到结果。


```python
pipe = StableDiffusionControlNetPipeline.from_pretrained(
    # 此处选择不同的模型
    # "runwayml/stable-diffusion-v1-5",
    # "stablediffusionapi/anything-v5",
    # "Lykon/DreamShaper",
    "stablediffusionapi/ghostmix",
    controlnet=[controlnet_qrcode, controlnet_brightness],
    torch_dtype=torch.float16,
    cache_dir="/opt/hub"
)
pipe = pipe.to("cuda")
```

    vae/diffusion_pytorch_model.safetensors not found
    /opt/conda/lib/python3.10/site-packages/transformers/models/clip/feature_extraction_clip.py:28: FutureWarning: The class CLIPFeatureExtractor is deprecated and will be removed in version 5 of Transformers. Please use CLIPImageProcessor instead.
      warnings.warn(


在推理过程中，Scheduler 定义了通过模型输出更新样本的方式，也称为 Sampler。选用不同的 Schedulers 能够获得不同的收敛速度和生成效果。这里选择的是 `DPMSolverMultistepScheduler`并将其`use_karras_sigmas`配置为`True`。在这个配置下此 Scheduler 也称为 *DPM++ 2M Karras*，其具有较好的效果。你也可以根据需要选择不同的 Scheduler。


```python
from diffusers import DPMSolverMultistepScheduler

scheduler = DPMSolverMultistepScheduler.from_config(
    pipe.scheduler.config, use_karras_sigmas=True
)
pipe.scheduler = scheduler 
```

## 第三步：生成原始二维码


```python
# 更改此处来修改二维码的内容，较短的内容往往能获得更好的效果
qrcode_data = "https://nb.bohrium.dp.tech/detail/1345"
```


```python
qr = qrcode.QRCode(
    # 容错率，ERROR_CORRETC_L代表二维码有较低的容错率，使得二维码复杂度降低，生成艺术化二维码的难度更小
    # 如果内容较短的话，可以设置为ERROR_CORRETC_H，代表较高容错率，这样可以采用更激进的调参方式
    error_correction=qrcode.constants.ERROR_CORRECT_L,  
    box_size=11,
    border=4,
)
qr.add_data(qrcode_data)
qr.make(fit=True)
qrcode_image = qr.make_image(
    fill_color="black", back_color="white").convert("RGB")
qrcode_image
```

    
<!-- ![png](output_21_0.png) -->
    

## 第四步：生成艺术化二维码

下面的代码块定义了最重要的参数——提示词！
如果您不熟悉 Stable Diffusion 的提示词书写技巧的话，可以仅修改`prompt`的第二行。附录中也收录了一些提示词教程的链接，您可以跳转阅读。

请注意，每次调整提示词后需要重新运行该代码块。


```python
# 提示词及负面提示词, 更详细的提示词能获得更好的结果
prompt = """
(masterpiece:1.4, best quality:1.4), illustrations, (solo:1.2), (original), (very detailed wallpaper), photographic reality, (ultra detailed:1.4), (super complex details), 
flowers, cheery
"""
negative_prompt = """
NG_DeepNegative_V1_75T, (worst quality, low quality:1.4), EasyNegative, (worst quality, low quality, extra digits:1.4), bad proportions, worst quality, low quality, normal quality,
NSFW, watermark
"""
```

可以在下面的代码块调整各种参数来获得预想的生成效果。

请注意，每次调整参数后需要重新运行该代码块。


```python
# 随机数种子。固定随机数种子可以保证生成的结果可复现，也可以通过更改这个随机数种子来获得不同的生成结果。
seed = 1002

# 推理步数。对于示例所选用的 Scheduler 来说 30 已经足够。
num_inference_steps = 30

# 分类器指导强度。更高的值会让生成的图片更符合提示词，但代价是更低的图像质量。
guidance_scale = 7

# ControlNet QRCode Monster 相关参数
controlnet_conditioning_scale_qrcode = 1.5  # 指导强度。更高的值会让生成的图像更有二维码的特点。
control_guidance_start_qrcode = 0.1  # 产生作用的起始点。取值范围从0到1，示例中的0.1代表推理步数进行10%后该 ControlNet 开始发挥作用。
control_guidance_end_qrcode = 0.9     # 产生作用的结束点。取值范围从0到1，示例中的0.9代表推理步数进行90%后该 ControlNet 结束发挥作用。

# ControlNet Brightness 相关参数
controlnet_conditioning_scale_brightness = 0.4 # 指导强度。更高的值会让生成的图像更有二维码的特点。
control_guidance_start_brightness = 0.65  # 产生作用的起始点。取值范围从0到1，示例中的0.65代表推理步数进行65%后该 ControlNet 开始发挥作用。
control_guidance_end_brightness = 0.9     # 产生作用的结束点。取值范围从0到1，示例中的0.9代表推理步数进行90%后该 ControlNet 结束发挥作用。

# 生成图像的高度。建议的值为 512 或 768 以达到较好的效果。
height = 768
# 生成图像的宽度。建议的值为 512 或 768 以达到较好的效果。
width = 768
```

如果你希望得到**更加艺术化**的生成结果，你可以：
- 适当**调低**两个 ControlNet 的**指导强度**
- 适当**调后**两个 ControlNet 产生作用的**起始点**
- 适当**调前**两个 ControlNet 产生作用的**结束点**

如果生成的二维码**无法识别**，你可以调整随机数种子多试几次，或者按照与上述调整方法相反的方式调整以使得生成的结果更加有二维码的特点。

将参数传入数据管道以开始推理。稍等大约半分钟，就可以获得结果。如果生成的结果不满足预期，建议调整上面的参数与提示词后重新运行，多尝试几次。


```python
image = pipe(
    prompt,
    [qrcode_image, qrcode_image],
    num_inference_steps=num_inference_steps,
    generator=torch.Generator("cuda").manual_seed(seed),
    negative_prompt=negative_prompt,
    guidance_scale=guidance_scale,
    controlnet_conditioning_scale=[
        controlnet_conditioning_scale_qrcode,
        controlnet_conditioning_scale_brightness,
    ],
    control_guidance_start=[
        control_guidance_start_qrcode,
        control_guidance_start_brightness,
    ],
    control_guidance_end=[control_guidance_end_qrcode,
                          control_guidance_end_brightness],
    height=height,
    width=width,
).images[0]
image
```


      0%|          | 0/30 [00:00<?, ?it/s]





    
<!-- ![png](output_29_1.png) -->
    



生成出满意的二维码之后，可以将其保存到 */data* 目录中。保存之后，你可以打开侧边栏，点击左上角的刷新按钮，然后就能看到出现了 *qrcode.png*，右键即可将其下载到电脑中。


```python
image.save("qrcode.png")
```

## 附录
如果您想了解提示词的具体格式和含义，您可以阅读下述文章：
- [知乎：【Stable Diffusion】Prompt 篇](https://zhuanlan.zhihu.com/p/619247417)
- [Stable Diffusion prompt: a definitive guide](https://stable-diffusion-art.com/prompt-guide/)

如果您想了解 Hugging Face AI 的更多用法，您可以阅读：
- [Hugging Face Docs](https://huggingface.co/docs)
- [diffusers docs](https://huggingface.co/docs/diffusers/using-diffusers/loading_overview)

如果您想了解关于 Stable Diffusion 和 ControlNet 的更多信息，您可以参考：
- [Stable Diffusion 项目地址](https://github.com/Stability-AI/stablediffusion)
- [ControlNet 项目地址](https://github.com/lllyasviel/ControlNet)

## 参考资料及项目
- https://huggingface.co/spaces/blanchon/qrcode-diffusion
- https://stable-diffusion-art.com/qr-code/
- https://antfu.me/posts/ai-qrcode
- https://huggingface.co/DionTimmer/controlnet_qrcode
