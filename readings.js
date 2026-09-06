const READINGS = [
  {
    id: "aur-2-1",
    src: "Marcus Aurelius · Meditations 2.1",
    text: "Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil. But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, and the nature of him who does wrong, that it is akin to me — I can neither be injured by any of them, nor can I be angry with my kinsman, nor hate him.",
  },
  {
    id: "aur-4-3",
    src: "Marcus Aurelius · Meditations 4.3",
    text: "Men seek retreats for themselves, houses in the country, sea-shores, and mountains; and thou too art wont to desire such things very much. But this is altogether a mark of the most common sort of men, for it is in thy power whenever thou shalt choose to retire into thyself. For nowhere either with more quiet or more freedom from trouble does a man retire than into his own soul.",
  },
  {
    id: "aur-8-47",
    src: "Marcus Aurelius · Meditations 8.47",
    text: "If thou art pained by any external thing, it is not this thing that disturbs thee, but thy own judgment about it. And it is in thy power to wipe out this judgment now. If thou art pained because thou art not doing some particular thing that seems to thee to be right, why dost thou not rather act than complain?",
  },
  {
    id: "aur-5-11",
    src: "Marcus Aurelius · Meditations 5.11",
    text: "There is no man so fortunate that there shall not be by him some who are pleased to see him in a fall. Wilt thou then be angry with him whose nature it is to do this? As well be angry with the fig-tree for yielding juice. Remember that thou art a man, and a Roman, and a ruler, and that these things have happened to thee.",
  },
  {
    id: "sen-short",
    src: "Seneca · On the Shortness of Life",
    text: "It is not that we have a short space of time, but that we waste much of it. Life is long enough, and it has been given in sufficiently generous measure to allow the accomplishment of the very greatest things if the whole of it is well invested. But when it is squandered in luxury and carelessness, when it is devoted to no good end, forced at last by the ultimate necessity we perceive that it has passed away before we were aware that it was passing.",
  },
  {
    id: "sen-7",
    src: "Seneca · Letters 7",
    text: "Do you ask me what you should regard as especially to be avoided? I say, crowds; for as yet you cannot trust yourself to them with safety. I shall never be ashamed of the witness of bad men. I want my life to be a life of my own, not a public show. To consort with the crowd is harmful; there is no one who does not make some vice attractive to us, or stamp it upon us, or taint us unconsciously therewith.",
  },
  {
    id: "sen-calm",
    src: "Seneca · On Tranquillity",
    text: "We are all chained to fortune. Some are bound by a loose and golden chain, others by a tight one of base metal; but what does it matter? The same prison surrounds all of us, and others are fettered even as we are. Withdraw into yourself, as far as you can. Associate with those who will make a better man of you. Choose those whose development you can promote. The process is mutual; for men learn while they teach.",
  },
  {
    id: "ecc-1",
    src: "Ecclesiastes 1:13–14",
    text: "And I gave my heart to seek and search out by wisdom concerning all things that are done under heaven: this sore travail hath God given to the sons of man to be exercised therewith. I have seen all the works that are done under the sun; and, behold, all is vanity and vexation of spirit.",
  },
  {
    id: "ecc-3",
    src: "Ecclesiastes 3:1, 7",
    text: "To every thing there is a season, and a time to every purpose under the heaven: a time to rend, and a time to sew; a time to keep silence, and a time to speak.",
  },
  {
    id: "ecc-4",
    src: "Ecclesiastes 4:9–12",
    text: "Two are better than one; because they have a good reward for their labour. For if they fall, the first will lift up his fellow: but woe to him that is alone when he falleth; for he hath not another to help him up. And if one prevail against him, two shall withstand him; and a threefold cord is not quickly broken.",
  },
  {
    id: "prov-4",
    src: "Proverbs 4:23–24",
    text: "Keep thy heart with all diligence; for out of it are the issues of life. Put away from thee a froward mouth, and perverse lips put far from thee.",
  },
  {
    id: "prov-17",
    src: "Proverbs 17:1, 27",
    text: "Better is a dry morsel, and quietness therewith, than an house full of sacrifices with strife. He that hath knowledge spareth his words: and a man of understanding is of an excellent spirit.",
  },
  {
    id: "amos-5",
    src: "Amos 5:13–15",
    text: "Therefore the prudent shall keep silence in that time; for it is an evil time. Seek good, and not evil, that ye may live: and so the Lord, the God of hosts, shall be with you, as ye have spoken. Hate the evil, and love the good, and establish judgment in the gate.",
  },
  {
    id: "matt-6",
    src: "Matthew 6:6, 9–11",
    text: "But thou, when thou prayest, enter into thy closet, and when thou hast shut thy door, pray to thy Father which is in secret. After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name. Thy kingdom come. Thy will be done in earth, as it is in heaven. Give us this day our daily bread.",
  },
  {
    id: "matt-26",
    src: "Matthew 26:38–39",
    text: "Then saith he unto them, My soul is exceeding sorrowful, even unto death: tarry ye here, and watch with me. And he went a little farther, and fell on his face, and prayed, saying, O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt.",
  },
  {
    id: "rom-12",
    src: "Romans 12:2, 12, 18",
    text: "And be not conformed to this world: but be ye transformed by the renewing of your mind. Rejoicing in hope; patient in tribulation; continuing instant in prayer. If it be possible, as much as lieth in you, live peaceably with all men.",
  },
  {
    id: "th-4",
    src: "1 Thessalonians 4:11–12",
    text: "And that ye study to be quiet, and to do your own business, and to work with your own hands, as we commanded you; that ye may walk honestly toward them that are without, and that ye may have lack of nothing.",
  },
  {
    id: "pet-2",
    src: "1 Peter 2:11–12",
    text: "Dearly beloved, I beseech you as strangers and pilgrims, abstain from fleshly lusts, which war against the soul; having your conversation honest among the Gentiles: that, whereas they speak against you as evildoers, they may by your good works, which they shall behold, glorify God in the day of visitation.",
  },
  {
    id: "mic-6",
    src: "Micah 6:8",
    text: "He hath shewed thee, O man, what is good; and what doth the Lord require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?",
  },
  {
    id: "ps-46",
    src: "Psalm 46:10",
    text: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.",
  },
  {
    id: "jas-1",
    src: "James 1:19–20",
    text: "Wherefore, my beloved brethren, let every man be swift to hear, slow to speak, slow to wrath: for the wrath of man worketh not the righteousness of God.",
  },
];

