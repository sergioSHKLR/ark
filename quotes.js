const QUOTES = [
  {
    id: "heb-11-7",
    src: "Hebrews 11:7",
    text: "By faith Noah, being warned of God of things not seen as yet, moved with fear, prepared an ark to the saving of his house.",
    pt: {
      src: "Hebreus 11:7",
      text: "Pela fé Noé, divinamente avisado das coisas que ainda não se viam, temeu e, para salvação da sua família, preparou a arca.",
    },
  },
  {
    id: "pet-2-5",
    src: "2 Peter 2:5",
    text: "And spared not the old world, but saved Noah the eighth person, a preacher of righteousness, bringing in the flood upon the world of the ungodly.",
    pt: {
      src: "2 Pedro 2:5",
      text: "E não poupou o mundo antigo, mas guardou a Noé, o oitavo, pregoeiro da justiça, ao trazer o dilúvio sobre o mundo dos ímpios.",
    },
  },
  {
    id: "matt-24-37",
    src: "Matthew 24:37–39",
    text: "But as the days of Noe were, so shall also the coming of the Son of man be. They were eating and drinking, marrying and giving in marriage, until the day that Noe entered into the ark, and knew not until the flood came, and took them all away.",
    pt: {
      src: "Mateus 24:37–39",
      text: "E, como foi nos dias de Noé, assim será também a vinda do Filho do homem. Comiam, bebiam, casavam e davam-se em casamento, até ao dia em que Noé entrou na arca, e não o perceberam, até que veio o dilúvio, e os levou a todos.",
    },
  },
  {
    id: "matt-6-21",
    src: "Matthew 6:21",
    text: "For where your treasure is, there will your heart be also.",
    pt: {
      src: "Mateus 6:21",
      text: "Porque onde estiver o vosso tesouro, aí estará também o vosso coração.",
    },
  },
  {
    id: "matt-6-34",
    src: "Matthew 6:34",
    text: "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.",
    pt: {
      src: "Mateus 6:34",
      text: "Não vos inquieteis, pois, pelo dia de amanhã, porque o dia de amanhã cuidará de si mesmo. Basta a cada dia o seu mal.",
    },
  },
  {
    id: "john-16-33",
    src: "John 16:33",
    text: "In the world ye shall have tribulation: but be of good cheer; I have overcome the world.",
    pt: {
      src: "João 16:33",
      text: "No mundo tereis aflições, mas tende bom ânimo; eu venci o mundo.",
    },
  },
  {
    id: "phil-4-6",
    src: "Philippians 4:6–7",
    text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    pt: {
      src: "Filipenses 4:6–7",
      text: "Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.",
    },
  },
  {
    id: "phil-4-8",
    src: "Philippians 4:8",
    text: "Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things.",
    pt: {
      src: "Filipenses 4:8",
      text: "Quanto ao mais, irmãos, tudo o que é verdadeiro, tudo o que é honesto, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se há alguma virtude, e se há algum louvor, nisso pensai.",
    },
  },
  {
    id: "isa-26-3",
    src: "Isaiah 26:3",
    text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.",
    pt: {
      src: "Isaías 26:3",
      text: "Tu conservarás em paz aquele cuja mente está firme em ti; porque ele confia em ti.",
    },
  },
  {
    id: "ps-46-10",
    src: "Psalm 46:10",
    text: "Be still, and know that I am God.",
    pt: {
      src: "Salmo 46:10",
      text: "Aquietai-vos, e sabei que eu sou Deus.",
    },
  },
  {
    id: "ps-112-7",
    src: "Psalm 112:7",
    text: "He shall not be afraid of evil tidings: his heart is fixed, trusting in the Lord.",
    pt: {
      src: "Salmo 112:7",
      text: "Não temerá maus rumores; o seu coração está firme, confiado no Senhor.",
    },
  },
  {
    id: "ps-37-7",
    src: "Psalm 37:7",
    text: "Rest in the Lord, and wait patiently for him: fret not thyself because of him who prospereth in his way.",
    pt: {
      src: "Salmo 37:7",
      text: "Descansa no Senhor, e espera nele; não te indignes por causa daquele que prospera em seu caminho.",
    },
  },
  {
    id: "josh-1-9",
    src: "Joshua 1:9",
    text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.",
    pt: {
      src: "Josué 1:9",
      text: "Não to mandei eu? Esforça-te, e tem bom ânimo; não pasmes, nem te espantes, porque o Senhor teu Deus é contigo, por onde quer que andares.",
    },
  },
  {
    id: "rom-12-2",
    src: "Romans 12:2",
    text: "And be not conformed to this world: but be ye transformed by the renewing of your mind.",
    pt: {
      src: "Romanos 12:2",
      text: "E não vos conformeis com este mundo, mas transformai-vos pela renovação do vosso entendimento.",
    },
  },
  {
    id: "th-4-11",
    src: "1 Thessalonians 4:11",
    text: "And that ye study to be quiet, and to do your own business, and to work with your own hands, as we commanded you.",
    pt: {
      src: "1 Tessalonicenses 4:11",
      text: "E procurar viver quietos, e tratar dos vossos próprios negócios, e trabalhar com vossas próprias mãos, como já vo-lo temos mandado.",
    },
  },
  {
    id: "prov-4-23",
    src: "Proverbs 4:23",
    text: "Keep thy heart with all diligence; for out of it are the issues of life.",
    pt: {
      src: "Provérbios 4:23",
      text: "Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as saídas da vida.",
    },
  },
  {
    id: "prov-21-23",
    src: "Proverbs 21:23",
    text: "Whoso keepeth his mouth and his tongue keepeth his soul from troubles.",
    pt: {
      src: "Provérbios 21:23",
      text: "O que guarda a sua boca e a sua língua guarda a sua alma das angústias.",
    },
  },
  {
    id: "amos-5-13",
    src: "Amos 5:13",
    text: "Therefore the prudent shall keep silence in that time; for it is an evil time.",
    pt: {
      src: "Amós 5:13",
      text: "Portanto, o que for prudente nesse tempo calará, porque o tempo é mau.",
    },
  },
  {
    id: "prov-17-1",
    src: "Proverbs 17:1",
    text: "Better is a dry morsel, and quietness therewith, than an house full of sacrifices with strife.",
    pt: {
      src: "Provérbios 17:1",
      text: "Melhor é um bocado seco, e com ele a tranquilidade, do que a casa cheia de vítimas, com contenda.",
    },
  },
  {
    id: "ecc-4-9",
    src: "Ecclesiastes 4:9–10",
    text: "Two are better than one; because they have a good reward for their labour. For if they fall, the one will lift up his fellow.",
    pt: {
      src: "Eclesiastes 4:9–10",
      text: "Melhor é serem dois do que um, porque têm melhor paga do seu trabalho. Porque se um cair, o outro levanta o seu companheiro.",
    },
  },
  {
    id: "mic-6-8",
    src: "Micah 6:8",
    text: "He hath shewed thee, O man, what is good; and what doth the Lord require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?",
    pt: {
      src: "Miqueias 6:8",
      text: "Ele te declarou, ó homem, o que é bom; e que é o que o Senhor pede de ti, senão que pratiques a justiça, e ames a beneficência, e andes humildemente com o teu Deus?",
    },
  },
  {
    id: "jas-1-19",
    src: "James 1:19–20",
    text: "Let every man be swift to hear, slow to speak, slow to wrath: for the wrath of man worketh not the righteousness of God.",
    pt: {
      src: "Tiago 1:19–20",
      text: "Todo o homem seja pronto para ouvir, tardio para falar, tardio para se irar. Porque a ira do homem não opera a justiça de Deus.",
    },
  },
  {
    id: "isa-40-31",
    src: "Isaiah 40:31",
    text: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    pt: {
      src: "Isaías 40:31",
      text: "Mas os que esperam no Senhor renovarão as suas forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.",
    },
  },
  {
    id: "tim-1-7",
    src: "2 Timothy 1:7",
    text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
    pt: {
      src: "2 Timóteo 1:7",
      text: "Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.",
    },
  },
  {
    id: "col-3-2",
    src: "Colossians 3:2",
    text: "Set your affection on things above, not on things on the earth.",
    pt: {
      src: "Colossenses 3:2",
      text: "Pensai nas coisas que são de cima, e não nas que são da terra.",
    },
  },
  {
    id: "pet-5-7",
    src: "1 Peter 5:7",
    text: "Casting all your care upon him; for he careth for you.",
    pt: {
      src: "1 Pedro 5:7",
      text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.",
    },
  },
  {
    id: "luke-10-42",
    src: "Luke 10:41–42",
    text: "Martha, Martha, thou art careful and troubled about many things: but one thing is needful.",
    pt: {
      src: "Lucas 10:41–42",
      text: "Marta, Marta, estás ansiosa e afadigada com muitas coisas, mas uma só é necessária.",
    },
  },
  {
    id: "aur-retire",
    src: "Marcus Aurelius · Meditations 4.3",
    text: "Men seek retreats for themselves: country houses, seashores, mountains. You can retire into yourself whenever you choose. Nowhere does a man retire more quietly or more freely than into his own soul.",
    pt: {
      src: "Marco Aurélio · Meditações 4.3",
      text: "Os homens buscam refúgios: casas no campo, praias, montanhas. Você pode recolher-se a si mesmo quando quiser. Em parte nenhuma o homem se recolhe com mais quietude do que na própria alma.",
    },
  },
  {
    id: "aur-judgment",
    src: "Marcus Aurelius · Meditations 8.47",
    text: "If you are pained by any external thing, it is not this thing that disturbs you, but your own judgment about it. And it is in your power to wipe out that judgment now.",
    pt: {
      src: "Marco Aurélio · Meditações 8.47",
      text: "Se alguma coisa externa dói, não é ela que perturba, mas o juízo a respeito dela. E está em seu poder apagar agora esse juízo.",
    },
  },
  {
    id: "aur-dye",
    src: "Marcus Aurelius · Meditations 5.16",
    text: "The soul becomes dyed with the colour of its thoughts.",
    pt: {
      src: "Marco Aurélio · Meditações 5.16",
      text: "A alma se tinge da cor dos seus pensamentos.",
    },
  },
  {
    id: "epi-control",
    src: "Epictetus · Enchiridion 1",
    text: "Some things are in our control and others not. In our control are opinion, pursuit, desire, aversion. Not in our control are body, property, reputation, command.",
    pt: {
      src: "Epicteto · Enquirídio 1",
      text: "Umas coisas estão em nosso poder, outras não. Em nosso poder estão opinião, impulso, desejo, aversão. Fora dele: o corpo, a propriedade, a fama, o cargo.",
    },
  },
  {
    id: "epi-views",
    src: "Epictetus · Enchiridion 5",
    text: "Men are disturbed not by things, but by the views which they take of things.",
    pt: {
      src: "Epicteto · Enquirídio 5",
      text: "Os homens não se perturbam pelas coisas, mas pelos juízos que fazem delas.",
    },
  },
  {
    id: "sen-show",
    src: "Seneca · Letters 7",
    text: "I want my life to be a life of my own, not a public show. To consort with the crowd is harmful.",
    pt: {
      src: "Sêneca · Cartas 7",
      text: "Quero que a minha vida seja minha, não um espetáculo público. Convivir com a turba faz mal.",
    },
  },
  {
    id: "sen-short",
    src: "Seneca · On the Shortness of Life",
    text: "It is not that we have a short space of time, but that we waste much of it. Life is long enough if the whole of it is well invested.",
    pt: {
      src: "Sêneca · Da brevidade da vida",
      text: "Não é que tenhamos pouco tempo: é que desperdiçamos muito. A vida é bastante longa se for bem empregada.",
    },
  },
  {
    id: "sen-withdraw",
    src: "Seneca · On Tranquillity",
    text: "Withdraw into yourself, as far as you can. Associate with those who will make a better man of you.",
    pt: {
      src: "Sêneca · Da tranquilidade",
      text: "Recolha-se a si mesmo, quanto puder. Junte-se a quem o faça melhor.",
    },
  },
  {
    id: "ps-23-4",
    src: "Psalm 23:4",
    text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
    pt: {
      src: "Salmo 23:4",
      text: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.",
    },
  },
  {
    id: "ps-27-1",
    src: "Psalm 27:1",
    text: "The Lord is my light and my salvation; whom shall I fear? the Lord is the strength of my life; of whom shall I be afraid?",
    pt: {
      src: "Salmo 27:1",
      text: "O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?",
    },
  },
  {
    id: "ps-46-1",
    src: "Psalm 46:1",
    text: "God is our refuge and strength, a very present help in trouble.",
    pt: {
      src: "Salmo 46:1",
      text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.",
    },
  },
  {
    id: "ps-91-1",
    src: "Psalm 91:1–2",
    text: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the Lord, He is my refuge and my fortress: my God; in him will I trust.",
    pt: {
      src: "Salmo 91:1–2",
      text: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei.",
    },
  },
  {
    id: "ps-121",
    src: "Psalm 121:1–2",
    text: "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the Lord, which made heaven and earth.",
    pt: {
      src: "Salmo 121:1–2",
      text: "Levantarei os meus olhos para os montes, de onde vem o meu socorro. O meu socorro vem do Senhor, que fez o céu e a terra.",
    },
  },
  {
    id: "ps-34-18",
    src: "Psalm 34:18",
    text: "The Lord is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
    pt: {
      src: "Salmo 34:18",
      text: "Perto está o Senhor dos que têm o coração quebrantado, e salva os contritos de espírito.",
    },
  },
  {
    id: "ps-55-22",
    src: "Psalm 55:22",
    text: "Cast thy burden upon the Lord, and he shall sustain thee: he shall never suffer the righteous to be moved.",
    pt: {
      src: "Salmo 55:22",
      text: "Lança o teu cuidado sobre o Senhor, e ele te susterá; não permitirá jamais que o justo seja abalado.",
    },
  },
  {
    id: "deut-31-6",
    src: "Deuteronomy 31:6",
    text: "Be strong and of a good courage, fear not, nor be afraid of them: for the Lord thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.",
    pt: {
      src: "Deuteronômio 31:6",
      text: "Esforçai-vos, e animai-vos; não temais, nem vos espanteis diante deles; porque o Senhor teu Deus é o que vai contigo; não te deixará, nem te desamparará.",
    },
  },
  {
    id: "isa-41-10",
    src: "Isaiah 41:10",
    text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
    pt: {
      src: "Isaías 41:10",
      text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.",
    },
  },
  {
    id: "isa-43-2",
    src: "Isaiah 43:2",
    text: "When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee: when thou walkest through the fire, thou shalt not be burned; neither shall the flame kindle upon thee.",
    pt: {
      src: "Isaías 43:2",
      text: "Quando passares pelas águas, estarei contigo, e quando pelos rios, eles não te submergirão; quando passares pelo fogo, não te queimarás, nem a chama arderá em ti.",
    },
  },
  {
    id: "prov-3-5",
    src: "Proverbs 3:5–6",
    text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    pt: {
      src: "Provérbios 3:5–6",
      text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.",
    },
  },
  {
    id: "lam-3-22",
    src: "Lamentations 3:22–23",
    text: "It is of the Lord's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
    pt: {
      src: "Lamentações 3:22–23",
      text: "As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas misericórdias não têm fim; novas são cada manhã; grande é a tua fidelidade.",
    },
  },
  {
    id: "hab-3-17",
    src: "Habakkuk 3:17–18",
    text: "Although the fig tree shall not blossom, neither shall fruit be in the vines; the labour of the olive shall fail, and the fields shall yield no meat; the flock shall be cut off from the fold, and there shall be no herd in the stalls: yet I will rejoice in the Lord, I will joy in the God of my salvation.",
    pt: {
      src: "Habacuque 3:17–18",
      text: "Porque ainda que a figueira não floresça, nem haja fruto na vide; o produto da oliveira minta, e os campos não produzam mantimento; as ovelhas sejam extirpadas do aprisco, e nos currais não haja gado, todavia eu me alegrarei no Senhor; exultarei no Deus da minha salvação.",
    },
  },
  {
    id: "job-13-15",
    src: "Job 13:15",
    text: "Though he slay me, yet will I trust in him.",
    pt: {
      src: "Jó 13:15",
      text: "Ainda que ele me mate, nele esperarei.",
    },
  },
  {
    id: "john-14-27",
    src: "John 14:27",
    text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
    pt: {
      src: "João 14:27",
      text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.",
    },
  },
  {
    id: "rom-8-28",
    src: "Romans 8:28",
    text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    pt: {
      src: "Romanos 8:28",
      text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.",
    },
  },
  {
    id: "rom-8-38",
    src: "Romans 8:38–39",
    text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
    pt: {
      src: "Romanos 8:38–39",
      text: "Porque estou certo de que, nem a morte, nem a vida, nem os anjos, nem os principados, nem as potestades, nem o presente, nem o porvir, nem a altura, nem a profundidade, nem alguma outra criatura nos poderá separar do amor de Deus, que está em Cristo Jesus nosso Senhor.",
    },
  },
  {
    id: "rom-5-3",
    src: "Romans 5:3–4",
    text: "And not only so, but we glory in tribulations also: knowing that tribulation worketh patience; and patience, experience; and experience, hope.",
    pt: {
      src: "Romanos 5:3–4",
      text: "E não somente isto, mas também nos gloriamos nas tribulações; sabendo que a tribulação produz a paciência, e a paciência a experiência, e a experiência a esperança.",
    },
  },
  {
    id: "cor-4-8",
    src: "2 Corinthians 4:8–9",
    text: "We are troubled on every side, yet not distressed; we are perplexed, but not in despair; persecuted, but not forsaken; cast down, but not destroyed.",
    pt: {
      src: "2 Coríntios 4:8–9",
      text: "Em tudo somos atribulados, mas não angustiados; perplexos, mas não desanimados. Perseguidos, mas não desamparados; abatidos, mas não destruídos.",
    },
  },
  {
    id: "cor-12-9",
    src: "2 Corinthians 12:9",
    text: "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness.",
    pt: {
      src: "2 Coríntios 12:9",
      text: "E disse-me: A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.",
    },
  },
  {
    id: "gal-6-9",
    src: "Galatians 6:9",
    text: "And let us not be weary in well doing: for in due season we shall reap, if we faint not.",
    pt: {
      src: "Gálatas 6:9",
      text: "E não nos cansemos de fazer bem, porque a seu tempo ceifaremos, se não houvermos desfalecido.",
    },
  },
  {
    id: "heb-11-1",
    src: "Hebrews 11:1",
    text: "Now faith is the substance of things hoped for, the evidence of things not seen.",
    pt: {
      src: "Hebreus 11:1",
      text: "Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não vêem.",
    },
  },
  {
    id: "cor-16-13",
    src: "1 Corinthians 16:13",
    text: "Watch ye, stand fast in the faith, quit you like men, be strong.",
    pt: {
      src: "1 Coríntios 16:13",
      text: "Vigiai, estai firmes na fé; portai-vos varonilmente, e fortalecei-vos.",
    },
  },
  {
    id: "jas-1-2",
    src: "James 1:2–4",
    text: "My brethren, count it all joy when ye fall into divers temptations; knowing this, that the trying of your faith worketh patience. But let patience have her perfect work, that ye may be perfect and entire, wanting nothing.",
    pt: {
      src: "Tiago 1:2–4",
      text: "Meus irmãos, tende grande gozo quando cairdes em várias tentações, sabendo que a prova da vossa fé opera a paciência. Tenha, porém, a paciência a sua obra perfeita, para que sejais perfeitos e completos, sem faltar em coisa alguma.",
    },
  },
  {
    id: "aur-promontory",
    src: "Marcus Aurelius · Meditations 4.49",
    text: "Be like the promontory against which the waves continually break, but it stands firm and tames the fury of the water around it.",
    pt: {
      src: "Marco Aurélio · Meditações 4.49",
      text: "Seja como o promontório contra o qual as ondas quebram sem cessar: ele permanece firme e amansa a fúria da água ao redor.",
    },
  },
  {
    id: "aur-future",
    src: "Marcus Aurelius · Meditations 7.8",
    text: "Let not future things disturb you. You will come to them, if it shall be necessary, having with you the same reason which now you use for present things.",
    pt: {
      src: "Marco Aurélio · Meditações 7.8",
      text: "Não deixe o futuro perturbá-lo. Você chegará a ele, se for preciso, com a mesma razão que agora usa para o presente.",
    },
  },
  {
    id: "aur-obstacle",
    src: "Marcus Aurelius · Meditations 5.20",
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    pt: {
      src: "Marco Aurélio · Meditações 5.20",
      text: "O obstáculo à ação faz avançar a ação. O que está no caminho torna-se o caminho.",
    },
  },
  {
    id: "aur-whole",
    src: "Marcus Aurelius · Meditations 8.36",
    text: "Do not disturb yourself by picturing your life as a whole. Stick with the situation at hand, and ask: why is this so unbearable?",
    pt: {
      src: "Marco Aurélio · Meditações 8.36",
      text: "Não se perturbe imaginando a vida inteira de uma vez. Fique com o que está à mão, e pergunte: por que isto seria insuportável?",
    },
  },
  {
    id: "epi-wish",
    src: "Epictetus · Enchiridion 8",
    text: "Do not seek to have events happen as you want them to, but instead want them to happen as they do happen, and your life will go well.",
    pt: {
      src: "Epicteto · Enquirídio 8",
      text: "Não peça que os acontecimentos sejam como você quer. Queira que sejam como são, e a vida irá bem.",
    },
  },
  {
    id: "epi-hard",
    src: "Epictetus · Discourses 1.24",
    text: "Difficulties are things that show a man what he is.",
    pt: {
      src: "Epicteto · Diatribes 1.24",
      text: "As dificuldades mostram ao homem o que ele é.",
    },
  },
  {
    id: "sen-imagine",
    src: "Seneca · Letters 13",
    text: "There are more things that frighten us than injure us, and we suffer more often in imagination than in reality.",
    pt: {
      src: "Sêneca · Cartas 13",
      text: "Há mais coisas que nos assustam do que nos ferem. Sofremos mais na imaginação do que na realidade.",
    },
  },
];
