<script setup lang="ts">
import { checkUserData } from '@/check/checkData';
import { Notify } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const nickname = ref('');
const name = ref('');

const required = (valor: string) => !!valor.trim() || 'Preencha este campo';

// Fundo flutuante: mistura de corações, morangos e limões
const flutuantes = Array.from({ length: 18 }, (_, i) => {
  const tipo = i % 3 === 0 ? '♥' : i % 3 === 1 ? '🍓' : '🍋';
  return {
    tipo,
    left: `${(i * 37) % 100}%`,
    size: tipo === '♥' ? `${14 + ((i * 7) % 22)}px` : `${16 + ((i * 5) % 20)}px`,
    time: `${14 + ((i * 5) % 12)}s`,
    delay: `${-((i * 3) % 14)}s`,
  };
});

const prosseguir = () => {
  sessionStorage.setItem(
    'surprise',
    JSON.stringify({ nickname: nickname.value.trim(), name: name.value.trim() }),
  );
};

const next = async () => {
  const check = checkUserData(nickname.value, name.value);

  if (check.status) {
    await router.push('/NextPage');
  } else {
    console.log('check:', check);
    Notify.create({
      type: 'negative',
      message: check.message || 'Erro ao enviar dados',
      position: 'bottom',
    });
  }
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="surprise flex flex-center">
        <div class="surprise__coracoes" aria-hidden="true">
          <span
            v-for="(c, i) in flutuantes"
            :key="i"
            class="coracao"
            :class="{
              'coracao--morango': c.tipo === '🍓',
              'coracao--limao': c.tipo === '🍋',
            }"
            :style="{
              left: c.left,
              fontSize: c.size,
              animationDuration: c.time,
              animationDelay: c.delay,
            }"
          >{{ c.tipo }}</span>
        </div>

        <main class="carta">
          <!-- Cantos decorados -->
          <span class="carta__decanto carta__decanto--tl" aria-hidden="true">🍓</span>
          <span class="carta__decanto carta__decanto--tr" aria-hidden="true">🍋</span>
          <span class="carta__decanto carta__decanto--bl" aria-hidden="true">🍋</span>
          <span class="carta__decanto carta__decanto--br" aria-hidden="true">🍓</span>

          <h1 class="carta__titulo">O Grande Dia</h1>

          <!-- Divisor com morango e limão -->
          <div class="carta__divisor" aria-hidden="true">
            <span class="carta__divisor-emoji">🍓</span>
            <span class="carta__divisor-linha"></span>
            <span class="carta__divisor-emoji">♥</span>
            <span class="carta__divisor-linha"></span>
            <span class="carta__divisor-emoji">🍋</span>
          </div>

          <p class="carta__texto">
            Antes de continuar, identifique-se.
          </p>

          <q-form class="carta__form" @submit="prosseguir">
            <q-input
              v-model="nickname"
              label="Apelido"
              outlined
              dark
              color="pink-3"
              label-color="pink-2"
              lazy-rules
              :rules="[required]"
              autocomplete="nickname"
            >
              <template #prepend>
                <q-icon name="favorite" color="pink-3" />
              </template>
              <template #append>
                <span class="campo-emoji" aria-hidden="true">🍓</span>
              </template>
            </q-input>

            <q-input
              v-model="name"
              label="Nome"
              outlined
              dark
              color="pink-3"
              label-color="pink-2"
              lazy-rules
              :rules="[required]"
              autocomplete="given-name"
            >
              <template #prepend>
                <q-icon name="person" color="pink-3" />
              </template>
              <template #append>
                <span class="campo-emoji" aria-hidden="true">🍋</span>
              </template>
            </q-input>

            <q-btn
              class="carta__botao"
              @click="next"
              label="Prosseguir"
              unelevated
              rounded
              no-caps
              size="lg"
            />
          </q-form>
        </main>
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
  overflow: hidden;
  padding: 24px 16px;
  background:
    radial-gradient(circle at 15% 10%, var(--roxo) 0%, transparent 55%),
    radial-gradient(circle at 85% 90%, var(--vinho) 0%, transparent 55%),
    var(--ameixa);
  font-family: 'Quicksand', system-ui, sans-serif;
}

/* Fundo flutuante */
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
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.35));
}

.coracao:nth-child(even) {
  color: #b455f0;
}

