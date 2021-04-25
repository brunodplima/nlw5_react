import { useContext } from 'react';
import Image from 'next/image';

import { PlayerContext } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';

export function Player() {
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
  } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode && styles.empty}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            <div className={styles.emptySlider}/>
          </div>
          <span>00:00</span>
        </div>

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}><img src="/shuffle.svg" alt="Aleatório"/></button>
          <button type="button" disabled={!episode}><img src="/play-previous.svg" alt="Anterior"/></button>
          <button type="button" disabled={!episode} className={styles.playButton} onClick={() => togglePlay()}>
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar"/>
            ) : (
              <img src="/play.svg" alt="Reproduzir"/>
            )}
          </button>
          <button type="button" disabled={!episode}><img src="/play-next.svg" alt="Próxima"/></button>
          <button type="button" disabled={!episode}><img src="/repeat.svg" alt="Repetir"/></button>
        </div>
      </footer>
    </div>
  );
}
