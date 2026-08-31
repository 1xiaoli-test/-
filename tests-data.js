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

/* ==================== 测试分组配置（首页折叠菜单） ====================
 * 在此维护分组，首页会按顺序渲染为可折叠菜单。
 * 字段说明：
 *   id        唯一标识
 *   name      分组名（显示在标题）
 *   icon      标题前的 emoji/图标
 *   testIds   该分组包含的测试 id 数组（顺序即展示顺序）
 *   open      初始是否展开（默认 false）
 *
 * 一个测试可同时属于多个分组（如既在「热门」又在「人格测试」）。
 * 未被任何分组引用的测试会自动归入末尾的「其他」分组。
 * 添加新分类：复制一个对象，填好字段即可，无需改引擎代码。
 */
/* ==================== MMPI-2 明尼苏达多相人格测验 ==================== */
window.TESTS.push({
  id: "mmpi2",
  name: "MMPI-2 明尼苏达多相人格测验",
  icon: "M2",
  color: "#5856d6",
  description: "临床心理学经典人格测验，567 题，涵盖效度、临床、内容、RC、PSY-5 等 147 个量表，计分严格对标使用手册。",
  time: "约 45-90 分钟",
  needGender: true,
  scoring: {
    type: "mmpi2"
  },
  questions: (function () {
    var qs = [];
    if (typeof MMPI2_DATA !== "undefined" && MMPI2_DATA.questions) {
      qs = MMPI2_DATA.questions.map(function (q) {
        return {
          no: q.no,
          text: q.zh,
          options: [
            { label: "是", value: "T" },
            { label: "否", value: "F" },
            { label: "无法回答", value: "X" }
          ]
        };
      });
    }
    return qs;
  })(),
  interpretation: {}
});

/* ==================== PDP 性格测试 ==================== */
window.TESTS.push((function () {
  function opts(dim) {
    function v(n) { var o = {}; o[dim] = n; return o; }
    return [
      { label: "非常同意", value: v(5) },
      { label: "比较同意", value: v(4) },
      { label: "差不多", value: v(3) },
      { label: "勉强同意", value: v(2) },
      { label: "不同意", value: v(1) }
    ];
  }
  return {
    id: "pdp",
    name: "PDP 性格测试",
    icon: "PD",
    color: "#ff9500",
    description: "PDP（Professional Dyna-Metric Programs）行为特质动态衡量系统，根据天生特质将人群分为老虎、孔雀、考拉、猫头鹰、变色龙五种类型，常用于人才管理、招聘与团队建设。",
    time: "约 5 分钟",
    scoring: {
      type: "dimension",
      dimensions: [
        { key: "TIGER", label: "老虎型（支配型）", max: 30 },
        { key: "PEACOCK", label: "孔雀型（表达型）", max: 30 },
        { key: "KOALA", label: "考拉型（耐心型）", max: 30 },
        { key: "OWL", label: "猫头鹰型（精确型）", max: 30 },
        { key: "CHAMELEON", label: "变色龙型（整合型）", max: 30 }
      ],
      classify: function (s) {
        var names = { TIGER: "老虎型", PEACOCK: "孔雀型", KOALA: "考拉型", OWL: "猫头鹰型", CHAMELEON: "变色龙型" };
        var keys = ["TIGER", "PEACOCK", "KOALA", "OWL", "CHAMELEON"];
        var sorted = keys.map(function (k) { return { k: k, v: s[k] || 0 }; })
          .sort(function (a, b) { return b.v - a.v; });
        var top = sorted[0], second = sorted[1], last = sorted[4];
        var gap12 = top.v - second.v;
        var gapRange = top.v - last.v;
        var type, typeName, summary;
        if (gap12 >= 6) {
          type = names[top.k];
          typeName = type;
          summary = "你的「" + type + "」特质显著突出，远高于其它四项，属于典型的该属性。";
        } else if (gapRange >= 8) {
          type = names[top.k] + "+" + names[second.k];
          typeName = names[top.k] + " + " + names[second.k];
          summary = "你的「" + names[top.k] + "」与「" + names[second.k] + "」两项分数大大超过其它三项，属于这两种动物的综合。";
        } else {
          type = "均衡型";
          typeName = "均衡型（面面俱到）";
          summary = "你的各项特质分数都比较接近，属于面面俱到的近似完美性格，能灵活适应不同环境与角色。";
        }
        return { type: type, typeName: typeName, summary: summary };
      }
    },
    questions: [
      { text: "你做事是一个值得信赖的人吗？", options: opts("OWL") },
      { text: "你个性温和吗？", options: opts("KOALA") },
      { text: "你有活力吗？", options: opts("PEACOCK") },
      { text: "你善解人意吗？", options: opts("CHAMELEON") },
      { text: "你独立吗？", options: opts("TIGER") },
      { text: "你受人爱戴吗？", options: opts("PEACOCK") },
      { text: "做事认真且正直吗？", options: opts("OWL") },
      { text: "你富有同情心吗？", options: opts("KOALA") },
      { text: "你有说服力吗？", options: opts("CHAMELEON") },
      { text: "你大胆吗？", options: opts("TIGER") },
      { text: "你精确吗？", options: opts("OWL") },
      { text: "你适应能力强吗？", options: opts("CHAMELEON") },
      { text: "你组织能力好吗？", options: opts("PEACOCK") },
      { text: "你是否积极主动？", options: opts("TIGER") },
      { text: "你害羞吗？", options: opts("KOALA") },
      { text: "你强势吗？", options: opts("OWL") },
      { text: "你镇定吗？", options: opts("KOALA") },
      { text: "你勇于学习吗？", options: opts("TIGER") },
      { text: "你反应快吗？", options: opts("CHAMELEON") },
      { text: "你外向吗？", options: opts("PEACOCK") },
      { text: "你注意细节吗？", options: opts("OWL") },
      { text: "你爱说话吗？", options: opts("PEACOCK") },
      { text: "你的协调能力好吗？", options: opts("CHAMELEON") },
      { text: "你勤劳吗？", options: opts("TIGER") },
      { text: "你慷慨吗？", options: opts("KOALA") },
      { text: "你小心翼翼吗？", options: opts("OWL") },
      { text: "你令人愉快吗？", options: opts("CHAMELEON") },
      { text: "你传统吗？", options: opts("KOALA") },
      { text: "你亲切吗？", options: opts("PEACOCK") },
      { text: "你工作足够有效率吗？", options: opts("TIGER") }
    ],
    interpretation: {
      types: {
        "老虎型": {
          title: "老虎型（支配型 Dominance）",
          summary: "有自信、够权威、决断力高、竞争性强，胸怀大志，喜欢评估与冒险，是天生的开拓者与改革者。",
          blocks: [
            { h: "核心特质", p: "有自信，够权威，决断力高，竞争性强，胸怀大志，喜欢评估。企图心强烈，喜欢冒险，个性积极，竞争力强，有对抗性。" },
            { h: "优点", p: "善于控制局面并能果断地作出决定；用这一类型工作方式的人成就非凡。" },
            { h: "缺点", p: "感到压力时会过于重视迅速完成工作而忽视细节，可能不顾自己和别人的情感；要求过高加之好胜天性，有时会成为工作狂。决策上较易流于专断、不易妥协，较容易与人发生争执摩擦。" },
            { h: "工作风格", p: "交谈时进行直接的目光接触；有目的性且能迅速行动；说话快速且具有说服力；运用直截了当的实际性语言；办公室挂有日历、计划要点。" },
            { h: "适合岗位", p: "开创性与改革性的工作，在开拓市场的时代或需要执行改革的环境中，最容易有出色的表现。" },
            { h: "相处之道", p: "下属中有「老虎」要给予他更多的责任，他会觉得自己有价值，布置工作时注意结果导向；上司是老虎则要在他面前展示自信果断的一面，同时避免在公众场合与他唱反调。" },
            { h: "代表人物", p: "毛泽东、撒切尔夫人、朱镕基、韦尔奇" }
          ]
        },
        "孔雀型": {
          title: "孔雀型（表达型 Extroversion）",
          summary: "热心乐观、口才流畅、好交朋友、风度翩翩，热情洋溢且表现欲强，很适合需要当众表现与人际互动的工作。",
          blocks: [
            { h: "核心特质", p: "很热心，够乐观，口才流畅，好交朋友，风度翩翩，诚恳热心。热情洋溢、好交朋友、口才流畅、个性乐观、表现欲强。" },
            { h: "优点", p: "生性活泼，能够使人兴奋，高效地工作，善于建立同盟或搞好关系来实现目标。很适合需要当众表现、引人注目、态度公开的工作。" },
            { h: "缺点", p: "因其跳跃性的思考模式，常无法顾及细节以及对事情的完成执着度。" },
            { h: "工作风格", p: "运用快速的手势；面部表情特别丰富；运用有说服力的语言；工作空间里充满了各种能鼓舞人心的东西。" },
            { h: "适合岗位", p: "人际导向的工作；推动新思维、执行新使命或推广宣传的任务；开发市场或创建产业的工作环境。" },
            { h: "相处之道", p: "以鼓励为主，给他表现机会保持工作激情，但也要注意他的情绪化和防止细节失误。老虎型领导人配孔雀型二把手是最佳搭配。" },
            { h: "代表人物", p: "孙中山、克林顿、里根、戈尔巴乔夫" }
          ]
        },
        "考拉型": {
          title: "考拉型（耐心型 Pace/Patience）",
          summary: "稳定敦厚、温和规律、不好冲突，行事稳健且有过人耐力，善于在集体环境中营造和谐。",
          blocks: [
            { h: "核心特质", p: "很稳定，够敦厚，温和规律，不好冲突。行事稳健、强调平实，有过人的耐力，温和善良。" },
            { h: "优点", p: "对别人的感情很敏感，使他们在集体环境中左右逢源。" },
            { h: "缺点", p: "很难坚持自己的观点和迅速做出决定；不喜欢面对与同事意见不和的局面，不愿处理争执。" },
            { h: "工作风格", p: "面部表情和蔼可亲；说话慢条斯理、声音轻柔；用赞同型、鼓励性的语言；办公室里摆有家人的照片。" },
            { h: "适合岗位", p: "安定内部的管理工作，在需要专业精密技巧的领域，或在气氛和谐且不具赶迫时间表的职场环境中最能发挥所长。企业产品稳踞市场时，考拉型领导人是极佳的总舵手。" },
            { h: "相处之道", p: "对考拉要多给予关注和温柔，想方设法挖掘他们内在的潜力。老虎型当一哥配考拉型二把手也是好搭配。" },
            { h: "代表人物", p: "甘地、蒋经国、宋庆龄" }
          ]
        },
        "猫头鹰型": {
          title: "猫头鹰型（精确型 Precision/Conformity）",
          summary: "传统严谨、注重细节、条理分明、责任感强，分析力强且精准度高，擅长把细节条例化。",
          blocks: [
            { h: "核心特质", p: "很传统，注重细节，条理分明，责任感强，重视纪律。保守、分析力强，精准度高，喜欢把细节条例化，个性拘谨含蓄。" },
            { h: "优点", p: "天生就有爱找出事情真相的习性，有耐心仔细考察所有细节并想出合乎逻辑的解决办法。" },
            { h: "缺点", p: "把事实和精确度置于感情之前，会被认为是感情冷漠。在压力下，有时为了避免做出结论会分析过度。" },
            { h: "工作风格", p: "很少有面部表情；动作缓慢；使用精确的语言、注意特殊细节；办公室里挂有图表、统计数字等。" },
            { h: "适合岗位", p: "架构稳定和制度健全的组织最适合用猫头鹰型当各级领导人；财务、审计、技术、事务机构等讲究制度化、事事求依据的工作。不宜担任需要创建或创新能力的任务。" },
            { h: "相处之道", p: "尊重其重规则轻情感的风格，注意其容易吹毛求疵、不易维持团队凝聚力的倾向。" },
            { h: "代表人物", p: "包拯（包青天）" }
          ]
        },
        "变色龙型": {
          title: "变色龙型（整合型 Conformity）",
          summary: "中庸而不极端、凡事不执着、韧性极强、擅于沟通，是天生的谈判家，能充分融入各种新环境新文化。",
          blocks: [
            { h: "核心特质", p: "中庸而不极端，凡事不执着，韧性极强，擅于沟通，是天生的谈判家，能充分融入各种新环境新文化且适应性良好。" },
            { h: "优点", p: "善于在工作中调整自己的角色去适应环境，具有很好的沟通能力；处事圆融，弹性极强，处处留有余地，是办事让人放心的人物。" },
            { h: "缺点", p: "在他人眼中会觉得他们「没有个性」，较无原则；由于以善变为专长，做人不会有什么立场或原则。" },
            { h: "工作风格", p: "综合老虎、孔雀、考拉、猫头鹰的特质，看似没有凸出个性，但擅长整合内外资源；没有强烈的个人意识形态。" },
            { h: "适合岗位", p: "对内对外的各种交涉，冲突环境中游走折中，只要任务确实、目标清楚，都能恰如其分地完成。" },
            { h: "相处之道", p: "善于变色、适应环境，适合需要弹性协调的岗位。" },
            { h: "代表人物", p: "擅长整合沟通的协调型人才" }
          ]
        },
        "均衡型": {
          title: "均衡型（面面俱到）",
          summary: "各项特质分数都比较接近，属于面面俱到的近似完美性格，能灵活适应不同环境与角色。",
          blocks: [
            { h: "核心特质", p: "你的各项动物特质分数都比较接近，没有明显的短板或极端倾向，属于面面俱到的近似完美性格。" },
            { h: "优势", p: "你在不同行为模式之间切换自如：该果断时能果断，该耐心时能耐心，适应力极强，几乎可以在任何团队中扮演合适的角色。" },
            { h: "小提示", p: "面面俱到也意味着缺乏突出的主导风格。建议结合具体场景，刻意培养一到两种核心特质作为你的「主标签」，让优势更易被识别与发挥。" }
          ]
        }
      },
      special: function (record) {
        var type = record.type || "";
        if (type.indexOf("+") < 0) return null;
        var parts = type.split("+");
        var self = this;
        var out = [];
        parts.forEach(function (p) {
          var def = self.types[p];
          if (!def || !def.blocks) return;
          out.push({ h: p + " · 核心特质", p: def.blocks[0].p });
          out.push({ h: p + " · 适合岗位", p: def.blocks[4].p });
        });
        out.push({ h: "混合型提示", p: "你的特质兼具「" + parts.join("」与「") + "」两种动物的特点。这类组合型性格的优势在于场景适应性强：既能发挥" + parts[0] + "的主导力，又能借助" + parts[1] + "的辅助特质补充盲区。建议在职业与团队中主动寻找能同时发挥两种特质的角色。" });
        return out;
      }
    }
  };
})());

