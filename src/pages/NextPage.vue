<script setup lang="ts">
import musicUrl from '@/assets/audio/Ponderosa Twins Plus One - Bound (2024 Mono Instrumental Mix).mp3';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const hearts = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  size: `${14 + ((i * 7) % 22)}px`,
  time: `${14 + ((i * 5) % 12)}s`,
  delay: `${-((i * 3) % 14)}s`,
}));

const audioPlayer = ref<HTMLAudioElement | null>(null);
const avisoVisivel = ref(true);

const tocarAudio = async () => {
  if (!audioPlayer.value) return;

  try {
    await audioPlayer.value.play();
    avisoVisivel.value = false;
  } catch (err) {
    console.warn('Não foi possível tocar o áudio:', err);
  }
};

const timelineItems = [
  { title: 'O Começo', subtitle: 'O Começo de Tudo', text: 'Duas pessoas, dois desconhecidos, encontrados ao acaso, unidos por um tipo de jogo específico, as vezes a vida é cheia de surpresas mesmo. Devo dizer que recordo de cada detalhe do fatídico dia 11 de julho de 2026, o dia que tivemos nosso primeiro contato. Dois desconhecidos que apenas se falavam casualmente, apenas como colegas, interagindo aqui e ali, mas uma interação tão boa que sempre alegrava a dinâmica do grupo.' },
  { title: 'A Call', subtitle: 'O Primeiro Contato', text: 'Desde então tive curiosidade por você, quis fazer o primeiro movimento para saber como você era. Uma simples chamada para ir em call em uma partida de Death Ball, uma simples chamada para que eu pudesse ouvir sua voz, uma simples chamada para que eu pudesse te sentir de outra maneira, e ouvi a tão bela voz do outro lado da chamada, transparecendo seu lindo jeito de ser.' },
  { title: 'A Amizade', subtitle: 'Subindo de Categoria 1', text: 'Uma amizade por ali se formava, calls ja marcadas, piadas ja feitas, interações realizadas, a sensação era de um sentimento doce que eu adorava aproveitar cada dia que passava, um sentimento alegre e contagiante que me dominava sempre.' },
  { title: 'Os Flertes', subtitle: 'Brincadeiras que Viram Verdades', text: 'Chega-se em um momento onde o que fazíamos ja estava se tornando dúbio e turvo, queria eu aproveitar os flertes ainda mais, mas o coração estava indeciso se queria isso ou não, a dúvida era gostosa mas ao mesmo tempo agoniava. É o que dizem, quando se repete algo, vira um hábito, e meu hábito se tornou o de te elogiar, de te procurar, de te admirar e te desejar cada dia mais, o hábito que não quero desaprender mais.' },
  { title: 'Melhores Amigos', subtitle: 'Subindo de Categoria 2', text: 'E então sem perceber, estávamos compartilhando nosso dia a dia e nos falando da forma mais solta possível, ora alternando entre flertes e ora alternando entre brincadeiras, irritações, é o melhor tipo de dualidade que se pode esperar. Ainda me lembro do que você tinha me dito quando fizemos aquela pegadinha com o Toji e o Farofa, "Mn, você é meu best?", ter esse tipo de fala ja foi uma das considerações mais altas que ja recebi, e vindo logo de você foi tão mágico que fiquei pensando nisso direto.' },
  { title: 'O Que Você Quer?', subtitle: 'Decisões', text: 'E enfim havia chegado o momento, "Isso tudo que você diz é verdade?", naquela noite fomos direto ao ponto no que sentíamos e no que queríamos, foi o ponto final para eu poder abrir meu peito e oferecê-lo a ti, foi como ter soltado uma fita da minha boca, me impedindo de dizer o que sentia, então eu gritei, gritei para que você pudesse ouvir, para que pudesse sentir que eu estou completamente e perdidamente apaixonado por você, sempre esperando sua mensagem, sua voz, seu riso, seu desabafo e seu carinho mais caloroso.' },
  { title: 'Segredos', subtitle: 'Segredos a Sete Chaves', text: 'Mesmo que estivéssemos próximos ainda tinham coisas que nenhum sabia sobre o outro, coisas que eram demais para contar, mas devido ao momento, conseguimos expor aquilo que nos machucava por muito tempo, foi tão íntimo, tão delicado, que eu senti um abraço seu a cada palavra de reconforto e espero que tenha sentido os meus abraços também. Compartilhamos pois confiamos no outro, e quero que essa confiança sempre aumente mais e mais.' },
  { title: 'Você', subtitle: 'Zang, Helena, Lelena, Yaayeel', text: 'O que falar dela né? Além da beleza se comparar a uma pintura renascentista, sua personalidade é a mais cativante possível, ao mesmo tempo que é alguém mais reservada, esquentadinha e as vezes séria, ela ainda consegue ser doce, meiga e terna. Encontro nos teus olhos o olhar seduzente, impactante, intenso mas também sua calma, paixão e afeto. Ela é teimosa, mas do tipo fofo, ela é do tipo assertiva, que compra briga se fizerem algo com alguém que ela goste, ela é quieta, mas que quando fala se torna o mais belo canto ja ouvido. Você ja é bela por ser você mesma e transparecer isso, e é por isso que me apaixonei.' },
  { title: 'Nós', subtitle: 'Hoje', text: 'Bom, com todo esse texto você percebeu que talvez eu seja um pouco emocionado KKKKKKK, brincadeiras a parte eu só sei que quero te ver mais e mais a cada dia que passa, cada dia que passa quero deitar nesse teu abraço, rir com você, compartilhar as coisas com você, apoiar você e ser alguém que te ajuda, te admira, te encanta todos os dias. Quero ser aquele que te faz rir com uma atitude besta quando você estiver triste, aquele que ouvirá tudo o que aconteceu de estressante no seu dia, aquele que te acalma, aquele que te da mais um motivo pra viver. Aquele que chora contigo como um bebê, brinca contigo como se fossem crianças, ouve e compreende como adulto, e aquele que ama como um idoso, amando até o final de sua vida, com isso eu queria perguntar...' },
];