const READING_PT = {
  "aur-2-1": {
    src: "Marco Aurélio · Meditações 2.1",
    text: "Começa a manhã dizendo a ti mesmo: encontrarei o intrometido, o ingrato, o arrogante, o enganador, o invejoso, o insociável. Tudo isso lhes acontece por ignorância do bem e do mal. Mas eu, que vi a natureza do bem — que é belo — e do mal — que é feio — e a natureza do que erra, que é da minha espécie, não posso ser ferido por nenhum deles, nem irar-me contra o meu parente, nem odiá-lo.",
  },
  "aur-4-3": {
    src: "Marco Aurélio · Meditações 4.3",
    text: "Os homens buscam refúgios para si, casas no campo, praias e montanhas; e tu também costumas desejá-los. Mas isso é próprio dos mais vulgares, pois está em teu poder, quando quiseres, recolher-te a ti mesmo. Em parte nenhuma o homem se recolhe com mais quietude e liberdade de perturbação do que na própria alma.",
  },
  "aur-8-47": {
    src: "Marco Aurélio · Meditações 8.47",
    text: "Se alguma coisa externa te dói, não é ela que te perturba, mas o teu juízo a respeito dela. E está em teu poder apagar agora esse juízo. Se te dói não fazeres alguma coisa que te parece certa, por que te queixas em vez de agir?",
  },
  "aur-5-11": {
    src: "Marco Aurélio · Meditações 5.11",
    text: "Não há homem tão afortunado que não haja junto dele quem se alegre em vê-lo cair. Irar-te-ás então com aquele cuja natureza é fazer isso? Tão bem irar-te-ias com a figueira por dar suco. Lembra-te de que és homem, e romano, e que estas coisas te aconteceram.",
  },
  "sen-short": {
    src: "Séneca · Da brevidade da vida",
    text: "Não é que tenhamos pouco tempo, é que desperdiçamos muito. A vida é bastante longa, e foi dada com medida generosa para as maiores coisas, se toda ela for bem empregada. Mas quando se esbanja no luxo e no descuido, quando a nenhum bom fim se dedica, percebemos tarde demais que passou antes de notarmos que passava.",
  },
  "sen-7": {
    src: "Séneca · Cartas 7",
    text: "Perguntas o que deves evitar sobretudo? Digo: as multidões; pois ainda não podes confiar-te a elas em segurança. Quero que a minha vida seja minha, não um espetáculo público. Convivir com a turba faz mal; não há quem não nos torne algum vício atraente, ou no-lo imprima, ou nos contamine sem o sabermos.",
  },
  "sen-calm": {
    src: "Séneca · Da tranquilidade",
    text: "Estamos todos acorrentados à fortuna. Uns por cadeia frouxa e de ouro, outros por uma estreita de metal vil; mas que importa? A mesma prisão nos cerca a todos. Recolhe-te a ti mesmo, quanto puderes. Junta-te a quem te faça melhor. O processo é mútuo: os homens aprendem enquanto ensinam.",
  },
  "ecc-1": {
    src: "Eclesiastes 1:13–14",
    text: "E apliquei o meu coração a esquadrinhar, e a informar-me com sabedoria de tudo quanto sucede debaixo do céu; esta enfadonha ocupação deu Deus aos filhos dos homens, para nela os exercitar. Atentei para todas as obras que se fazem debaixo do sol, e eis que tudo era vaidade e aflição de espírito.",
  },
  "ecc-3": {
    src: "Eclesiastes 3:1, 7",
    text: "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu: tempo de rasgar, e tempo de coser; tempo de estar calado, e tempo de falar.",
  },
  "ecc-4": {
    src: "Eclesiastes 4:9–12",
    text: "Melhor é serem dois do que um, porque têm melhor paga do seu trabalho. Porque se um cair, o outro levanta o seu companheiro; mas ai do que estiver só. E o cordão de três dobras não se quebra tão depressa.",
  },
  "prov-4": {
    src: "Provérbios 4:23–24",
    text: "Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as saídas da vida. Desvia de ti a distorção da boca, e alonga de ti a perversidade dos lábios.",
  },
  "prov-17": {
    src: "Provérbios 17:1, 27",
    text: "Melhor é um bocado seco, e com ele a tranquilidade, do que a casa cheia de vítimas, com contenda. O que possui o conhecimento reserva as suas palavras, e o homem de entendimento é de espírito precioso.",
  },
  "amos-5": {
    src: "Amós 5:13–15",
    text: "Portanto o que for prudente nesse tempo calará, porque o tempo é mau. Buscai o bem, e não o mal, para que vivais. Aborrecei o mal, e amai o bem, e estabelecei o juízo na porta.",
  },
  "matt-6": {
    src: "Mateus 6:6, 9–11",
    text: "Mas tu, quando orares, entra no teu aposento e, fechando a tua porta, ora a teu Pai que está em secreto. Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome. Venha o teu reino. Seja feita a tua vontade, tanto na terra como no céu. O pão nosso de cada dia nos dá hoje.",
  },
  "matt-26": {
    src: "Mateus 26:38–39",
    text: "Então lhes disse: A minha alma está cheia de tristeza até a morte; ficai aqui, e vigiai comigo. E, indo um pouco mais para diante, se prostrou sobre o seu rosto, orando e dizendo: Meu Pai, se é possível, passe de mim este cálice; todavia, não seja como eu quero, mas como tu queres.",
  },
  "rom-12": {
    src: "Romanos 12:2, 12, 18",
    text: "E não vos conformeis com este mundo, mas transformai-vos pela renovação do vosso entendimento. Alegrai-vos na esperança, sede pacientes na tribulação, perseverai na oração. Se for possível, quanto estiver em vós, tende paz com todos os homens.",
  },
  "th-4": {
    src: "1 Tessalonicenses 4:11–12",
    text: "E procurar viver quietos, e tratar dos vossos próprios negócios, e trabalhar com vossas próprias mãos, como já vo-lo temos mandado; para que andeis honestamente para com os que estão de fora, e não necessiteis de coisa alguma.",
  },
  "pet-2": {
    src: "1 Pedro 2:11–12",
    text: "Amados, peço-vos, como a peregrinos e forasteiros, que vos abstenhais das concupiscências carnais que combatem contra a alma; tendo o vosso viver honesto entre os gentios, para que, naquilo em que falam mal de vós, como de malfeitores, glorifiquem a Deus no dia da visitação, pelas boas obras que em vós observem.",
  },
  "mic-6": {
    src: "Miqueias 6:8",
    text: "Ele te declarou, ó homem, o que é bom; e que é o que o Senhor pede de ti, senão que pratiques a justiça, e ames a beneficência, e andes humildemente com o teu Deus?",
  },
  "ps-46": {
    src: "Salmo 46:10",
    text: "Aquietai-vos, e sabei que eu sou Deus; serei exaltado entre as nações; serei exaltado sobre a terra.",
  },
  "jas-1": {
    src: "Tiago 1:19–20",
    text: "Sabei isto, meus amados irmãos: Todo o homem seja pronto para ouvir, tardio para falar, tardio para se irar. Porque a ira do homem não opera a justiça de Deus.",
  },
};