/* Emojis ganham um leve drop-shadow colorido */
.coracao--morango {
  filter: drop-shadow(0 0 10px rgba(225, 29, 72, 0.5));
}

.coracao--limao {
  filter: drop-shadow(0 0 10px rgba(234, 179, 8, 0.5));
}

@keyframes subir {
  0% {
    transform: translateY(0) rotate(-8deg);
    opacity: 0;
  }
  10% {
    opacity: 0.35;
  }
  90% {
    opacity: 0.25;
  }
  100% {
    transform: translateY(-110vh) rotate(10deg);
    opacity: 0;
  }
}

/* Cartão central */
.carta {
  position: relative;
  width: min(100%, 460px);
  padding: 56px 40px 44px;
  border: 1px solid rgba(255, 179, 193, 0.28);
  border-radius: 28px;
  background:
    radial-gradient(circle at 10% 10%, rgba(225, 29, 72, 0.15), transparent 55%),
    radial-gradient(circle at 90% 90%, rgba(234, 179, 8, 0.12), transparent 55%),
    rgba(255, 240, 243, 0.07);
  backdrop-filter: blur(10px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  text-align: center;
  overflow: hidden;
  z-index: 1;
}

/* Fita decorativa no topo (morango → limão) */
.carta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(
    90deg,
    #e11d48, #ff4d6d, #ffb3c1, #fef08a, #facc15, #eab308
  );
}

/* Cantos decorados com emojis */
.carta__decanto {
  position: absolute;
  font-size: 1.6rem;
  line-height: 1;
  pointer-events: none;
  opacity: 0.85;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
  animation: flutuarCanto 4s ease-in-out infinite;
}

.carta__decanto--tl { top: 16px; left: 18px; animation-delay: 0s; }
.carta__decanto--tr { top: 16px; right: 18px; animation-delay: 1s; }
.carta__decanto--bl { bottom: 16px; left: 18px; animation-delay: 2s; }
.carta__decanto--br { bottom: 16px; right: 18px; animation-delay: 3s; }

@keyframes flutuarCanto {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-4px) rotate(6deg); }
}

.carta__titulo {
  margin: 0 0 16px;
  font-family: 'Pinyon Script', cursive;
  font-size: clamp(2.6rem, 9vw, 3.6rem);
  font-weight: 400;
  line-height: 1.1;
  color: var(--creme);
  text-shadow:
    0 0 28px rgba(225, 29, 72, 0.5),
    0 0 48px rgba(234, 179, 8, 0.25);
}

/* Divisor decorativo com morango e limão */
.carta__divisor {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 0 20px;
}

.carta__divisor-emoji {
  font-size: 1.1rem;
  line-height: 1;
  filter: drop-shadow(0 0 8px rgba(225, 29, 72, 0.45));
}

.carta__divisor-linha {
  display: inline-block;
  height: 1px;
  width: 28px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 179, 193, 0.6),
    transparent
  );
}

.carta__texto {
  margin: 0 0 28px;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 240, 243, 0.8);
}

.carta__form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

/* Campos */
.carta__form :deep(.q-field--outlined .q-field__control) {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
}

.carta__form :deep(.q-field--outlined .q-field__control:before) {
  border-color: rgba(255, 179, 193, 0.45);
}

.carta__form :deep(.q-field--outlined:hover .q-field__control:before) {
  border-color: var(--rosa);
}

.carta__form :deep(.q-field--focused .q-field__control:after) {
  border-color: #ff4d6d;
  border-width: 2px;
}

/* Emoji no final do input */
.campo-emoji {
  font-size: 1.15rem;
  line-height: 1;
  opacity: 0.9;
  filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.carta__form :deep(.q-field--focused) .campo-emoji {
  transform: scale(1.15) rotate(8deg);
}

/* Botão */
.carta__form .carta__botao {
  margin-top: 12px;
  width: 100%;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(135deg, #e11d48 0%, #9d174d 45%, #7e22ce 100%);
  box-shadow: 0 12px 30px rgba(225, 29, 72, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.carta__form .carta__botao:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 30px rgba(225, 29, 72, 0.45),
    0 0 30px rgba(234, 179, 8, 0.25);
}

.carta__form .carta__botao:focus-visible {
  outline: 3px solid var(--rosa);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .coracao {
    animation: none;
    opacity: 0.2;
    bottom: 20%;
  }

  .carta__decanto {
    animation: none;
  }
}
</style>