/* ==================== 霍兰德职业兴趣测试 ==================== */
window.TESTS.push((function () {
  function ho(dim) {
    function v(n) { var o = {}; o[dim] = n; return o; }
    return [
      { label: "喜欢", value: v(1) },
      { label: "不喜欢", value: v(0) }
    ];
  }
  return {
    id: "holland",
    name: "霍兰德职业兴趣测试",
    icon: "HO",
    color: "#34c759",
    description: "Holland RIASEC 职业兴趣理论，将人格与职业环境分为现实、研究、艺术、社会、企业、常规六大类型，取前三高分生成三码兴趣代码，帮你找到匹配的职业方向。",
    time: "约 8 分钟",
    scoring: {
      type: "dimension",
      dimensions: [
        { key: "R", label: "现实型 R", max: 10 },
        { key: "I", label: "研究型 I", max: 10 },
        { key: "A", label: "艺术型 A", max: 10 },
        { key: "S", label: "社会型 S", max: 10 },
        { key: "E", label: "企业型 E", max: 10 },
        { key: "C", label: "常规型 C", max: 10 }
      ],
      classify: function (s) {
        var keys = ["R", "I", "A", "S", "E", "C"];
        var sorted = keys.map(function (k) { return { k: k, v: s[k] || 0 }; })
          .sort(function (a, b) { return b.v - a.v; });
        var code = sorted[0].k + sorted[1].k + sorted[2].k;
        var names = { R: "现实型", I: "研究型", A: "艺术型", S: "社会型", E: "企业型", C: "常规型" };
        return {
          type: code,
          typeName: "霍兰德代码 " + code,
          summary: "你的前三高兴趣类型依次为" + names[sorted[0].k] + "（" + sorted[0].k + "）、" + names[sorted[1].k] + "（" + sorted[1].k + "）、" + names[sorted[2].k] + "（" + sorted[2].k + "），组合成三码兴趣代码 " + code + "。"
        };
      }
    },
    questions: [
      { text: "修理电器用品或机械装置", options: ho("R") },
      { text: "组装模型、做木工或手工艺", options: ho("R") },
      { text: "从事需要体力的户外活动", options: ho("R") },
      { text: "操作机器或驾驶设备", options: ho("R") },
      { text: "种植花草、照料动物", options: ho("R") },
      { text: "自己动手修理家里的东西", options: ho("R") },
      { text: "操控无人机、遥控车等设备", options: ho("R") },
      { text: "烹饪或烘焙", options: ho("R") },
      { text: "参加运动或户外探险", options: ho("R") },
      { text: "拆解物品了解其内部构造", options: ho("R") },
      { text: "阅读科学类文章或书籍", options: ho("I") },
      { text: "做科学实验或研究", options: ho("I") },
      { text: "分析数据、做统计报表", options: ho("I") },
      { text: "解决数学或逻辑难题", options: ho("I") },
      { text: "探究事物的原理和成因", options: ho("I") },
      { text: "观察自然现象并做记录", options: ho("I") },
      { text: "用电脑编写程序解决问题", options: ho("I") },
      { text: "研究人体结构或医学知识", options: ho("I") },
      { text: "钻研科学理论或前沿技术", options: ho("I") },
      { text: "花时间查资料寻找问题的答案", options: ho("I") },
      { text: "画画、素描或从事美术创作", options: ho("A") },
      { text: "演奏乐器或唱歌", options: ho("A") },
      { text: "写故事、诗歌或文章", options: ho("A") },
      { text: "设计海报、排版或美化页面", options: ho("A") },
      { text: "参观艺术展览或看表演", options: ho("A") },
      { text: "拍照、录影并后期处理", options: ho("A") },
      { text: "参与戏剧表演或舞蹈", options: ho("A") },
      { text: "按自己的创意打扮或布置空间", options: ho("A") },
      { text: "尝试各种创意表达方式", options: ho("A") },
      { text: "探索新的艺术形式或媒材", options: ho("A") },
      { text: "教导或指导他人学习", options: ho("S") },
      { text: "倾听朋友的烦恼并给出建议", options: ho("S") },
      { text: "参加志愿服务或社区活动", options: ho("S") },
      { text: "照顾小孩、老人或病人", options: ho("S") },
      { text: "与他人合作完成一项任务", options: ho("S") },
      { text: "帮助调解人与人之间的冲突", options: ho("S") },
      { text: "规划并主持团体活动", options: ho("S") },
      { text: "在别人需要时伸出援手", options: ho("S") },
      { text: "与别人分享自己的知识和经验", options: ho("S") },
      { text: "花时间了解别人的感受和需求", options: ho("S") },
      { text: "说服别人接受你的观点", options: ho("E") },
      { text: "带领团队完成一个项目", options: ho("E") },
      { text: "参加辩论或公开发表演讲", options: ho("E") },
      { text: "创业或经营自己的生意", options: ho("E") },
      { text: "推销产品或向客户介绍服务", options: ho("E") },
      { text: "策划营销活动或推广方案", options: ho("E") },
      { text: "参与竞争并争取获胜", options: ho("E") },
      { text: "做决定并愿意为此承担责任", options: ho("E") },
      { text: "谈判或协商争取更好条件", options: ho("E") },
      { text: "设定目标并带领他人一起达成", options: ho("E") },
      { text: "整理、建档、归类文件资料", options: ho("C") },
      { text: "用表格工具管理数据", options: ho("C") },
      { text: "按照标准流程完成工作", options: ho("C") },
      { text: "核对数字或文件是否准确", options: ho("C") },
      { text: "记账或处理财务事务", options: ho("C") },
      { text: "把桌面和环境整理得井井有条", options: ho("C") },
      { text: "按照规范和指示行事", options: ho("C") },
      { text: "处理行政文书或报表", options: ho("C") },
      { text: "制作清单或检核表", options: ho("C") },
      { text: "校对文档或检查细节", options: ho("C") }
    ],
    interpretation: {
      dims: {
        R: { name: "现实型 R", high: "喜欢与具体事物打交道（工具、机器、动植物、户外），务实坦率，看重看得见摸得着的工作成果。适合机械、工程、农林、军事、体育等动手实干类职业。" },
        I: { name: "研究型 I", high: "对探索未知充满热情，喜欢观察、分析、推理，享受解决复杂问题的过程。适合科研、医学、数据分析、算法研发等深度思考类职业。" },
        A: { name: "艺术型 A", high: "追求自由表达与创造，对美有天然敏感度，不喜欢循规蹈矩。适合设计、写作、影视、音乐、表演等创意表达类职业。" },
        S: { name: "社会型 S", high: "关注他人需求与感受，善于沟通、富有同理心。适合教育、咨询、医疗护理、人力资源、公益等助人类职业。" },
        E: { name: "企业型 E", high: "追求影响力与成就感，精力充沛、善于说服与带领团队。适合管理、销售、创业、法律、公关等领导决策类职业。" },
        C: { name: "常规型 C", high: "重视秩序规范与精确，擅长处理数据和细节，在结构化环境中表现出色。适合会计、审计、行政、金融、档案等精确执行类职业。" }
      },
      special: function (record) {
        var code = record.type || "";
        if (code.length !== 3) return null;
        var names = { R: "现实型", I: "研究型", A: "艺术型", S: "社会型", E: "企业型", C: "常规型" };
        var desc = { R: "动手实干派", I: "深度思考者", A: "创意表达者", S: "助人为乐者", E: "领导决策者", C: "精确执行者" };
        var adjMap = { R: ["I", "C"], I: ["R", "A"], A: ["I", "S"], S: ["A", "E"], E: ["S", "C"], C: ["E", "R"] };
        var diagMap = { R: ["S"], I: ["E"], A: ["C"], S: ["R"], E: ["I"], C: ["A"] };
        var first = code.charAt(0), second = code.charAt(1);
        var adj = adjMap[first].indexOf(second) >= 0;
        var diag = diagMap[first].indexOf(second) >= 0;
        var note = "你的兴趣代码是 <strong>" + code + "</strong>：第一码 <strong>" + first + " " + names[first] + "（" + desc[first] + "）</strong> 权重最高，是主导兴趣；" + second + " " + names[second] + " 次之；" + code.charAt(2) + " " + names[code.charAt(2)] + " 为辅助兴趣。";
        if (adj) note += "前两码为相邻类型（" + first + "-" + second + "），说明你的兴趣组合较为协调，容易找到兼容两种特质的职业。";
        else if (diag) note += "前两码为对角类型（" + first + "-" + second + "），说明你的兴趣较为多元，可能同时追求差异较大的价值，需要找到能兼顾两者的职业。";
        else note += "前两码（" + first + "-" + second + "）既不相邻也不对角，兴趣组合存在一定张力，建议在职业探索中明确最看重的方向。";
        var out = [];
        out.push({ h: "兴趣代码总览", p: note });
        out.push({ h: "择业建议", p: "结合三码顺序，优先寻找能发挥第一码" + names[first] + "特质的职业环境，再用第二、三码的兴趣补充和发展。兴趣类型没有好坏之分，关键是找到与你兴趣结构匹配的环境。" });
        return out;
      }
    }
  };
})());

