/* ===== 测试小站 · 题库数据 =====
 * 每个测试是一个配置对象，结构：
 * {
 *   id, name, icon, color, description, time,
 *   scoring: { type: "dimension" | "type", ... },
 *   questions: [ { text, options: [{ label, value }] } ],
 *   interpretation: { dims?, types?, special? }
 * }
 * 添加新测试：复制本文件任一对象，替换内容，push 到 window.TESTS 即可。
 */
window.TESTS = [];

/* ==================== 依恋类型测试（ECR 精简版） ==================== */
window.TESTS.push({
  id: "attachment",
  name: "依恋类型测试",
  icon: "AT",
  color: "#8e8e93",
  description: "基于依恋理论，从「焦虑」与「回避」两个维度，了解你在亲密关系中的安全感模式。",
  time: "约 3 分钟",
  scoring: {
    type: "dimension",
    dimensions: [
      { key: "ANX", label: "焦虑倾向", low: "低焦虑 · 对关系有信心", high: "高焦虑 · 常担心被抛弃", max: 45 },
      { key: "AVO", label: "回避倾向", low: "低回避 · 享受亲密", high: "高回避 · 抗拒亲密", max: 45 }
    ],
    scale: 5,
    classify: function (s) {
      var anx = (s.ANX || 0) / 9;
      var avo = (s.AVO || 0) / 9;
      var type, name, summary;
      if (anx < 3 && avo < 3) { type = "安全型"; name = "安全型依恋"; summary = "你对自己和关系都很有信心，能自在地亲近他人，也允许对方有自己的空间。"; }
      else if (anx >= 3 && avo < 3) { type = "痴迷型"; name = "痴迷型依恋"; summary = "你渴望亲密和回应，但容易因担心被抛弃而焦虑，需要很多确认与安全感。"; }
      else if (anx < 3 && avo >= 3) { type = "疏离型"; name = "疏离型依恋"; summary = "你习惯保持情感距离，强调独立，不太愿意依赖他人或被他人依赖。"; }
      else { type = "恐惧型"; name = "恐惧型依恋"; summary = "你既渴望亲密又害怕受伤，常在靠近与逃离之间摇摆，内心充满矛盾。"; }
      return { type: type, typeName: name, summary: summary };
    }
  },
  questions: [
    { text: "我常常担心伴侣其实没那么爱我。", options: [{ label: "非常不同意", value: { ANX: 1 } }, { label: "比较不同意", value: { ANX: 2 } }, { label: "说不清", value: { ANX: 3 } }, { label: "比较同意", value: { ANX: 4 } }, { label: "非常同意", value: { ANX: 5 } }] },
    { text: "我害怕被重要的人抛弃。", options: [{ label: "非常不同意", value: { ANX: 1 } }, { label: "比较不同意", value: { ANX: 2 } }, { label: "说不清", value: { ANX: 3 } }, { label: "比较同意", value: { ANX: 4 } }, { label: "非常同意", value: { ANX: 5 } }] },
    { text: "我很容易担心另一半对这段关系不够投入。", options: [{ label: "非常不同意", value: { ANX: 1 } }, { label: "比较不同意", value: { ANX: 2 } }, { label: "说不清", value: { ANX: 3 } }, { label: "比较同意", value: { ANX: 4 } }, { label: "非常同意", value: { ANX: 5 } }] },
    { text: "恋爱中我经常患得患失。", options: [{ label: "非常不同意", value: { ANX: 1 } }, { label: "比较不同意", value: { ANX: 2 } }, { label: "说不清", value: { ANX: 3 } }, { label: "比较同意", value: { ANX: 4 } }, { label: "非常同意", value: { ANX: 5 } }] },
    { text: "我担心自己不够好，配不上对方。", options: [{ label: "非常不同意", value: { ANX: 1 } }, { label: "比较不同意", value: { ANX: 2 } }, { label: "说不清", value: { ANX: 3 } }, { label: "比较同意", value: { ANX: 4 } }, { label: "非常同意", value: { ANX: 5 } }] },
    { text: "对方回复消息稍慢，我就会开始焦虑。", options: [{ label: "非常不同意", value: { ANX: 1 } }, { label: "比较不同意", value: { ANX: 2 } }, { label: "说不清", value: { ANX: 3 } }, { label: "比较同意", value: { ANX: 4 } }, { label: "非常同意", value: { ANX: 5 } }] },
    { text: "我渴望从对方那里得到承诺来获得安全感。", options: [{ label: "非常不同意", value: { ANX: 1 } }, { label: "比较不同意", value: { ANX: 2 } }, { label: "说不清", value: { ANX: 3 } }, { label: "比较同意", value: { ANX: 4 } }, { label: "非常同意", value: { ANX: 5 } }] },
    { text: "我常怀疑对方是不是真心喜欢我。", options: [{ label: "非常不同意", value: { ANX: 1 } }, { label: "比较不同意", value: { ANX: 2 } }, { label: "说不清", value: { ANX: 3 } }, { label: "比较同意", value: { ANX: 4 } }, { label: "非常同意", value: { ANX: 5 } }] },
    { text: "和对方分开时，我总担心关系会出问题。", options: [{ label: "非常不同意", value: { ANX: 1 } }, { label: "比较不同意", value: { ANX: 2 } }, { label: "说不清", value: { ANX: 3 } }, { label: "比较同意", value: { ANX: 4 } }, { label: "非常同意", value: { ANX: 5 } }] },
    { text: "靠得太近会让我感到不舒服。", options: [{ label: "非常不同意", value: { AVO: 1 } }, { label: "比较不同意", value: { AVO: 2 } }, { label: "说不清", value: { AVO: 3 } }, { label: "比较同意", value: { AVO: 4 } }, { label: "非常同意", value: { AVO: 5 } }] },
    { text: "我不太愿意向伴侣敞开心扉。", options: [{ label: "非常不同意", value: { AVO: 1 } }, { label: "比较不同意", value: { AVO: 2 } }, { label: "说不清", value: { AVO: 3 } }, { label: "比较同意", value: { AVO: 4 } }, { label: "非常同意", value: { AVO: 5 } }] },
    { text: "我习惯自己处理问题，不太需要依赖伴侣。", options: [{ label: "非常不同意", value: { AVO: 1 } }, { label: "比较不同意", value: { AVO: 2 } }, { label: "说不清", value: { AVO: 3 } }, { label: "比较同意", value: { AVO: 4 } }, { label: "非常同意", value: { AVO: 5 } }] },
    { text: "伴侣太亲密时，我会想要逃开。", options: [{ label: "非常不同意", value: { AVO: 1 } }, { label: "比较不同意", value: { AVO: 2 } }, { label: "说不清", value: { AVO: 3 } }, { label: "比较同意", value: { AVO: 4 } }, { label: "非常同意", value: { AVO: 5 } }] },
    { text: "我不喜欢谈论自己的感受。", options: [{ label: "非常不同意", value: { AVO: 1 } }, { label: "比较不同意", value: { AVO: 2 } }, { label: "说不清", value: { AVO: 3 } }, { label: "比较同意", value: { AVO: 4 } }, { label: "非常同意", value: { AVO: 5 } }] },
    { text: "我觉得独立比亲密更重要。", options: [{ label: "非常不同意", value: { AVO: 1 } }, { label: "比较不同意", value: { AVO: 2 } }, { label: "说不清", value: { AVO: 3 } }, { label: "比较同意", value: { AVO: 4 } }, { label: "非常同意", value: { AVO: 5 } }] },
    { text: "对方想深入了解我时，我会不自觉地回避。", options: [{ label: "非常不同意", value: { AVO: 1 } }, { label: "比较不同意", value: { AVO: 2 } }, { label: "说不清", value: { AVO: 3 } }, { label: "比较同意", value: { AVO: 4 } }, { label: "非常同意", value: { AVO: 5 } }] },
    { text: "亲密关系有时让我感到压力很大。", options: [{ label: "非常不同意", value: { AVO: 1 } }, { label: "比较不同意", value: { AVO: 2 } }, { label: "说不清", value: { AVO: 3 } }, { label: "比较同意", value: { AVO: 4 } }, { label: "非常同意", value: { AVO: 5 } }] },
    { text: "我更愿意在关系中保持一定的情感距离。", options: [{ label: "非常不同意", value: { AVO: 1 } }, { label: "比较不同意", value: { AVO: 2 } }, { label: "说不清", value: { AVO: 3 } }, { label: "比较同意", value: { AVO: 4 } }, { label: "非常同意", value: { AVO: 5 } }] }
  ],
  interpretation: {
    types: {
      "安全型": {
        title: "安全型依恋",
        summary: "你对自己和关系都很有信心，能自在地亲近他人，也允许对方有自己的空间。",
        blocks: [
          { h: "核心特质", p: "你拥有健康的关系模式：既能享受亲密，也尊重彼此的独立性。你信任伴侣，遇到矛盾时愿意沟通解决，不轻易陷入猜疑或冷战。" },
          { h: "关系表现", p: "你能在关系中保持情绪稳定，坦然地表达需求和爱意。面对冲突时，你更倾向于解决问题而不是攻击对方或逃避。" },
          { h: "优势", p: "你为关系提供了坚实的安全底座，是伴侣可以放心依赖的对象。你的稳定和坦诚，让关系更可能长期健康发展。" },
          { h: "小提醒", p: "安全型也有自己的需求和情绪，不必总做那个「懂事」的人。偶尔表达脆弱和需要，反而让关系更亲密。" }
        ]
      },
      "痴迷型": {
        title: "痴迷型依恋",
        summary: "你渴望亲密和回应，但容易因担心被抛弃而焦虑，需要很多确认与安全感。",
        blocks: [
          { h: "核心特质", p: "你对关系投入很深，也很敏感。对方的冷淡、迟回的消息，都可能被你解读为「不爱了」。你的爱炽热而急切，渴望被同等回应。" },
          { h: "关系表现", p: "你可能频繁寻求确认，或在感到被忽视时情绪起伏。你的焦虑并非矫情，而是内心对安全感的真实渴求。" },
          { h: "成长方向", p: "试着把一部分安全感的来源从对方身上收回：建立自己的兴趣、社交和成就感。练习在焦虑升起时先安抚自己，而不是立刻向对方求证。" },
          { h: "小提醒", p: "你的感受值得被认真对待。选择愿意回应你、能给你稳定感的伴侣，同时学习用沟通代替试探，让爱少一点消耗。" }
        ]
      },
      "疏离型": {
        title: "疏离型依恋",
        summary: "你习惯保持情感距离，强调独立，不太愿意依赖他人或被他人依赖。",
        blocks: [
          { h: "核心特质", p: "你把独立和自足看得非常重要，习惯靠自己解决问题。亲密会让你感到压力，你更享受「距离产生美」的关系节奏。" },
          { h: "关系表现", p: "你不太主动表露情感，也常常回避深入的情感话题。伴侣可能觉得你「若即若离」，而你其实只是需要自己的空间。" },
          { h: "成长方向", p: "依赖并不等于软弱，健康的关系本就是相互支撑。试着从小事开始练习表达感受和需求，让对方走进你的世界。" },
          { h: "小提醒", p: "你的独立值得欣赏，但完全不需要别人，也可能让爱无法抵达。给亲密一个机会，你会发现被理解的感觉并不危险。" }
        ]
      },
      "恐惧型": {
        title: "恐惧型依恋",
        summary: "你既渴望亲密又害怕受伤，常在靠近与逃离之间摇摆，内心充满矛盾。",
        blocks: [
          { h: "核心特质", p: "你内心深处渴望被爱，但过去的经历让你对亲密既向往又警惕。你害怕靠太近会受伤，又害怕离太远会孤独。" },
          { h: "关系表现", p: "你可能在关系中忽冷忽热：对方靠近时你想逃，对方离开时你又追。这种摇摆不是矫情，而是自我保护的本能。" },
          { h: "成长方向", p: "先和自己和解：你的价值不取决于一段关系是否安全。慢慢练习在安全的关系里暴露脆弱，选择情绪稳定、言行一致的伴侣。" },
          { h: "小提醒", p: "改变需要时间和耐心，不必苛责自己。每一次愿意尝试靠近，都是在改写过去留下的旧剧本。" }
        ]
      }
    }
  }
});
/* ==================== MBTI 人格测试 ==================== */
window.TESTS.push({
  id: "mbti",
  name: "MBTI 人格测试",
  icon: "MB",
  color: "#0071e3",
  description: "从能量来源、信息获取、决策方式、生活态度四个维度探索你的人格类型，共 16 种类型。",
  time: "约 5 分钟",
  scoring: {
    type: "dimension",
    dimensions: [
      { key: "E", label: "外倾 E", max: 15 },
      { key: "I", label: "内倾 I", max: 15 },
      { key: "S", label: "实感 S", max: 15 },
      { key: "N", label: "直觉 N", max: 15 },
      { key: "T", label: "思考 T", max: 15 },
      { key: "F", label: "情感 F", max: 15 },
      { key: "J", label: "判断 J", max: 15 },
      { key: "P", label: "知觉 P", max: 15 }
    ],
    pairs: [["E", "I"], ["S", "N"], ["T", "F"], ["J", "P"]]
  },
  questions: [
    { text: "周末你更想怎么过？", options: [{ label: "和朋友聚会，热闹一整天", value: { E: 1 } }, { label: "在家安静独处，做自己的事", value: { I: 1 } }] },
    { text: "参加完一场热闹的聚会后，你通常感觉？", options: [{ label: "精力充沛，还想继续聊", value: { E: 1 } }, { label: "有点疲惫，想一个人缓缓", value: { I: 1 } }] },
    { text: "遇到难题时，你更倾向于？", options: [{ label: "找个人一起讨论、碰撞想法", value: { E: 1 } }, { label: "自己先独立思考明白", value: { I: 1 } }] },
    { text: "在社交方面，你更接近？", options: [{ label: "朋友多而广，认识很多人", value: { E: 1 } }, { label: "朋友少而深，只交真心好友", value: { I: 1 } }] },
    { text: "你说话的习惯更接近？", options: [{ label: "边说边想，说着说着思路就清晰了", value: { E: 1 } }, { label: "先在脑子里想好，再开口说", value: { I: 1 } }] },
    { text: "在一个全是陌生人的场合，你会？", options: [{ label: "主动去认识新朋友", value: { E: 1 } }, { label: "等别人来搭话，或安静待着", value: { I: 1 } }] },
    { text: "你更喜欢哪种工作方式？", options: [{ label: "团队协作、集体头脑风暴", value: { E: 1 } }, { label: "独立专注地完成自己的部分", value: { I: 1 } }] },
    { text: "长时间一个人待着，你会？", options: [{ label: "觉得闷，渴望与人交流", value: { E: 1 } }, { label: "很享受这种自在的感觉", value: { I: 1 } }] },
    { text: "你回复消息的习惯更接近？", options: [{ label: "秒回，而且话很多", value: { E: 1 } }, { label: "慢慢想怎么回，或者干脆晚点回", value: { I: 1 } }] },
    { text: "学习新东西时，你更喜欢？", options: [{ label: "先找人讨论，边聊边学", value: { E: 1 } }, { label: "自己研究明白后再分享", value: { I: 1 } }] },
    { text: "社交活动结束后，你通常？", options: [{ label: "意犹未尽，马上约下一次", value: { E: 1 } }, { label: "需要独处时间给自己充电", value: { I: 1 } }] },
    { text: "让你当众发言，你会？", options: [{ label: "有点兴奋，觉得能展示自己", value: { E: 1 } }, { label: "紧张，能躲就躲", value: { I: 1 } }] },
    { text: "你的周末计划通常是？", options: [{ label: "安排得满满当当，各种活动", value: { E: 1 } }, { label: "留白休息，最好没有安排", value: { I: 1 } }] },
    { text: "别人对你最常的评价是？", options: [{ label: "开朗、外向、爱聊天", value: { E: 1 } }, { label: "安静、内敛、话不多", value: { I: 1 } }] },
    { text: "遇到烦心事时，你更可能？", options: [{ label: "找人倾诉，说出来就舒服了", value: { E: 1 } }, { label: "自己消化，不想打扰别人", value: { I: 1 } }] },
    { text: "看待事物时，你更关注？", options: [{ label: "具体的事实和细节", value: { S: 1 } }, { label: "背后的可能性和深层含义", value: { N: 1 } }] },
    { text: "做决定时，你更依赖？", options: [{ label: "现实的数据和过往经验", value: { S: 1 } }, { label: "直觉和灵感", value: { N: 1 } }] },
    { text: "读一本书或看一部电影，你更关注？", options: [{ label: "情节、人物和具体事件", value: { S: 1 } }, { label: "它想表达的深层隐喻和主题", value: { N: 1 } }] },
    { text: "向别人描述一件东西时，你会？", options: [{ label: "具体实在，讲清楚是什么样", value: { S: 1 } }, { label: "生动形象，顺便说说联想到什么", value: { N: 1 } }] },
    { text: "你更喜欢哪种生活？", options: [{ label: "按部就班，踏实稳定", value: { S: 1 } }, { label: "充满新可能，不断探索", value: { N: 1 } }] },
    { text: "别人提出一个新想法时，你首先想的是？", options: [{ label: "这想法怎么落地、具体怎么执行", value: { S: 1 } }, { label: "这想法意味着什么、能带来什么", value: { N: 1 } }] },
    { text: "你更相信？", options: [{ label: "亲眼所见、亲身经历的事", value: { S: 1 } }, { label: "自己的直觉和第六感", value: { N: 1 } }] },
    { text: "在工作中，你更擅长？", options: [{ label: "处理具体细节和日常事务", value: { S: 1 } }, { label: "提出新点子、新方向", value: { N: 1 } }] },
    { text: "面对变化，你的第一反应是？", options: [{ label: "谨慎，先评估风险", value: { S: 1 } }, { label: "兴奋，期待新体验", value: { N: 1 } }] },
    { text: "学习操作新工具时，你更喜欢？", options: [{ label: "有明确的步骤说明照着做", value: { S: 1 } }, { label: "直接上手乱试，摸索着来", value: { N: 1 } }] },
    { text: "你更容易记住的是？", options: [{ label: "实际经历过的事情", value: { S: 1 } }, { label: "自己想象和构想过的东西", value: { N: 1 } }] },
    { text: "做规划时，你更关注？", options: [{ label: "当下要做什么、怎么做", value: { S: 1 } }, { label: "长远的目标和愿景", value: { N: 1 } }] },
    { text: "你喜欢的表达方式是？", options: [{ label: "直接了当，不绕弯子", value: { S: 1 } }, { label: "含蓄一点，带点比喻和联想", value: { N: 1 } }] },
    { text: "评价一个人或一件事时，你倾向于？", options: [{ label: "按它本来的样子看", value: { S: 1 } }, { label: "按它可能变成什么样子看", value: { N: 1 } }] },
    { text: "聊天时，你更喜欢聊？", options: [{ label: "实际发生的事、身边的见闻", value: { S: 1 } }, { label: "想法、概念、未来的可能性", value: { N: 1 } }] },
    { text: "做重要决定时，你更依赖？", options: [{ label: "逻辑分析和利弊权衡", value: { T: 1 } }, { label: "内心感受和价值观", value: { F: 1 } }] },
    { text: "朋友向你倾诉烦恼时，你会？", options: [{ label: "先帮他分析问题、给建议", value: { T: 1 } }, { label: "先共情安慰，让他感觉被理解", value: { F: 1 } }] },
    { text: "与人争论时，你更在意？", options: [{ label: "把道理讲清楚，就事论事", value: { T: 1 } }, { label: "不伤和气，顾及对方感受", value: { F: 1 } }] },
    { text: "你认为「公平」比「体贴」更重要？", options: [{ label: "是的，公平是底线", value: { T: 1 } }, { label: "不是，体贴更暖人心", value: { F: 1 } }] },
    { text: "指出别人的问题时，你通常？", options: [{ label: "直接说出问题所在", value: { T: 1 } }, { label: "委婉表达，照顾对方情绪", value: { F: 1 } }] },
    { text: "你更欣赏哪类人？", options: [{ label: "头脑聪明、逻辑清晰的人", value: { T: 1 } }, { label: "心地善良、善解人意的人", value: { F: 1 } }] },
    { text: "选择工作时，你更看重？", options: [{ label: "发展前景和薪资待遇", value: { T: 1 } }, { label: "工作氛围和自己的兴趣", value: { F: 1 } }] },
    { text: "和他人意见不合时，你倾向于？", options: [{ label: "摆事实讲道理说服对方", value: { T: 1 } }, { label: "尝试理解对方的感受和立场", value: { F: 1 } }] },
    { text: "你表达关心更多通过？", options: [{ label: "实际行动，帮对方解决问题", value: { T: 1 } }, { label: "言语和情感上的陪伴", value: { F: 1 } }] },
    { text: "当规则和人情的需求冲突时，你会？", options: [{ label: "按规则来，规则就是规则", value: { T: 1 } }, { label: "看情况照顾人情", value: { F: 1 } }] },
    { text: "评价他人时，你更倾向于？", options: [{ label: "看他的能力和做事结果", value: { T: 1 } }, { label: "看他的为人和给人的感觉", value: { F: 1 } }] },
    { text: "面对矛盾，你希望？", options: [{ label: "把对错说清楚，问题解决", value: { T: 1 } }, { label: "大家和和气气，关系和睦", value: { F: 1 } }] },
    { text: "你认为做决策应该？", options: [{ label: "追求理性上的最优解", value: { T: 1 } }, { label: "听从内心的声音", value: { F: 1 } }] },
    { text: "别人评价你时，更可能说？", options: [{ label: "冷静理性，说话直接", value: { T: 1 } }, { label: "温暖感性，善解人意", value: { F: 1 } }] },
    { text: "你觉得在做决定时，情感因素应该？", options: [{ label: "尽量放在一边，别影响判断", value: { T: 1 } }, { label: "很重要，不能忽视", value: { F: 1 } }] },
    { text: "你的桌面或房间通常是？", options: [{ label: "整洁有序，东西各归其位", value: { J: 1 } }, { label: "乱中有序，自己找得到就行", value: { P: 1 } }] },
    { text: "出门旅行前，你会？", options: [{ label: "做好详细攻略，行程排好", value: { J: 1 } }, { label: "随性出发，到了再说", value: { P: 1 } }] },
    { text: "面对截止日期，你通常？", options: [{ label: "提前规划，早早完成", value: { J: 1 } }, { label: "最后一刻冲刺，灵感爆发", value: { P: 1 } }] },
    { text: "你更喜欢哪种状态？", options: [{ label: "计划明确，知道接下来做什么", value: { J: 1 } }, { label: "灵活应变，随时调整", value: { P: 1 } }] },
    { text: "你的待办清单是？", options: [{ label: "有，而且严格照着执行", value: { J: 1 } }, { label: "心里大概有数，不写也行", value: { P: 1 } }] },
    { text: "原本定好的计划突然变了，你会？", options: [{ label: "有点不安，需要时间适应", value: { J: 1 } }, { label: "欣然接受，随机应变", value: { P: 1 } }] },
    { text: "你更倾向于？", options: [{ label: "做完一件事再做下一件", value: { J: 1 } }, { label: "同时开好几个任务", value: { P: 1 } }] },
    { text: "做选择时，你通常？", options: [{ label: "尽快做决定，定下来安心", value: { J: 1 } }, { label: "尽量保留选择余地，不急着定", value: { P: 1 } }] },
    { text: "你的生活习惯是？", options: [{ label: "规律固定，几点做什么很稳定", value: { J: 1 } }, { label: "随心情变化，今天和明天不一样", value: { P: 1 } }] },
    { text: "开始一个项目时，你？", options: [{ label: "先列详细计划再动手", value: { J: 1 } }, { label: "直接开始，边做边看", value: { P: 1 } }] },
    { text: "你更喜欢？", options: [{ label: "有明确规则和流程的环境", value: { J: 1 } }, { label: "自由发挥、弹性很大的环境", value: { P: 1 } }] },
    { text: "手头有未完成的任务时，你会？", options: [{ label: "心里一直惦记，想尽快收尾", value: { J: 1 } }, { label: "放着就放着，想到再说", value: { P: 1 } }] },
    { text: "时间管理上，你更接近？", options: [{ label: "严格守时，提前到场", value: { J: 1 } }, { label: "大概就好，差不多就行", value: { P: 1 } }] },
    { text: "你更喜欢的生活方式？", options: [{ label: "稳定、可预期、有掌控感", value: { J: 1 } }, { label: "多变、有惊喜、不设限", value: { P: 1 } }] },
    { text: "对「计划赶不上变化」这句话，你的态度是？", options: [{ label: "所以要尽量做计划", value: { J: 1 } }, { label: "变化才有意思", value: { P: 1 } }] }
  ],
  interpretation: {
    dims: {
      E: { name: "外倾 E", high: "你的能量来自外部世界。你喜欢与人互动、在交流中思考，社交和行动让你充满活力。你倾向于先做后想，从外界反馈中学习。发挥建议：在需要深度思考的场景，试着给自己留出独处沉淀的时间。" },
      I: { name: "内倾 I", high: "你的能量来自内心世界。你喜欢深度思考、独处充电，社交对你来说是消耗。你倾向于先想后做，在安静环境中表现最佳。发挥建议：在需要协作和展示的场景，主动走出去一步，你的深度观点很有价值。" },
      S: { name: "实感 S", high: "你偏好具体、实在的信息，关注事实、细节和当下。你务实可靠，擅长把想法落地执行，重视经验和实际操作。发挥建议：偶尔放开对细节的执着，给想象和未来留一点空间。" },
      N: { name: "直觉 N", high: "你偏好抽象、可能性的信息，关注整体模式和未来趋势。你富有想象力，擅长联想和洞察，总能看到事物背后的深意。发挥建议：把灵感落地成具体步骤，才能让好想法真正实现。" },
      T: { name: "思考 T", high: "你做决定时以逻辑和客观标准为依据，追求公平和效率。你擅长分析利弊、直指本质，不容易被情绪左右。发挥建议：在涉及人际的场合，多留意对方的感受，理性之外加点温度。" },
      F: { name: "情感 F", high: "你做决定时以价值观和他人感受为依据，追求和谐与共情。你温暖体贴，善于理解他人，重视关系质量。发挥建议：在重要决策中，也给自己留出理性分析的空间，别让情绪过度主导。" },
      J: { name: "判断 J", high: "你喜欢有计划、有组织的生活，倾向于尽早做决定，享受掌控感和确定性。你自律高效，说到做到。发挥建议：留一些弹性，接受计划外的惊喜，减少对意外的焦虑。" },
      P: { name: "知觉 P", high: "你喜欢灵活、开放的生活，倾向于保持选择余地，享受过程而不是赶着收尾。你适应力强，随机应变。发挥建议：给重要任务设定明确的截止节点，避免最后一刻的匆忙。" }
    },
    types: {
      ISTJ: {
        title: "检查员 · 物流师",
        summary: "务实、严谨、可靠的守护者，以责任感和秩序感著称。",
        blocks: [
          { h: "核心特质", p: "你是沉稳扎实的实干派，重视事实、规则和传统。你做事有条不紊，答应的事一定做到，是团队里让人放心的中流砥柱。" },
          { h: "优势", p: "极强的责任心和执行力，注重细节和质量，决策基于事实而非情绪。你建立的秩序和标准，是身边人依赖的稳定基石。" },
          { h: "潜在盲区", p: "可能过度坚持既定方法，对变化和新思路缺乏耐心；不太擅长表达情感，容易被人误以为冷漠。对自己和他人要求过严时，压力会悄悄累积。" },
          { h: "发展建议", p: "偶尔放下清单和规则，尝试接受不确定性；练习表达关心和欣赏，让身边的人感受到你的温度；学会在过度劳累前主动休息。" }
        ]
      },
      ISFJ: {
        title: "守卫者",
        summary: "温暖、细心、默默奉献的守护者，把照顾他人当作天职。",
        blocks: [
          { h: "核心特质", p: "你细腻体贴，善于察觉别人的需求并默默满足。你重视承诺与忠诚，是家人朋友最可靠的温暖港湾。" },
          { h: "优势", p: "共情力强，观察入微，执行力稳定；你记得住别人的喜好和重要日子，总能用小细节温暖人心。工作踏实，责任感极强。" },
          { h: "潜在盲区", p: "容易过度付出、忽视自己的需求，压抑不满；不太会拒绝别人，可能被利用；对批评敏感，容易把问题归咎于自己。" },
          { h: "发展建议", p: "学会说「不」，把自己的需求放到同等重要的位置；有情绪时试着直接表达，而不是默默消化；偶尔打破常规，给生活加点新鲜感。" }
        ]
      },
      INFJ: {
        title: "提倡者",
        summary: "洞察深刻、理想主义的引路人，追求意义与和谐的统一。",
        blocks: [
          { h: "核心特质", p: "你拥有敏锐的直觉和深刻的共情，能看透事物本质和人心冷暖。你追求理想，渴望让世界变得更好，温和却坚定。" },
          { h: "优势", p: "洞察力极强，能预见他人需求与事态走向；文字和思想表达富有感染力；有原则、有信念，在重要关头展现惊人的勇气与坚持。" },
          { h: "潜在盲区", p: "理想与现实落差容易让你失望和内耗；过度追求完美，难以接受妥协；内心丰富却很难完全敞开，孤独感常在。" },
          { h: "发展建议", p: "把宏大理想拆成小目标逐步推进；接受「足够好」而非「完美」；找到可以深度信任的人，练习分享真实的自己。" }
        ]
      },
      INTJ: {
        title: "建筑师",
        summary: "独立、远见、战略型的头脑，用系统思维改造世界。",
        blocks: [
          { h: "核心特质", p: "你是天生的战略家，擅长把复杂问题拆解成系统方案。你独立自主，重视能力和知识，对平庸和低效缺乏耐心。" },
          { h: "优势", p: "思维深邃、规划长远，执行力与意志力惊人；善于学习和整合知识，总能提出创新的解决方案；在压力下依然保持冷静理性。" },
          { h: "潜在盲区", p: "容易显得高冷疏离，不擅长（也不喜欢）客套寒暄；对他人能力要求过高，可能忽视团队感受；过度相信自己的判断，听不进反对意见。" },
          { h: "发展建议", p: "练习倾听与共情，理解情绪也是决策的重要变量；适时向他人解释你的思路，让团队跟上你的节奏；允许自己和别人犯错。" }
        ]
      },
      ISTP: {
        title: "鉴赏家",
        summary: "冷静、灵活、动手能力超强的实用主义者。",
        blocks: [
          { h: "核心特质", p: "你是天生的问题解决者，冷静理性，喜欢动手探索事物的运作原理。你独立随性，讨厌被规则束缚，擅长在关键时刻临危不乱。" },
          { h: "优势", p: "逻辑清晰、反应敏捷，动手能力极强；在危机中能快速找到最优解；对新鲜事物充满好奇心，学什么都快。" },
          { h: "潜在盲区", p: "容易陷入「三分钟热度」，难以长期坚持；对情感表达和社交细节不上心，可能让亲近的人感到疏远；讨厌规则约束，容易与体制冲突。" },
          { h: "发展建议", p: "为长期目标建立习惯和节奏，别只凭兴趣驱动；在关系中主动表达在乎，哪怕只是简单一句问候；学会在规则中找到自己的空间。" }
        ]
      },
      ISFP: {
        title: "探险家",
        summary: "温柔、敏感、活在当下的艺术家灵魂。",
        blocks: [
          { h: "核心特质", p: "你温和友善，对美和感受有着天然的敏锐。你不喜欢冲突，重视当下的真实体验，用行动而非言语表达关心。" },
          { h: "优势", p: "审美力与共情力俱佳，能在细微处发现美好；灵活随和，适应力强；关键时刻展现出温柔而坚定的力量。" },
          { h: "潜在盲区", p: "回避冲突容易积累委屈；容易低估自己，不敢争取应有的机会；对未来规划不足，可能错失重要节点。" },
          { h: "发展建议", p: "练习直接表达需求和底线；把自己的才华摆到台面上，勇敢展示；给未来留一点规划时间，别只顾眼前。" }
        ]
      },
      INFP: {
        title: "调停者",
        summary: "理想主义、诗意而纯粹的内心世界探索者。",
        blocks: [
          { h: "核心特质", p: "你拥有丰富的内心世界和坚定的价值观，真诚、善良，渴望活出意义。你是安静的理想主义者，用温柔的方式改变世界。" },
          { h: "优势", p: "创造力与想象力出众，文字和艺术表达富有感染力；共情深刻，能理解各种处境的人；忠于内心，有很强的道德勇气。" },
          { h: "潜在盲区", p: "容易理想化他人和事物，失望后陷入自我怀疑；过度内省导致行动拖延；难以面对冲突和批评，习惯独自消化情绪。" },
          { h: "发展建议", p: "学会接受世界的不完美，包括自己；把灵感转化为具体的创作或行动；找到能安放情绪的方式，别让敏感变成内耗。" }
        ]
      },
      INTP: {
        title: "逻辑学家",
        summary: "好奇、深邃、脑洞无边的分析型思想家。",
        blocks: [
          { h: "核心特质", p: "你是天生的理论家，对世界充满好奇，喜欢探究事物背后的原理和逻辑。你独立思考，不盲从权威，享受智力上的挑战。" },
          { h: "优势", p: "分析能力顶尖，能快速抓住问题核心；知识面广，联想丰富，常有独到洞见；对感兴趣的领域能展现惊人的钻研深度。" },
          { h: "潜在盲区", p: "容易陷入过度分析而迟迟不行动；对社交细节和情感表达迟钝，显得疏离；常质疑一切包括自己，优柔寡断。" },
          { h: "发展建议", p: "给思考设置截止时间，用行动验证想法；练习把脑中的理论讲给别人听，锻炼落地能力；重视人际关系的基本功课。" }
        ]
      },
      ESTP: {
        title: "企业家",
        summary: "精力充沛、敢想敢干的行动派冒险家。",
        blocks: [
          { h: "核心特质", p: "你活在当下，行动力爆棚，喜欢刺激和挑战。你机智灵活、善于临场发挥，是天生的实战派和谈判高手。" },
          { h: "优势", p: "反应快、执行力强，能迅速抓住机会；社交能力强，气场十足，容易感染他人；在压力环境中反而越战越勇。" },
          { h: "潜在盲区", p: "容易冲动行事，缺乏长远规划；对规则和约束不耐烦，可能惹麻烦；忽视他人感受，说话直接过头。" },
          { h: "发展建议", p: "重大决定前给自己留 24 小时冷静期；适当考虑后果和长期影响；学会在冲劲之外多一点耐心和共情。" }
        ]
      },
      ESFP: {
        title: "表演者",
        summary: "热情、开朗、天生的气氛制造者。",
        blocks: [
          { h: "核心特质", p: "你热情洋溢、乐观开朗，享受生活也享受被关注。你是人群中的小太阳，总能把欢乐带给身边的人。" },
          { h: "优势", p: "感染力极强，善于活跃气氛；审美和动手能力俱佳，能把生活过得有滋有味；待人真诚大方，朋友遍布。" },
          { h: "潜在盲区", p: "容易被新鲜事物吸引而难以坚持；回避冲突和负面情绪，可能用逃避代替解决；对未来规划不足。" },
          { h: "发展建议", p: "给重要目标设定清晰的时间节点；允许自己面对负面情绪，逃避解决不了问题；理财和长期规划要提上日程。" }
        ]
      },
      ENFP: {
        title: "竞选者",
        summary: "热情、创意无限的追梦者，用感染力点燃他人。",
        blocks: [
          { h: "核心特质", p: "你热情开朗、想象力丰富，对世界充满好奇和善意。你是点子制造机，总能看到别人看不到的可能性。" },
          { h: "优势", p: "创造力与感染力兼备，能鼓舞团队；共情能力强，善于连接不同的人；面对挑战充满热情，适应力极强。" },
          { h: "潜在盲区", p: "兴趣广泛但容易三分钟热度；对细节和重复性工作缺乏耐心；过度乐观可能低估现实困难。" },
          { h: "发展建议", p: "把大梦想拆成可执行的小步骤，坚持闭环；学会管理注意力和时间；在热情之外培养专注与韧性。" }
        ]
      },
      ENTP: {
        title: "辩论家",
        summary: "机智、锋芒毕露的思想开拓者，永远在挑战可能性。",
        blocks: [
          { h: "核心特质", p: "你头脑敏捷、能言善辩，享受观点的碰撞。你天生反骨，喜欢挑战现状，总能从不同角度找到突破口。" },
          { h: "优势", p: "思维灵活、创意不断，是绝佳的头脑风暴伙伴；辩论和说服能力强，能快速抓住逻辑漏洞；适应变化，越挫越勇。" },
          { h: "潜在盲区", p: "好胜心强，容易把讨论变成争执；想法太多而落地太少；对例行公事和细节极度缺乏耐心。" },
          { h: "发展建议", p: "把最看好的想法做成闭环再开新战场；练习倾听和肯定他人，争论之外也有共赢；学会在关键时刻收敛锋芒。" }
        ]
      },
      ESTJ: {
        title: "总经理",
        summary: "果断、高效、天生的组织管理者。",
        blocks: [
          { h: "核心特质", p: "你务实高效、组织力超群，是天生的管理者。你重视秩序和责任，说到做到，是团队运转的发动机。" },
          { h: "优势", p: "决策果断、执行力强；善于制定规则和流程，让团队高效运转；诚实守信，敢于担当，靠得住。" },
          { h: "潜在盲区", p: "容易固执己见，听不进不同意见；对他人要求严格，可能显得强势和缺乏耐心；忽视情感需求，关系容易变硬。" },
          { h: "发展建议", p: "给团队成员更多表达空间，练习倾听；承认「别人的方法也可能更好」；在原则之外，留一点弹性与温度。" }
        ]
      },
      ESFJ: {
        title: "执政官",
        summary: "热心、周到、把身边人照顾得妥妥当当的组织者。",
        blocks: [
          { h: "核心特质", p: "你热情友善、责任心强，是朋友圈和团队里的黏合剂。你记得每个人的需求，乐于张罗和安排，让大家都舒服。" },
          { h: "优势", p: "组织协调能力出色，善于凝聚人心；共情力强，敏感于他人需要；执行力稳定，答应的事一定办妥。" },
          { h: "潜在盲区", p: "过度在意他人评价，容易讨好别人委屈自己；对批评敏感，可能因为害怕冲突而回避问题；容易操心过度。" },
          { h: "发展建议", p: "把自己的感受也列入「待办清单」；学会面对冲突，它不一定是坏事；放下对他人看法的过度在意。" }
        ]
      },
      ENFJ: {
        title: "主人公",
        summary: "魅力十足、富有感召力的领袖型理想主义者。",
        blocks: [
          { h: "核心特质", p: "你热情而有远见，天生具备领导气质。你关注每个人的成长，善于激发他人潜能，把团队带向共同愿景。" },
          { h: "优势", p: "感召力和组织力兼备，能让人心甘情愿追随；共情深刻，洞察他人需求；口才出众，善于沟通和激励。" },
          { h: "潜在盲区", p: "容易过度承担他人问题，把自己耗干；对批评和冲突过度敏感；可能忽视自己的需求，活成别人期待的样子。" },
          { h: "发展建议", p: "记住你也是需要被照顾的人；练习拒绝，不必对所有人负责；接纳不完美，包括自己和他人。" }
        ]
      },
      ENTJ: {
        title: "指挥官",
        summary: "果断、远见、为目标全力以赴的天然领袖。",
        blocks: [
          { h: "核心特质", p: "你目标明确、意志坚定，是天生的战略指挥官。你追求效率和成就，善于把愿景变成可执行的计划。" },
          { h: "优势", p: "领导力出众，决策果断，执行力极强；战略眼光长远，能带领团队突破瓶颈；面对困难毫不退缩。" },
          { h: "潜在盲区", p: "容易强势压制不同意见，让人不敢发言；对慢节奏和低效率缺乏耐心；工作狂倾向，忽视生活与关系。" },
          { h: "发展建议", p: "给团队创造安全发言的空间，好主意不只在你的脑子里；学会欣赏过程中的风景，而不只盯着终点。" }
        ]
      }
    }
  }
});

