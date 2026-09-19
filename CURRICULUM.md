# O ofício

Três períodos. Uma casa.

De manhã o Evangelho (vídeos da Igreja). Ao meio-dia o mapa (Bible Project). À noite um verso — salmo ou profeta. A qualquer hora, cantos gregorianos.

Epoch: `2026-09-06` (`OFFICE_EPOCH` / `FILM_EPOCH`).  
Day index = whole days since that date. Each list is `index % length`. Loops.

Windows: Morning 05:00–09:00, Midday 12:00–15:00, Night 21:00–24:00. Miss stands. No late write.

Our Father / Pai Nosso is morning only. Listen is chant all day. Noah octave clips stay in `films.json` but are filtered out of the morning office.

---

## Morning — Church Bible Videos (NT order)

Source: `films.json` after dropping `id` that starts with `noah`.

| # | id | Scripture | Title (EN) | Title (PT) |
|---|---|---|---|---|
| 1 | annunciation | Luke 1:26–38 | An Angel Foretells Christ’s Birth to Mary | Um anjo prediz o nascimento de Cristo a Maria |
| 2 | elisabeth | Luke 1:39–55 | Mary and Elisabeth Rejoice Together | Maria e Isabel se alegram juntas |
| 3 | john-named | Luke 1:57–80 | The Naming of John the Baptist | O nascimento de João Batista |
| 4 | bethlehem | Luke 2:4–7 | Mary and Joseph Travel to Bethlehem | Maria e José viajam a Belém |
| 5 | shepherds | Luke 2:8–18 | Shepherds Learn of the Birth of Christ | Pastores tomam conhecimento do nascimento de Cristo |
| 6 | temple-child | Luke 2:22–38 | The Christ Child Is Presented at the Temple | O Menino é apresentado no templo |
| 7 | wise-men | Matthew 2:1–15 | The Wise Men Seek Jesus | Os magos procuram Jesus |
| 8 | boy-temple | Luke 2:40–52 | Young Jesus Teaches in the Temple | O jovem Jesus ensina no templo |
| 9 | baptism | Matthew 3:13–17 | The Baptism of Jesus | O batismo de Jesus |
| 10 | cana | John 2:1–12 | Jesus Turns Water into Wine | Jesus transforma água em vinho |
| 11 | cleanses-temple | John 2:13–17 | Jesus Cleanses the Temple | Jesus purifica o templo |
| 12 | nicodemus | John 3:1–21 | Jesus Teaches of Being Born Again | Jesus ensina sobre nascer de novo |
| 13 | samaritan-woman | John 4:5–29 | Jesus Teaches a Samaritan Woman | Jesus ensina uma samaritana |
| 14 | nazareth | Luke 4:16–30 | Jesus Declares He Is the Messiah | Jesus declara que é o Messias |
| 15 | fishers | Matthew 4:18–22 | Follow Me, and I Will Make You Fishers of Men | Vinde após mim, e eu vos farei pescadores de homens |
| 16 | beatitudes | Matthew 5:3–16 | Sermon on the Mount: The Beatitudes | Sermão da Montanha: as bem-aventuranças |
| 17 | lords-prayer | Matthew 6:1–13 | Sermon on the Mount: The Lord’s Prayer | Sermão da Montanha: a oração do Senhor |
| 18 | palsy | Mark 2:1–12 | Jesus Forgives Sins and Heals a Man Stricken with Palsy | Jesus perdoa pecados e cura um paralítico |
| 19 | nain | Luke 7:11–16 | Jesus Raises the Son of the Widow of Nain | Jesus ressuscita o filho da viúva de Naim |
| 20 | tempest | Mark 4:37–40 | Calming the Tempest | Acalma a tempestade |
| 21 | jairus | Mark 5:22–43 | Jesus Raises the Daughter of Jairus | Jesus ressuscita a filha de Jairo |
| 22 | water | Matthew 14:25–33 | Wherefore Didst Thou Doubt? | Por que duvidaste? |
| 23 | five-thousand | Matthew 14:13–21 | The Feeding of the 5,000 | A multiplicação dos pães |
| 24 | sin-no-more | John 8:2–11 | Go and Sin No More | Vai e não peques mais |
| 25 | light | John 8:12–58 | I Am the Light of the World | Eu sou a luz do mundo |
| 26 | blind | John 9:1–41 | Jesus Heals a Man Born Blind | Jesus cura um cego de nascença |
| 27 | shepherd | John 10:1–18 | The Good Shepherd | O Bom Pastor |
| 28 | lazarus | John 11:1–44 | Lazarus Is Raised from the Dead | Lázaro é ressuscitado |
| 29 | good-samaritan | Luke 10:25–37 | Parable of the Good Samaritan | Parábola do bom samaritano |
| 30 | lost-sheep | Luke 15:2–7 | Parable of the Lost Sheep | Parábola da ovelha perdida |
| 31 | prodigal | Luke 15:11–32 | The Prodigal Son | O filho pródigo |
| 32 | children | Luke 18:15–17 | Suffer the Little Children to Come unto Me | Deixai vir a mim os pequeninos |
| 33 | entry | Matthew 21:1–11 | The Lord’s Triumphal Entry into Jerusalem | A entrada triunfal em Jerusalém |
| 34 | authority | Matthew 21:23–32 | Christ’s Authority Is Questioned | A autoridade de Cristo é questionada |
| 35 | mites | Mark 12:41–44 | Jesus Teaches About the Widow’s Mites | Jesus ensina sobre as duas parcas da viúva |
| 36 | virgins | Matthew 25:1–13 | The Ten Virgins | As dez virgens |
| 37 | talents | Matthew 25:14–30 | The Parable of the Talents | A parábola dos talentos |
| 38 | supper | John 13:1–35 | The Last Supper | A última ceia |
| 39 | gethsemane | Matthew 26:36–57 | The Savior Suffers in Gethsemane | O Salvador sofre em Getsêmani |
| 40 | crucified | Matthew 27:26–50 | Jesus Is Scourged and Crucified | Jesus é açoitado e crucificado |
| 41 | tomb | Matthew 27:57–60 | Jesus Is Laid in a Tomb | Jesus é posto no sepulcro |
| 42 | risen | John 20:11–17 | He Is Risen | Ele ressuscitou |
| 43 | emmaus | Luke 24:13–33 | Christ Appears on the Road to Emmaus | Cristo aparece no caminho de Emaús |
| 44 | thomas | John 20:24–29 | Blessed Are They That Have Not Seen | Bem-aventurados os que não viram e creram |
| 45 | feed-sheep | John 21:1–22 | Feed My Sheep | Apascenta as minhas ovelhas |
| 46 | stephen | Acts 6–7 | The Martyrdom of Stephen | O martírio de Estêvão |
| 47 | damascus | Acts 22:6–21 | The Road to Damascus | O caminho de Damasco |