/* ==================== 8 个心理健康量表（PHQ-9/GAD-7/ISI/SAD/SDS/SAS/Y-BOCS/YMRS） ==================== */
(function () {
  function opts4(a, b, c, d) { return [{ label: a, value: 0 }, { label: b, value: 1 }, { label: c, value: 2 }, { label: d, value: 3 }]; }
  function opts5(a, b, c, d, e) { return [{ label: a, value: 0 }, { label: b, value: 1 }, { label: c, value: 2 }, { label: d, value: 3 }, { label: e, value: 4 }]; }
  function yn() { return [{ label: "是", value: 1 }, { label: "否", value: 0 }]; }
  function lk4(second) { return [{ label: "没有或很少时间", value: 1 }, { label: second, value: 2 }, { label: "相当多时间", value: 3 }, { label: "绝大部分或全部时间", value: 4 }]; }
  function q(text, options) { return { text: text, options: options }; }

  window.TESTS.push({
    id: "phq9",
    name: "PHQ-9 抑郁症筛查量表",
    icon: "P9",
    color: "#ff2d55",
    description: "9 道题，评估最近两周的抑郁症状。Pfizer 授权，国际通用抑郁筛查工具。",
    time: "约 2 分钟",
    scoring: {
      type: "total",
      maxScore: 27,
      reversed: [],
      levels: [
        { min: 0, max: 4, level: "none", name: "无或极轻微", summary: "近期情绪状态整体平稳，未达到需要干预的抑郁水平。继续保持规律作息与适度运动，留意情绪波动即可。" },
        { min: 5, max: 9, level: "mild", name: "轻度抑郁", summary: "存在一定程度的低落情绪或兴趣减退，生活影响尚可控。建议增加户外活动、社交与自我关怀，若持续两周以上或加重，可咨询心理专业人士。" },
        { min: 10, max: 14, level: "moderate", name: "中度抑郁", summary: "抑郁症状已较明显，可能影响工作学习与人际。强烈建议尽快咨询心理医生或精神科医生，接受专业评估。" },
        { min: 15, max: 19, level: "moderately-severe", name: "中重度抑郁", summary: "症状明显且持续，日常生活明显受扰。建议立即预约心理/精神科专业评估，考虑药物与心理治疗。" },
        { min: 20, max: 27, level: "severe", name: "重度抑郁", summary: "症状严重，需高度重视。请务必尽快前往精神科就诊，同时向亲友寻求支持。若第 9 题得分 ≥1，请立即联系专业心理援助。" }
      ],
      warnings: [
        { question: 9, threshold: 1, text: "我们注意到您在第 9 题中表达了一些不易的时刻。您的感受很重要，也值得被认真对待——如果需要，请随时拨打 12356 全国心理援助热线，或联系身边信任的人。您不必独自承受，有人愿意倾听和陪伴。" }
      ]
    },
    questions: [
      q("做事时提不起劲或没有兴趣", opts4("完全没有", "好几天", "一半以上的天数", "几乎每天")),
      q("感到心情低落、沮丧或绝望", opts4("完全没有", "好几天", "一半以上的天数", "几乎每天")),
      q("入睡困难、睡不安或睡得过多", opts4("完全没有", "好几天", "一半以上的天数", "几乎每天")),
      q("感觉疲倦或没有活力", opts4("完全没有", "好几天", "一半以上的天数", "几乎每天")),
      q("食欲不振或吃太多", opts4("完全没有", "好几天", "一半以上的天数", "几乎每天")),
      q("觉得自己很糟，或觉得自己很失败，或让自己、家人失望", opts4("完全没有", "好几天", "一半以上的天数", "几乎每天")),
      q("对事物专注有困难，例如阅读报纸或看电视时", opts4("完全没有", "好几天", "一半以上的天数", "几乎每天")),
      q("行动或说话速度缓慢到别人已经察觉；或刚好相反——变得比平日更烦躁或坐立不安、动来动去", opts4("完全没有", "好几天", "一半以上的天数", "几乎每天")),
      q("有不如死掉或用某种方式伤害自己的念头", opts4("完全没有", "好几天", "一半以上的天数", "几乎每天"))
    ],
    interpretation: {}
  });

  window.TESTS.push({
    id: "gad7",
    name: "GAD-7 广泛性焦虑量表",
    icon: "G7",
    color: "#ff9500",
    description: "7 道题，评估最近两周的焦虑症状。收录于北京市地方标准 DB11/T 1723-2020。",
    time: "约 1 分钟",
    scoring: {
      type: "total",
      maxScore: 21,
      reversed: [],
      levels: [
        { min: 0, max: 4, level: "none", name: "没有焦虑", summary: "近期焦虑水平正常，未呈现临床意义的紧张担忧。" },
        { min: 5, max: 9, level: "mild", name: "轻度焦虑", summary: "存在轻度紧张与担忧，多数情况仍可自我调节。建议练习深呼吸、正念放松，保持运动。" },
        { min: 10, max: 14, level: "moderate", name: "中度焦虑", summary: "焦虑已较明显，可能影响睡眠与专注。建议寻求心理咨询或精神科专业评估。" },
        { min: 15, max: 21, level: "severe", name: "重度焦虑", summary: "焦虑水平较高，常伴明显的躯体紧张与不安。请尽快咨询精神科/心理专业人士，接受系统干预。" }
      ]
    },
    questions: [
      q("感觉紧张、焦虑或急切", opts4("完全不会", "好几天", "一半以上的天数", "几乎每天")),
      q("不能停止或控制担忧", opts4("完全不会", "好几天", "一半以上的天数", "几乎每天")),
      q("对各种事情担忧过多", opts4("完全不会", "好几天", "一半以上的天数", "几乎每天")),
      q("很难放松下来", opts4("完全不会", "好几天", "一半以上的天数", "几乎每天")),
      q("由于不安而无法静坐", opts4("完全不会", "好几天", "一半以上的天数", "几乎每天")),
      q("变得容易烦恼或急躁", opts4("完全不会", "好几天", "一半以上的天数", "几乎每天")),
      q("感到似乎有可怕的事情会发生而害怕", opts4("完全不会", "好几天", "一半以上的天数", "几乎每天"))
    ],
    interpretation: {}
  });

  window.TESTS.push({
    id: "isi",
    name: "ISI 失眠严重程度指数",
    icon: "IS",
    color: "#5e5ce6",
    description: "7 道题，评估最近两周的失眠严重程度。中文版经台湾学者信效度验证（台中荣总医院采用）。",
    time: "约 2 分钟",
    scoring: {
      type: "total",
      maxScore: 28,
      reversed: [],
      levels: [
        { min: 0, max: 7, level: "none", name: "无明显临床失眠", summary: "睡眠整体状况良好，未达临床失眠水平。保持规律作息即可。" },
        { min: 8, max: 14, level: "mild", name: "阈下失眠（轻度）", summary: "存在轻度睡眠困扰。建议练习放松、睡前减少屏幕使用、规律作息等改善睡眠卫生。" },
        { min: 15, max: 21, level: "moderate", name: "中度失眠", summary: "失眠问题已较明显，可能影响白天功能。建议寻求睡眠医学或身心科专业评估。" },
        { min: 22, max: 28, level: "severe", name: "重度失眠", summary: "失眠严重且持续影响生活。请尽快咨询睡眠医学或精神科医生，评估是否需要系统治疗。" }
      ]
    },
    questions: [
      q("难以入睡的困难程度", opts5("无", "轻微", "中度", "严重", "非常严重")),
      q("维持睡眠的困难程度（容易醒来）", opts5("无", "轻微", "中度", "严重", "非常严重")),
      q("太早醒来的困难程度", opts5("无", "轻微", "中度", "严重", "非常严重")),
      q("您对目前睡眠型态的满意/不满意程度", opts5("很满意", "满意", "中等", "不满意", "非常不满意")),
      q("您的失眠问题在多大程度上影响了日常功能（如白天疲倦、情绪、工作能力、专注力、记忆力等）", opts5("完全没有", "轻微", "中度", "严重", "非常严重")),
      q("跟别人比起来，您认为您的失眠问题有多明显", opts5("完全没有", "轻微", "中度", "严重", "非常严重")),
      q("您对目前的失眠问题有多担心/困扰", opts5("完全没有", "轻微", "中度", "严重", "非常严重"))
    ],
    interpretation: {}
  });

  window.TESTS.push({
    id: "sad",
    name: "SAD 社交回避及苦恼量表",
    icon: "SA",
    color: "#32ade6",
    description: "28 道是/否题，评估社交回避与社交苦恼程度。Watson & Friend（1969）编制，中文版经彭纯子等修订。",
    time: "约 4 分钟",
    scoring: {
      type: "total",
      maxScore: 28,
      reversed: [1, 3, 4, 6, 7, 9, 12, 15, 17, 19, 22, 25, 27, 28],
      subscales: [
        { key: "avoid", label: "社交回避", max: 14, items: [2, 4, 8, 9, 13, 17, 18, 19, 21, 22, 24, 25, 26, 27] },
        { key: "distress", label: "社交苦恼", max: 14, items: [1, 3, 5, 6, 7, 10, 11, 12, 14, 15, 16, 20, 23, 28] }
      ],
      levels: [
        { min: 0, max: 10, level: "low", name: "低水平", summary: "社交回避与苦恼程度较低，能够较自在参与社交场合。" },
        { min: 11, max: 20, level: "medium", name: "中等水平", summary: "存在中等程度的社交回避或苦恼，某些社交场合会感到明显紧张，可能倾向回避。可尝试渐进式社交练习与正念脱敏。" },
        { min: 21, max: 28, level: "high", name: "高水平", summary: "社交回避与苦恼水平较高，可能显著影响人际与工作学习。建议寻求心理咨询（如认知行为疗法）系统改善。" }
      ]
    },
    questions: [
      q("即使在不熟悉的社交场合里，我仍然感到放松", yn()),
      q("我尽量避免迫使我参加交际应酬的情形", yn()),
      q("我同陌生人在一起时很容易放松", yn()),
      q("我并不特别想去回避人们", yn()),
      q("我通常发现社交场合令人心烦意乱", yn()),
      q("在社交场合我通常感觉平静及舒适", yn()),
      q("在同异性交谈时，我通常感觉放松", yn()),
      q("我尽量避免与别人讲话，除非特别熟", yn()),
      q("如果有同新人聚会的机会，我会抓住的", yn()),
      q("在非正式的聚会上如有异性参加，我通常会觉得焦虑和紧张", yn()),
      q("与人们在一起时我通常感到焦虑，除非与他们特别熟", yn()),
      q("我与一群人在一起时通常感到放松", yn()),
      q("我经常想离开人群", yn()),
      q("我置身于不认识的人群中时，通常感到不自在", yn()),
      q("在初次遇见某些人时，我通常是放松的", yn()),
      q("被介绍给别人会使我感到紧张和焦虑", yn()),
      q("尽管满房间都是生人，我可能还是会进去", yn()),
      q("我会避免走上前去加入到一大群人中间", yn()),
      q("当上级想同我谈话时，我很高兴与他谈话", yn()),
      q("当与一群人在一起时，我通常感觉忐忑不安", yn()),
      q("我喜欢躲开人群", yn()),
      q("在晚上或社交聚会上与人们交谈对我不成问题", yn()),
      q("在一大群人中间，我极少能感到自在", yn()),
      q("我经常想出一些借口以回避社交活动", yn()),
      q("我有时充当为人们相互介绍的角色", yn()),
      q("我尽量避开正式的社交场合", yn()),
      q("我通常参加我所能参加的各种社会交往，不管是什么活动，能去就去", yn()),
      q("我发现同他人在一起时放松很容易", yn())
    ],
    interpretation: {}
  });

  window.TESTS.push({
    id: "sds",
    name: "SDS 抑郁自评量表",
    icon: "SD",
    color: "#ff3b30",
    description: "Zung 编制的 20 题抑郁自评量表，评估最近一周的抑郁症状。中国常模广泛用于临床。",
    time: "约 4 分钟",
    scoring: {
      type: "total",
      maxScore: 80,
      standardScore: function (raw) { return Math.floor(raw * 1.25); },
      reversed: [2, 5, 6, 11, 12, 14, 16, 17, 18, 20],
      levels: [
        { min: 0, max: 52, level: "normal", name: "正常（无抑郁）", summary: "情绪状态在正常范围内，无明显抑郁表现。" },
        { min: 53, max: 62, level: "mild", name: "轻度抑郁", summary: "存在轻度抑郁情绪，生活影响有限。建议增加运动、规律作息、保持社交，若持续可寻求心理支持。" },
        { min: 63, max: 72, level: "moderate", name: "中度抑郁", summary: "抑郁症状明显，可能影响工作、学习与睡眠食欲。建议尽快咨询心理/精神科专业人士。" },
        { min: 73, max: 100, level: "severe", name: "重度抑郁", summary: "抑郁症状严重，请务必尽快前往精神科就诊。特别关注第 19 题（轻生念头），若得分 ≥3 需立即寻求专业援助。" }
      ],
      warnings: [
        { question: 19, threshold: 3, text: "从您的作答来看，第 19 题反映出一些比较沉重的想法。这些念头并不意味着您真的想离开，而是说明此刻您承受着很大的压力。请给自己一个机会——联系精神科医生或专业心理援助，也可以先和信任的亲友聊一聊。您的存在对身边的人很重要。" }
      ]
    },
    questions: [
      q("我觉得闷闷不乐，情绪低沉", lk4("少部分时间")),
      q("我觉得一天中早晨最好", lk4("少部分时间")),
      q("我一阵阵哭出来或觉得想哭", lk4("少部分时间")),
      q("我晚上睡眠不好", lk4("少部分时间")),
      q("我吃得跟平常一样多", lk4("少部分时间")),
      q("我与异性密切接触时和以往一样感到愉快", lk4("少部分时间")),
      q("我发觉我的体重在下降", lk4("少部分时间")),
      q("我有便秘的苦恼", lk4("少部分时间")),
      q("我心跳比平常快", lk4("少部分时间")),
      q("我无缘无故地感到疲乏", lk4("少部分时间")),
      q("我的头脑跟平常一样清楚", lk4("少部分时间")),
      q("我觉得经常做的事并没有困难", lk4("少部分时间")),
      q("我觉得不安而平静不下来", lk4("少部分时间")),
      q("我对将来抱有希望", lk4("少部分时间")),
      q("我比平常容易生气激动", lk4("少部分时间")),
      q("我觉得做出决定是容易的", lk4("少部分时间")),
      q("我觉得自己是个有用的人，有人需要我", lk4("少部分时间")),
      q("我的生活过得很有意思", lk4("少部分时间")),
      q("我认为如果我死了，别人会过得好些", lk4("少部分时间")),
      q("平常感兴趣的事我仍然感兴趣", lk4("少部分时间"))
    ],
    interpretation: {}
  });

  window.TESTS.push({
    id: "sas",
    name: "SAS 焦虑自评量表",
    icon: "SA2",
    color: "#ff9500",
    description: "Zung 编制的 20 题焦虑自评量表，评估最近一周的焦虑症状。中国常模广泛用于临床。",
    time: "约 4 分钟",
    scoring: {
      type: "total",
      maxScore: 80,
      standardScore: function (raw) { return Math.floor(raw * 1.25); },
      reversed: [5, 9, 13, 17, 19],
      levels: [
        { min: 0, max: 49, level: "normal", name: "正常", summary: "焦虑水平正常，未见临床意义的紧张不安。" },
        { min: 50, max: 59, level: "mild", name: "轻度焦虑", summary: "存在轻度焦虑，偶有紧张、心悸等表现，多可自行调节。建议练习放松训练、规律运动。" },
        { min: 60, max: 69, level: "moderate", name: "中度焦虑", summary: "焦虑症状较明显，可能伴躯体不适与睡眠问题。建议寻求心理咨询或精神科专业评估。" },
        { min: 70, max: 100, level: "severe", name: "重度焦虑", summary: "焦虑水平较高，躯体与情绪症状显著。请尽快咨询精神科/心理专业人士。" }
      ]
    },
    questions: [
      q("我觉得比平时容易紧张和着急", lk4("小部分时间")),
      q("我无缘无故地感到害怕", lk4("小部分时间")),
      q("我容易心里烦乱或觉得惊恐", lk4("小部分时间")),
      q("我觉得我可能将要发疯", lk4("小部分时间")),
      q("我觉得一切都很好，也不会发生什么不幸", lk4("小部分时间")),
      q("我手脚发抖打颤", lk4("小部分时间")),
      q("我因为头痛、颈痛和背痛而苦恼", lk4("小部分时间")),
      q("我感觉容易衰弱和疲乏", lk4("小部分时间")),
      q("我觉得心平气和，并且容易安静坐着", lk4("小部分时间")),
      q("我觉得心跳得快", lk4("小部分时间")),
      q("我因为一阵阵头晕而苦恼", lk4("小部分时间")),
      q("我有过晕倒发作，或觉得要晕倒似的", lk4("小部分时间")),
      q("我呼气吸气都感到很容易", lk4("小部分时间")),
      q("我手脚麻木和刺痛", lk4("小部分时间")),
      q("我因胃痛和消化不良而苦恼", lk4("小部分时间")),
      q("我常常要小便", lk4("小部分时间")),
      q("我的手常常是干燥温暖的", lk4("小部分时间")),
      q("我脸红发热", lk4("小部分时间")),
      q("我容易入睡并且一夜睡得很好", lk4("小部分时间")),
      q("我做恶梦", lk4("小部分时间"))
    ],
    interpretation: {}
  });

  window.TESTS.push({
    id: "ybocs",
    name: "Y-BOCS 耶鲁-布朗强迫症量表",
    icon: "YB",
    color: "#af52de",
    description: "10 道题，分别评估强迫观念与强迫行为的严重程度。Goodman（1989）编制，自评版结果仅作初步参考。",
    time: "约 3 分钟",
    scoring: {
      type: "total",
      maxScore: 40,
      reversed: [],
      subscales: [
        { key: "obsession", label: "强迫观念", max: 20, items: [1, 2, 3, 4, 5] },
        { key: "compulsion", label: "强迫行为", max: 20, items: [6, 7, 8, 9, 10] }
      ],
      levels: [
        { min: 0, max: 7, level: "subclinical", name: "亚临床（正常范围）", summary: "未呈现临床意义的强迫症状。" },
        { min: 8, max: 15, level: "mild", name: "轻度强迫症状", summary: "存在轻度强迫观念或行为，已具临床意义，可考虑专业评估与认知行为治疗（暴露与反应预防 ERP 是一线方法）。" },
        { min: 16, max: 23, level: "moderate", name: "中度强迫症状", summary: "强迫症状明显，可能影响日常生活。建议精神科/心理专业人士系统评估，考虑 ERP 与药物联合干预。" },
        { min: 24, max: 31, level: "severe", name: "重度强迫症状", summary: "症状严重干扰生活。请尽快就诊精神科，接受规范治疗。" },
        { min: 32, max: 40, level: "extreme", name: "极重度强迫症状", summary: "症状极重，几乎持续存在且功能严重受损。务必尽快就医。" }
      ]
    },
    questions: [
      q("每天花多少时间在强迫观念（反复出现的想法/念头）上？", opts5("无", "每天 1 小时以内", "每天 1-3 小时", "每天 3-8 小时", "每天 8 小时以上")),
      q("强迫观念对您的学习、工作或人际交往的干扰程度？", opts5("无", "轻度", "中度但可应对", "明显受损", "几乎丧失功能")),
      q("强迫观念让您感到痛苦或焦虑的程度？", opts5("无", "轻微", "中度但可承受", "严重", "近乎持续、令人崩溃")),
      q("您有多努力去抵抗强迫观念？", opts5("总是抵抗", "大部分时间抵抗", "有时抵抗", "经常屈服", "完全屈服")),
      q("您对强迫观念的控制能力？", opts5("完全控制", "大部分能控制", "部分能控制", "很少能控制", "完全无法控制")),
      q("每天花多少时间在强迫行为（反复做的动作/检查等）上？", opts5("无", "每天 1 小时以内", "每天 1-3 小时", "每天 3-8 小时", "每天 8 小时以上")),
      q("强迫行为对您的学习、工作或人际交往的干扰程度？", opts5("无", "轻度", "中度但可应对", "明显受损", "几乎丧失功能")),
      q("若阻止您进行强迫行为，您会感到焦虑或痛苦的程度？", opts5("无", "轻微", "中度但可承受", "严重", "近乎持续、令人崩溃")),
      q("您有多努力去抵抗强迫行为？", opts5("总是抵抗", "大部分时间抵抗", "有时抵抗", "经常屈服", "完全屈服")),
      q("您对强迫行为的控制能力？", opts5("完全控制", "大部分能控制", "部分能控制", "很少能控制", "完全无法控制"))
    ],
    interpretation: {}
  });

  window.TESTS.push({
    id: "ymrs",
    name: "YMRS 杨氏躁狂量表",
    icon: "YM",
    color: "#ff2d55",
    description: "11 道题，评估近 48 小时内的躁狂症状（含双倍权重题）。Young（1978）编制，自评版仅作初步筛查参考。",
    time: "约 3 分钟",
    scoring: {
      type: "total",
      maxScore: 60,
      reversed: [],
      levels: [
        { min: 0, max: 11, level: "remission", name: "缓解/极轻", summary: "未见明显躁狂表现，情绪与精力水平在正常范围。" },
        { min: 12, max: 19, level: "mild", name: "轻度", summary: "存在轻度躁狂倾向（如精力增加、话多、睡眠减少），建议留意情绪波动规律，必要时咨询精神科。" },
        { min: 20, max: 29, level: "moderate", name: "中度", summary: "躁狂症状较明显，可能影响判断与行为。建议尽快精神科专业评估。" },
        { min: 30, max: 39, level: "significant", name: "显著（重度）", summary: "躁狂症状显著，可能伴冲动或夸大行为。请尽快就医。" },
        { min: 40, max: 60, level: "extreme", name: "极重度", summary: "症状极重，需立即寻求精神科紧急评估与干预。" }
      ]
    },
    questions: [
      q("最近两天您的心情是否异常高涨、乐观或自信？", opts5("无", "轻微或可能增高", "明确主观增高，乐观自信、愉快合宜", "高涨且与环境不协调，爱开玩笑", "欣快，不适当发笑或唱歌")),
      q("最近两天您是否觉得精力旺盛、活动增多？", opts5("无", "主观感觉增加", "活跃、手势增多", "精力过剩、时有活动过多、不安宁（尚可安静）", "运动性兴奋、持续活动过多（无法安静）")),
      q("最近两天您的性兴趣是否增加？", opts5("正常无增加", "轻度或可能增加", "主观感到肯定增加", "自发谈论性话题、详细描述", "明显性举动")),
      q("最近两天您的睡眠是否减少？", opts5("无减少", "比平时少 1 小时以内", "比平时少 1 小时以上", "自感睡眠需求减少", "否认需要睡眠")),
      q("最近两天您是否容易发怒、不耐烦？", [{ label: "无", value: 0 }, { label: "主观感到易激惹", value: 2 }, { label: "检查/交谈中有时易激惹，近期有愤怒发作", value: 4 }, { label: "经常不耐烦、回答简短生硬", value: 6 }, { label: "敌意、不合作", value: 8 }]),
      q("最近两天您是否话多、语速快？", [{ label: "无增多", value: 0 }, { label: "感觉话多", value: 2 }, { label: "时有语速语量增加或啰嗦", value: 4 }, { label: "言语紧迫、持续增加、难以打断", value: 6 }, { label: "急迫、无法打断、说个不停", value: 8 }]),
      q("最近两天您的思维是否跳跃、难以集中？", opts5("无", "赘述、轻度分散、思维敏捷", "分散、缺乏思维目标、经常改变话题、思维加速", "思维奔逸、离题、难以跟上、音联/模仿言语", "思维不连贯、无法交流")),
      q("最近两天您是否有特别计划、夸大或偏执想法？", [{ label: "正常", value: 0 }, { label: "可疑的计划、新的兴趣", value: 2 }, { label: "特殊计划、超宗教观念", value: 4 }, { label: "夸大或偏执观念、牵连观念", value: 6 }, { label: "妄想、幻觉", value: 8 }]),
      q("最近两天您是否有挑衅或攻击行为？", [{ label: "无、合作", value: 0 }, { label: "好讥讽、时常提高嗓门、戒备", value: 2 }, { label: "要求过多、在环境中威胁", value: 4 }, { label: "威胁他人、大声喊叫、难以沟通", value: 6 }, { label: "好斗、破坏性、无法沟通", value: 8 }]),
      q("您现在的穿着仪表如何？", opts5("穿戴修饰得体", "稍微仪态不整", "修饰不佳、中度蓬乱、过分穿着", "穿戴蓬乱、衣冠不整", "完全不修边幅、奇装异服")),
      q("您是否认为自己目前的状况需要关注/治疗？", opts5("自知力完好，承认有问题且需要治疗", "可能有问题", "承认行为有变化但否认有病", "承认可能有行为变化但仍否认有病", "完全否认任何变化"))
    ],
    interpretation: {}
  });
})();

