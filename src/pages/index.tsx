import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { api } from '../services/api';
import { convertSecondsToTimeString } from '../utils/convertSecondsToTimeString';
import { convertIsoDateToLocalizedString } from '../utils/convertIsoDateToLocalizedString';

import styles from './home.module.scss';
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  url: string;
  durationString: string;
  duration: number;
}

type HomeProps = {
  latestEpisodes: Episode[];
  previousEpisodes: Episode[];
}

export default function Home({ latestEpisodes, previousEpisodes }: HomeProps) {
  const { play } = useContext(PlayerContext);

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationString}</span>
              </div>

              <button type="button" onClick={() => play(episode)}>
                <img src="/play-green.svg" alt="Tocar episódio"/>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.previousEpisodes}>
        <h2>Episódios anteriores</h2>

        <table cellSpacing={0}>
          <thead>
          <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {previousEpisodes.map(episode => (
            <tr key={episode.id}>
              <td style={{ width: 72 }}>
                <Image
                  width={120}
                  height={120}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />
              </td>
              <td>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
              </td>
              <td>{episode.members}</td>
              <td style={{ width: 100 }}>{episode.publishedAt}</td>
              <td>{episode.durationString}</td>
              <td>
                <button type="button" onClick={() => play(episode)}>
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  const episodes = data.map(episode => ({
    id: episode.id,
    title: episode.title,
    members: episode.members,
    publishedAt: convertIsoDateToLocalizedString(episode.published_at),
    thumbnail: episode.thumbnail,
    description: episode.description,
    url: episode.file.url,
    durationString: convertSecondsToTimeString(episode.file.duration),
    duration: episode.file.duration,
  }));

  return {
    props: {
      latestEpisodes: episodes.slice(0, 2),
      previousEpisodes: episodes.slice(2, episodes.length),
    },
    revalidate: 3600 * 8,
  }
}
