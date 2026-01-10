package com.example.vocabulary;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExampleSentenceService {

    private final Map<String, List<Map<String, String>>> exampleDatabase;

    public ExampleSentenceService() {
        this.exampleDatabase = new HashMap<>();
        initializeExampleDatabase();
    }

    /**
     * 初始化例句数据库
     * 包含常见单词的例句
     */
    private void initializeExampleDatabase() {
        // abandon
        addExamples("abandon",
            "He decided to abandon the project halfway.", "他决定中途放弃这个项目。",
            "Never abandon hope, even in difficult times.", "即使在困难时期，也永远不要放弃希望。",
            "The sailors had to abandon the sinking ship.", "水手们不得不弃沉船逃生。",
            "Please do not abandon your responsibilities.", "请不要放弃你的责任。",
            "The city was abandoned after the earthquake.", "地震后这座城市被遗弃了。"
        );

        // ability
        addExamples("ability",
            "She has the ability to solve complex problems.", "她有解决复杂问题的能力。",
            "His ability to speak three languages is impressive.", "他会说三种语言的能力令人印象深刻。",
            "We should develop our abilities continuously.", "我们应该不断发展我们的能力。",
            "Ability alone is not enough; hard work matters too.", "光有能力是不够的；努力也很重要。",
            "The team showed great ability under pressure.", "团队在压力下展现了出色的能力。"
        );

        // able
        addExamples("able",
            "I am able to finish the work on time.", "我能按时完成工作。",
            "She is able to play the piano very well.", "她很擅长弹钢琴。",
            "Will you be able to attend the meeting tomorrow?", "明天你能参加会议吗？",
            "He is able to speak English fluently.", "他能流利地说英语。",
            "We were able to solve the problem together.", "我们能够一起解决这个问题。"
        );

        // about
        addExamples("about",
            "Tell me about your family.", "告诉我关于你家人的事。",
            "The book is about history of China.", "这本书是关于中国历史的。",
            "I was about to leave when you called.", "你打电话来的时候我正准备离开。",
            "What are you thinking about?", "你在想什么？",
            "She knows a lot about art.", "她很懂艺术。"
        );

        // above
        addExamples("above",
            "The plane flew above the clouds.", "飞机在云层上方飞行。",
            "The temperature is above average today.", "今天的气温高于平均水平。",
            "Put the vase above the shelf.", "把花瓶放在架子上面。",
            "Her grades are above the class average.", "她的成绩高于班级平均分。",
            "Values above 100 are not allowed.", "不允许大于100的值。"
        );

        // accept
        addExamples("accept",
            "I accept your apology.", "我接受你的道歉。",
            "She decided to accept the job offer.", "她决定接受这份工作。",
            "Please accept this gift as a token of gratitude.", "请收下这份礼物表示感谢。",
            "We cannot accept late submissions.", "我们不能接受迟交的作品。",
            "He learned to accept defeat gracefully.", "他学会了优雅地接受失败。"
        );

        // accident
        addExamples("accident",
            "He was injured in a car accident.", "他在车祸中受伤了。",
            "The accident happened at midnight.", "事故发生在午夜。",
            "Carelessness often leads to accidents.", "粗心大意经常导致事故。",
            "Fortunately, no one was hurt in the accident.", "幸运的是，事故中没有人受伤。",
            "Traffic accidents can be prevented.", "交通事故是可以预防的。"
        );

        // account
        addExamples("account",
            "I need to open a bank account.", "我需要开一个银行账户。",
            "Please give a detailed account of the incident.", "请详细说明这起事件。",
            "Her account balance is very low.", "她的账户余额很低。",
            "Take into account all factors before deciding.", "做决定前要考虑所有因素。",
            "He created a new email account.", "他创建了一个新的电子邮件账户。"
        );

        // achieve
        addExamples("achieve",
            "She worked hard to achieve her goals.", "她努力工作以实现她的目标。",
            "You can achieve anything if you try hard enough.", "如果你足够努力，你可以实现任何目标。",
            "The team achieved great success last year.", "团队去年取得了巨大的成功。",
            "It takes time to achieve mastery.", "达到精通需要时间。",
            "We must achieve better results next time.", "下次我们必须取得更好的结果。"
        );

        // across
        addExamples("across",
            "He walked across the street.", "他穿过了街道。",
            "The restaurant is just across the road.", "餐厅就在马路对面。",
            "They traveled across Europe.", "他们穿越欧洲旅行。",
            "She looked across the room at me.", "她隔着房间看着我。",
            "The news spread quickly across the country.", "新闻很快在全国传播开来。"
        );

        // act
        addExamples("act",
            "You need to act quickly.", "你需要迅速行动。",
            "She acted bravely in the crisis.", "她在危机中表现勇敢。",
            "Don't just speak, you must act.", "不要只说不做，你必须行动。",
            "He acted as if nothing had happened.", "他表现得好像什么都没发生一样。",
            "The play was acted by famous actors.", "这出戏由著名演员演出。"
        );

        // action
        addExamples("action",
            "Actions speak louder than words.", "行动胜于言语。",
            "We need to take immediate action.", "我们需要立即采取行动。",
            "The movie was full of exciting action scenes.", "这部电影充满了刺激的动作场面。",
            "Her quick action saved the day.", "她的迅速行动扭转了局面。",
            "Think before you take action.", "行动前要三思。"
        );

        // active
        addExamples("active",
            "She leads an active lifestyle.", "她过着积极的生活方式。",
            "He is very active in school activities.", "他积极参加学校活动。",
            "The volcano is still active.", "这座火山仍然活跃。",
            "Stay active to maintain good health.", "保持活跃以维持健康。",
            "She is an active member of the community.", "她是社区的积极成员。"
        );

        // actual
        addExamples("actual",
            "The actual cost was higher than expected.", "实际成本比预期的要高。",
            "This is the actual reason for his departure.", "这是他离开的真实原因。",
            "What were the actual results?", "实际结果是什么？",
            "The story is based on actual events.", "这个故事是根据真实事件改编的。",
            "Let me show you the actual product.", "让我给你看实际的产品。"
        );

        // add
        addExamples("add",
            "Please add some sugar to my coffee.", "请给我的咖啡加点糖。",
            "She added a new chapter to the book.", "她在书中加了一个新章节。",
            "If you add 5 and 3, you get 8.", "5加3等于8。",
            "Don't forget to add your signature.", "别忘了加上你的签名。",
            "The bad weather added to our difficulties.", "恶劣天气增加了我们的困难。"
        );

        // addition
        addExamples("addition",
            "In addition to English, she speaks French.", "除了英语，她还会说法语。",
            "The new product is a welcome addition.", "新产品是一个受欢迎的补充。",
            "He did the addition quickly in his head.", "他很快在脑子里完成了加法。",
            "There was an addition to the family.", "家庭里添了新成员。",
            "In addition, we need more resources.", "此外，我们需要更多资源。"
        );

        // additional
        addExamples("additional",
            "We need additional funding for the project.", "我们需要额外的项目资金。",
            "Please provide additional information.", "请提供更多信息。",
            "There is an additional charge for extra luggage.", "额外行李需要付费。",
            "She requested additional time to complete the task.", "她请求额外时间来完成这项任务。",
            "The store offers additional discounts on weekends.", "周末商店提供额外折扣。"
        );

        // address
        addExamples("address",
            "Please write your address clearly.", "请清楚地写下你的地址。",
            "He will address the meeting tomorrow.", "他明天将在会议上发表讲话。",
            "We need to address this problem immediately.", "我们需要立即解决这个问题。",
            "Her email address has changed.", "她的电子邮件地址变了。",
            "The president addressed the nation on TV.", "总统在电视上向全国发表讲话。"
        );

        // admit
        addExamples("admit",
            "He admitted his mistake.", "他承认了自己的错误。",
            "She refused to admit that she was wrong.", "她拒绝承认自己错了。",
            "The theater admits 500 people.", "这个剧场可容纳500人。",
            "I must admit I was surprised.", "我必须承认我很惊讶。",
            "Students must show ID to be admitted.", "学生必须出示证件才能进入。"
        );

        // advance
        addExamples("advance",
            "Technology continues to advance rapidly.", "技术继续快速发展。",
            "She received an advance on her salary.", "她预支了部分工资。",
            "We need to plan ahead and advance carefully.", "我们需要提前计划并谨慎推进。",
            "The army made a rapid advance.", "军队迅速推进。",
            "Please let me know in advance if you can't come.", "如果不能来请提前通知我。"
        );

        // advantage
        addExamples("advantage",
            "She has the advantage of experience.", "她有经验的优势。",
            "What are the advantages of this plan?", "这个计划有什么优点？",
            "He took advantage of the opportunity.", "他利用了这个机会。",
            "Speed is our main advantage.", "速度是我们主要的优势。",
            "There is no advantage in complaining.", "抱怨没有任何好处。"
        );

        // advice
        addExamples("advice",
            "Can you give me some advice?", "你能给我一些建议吗？",
            "She followed her teacher's advice.", "她听从了老师的建议。",
            "His advice was very helpful.", "他的建议很有帮助。",
            "I need some advice on buying a car.", "我需要一些买车的建议。",
            "Take my advice and don't do it.", "听我的劝，别这么做。"
        );

        // advise
        addExamples("advise",
            "I advise you to be careful.", "我建议你小心。",
            "The doctor advised him to rest.", "医生建议他休息。",
            "Can you advise me on this matter?", "在这件事上你能给我建议吗？",
            "She advises the company on strategy.", "她在战略方面为公司提供建议。",
            "I was advised not to go there alone.", "有人建议我不要独自去那里。"
        );

        // afford
        addExamples("afford",
            "I can't afford a new car right now.", "我现在买不起新车。",
            "We can't afford to make mistakes.", "我们承担不起犯错。",
            "She can afford to travel abroad.", "她负担得起出国旅行。",
            "Can you afford the time for this project?", "你能抽出时间做这个项目吗？",
            "They couldn't afford the expensive treatment.", "他们负担不起昂贵的治疗。"
        );

        // afraid
        addExamples("afraid",
            "Don't be afraid of making mistakes.", "别害怕犯错。",
            "She is afraid of spiders.", "她害怕蜘蛛。",
            "I'm afraid I can't help you.", "恐怕我帮不了你。",
            "He was afraid to speak in public.", "他不敢在公共场合说话。",
            "Are you afraid of the dark?", "你怕黑吗？"
        );

        // agree
        addExamples("agree",
            "I agree with your opinion.", "我同意你的观点。",
            "They couldn't agree on a plan.", "他们无法就计划达成一致。",
            "She agreed to help us.", "她同意帮助我们。",
            "We finally agreed on the price.", "我们终于在价格上达成一致。",
            "Do you agree with this decision?", "你同意这个决定吗？"
        );

        // agreement
        addExamples("agreement",
            "They reached a mutual agreement.", "他们达成了共识。",
            "Please sign the agreement.", "请在协议上签字。",
            "The agreement takes effect next month.", "协议下个月生效。",
            "We have an agreement to share the costs.", "我们有分担成本的协议。",
            "Breaking the agreement has consequences.", "违反协议会有后果。"
        );

        // allow
        addExamples("allow",
            "Please allow me to explain.", "请允许我解释。",
            "The rules don't allow smoking here.", "规定禁止在这里吸烟。",
            "Her parents allowed her to go to the party.", "她的父母允许她去参加聚会。",
            "Time allows for careful consideration.", "时间允许仔细考虑。",
            "The window allows fresh air to enter.", "窗户让新鲜空气进入。"
        );

        // almost
        addExamples("almost",
            "I'm almost finished with my homework.", "我的作业快完成了。",
            "It's almost time to leave.", "快到离开的时间了。",
            "She almost missed the bus.", "她差点错过公交车。",
            "The project is almost complete.", "项目几乎完成了。",
            "He knows almost everyone in town.", "他几乎认识镇上的每个人。"
        );

        // alone
        addExamples("alone",
            "I prefer to be alone when I study.", "我学习时更喜欢一个人。",
            "She lived alone for many years.", "她独自生活了很多年。",
            "You cannot do it alone.", "你一个人做不到。",
            "Let him be alone for a while.", "让他独自待一会儿。",
            "The dog was left alone at home.", "狗被独自留在了家里。"
        );

        // along
        addExamples("along",
            "Walk along the river.", "沿着河边走。",
            "She came along with us.", "她和我们一起来。",
            "We drove along the coast.", "我们沿着海岸开车。",
            "He hummed a tune as he walked along.", "他边走边哼着曲子。",
            "The path runs along the edge of the forest.", "小路沿着森林边缘延伸。"
        );

        // already
        addExamples("already",
            "I have already finished my breakfast.", "我已经吃完早餐了。",
            "It's already too late.", "已经太晚了。",
            "She is already there.", "她已经到了。",
            "We already knew about the news.", "我们已经知道这个消息了。",
            "The meeting is already over.", "会议已经结束了。"
        );

        // also
        addExamples("also",
            "She speaks English and also French.", "她说英语，也会说法语。",
            "I also want to go.", "我也想去。",
            "He is smart and also kind.", "他既聪明又善良。",
            "The hotel has a pool and also a gym.", "这家酒店有游泳池，还有健身房。",
            "Not only him, but also his brother came.", "不仅他来了，他兄弟也来了。"
        );

        // although
        addExamples("although",
            "Although it was raining, we went out.", "虽然下雨，我们还是出去了。",
            "Although she is young, she is very capable.", "虽然她年轻，但很有能力。",
            "I enjoyed the movie, although it was long.", "虽然电影很长，但我很喜欢。",
            "Although he tried hard, he failed.", "虽然他很努力，但还是失败了。",
            "Although the car is old, it runs well.", "虽然车旧了，但跑得很好。"
        );

        // always
        addExamples("always",
            "She always arrives on time.", "她总是准时到达。",
            "I will always remember you.", "我会永远记得你。",
            "He is always happy to help.", "他总是乐于助人。",
            "They always argue about money.", "他们总是因为钱争吵。",
            "The sun always rises in the east.", "太阳总是从东方升起。"
        );

        // among
        addExamples("among",
            "She is the most talented among us.", "她是我们中最有才华的。",
            "The decision was made among the team members.", "决定是由团队成员共同做出的。",
            "He is popular among his classmates.", "他在同学中很受欢迎。",
            "Divide the money among the three of you.", "钱你们三个人分。",
            "Choose among these options.", "在这些选项中选择。"
        );

        // amount
        addExamples("amount",
            "A large amount of money was donated.", "捐赠了一大笔钱。",
            "The amount of work is overwhelming.", "工作量很大。",
            "We need a significant amount of time.", "我们需要相当多的时间。",
            "Pay the exact amount shown.", "支付显示的确切金额。",
            "The amount of rainfall has increased.", "降雨量增加了。"
        );

        // ancient
        addExamples("ancient",
            "Rome is an ancient city.", "罗马是一座古城。",
            "They studied ancient history.", "他们研究古代历史。",
            "The ancient monument is well preserved.", "这座古代纪念碑保存完好。",
            "Ancient civilizations had great achievements.", "古代文明有伟大的成就。",
            "This is an ancient tradition.", "这是一个古老的传统。"
        );

        // angry
        addExamples("angry",
            "He was angry about the delay.", "他对延误感到愤怒。",
            "Don't be angry with me.", "别生我的气。",
            "She looked angry when she heard the news.", "听到这个消息时，她看起来很生气。",
            "Why are you so angry?", "你为什么这么生气？",
            "His angry words hurt everyone.", "他愤怒的话伤害了所有人。"
        );

        // animal
        addExamples("animal",
            "The zoo has many rare animals.", "动物园有很多稀有动物。",
            "Dogs are loyal animals.", "狗是忠诚的动物。",
            "She loves all kinds of animals.", "她喜欢各种动物。",
            "Wild animals need protection.", "野生动物需要保护。",
            "This is the largest animal on earth.", "这是地球上最大的动物。"
        );

        // another
        addExamples("another",
            "Would you like another cup of coffee?", "你想再来一杯咖啡吗？",
            "Let's try another approach.", "让我们试试另一种方法。",
            "She waited for another hour.", "她又等了一个小时。",
            "One person after another left the room.", "人们一个接一个地离开了房间。",
            "Can you give me another example?", "你能再给我一个例子吗？"
        );

        // answer
        addExamples("answer",
            "Please answer my question.", "请回答我的问题。",
            "She gave a good answer.", "她给出了一个很好的回答。",
            "I don't know the answer.", "我不知道答案。",
            "The answer is simple.", "答案很简单。",
            "He answered the phone quickly.", "他很快接了电话。"
        );

        // appear
        addExamples("appear",
            "She appeared at the party unexpectedly.", "她意外地出现在聚会上。",
            "It appears that it will rain.", "看起来要下雨了。",
            "Stars appear in the night sky.", "星星出现在夜空中。",
            "He appears to be happy.", "他看起来很开心。",
            "A new menu appears when you click.", "点击时会出现一个新菜单。"
        );

        // area
        addExamples("area",
            "This is a residential area.", "这是一个住宅区。",
            "The area covers 100 square kilometers.", "这个区域覆盖100平方公里。",
            "We need to improve this area.", "我们需要改善这个区域。",
            "There is a large parking area nearby.", "附近有一个很大的停车区。",
            "She is an expert in this area.", "她是这个领域的专家。"
        );

        // argue
        addExamples("argue",
            "They argued about politics all night.", "他们整晚都在争论政治。",
            "Don't argue with your parents.", "不要和父母争吵。",
            "She argued that the plan was flawed.", "她认为这个计划有缺陷。",
            "He likes to argue for fun.", "他喜欢为了好玩而争论。",
            "We need to argue our case clearly.", "我们需要清楚地陈述我们的观点。"
        );

        // arm
        addExamples("arm",
            "She broke her arm in the fall.", "她摔倒时摔断了手臂。",
            "He stretched out his arm to help.", "他伸出手臂去帮忙。",
            "The army is well armed.", "军队装备精良。",
            "She folded her arms across her chest.", "她双臂抱胸。",
            "Please arm yourself with patience.", "请用耐心武装自己。"
        );

        // army
        addExamples("army",
            "He joined the army at 18.", "他18岁参军了。",
            "The army won the battle.", "军队赢得了这场战斗。",
            "An army of ants marched across the floor.", "一群蚂蚁在地板上行进。",
            "She has a standing army of supporters.", "她有一大批坚定的支持者。",
            "The army protects the country.", "军队保卫国家。"
        );

        // around
        addExamples("around",
            "The sun is around the earth.", "太阳绕着地球转（古时观点）。",
            "She looked around the room.", "她环顾房间。",
            "It takes about an hour to walk around the lake.", "绕湖走大约需要一个小时。",
            "People gathered around the fire.", "人们聚集在火堆周围。",
            "I'll be around if you need me.", "如果你需要我，我就在附近。"
        );

        // arrive
        addExamples("arrive",
            "We will arrive at 5 o'clock.", "我们将在5点到达。",
            "She arrived early for the meeting.", "她开会到得很早。",
            "The train arrived on time.", "火车准时到达。",
            "When did you arrive here?", "你什么时候到这儿的？",
            "The package finally arrived today.", "包裹今天终于到了。"
        );

        // art
        addExamples("art",
            "She has a passion for art.", "她对艺术充满热情。",
            "This museum displays beautiful art.", "这个博物馆展示精美的艺术品。",
            "Painting is a form of art.", "绘画是一种艺术形式。",
            "He studied art in college.", "他在大学学习艺术。",
            "Music and dance are also arts.", "音乐和舞蹈也是艺术。"
        );

        // article
        addExamples("article",
            "I read an interesting article today.", "我今天读了一篇有趣的文章。",
            "She wrote an article for the newspaper.", "她为报纸写了一篇文章。",
            "The article discusses climate change.", "这篇文章讨论气候变化。",
            "Please read the article carefully.", "请仔细阅读这篇文章。",
            "The article was published last week.", "这篇文章上周发表了。"
        );

        // artist
        addExamples("artist",
            "She is a talented artist.", "她是一位有才华的艺术家。",
            "The artist painted a beautiful portrait.", "艺术家画了一幅美丽的肖像。",
            "Many artists struggle financially.", "许多艺术家在财务上很困难。",
            "He wants to become a famous artist.", "他想成为著名的艺术家。",
            "The artist's work is displayed in the gallery.", "艺术家的作品在画廊展出。"
        );

        // as
        addExamples("as",
            "She works as a teacher.", "她是一名教师。",
            "As I mentioned, this is important.", "正如我提到的，这很重要。",
            "Do as I say.", "照我说的做。",
            "He is as tall as his father.", "他和他的父亲一样高。",
            "As time passed, things changed.", "随着时间的推移，事情发生了变化。"
        );

        // ask
        addExamples("ask",
            "Can I ask you a question?", "我可以问你一个问题吗？",
            "She asked for help.", "她请求帮助。",
            "Don't ask me why.", "别问我为什么。",
            "He asked her to marry him.", "他向她求婚。",
            "Please ask the teacher for permission.", "请向老师申请许可。"
        );

        // at
        addExamples("at",
            "We met at the station.", "我们在车站见面。",
            "She arrived at noon.", "她中午到达。",
            "Look at the blackboard.", "看黑板。",
            "He is good at math.", "他擅长数学。",
            "The party starts at 8 PM.", "聚会晚上8点开始。"
        );

        // attack
        addExamples("attack",
            "The dog attacked the stranger.", "狗袭击了陌生人。",
            "The army launched an attack.", "军队发动了攻击。",
            "He suffered a heart attack.", "他心脏病发作。",
            "The virus attacks the immune system.", "病毒攻击免疫系统。",
            "We must defend against potential attacks.", "我们必须防御潜在攻击。"
        );

        // attempt
        addExamples("attempt",
            "She made an attempt to climb the mountain.", "她尝试攀登那座山。",
            "His first attempt failed.", "他的第一次尝试失败了。",
            "Don't attempt to do it alone.", "不要尝试独自做这件事。",
            "The rescue attempt was successful.", "救援尝试成功了。",
            "Another attempt will be made tomorrow.", "明天将再次尝试。"
        );

        // attend
        addExamples("attend",
            "Please attend the meeting.", "请参加会议。",
            "She attends university in London.", "她在伦敦上大学。",
            "Did you attend the party?", "你参加聚会了吗？",
            "The doctor attended to the patient.", "医生治疗病人。",
            "We need to attend to this matter.", "我们需要处理这件事。"
        );

        // attention
        addExamples("attention",
            "Please pay attention to what I'm saying.", "请注意我说的话。",
            "The child needs more attention.", "这个孩子需要更多关注。",
            "Don't distract my attention.", "不要分散我的注意力。",
            "Her dress attracted a lot of attention.", "她的连衣裙吸引了很多目光。",
            "This matter requires your immediate attention.", "这件事需要你立即关注。"
        );

        // attitude
        addExamples("attitude",
            "She has a positive attitude.", "她有积极的态度。",
            "His attitude towards work is admirable.", "他对工作的态度值得钦佩。",
            "We need to change our attitude.", "我们需要改变态度。",
            "A good attitude leads to success.", "良好的态度导致成功。",
            "Don't give me that attitude.", "别给我那种态度。"
        );

        // attract
        addExamples("attract",
            "The beautiful garden attracts many visitors.", "美丽的花园吸引了很多游客。",
            "He tried to attract her attention.", "他试图引起她的注意。",
            "Flowers attract bees.", "花朵吸引蜜蜂。",
            "The company wants to attract more customers.", "公司想吸引更多客户。",
            "Her charm attracts people.", "她的魅力吸引人们。"
        );

        // audience
        addExamples("audience",
            "The audience applauded loudly.", "观众热烈鼓掌。",
            "She spoke to a large audience.", "她向大批观众讲话。",
            "The TV show has a wide audience.", "这个电视节目有广泛的观众。",
            "The audience laughed at his jokes.", "观众被他的笑话逗笑了。",
            "Please address the audience directly.", "请直接对观众讲话。"
        );

        // author
        addExamples("author",
            "She is the author of this book.", "她是这本书的作者。",
            "The author signed copies of his book.", "作者在他的书上签名。",
            "Many famous authors lived here.", "许多著名作家曾住在这里。",
            "He wants to be a successful author.", "他想成为一名成功的作家。",
            "The author's writing style is unique.", "这位作者的写作风格很独特。"
        );

        // available
        addExamples("available",
            "Is this seat available?", "这个座位有人坐吗？",
            "She is available for meetings tomorrow.", "她明天有空开会。",
            "The product is not available in stores.", "这种商品在商店买不到。",
            "Do you have any available rooms?", "你们有空的房间吗？",
            "All information is available online.", "所有信息都可以在网上查到。"
        );

        // average
        addExamples("average",
            "The average temperature is 25 degrees.", "平均气温是25度。",
            "He is of average height.", "他的身高中等。",
            "The class scored above average.", "班级成绩高于平均水平。",
            "On average, we spend two hours a day on homework.", "平均来说，我们每天花两小时做作业。",
            "This is just an average result.", "这只是一个普通的结果。"
        );

        // avoid
        addExamples("avoid",
            "Try to avoid unnecessary risks.", "尽量避免不必要的风险。",
            "She avoids eating meat.", "她避免吃肉。",
            "We should avoid making the same mistake.", "我们应该避免犯同样的错误。",
            "He avoided answering the question.", "他避而不答这个问题。",
            "To avoid traffic, leave early.", "为了避免堵车，早点出发。"
        );

        // awake
        addExamples("awake",
            "I was still awake at midnight.", "午夜时我还醒着。",
            "Please stay awake while driving.", "开车时请保持清醒。",
            "The noise kept him awake.", "噪音让他睡不着。",
            "She lay awake thinking about the problem.", "她躺在床上思考问题，睡不着。",
            "The baby is finally awake.", "宝宝终于醒了。"
        );

        // away
        addExamples("away",
            "He went away on a trip.", "他去旅行了。",
            "Keep the children away from the fire.", "让孩子远离火。",
            "She lives far away from here.", "她住得离这里很远。",
            "Don't throw it away.", "别把它扔掉。",
            "The summer is still months away.", "夏天还有好几个月呢。"
        );
    }

    /**
     * 添加例句到数据库
     */
    private void addExamples(String word, String... examples) {
        List<Map<String, String>> exampleList = new ArrayList<>();
        for (int i = 0; i < examples.length; i += 2) {
            if (i + 1 < examples.length) {
                Map<String, String> example = new HashMap<>();
                example.put("english", examples[i]);
                example.put("chinese", examples[i + 1]);
                exampleList.add(example);
            }
        }
        exampleDatabase.put(word.toLowerCase(), exampleList);
    }

    /**
     * 获取单词的例句
     * @param word 单词
     * @return 例句列表
     */
    public List<Map<String, String>> getExamples(String word) {
        if (word == null || word.trim().isEmpty()) {
            return new ArrayList<>();
        }

        // 提取纯英文单词
        String cleanWord = extractEnglishWord(word);

        List<Map<String, String>> examples = exampleDatabase.get(cleanWord.toLowerCase());
        if (examples == null) {
            // 如果没有找到，返回一个占位符消息
            return new ArrayList<>();
        }

        return examples;
    }

    /**
     * 检查单词是否有例句
     */
    public boolean hasExamples(String word) {
        if (word == null || word.trim().isEmpty()) {
            return false;
        }
        String cleanWord = extractEnglishWord(word);
        return exampleDatabase.containsKey(cleanWord.toLowerCase());
    }

    /**
     * 从单词字符串中提取纯英文单词
     */
    private String extractEnglishWord(String wordText) {
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("^([a-zA-Z]+)");
        java.util.regex.Matcher matcher = pattern.matcher(wordText);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return wordText;
    }
}