/* ===== 七宗罪 vs 七美德 ===== */
window.TESTS.push({
  id: "sinsvirtues",
  name: "七宗罪 vs 七美德",
  icon: "⚖",
  color: "#7c3aed",
  description: "基于中世纪神学七宗罪与对位七美德的概念框架，通过35道生活化情境题，从14个维度(7罪+7美德)探索你内心的光明与欲望面。趣味人格测试，结果仅供娱乐与自我觉察参考。",
  time: "约 5 分钟",
  scoring: {
    type: "dimension",
    dimensions: [
      { key: "PRIDE", label: "傲慢", max: 15 },
      { key: "ENVY", label: "嫉妒", max: 10 },
      { key: "WRATH", label: "暴怒", max: 15 },
      { key: "SLOTH", label: "懒惰", max: 10 },
      { key: "GREED", label: "贪婪", max: 10 },
      { key: "GLUTTONY", label: "暴食", max: 10 },
      { key: "LUST", label: "色欲", max: 10 },
      { key: "HUMILITY", label: "谦卑", max: 15 },
      { key: "CHARITY", label: "仁爱", max: 15 },
      { key: "PATIENCE", label: "耐心", max: 5 },
      { key: "DILIGENCE", label: "勤勉", max: 15 },
      { key: "GENEROSITY", label: "慷慨", max: 10 },
      { key: "TEMPERANCE", label: "节制", max: 15 },
      { key: "CHASTITY", label: "贞洁", max: 20 }
    ],
    classify: function(s) {
      var sk = ["PRIDE","ENVY","WRATH","SLOTH","GREED","GLUTTONY","LUST"];
      var vk = ["HUMILITY","CHARITY","PATIENCE","DILIGENCE","GENEROSITY","TEMPERANCE","CHASTITY"];
      var mx = {PRIDE:15,ENVY:10,WRATH:15,SLOTH:10,GREED:10,GLUTTONY:10,LUST:10,HUMILITY:15,CHARITY:15,PATIENCE:5,DILIGENCE:15,GENEROSITY:10,TEMPERANCE:15,CHASTITY:20};
      var sn = {PRIDE:"傲慢",ENVY:"嫉妒",WRATH:"暴怒",SLOTH:"懒惰",GREED:"贪婪",GLUTTONY:"暴食",LUST:"色欲"};
      var vn = {HUMILITY:"谦卑",CHARITY:"仁爱",PATIENCE:"耐心",DILIGENCE:"勤勉",GENEROSITY:"慷慨",TEMPERANCE:"节制",CHASTITY:"贞洁"};
      function p(k){return Math.round(((s[k]||0)/mx[k])*100);}
      var sp = sk.map(function(k){return{k:k,v:p(k)};}).sort(function(a,b){return b.v-a.v;});
      var vp = vk.map(function(k){return{k:k,v:p(k)};}).sort(function(a,b){return b.v-a.v;});
      var ts = sp[0], tv = vp[0];
      var sa = Math.round(sp.reduce(function(a,x){return a+x.v;},0)/7);
      var va = Math.round(vp.reduce(function(a,x){return a+x.v;},0)/7);
      var df = va - sa;
      var ds = df>=0?"+":"";
      var dp = df>=0?"偏向光明面，你更倾向于用美德约束自己":"偏向欲望面，你更倾向于释放天性";
      return {
        type: sn[ts.k]+" · "+vn[tv.k],
        typeName: "你的首罪是"+sn[ts.k]+"（"+ts.v+"分），首美德是"+vn[tv.k]+"（"+tv.v+"分）",
        summary: "七美德平均"+va+"分，七宗罪平均"+sa+"分，差值 "+ds+df+"（"+dp+"）。你的内心是"+sn[ts.k]+"与"+vn[tv.k]+"的角力场。"
      };
    }
  },
  questions: [
    { text: "即便手头资金充裕，面对心仪的物品，我也不会因为喜好就一次性大量购入。", options: (function(){var v=function(n){var o={};o.TEMPERANCE=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "你和众人合作完成事情，最后所有人只称赞你：", options: [{label:"坦然接纳这份赞誉",value:{HUMILITY:1}},{label:"会主动说明其他人同样付出了努力",value:{HUMILITY:5}}] },
    { text: "当同龄人在聚会中成为全场焦点时，我会下意识想夺回众人的关注。", options: (function(){var v=function(n){var o={};o.PRIDE=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "长期与你暗自竞争的人突然陷入低谷：", options: [{label:"竞争归竞争，依旧会给予对方关心",value:{ENVY:1}},{label:"内心会稍稍放松，不会主动前去接触",value:{ENVY:5}}] },
    { text: "面对没有明确截止日期的事务，我大多需要他人催促后才会着手处理。", options: (function(){var v=function(n){var o={};o.SLOTH=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "排队等候许久，有人直接插到你的前方：", options: [{label:"先出声提醒，对方不听再寻求工作人员处理",value:{WRATH:1}},{label:"当场上前阻拦，就算发生争执也无所谓",value:{WRATH:5}}] },
    { text: "看到同龄人拥有我向往的生活状态，我会暂时选择不查看对方的动态。", options: (function(){var v=function(n){var o={};o.ENVY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "学习一项新技能，练习过程慢慢变得枯燥乏味：", options: [{label:"暂时停下练习，等待兴趣重新回来",value:{DILIGENCE:1}},{label:"适当降低练习目标，每天坚持完成少量训练",value:{DILIGENCE:5}}] },
    { text: "遇到自己完全不了解的领域和话题，我能够坦然承认自己不懂，不会刻意掩饰。", options: (function(){var v=function(n){var o={};o.HUMILITY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "抽奖额外抽到一份限量周边，身旁有人始终没能抽到：", options: [{label:"先自己留存，说不定往后会更有价值",value:{GENEROSITY:1}},{label:"愿意按原价转让给一直想要的对方",value:{GENEROSITY:5}}] },
    { text: "计划被他人突然打乱时，我的说话语气会瞬间变得急躁、生硬。", options: (function(){var v=function(n){var o={};o.WRATH=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "朋友临时邀约通宵玩乐，但你次日已有安排：", options: [{label:"难得可以尽情放松，调整第二天的安排赴约",value:{TEMPERANCE:1}},{label:"只参与一段时间，按照原定计划准时离开",value:{TEMPERANCE:5}}] },
    { text: "即便朋友反复询问我已经解释过的问题，我依旧可以耐心重新解答。", options: (function(){var v=function(n){var o={};o.PATIENCE=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "本身拥有稳定恋情，又遇见一个令你格外心动的人：", options: [{label:"先保持联系，观察这份心动能否长久",value:{CHASTITY:1}},{label:"主动拉开距离，阻止情愫持续发酵",value:{CHASTITY:5}}] },
    { text: "入手心仪的物品后，短暂满足后我很快就会渴望拥有新的物品。", options: (function(){var v=function(n){var o={};o.GREED=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "面对极具个人魅力的人的主动示好，即便没有长久发展的打算，我也会享受当下的暧昧氛围。", options: (function(){var v=function(n){var o={};o.LUST=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "聊到自己擅长的领域时，我希望身边人能够知晓我的能力优于大多数人。", options: (function(){var v=function(n){var o={};o.PRIDE=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "即便无法理解朋友的人生理想，我也会静下心认真倾听对方的想法。", options: (function(){var v=function(n){var o={};o.CHARITY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "面对喜欢的人迟迟不表态的情况，我可以克制自己，不会反复主动试探。", options: (function(){var v=function(n){var o={};o.CHASTITY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "有人当众对我开过分的玩笑、刻意冒犯我时，我会立刻做出回击。", options: (function(){var v=function(n){var o={};o.WRATH=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "即便我并不喜欢、不认可某个人，也能客观承认对方观点中的合理之处。", options: (function(){var v=function(n){var o={};o.HUMILITY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "聚餐吃到饱腹之后，如果有自己爱吃的菜品上桌，我依旧会继续进食。", options: (function(){var v=function(n){var o={};o.GLUTTONY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "遇到棘手的难题时，我会拆解为细小步骤逐步攻克，不会直接搁置放弃。", options: (function(){var v=function(n){var o={};o.DILIGENCE=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "年纪比我小的人用说教、训导的口吻和我交流，我会立刻产生抵触情绪。", options: (function(){var v=function(n){var o={};o.PRIDE=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "情绪低落、心情烦躁时，我会通过享用美食的方式缓解自身负面情绪。", options: (function(){var v=function(n){var o={};o.GLUTTONY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "对于闲置不用、但未来可能有用的物品，我通常不愿意赠予他人。", options: (function(){var v=function(n){var o={};o.GREED=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "在人际关系尚未明确敲定前，我不会依靠亲密互动换取不确定的安全感。", options: (function(){var v=function(n){var o={};o.CHASTITY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "无人监督、没有硬性要求的长期计划，我也能坚持执行、稳步推进。", options: (function(){var v=function(n){var o={};o.DILIGENCE=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "平日里关系普通的人遭到他人孤立时，我会主动上前亲近、善待对方。", options: (function(){var v=function(n){var o={};o.CHARITY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "即便对方未来有可能超越我，我也愿意真诚分享自己实用的经验与技巧。", options: (function(){var v=function(n){var o={};o.GENEROSITY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "面对突如其来的重大决策冲动，我会给自己一天的时间冷静思考，不急于定论。", options: (function(){var v=function(n){var o={};o.TEMPERANCE=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "只要对方足够吸引我，我会暂时忽略彼此适配度，优先遵从当下的感受。", options: (function(){var v=function(n){var o={};o.LUST=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "即便对他人心生好感、十分心动，我也会先确认对方是否单身，再进一步相处。", options: (function(){var v=function(n){var o={};o.CHASTITY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "桌面或房间环境杂乱，只要不影响正常使用，我就不会刻意整理。", options: (function(){var v=function(n){var o={};o.SLOTH=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() },
    { text: "朋友遇到棘手麻烦向我求助时，我愿意牺牲自己的空闲时间出手相助。", options: (function(){var v=function(n){var o={};o.CHARITY=n;return o;};return[{label:"非常像我",value:v(5)},{label:"比较像我",value:v(4)},{label:"一般/不好说",value:v(3)},{label:"不太像我",value:v(2)},{label:"完全不像我",value:v(1)}];})() }
  ],
  interpretation: {
    dims: {
      PRIDE: { name: "傲慢", high: "傲慢倾向明显，你对自己的能力有强烈的自信，渴望被认可和仰视，不喜欢被人忽视或低估。这种特质让你在人群中自带光芒，但也需警惕目中无人带来的关系损耗。", mid: "傲慢倾向处于中等水平，你既有自信的一面，也能在适当时候放下身段。保持这份平衡，既不过分张扬也不过分谦卑。", low: "傲慢倾向较低，值得肯定！你能够坦然接受自己的平凡与不完美，不刻意追求优越感，这种谦逊的品质让你在人际关系中备受欢迎。" },
      ENVY: { name: "嫉妒", high: "嫉妒倾向较为明显，你容易将他人的生活状态与自己做比较，渴望拥有别人拥有的东西。适度的嫉妒可以成为前进的动力，但过度的攀比会让你陷入焦虑与不满。", mid: "嫉妒倾向处于中等水平，你偶尔会与他人比较，但不会让这种情绪主导你的生活。保持这份觉察，将注意力放在自己的成长上。", low: "嫉妒倾向较低，值得肯定！你很少与他人攀比，能够专注于自己的生活和节奏，拥有难得的内心平静与自足。" },
      WRATH: { name: "暴怒", high: "暴怒倾向较为明显，你的情绪反应较为强烈，遇到不公或冒犯时容易瞬间爆发。这种直率让你的边界感非常清晰，但也可能因一时冲动而伤害关系。", mid: "暴怒倾向处于中等水平，你有自己的脾气和底线，但多数情况下能够控制情绪的表达。面对冲突时，你既有表达立场的能力，也有适可而止的理性。", low: "暴怒倾向较低，值得肯定！你的情绪稳定性很高，面对冲突和冒犯能够保持冷静，用理性而非冲动解决问题。这种温和的力量是你最大的财富。" },
      SLOTH: { name: "懒惰", high: "懒惰倾向较为明显，你倾向于选择轻松舒适的生活方式，不愿给自己太多压力。这种松弛感让你活得自在，但可能错失一些需要坚持才能获得的成长机会。", mid: "懒惰倾向处于中等水平，你懂得享受生活，也有一定的行动力。在舒适与进取之间，你正在寻找属于自己的平衡点。", low: "懒惰倾向较低，值得肯定！你有着很强的自律和行动力，不需要外部督促也能保持高效。这种勤勉的品质让你在学习和工作中稳步前进。" },
      GREED: { name: "贪婪", high: "贪婪倾向较为明显，你对拥有更多有着强烈的渴望，无论是物质、资源还是情感上的占有。这种欲望驱动你不断追求，但也需注意不要因过度索取而失去已有的珍贵之物。", mid: "贪婪倾向处于中等水平，你既有追求更好的欲望，也能在适当的时候知足。在想要与已有之间，你保持着相对健康的平衡。", low: "贪婪倾向较低，值得肯定！你懂得知足常乐，不执着于占有更多，能够欣赏和珍惜已经拥有的一切。这种淡泊的心态让你更加从容。" },
      GLUTTONY: { name: "暴食", high: "暴食倾向较为明显，你倾向于通过食物或感官享受来调节情绪、获得满足。美食和舒适是生活中重要的慰藉，但需留意不要让短暂的满足变成长期的依赖。", mid: "暴食倾向处于中等水平，你享受美食和生活的小确幸，但不会过度沉溺。在享乐与自律之间，你保持着可贵的平衡。", low: "暴食倾向较低，值得肯定！你对感官享受有着清醒的节制，不会让口腹之欲左右自己的生活节奏。这种自律让你在健康管理上有着天然的优势。" },
      LUST: { name: "色欲", high: "色欲倾向较为明显，你对情感和身体上的吸引力有着敏锐的感知，容易被激情和浪漫所驱动。这种热情让你的情感世界丰富而多彩，但也需警惕短暂的冲动带来的后续纠葛。", mid: "色欲倾向处于中等水平，你既有浪漫热情的一面，也保留着一定的理性和克制。在感性与理性之间，你有着属于自己的判断尺度。", low: "色欲倾向较低，值得肯定！你能够以理性驾驭情感，不轻易被外表的吸引力所左右，在选择关系时更加注重内在品质和长远契合度。" },
      HUMILITY: { name: "谦卑", high: "谦卑方面表现良好，你能够真诚地认可他人的价值，不刻意彰显自己的优越，在团队中乐于分享功劳。这种谦逊的姿态让你赢得了他人的尊重与信任。", mid: "谦卑方面处于中等水平，你既有自信展示自己的时刻，也有虚心倾听他人的时候。保持这份弹性，在自我表达与谦逊之间找到最适合你的位置。", low: "谦卑方面需注意提升，你可能有较强的自我中心倾向，习惯性地将关注点放在自己身上。试着多倾听他人的声音，承认他人的价值，你会发现关系变得更加融洽。" },
      CHARITY: { name: "仁爱", high: "仁爱方面表现良好，你有着温暖而真诚的利他之心，愿意在他人需要时伸出援手，不计较回报。这种善良和同理心是你最珍贵的品质之一。", mid: "仁爱方面处于中等水平，你关心他人，但也会保护自己的边界和精力。在助人与自保之间，你保持着健康的平衡。", low: "仁爱方面需注意提升，你可能更关注自己的需求和感受，对他人处境缺乏足够的同理心。试着多换位思考，主动关心身边的人，你会发现给予也是一种快乐。" },
      PATIENCE: { name: "耐心", high: "耐心方面表现良好，你有着超出常人的耐心和包容力，能够从容应对繁琐和重复，不轻易被激怒或失去冷静。这种沉稳让你的关系更加和谐。", mid: "耐心方面处于中等水平，你在大多数情况下能够保持耐心，但面对特定的刺激或压力时可能会有急躁的倾向。", low: "耐心方面需注意提升，你对于等待和重复的容忍度较低，容易被琐事激怒或失去冷静。试着放慢节奏，给自己和他人多一些时间和空间。" },
      DILIGENCE: { name: "勤勉", high: "勤勉方面表现良好，你有着强大的自律和执行力，能够坚持完成计划，不需要外部监督也能保持高效。这种踏实和坚韧是你实现目标的核心动力。", mid: "勤勉方面处于中等水平，你既有勤奋的一面，也有放松偷懒的时候。总体来说，你能够完成必要的任务，但长期坚持可能需要更多的自律。", low: "勤勉方面需注意提升，你在面对需要长期投入的任务时容易半途而废或拖延。试着将大目标拆解为小步骤，每天坚持一点点，逐步培养行动力。" },
      GENEROSITY: { name: "慷慨", high: "慷慨方面表现良好，你乐于分享自己的资源、时间和经验，不太计较得失。这种开放和豁达让你在人际关系中积累了深厚的信任和善意。", mid: "慷慨方面处于中等水平，你愿意分享，但也会衡量和保留。在给予与自我保护之间，你保持着相对理性的态度。", low: "慷慨方面需注意提升，你可能对分享自己的资源有所保留，倾向于优先考虑自己的利益。试着在安全范围内多分享一些，你会发现给予带来的连接感比占有更令人满足。" },
      TEMPERANCE: { name: "节制", high: "节制方面表现良好，你有着清醒的自我约束力，能够克制冲动，权衡利弊后再做决定。这种理性让你在消费、社交和生活节奏上都保持着健康的平衡。", mid: "节制方面处于中等水平，你大多数时候能够控制自己的冲动，但偶尔也会放纵一下。在约束与释放之间，你有着相对灵活的尺度。", low: "节制方面需注意提升，你在面对诱惑时容易冲动行事，缺乏足够的自我约束力。试着在做决定前给自己一段冷静的时间，让理性为你把关。" },
      CHASTITY: { name: "贞洁", high: "贞洁方面表现良好，你在情感和亲密关系上保持着清醒和审慎，尊重自己和他人，不轻易被情感冲动所左右。这种自律让你在情感世界中更加从容和坚定。", mid: "贞洁方面处于中等水平，你在情感关系中有自己的原则，但也会在特定情境下有所松动。在理性与感性之间，你根据具体情况灵活调整。", low: "贞洁方面需注意提升，你在情感边界上可能较为模糊，容易因一时好感或冲动而陷入复杂的关系中。试着明确自己的情感底线，保护好内心的秩序。" }
    },
    types: {}
  }
});

window.TEST_GROUPS = [
  { id: "hot", name: "热门测试", icon: "🔥", testIds: ["mbti"], open: true },
  { id: "personality", name: "人格测试", icon: "🧠", testIds: ["attachment", "mbti", "pdp"], open: true },
  { id: "fun", name: "趣味测试", icon: "🎯", testIds: ["sinsvirtues"], open: true },
  { id: "career", name: "职业测评", icon: "💼", testIds: ["holland"], open: true },
  { id: "mental", name: "心理健康测试", icon: "💚", testIds: ["scl90", "mmpi2", "phq9", "gad7", "isi", "sad", "sds", "sas", "ybocs", "ymrs"], open: true }
];
