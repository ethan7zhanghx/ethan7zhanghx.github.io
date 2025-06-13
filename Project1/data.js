export const presets = [
  {
    id: 'preset1',
    title: '校园恋爱：午后图书馆',
    type: '恋爱',
    description: '展示角色好感度系统和多结局分支',
    variables: [ { id: 'loveAffinity', name: '女主好感度', initialValue: 50, icon: 'heart' } ],
    nodes: {
      'start': { id: 'start', type: 'scene', content: '午后的阳光洒进图书馆，你注意到一个安静看书的女孩。她的侧脸在光晕中显得格外迷人。', position: {x: 350, y: 50}, next: 'choice1' },
      'choice1': { id: 'choice1', type: 'choice', content: '她似乎遇到了难题，眉头微蹙。这时你会...', position: {x: 350, y: 180}, choices: [
        { text: '主动上前询问', next: 'scene_A1', effects: [{ var: 'loveAffinity', op: '+', val: 10 }] },
        { text: '为她倒杯热水', next: 'scene_B1', effects: [{ var: 'loveAffinity', op: '+', val: 15 }] },
        { text: '假装没看见', next: 'scene_C1', effects: [{ var: 'loveAffinity', op: '-', val: 5 }] }
      ]},
      'scene_A1': { id: 'scene_A1', type: 'scene', content: '她对你的突然出现有些惊讶，但还是礼貌地说明了问题。在你笨拙的帮助下，问题解决了。她对你笑了笑。', position: {x: 100, y: 310}, next: 'ending_A' },
      'scene_B1': { id: 'scene_B1', type: 'scene', content: '你将一杯热水轻轻放在她的桌角。她抬起头，眼中流露出温暖的感激。你们简单地聊了几句。', position: {x: 350, y: 310}, next: 'ending_B' },
      'scene_C1': { id: 'scene_C1', type: 'scene', content: '你选择不去打扰她。过了一会儿，她收拾东西离开了，你们之间没有发生任何故事。', position: {x: 600, y: 310}, next: 'ending_C' },
      'ending_A': {id: 'ending_A', type: 'ending', content: '结局：友好的邂逅。你们成为了朋友，但似乎还差一点火花。', position: {x: 100, y: 440}},
      'ending_B': {id: 'ending_B', type: 'ending', content: '结局：温暖的开端。她对你的体贴印象深刻，你们的故事有了美好的开始。', position: {x: 350, y: 440}},
      'ending_C': {id: 'ending_C', type: 'ending', content: '结局：错过的缘分。你因为犹豫而错过了一次相识的机会。', position: {x: 600, y: 440}}
    }
  },
  {
    id: 'preset2',
    title: '悬疑推理：庄园谜案',
    type: '悬疑',
    description: '展示线索收集和推理选择',
    variables: [ { id: 'cluesFound', name: '已收集线索', initialValue: 0, icon: 'search' } ],
    nodes: {
      'start': { id: 'start', type: 'scene', content: '你作为侦探被邀请到一座孤岛庄园。主人在昨晚的晚宴后被发现死在书房，房门反锁。', position: {x: 350, y: 50}, next: 'choice1' },
      'choice1': { id: 'choice1', type: 'choice', content: '勘察现场，你的第一步是？', position: {x: 350, y: 180}, choices: [
        { text: '检查尸体', next: 'scene_A1' },
        { text: '搜查书房', next: 'scene_B1' }
      ]},
      'scene_A1': { id: 'scene_A1', type: 'scene', content: '死者面容安详，不像是挣扎过。你注意到他袖口有一丝不易察觉的泥土痕迹。', position: {x: 150, y: 310}, next: 'choice2', effects: [{ var: 'cluesFound', op: '+', val: 1 }] },
      'scene_B1': { id: 'scene_B1', type: 'scene', content: '书房非常整洁，但你发现地毯下有一把小巧的黄铜钥匙。', position: {x: 550, y: 310}, next: 'choice2', effects: [{ var: 'cluesFound', op: '+', val: 1 }] },
      'choice2': { id: 'choice2', type: 'choice', content: '完成初步勘察后，你决定？', position: {x: 350, y: 440}, choices: [
        { text: '审问管家', next: 'scene_AB1'},
        { text: '调查花园', next: 'scene_AB2'}
      ]},
      'scene_AB1': {id: 'scene_AB1', type: 'scene', content: '管家声称昨晚一直在自己房间。但你发现他的鞋底沾着新鲜的泥土。', position: {x: 150, y: 570}, next: 'ending_A', effects: [{ var: 'cluesFound', op: '+', val: 1 }] },
      'scene_AB2': {id: 'scene_AB2', type: 'scene', content: '花园里有新翻动的土壤，似乎有人不久前在这里埋了什么东西。', position: {x: 550, y: 570}, next: 'ending_B', effects: [{ var: 'cluesFound', op: '+', val: 1 }] },
      'ending_A': {id: 'ending_A', type: 'ending', content: '结局：锁定嫌疑人。通过线索关联，你将目标锁定在管家身上，但还缺少决定性证据。', position: {x: 150, y: 700}},
      'ending_B': {id: 'ending_B', type: 'ending', content: '结局：发现关键物证。你在花园里挖出了凶器，案件取得了重大突破。', position: {x: 550, y: 700}}
    }
  },
  {
    id: 'preset3',
    title: '冒险探索：失落神殿',
    type: '冒险',
    description: '展示道具系统和探索分支',
    variables: [ { id: 'hasTorch', name: '获得火把', initialValue: 0, icon: 'torch' }, {id: 'hasKey', name: '获得钥匙', initialValue: 0, icon: 'key'} ],
    nodes: {
        'start': { id: 'start', type: 'scene', content: '你站在失落神殿的入口，面前是两条岔路。左边阴暗潮湿，右边则传来微弱的风声。', position: {x: 350, y: 50}, next: 'choice1'},
        'choice1': { id: 'choice1', type: 'choice', content: '你选择走哪条路？', position: {x: 350, y: 180}, choices: [
            { text: '走向左边', next: 'scene_A1'},
            { text: '走向右边', next: 'scene_B1'}
        ]},
        'scene_A1': {id: 'scene_A1', type: 'scene', content: '你在左边的通道里发现一个熄灭的火把和一些火石。', position: {x: 150, y: 310}, next: 'choice2', effects: [{var: 'hasTorch', op: '=', val: 1}]},
        'scene_B1': {id: 'scene_B1', type: 'scene', content: '右边的通道通向一个悬崖，你发现前人留下的一条绳索。', position: {x: 550, y: 310}, next: 'choice2'},
        'choice2': {id: 'choice2', type: 'scene', content: '继续前进，你来到一个刻满壁画的大厅。一扇巨大的石门挡住了去路。', position: {x: 350, y: 440}, next: 'choice3'},
        'choice3': {id: 'choice3', type: 'choice', content: '石门旁有一个锁孔和一个凹槽。', position: {x: 350, y: 570}, choices: [
            { text: '用火把照亮壁画', next: 'scene_C1', condition: {var: 'hasTorch', op: '==', val: 1} },
            { text: '尝试打开石门', next: 'scene_C2' }
        ]},
        'scene_C1': {id: 'scene_C1', type: 'scene', content: '火光下，壁画浮现出隐藏的图案，你根据图案解开了机关，找到了一把古老的钥匙。', position: {x: 150, y: 700}, next: 'ending_A', effects: [{var: 'hasKey', op: '=', val: 1}]},
        'scene_C2': {id: 'scene_C2', type: 'scene', content: '你无法打开石门，只能在壁画大厅里寻找其他线索。', position: {x: 550, y: 700}, next: 'ending_B'},
        'ending_A': {id: 'ending_A', type: 'ending', content: '结局：神殿的秘密。你用钥匙打开了石门，神殿深处的宝藏在向你招手。', position: {x: 150, y: 830}},
        'ending_B': {id: 'ending_B', type: 'ending', content: '结局：止步于此。由于缺少关键道具，你的探索到此为止。', position: {x: 550, y: 830}}
    }
  },
    {
    id: 'preset4',
    title: '科幻末日：方舟计划',
    type: '科幻',
    description: '展示道德选择和生存分支',
    variables: [ { id: 'moralScore', name: '人性值', initialValue: 100, icon: 'shield' }, { id: 'survivors', name: '幸存者数量', initialValue: 5, icon: 'users' }],
    nodes: {
      'start': { id: 'start', type: 'scene', content: '警报响起，你的地下避难所资源即将耗尽。此时，雷达上出现一个信号，可能是一个物资点，也可能是一个陷阱。', position: {x: 450, y: 50}, next: 'choice1' },
      'choice1': { id: 'choice1', type: 'choice', content: '作为指挥官，你决定：', position: {x: 450, y: 180}, choices: [
        { text: '派小队前往侦察', next: 'scene_A1' },
        { text: '为求稳妥，固守基地', next: 'scene_B1' }
      ]},
      'scene_A1': { id: 'scene_A1', type: 'scene', content: '侦察小队回报，那是一个废弃的医院，里面有药品，但也有一些奇怪的感染生物。他们还发现了一个躲藏的幸存者家庭。', position: {x: 250, y: 310}, next: 'choice2' },
      'scene_B1': { id: 'scene_B1', type: 'scene', content: '固守基地的决定让大家暂时安全，但资源危机日益严重，士气低落。', position: {x: 650, y: 310}, next: 'ending_B' },
      'choice2': {id: 'choice2', type: 'choice', content: '如何处理幸存者家庭？', position: {x: 250, y: 440}, choices: [
        { text: '带上他们，但会消耗更多资源', next: 'scene_C1', effects: [{var: 'moralScore', op: '+', val: 20}, {var: 'survivors', op: '+', val: 3}] },
        { text: '留下物资，让他们自生自灭', next: 'scene_C2', effects: [{var: 'moralScore', op: '-', val: 30}] }
      ]},
      'scene_C1': { id: 'scene_C1', type: 'scene', content: '你的决定提升了团队的凝聚力。虽然资源紧张，但人性的光辉让大家看到了希望。', position: {x: 50, y: 570}, next: 'ending_A'},
      'scene_C2': { id: 'scene_C2', type: 'scene', content: '你带回了药品，但抛弃幸存者的行为让一些队员感到不安，团队内部出现了裂痕。', position: {x: 450, y: 570}, next: 'ending_C'},
      'ending_A': {id: 'ending_A', type: 'ending', content: '结局：人性的方舟。你保留了文明的火种，为人类的未来赢得了机会。', position: {x: 50, y: 700}},
      'ending_B': {id: 'ending_B', type: 'ending', content: '结局：坐以待毙。在绝望中，避难所的资源最终耗尽。', position: {x: 650, y: 440}},
      'ending_C': {id: 'ending_C', type: 'ending', content: '结局：冷酷的生存。你获得了生存的物资，却失去了团队的信任和人性。', position: {x: 450, y: 700}}
    }
  }
];
