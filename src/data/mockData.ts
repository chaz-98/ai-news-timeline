import { NewsItem } from "@/types/news";

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "百度文心大模型 4.0 重大升级发布",
    summary: "百度宣布文心大模型 4.0 版本迎来重大更新，在逻辑推理、代码生成等方面实现显著提升。",
    content: "文心大模型 4.0 在多项权威评测中表现优异，特别是在复杂数学推理和代码理解上。百度还宣布将降低 API 调用价格，让更多企业和开发者能够使用 AI 能力。",
    sourceUrl: "https://ai.baidu.com/",
    sourceName: "百度 AI",
    category: "LLM",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    imageUrl: "https://picsum.photos/800/400?random=1"
  },
  {
    id: "2",
    title: "阿里通义千问推出多模态理解新能力",
    summary: "阿里云通义千问最新版本支持视频、音频、图像的深度理解，多模态交互体验大幅提升。",
    content: "通义千问现在可以分析长视频内容，自动生成摘要、提取关键信息，还能对音频进行精准转录和翻译。这一更新让企业客户能够更高效地处理多媒体数据。",
    sourceUrl: "https://tongyi.aliyun.com/",
    sourceName: "阿里云",
    category: "多模态",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    imageUrl: "https://picsum.photos/800/400?random=2"
  },
  {
    id: "3",
    title: "腾讯混元大模型在医疗领域应用获突破",
    summary: "腾讯与多家医院合作，将混元大模型应用于医疗影像辅助诊断，准确率达到专业医生水平。",
    content: "通过对大量医疗数据的学习，腾讯混元可以辅助医生进行肺部CT、乳腺X光等影像的分析。在临床测试中，其识别准确率与资深放射科医生相当，大大提高了诊断效率。",
    sourceUrl: "https://hunyuan.tencent.com/",
    sourceName: "腾讯",
    category: "AI 医疗",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    imageUrl: "https://picsum.photos/800/400?random=3"
  },
  {
    id: "4",
    title: "智谱 AI 推出 GLM-4 系列新模型",
    summary: "智谱 AI 发布 GLM-4 的最新升级版本，在长文本处理和知识库问答方面性能卓越。",
    content: "GLM-4 新版本支持最长 100 万 token 的上下文窗口，可以直接分析整本书或大型代码库。同时，智谱宣布模型的推理速度提升 2 倍，价格下降 30%。",
    sourceUrl: "https://chatglm.cn/",
    sourceName: "智谱 AI",
    category: "LLM",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    imageUrl: "https://picsum.photos/800/400?random=4"
  },
  {
    id: "5",
    title: "字节跳动开源豆包模型技术方案",
    summary: "字节跳动宣布开源豆包大模型的部分核心技术，助力中国 AI 生态发展。",
    content: "此次开源涵盖了模型训练框架、推理优化等多个关键技术点。开发者可以在其基础上进行二次开发，大幅降低了 AI 应用的开发门槛。",
    sourceUrl: "https://www.doubao.com/",
    sourceName: "字节跳动",
    category: "开源",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    imageUrl: "https://picsum.photos/800/400?random=5"
  },
  {
    id: "6",
    title: "中国 AI 大模型安全标准正式发布",
    summary: "国家网信办联合多部门发布《生成式 AI 服务安全管理规定》配套标准，促进行业健康发展。",
    content: "新标准明确了大模型在内容安全、数据保护、透明度等方面的具体要求，为企业合规经营提供了明确指引。同时，也建立了分级分类的监管框架。",
    sourceUrl: "https://www.cac.gov.cn/",
    sourceName: "国家网信办",
    category: "AI 安全",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    imageUrl: "https://picsum.photos/800/400?random=6"
  }
];