47 mornings, then wrap.

---

## Midday — Bible Project NT

Source: `OFFICE_BP_NT` in `office-year.js`.

| # | YouTube | EN | PT | Ref |
|---|---|---|---|---|
| 1 | Q0BrP8bqj0c | New Testament overview | Visão do Novo Testamento | NT |
| 2 | 3Dv4-n6OYGI | Matthew 1–13 | Mateus 1–13 | Matthew 1–13 |
| 3 | GGCF3OPWN14 | Matthew 14–28 | Mateus 14–28 | Matthew 14–28 |
| 4 | HGHqu9-DtXk | Mark | Marcos | Mark |
| 5 | XIb_dCIxzr0 | Luke 1–9 | Lucas 1–9 | Luke 1–9 |
| 6 | 26z_KhwNdD8 | Luke 10–24 | Lucas 10–24 | Luke 10–24 |
| 7 | G-2e9mMf7E8 | John 1–12 | João 1–12 | John 1–12 |
| 8 | RUfh_wOsauk | John 13–21 | João 13–21 | John 13–21 |

8 noons, then wrap. Independent of the morning index.

---

## Night — one verse (psalm or prophet)

Source: `OFFICE_NIGHT` in `office-year.js`. No film.

| # | Ref |
|---|---|
| 1 | Psalm 4:8 |
| 2 | Psalm 16:8 |
| 3 | Psalm 23:1–2 |
| 4 | Psalm 27:1 |
| 5 | Psalm 31:5 |
| 6 | Psalm 34:8 |
| 7 | Psalm 37:7 |
| 8 | Psalm 42:1 |
| 9 | Psalm 46:10 |
| 10 | Psalm 51:10 |
| 11 | Psalm 62:1 |
| 12 | Psalm 63:1 |
| 13 | Psalm 90:12 |
| 14 | Psalm 91:1 |
| 15 | Psalm 103:1 |
| 16 | Psalm 119:105 |
| 17 | Psalm 121:1–2 |
| 18 | Psalm 127:1 |
| 19 | Psalm 130:5 |
| 20 | Psalm 139:23–24 |
| 21 | Proverbs 3:5–6 |
| 22 | Proverbs 15:1 |
| 23 | Proverbs 16:9 |
| 24 | Isaiah 26:3 |
| 25 | Isaiah 40:31 |
| 26 | Isaiah 55:6 |
| 27 | Micah 6:8 |
| 28 | Lamentations 3:22–23 |
| 29 | Habakkuk 2:20 |
| 30 | Malachi 4:2 |

EN/PT bodies live next to each ref in `office-year.js`.

---

## Worked example — 2026-09-19

Day index = 13.

- Morning: `13 % 47` → samaritan-woman (John 4) if the filtered list is 0-based from annunciation.
- Midday: `13 % 8` → Luke 1–9.
- Night: `13 % 30` → Psalm 90:12.

Morning and noon are **not** locked to the same pericope. Change that only on purpose.

## Out of year

- Noah octave (`noah-*` in `films.json`)
- Templar playlist
- Full OT lectionary
- `lessons.js` keep/close as the noon film (still used for share text)