const imageList = Array.from({ length: 9 }, (_, i) => `/images/image${i + 1}.png`);

const temas = ['morango', 'limao'];
const temaDoItem = (i: number) => temas[i % 2];

const visiveis = ref<boolean[]>(timelineItems.map(() => false));
const itemRefs = ref<HTMLElement[]>([]);

let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        const idx = Number(el.dataset.index);
        if (entry.isIntersecting) {
          visiveis.value[idx] = true;
          observer?.unobserve(el);
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: '0px 0px -80px 0px',
    },
  );

  itemRefs.value.forEach((el) => el && observer?.observe(el));
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

const setItemRef = (el: Element | null, i: number) => {
  if (el) itemRefs.value[i] = el as HTMLElement;
};

const nivelProposta = ref(0);
const escolhaAtual = ref<string | null>(null);
const respostaFinal = ref(false);

const titulosProposta = [
  'Aceita namorar comigo?',
  'Nah, deixa de brincadeira vai',
  'Acho que dessa vez você não pode recusar',
];

watch(escolhaAtual, (valor) => {
  if (valor === 'sim') {
    respostaFinal.value = true;
  } else if (valor === 'nao' && nivelProposta.value < 2) {
    nivelProposta.value++;
    escolhaAtual.value = null;
  }
});