/* ==================== SCL-90 症状自评量表 ==================== */
var SCL_OPTS = function (dim) {
  return [
    { label: "没有", value: 1, dim: dim },
    { label: "很轻", value: 2, dim: dim },
    { label: "中度", value: 3, dim: dim },
    { label: "偏重", value: 4, dim: dim },
    { label: "严重", value: 5, dim: dim }
  ];
};
window.TESTS.push({
  id: "scl90",
  name: "SCL-90 症状自评量表",
  icon: "S90",
  color: "#af52de",
  description: "90 道题，从躯体化、强迫、抑郁、焦虑等 10 个因子，评估你近一周的心理健康状况。",
  time: "约 10 分钟",
  scoring: {
    type: "type",
    types: {
      SOM: { label: "躯体化" },
      OC: { label: "强迫症状" },
      INT: { label: "人际关系敏感" },
      DEP: { label: "抑郁" },
      ANX: { label: "焦虑" },
      HOS: { label: "敌对" },
      PHOB: { label: "恐怖" },
      PAR: { label: "偏执" },
      PSY: { label: "精神病性" },
      OTH: { label: "其他（睡眠饮食）" }
    },
    maxScore: 65
  },
  questions: [
    { text: "头痛", options: SCL_OPTS("SOM") },
    { text: "头晕或晕倒", options: SCL_OPTS("SOM") },
    { text: "胸痛", options: SCL_OPTS("SOM") },
    { text: "腰痛", options: SCL_OPTS("SOM") },
    { text: "恶心或胃部不舒服", options: SCL_OPTS("SOM") },
    { text: "肌肉酸痛", options: SCL_OPTS("SOM") },
    { text: "呼吸困难", options: SCL_OPTS("SOM") },
    { text: "身体发麻或刺痛", options: SCL_OPTS("SOM") },
    { text: "咽喉有梗塞感", options: SCL_OPTS("SOM") },
    { text: "身体忽冷忽热", options: SCL_OPTS("SOM") },
    { text: "身体某些部位麻木", options: SCL_OPTS("SOM") },
    { text: "感到身体沉重", options: SCL_OPTS("SOM") },
    { text: "头脑中有不必要的想法或字句盘旋", options: SCL_OPTS("OC") },
    { text: "忘性大", options: SCL_OPTS("OC") },
    { text: "担心自己的衣饰整齐及仪态端正", options: SCL_OPTS("OC") },
    { text: "做事必须反复检查", options: SCL_OPTS("OC") },
    { text: "难以做出决定", options: SCL_OPTS("OC") },
    { text: "脑子变空了", options: SCL_OPTS("OC") },
    { text: "难以集中注意力", options: SCL_OPTS("OC") },
    { text: "必须反复洗手、点数目或触摸某些东西", options: SCL_OPTS("OC") },
    { text: "感到有些事情必须做，否则会不安", options: SCL_OPTS("OC") },
    { text: "做事必须做得很慢以保证做得正确", options: SCL_OPTS("OC") },
    { text: "对旁人责备求全", options: SCL_OPTS("INT") },
    { text: "感到比不上他人", options: SCL_OPTS("INT") },
    { text: "对别人不信任", options: SCL_OPTS("INT") },
    { text: "感到别人不理解自己、不同情自己", options: SCL_OPTS("INT") },
    { text: "觉得别人对自己有敌意", options: SCL_OPTS("INT") },
    { text: "感到别人想占自己的便宜", options: SCL_OPTS("INT") },
    { text: "当别人看着自己或谈论自己时感到不自在", options: SCL_OPTS("INT") },
    { text: "在人多的地方感到不自在", options: SCL_OPTS("INT") },
    { text: "感到熟悉的东西变得陌生或不像是真的", options: SCL_OPTS("INT") },
    { text: "对异性的兴趣减退", options: SCL_OPTS("DEP") },
    { text: "感到自己的精力下降，活动减慢", options: SCL_OPTS("DEP") },
    { text: "想结束自己的生命", options: SCL_OPTS("DEP") },
    { text: "感到大多数人都不可信任", options: SCL_OPTS("DEP") },
    { text: "感到受骗、中了圈套或有人想抓住自己", options: SCL_OPTS("DEP") },
    { text: "经常责怪自己", options: SCL_OPTS("DEP") },
    { text: "感到孤独", options: SCL_OPTS("DEP") },
    { text: "感到苦闷", options: SCL_OPTS("DEP") },
    { text: "过分担忧", options: SCL_OPTS("DEP") },
    { text: "对事物不感兴趣", options: SCL_OPTS("DEP") },
    { text: "感到前途没有希望", options: SCL_OPTS("DEP") },
    { text: "感到任何事情都很困难", options: SCL_OPTS("DEP") },
    { text: "觉得自己是一个没有价值的人", options: SCL_OPTS("DEP") },
    { text: "神经过敏，心中不踏实", options: SCL_OPTS("ANX") },
    { text: "发抖", options: SCL_OPTS("ANX") },
    { text: "无缘无故地突然感到害怕", options: SCL_OPTS("ANX") },
    { text: "心跳得很厉害", options: SCL_OPTS("ANX") },
    { text: "感到紧张或容易紧张", options: SCL_OPTS("ANX") },
    { text: "一阵阵恐惧或惊恐", options: SCL_OPTS("ANX") },
    { text: "感到坐立不安、心神不宁", options: SCL_OPTS("ANX") },
    { text: "感到要很快把事情做完", options: SCL_OPTS("ANX") },
    { text: "在公共场合吃东西感到很不舒服", options: SCL_OPTS("ANX") },
    { text: "无缘无故地感到担心", options: SCL_OPTS("ANX") },
    { text: "容易烦恼和激动", options: SCL_OPTS("HOS") },
    { text: "自己不能控制地大发脾气", options: SCL_OPTS("HOS") },
    { text: "有想打人或伤害他人的冲动", options: SCL_OPTS("HOS") },
    { text: "有想摔坏或破坏东西的冲动", options: SCL_OPTS("HOS") },
    { text: "经常与人争论", options: SCL_OPTS("HOS") },
    { text: "大叫或摔东西", options: SCL_OPTS("HOS") },
    { text: "怕空旷的场所或街道", options: SCL_OPTS("PHOB") },
    { text: "怕单独出门", options: SCL_OPTS("PHOB") },
    { text: "怕乘电车、公共汽车、地铁或火车", options: SCL_OPTS("PHOB") },
    { text: "因为感到害怕而避开某些东西、场合或活动", options: SCL_OPTS("PHOB") },
    { text: "单独一人时神经很紧张", options: SCL_OPTS("PHOB") },
    { text: "害怕会在公共场合昏倒", options: SCL_OPTS("PHOB") },
    { text: "怕乘飞机、火车或汽车旅行", options: SCL_OPTS("PHOB") },
    { text: "认为别人和自己过不去", options: SCL_OPTS("PAR") },
    { text: "感到人们对我不友好、不喜欢我", options: SCL_OPTS("PAR") },
    { text: "感到别人控制自己的思想", options: SCL_OPTS("PAR") },
    { text: "有一些别人没有的想法或念头", options: SCL_OPTS("PAR") },
    { text: "感到自己受到监视或议论", options: SCL_OPTS("PAR") },
    { text: "认为别人想伤害自己", options: SCL_OPTS("PAR") },
    { text: "感到自己的脑子有毛病", options: SCL_OPTS("PSY") },
    { text: "听到旁人听不到的声音", options: SCL_OPTS("PSY") },
    { text: "感到别人能知道自己的私下想法", options: SCL_OPTS("PSY") },
    { text: "感到自己的身体有严重问题", options: SCL_OPTS("PSY") },
    { text: "感到没有亲人和朋友可依靠", options: SCL_OPTS("PSY") },
    { text: "感到自己有罪", options: SCL_OPTS("PSY") },
    { text: "感到自己好像要发疯", options: SCL_OPTS("PSY") },
    { text: "感到自己必须做某些事情才能安宁", options: SCL_OPTS("PSY") },
    { text: "有不同于常人的体验", options: SCL_OPTS("PSY") },
    { text: "感到自己对别人没有吸引力", options: SCL_OPTS("PSY") },
    { text: "胃口不好", options: SCL_OPTS("OTH") },
    { text: "入睡困难", options: SCL_OPTS("OTH") },
    { text: "睡眠不深或容易惊醒", options: SCL_OPTS("OTH") },
    { text: "做噩梦", options: SCL_OPTS("OTH") },
    { text: "早醒", options: SCL_OPTS("OTH") },
    { text: "想到死亡的事", options: SCL_OPTS("OTH") },
    { text: "吃得不香或吃得过多", options: SCL_OPTS("OTH") }
  ],
  interpretation: {
    special: function (record) {
      var s = record.raw.typeScores || {};
      var defs = {
        SOM: { n: 12, name: "躯体化", desc: "反映主观的身体不适感，包括心血管、胃肠道、呼吸等系统的不适。心理压力常以身体症状的形式呈现。" },
        OC: { n: 10, name: "强迫症状", desc: "反映明知没有必要却又无法摆脱的想法、冲动和行为，如反复检查、难以集中注意。" },
        INT: { n: 9, name: "人际关系敏感", desc: "反映人际交往中的不自在、自卑感与负性期待，特别是在与他人比较时的沮丧体验。" },
        DEP: { n: 13, name: "抑郁", desc: "反映与临床抑郁症状群相关的体验：情绪低落、兴趣减退、缺乏动力、自我贬低。" },
        ANX: { n: 10, name: "焦虑", desc: "反映紧张、神经过敏、担忧以及惊恐发作等体验。" },
        HOS: { n: 6, name: "敌对", desc: "反映厌烦、争论、不可抑制的冲动爆发及破坏性想法。" },
        PHOB: { n: 7, name: "恐怖", desc: "反映对广场、人群、公共交通、独自外出等情境的恐惧与回避。" },
        PAR: { n: 6, name: "偏执", desc: "反映猜疑、不信任、投射性思维、被迫害感等偏执性体验。" },
        PSY: { n: 10, name: "精神病性", desc: "反映精神分裂样症状：幻觉、思维播散、被控制感等，也包含孤僻与疏离。" },
        OTH: { n: 7, name: "其他（睡眠饮食）", desc: "反映睡眠、饮食等生理功能状况，作为辅助观察指标。" }
      };
      var blocks = [];
      var totalScore = 0, totalItems = 0, positiveFactors = [];
      Object.keys(defs).forEach(function (k) {
        var avg = (s[k] || 0) / defs[k].n;
        totalScore += (s[k] || 0);
        totalItems += defs[k].n;
        if (avg >= 2) positiveFactors.push(defs[k].name + "（" + avg.toFixed(1) + "）");
      });
      var totalAvg = totalItems ? totalScore / totalItems : 0;
      var status = totalAvg < 1.5 ? "整体状态良好" : totalAvg < 2 ? "存在轻度心理困扰" : totalAvg < 2.5 ? "存在中度心理困扰" : "心理困扰较明显";
      blocks.push({
        h: "总体评估",
        p: "总均分 " + totalAvg.toFixed(2) + " / 5，整体判断：" + status + "。" + (positiveFactors.length ? " 需关注的因子：" + positiveFactors.join("、") + "。" : " 各因子均处于正常范围，近一周状态不错。")
      });
      var detail = [];
      Object.keys(defs).forEach(function (k) {
        var avg = (s[k] || 0) / defs[k].n;
        var st = avg < 1.5 ? "正常" : avg < 2 ? "轻度" : avg < 2.5 ? "中度" : "明显";
        detail.push(defs[k].name + " " + avg.toFixed(1) + "/5 · " + st);
      });
      blocks.push({ h: "因子得分一览", p: detail.join("<br>") });
      Object.keys(defs).forEach(function (k) {
        var avg = (s[k] || 0) / defs[k].n;
        if (avg >= 2) {
          blocks.push({ h: defs[k].name + "（" + avg.toFixed(1) + "/5）· 解读", p: defs[k].desc + " 建议：如该困扰持续存在且影响生活，可先与信任的人聊聊，必要时寻求专业心理支持。" });
        }
      });
      blocks.push({ h: "温馨提示", p: "本量表结果仅作自我了解与健康筛查参考，不构成医学诊断。如有明显困扰，请及时寻求专业心理医生或咨询师的帮助。" });
      return blocks;
    }
  }
});