const emojisFinal = Array.from({ length: 18 }, (_, i) => ({
  emoji: i % 3 === 0 ? '♥' : i % 3 === 1 ? '🍓' : '🍋',
  left: `${(i * 53) % 100}%`,
  delay: `${-((i * 0.7) % 5)}s`,
  duration: `${4 + ((i * 0.4) % 4)}s`,
  size: `${16 + ((i * 6) % 22)}px`,
}));
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="surprise">
        <div class="surprise__coracoes" aria-hidden="true">
          <span
            v-for="(c, i) in hearts"
            :key="i"
            class="coracao"
            :style="{
              left: c.left,
              fontSize: c.size,
              animationDuration: c.time,
              animationDelay: c.delay,
            }"
          >♥</span>
        </div>

        <main class="carta">
          <div v-if="avisoVisivel" class="aviso-audio">
            <p class="aviso-audio__texto">
              🎵 Antes de você rolar para baixo, toque este áudio
            </p>
          </div>

          <div class="audio-wrapper">
            <audio
              ref="audioPlayer"
              controls
              preload="metadata"
              class="audio-player"
            >
              <source :src="musicUrl" type="audio/mpeg" />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>

          <q-btn
            v-if="avisoVisivel"
            class="carta__botao"
            @click="tocarAudio"
            label="▶ Tocar áudio"
            unelevated
            rounded
            no-caps
            size="lg"
          />

          <div class="carta__scroll-hint" aria-hidden="true">
            <span class="carta__scroll-texto">role para baixo</span>
            <span class="carta__scroll-seta">↓</span>
          </div>
        </main>

        <section class="timeline">
          <div class="timeline__linha" aria-hidden="true"></div>

          <div
            v-for="(item, i) in timelineItems"
            :key="i"
            :ref="(el) => setItemRef(el as Element | null, i)"
            :data-index="i"
            class="timeline__item"
            :class="[
              i % 2 === 0 ? 'timeline__item--esquerda' : 'timeline__item--direita',
              visiveis[i] ? 'timeline__item--visivel' : '',
            ]"
          >
            <div
              class="timeline__ponto"
              :class="`timeline__ponto--${temaDoItem(i)}`"
              aria-hidden="true"
            ></div>

            <article
              class="timeline-card"
              :class="`timeline-card--${temaDoItem(i)}`"
            >
              <span class="timeline-card__decanto timeline-card__decanto--tl" aria-hidden="true">
                <span v-if="temaDoItem(i) === 'morango'">🍓</span>
                <span v-else>🍋</span>
              </span>
              <span class="timeline-card__decanto timeline-card__decanto--br" aria-hidden="true">
                ♥
              </span>

              <div class="timeline-card__media">
                <img
                  v-if="imageList[i]"
                  :src="imageList[i]"
                  :alt="`Imagem ${i + 1}`"
                  class="timeline-card__image"
                  loading="lazy"
                />
              </div>

              <div class="timeline-card__conteudo">
                <h3 class="timeline-card__titulo">{{ item.title }}</h3>
                <span class="timeline-card__subtitulo">
                  <span class="timeline-card__subtitulo-emoji" aria-hidden="true">
                    <span v-if="temaDoItem(i) === 'morango'">🍓</span>
                    <span v-else>🍋</span>
                  </span>
                  {{ item.subtitle }}
                  <span class="timeline-card__subtitulo-emoji" aria-hidden="true">
                    <span v-if="temaDoItem(i) === 'morango'">🍓</span>
                    <span v-else>🍋</span>
                  </span>
                </span>
                <p class="timeline-card__texto">{{ item.text }}</p>

                <span class="timeline-card__rodape" aria-hidden="true">
                  ♥ ♥ ♥
                </span>
              </div>
            </article>
          </div>
        </section>

        <section class="proposta">
          <div v-if="!respostaFinal" class="proposta__card">
            <div class="proposta__decanto proposta__decanto--tl" aria-hidden="true">🍓</div>
            <div class="proposta__decanto proposta__decanto--br" aria-hidden="true">🍋</div>

            <h2 class="proposta__titulo">
              {{ titulosProposta[nivelProposta] }}
            </h2>

            <div class="proposta__opcoes">
              <q-radio
                v-model="escolhaAtual"
                val="sim"
                label="Sim"
                color="pink-4"
                size="lg"
                class="proposta__radio proposta__radio--sim"
              />
              <q-radio
                v-model="escolhaAtual"
                val="nao"
                label="Não"
                color="pink-4"
                size="lg"
                class="proposta__radio proposta__radio--nao"
                :disable="nivelProposta === 2"
              />
            </div>

            <p v-if="nivelProposta === 2" class="proposta__aviso">
              (sem escapatória dessa vez 😌)
            </p>
          </div>

          <div v-else class="proposta__final">
            <div class="proposta__final-emojis" aria-hidden="true">
              <span
                v-for="(e, i) in emojisFinal"
                :key="i"
                class="proposta__final-emoji"
                :style="{
                  left: e.left,
                  fontSize: e.size,
                  animationDelay: e.delay,
                  animationDuration: e.duration,
                }"
              >{{ e.emoji }}</span>
            </div>

            <h2 class="proposta__final-titulo">Felizes Para Sempre</h2>
            <p class="proposta__final-sub">
              <span aria-hidden="true">♥</span>
              🍓
              <span aria-hidden="true">♥</span>
              🍋
              <span aria-hidden="true">♥</span>
            </p>
          </div>
        </section>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.surprise {
  --ameixa: #1d0725;
  --roxo: #5b1f7a;
  --vinho: #8b1237;
  --carmim: #e11d48;
  --rosa: #ffb3c1;
  --creme: #fff0f3;

  --morango-1: #e11d48;
  --morango-2: #ff4d6d;
  --morango-3: #ffb3c1;

  --limao-1: #eab308;
  --limao-2: #facc15;
  --limao-3: #fef08a;

  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  padding: 24px 16px 80px;
  background:
    radial-gradient(circle at 15% 10%, var(--roxo) 0%, transparent 55%),
    radial-gradient(circle at 85% 90%, var(--vinho) 0%, transparent 55%),
    var(--ameixa);
  font-family: 'Quicksand', system-ui, sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.surprise__coracoes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.coracao {
  position: absolute;
  bottom: -40px;
  color: var(--carmim);
  opacity: 0;
  animation-name: subir;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.coracao:nth-child(even) { color: #b455f0; }

@keyframes subir {
  0% { transform: translateY(0) rotate(-8deg); opacity: 0; }
  10% { opacity: 0.35; }
  90% { opacity: 0.25; }
  100% { transform: translateY(-110vh) rotate(10deg); opacity: 0; }
}

/* ---------- Cartão principal (áudio) ---------- */
.carta {
  position: relative;
  width: min(100%, 620px);
  min-height: 88vh;
  margin: 24px 0;
  padding: 60px 48px;
  border: 1px solid rgba(255, 179, 193, 0.28);
  border-radius: 32px;
  background: rgba(255, 240, 243, 0.07);
  backdrop-filter: blur(12px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 20px;
}

.aviso-audio {
  padding: 18px 20px;
  border: 1px solid rgba(255, 179, 193, 0.35);
  border-radius: 16px;
  background: rgba(225, 29, 72, 0.12);
}

.aviso-audio__texto {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--creme);
}

.audio-wrapper { margin: 0; }

.audio-player {
  width: 100%;
  height: 54px;
  border-radius: 14px;
  outline: none;
}

.audio-player::-webkit-media-controls-play-button { display: none; }

.carta__botao {
  width: 100%;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  background: linear-gradient(135deg, #e11d48 0%, #9d174d 45%, #7e22ce 100%);
  box-shadow: 0 12px 30px rgba(225, 29, 72, 0.35);
}

.carta__botao:focus-visible {
  outline: 3px solid var(--rosa);
  outline-offset: 3px;
}

.carta__scroll-hint {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--rosa);
  opacity: 0.75;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.carta__scroll-seta {
  font-size: 1.4rem;
  animation: pular 1.6s ease-in-out infinite;
}

@keyframes pular {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(8px); }
}

/* ---------- Timeline ---------- */
.timeline {
  position: relative;
  width: min(100%, 1300px);
  z-index: 1;
  margin-top: 40px;
}

.timeline__linha {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 179, 193, 0.35) 5%,
    rgba(255, 179, 193, 0.35) 95%,
    transparent
  );
}

.timeline__item {
  position: relative;
  width: 50%;
  min-height: 90vh;
  padding: 40px 64px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.timeline__item--esquerda { left: 0; justify-content: flex-end; }
.timeline__item--direita  { left: 50%; justify-content: flex-start; }

.timeline__ponto {
  position: absolute;
  top: 50%;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline__ponto--morango {
  background: var(--morango-1);
  box-shadow:
    0 0 0 6px rgba(225, 29, 72, 0.28),
    0 0 28px rgba(225, 29, 72, 0.85);
}

.timeline__ponto--limao {
  background: var(--limao-1);
  box-shadow:
    0 0 0 6px rgba(234, 179, 8, 0.28),
    0 0 28px rgba(234, 179, 8, 0.85);
}

.timeline__item--esquerda .timeline__ponto { right: -11px; }
.timeline__item--direita .timeline__ponto  { left: -11px; }

.timeline-card {
  position: relative;
  display: flex;
  gap: 32px;
  padding: 36px 32px 32px;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  text-align: left;
  max-width: 720px;
  width: 100%;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.timeline-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 6px;
  border-radius: 24px 24px 0 0;
}

.timeline-card--morango {
  border: 1px solid rgba(255, 77, 109, 0.5);
  background:
    radial-gradient(circle at top right, rgba(255, 77, 109, 0.18), transparent 60%),
    rgba(225, 29, 72, 0.14);
}
.timeline-card--morango::before {
  background: linear-gradient(90deg, #e11d48, #ff4d6d, #ffb3c1, #ff4d6d, #e11d48);
}
.timeline-card--morango:hover {
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(225, 29, 72, 0.35);
}
.timeline-card--morango .timeline-card__titulo { color: #ffb3c1; text-shadow: 0 0 24px rgba(225, 29, 72, 0.55); }
.timeline-card--morango .timeline-card__subtitulo { color: #ff4d6d; }
.timeline-card--morango .timeline-card__image { border: 2px solid rgba(255, 77, 109, 0.55); }
.timeline-card--morango .timeline-card__rodape { color: #ff4d6d; }

.timeline-card--limao {
  border: 1px solid rgba(250, 204, 21, 0.5);
  background:
    radial-gradient(circle at top left, rgba(250, 204, 21, 0.18), transparent 60%),
    rgba(234, 179, 8, 0.12);
}
.timeline-card--limao::before {
  background: linear-gradient(90deg, #eab308, #facc15, #fef08a, #facc15, #eab308);
}
.timeline-card--limao:hover {
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(234, 179, 8, 0.35);
}
.timeline-card--limao .timeline-card__titulo { color: #fef08a; text-shadow: 0 0 24px rgba(234, 179, 8, 0.55); }
.timeline-card--limao .timeline-card__subtitulo { color: #facc15; }
.timeline-card--limao .timeline-card__image { border: 2px solid rgba(250, 204, 21, 0.55); }
.timeline-card--limao .timeline-card__rodape { color: #facc15; }

.timeline-card__decanto {
  position: absolute;
  font-size: 1.6rem;
  line-height: 1;
  pointer-events: none;
  opacity: 0.85;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
}
.timeline-card__decanto--tl { top: 14px; left: 16px; }
.timeline-card__decanto--br { bottom: 14px; right: 16px; font-size: 1.1rem; letter-spacing: 0.15em; opacity: 0.7; }

.timeline__item--esquerda .timeline-card { flex-direction: row-reverse; }

.timeline-card__media { flex: 0 0 55%; max-width: 400px; }

.timeline-card__image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 18px;
  display: block;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
}

.timeline-card__conteudo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  justify-content: center;
}

.timeline-card__titulo {
  margin: 0;
  font-family: 'Pinyon Script', cursive;
  font-size: 2.6rem;
  font-weight: 400;
  line-height: 1.05;
}

.timeline-card__subtitulo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.95;
}

.timeline-card__subtitulo-emoji { font-size: 1rem; }

.timeline-card__texto {
  margin: 10px 0 0;
  font-size: 1.15rem;
  line-height: 1.65;
  color: rgba(255, 240, 243, 0.92);
}

.timeline-card__rodape {
  margin-top: 14px;
  font-size: 0.9rem;
  letter-spacing: 0.4em;
  opacity: 0.65;
}

.timeline__item {
  opacity: 0;
  transition: opacity 0.9s ease, transform 0.9s ease;
  will-change: opacity, transform;
}
.timeline__item--esquerda { transform: translate(-70px, 40px); }
.timeline__item--direita  { transform: translate(70px, 40px); }
.timeline__item--visivel  { opacity: 1; transform: translate(0, 0); }

/* ---------- PROPOSTA FINAL ---------- */
.proposta {
  position: relative;
  width: min(100%, 900px);
  min-height: 95vh;
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.proposta__card {
  position: relative;
  width: 100%;
  padding: 64px 48px;
  border-radius: 32px;
  border: 1px solid rgba(255, 179, 193, 0.35);
  background:
    radial-gradient(circle at 10% 10%, rgba(225, 29, 72, 0.22), transparent 55%),
    radial-gradient(circle at 90% 90%, rgba(234, 179, 8, 0.18), transparent 55%),
    rgba(255, 240, 243, 0.05);
  backdrop-filter: blur(14px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  text-align: center;
  overflow: hidden;
  animation: aparecerCard 0.7s ease both;
}

@keyframes aparecerCard {
  from { opacity: 0; transform: translateY(30px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* fita decorativa no topo (morango -> limão) */
.proposta__card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 6px;
  background: linear-gradient(90deg, #e11d48, #ff4d6d, #ffb3c1, #fef08a, #facc15, #eab308);
}

.proposta__decanto {
  position: absolute;
  font-size: 2rem;
  line-height: 1;
  pointer-events: none;
  opacity: 0.85;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
}
.proposta__decanto--tl { top: 20px; left: 24px; }
.proposta__decanto--br { bottom: 20px; right: 24px; }

.proposta__titulo {
  margin: 0 0 40px;
  font-family: 'Pinyon Script', cursive;
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 400;
  line-height: 1.15;
  color: var(--creme);
  text-shadow:
    0 0 30px rgba(225, 29, 72, 0.55),
    0 0 60px rgba(234, 179, 8, 0.35);
}

.proposta__opcoes {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.proposta__radio {
  padding: 12px 20px;
  border-radius: 14px;
  background: rgba(255, 240, 243, 0.06);
  border: 1px solid rgba(255, 179, 193, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.proposta__radio :deep(.q-radio__label) {
  color: var(--creme);
  font-weight: 600;
  font-size: 1.15rem;
}

.proposta__radio--sim {
  border-color: rgba(255, 77, 109, 0.5);
}
.proposta__radio--sim:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(225, 29, 72, 0.35);
}

.proposta__radio--nao {
  border-color: rgba(250, 204, 21, 0.5);
}
.proposta__radio--nao:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(234, 179, 8, 0.35);
}

.proposta__aviso {
  margin: 32px 0 0;
  font-size: 0.95rem;
  font-style: italic;
  color: var(--rosa);
  opacity: 0.8;
}

/* ---------- Tela final "Felizes Para Sempre" ---------- */
.proposta__final {
  position: relative;
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: aparecerCard 0.9s ease both;
}

.proposta__final-titulo {
  margin: 0;
  font-family: 'Pinyon Script', cursive;
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 400;
  line-height: 1.05;
  text-align: center;
  background: linear-gradient(
    90deg,
    #ffb3c1 0%,
    #ff4d6d 20%,
    #e11d48 40%,
    #fef08a 60%,
    #facc15 80%,
    #eab308 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation:
    aparecerFinal 1s ease both,
    brilhar 4s ease-in-out infinite 1s;
  filter: drop-shadow(0 0 30px rgba(225, 29, 72, 0.5))
          drop-shadow(0 0 60px rgba(234, 179, 8, 0.4));
}

@keyframes aparecerFinal {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes brilhar {
  0%, 100% { background-position: 0% center; }
  50%      { background-position: 100% center; }
}

.proposta__final-sub {
  margin: 24px 0 0;
  font-size: 2rem;
  letter-spacing: 0.4em;
  color: var(--rosa);
  display: flex;
  gap: 12px;
  animation: pulsar 2s ease-in-out infinite;
}

.proposta__final-sub span {
  color: var(--carmim);
  text-shadow: 0 0 20px rgba(225, 29, 72, 0.8);
}

@keyframes pulsar {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50%      { transform: scale(1.08); opacity: 1; }
}

.proposta__final-emojis {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.proposta__final-emoji {
  position: absolute;
  bottom: -60px;
  opacity: 0;
  animation-name: subirFinal;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
}

@keyframes subirFinal {
  0%   { transform: translateY(0) rotate(-10deg); opacity: 0; }
  10%  { opacity: 0.9; }
  90%  { opacity: 0.9; }
  100% { transform: translateY(-100vh) rotate(15deg); opacity: 0; }
}

/* ---------- Mobile ---------- */
@media (max-width: 720px) {
  .carta {
    width: 100%;
    min-height: 85vh;
    padding: 40px 24px;
    border-radius: 24px;
  }

  .aviso-audio__texto { font-size: 0.95rem; }

  .timeline__linha { left: 20px; }

  .timeline__item {
    width: 100%;
    left: 0 !important;
    min-height: 85vh;
    padding: 24px 0 24px 48px;
    justify-content: flex-start !important;
  }

  .timeline__item--esquerda .timeline-card,
  .timeline__item--direita .timeline-card {
    flex-direction: column;
  }

  .timeline__item--esquerda .timeline__ponto,
  .timeline__item--direita .timeline__ponto {
    left: 9px;
    right: auto;
  }

  .timeline__item--esquerda,
  .timeline__item--direita {
    transform: translate(-40px, 40px);
  }

  .timeline__item--visivel { transform: translate(0, 0); }

  .timeline-card {
    max-width: 100%;
    padding: 28px 20px 20px;
    gap: 18px;
  }

  .timeline-card__media { flex: 0 0 auto; max-width: 100%; }

  .timeline-card__titulo { font-size: 2rem; }
  .timeline-card__texto { font-size: 1rem; }
  .timeline-card__decanto { font-size: 1.3rem; }

  .proposta__card { padding: 48px 24px; }
  .proposta__opcoes { gap: 20px; flex-direction: column; width: 100%; }
  .proposta__radio { width: 100%; justify-content: center; }
  .proposta__titulo { font-size: 2.2rem; }
  .proposta__final-sub { font-size: 1.4rem; letter-spacing: 0.3em; }
  .proposta__decanto { font-size: 1.6rem; }
}

@media (prefers-reduced-motion: reduce) {
  .coracao,
  .carta__scroll-seta,
  .proposta__card,
  .proposta__final,
  .proposta__final-titulo,
  .proposta__final-sub,
  .proposta__final-emoji {
    animation: none !important;
  }

  .timeline__item {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }

  .proposta__final-titulo {
    -webkit-text-fill-color: #ffb3c1;
    color: #ffb3c1;
    background: none;
  }
}
</style>
